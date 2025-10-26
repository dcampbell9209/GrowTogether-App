# 👆 Swipe Navigation Feature

## Overview
Added intuitive swipe gestures for quick navigation between the main screens of the GrowTogether app!

---

## 🎯 How It Works

### Swipe Gestures:

1. **Dashboard → Chats**
   - **Swipe LEFT** on the Dashboard to go to Chats

2. **Chats → Dashboard**
   - **Swipe RIGHT** on the Chats screen to go back to Dashboard

3. **Chats → Volunteer Info**
   - **Swipe LEFT** on the Chats screen to go to Volunteer Info

4. **Volunteer Info → Chats**
   - **Swipe RIGHT** on the Volunteer Info screen to go back to Chats

5. **Volunteer Info → Settings**
   - **Swipe LEFT** on the Volunteer Info screen to go to Settings

6. **Settings → Volunteer Info**
   - **Swipe RIGHT** on the Settings screen to go back to Volunteer Info

---

## 📱 Navigation Flow

```
Dashboard ←→ Chats ←→ Volunteer Info ←→ Settings
    (0)       (1)          (2)            (3)
```

- **Swipe LEFT** = Move forward (right) in navigation
- **Swipe RIGHT** = Move backward (left) in navigation

---

## 🔒 Smart Swipe Restrictions

### ✅ Swipes Work On:
- Dashboard (all role types: student, volunteer, admin)
- Chats list
- Volunteer Info page
- Settings screen

### ❌ Swipes Disabled On:
- **Active chat conversations** (to avoid interfering with scrolling)
- Login screen
- Quiz/onboarding
- Modal dialogs

---

## ⚙️ Technical Details

### Implementation:
- **Technology**: React Native `PanResponder`
- **Threshold**: 50px horizontal swipe distance
- **Detection**: Horizontal swipes only (vertical scrolling unaffected)
- **State Sync**: Automatically updates bottom navigation bar

### Code Location:
```typescript
// app/index.tsx lines 118-158
const panResponder = useRef(
  PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      // Disable swipes when in an active chat
      if (activeChat) return false;
      
      // Only activate for horizontal swipes
      return Math.abs(gestureState.dx) > Math.abs(gestureState.dy) && Math.abs(gestureState.dx) > 20;
    },
    onPanResponderRelease: (evt, gestureState) => {
      const SWIPE_THRESHOLD = 50;
      // ... navigation logic ...
    },
  })
).current;
```

### Applied To:
- All dashboard screens (student, volunteer, admin)
- Chat list screen
- Volunteer info screen

---

## 🎨 User Experience Benefits

1. **Faster Navigation**: Quick swipes instead of tapping bottom bar
2. **Natural Gestures**: Follows iOS/Android swipe conventions
3. **Visual Feedback**: Bottom nav updates to match current screen
4. **No Conflicts**: Disabled in chats to preserve scrolling
5. **Predictable**: Left/right swipes follow screen order

---

## 🧪 Testing

### To Test:
1. **Log in** to any account (student, volunteer, or admin)
2. On the **Dashboard**, swipe **LEFT** → Should navigate to **Chats**
3. On **Chats**, swipe **RIGHT** → Should return to **Dashboard**
4. On **Chats**, swipe **LEFT** → Should navigate to **Volunteer Info**
5. On **Volunteer Info**, swipe **RIGHT** → Should return to **Chats**
6. On **Volunteer Info**, swipe **LEFT** → Should navigate to **Settings**
7. On **Settings**, swipe **RIGHT** → Should return to **Volunteer Info**
8. **Open a chat** → Swipes should be **disabled** (scrolling works)
9. **Close chat** → Swipes should be **enabled** again

### Expected Behavior:
- ✅ Smooth transitions between screens
- ✅ Bottom nav bar updates automatically
- ✅ No interference with vertical scrolling
- ✅ Works consistently across all role types
- ✅ Disabled in active chats

---

## 🔄 Navigation State Management

The swipe system updates two pieces of state:

1. **`currentScreen`**: Changes to the target screen
2. **`bottomNavIndex`**: Updates the bottom navigation bar
   - Dashboard = 0
   - Chats = 1
   - Volunteer Info = 2
   - Settings = 3

This ensures the UI always stays in sync!

---

## 📝 Code Changes Summary

### Files Modified:
- **`app/index.tsx`**

### Lines Changed:
1. **Line 1**: Added `PanResponder` import
2. **Line 3**: Added `useRef` import
3. **Lines 118-158**: Created `panResponder` with swipe logic
4. **Lines 1036, 1211, 1309, 1415, 1653**: Applied `{...panResponder.panHandlers}` to main container Views

### Total Lines Added: ~45 lines
### Breaking Changes: None
### Dependencies Added: None (native React Native API)

---

## 🎉 Result

Users can now navigate between the three main screens using intuitive left/right swipe gestures, making the app feel more native and responsive! The feature automatically disables in contexts where it might interfere (like chat conversations), ensuring a smooth user experience.

**The app now has Instagram/Snapchat-style swipe navigation!** 📲✨

