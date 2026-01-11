# Analytics Testing Guide

This guide will help you test the analytics implementation.

## Pre-Testing Setup

### 1. Start the Backend

The backend server lives in a separate repository: [reap-sim-dashboard](https://github.com/netaustin/reap-sim-dashboard)

```bash
# Clone the server repo (if not already)
git clone git@github.com:netaustin/reap-sim-dashboard.git
cd reap-sim-dashboard

# Start the server
./start-analytics.sh

# Or manually:
docker-compose up -d
sleep 10
docker-compose exec flask flask init-db
```

### 2. Start the Frontend Server

From this repository:

```bash
python3 -m http.server 8000
```

Now you can access:
- Instructor Dashboard: http://localhost:8000/dashboard.html
- Student Simulation: http://localhost:8000/sim.html
- API Health: http://localhost:5847/health

## Test Scenarios

### Test 1: Create a Managed Session

**Objective**: Verify instructors can create sessions and get shareable links.

1. Open http://localhost:8000/dashboard.html
2. Enter a session name: `TEST-SESSION-2026`
3. Click "Create Session"

**Expected Results**:
- Session appears in the list
- Session card shows student link, dashboard link, instructor link
- All links are copyable

### Test 2: Student Registration (Managed Session)

**Objective**: Verify students can join a session and register.

1. From the dashboard, copy the student link for your test session
2. Open that link in a new browser tab/window (or incognito mode)
3. You should see a modal asking for your name
4. Enter a name and click "Join Session"

**Expected Results**:
- Modal appears on page load
- After submitting, modal closes
- Game starts normally
- Player name appears in the name bar at top
- Check browser console - should see "Game state saved successfully"

### Test 3: Verify State Tracking

**Objective**: Ensure game state is being saved to the backend.

1. In the simulation from Test 2, play for a few minutes
2. Move around the map, interact with locations
3. Wait at least 5 seconds after each action
4. Open browser DevTools (F12) → Network tab
5. Look for POST requests to `http://localhost:5847/api/states`

**Expected Results**:
- POST requests appear after state changes
- Response status is 200/201
- No errors in console

### Test 4: View Session Analytics

**Objective**: Verify instructor can see student progress.

1. Go back to the dashboard (http://localhost:8000/dashboard.html)
2. Click the dashboard link for your test session
3. Wait for stats to load

**Expected Results**:
- Total players count is correct
- Player stats show time, money, health, arrests, violations
- Stats refresh automatically every 5 seconds

### Test 5: Timer Controls

**Objective**: Verify timer start/pause/resume functionality.

1. From the dashboard session view, click "Start Timer"
2. Watch the elapsed time count up
3. Click "Pause" - timer should stop
4. Click "Resume" - timer should continue from where it left off

**Expected Results**:
- Timer displays correctly
- Pause stops the timer
- Resume continues without losing time
- Refresh page - timer state persists

### Test 6: Student Pause Overlay

**Objective**: Verify students see pause overlay when instructor pauses.

1. Have a student simulation open
2. From instructor view, pause the session
3. Student should see a pause overlay

**Expected Results**:
- Overlay appears within 2 seconds of pause
- Overlay shows "Session Paused" message
- When resumed, overlay disappears
- Game continues normally

### Test 7: Multiple Students

**Objective**: Test with multiple students in the same session.

1. Copy the session link
2. Open in 2-3 different browsers or incognito windows
3. Register as different students
4. Play each simulation with different strategies
5. Check the dashboard/instructor view

**Expected Results**:
- Dashboard shows correct player count
- All players appear in the list
- Each player's progress is tracked separately

### Test 8: Self-Directed Mode

**Objective**: Verify students can play without a session link.

1. Open http://localhost:8000/sim.html (no session parameter)
2. Game should start without name prompt

**Expected Results**:
- No modal appears
- Game starts immediately
- State is still saved to backend
- In dashboard, "Self-Directed" section shows aggregate data

### Test 9: Instructor View Details

**Objective**: Test the student detail modal.

1. Open the instructor view for a session with players
2. Click on a player card

**Expected Results**:
- Modal opens showing full player details
- Backpack contents are displayed
- All stats are visible
- Modal can be closed

### Test 10: Session-Specific Names

**Objective**: Verify player names are tracked per-session.

1. Join Session A as "Alice"
2. In same browser, join Session B
3. Should be prompted for name again
4. Enter "Bob"

**Expected Results**:
- Each session prompts for name independently
- Returning to Session A shows "Alice"
- Returning to Session B shows "Bob"
- Different cookies for each session

## API Testing

Use curl to test endpoints directly:

```bash
# Health check
curl http://localhost:5847/health

# Get all sessions
curl http://localhost:5847/api/sessions

# Get specific session
curl http://localhost:5847/api/sessions/TEST-SESSION-2026

# Get session states
curl http://localhost:5847/api/states/TEST-SESSION-2026

# Get session analytics
curl http://localhost:5847/api/analytics/TEST-SESSION-2026
```

## Database Inspection

To inspect the database directly:

```bash
# From the server repo directory
docker-compose exec postgres psql -U reap_user -d reap_analytics

# Run queries
SELECT * FROM sessions;
SELECT * FROM game_states;
SELECT COUNT(*) FROM game_states;
```

## Cleanup

After testing:

```bash
# Stop frontend server
# Ctrl+C in the terminal running python3 -m http.server

# Stop backend (from server repo)
docker-compose down

# Remove all data
docker-compose down -v
```

## Test Checklist

- [ ] Backend starts successfully
- [ ] Database initializes
- [ ] Can create sessions
- [ ] Students can join and enter name
- [ ] Game state saves automatically
- [ ] Dashboard shows correct stats
- [ ] Timer start/pause/resume works
- [ ] Pause overlay appears for students
- [ ] Multiple students tracked separately
- [ ] Self-directed mode works
- [ ] Session-specific names work
- [ ] Instructor view shows details
- [ ] All API endpoints respond
- [ ] Data persists after restart

## Success Criteria

All tests pass when:
1. Sessions can be created and managed
2. Students can join and play
3. State automatically saves
4. Analytics accurately reflect progress
5. Timer controls work correctly
6. No errors in browser console or server logs
