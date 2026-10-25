# GrowTogether

GrowTogether is a mobile tutoring platform that connects students with volunteer tutors within their school district. The app facilitates peer-to-peer academic support through a secure, administrator-moderated environment.

## Core Features

*   **Peer Matching:** Connects students with volunteer tutors based on subject matter, grade level, and scheduling availability.
*   **Real-Time Chat:** A secure messaging system for live tutoring sessions with support for image sharing.
*   **Moderation Panel:** Full admin oversight for user management, role elevation, and chat moderation.
*   **Role-Based Dashboards:** Custom user experiences tailored specifically for Students, Volunteers, and Admins.
*   **Google OAuth:** Secure authentication integration handled via Supabase Auth.

## Tech Stack

*   **Frontend:** React Native (TypeScript)
*   **Framework:** Expo + Expo Router
*   **Backend & Database:** Supabase (PostgreSQL)
*   **UI Library:** React Native Paper (Material Design 3)
*   **State Management:** Zustand (Client State), TanStack Query (Server State)

## Supported Platforms

*   iOS (iPhone / iPad)
*   Android
*   Web (via Expo Web)

## Project Structure

```text
GrowTogether/
├── app/                     # Expo Router file-based routing
│   ├── (auth)/              # Authentication & onboarding screens
│   ├── (tabs)/              # Main application navigation tabs
│   ├── (admin)/             # Administrator management panel
│   ├── _layout.tsx          # Root layout and providers
│   └── index.tsx            # Application entry point
├── src/
│   ├── components/          # Reusable UI, forms, and feature-specific components
│   ├── hooks/               # Custom React hooks
│   ├── services/            # API clients, Supabase initialization, and notifications
│   ├── store/               # Zustand global state configurations
│   ├── styles/              # Design tokens, themes, and typography
│   └── types/               # Shared TypeScript definitions
├── database/                # SQL schemas and local setup automation scripts
├── docs/                    # Detailed guides for OAuth and functional specifications
├── app.json                 # Expo configuration
└── package.json             # Scripts and project dependencies
```

## Getting Started

### Prerequisites

*   Node.js (v20.15.1 or higher)
*   npm or yarn
*   Expo Go app installed on a physical testing device
*   Google Cloud Console account (for OAuth setup)
*   Supabase project instance

### Quick Setup

1.  **Configure Google OAuth (approx. 5 mins):** Follow the steps outlined in `docs/GOOGLE_OAUTH_SETUP.md` to create credentials in your Google Cloud Console and paste them into your Supabase dashboard.
2.  **Environment Variables:** Populate your `.env` file with your Supabase URL and Anon Key.
3.  **Install & Start:**

```bash
npm install
npx expo start --clear
```

Scan the QR code in your terminal using Expo Go to open the application.

### Development Commands

```bash
# Start local expo packager
npx expo start

# Run native builds locally (requires Android Studio / Xcode)
npx expo run:ios
npx expo run:android

# Code quality checks
npm run type-check
npm run lint
npm test
```

## User Roles & Permissions

*   **Student (Default):** Complete onboarding quiz, browse available tutors, initiate chats, and manage their own profile.
*   **Volunteer:** Inherits student permissions, logs tutoring hours, manages a volunteer-specific profile, and accepts incoming student help requests. (Requires Admin approval).
*   **Administrator:** Complete platform oversight. Accesses the moderation panel, manages user roles (promotions/demotions), logs system audits, and reviews active or archived chat logs. (Controlled via an email allowlist configuration).

## Security & Privacy

*   **Data Isolation:** Enforced via PostgreSQL Row Level Security (RLS) policies in Supabase.
*   **Identity Protection:** Student email addresses remain obfuscated from peers across the platform.
*   **Secure Storage:** Authentication tokens and session states are encrypted on-device via `Expo SecureStore`.
*   **Accountability:** Critical moderation actions and role updates generate immutable entries in `admin_action_logs`.

## Deployment

The project is pre-configured for **Expo Application Services (EAS)**.

```bash
# Initialize EAS configuration
eas build:configure

# Build binaries for production release
eas build --platform ios --profile production
eas build --platform android --profile production
```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.
