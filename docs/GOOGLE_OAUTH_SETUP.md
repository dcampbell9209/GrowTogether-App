# Google OAuth Setup Guide

This guide will help you set up Google OAuth authentication for the GrowTogether mobile app.

## Prerequisites

- Google Cloud Console account
- Supabase project with authentication enabled
- Expo development environment

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API:
   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API" and enable it
   - Also enable "Google Identity" API

## Step 2: Configure OAuth Consent Screen

1. Go to "APIs & Services" → "OAuth consent screen"
2. Choose "External" user type (unless you have a Google Workspace)
3. Fill in the required fields:
   - **App name**: GrowTogether
   - **User support email**: Your email
   - **Developer contact information**: Your email
4. Add scopes:
   - `../auth/userinfo.email`
   - `../auth/userinfo.profile`
   - `openid`
5. Add test users (for development):
   - Add your email and any test user emails

## Step 3: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth 2.0 Client IDs"
3. Create credentials for each platform:

### Web Application
- **Application type**: Web application
- **Name**: GrowTogether Web
- **Authorized redirect URIs**:
  - `https://your-project-id.supabase.co/auth/v1/callback`
  - `http://localhost:3000/auth/callback` (for development)

### iOS Application
- **Application type**: iOS
- **Name**: GrowTogether iOS
- **Bundle ID**: `com.yourcompany.growtogether` (or your Expo bundle ID)

### Android Application
- **Application type**: Android
- **Name**: GrowTogether Android
- **Package name**: `com.yourcompany.growtogether` (or your Expo package name)
- **SHA-1 certificate fingerprint**: Get this from your keystore

## Step 4: Get Your Client IDs

After creating the credentials, copy the following:
- **Web Client ID**: Use this for Supabase configuration
- **iOS Client ID**: Use this for iOS app configuration
- **Android Client ID**: Use this for Android app configuration

## Step 5: Configure Supabase

1. Go to your Supabase project dashboard
2. Navigate to "Authentication" → "Providers"
3. Enable Google provider
4. Add your **Web Client ID** and **Client Secret** (from Google Cloud Console)
5. Set the redirect URL to: `https://your-project-id.supabase.co/auth/v1/callback`

## Step 6: Configure Environment Variables

Create or update your `.env.local` file:

```env
# Google OAuth Configuration
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=your-web-client-id.googleusercontent.com
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=your-ios-client-id.googleusercontent.com
EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=your-android-client-id.googleusercontent.com

# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Step 7: Configure app.json

Update your `app.json` to include the correct bundle identifiers:

```json
{
  "expo": {
    "name": "GrowTogether",
    "slug": "growtogether",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.yourcompany.growtogether"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#FFFFFF"
      },
      "package": "com.yourcompany.growtogether"
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "scheme": "growtogether"
  }
}
```

## Step 8: Test the Integration

1. Start your development server:
   ```bash
   npm start
   ```

2. Run the app on your preferred platform:
   ```bash
   npm run ios     # iOS Simulator
   npm run android # Android Emulator
   npm run web     # Web browser
   ```

3. Test the Google Sign-In flow:
   - Tap the "Sign in with Google" button
   - Complete the OAuth flow
   - Verify the user is created in Supabase

## Troubleshooting

### Common Issues

1. **"Invalid client" error**
   - Check that your client IDs are correct
   - Ensure the bundle ID matches your app configuration

2. **"Redirect URI mismatch" error**
   - Verify redirect URIs in Google Cloud Console
   - Check Supabase callback URL configuration

3. **"Access blocked" error**
   - Add test users in OAuth consent screen
   - Ensure your app is in development mode

4. **iOS/Android specific issues**
   - Verify SHA-1 fingerprint for Android
   - Check bundle identifier for iOS

### Debug Steps

1. Check browser console for errors
2. Verify environment variables are loaded
3. Test with different platforms
4. Check Supabase logs for authentication errors

## Production Considerations

### Security

1. **Never expose client secrets** in client-side code
2. **Use environment variables** for all sensitive configuration
3. **Enable app verification** in Google Cloud Console for production
4. **Set up proper redirect URIs** for production domains

### App Store Submission

1. **Complete OAuth consent screen** verification process
2. **Add privacy policy URL** to OAuth consent screen
3. **Update bundle identifiers** to match your app store listing
4. **Test on real devices** before submission

### Monitoring

1. **Set up Google Analytics** for authentication metrics
2. **Monitor Supabase logs** for authentication issues
3. **Track user sign-up/sign-in rates**
4. **Set up alerts** for authentication failures

## Support

If you encounter issues:

1. Check the [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
2. Review [Expo AuthSession Documentation](https://docs.expo.dev/versions/latest/sdk/auth-session/)
3. Check [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
4. Ask for help in the [Expo Discord](https://discord.gg/expo) or [Supabase Discord](https://discord.supabase.com)

## Next Steps

After setting up Google OAuth:

1. **Test all authentication flows**
2. **Implement proper error handling**
3. **Add user profile management**
4. **Set up push notifications**
5. **Configure analytics and monitoring**





