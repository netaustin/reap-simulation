# Analytics Implementation Summary

## Overview

The REAP simulation now includes a complete analytics system for tracking student progress in classroom settings. The system is split across two repositories:

- **This repo (Frontend)**: Game interface, instructor dashboards, analytics client
- **[reap-sim-dashboard](https://github.com/netaustin/reap-sim-dashboard)**: Backend API server

## Frontend Components

### Analytics Client (`analytics.js`)
Handles all communication with the backend API:
- Session detection from URL parameters
- Player name prompts for managed sessions
- Per-session cookie tracking
- Automatic state saving every 5 seconds
- Pause detection and overlay display

### Instructor Dashboard (`dashboard.html`, `dashboard.js`)
Main interface for instructors:
- Create and manage sessions
- Copy shareable links (student, dashboard, instructor views)
- Real-time player stats with auto-refresh
- Timer controls (start/pause/resume)
- Self-directed session view

### Instructor View (`instructor.html`)
Detailed classroom facilitation view:
- Player cards with stats overview
- Click to view full backpack contents
- Discussion Helper for cold-calling suggestions
- Adapts for managed vs self-directed sessions

### Facilitator Dashboard (`facilitator.html`, `facilitator.js`)
Advanced analytics for deeper analysis:
- Participation tracking sorted by time spent
- Outlier detection across multiple metrics
- Auto-generated discussion points

### Game Integration (`sim.html`, `reap.js`)
Modified game files to support analytics:
- Name bar showing current player
- Pause overlay when instructor pauses session
- State saving on each game tick
- Integration with analytics.js

## File Structure

```
reap-simulation/
├── config.js           # API URL configuration (edit for production)
├── analytics.js        # Analytics client library
├── dashboard.html      # Main instructor dashboard
├── dashboard.js        # Dashboard logic
├── instructor.html     # Instructor classroom view
├── facilitator.html    # Advanced facilitator dashboard
├── facilitator.js      # Facilitator logic
├── sim.html            # Game page (modified)
├── reap.js             # Game engine (modified)
└── ... (other game files)
```

## How It Works

### Session Flow

1. **Instructor creates session** via dashboard
2. **Shares link** with students: `sim.html?session=SESSION-ID`
3. **Students join** and enter their name
4. **Game state auto-saves** every 5 seconds
5. **Instructor monitors** via dashboard or instructor view
6. **Timer controls** manage classroom pacing

### Player Tracking

- Session-specific cookies store player names
- Cookie key: `reap_player_{SESSION_ID}`
- Allows same browser to have different names per session
- Anonymous tracking for self-directed users

### State Saving

Game state is captured and sent to the API including:
- `playedHours` - Time elapsed in game
- `money` - Current balance
- `health` - Health percentage
- `arrests` - Number of arrests
- `hospitalvisits` - Hospital visits
- `violations` - Parole violations
- `housing` - Current housing status
- `backpack` - Complete inventory/state

## API Configuration

The frontend connects to the backend API via `config.js`. For production deployment, update the URL in one place:

```javascript
// config.js
const REAP_CONFIG = {
    apiUrl: 'https://your-production-server.com/api'
};
```

## Setup

### Prerequisites
1. Backend server running (see [reap-sim-dashboard](https://github.com/netaustin/reap-sim-dashboard))
2. Frontend files served via HTTP (e.g., `python3 -m http.server 8000`)

### Quick Start

```bash
# Start backend (from reap-sim-dashboard repo)
./start-analytics.sh

# Serve frontend (from this repo)
python3 -m http.server 8000

# Open dashboard
open http://localhost:8000/dashboard.html
```

## Session Types

### Managed Sessions
- Custom session IDs (e.g., `PHILLIPS-2026-WHARTON`)
- Players prompted for name
- Full timer controls
- Complete analytics

### Self-Directed
- Automatic for users without session link
- No name prompt (anonymous)
- Session ID: `SELF-DIRECTED`
- Basic tracking only

## Features

- Real-time stats updates (auto-refresh)
- Session timer with pause/resume
- Per-session player name tracking
- Pause overlay for students
- Student detail modal with backpack contents
- Discussion Helper for classroom facilitation
- Support for both managed and anonymous sessions

## Testing

See [TESTING.md](TESTING.md) for complete testing guide.
