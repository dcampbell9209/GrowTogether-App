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
- Google Cloud Console account (for OAuth)
- Supabase account
- iOS Simulator (optional, for iOS development)
- Android Studio/Emulator (optional, for Android development)

### Quick Start (7 Minutes)

**📖 See `QUICK_START.md` for the fastest setup!**

1. **Set up Google OAuth** (5 minutes)
   - See `SUPABASE_GOOGLE_AUTH_SETUP.md` for detailed instructions
   - Create OAuth credentials in Google Cloud Console
   - Configure Supabase dashboard

2. **Start the app**
   ```bash
   npx expo start --clear
   ```

3. **Sign in with Google** and test all features! 🎉

### Detailed Setup

For a complete setup guide, see **`SUPABASE_GOOGLE_AUTH_SETUP.md`** and **`READY_TO_PUBLISH.md`**.

#### **Your Supabase Project**
- URL: `https://hlcdkhcgbbpxikpfhmkj.supabase.co`
- Configured in `.env` file
- Ready to use with Google OAuth

#### **Features Available Now**
✅ Real Google OAuth authentication  
✅ Supabase backend integration  
✅ All app features (chat, matching, admin)  
✅ Secure session management  
✅ Admin account detection  
✅ Production-ready auth flow

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

**🎉 The app is PRODUCTION-READY with Supabase Google OAuth!**

### **Fully Implemented**
✅ Real Google OAuth authentication via Supabase  
✅ Complete onboarding quiz for students  
✅ Smart volunteer matching (subject, grade, availability)  
✅ Real-time chat with image sharing  
✅ Swipe navigation between screens  
✅ Edit profile settings  
✅ Admin panel with user management  
✅ Promote students to volunteers  
✅ Role-based dashboards (student, volunteer, admin)  
✅ Modern iOS-inspired UI  
✅ Secure session management  
✅ Admin account detection (`inform.growtogether@gmail.com`)  

### **Ready to Deploy**
✅ Can test immediately in Expo Go (after OAuth setup)  
✅ Can build for Play Store with EAS  
✅ All features working end-to-end  
✅ Production-ready authentication  

### **Setup Required**
⚙️ Complete Google Cloud Console OAuth setup (5 min)  
⚙️ Configure Supabase dashboard with Google provider (2 min)  

**See `QUICK_START.md` for setup instructions!**

## 🙏 Acknowledgments

- Material Design team for design system
- Expo team for development platform
- Supabase team for backend services
- React Native Paper for UI components
- All the students and volunteers who make this platform meaningful

---

**Built with ❤️ for educational communities**

