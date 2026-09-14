# Google OAuth Setup for GrowTogether

This guide will help you set up Google OAuth for the GrowTogether mobile app.

## Prerequisites

- Google Cloud Console account
- Supabase project set up
- Admin email: `inform.growtogether@gmail.com`

---

## Step 1: Set Up Google Cloud Project

### 1.1 Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Name: **GrowTogether App**
4. Click "Create"

### 1.2 Enable Google+ API

1. In your project, go to "APIs & Services" → "Library"
2. Search for "Google+ API"
3. Click on it and press "Enable"

---

## Step 2: Create OAuth 2.0 Credentials

### 2.1 Configure OAuth Consent Screen

1. Go to "APIs & Services" → "OAuth consent screen"
2. Choose "External" (unless you have a Google Workspace)
3. Click "Create"

**Fill in the required fields:**
- **App name**: GrowTogether
- **User support email**: inform.growtogether@gmail.com
- **App logo**: (optional, upload your app logo)
- **App domain**:
  - Application home page: https://growtogether.app (or your domain)
  - Application privacy policy: https://growtogether.app/privacy
  - Application terms of service: https://growtogether.app/terms
- **Authorized domains**: 
  - Add your Supabase project URL domain (e.g., `yourproject.supabase.co`)
- **Developer contact email**: inform.growtogether@gmail.com

4. Click "Save and Continue"
5. **Scopes**: Add the following scopes:
   - `.../auth/userinfo.email`
   - `.../auth/userinfo.profile`
   - `openid`
6. Click "Save and Continue"
7. **Test users** (for development): Add your test email addresses
8. Click "Save and Continue"
9. Review and click "Back to Dashboard"

### 2.2 Create OAuth 2.0 Client IDs

#### For Web (Supabase)

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth 2.0 Client ID"
3. Application type: **Web application**
4. Name: **GrowTogether Web**
5. **Authorized redirect URIs**:
   - Add: `https://YOUR_SUPABASE_PROJECT_REF.supabase.co/auth/v1/callback`
   - Replace `YOUR_SUPABASE_PROJECT_REF` with your actual Supabase project reference
6. Click "Create"
7. **Save the Client ID and Client Secret** - you'll need these for Supabase

#### For Android (Expo)

1. Click "Create Credentials" → "OAuth 2.0 Client ID"
2. Application type: **Android**
3. Name: **GrowTogether Android**
4. **Package name**: `com.growtogether.app` (or your actual package name from `app.json`)
5. **SHA-1 certificate fingerprint**:
   - For development, get it by running:
     ```bash
     keytool -keystore ~/.android/debug.keystore -list -v
     ```
   - Password is usually `android`
   - Copy the SHA-1 fingerprint
6. Click "Create"
7. **Save the Client ID**

#### For iOS (Expo)

1. Click "Create Credentials" → "OAuth 2.0 Client ID"
2. Application type: **iOS**
3. Name: **GrowTogether iOS**
4. **Bundle ID**: `com.growtogether.app` (from your `app.json`)
5. **App Store ID**: (leave blank for development)
6. Click "Create"
7. **Save the Client ID**

---

## Step 3: Configure Supabase

### 3.1 Enable Google Auth in Supabase

