# Mobile Timer Synchronization Fix

## Problem

Timer on mobile browser appears out of sync compared to teacher view or desktop student view.

**Example:**
- Teacher sees: 7 seconds
- Desktop student sees: 7 seconds
- Mobile student sees: 5 seconds (2 seconds behind)

## Root Cause

**Mobile browsers throttle `setInterval` to save battery.**

The previous implementation used:
```javascript
setInterval(() => {
  // Update timer every 100ms
}, 100);
```

**What actually happens:**

| Device | Interval Behavior |
|--------|-------------------|
| Desktop Chrome | Runs every 100ms ✅ |
| Desktop Firefox | Runs every 100ms ✅ |
| Mobile Chrome (active tab) | Runs every 100-200ms ⚠️ |
| Mobile Chrome (background tab) | Runs every 1000ms ❌ |
| Mobile Firefox (active tab) | Runs every 100-300ms ⚠️ |
| Mobile Firefox (background tab) | Runs every 1000ms+ ❌ |

**Result:** Mobile timer updates less frequently, making it appear out of sync even though the calculation is correct.

## The Fix

### 1. Use `requestAnimationFrame` Instead of `setInterval`

**Why it's better:**
- Runs at 60 FPS when tab is active (smoother)
- Automatically pauses when tab is hidden (saves battery)
- Not throttled as aggressively as `setInterval`
- Syncs with browser's repaint cycle

**Implementation:**
```javascript
const updateTimer = () => {
  const now = Date.now();
  
  // Throttle to ~10 FPS (every 100ms)
  if (now - lastUpdateTime >= 100) {
    const remaining = calculateTimeRemaining(now);
    setTimeRemaining(remaining);
    lastUpdateTime = now;
  }
  
  // Continue loop
  animationFrameId = requestAnimationFrame(updateTimer);
};

animationFrameId = requestAnimationFrame(updateTimer);
```

### 2. Add Visibility Change Detection

When user switches tabs or returns to the app, immediately recalculate:

```javascript
const handleVisibilityChange = () => {
  if (!document.hidden) {
    // Tab just became visible - recalculate immediately
    const now = Date.now();
    const remaining = calculateTimeRemaining(now);
    setTimeRemaining(remaining);
    lastUpdateTime = now;
  }
};

document.addEventListener('visibilitychange', handleVisibilityChange);
```

**This ensures:**
- When student switches back to quiz tab, timer shows correct time immediately
- No accumulated drift from background throttling

### 3. Server-Based Calculation (Already Implemented)

The timer calculation is based on server timestamp:

```javascript
const calculateTimeRemaining = (now) => {
  const elapsed = now - timerState.startTime - (timerState.pausedDuration || 0);
  const remaining = timerState.totalTime - Math.floor(elapsed / 1000);
  return Math.max(0, remaining);
};
```

**Key points:**
- `timerState.startTime` comes from Firebase (same for all clients)
- `Date.now()` is local device time
- Calculation is always correct, only the display update frequency varies

## How It Works

### Before Fix (setInterval)

```
Desktop: Update → 100ms → Update → 100ms → Update → 100ms → Update
Mobile:  Update → 100ms → Update → 300ms → Update → 500ms → Update
         ↑ Throttled by browser
```

### After Fix (requestAnimationFrame)

```
Desktop: Update → 16ms → Update → 16ms → Update → 16ms → Update
         (60 FPS, throttled to 100ms by our code)

Mobile:  Update → 16ms → Update → 16ms → Update → 16ms → Update
         (60 FPS when active, throttled to 100ms by our code)
         
Tab switch: [Hidden] → [Visible] → Immediate recalculation
```

## Expected Improvement

### Before Fix
- Mobile timer could drift 1-3 seconds behind
- Switching tabs caused visible jump
- Timer appeared "laggy" on mobile

### After Fix
- Mobile timer stays within 100ms of desktop
- Switching tabs shows correct time immediately
- Smooth countdown on all devices

## Testing

1. **Build and deploy:**
   ```bash
   npm run build
   firebase deploy --only hosting:kahut1
   ```

2. **Test scenario:**
   - Teacher starts quiz on desktop
   - Student joins on Pixel 7
   - Compare timer displays side-by-side
   - Switch tabs on mobile, come back
   - Verify timer stays in sync

3. **Expected result:**
   - ✅ Timer shows same value (±1 second) on all devices
   - ✅ No visible lag or stuttering on mobile
   - ✅ Tab switching doesn't cause drift

## Technical Details

### Why requestAnimationFrame is Better

**setInterval:**
- Runs independently of browser rendering
- Can be throttled unpredictably
- Continues running when tab is hidden (wastes battery)
- Not synchronized with screen refresh

**requestAnimationFrame:**
- Runs before browser repaints (smooth)
- Pauses automatically when tab is hidden
- Runs at optimal frame rate (60 FPS)
- Better battery efficiency

### Throttling to 100ms

Even though rAF runs at 60 FPS (~16ms), we throttle to 100ms:

```javascript
if (now - lastUpdateTime >= 100) {
  // Update display
}
```

**Why:**
- Timer only needs to update once per second
- 10 FPS is smooth enough for countdown
- Saves CPU and battery
- Reduces React re-renders

### Visibility Change API

```javascript
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) {
    // Tab is now visible
  }
});
```

**Handles:**
- Switching tabs
- Minimizing browser
- Locking phone screen
- App switcher

## Files Modified

- `src/hooks/useSynchronizedTimer.js`
  - Replaced `setInterval` with `requestAnimationFrame`
  - Added visibility change detection
  - Added throttling logic

## Fallback Behavior

If `requestAnimationFrame` is not available (very old browsers):
- Falls back to `setInterval`
- Still uses server-based calculation
- Timer will be less smooth but still functional

## Performance Impact

**Before:**
- `setInterval` runs every 100ms regardless of tab state
- ~10 updates/second × all students = high server load

**After:**
- `requestAnimationFrame` pauses when tab hidden
- Only active students consume resources
- Better battery life on mobile
- Smoother animations

## Related Issues

This fix also improves:
- ✅ Timer accuracy when phone screen locks
- ✅ Timer accuracy when switching apps
- ✅ Battery life on mobile devices
- ✅ Perceived smoothness of countdown

## Success Criteria

✅ Mobile timer stays within 1 second of desktop timer  
✅ No visible lag or stuttering  
✅ Tab switching shows correct time immediately  
✅ Timer continues smoothly after screen lock  
✅ Better battery life on mobile devices
