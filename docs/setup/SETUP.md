# GrowTogether Setup Guide

Welcome to GrowTogether! This guide will help you set up the app for development.

## Prerequisites

- Node.js 20.15.1 or higher
- npm or yarn
- Expo Go app on your mobile device
- A Supabase account (for production use)
- A Google Cloud Console account (for Google OAuth)

## Quick Start

### 1. Install Dependencies

```bash
npm install --legacy-peer-deps
```

### 2. Set Up Environment Variables

Copy the `.env.example` file to `.env`:

```bash
cp .env.example .env
```

**For Development (Mock Mode):**
The app is currently configured to work with mock Supabase and Google OAuth credentials. You can start developing right away without setting up real services.

**For Production:**
1. **Supabase Setup:**
   - Create a project at [https://supabase.com](https://supabase.com)
   - Get your project URL and anon key from Project Settings → API
   - Run the database setup script (see Database Setup below)
   - Update `.env` with your real credentials

2. **Google OAuth Setup:**
   - Follow the guide in `docs/GOOGLE_OAUTH_SETUP.md`
   - Update `.env` with your real client IDs

### 3. Start the Development Server

```bash
npx expo start
```

Scan the QR code with Expo Go to run the app on your device.

## Database Setup

### Automated Setup (Recommended)

```bash
npm run setup-database
```

This will guide you through setting up your Supabase database with all required tables, views, and policies.

### Manual Setup

See `database/setup.md` for detailed manual setup instructions.

## Project Structure

```
GrowTogether/
├── app/                    # Expo Router app directory
│   ├── (auth)/            # Authentication screens
│   ├── (tabs)/            # Main app tabs
│   ├── (admin)/           # Admin panel
│   └── _layout.tsx        # Root layout
├── src/
│   ├── components/        # Reusable components
│   ├── hooks/            # Custom React hooks
│   ├── services/         # API and external services
│   ├── store/            # Zustand state management
│   ├── styles/           # Theme and styling
│   ├── types/            # TypeScript types
│   └── utils/            # Utility functions
├── database/             # Database schema and setup
└── docs/                 # Documentation
```

## Key Features

### Authentication
- Email/password authentication
- Google OAuth login
- Role-based access (Student, Volunteer, Admin)
- Profile onboarding flow

### For Students
- Browse and match with volunteer tutors
- Real-time chat with tutors
- Profile management
- Quiz-based matching algorithm

### For Volunteers
- Set up tutoring availability
- View matched students
- Real-time chat with students
- Manage volunteer profile

### For Admins
- User management
- Chat oversight
- System statistics
- Admin action logging

## Development Workflow

### Running Tests
```bash
npm test
```

### Type Checking
```bash
npm run type-check
```

### Linting
```bash
npm run lint
```

### Building for Production
```bash
# iOS
npx expo build:ios

# Android
npx expo build:android
```

## Troubleshooting

### App Not Loading
1. Clear the cache: `npx expo start --clear`
2. Check that all dependencies are installed
3. Verify your `.env` file exists

### "Element type is invalid" Error
This usually means an import is failing. Check:
1. All path aliases are correctly configured in `tsconfig.json`
2. All imports use the correct file extensions
3. No circular dependencies exist

### Database Connection Issues
1. Verify your Supabase URL and anon key are correct
2. Check that Row Level Security policies are properly configured
3. Ensure your IP is allowed in Supabase settings

### Google OAuth Not Working
1. Verify all three client IDs are configured (Android, iOS, Web)
2. Check that redirect URIs are properly set up in Google Cloud Console
3. For Expo Go, make sure you're using the Web client ID
4. See `docs/GOOGLE_OAUTH_SETUP.md` for detailed setup

## Support

For more information:
- See `docs/CONTEXT.md` for the full functional specification
- See `database/setup.md` for database documentation
- See `docs/GOOGLE_OAUTH_SETUP.md` for OAuth setup

## Current Development Status

✅ Basic app structure and navigation
✅ Authentication screens (login/signup)
✅ Dashboard screens
✅ Chat screens (UI only)
✅ Profile and settings screens
✅ Admin panel screens
✅ Mock mode for development

🚧 Real-time chat functionality
🚧 Volunteer matching algorithm
🚧 Profile onboarding flow
🚧 Push notifications
🚧 Complete admin features

## Next Steps

1. **Connect to Real Supabase:**
   - Set up your Supabase project
   - Run the database setup script
   - Update environment variables

2. **Implement Real Authentication:**
   - Configure Google OAuth
   - Test login/signup flows
   - Set up password reset

3. **Build Features:**
   - Complete the matching algorithm
   - Implement real-time chat with Supabase
   - Add onboarding quiz flow
   - Integrate push notifications

4. **Testing:**
   - Write unit tests for components
   - Test authentication flows
   - Test real-time features
   - Test admin functionality

Happy coding! 🚀


