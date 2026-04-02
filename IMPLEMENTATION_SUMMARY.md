# Analytics Implementation Summary

## Overview

The REAP simulation includes an optional analytics system for tracking student progress in classroom settings. The system is split across two repositories:

- **This repo (Frontend)**: Game interface with analytics tracking client
- **[reap-sim-dashboard](https://github.com/netaustin/reap-sim-dashboard)**: Backend API server and instructor dashboards

## Standalone Compatibility

The simulation works without the analytics server. If the server is unavailable, the game runs normally without tracking. Analytics features activate only when the server is reachable.

## Frontend Components

### Configuration (`config.js`)
Single file to configure the analytics server URL:
```javascript
const REAP_CONFIG = {
    apiUrl: 'http://localhost:5847/api'
};
```

### Analytics Client (`analytics.js`)
Handles all communication with the backend API:
- Session detection from URL parameters
- Player name prompts for managed sessions
- Per-session cookie tracking
- Automatic state saving every 5 seconds
- Pause detection and overlay display

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
├── sim.html            # Game page (modified)
├── reap.js             # Game engine (modified)
└── ... (other game files)
```

## How It Works

### Session Flow

1. **Instructor creates session** via dashboard (on server)
2. **Shares link** with students: `sim.html?session=SESSION-ID`
3. **Students join** and enter their name
4. **Game state auto-saves** every 5 seconds
5. **Instructor monitors** via dashboard on server

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

# Open simulation
open http://localhost:8000/sim.html

# Open dashboard (on server)
open http://localhost:5847/dashboard
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

- Game runs without server (graceful degradation)
- Real-time state tracking
- Session timer with pause/resume
- Per-session player name tracking
- Pause overlay for students
- Support for both managed and anonymous sessions
