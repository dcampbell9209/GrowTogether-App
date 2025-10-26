# GrowTogether Mobile App

> A mobile tutoring platform that connects students with volunteer tutors within their school district, facilitating peer-to-peer academic support through a secure, admin-moderated environment.

## 🚀 Features

- **Student-Volunteer Matching**: Smart algorithm matches students with volunteers based on subject, grade level, and availability
- **Real-time Messaging**: Secure chat system for tutoring sessions
- **Admin Oversight**: Comprehensive admin panel for user management and chat moderation
- **Profile Management**: Complete onboarding and profile customization
- **Google OAuth**: Secure authentication with Google Sign-In

## 🛠️ Tech Stack

- **Frontend**: React Native with TypeScript
- **Framework**: Expo with Expo Router
- **Backend/Database**: Supabase
- **UI Framework**: React Native Paper (Material Design 3)
- **State Management**: Zustand
- **Server State**: TanStack Query (React Query)
- **Authentication**: Google OAuth via Supabase Auth
- **AI Processing**: DeepSeek (for future features)

## 📱 Supported Platforms

- iOS (iPhone/iPad)
- Android
- Web (via Expo Web)

## 🏗️ Project Structure

```
GrowTogether/
├── 📱 App Configuration
│   ├── app.json                 # Expo configuration
│   ├── package.json            # Dependencies and scripts
│   ├── tsconfig.json           # TypeScript configuration
│   └── babel.config.js         # Babel configuration
│
├── 📂 app/                     # Expo Router app directory
│   ├── (auth)/                 # Authentication routes
│   │   ├── login.tsx           # Login screen
│   │   ├── signup.tsx          # Signup screen
│   │   └── onboarding/         # Onboarding flows
│   ├── (tabs)/                 # Main app tabs
│   │   ├── dashboard.tsx       # Dashboard screen
│   │   ├── chats/              # Chat screens
│   │   ├── profile.tsx         # Profile screen
│   │   └── settings.tsx        # Settings screen
│   ├── (admin)/                # Admin-only routes
│   │   └── panel.tsx           # Admin panel
│   ├── index.tsx               # App entry point
│   └── _layout.tsx             # Root layout
│
├── 📂 src/
│   ├── 📂 components/          # Reusable UI components
│   │   ├── 📂 ui/              # Base UI components
│   │   ├── 📂 forms/           # Form components
│   │   ├── 📂 chat/            # Chat-specific components
│   │   ├── 📂 dashboard/       # Dashboard components
│   │   ├── 📂 admin/           # Admin components
│   │   ├── ErrorBoundary.tsx   # Error boundary component
│   │   ├── LoadingScreen.tsx   # Loading state component
│   │   └── EmptyState.tsx      # Empty state component
│   │
│   ├── 📂 hooks/               # Custom React hooks
│   ├── 📂 services/            # API and external services
│   │   ├── 📂 api/             # API service layer
│   │   ├── supabase.ts         # Supabase client
│   │   └── notifications.ts    # Push notifications
│   ├── 📂 store/               # State management (Zustand)
│   │   └── authStore.ts        # Authentication state
│   ├── 📂 types/               # TypeScript type definitions
│   ├── 📂 utils/               # Utility functions
│   └── 📂 styles/              # Styling and themes
│       ├── colors.ts           # Color palette
│       ├── theme.ts            # Material Design theme
│       └── typography.ts       # Typography styles
│
├── 📂 database/                # Database setup
│   ├── schema.sql              # Supabase database schema
│   ├── setup.md                # Setup instructions
│   └── README.md               # Database documentation
│
├── 📂 docs/                    # Documentation
│   ├── CONTEXT.md              # Full functional specification
│   └── GOOGLE_OAUTH_SETUP.md   # OAuth setup guide
│
├── 📂 scripts/                 # Utility scripts
│   └── setup-database.js       # Database setup automation
│
├── SETUP.md                    # Detailed setup guide
└── README.md                   # This file
```

## 🚦 Getting Started

### Prerequisites

- Node.js (v20.15.1 or higher)
- npm or yarn
- Expo Go app on your mobile device
- iOS Simulator (optional, for iOS development)
- Android Studio/Emulator (optional, for Android development)

### Quick Start

For a detailed setup guide, see **[SETUP.md](SETUP.md)**.

1. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

2. **Start the development server**
   ```bash
   npx expo start
   ```

3. **Scan the QR code** with Expo Go on your mobile device

The app is currently configured to run in **development mode** with mock Supabase and Google OAuth credentials. You can start developing immediately without setting up external services!

### Setting Up for Production

When you're ready to connect to real services:

1. **Set up Supabase database**
   
   **Option A: Automated Setup (Recommended)**
   ```bash
   npm run setup-database
   ```
   
   **Option B: Manual Setup**
   - Create a Supabase project at [supabase.com](https://supabase.com)
   - Run the SQL schema from `database/schema.sql` in your Supabase SQL editor
   - See `database/setup.md` for detailed instructions

2. **Configure Google OAuth**
   - See `docs/GOOGLE_OAUTH_SETUP.md` for complete setup instructions
   - Update `.env` with your real client IDs

3. **Update environment variables**
   - Copy `.env.example` to `.env`
   - Fill in your real Supabase URL and anon key
   - Add your Google OAuth client IDs

### Development Commands

```bash
# Start development server
npx expo start

# Start with cache cleared
npx expo start --clear

# Run on specific platforms (requires setup)
npx expo run:ios
npx expo run:android

# Type checking
npm run type-check

# Linting
npm run lint

# Testing
npm test
```

### Building for Production

1. **Development build**
   ```bash
   npm run build:dev
   ```

2. **Production build**
   ```bash
   npm run build:prod
   ```

3. **EAS Build** (recommended)
   ```bash
   eas build --platform all
   ```

## 📋 User Roles & Permissions

### Student (Default)
- ✅ Complete profile and onboarding
- ✅ View and match with volunteers
- ✅ Initiate chats with volunteers
- ✅ Send/receive messages
- ✅ Close chats

### Volunteer (Promoted by Admin)
- ✅ All student capabilities
- ✅ Complete volunteer-specific profile
- ✅ Receive student-initiated chats
- ✅ Complete/close chats
- ✅ Track volunteer hours

### Administrator (Email Allowlist)
- ✅ All student/volunteer capabilities
- ✅ Access admin panel
- ✅ Promote/demote users
- ✅ View all chats (active/archived)
- ✅ Send admin messages
- ✅ User management and oversight

## 🎨 Design System

The app uses Material Design 3 principles with a custom color palette:

- **Primary**: Blue (#2196F3) - Trustworthy, educational
- **Secondary**: Green (#4CAF50) - Growth, success  
- **Tertiary**: Orange (#FF9800) - Energy, enthusiasm

### Typography
- Based on Material Design 3 typography scale
- System fonts with fallback to custom fonts
- Consistent spacing and sizing

### Components
- Built on React Native Paper foundation
- Custom components for app-specific needs
- Consistent styling and theming

## 🔧 Development Workflow

### Code Style
- TypeScript strict mode enabled
- ESLint configuration for code quality
- Consistent naming conventions

### Testing
```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

### Type Safety
- Full TypeScript coverage
- Generated types from Supabase schema
- Strict type checking enabled

## 🚀 Deployment

### Expo Application Services (EAS)

1. **Configure EAS**
   ```bash
   eas build:configure
   ```

2. **Build for stores**
   ```bash
   # iOS App Store
   eas build --platform ios --profile production
   
   # Google Play Store  
   eas build --platform android --profile production
   ```

3. **Submit to stores**
   ```bash
   eas submit --platform ios
   eas submit --platform android
   ```

### Environment-Specific Builds
- **Development**: Internal testing and development
- **Preview**: Stakeholder review and testing
- **Production**: App store releases

## 🗄️ Database Schema

The app uses Supabase with PostgreSQL. Key tables include:

- `users` - User profiles and authentication
- `volunteer_profiles` - Volunteer-specific information
- `chats` - Chat conversations and metadata
- `messages` - Individual chat messages
- `admin_action_logs` - Admin activity logging
- `schools` - Predefined school list
- `subjects` - Available subjects for tutoring

See `docs/CONTEXT.md` for complete schema and relationships.

## 🔐 Security

- **Authentication**: Google OAuth with Supabase Auth
- **Authorization**: Row Level Security (RLS) policies
- **Data Protection**: Encrypted storage with Expo SecureStore
- **Privacy**: Email addresses hidden between users
- **Admin Oversight**: All admin actions logged

## 📱 App Features

### Authentication & Onboarding
- Google Sign-In integration
- Profile completion flow
- Volunteer setup process
- Admin role detection

### Student Experience  
- Volunteer discovery and matching
- Chat initiation with volunteers
- Real-time messaging
- Profile management

### Volunteer Experience
- Student request handling
- Chat completion tracking
- Volunteer hours logging
- Discoverability settings

### Admin Experience
- User role management
- Chat oversight and moderation
- Admin messaging system
- User directory and analytics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write tests for new features
- Update documentation as needed
- Follow the existing code style

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions:

- **Setup Guide**: See `SETUP.md` for step-by-step setup instructions
- **Documentation**: Check `docs/CONTEXT.md` for detailed specifications
- **Database Setup**: See `database/setup.md` for database configuration
- **OAuth Setup**: See `docs/GOOGLE_OAUTH_SETUP.md` for Google OAuth configuration
- **Issues**: Open a GitHub issue for bugs and feature requests

## ✅ Current Status

The app is fully functional with:

✅ Complete authentication flow (login/signup)
✅ Role-based navigation (student, volunteer, admin)
✅ Dashboard screens for all user types
✅ Profile management screens
✅ Settings screens
✅ Admin panel structure
✅ Chat screens (UI ready)
✅ Error boundaries and loading states
✅ Mock mode for development

🚧 In Progress:

- Real-time chat implementation with Supabase
- Volunteer matching algorithm
- Profile onboarding flows (quiz, volunteer setup)
- Push notifications
- Complete admin features

## 🙏 Acknowledgments

- Material Design team for design system
- Expo team for development platform
- Supabase team for backend services
- React Native Paper for UI components
- All the students and volunteers who make this platform meaningful

---

**Built with ❤️ for educational communities**

