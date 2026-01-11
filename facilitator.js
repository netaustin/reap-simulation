// Facilitator Dashboard JavaScript
const API_BASE_URL = (typeof REAP_CONFIG !== 'undefined' && REAP_CONFIG.apiUrl) || 'http://localhost:5847/api';

// Get session UUID from URL
function getSessionUUID() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('session');
}

// Go back to main dashboard
function goBack() {
    const sessionUUID = getSessionUUID();
    if (sessionUUID) {
        window.location.href = `dashboard.html?session=${encodeURIComponent(sessionUUID)}`;
    } else {
        window.location.href = 'dashboard.html';
    }
}

// Render outlier list
function renderOutlierList(containerId, students, valueKey, unit = '', type = '') {
    const container = document.getElementById(containerId);

    if (!students || students.length === 0) {
        container.innerHTML = '<li class="outlier-item">No data available</li>';
        return;
    }

    container.innerHTML = students.map(student => {
        const cssClass = type ? `outlier-item ${type}` : 'outlier-item';
        return `
            <li class="${cssClass}">
                <div class="outlier-name">${student.name || 'Anonymous'}</div>
                ${student.email ? `<div class="outlier-email">${student.email}</div>` : ''}
                <div class="outlier-value">${unit}${student[valueKey]}</div>
            </li>
        `;
    }).join('');
}

// Render participation list
function renderParticipationList(students) {
    const container = document.getElementById('participation-list');

    if (!students || students.length === 0) {
        container.innerHTML = '<li class="participation-item">No students yet</li>';
        return;
    }

    // Sort by time elapsed (descending)
    const sorted = [...students].sort((a, b) => b.time - a.time);

    container.innerHTML = sorted.map(student => {
        const isActive = student.time > 5; // More than 5 hours
        const cssClass = isActive ? 'participation-item active' : 'participation-item inactive';

        return `
            <li class="${cssClass}">
                <div>
                    <strong>${student.name || 'Anonymous'}</strong>
                    ${student.email ? `<div style="font-size: 0.85em; color: #666;">${student.email}</div>` : ''}
                </div>
                <div style="text-align: right;">
                    <strong>${student.time}h</strong>
                    <div style="font-size: 0.85em; color: #666;">
                        ${isActive ? '✓ Active' : '⚠️ Limited'}
                    </div>
                </div>
            </li>
        `;
    }).join('');
}

// Generate discussion points
function generateDiscussionPoints(outliers, analytics) {
    const points = [];

    // Check for high arrest outliers
    if (outliers.most_arrests && outliers.most_arrests.length > 0 && outliers.most_arrests[0].arrests > 0) {
        points.push({
            topic: 'Justice System Interactions',
            question: `Some students experienced arrests. What factors do you think contributed to these encounters?`,
            data: `${outliers.most_arrests.filter(s => s.arrests > 0).length} students had arrests`
        });
    }

    // Check for violations
    if (outliers.most_violations && outliers.most_violations.length > 0 && outliers.most_violations[0].violations > 0) {
        points.push({
            topic: 'Parole Compliance',
            question: 'What challenges make it difficult to avoid violations in the simulation?',
            data: `${outliers.most_violations.filter(s => s.violations > 0).length} students had parole violations`
        });
    }

    // Check for health struggles
    if (outliers.low_health && outliers.low_health.length > 0 && outliers.low_health[0].health < 50) {
        points.push({
            topic: 'Health and Wellbeing',
            question: 'What trade-offs did students face between health, work, and compliance?',
            data: `${outliers.low_health.filter(s => s.health < 50).length} students ended with poor health`
        });
    }

    // Check for financial extremes
    if (outliers.high_money && outliers.low_money) {
        const maxMoney = outliers.high_money[0]?.money || 0;
        const minMoney = outliers.low_money[0]?.money || 0;

        if (maxMoney - minMoney > 100) {
            points.push({
                topic: 'Economic Outcomes',
                question: 'Why did some students end with significantly more money than others?',
                data: `Range: $${minMoney} to $${maxMoney}`
            });
        }
    }

    // Check for time disparities
    if (outliers.high_time && outliers.low_time) {
        const maxTime = outliers.high_time[0]?.time || 0;
        const minTime = outliers.low_time[0]?.time || 0;

        if (maxTime - minTime > 10) {
            points.push({
                topic: 'Strategy and Pacing',
                question: 'How did different strategies affect how long it took to complete requirements?',
                data: `Range: ${minTime}h to ${maxTime}h`
            });
        }
    }

    // General discussion points
    points.push({
        topic: 'System Barriers',
        question: 'What systemic barriers did you encounter that made reentry difficult?',
        data: 'Open discussion'
    });

    points.push({
        topic: 'Intersectionality',
        question: 'How might different identities (race, gender, disability) change the reentry experience?',
        data: 'Open discussion'
    });

    return points;
}

// Render discussion points
function renderDiscussionPoints(points) {
    const container = document.getElementById('discussion-points');

    if (points.length === 0) {
        container.innerHTML = '<p>No specific discussion points generated. Use general facilitation questions.</p>';
        return;
    }

    container.innerHTML = points.map((point, i) => `
        <div style="margin-bottom: 20px; padding: 15px; background: #f9f9f9; border-left: 4px solid #3498db; border-radius: 4px;">
            <h3 style="margin-top: 0; color: #475463;">${i + 1}. ${point.topic}</h3>
            <p style="font-style: italic; color: #666;">"${point.question}"</p>
            <p style="font-size: 0.9em; color: #999;"><strong>Context:</strong> ${point.data}</p>
        </div>
    `).join('');
}

// Load outliers and analytics
async function loadOutliers() {
    const sessionUUID = getSessionUUID();

    if (!sessionUUID) {
        alert('No session specified');
        goBack();
        return;
    }

    try {
        // Load outliers
        const outliersResponse = await fetch(`${API_BASE_URL}/analytics/outliers/${sessionUUID}`);
        if (!outliersResponse.ok) {
            throw new Error('Failed to load outliers');
        }
        const outliers = await outliersResponse.json();

        // Load full analytics for context
        const analyticsResponse = await fetch(`${API_BASE_URL}/analytics/session/${sessionUUID}`);
        if (!analyticsResponse.ok) {
            throw new Error('Failed to load analytics');
        }
        const analytics = await analyticsResponse.json();

        // Update title
        document.getElementById('session-title').textContent = `${analytics.session.name} - Facilitator View`;

        // Render outlier lists
        renderOutlierList('high-time', outliers.high_time, 'time', '', 'high');
        renderOutlierList('low-time', outliers.low_time, 'time', '', 'low');
        renderOutlierList('high-money', outliers.high_money, 'money', '$', 'high');
        renderOutlierList('low-money', outliers.low_money, 'money', '$', 'low');
        renderOutlierList('high-health', outliers.high_health, 'health', '', 'high');
        renderOutlierList('low-health', outliers.low_health, 'health', '', 'low');
        renderOutlierList('most-arrests', outliers.most_arrests, 'arrests', '', 'concern');
        renderOutlierList('most-violations', outliers.most_violations, 'violations', '', 'concern');

        // Render participation list
        renderParticipationList(analytics.students);

        // Generate and render discussion points
        const discussionPoints = generateDiscussionPoints(outliers, analytics);
        renderDiscussionPoints(discussionPoints);

    } catch (error) {
        console.error('Error loading outliers:', error);
        alert('Failed to load facilitator data');
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadOutliers();
});
