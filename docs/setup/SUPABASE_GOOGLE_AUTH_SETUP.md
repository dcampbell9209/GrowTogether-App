# 🚀 Supabase Google OAuth Setup Guide

Your app is now configured with **real Supabase Google OAuth**! Follow these steps to complete the setup.

---

## ✅ What We've Done

1. ✅ Created `.env` file with your Supabase credentials
2. ✅ Updated `app/index.tsx` to use Supabase OAuth
3. ✅ Configured OAuth callback URL scheme: `growtogether://`

---

## 📋 Required Setup Steps

### **Step 1: Configure Google Cloud Console**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create or select a project
3. Enable **Google+ API**:
   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API"
   - Click "Enable"

4. Create **OAuth 2.0 Credentials**:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth client ID"
   - Select "Web application"
   - Add these **Authorized redirect URIs**:
     ```
     https://hlcdkhcgbbpxikpfhmkj.supabase.co/auth/v1/callback
     ```
   - Click "Create"
   - **Copy the Client ID and Client Secret** (you'll need these next)

---

### **Step 2: Configure Supabase Dashboard**

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard/project/hlcdkhcgbbpxikpfhmkj)
2. Navigate to **Authentication** → **Providers**
3. Find **Google** and click to expand
4. **Enable Google Auth**
5. Paste your **Google Client ID** and **Client Secret** from Step 1
6. The **Redirect URL** should already be set to:
   ```
   https://hlcdkhcgbbpxikpfhmkj.supabase.co/auth/v1/callback
   ```
7. Click **Save**

---

## 🧪 Testing in Expo Go

### **Install Dependencies (if needed)**
```bash
npm install expo-web-browser expo-linking --legacy-peer-deps
```

### **Start the App**
```bash
npx expo start --clear
```

### **Test Google Sign-In**
1. Open your app in Expo Go
2. Click "Sign in with Google"
3. A browser window will open with Google's sign-in page
4. Sign in with your Google account
5. Authorize the app
6. You'll be redirected back to the app
7. Complete the quiz (for new accounts)
8. You're in! 🎉

---

## 🔐 How It Works

### **Authentication Flow**
```
1. User clicks "Sign in with Google"
   ↓
2. App calls Supabase OAuth API
   ↓
3. Browser opens with Google sign-in page
   ↓
4. User signs in and authorizes
   ↓
5. Google redirects to Supabase callback URL
   ↓
6. Supabase creates session and redirects to app
   ↓
7. App extracts tokens and gets user profile
   ↓
8. User is signed in!
```

### **Admin Account**
- Email: `inform.growtogether@gmail.com`
- This account automatically gets admin privileges
- Can access the admin panel
- Can promote users to volunteers

### **User Data Storage**
- Currently using **local state** for user profiles
- Supabase handles **authentication only**
- To persist user profiles in Supabase database:
  - Create `users` table in Supabase (see `database/schema.sql`)
  - Update `processSupabaseUser` to save/load from database

---

## 📱 Publishing to Play Store

### **For Production Builds**

1. **Create Android OAuth Client** (in addition to Web client):
   - Go to Google Cloud Console → "Credentials"
   - Create new "OAuth client ID"
   - Select "Android"
   - Get SHA-1 fingerprint: `eas credentials`
   - Enter your package name: `com.growtogether.app`
   - Add SHA-1 fingerprint
   - Click "Create"

2. **Update Supabase** with both Client IDs (Web and Android)

3. **Build with EAS**:
```bash
eas build --platform android --profile production
```

---

## 🐛 Troubleshooting

### **"Sign In Failed" Error**
- ✅ Check that Google+ API is enabled in Google Cloud Console
- ✅ Verify Client ID and Secret are correct in Supabase
- ✅ Ensure redirect URI exactly matches in Google Cloud Console

### **Browser Doesn't Open**
- ✅ Make sure `expo-web-browser` is installed
- ✅ Try restarting Expo: `npx expo start --clear`

### **Redirect Doesn't Work**
- ✅ Verify `scheme: "growtogether"` is in `app.json`
- ✅ Check that callback URL is `https://YOUR-PROJECT.supabase.co/auth/v1/callback`

### **"No authentication tokens received"**
- ✅ This can happen in Expo Go sometimes
- ✅ Try using a development build: `eas build --profile development`

---

## 🎯 Next Steps

### **Immediate**
1. Complete Google Cloud Console setup (Step 1)
2. Configure Supabase dashboard (Step 2)
3. Test sign-in in Expo Go

### **For Production**
1. Set up database tables in Supabase (see `database/schema.sql`)
2. Update `processSupabaseUser` to save profiles to database
3. Create Android OAuth client for Play Store
4. Build production APK with EAS

---

## 📚 Additional Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Google OAuth Setup Guide](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Expo Web Browser Docs](https://docs.expo.dev/versions/latest/sdk/webbrowser/)
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)

---

## 🚀 You're Ready!

Your app now has:
✅ Real Google OAuth authentication
✅ Supabase backend integration
✅ Secure session management
✅ Admin account detection
✅ Production-ready auth flow

**Complete the Google Cloud and Supabase setup, then test it out!** 🎉


