// REAP Simulation Dashboard
const API_BASE_URL = (typeof REAP_CONFIG !== 'undefined' && REAP_CONFIG.apiUrl) || 'http://localhost:5847/api';
const BASE_URL = window.location.origin;

let currentSessionId = null;
let currentSession = null;  // Full session object with started_at, paused_at
let timerInterval = null;
let refreshInterval = null;
let sessionsRefreshInterval = null;

// Generate URLs
function getStudentLink(sessionId) {
    return `${BASE_URL}/sim.html?session=${encodeURIComponent(sessionId)}`;
}

function getDashboardLink(sessionId) {
    return `${BASE_URL}/dashboard.html?session=${encodeURIComponent(sessionId)}`;
}

function getInstructorLink(sessionId) {
    return `${BASE_URL}/instructor.html?session=${encodeURIComponent(sessionId)}`;
}

// Copy to clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        // Brief visual feedback could be added here
    });
}

function copyStudentLink() {
    if (currentSessionId) {
        copyToClipboard(getStudentLink(currentSessionId));
        alert('Student link copied!');
    }
}

// Load all sessions with their player counts
async function loadSessions() {
    const grid = document.getElementById('sessions-grid');

    try {
        // Load managed sessions
        const response = await fetch(`${API_BASE_URL}/sessions`);
        if (!response.ok) throw new Error('Failed to load sessions');

        const sessions = await response.json();

        // Also load anonymous player count
        loadAnonymousCount();

        if (sessions.length === 0) {
            grid.innerHTML = '<div class="no-sessions">No sessions yet. Create one above!</div>';
            return;
        }

        // Fetch player counts for each session
        const sessionsWithData = await Promise.all(sessions.map(async (session) => {
            try {
                const analyticsRes = await fetch(`${API_BASE_URL}/analytics/${encodeURIComponent(session.session_id)}`);
                if (analyticsRes.ok) {
                    const data = await analyticsRes.json();
                    return { ...session, playerCount: data.player_count || 0 };
                }
            } catch (e) {}
            return { ...session, playerCount: 0 };
        }));

        grid.innerHTML = sessionsWithData.map(session => {
            const studentLink = getStudentLink(session.session_id);
            const dashboardLink = getDashboardLink(session.session_id);
            const instructorLink = getInstructorLink(session.session_id);
            const created = new Date(session.created_at).toLocaleDateString();

            return `
                <div class="session-card">
                    <div class="session-card-header">
                        <h3>${session.session_id}</h3>
                        <div class="meta">Created ${created}</div>
                    </div>
                    <div class="session-card-body">
                        <div class="session-card-stats">
                            <div class="session-stat">
                                <div class="session-stat-value">${session.playerCount}</div>
                                <div class="session-stat-label">Players</div>
                            </div>
                        </div>
                        <div class="session-card-links">
                            <div class="session-link-row">
                                <span class="session-link-label">Student:</span>
                                <span class="session-link-url">${studentLink}</span>
                                <button onclick="copyToClipboard('${studentLink}'); this.textContent='Copied!'; setTimeout(() => this.textContent='Copy', 1000);">Copy</button>
                            </div>
                            <div class="session-link-row">
                                <span class="session-link-label">Dashboard:</span>
                                <span class="session-link-url">${dashboardLink}</span>
                                <button onclick="copyToClipboard('${dashboardLink}'); this.textContent='Copied!'; setTimeout(() => this.textContent='Copy', 1000);">Copy</button>
                            </div>
                            <div class="session-link-row">
                                <span class="session-link-label">Instructor:</span>
                                <span class="session-link-url">${instructorLink}</span>
                                <button onclick="copyToClipboard('${instructorLink}'); this.textContent='Copied!'; setTimeout(() => this.textContent='Copy', 1000);">Copy</button>
                            </div>
                        </div>
                        <div class="session-card-actions">
                            <button class="btn-primary" onclick="viewSessionStats('${session.session_id}')">View Live Stats</button>
                            <button class="btn-secondary" onclick="window.open('${instructorLink}', '_blank')">Instructor</button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

    } catch (error) {
        console.error('Error loading sessions:', error);
        grid.innerHTML = '<div class="no-sessions">Error loading sessions. Is the server running?</div>';
    }
}

// Create a new session
async function createSession() {
    const input = document.getElementById('session-id-input');
    const sessionId = input.value.trim();

    if (!sessionId) {
        alert('Please enter a session name');
        return;
    }

    // Validate session name format (alphanumeric, dashes, underscores)
    if (!/^[a-zA-Z0-9_-]+$/.test(sessionId)) {
        alert('Session name can only contain letters, numbers, dashes, and underscores');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/sessions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ session_id: sessionId })
        });

        if (!response.ok) {
            const data = await response.json();
            if (data.error === 'Session already exists') {
                // Offer to view the existing session
                if (confirm(`A session named "${sessionId}" already exists.\n\nWould you like to view it?`)) {
                    viewSessionStats(sessionId);
                }
                return;
            }
            throw new Error(data.error || 'Failed to create session');
        }

        input.value = '';
        loadSessions();

        // Optionally open the new session immediately
        if (confirm('Session created! Would you like to view it now?')) {
            viewSessionStats(sessionId);
        }

    } catch (error) {
        console.error('Error creating session:', error);
        alert('Error creating session');
    }
}

// Show sessions list view
function showSessionsList() {
    // Stop any running intervals for stats view
    if (timerInterval) clearInterval(timerInterval);
    if (refreshInterval) clearInterval(refreshInterval);
    timerInterval = null;
    refreshInterval = null;
    currentSessionId = null;
    currentSession = null;

    // Switch views
    document.getElementById('sessions-view').style.display = 'block';
    document.getElementById('stats-view').style.display = 'none';

    // Reset visibility of elements that might have been hidden
    const timerSection = document.getElementById('timer-section');
    const sessionActions = document.getElementById('session-actions');
    const linkBar = document.querySelector('.stats-link-bar');
    if (timerSection) timerSection.style.display = 'flex';
    if (sessionActions) sessionActions.style.display = 'flex';
    if (linkBar) linkBar.style.display = 'flex';

    // Clear URL params
    window.history.replaceState({}, '', window.location.pathname);

    // Load sessions and start auto-refresh
    loadSessions();
    if (sessionsRefreshInterval) clearInterval(sessionsRefreshInterval);
    sessionsRefreshInterval = setInterval(loadSessions, 5000);
}

// View stats for a session
async function viewSessionStats(sessionId) {
    // Stop sessions list refresh
    if (sessionsRefreshInterval) clearInterval(sessionsRefreshInterval);
    sessionsRefreshInterval = null;

    currentSessionId = sessionId;

    // Fetch session details
    try {
        const response = await fetch(`${API_BASE_URL}/sessions/${encodeURIComponent(sessionId)}`);
        if (response.ok) {
            currentSession = await response.json();
        }
    } catch (e) {
        currentSession = null;
    }

    // Update UI
    document.getElementById('sessions-view').style.display = 'none';
    document.getElementById('stats-view').style.display = 'block';

    // Handle self-directed session differently
    const timerSection = document.getElementById('timer-section');
    const sessionActions = document.getElementById('session-actions');
    const linkBar = document.querySelector('.stats-link-bar');

    if (sessionId === 'SELF-DIRECTED') {
        document.getElementById('stats-session-name').textContent = 'Self-Directed Players (Anonymous)';
        if (linkBar) linkBar.style.display = 'none';
        if (timerSection) timerSection.style.display = 'none';
        if (sessionActions) sessionActions.style.display = 'none';
    } else {
        document.getElementById('stats-session-name').textContent = sessionId;
        document.getElementById('active-session-link').textContent = getStudentLink(sessionId);
        if (linkBar) linkBar.style.display = 'flex';
        if (timerSection) timerSection.style.display = 'flex';
        if (sessionActions) sessionActions.style.display = 'flex';
    }

    // Update URL
    window.history.replaceState({}, '', `?session=${encodeURIComponent(sessionId)}`);

    // Update timer display and controls
    updateTimerUI();
    timerInterval = setInterval(updateTimerUI, 1000);

    // Start data refresh
    refreshStats();
    refreshInterval = setInterval(refreshStats, 3000);
}

// Parse UTC datetime string from server
function parseUTC(dateStr) {
    if (!dateStr) return null;
    // Server returns UTC times without 'Z', so append it
    if (!dateStr.endsWith('Z')) {
        dateStr = dateStr + 'Z';
    }
    return new Date(dateStr);
}

// Update timer display based on session state
function updateTimerUI() {
    const timerEl = document.getElementById('timer');
    const statusEl = document.getElementById('timer-status');
    const startBtn = document.getElementById('start-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const resumeBtn = document.getElementById('resume-btn');

    if (!currentSession || !currentSession.started_at) {
        // Not started
        timerEl.textContent = '--:--';
        statusEl.textContent = 'Not Started';
        statusEl.className = 'timer-status';
        startBtn.style.display = 'block';
        pauseBtn.style.display = 'none';
        resumeBtn.style.display = 'none';
        return;
    }

    const startedAt = parseUTC(currentSession.started_at);
    let elapsed;

    if (currentSession.paused && currentSession.paused_at) {
        // Paused - show time at pause
        const pausedAt = parseUTC(currentSession.paused_at);
        elapsed = pausedAt - startedAt;
        statusEl.textContent = 'Paused';
        statusEl.className = 'timer-status paused';
        startBtn.style.display = 'none';
        pauseBtn.style.display = 'none';
        resumeBtn.style.display = 'block';
    } else {
        // Running - show live time
        elapsed = Date.now() - startedAt;
        statusEl.textContent = 'Running';
        statusEl.className = 'timer-status running';
        startBtn.style.display = 'none';
        pauseBtn.style.display = 'block';
        resumeBtn.style.display = 'none';
    }

    // Ensure elapsed is not negative
    if (elapsed < 0) elapsed = 0;

    const totalSeconds = Math.floor(elapsed / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    timerEl.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Timer controls
async function startTimer() {
    if (!currentSessionId) return;
    try {
        const response = await fetch(`${API_BASE_URL}/sessions/${encodeURIComponent(currentSessionId)}/start`, {
            method: 'POST'
        });
        if (response.ok) {
            currentSession = await response.json();
            updateTimerUI();
        }
    } catch (e) {
        console.error('Error starting timer:', e);
    }
}

async function pauseTimer() {
    if (!currentSessionId) return;
    try {
        const response = await fetch(`${API_BASE_URL}/sessions/${encodeURIComponent(currentSessionId)}/pause`, {
            method: 'POST'
        });
        if (response.ok) {
            currentSession = await response.json();
            updateTimerUI();
        }
    } catch (e) {
        console.error('Error pausing timer:', e);
    }
}

async function resumeTimer() {
    if (!currentSessionId) return;
    try {
        const response = await fetch(`${API_BASE_URL}/sessions/${encodeURIComponent(currentSessionId)}/resume`, {
            method: 'POST'
        });
        if (response.ok) {
            currentSession = await response.json();
            updateTimerUI();
        }
    } catch (e) {
        console.error('Error resuming timer:', e);
    }
}

// Refresh stats and session data from server
async function refreshStats() {
    if (!currentSessionId) return;

    try {
        // Refresh session data (for timer)
        const sessionRes = await fetch(`${API_BASE_URL}/sessions/${encodeURIComponent(currentSessionId)}`);
        if (sessionRes.ok) {
            currentSession = await sessionRes.json();
        }

        // Refresh analytics
        const response = await fetch(`${API_BASE_URL}/analytics/${encodeURIComponent(currentSessionId)}`);
        if (!response.ok) return;

        const data = await response.json();
        updateStats(data);
    } catch (error) {
        console.error('Error fetching stats:', error);
    }
}

// Update stats display
function updateStats(data) {
    document.getElementById('stat-players').textContent = data.player_count || 0;

    if (data.aggregates) {
        document.getElementById('stat-avg-money').textContent = `$${Math.round(data.aggregates.avg_money)}`;
        document.getElementById('stat-avg-health').textContent = `${Math.round(data.aggregates.avg_health)}%`;
        document.getElementById('stat-employed').textContent = data.aggregates.employed_count || 0;
        document.getElementById('stat-arrests').textContent = data.aggregates.total_arrests || 0;
        document.getElementById('stat-violations').textContent = data.aggregates.total_violations || 0;
    }

    if (data.housing) {
        renderHousingDist(data.housing, data.player_count);
    }

    if (data.players && data.players.length > 0) {
        renderMoneyDist(data.players);
    }
}

// Render housing distribution
function renderHousingDist(housing, total) {
    const container = document.getElementById('housing-dist');
    if (!total || total === 0) {
        container.innerHTML = '<p style="color: #aaa;">No data yet</p>';
        return;
    }

    const labels = {
        'halfwayhouse': 'Halfway House',
        'heightshousing': 'Apartment',
        'unknown': 'Unhoused'
    };

    let html = '';
    for (const [key, count] of Object.entries(housing)) {
        const pct = (count / total) * 100;
        const label = labels[key] || key;
        html += `
            <div class="distribution">
                <div class="dist-label">
                    <span>${label}</span>
                    <span>${count} (${Math.round(pct)}%)</span>
                </div>
                <div class="dist-bar">
                    <div class="dist-fill" style="width: ${pct}%"></div>
                </div>
            </div>
        `;
    }
    container.innerHTML = html;
}

// Render money distribution
function renderMoneyDist(players) {
    const container = document.getElementById('money-dist');
    if (!players || players.length === 0) {
        container.innerHTML = '<p style="color: #aaa;">No data yet</p>';
        return;
    }

    const buckets = [
        { label: '$0 - $50', min: 0, max: 50, count: 0 },
        { label: '$51 - $100', min: 51, max: 100, count: 0 },
        { label: '$101 - $200', min: 101, max: 200, count: 0 },
        { label: '$201 - $500', min: 201, max: 500, count: 0 },
        { label: '$500+', min: 501, max: Infinity, count: 0 }
    ];

    for (const player of players) {
        const money = player.money || 0;
        for (const bucket of buckets) {
            if (money >= bucket.min && money <= bucket.max) {
                bucket.count++;
                break;
            }
        }
    }

    let html = '';
    for (const bucket of buckets) {
        const pct = (bucket.count / players.length) * 100;
        html += `
            <div class="distribution">
                <div class="dist-label">
                    <span>${bucket.label}</span>
                    <span>${bucket.count}</span>
                </div>
                <div class="dist-bar">
                    <div class="dist-fill" style="width: ${pct}%"></div>
                </div>
            </div>
        `;
    }
    container.innerHTML = html;
}

// Open instructor view
function openInstructorView() {
    if (currentSessionId) {
        window.open(getInstructorLink(currentSessionId), '_blank');
    }
}

// Load anonymous/self-directed player count
async function loadAnonymousCount() {
    try {
        const response = await fetch(`${API_BASE_URL}/analytics/SELF-DIRECTED`);
        if (response.ok) {
            const data = await response.json();
            const count = data.player_count || 0;
            const countEl = document.getElementById('anonymous-count');
            if (countEl) {
                countEl.textContent = `${count} player${count !== 1 ? 's' : ''}`;
            }
        }
    } catch (e) {
        console.error('Error loading anonymous count:', e);
    }
}

// Check URL for session parameter
function checkUrlSession() {
    const urlParams = new URLSearchParams(window.location.search);
    const session = urlParams.get('session');
    if (session) {
        viewSessionStats(session);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('session')) {
        checkUrlSession();
    } else {
        loadSessions();
        // Auto-refresh sessions list every 5 seconds
        sessionsRefreshInterval = setInterval(loadSessions, 5000);
    }
});
