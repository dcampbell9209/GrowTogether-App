# 🔐 Supabase Auth Setup Guide

## ✅ **Why Supabase Auth is Better:**

- ✅ Real Google OAuth (web-based, no native build needed)
- ✅ Works in Expo Go immediately
- ✅ Secure and production-ready
- ✅ No dependency conflicts
- ✅ Built-in user management
- ✅ Email/password backup option

---

## 📋 **Step-by-Step Setup**

### **Step 1: Get Your Supabase Credentials**

1. Go to: https://supabase.com/dashboard
2. Sign in or create account
3. Create a new project or select existing:
   - **Name**: GrowTogether
   - **Database Password**: (save this!)
   - **Region**: Choose closest to you
4. Wait ~2 minutes for project to be created

5. **Get your credentials:**
   - Go to **Settings → API**
   - Copy **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - Copy **anon/public key** (long string starting with `eyJ...`)

---

### **Step 2: Create Google OAuth Credentials**

1. **Go to Google Cloud Console:**
   - https://console.cloud.google.com/
   - Select your GrowTogether project (or create one)

2. **Configure OAuth Consent Screen** (if not done):
   - APIs & Services → OAuth consent screen
   - Choose **"External"**
   - Fill in app name: `GrowTogether`
   - Add your email
   - Save

3. **Create Web Client ID:**
   - APIs & Services → Credentials
   - Create Credentials → OAuth client ID
   - Application type: **Web application**
   - Name: `GrowTogether Web`
   - **Authorized redirect URIs** - Add:
     ```
     https://YOUR-PROJECT-ID.supabase.co/auth/v1/callback
     ```
     (Replace YOUR-PROJECT-ID with your actual Supabase project ID)
   - Click **Create**
   - **Copy your Client ID and Client Secret**

---

### **Step 3: Enable Google Auth in Supabase**

1. In Supabase Dashboard:
   - Go to **Authentication → Providers**
   - Find **Google**
   - Toggle **Enable Sign in with Google**
   
2. **Paste your Google credentials:**
   - Client ID: (from Google Cloud Console)
   - Client Secret: (from Google Cloud Console)
   - Click **Save**

---

### **Step 4: Add Supabase Credentials to Your App**

Create a `.env` file in your project root:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

---

### **Step 5: Test in Expo Go**

Once I update the code:

1. Start your app:
   ```bash
   npx expo start
   ```

2. Scan QR code in Expo Go

3. Click **"Sign in with Google"**

4. Browser will open → Select your Google account

5. You'll be redirected back to the app → **Authenticated!** ✅

---

## 🎯 **What Happens After Setup:**

### **For Users:**
1. Click "Sign in with Google"
2. Browser opens with Google sign-in
3. User selects their Google account
4. Gets redirected back to app
5. **Fully authenticated and secure!**

### **For You:**
- ✅ Real email verification
- ✅ Secure authentication
- ✅ Works in Expo Go (no build needed!)
- ✅ Can publish to Play Store immediately
- ✅ Admin detection works (`inform.growtogether@gmail.com`)

---

## 📱 **Admin Account:**

The email `inform.growtogether@gmail.com` will automatically have admin access!

---

## ⏱️ **Time to Complete:**

- **Setup**: 10 minutes
- **Testing**: 2 minutes
- **Total**: ~12 minutes

---

## 🚀 **Next Steps:**

1. ✅ Complete Steps 1-4 above
2. ✅ Tell me when done
3. ✅ I'll update your app code
4. ✅ Test in Expo Go
5. ✅ You're ready to publish!

---

## 💡 **Need Help?**

Get stuck? Let me know which step and I'll guide you through it!


