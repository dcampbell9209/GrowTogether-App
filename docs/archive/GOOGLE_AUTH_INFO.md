# Google Authentication in Production

## Current Implementation (Development/Demo Mode)

The current implementation uses a **modal email input** for demonstration purposes. When users click "Sign in with Google":

1. A modal appears asking for their email address
2. The email is validated and processed
3. Admin status is checked (`inform.growtogether@gmail.com` = admin)
4. User is either signed in or directed to complete the quiz

## Production Implementation

For the **actual production app**, the "Sign in with Google" button would:

1. **Open the native Google OAuth flow** (using `@react-native-google-signin/google-signin` or Expo's `AuthSession`)
2. Show the **real Google account picker** 
3. Request permissions from the user
4. Return the authenticated user's information
5. Automatically sign them in with their verified Google account

---

## How to Implement Real Google OAuth

### Option 1: Using `@react-native-google-signin/google-signin` (Recommended)

This is the most popular and robust solution for React Native.

#### Installation:
```bash
npx expo install @react-native-google-signin/google-signin
```

#### Setup Steps:

1. **Get Google OAuth Credentials:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project (or select existing)
   - Enable "Google+ API"
   - Create OAuth 2.0 credentials:
     - **Android:** Get SHA-1 fingerprint, create Android OAuth client
     - **iOS:** Create iOS OAuth client
     - **Web:** Create Web OAuth client (for Expo Go testing)

2. **Configure `app.json`:**
```json
{
  "expo": {
    "plugins": [
      [
        "@react-native-google-signin/google-signin",
        {
          "iosUrlScheme": "com.googleusercontent.apps.YOUR_CLIENT_ID"
        }
      ]
    ]
  }
}
```

3. **Update the code in `app/index.tsx`:**

Replace the current `handleGoogleSignIn` function with:

```typescript
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';

// Configure Google Sign-In (run once at app start)
GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID, // From Google Cloud Console
  iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID, // Optional
  offlineAccess: true,
});

const handleGoogleSignIn = async () => {
  try {
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();
    
    // Process the authenticated user
    const email = userInfo.user.email;
    const firstName = userInfo.user.givenName || '';
    const lastName = userInfo.user.familyName || '';
    
    // Check for admin status
    const isAdmin = email === 'inform.growtogether@gmail.com';
    
    // Continue with your existing processGoogleSignIn logic...
    processGoogleSignIn(email, firstName, lastName, isAdmin);
    
  } catch (error) {
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      Alert.alert('Sign in cancelled');
    } else if (error.code === statusCodes.IN_PROGRESS) {
      Alert.alert('Sign in already in progress');
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      Alert.alert('Play services not available');
    } else {
      Alert.alert('Error', 'Failed to sign in with Google');
    }
  }
};
```

4. **Build the app:**
```bash
# For development builds
eas build --profile development --platform android
eas build --profile development --platform ios

# For production
eas build --profile production --platform all
```

---

### Option 2: Using Expo AuthSession (Expo-native solution)

#### Installation:
```bash
npx expo install expo-auth-session expo-crypto expo-web-browser
```

#### Implementation:
```typescript
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';

WebBrowser.maybeCompleteAuthSession();

// In your component
const [request, response, promptAsync] = Google.useAuthRequest({
  expoClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
  androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
});

// Handle response
React.useEffect(() => {
  if (response?.type === 'success') {
    const { authentication } = response;
    // Fetch user info from Google
    fetchGoogleUserInfo(authentication.accessToken);
  }
}, [response]);

// Update your button
<Button onPress={() => promptAsync()}>
  Sign in with Google
</Button>
```

---

## Environment Variables Needed

Create a `.env` file in your project root:

```env
# Google OAuth Credentials
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=your-web-client-id.apps.googleusercontent.com
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=your-ios-client-id.apps.googleusercontent.com
EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=your-android-client-id.apps.googleusercontent.com
```

---

## Testing

- **Expo Go:** Will only work with Web Client ID
- **Development Build:** Full OAuth flow with native Google Sign-In
- **Production Build:** Fully functional native authentication

---

## Important Notes

1. **Current demo uses email input** - This is only for testing/demo purposes
2. **Production requires real OAuth** - Must implement one of the above options
3. **Requires native build** - Cannot use Expo Go for production OAuth
4. **Admin email detection** - Already implemented (`inform.growtogether@gmail.com`)
5. **Supabase integration** - Can integrate with Supabase Auth for backend

---

## Recommended Next Steps for Production

1. ✅ Set up Google Cloud project
2. ✅ Get OAuth credentials (Web, iOS, Android)
3. ✅ Choose authentication library (`@react-native-google-signin/google-signin` recommended)
4. ✅ Install and configure the library
5. ✅ Replace `handleGoogleSignIn` with real OAuth flow
6. ✅ Create development builds for testing
7. ✅ Test on real devices
8. ✅ Create production builds
9. ✅ Submit to App Store / Play Store

---

## Summary

**Question:** *"In the actual app would it open up the google authentication?"*

**Answer:** **YES!** In production, when properly configured with real Google OAuth:
- Users will see the **native Google account picker**
- They can select their Google account
- Google will ask for permission
- The app receives verified user information
- No manual email entry required

The current email input modal is just a **development placeholder** to allow testing the rest of the app's functionality without requiring a full OAuth setup. When you implement real Google Sign-In using one of the methods above, it will open the authentic Google authentication flow! 🎉


