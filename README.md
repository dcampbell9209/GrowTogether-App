# GrowTogether Mobile App 🌱

> A mobile tutoring and mentorship platform that connects students with volunteer tutors within their school district, facilitating peer-to-peer academic support through a secure, admin-moderated environment.

[![Expo](https://img.shields.io/badge/Expo-54-blue.svg)](https://expo.dev/)
[![React Native](https://img.shields.io/badge/React%20Native-0.81-61dafb.svg)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 🚀 Key Features

- 🎯 **Smart Student-Volunteer Matching**: Matches students with compatible volunteer tutors based on subject, grade level, and weekly availability.
- 💬 **In-App Messaging & Media Sharing**: Real-time chat system allowing students and tutors to discuss academic topics and share homework photos.
- 🛡️ **Families Policy Compliant Age Gate**: Neutral age verification gate ensuring child safety and parental controls in accordance with Google Play and COPPA guidelines.
- 📝 **Volunteer Application & Approval**: In-app volunteer tutor application system with automated and administrator approval workflows.
- 📊 **Administrative Oversight**: Centralized admin dashboard featuring real-time statistics, user management, and audit logs.
- ⚡ **Instant Reviewer / Demo Access**: Built-in 1-click test accounts (Student, Volunteer, Admin) enabling instant exploration without configuring external OAuth or database credentials.

---

## 🛠️ Tech Stack

- **Frontend Framework**: React Native with Expo (SDK 54)
- **Language**: TypeScript 5.3
- **UI & Design**: React Native Paper (Material Design 3), Vector Icons
- **Backend & Database**: Supabase (PostgreSQL, Realtime, Row Level Security)
- **Local Storage**: AsyncStorage & Expo SecureStore
- **Authentication**: Google OAuth via Supabase Auth + built-in demo authentication
- **Build System**: Expo Application Services (EAS Build)

---

## 📱 Supported Platforms

- **Android**: Phone & Tablet (Android 8.0+)
- **iOS**: iPhone & iPad (iOS 15.1+)
- **Web**: Progressive Web Application via Expo Web

---

## 🏗️ Repository Structure

```
GrowTogether/
├── App.tsx                     # Main application container & Paper Provider
├── app/
│   └── index.tsx               # Primary app controller & full screen workflows
├── src/
│   ├── components/
│   │   └── AgeGateScreen.tsx   # Google Families Policy compliant age gate
│   ├── utils/
│   │   └── ageVerification.ts  # Age gate calculation & storage utilities
│   ├── services/               # Supabase client & notification helpers
│   └── types/                  # Shared TypeScript interfaces & types
├── database/
│   ├── schema.sql              # Supabase PostgreSQL schema with RLS policies
│   ├── setup.md                # Step-by-step database provisioning instructions
│   └── README.md               # Database architecture overview
├── scripts/
│   └── setup-database.js       # Interactive CLI tool for database provisioning
├── store_assets/               # Google Play store icons, banners & screenshots
├── docs/
│   ├── CONTEXT.md              # Full functional specification & app requirements
│   ├── setup/                  # Detailed setup guides (Google OAuth, Supabase, Push)
│   ├── architecture/           # Screen specs, UI design & swipe navigation
│   └── archive/                # Development history and fix logs
├── env.example                 # Environment variable template
├── app.json                    # Expo application manifest
├── eas.json                    # EAS build configuration
└── package.json                # Project dependencies and npm scripts
```

---

## 🚦 Getting Started

### Prerequisites

- **Node.js**: `v18.x` or `v20.x` (LTS recommended)
- **npm** or **yarn**
- **Mobile Device or Emulator**:
  - [Expo Go](https://expo.dev/go) app installed on your physical iOS/Android device, **or**
  - Android Studio Emulator / iOS Simulator installed on your machine.

---

### Installation & Launch (Under 3 Minutes)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/GrowTogether.git
   cd GrowTogether
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Copy the provided template:
   ```bash
   cp env.example .env
   ```
   > **Note:** The app includes full built-in offline/demo capabilities! You can launch and test the app immediately even without connecting a custom Supabase instance.

4. **Start the development server:**
   ```bash
   npm start
   ```

5. **Open on your device:**
   - **Android**: Scan the terminal QR code using the Expo Go app.
   - **iOS**: Scan the terminal QR code using the default Camera app.
   - **Emulator**: Press `a` for Android Emulator or `i` for iOS Simulator in the terminal.

---

## 👥 Instant Demo & Reviewer Accounts

The login screen provides 1-click test accounts for immediate verification:

| Role | Account Name | Description |
|---|---|---|
| **Student** | Alex Student | Explores tutoring search, questionnaire onboarding, and initiates chats. |
| **Volunteer** | Jordan Volunteer | Demonstrates active tutor profile, availability, and receiving student questions. |
| **Admin** | Morgan Admin | Accesses system metrics, user role promotion/demotion, and volunteer application reviews. |

---

## 🗄️ Optional: Connecting Your Own Supabase Backend

If you wish to host your own PostgreSQL backend:

1. Create a free project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** in your Supabase Dashboard.
3. Paste and run the contents of [`database/schema.sql`](database/schema.sql).
4. Update your `.env` file with your credentials:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
5. For additional setup options, see [`docs/setup/SUPABASE_AUTH_SETUP.md`](docs/setup/SUPABASE_AUTH_SETUP.md) or run:
   ```bash
   node scripts/setup-database.js
   ```

---

## 🛠️ Available Scripts

| Command | Action |
|---|---|
| `npm start` | Starts the Expo development server. |
| `npm run android` | Starts the Expo dev server targeting Android. |
| `npm run ios` | Starts the Expo dev server targeting iOS. |
| `npm run web` | Launches the app in your default web browser. |
| `npm run type-check` | Runs TypeScript compiler checks (`tsc --noEmit`). |
| `npx expo export` | Tests production bundling for iOS and Android. |
| `npm run build:dev` | Triggers an EAS development build. |
| `npm run build:prod` | Triggers an EAS production build for app stores. |

---

## 📦 Building for Production

GrowTogether is configured for [EAS Build](https://docs.expo.dev/build/introduction/):

1. **Install EAS CLI:**
   ```bash
   npm install -g eas-cli
   ```
2. **Log in to Expo:**
   ```bash
   eas login
   ```
3. **Build APK/AAB for Android:**
   ```bash
   eas build --platform android --profile production
   ```
4. **Build IPA for iOS:**
   ```bash
   eas build --platform ios --profile production
   ```

---

## 📚 Documentation Directory

- 📖 [Functional Specification (`docs/CONTEXT.md`)](docs/CONTEXT.md)
- 🔑 [Google OAuth Setup Guide (`docs/setup/GOOGLE_OAUTH_SETUP.md`)](docs/setup/GOOGLE_OAUTH_SETUP.md)
- 💾 [Supabase Setup Guide (`docs/setup/SUPABASE_AUTH_SETUP.md`)](docs/setup/SUPABASE_AUTH_SETUP.md)
- 🔔 [Push Notifications Setup (`docs/setup/PUSH_NOTIFICATIONS_SETUP.md`)](docs/setup/PUSH_NOTIFICATIONS_SETUP.md)
- 🎨 [UI Modernization & Design (`docs/architecture/UI_MODERNIZATION.md`)](docs/architecture/UI_MODERNIZATION.md)

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