1. Go to your [Supabase Dashboard](https://app.supabase.com/)
2. Select your project
3. Go to "Authentication" → "Providers"
4. Find "Google" and click "Enable"
5. Fill in:
   - **Client ID (for OAuth)**: Your Web Client ID from Step 2.2
   - **Client Secret (for OAuth)**: Your Web Client Secret from Step 2.2
6. **Authorized Client IDs** (optional, for additional security):
   - Add your Android Client ID
   - Add your iOS Client ID
7. Click "Save"

### 3.2 Set Admin Email

1. In Supabase Dashboard, go to "SQL Editor"
2. Run this query to set admin status for your email:

```sql
-- Update the admin email
UPDATE users 
SET is_admin = true 
WHERE email = 'inform.growtogether@gmail.com';

-- If the user doesn't exist yet, they'll be created as admin on first login
-- This is handled by the checkAdminStatus() function in auth.ts
```

3. Update the admin email list in your code:

**File: `src/services/api/auth.ts`**

```typescript
private async checkAdminStatus(email: string): Promise<boolean> {
  const adminEmails = [
    'inform.growtogether@gmail.com',  // Main admin
    // Add more admin emails as needed
  ];
  
  return adminEmails.includes(email.toLowerCase());
}
```

---

## Step 4: Configure Your Expo App

### 4.1 Update Environment Variables

Create or update `.env` file in your project root:

```env
# Supabase
EXPO_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Google OAuth Client IDs
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=your_web_client_id.apps.googleusercontent.com
EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=your_android_client_id.apps.googleusercontent.com
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=your_ios_client_id.apps.googleusercontent.com

# Environment
EXPO_PUBLIC_ENVIRONMENT=production
```

### 4.2 Update app.json

Add the Google scheme for deep linking:

```json
{
  "expo": {
    "scheme": "growtogether",
    "android": {
      "package": "com.growtogether.app"
    },
    "ios": {
      "bundleIdentifier": "com.growtogether.app"
    }
  }
}
```

---

## Step 5: Install Required Dependencies

```bash
npm install @react-native-google-signin/google-signin expo-auth-session expo-web-browser --legacy-peer-deps
```

---

## Step 6: Test the Implementation

### 6.1 Test on Expo Go (Development)

1. Start your development server:
   ```bash
   npx expo start
   ```

2. Scan the QR code with Expo Go

3. Click "Sign in with Google"

4. You should see a Google authentication browser window

5. Select your Google account

6. After successful authentication, you'll be redirected back to the app

### 6.2 Test Multiple Accounts

To test with different roles:

1. **Student Account**: Sign in with any Gmail account
2. **Volunteer Account**: After signing in, complete the quiz and select volunteer role
3. **Admin Account**: Sign in with `inform.growtogether@gmail.com`

---

## Step 7: Production Deployment

### 7.1 Build Production App

```bash
# For Android
eas build --platform android --profile production

# For iOS
eas build --platform ios --profile production
```

### 7.2 Get Production SHA-1 (Android)

After building with EAS:

```bash
# Download your keystore
eas credentials

# Get SHA-1
keytool -list -v -keystore production.keystore
```

Add this SHA-1 to your Android OAuth client in Google Cloud Console.

### 7.3 Publish OAuth Consent Screen

1. Go to Google Cloud Console → "OAuth consent screen"
2. Click "Publish App"
3. Confirm and submit for verification (if needed)

---

## Troubleshooting

### Issue: "Developer Error" or "Invalid Client"

- **Solution**: Make sure your Client IDs match exactly
- Check that you've added all redirect URIs in Google Cloud Console
- Verify your SHA-1 certificate fingerprint for Android

### Issue: "Redirect URI mismatch"

- **Solution**: Add the exact redirect URI shown in the error to your Google OAuth client

### Issue: User is not marked as admin

- **Solution**: Run the SQL query in Step 3.2 again
- Clear app data and sign in again

### Issue: "This app is blocked"

- **Solution**: Add your test email to "Test users" in the OAuth consent screen

---

## Security Best Practices

1. **Never commit** your `.env` file to version control
2. Add `.env` to `.gitignore`
3. Use different OAuth clients for development and production
4. Regularly rotate your client secrets
5. Monitor OAuth usage in Google Cloud Console
6. Keep your Supabase anon key secure (it's safe for client-side use with RLS enabled)

---

## Support

If you encounter any issues:

1. Check the [Expo Auth Session docs](https://docs.expo.dev/versions/latest/sdk/auth-session/)
2. Check the [Supabase Auth docs](https://supabase.com/docs/guides/auth/social-login/auth-google)
3. Review the [Google OAuth docs](https://developers.google.com/identity/protocols/oauth2)

---

## Admin Panel Access

Once `inform.growtogether@gmail.com` is set as admin:

1. Sign in with that account
2. Complete the quiz (any answers)
3. Navigate to the app
4. You'll see an "Admin Panel" option in settings
5. The bottom navigation will show an admin icon
6. You can view all users, chats, and statistics

---

**Setup complete!** 🎉

You can now create multiple accounts using different Gmail addresses to test the full functionality of the app.


