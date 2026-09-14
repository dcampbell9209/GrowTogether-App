# 📱 GrowTogether App Screens

This document describes what you'll see when you run the app.

## 🔐 Authentication Flow

### 1. Login Screen (`/(auth)/login`)
**What you'll see:**
- "Welcome to GrowTogether" header
- Email input field
- Password input field
- "Sign In" button
- "OR" divider
- "Sign In with Google" button
- "Don't have an account? Sign Up" link

**Currently:**
- UI is fully functional
- Buttons show loading states when clicked
- Form validation displays error messages
- Uses mock authentication (no real backend connection yet)

### 2. Signup Screen (`/(auth)/signup`)
**What you'll see:**
- "Create Account" header
- First Name and Last Name inputs
- Email input
- Password and Confirm Password inputs
- Role selection (Student / Volunteer) radio buttons
- "Create Account" button
- "Already have an account? Sign In" link

**Currently:**
- Full form validation (password matching, required fields, etc.)
- Role selection for student or volunteer
- Mock signup process

---

## 🏠 Main App (After Login)

### Tab Navigation
You'll see **4 tabs** at the bottom:
1. 📊 **Dashboard** - Home screen with overview
2. 💬 **Chats** - Messages and conversations
3. 👤 **Profile** - User profile
4. ⚙️ **Settings** - App settings

---

## 📊 Dashboard Screen (`/(tabs)/dashboard`)

### For Students:
**What you'll see:**
- Welcome message with your name
- "Find a tutor to help you succeed" subtitle
- "Dashboard Coming Soon" card
- Quick Stats showing:
  - 0 Tutors
  - 0 Messages
  - 0 Sessions

### For Volunteers:
**What you'll see:**
- Welcome message with your name
- "Ready to help students today?" subtitle
- "Dashboard Coming Soon" card
- Quick Stats showing:
  - 0 Students
  - 0 Messages
  - 0 Sessions

**Currently:**
- Static placeholder content
- Stats are hardcoded to 0
- Ready for real data integration

---

## 💬 Chat Screens

### Chat List (`/(tabs)/chats/index`)
**What you'll see:**
- "Messages" header
- "No messages yet" empty state card
- Message: "Start a conversation with a tutor or student to begin chatting."

**Currently:**
- Empty state placeholder
- Ready for chat list integration

### Individual Chat (`/(tabs)/chats/[id]`)
**What you'll see:**
- "Chat" header with back button
- "Chat #[id]" card
- "Chat interface coming soon..." message

**Currently:**
- Dynamic route (takes chat ID from URL)
- Placeholder for chat interface

---

## 👤 Profile Screen (`/(tabs)/profile`)

**What you'll see:**
- Large avatar circle with your initials
- Your full name
- Your role badge (Student/Volunteer/Admin)
- "Account Information" card:
  - Email address
  - Phone (currently "Not set")

### For Students:
- Additional "Student Profile" card:
  - Grade (currently "Not set")
  - School (currently "Not set")

### For Volunteers:
- Additional "Volunteer Profile" card:
  - Subjects (currently "Not set")
  - Availability (currently "Not set")

**Features:**
- Color-coded avatar based on role:
  - 🔵 Blue for Students
  - 🟢 Green for Volunteers
  - 🔴 Red for Admins
- "Edit Profile" button (currently non-functional)

---

## ⚙️ Settings Screen (`/(tabs)/settings`)

**What you'll see:**
- "Settings" header
- **Account Section:**
  - Edit Profile
  - Change Password
- **Preferences Section:**
  - Notifications
  - Privacy
- **Support Section:**
  - Help & FAQ
  - About
- Red "Sign Out" button at bottom

**Currently:**
- All items are clickable but lead to placeholders
- Sign Out button shows confirmation dialog
- Full UI structure in place

---

## 🔧 Admin Panel (`/(admin)/panel`)

**Only accessible if your user role is "admin"**

**What you'll see:**
- "Admin Panel" header
- Welcome message
- "System Overview" card with stats:
  - 0 Total Users
  - 0 Active Chats
  - 0 Reports
- "Quick Actions" card with buttons:
  - Manage Users
  - View Chat Oversight
  - Review Reports
- Red "Sign Out" button

**Currently:**
- Admin-only route (automatically redirected here if you're admin)
- Static stats (0 for all)
- Placeholder for real admin features

---

## 📝 Onboarding Screens

### Student Quiz (`/(auth)/onboarding/quiz`)
**What you'll see:**
- "Student Quiz" header
- "Quiz Coming Soon" card
- Message: "Complete this quiz to help us match you with the perfect tutor."

### Volunteer Setup (`/(auth)/onboarding/volunteer-setup`)
**What you'll see:**
- "Volunteer Setup" header
- "Setup Coming Soon" card
- Message: "Set up your volunteer profile to start helping students."

**Currently:**
- Placeholder screens
- Ready for full onboarding implementation

---

## ❓ 404 Page (`/+not-found`)

**What you'll see:**
- Large "404" text
- "Page Not Found" message
- "The page you're looking for doesn't exist."
- "Go Home" button to return to main app

---

## 🎨 Design Features

### Colors
- **Primary (Blue)**: `#2196F3` - Used for primary actions, links
- **Student Role**: Blue accents
- **Volunteer Role**: Green accents
- **Admin Role**: Red accents

### Typography
- Material Design 3 typography scale
- Headlines: Large, bold
- Body text: Clear, readable
- Consistent spacing throughout

### Components
- Material Design 3 cards for content
- Rounded buttons with proper states
- Clean, modern layout
- Safe area handling for notches/home indicators

---

## 🔄 Navigation Flow

```
App Launch
    ↓
Loading Screen ("Initializing...")
    ↓
Check Authentication
    ↓
├─ Not Logged In → Login Screen
│       ↓
│   ┌─ Sign In Success
│   │       ↓
│   └─→ Dashboard
│
└─ Logged In
    ├─ Admin → Admin Panel
    └─ User → Dashboard (with tabs)
            ├─ Dashboard Tab
            ├─ Chats Tab
            ├─ Profile Tab
            └─ Settings Tab
```

---

## 📱 How to Navigate

1. **Open Expo Go** and scan the QR code
2. You'll see the **Login Screen** first
3. Click **"Don't have an account? Sign Up"** to create a test account
4. Choose **Student** or **Volunteer** role
5. After signup, you'll be redirected to the **Dashboard**
6. Use the **bottom tabs** to navigate between screens
7. Tap **Settings → Sign Out** to return to login

---

## 🎯 What's Working vs. Coming Soon

### ✅ Working Now
- All navigation
- UI for all screens
- Form inputs and validation
- Tab switching
- Role-based routing
- Error boundaries
- Loading states

### 🚧 Coming Soon
- Real authentication with Supabase
- Actual data loading
- Real-time chat messages
- Volunteer matching
- Profile editing
- Push notifications
- Admin user management

---

## 🐛 Known Limitations

1. **Mock Authentication**: Login/signup don't connect to a real backend yet
2. **Static Data**: All stats and lists show placeholder data
3. **Non-functional Buttons**: Some buttons show placeholders
4. **No Real Chat**: Chat screens are UI only
5. **Profile Editing**: Edit buttons don't open forms yet

These are **intentional** - the foundation is built and ready for feature implementation!

---

**Next:** Start the app and explore! All the UI is working perfectly. 🎉


