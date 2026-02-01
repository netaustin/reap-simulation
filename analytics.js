// Analytics tracking for REAP simulation
// Minimal integration - only prompts for name when session parameter exists

const ANALYTICS_CONFIG = {
    apiUrl: (typeof REAP_CONFIG !== 'undefined' && REAP_CONFIG.apiUrl) || 'http://localhost:5847/api',
    healthCheckTimeout: 3000
};

// Signal to reap.js to wait for analytics before starting
window.analyticsWillStart = !!new URLSearchParams(window.location.search).get('session');

let serverAvailable = false;
let sessionId = null;
let playerName = null;

// Cookie helpers
function setCookie(name, value, days = 365) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return decodeURIComponent(parts.pop().split(';').shift());
    return null;
}

// Get session-specific cookie name for player name
function getPlayerNameCookieKey(session) {
    // Sanitize session ID for cookie name (remove special chars)
    const sanitized = session.replace(/[^a-zA-Z0-9]/g, '_');
    return `reap_player_${sanitized}`;
}

// Get session from URL
function getSessionFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('session');
}

// Check server availability
async function checkServer() {
    try {
        const controller = new AbortController();
        setTimeout(() => controller.abort(), ANALYTICS_CONFIG.healthCheckTimeout);
        const response = await fetch(`${ANALYTICS_CONFIG.apiUrl.replace('/api', '')}/health`, {
            signal: controller.signal
        });
        return response.ok;
    } catch (e) {
        return false;
    }
}

// Initialize
async function initAnalytics() {
    const urlSession = getSessionFromUrl();

    serverAvailable = await checkServer();

    if (!serverAvailable) {
        // No server - just start game normally
        if (window.startGame) window.startGame();
        return;
    }

    // Check for session parameter
    if (urlSession) {
        // Verify session exists on server
        try {
            const sessionRes = await fetch(`${ANALYTICS_CONFIG.apiUrl}/sessions/${encodeURIComponent(urlSession)}`);
            if (!sessionRes.ok) {
                showSessionError(urlSession);
                return;
            }
        } catch (e) {
            // Server unreachable — let them play anyway
        }

        // Managed session - set cookie and ask for name
        sessionId = urlSession;
        setCookie('reap_session', urlSession);

        // Check if returning user for THIS session
        const nameKey = getPlayerNameCookieKey(urlSession);
        const existingName = getCookie(nameKey);
        if (existingName) {
            // Verify player actually has data on the server (session may have been deleted/recreated)
            try {
                const checkRes = await fetch(`${ANALYTICS_CONFIG.apiUrl}/states/latest?session=${encodeURIComponent(urlSession)}&name=${encodeURIComponent(existingName)}`);
                if (checkRes.ok) {
                    // Player has saved data — resume directly
                    playerName = existingName;
                    showNameIndicator(existingName);
                    if (window.startGame) window.startGame();
                    startPausePolling();
                } else {
                    // No data found — session was likely deleted, clear stale cookie
                    setCookie(nameKey, '', -1);
                    showNamePrompt('');
                }
            } catch (e) {
                // Server error — show prompt with pre-fill as fallback
                showNamePrompt(existingName);
            }
        } else {
            showNamePrompt('');
        }
    } else {
        // No session param - self-directed anonymous tracking, start immediately
        sessionId = 'SELF-DIRECTED';
        playerName = 'Anonymous';
        if (window.startGame) window.startGame();
    }
}

// Show error when session doesn't exist
function showSessionError(sessionName) {
    const modal = document.getElementById('student-modal');
    if (modal) {
        document.getElementById('student-form').style.display = 'none';
        document.getElementById('resume-options').style.display = 'none';
        var content = modal.querySelector('.modal-content');
        if (content) {
            content.querySelector('h2').textContent = 'Session Not Found';
            content.querySelector('p').innerHTML = 'The session "<strong>' + sessionName + '</strong>" does not exist. Please check with your instructor that the session name is correct.' +
                '<br><br><a href="' + window.location.pathname + '" style="color: #3498db;">Or play on your own without a class session &rarr;</a>';
        }
        modal.style.display = 'block';
    }
}

// Show simple name prompt, optionally pre-filled
function showNamePrompt(prefill) {
    const modal = document.getElementById('student-modal');
    if (modal) {
        document.getElementById('student-form').style.display = 'block';
        document.getElementById('resume-options').style.display = 'none';
        const emailField = document.getElementById('student-email');
        if (emailField) emailField.style.display = 'none';
        const nameInput = document.getElementById('student-name');
        if (nameInput && prefill) nameInput.value = prefill;
        modal.style.display = 'block';
    }
}

// Submit name
function submitStudentInfo() {
    const nameInput = document.getElementById('student-name');
    const name = nameInput ? nameInput.value.trim() : '';

    if (!name) {
        const errorDiv = document.getElementById('form-error');
        if (errorDiv) errorDiv.textContent = 'Please enter your name';
        return;
    }

    playerName = name;

    // Save name for this specific session
    if (sessionId && sessionId !== 'SELF-DIRECTED') {
        const nameKey = getPlayerNameCookieKey(sessionId);
        setCookie(nameKey, name);
    }

    const modal = document.getElementById('student-modal');
    if (modal) modal.style.display = 'none';

    // Show name indicator
    showNameIndicator(name);

    if (window.startGame) window.startGame();
    startPausePolling();
}

// Show name indicator bar
function showNameIndicator(name) {
    const bar = document.getElementById('player-name-bar');
    const display = document.getElementById('player-name-display');
    if (bar && display) {
        display.textContent = name;
        bar.style.display = 'block';
    }
}

// Save state to server (called on clock tick)
async function saveGameState(gameState) {
    if (!serverAvailable || !sessionId) return;

    try {
        await fetch(`${ANALYTICS_CONFIG.apiUrl}/states`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                session: sessionId,
                name: playerName || 'Anonymous',
                state: gameState
            })
        });
    } catch (e) {
        // Silent fail
    }
}

// Check if session is paused
async function checkPauseStatus() {
    if (!serverAvailable || !sessionId || sessionId === 'SELF-DIRECTED') return;

    try {
        const response = await fetch(`${ANALYTICS_CONFIG.apiUrl}/sessions/${encodeURIComponent(sessionId)}/status`);
        if (response.ok) {
            const data = await response.json();
            const overlay = document.getElementById('pause-overlay');
            if (overlay) {
                if (data.paused) {
                    overlay.style.display = 'flex';
                } else {
                    overlay.style.display = 'none';
                }
            }
        }
    } catch (e) {
        // Silent fail
    }
}

// Start pause status polling after game starts
function startPausePolling() {
    // Check every 2 seconds
    setInterval(checkPauseStatus, 2000);
    // Also check immediately
    checkPauseStatus();
}

// Initialize on load
document.addEventListener('DOMContentLoaded', initAnalytics);

// Exports
window.submitStudentInfo = submitStudentInfo;
window.saveGameState = saveGameState;
window.startPausePolling = startPausePolling;
