# 🚀 GrowTogether - Quick Start Guide

## ⚡ **Get Your App Running (7 Minutes)**

---

## **Step 1: Google Cloud Console** (5 min)

### Go to: [console.cloud.google.com](https://console.cloud.google.com/)

1. **Create/Select Project**
2. **Enable API**: 
   - Go to "APIs & Services" → "Library"
   - Search "Google+ API" → Enable

3. **Create Credentials**:
   - "APIs & Services" → "Credentials"
   - "Create Credentials" → "OAuth client ID"
   - Type: **Web application**
   - **Authorized redirect URIs**:
     ```
     https://hlcdkhcgbbpxikpfhmkj.supabase.co/auth/v1/callback
     ```
   - Click "Create"
   - **📋 COPY:** Client ID and Client Secret

---

## **Step 2: Supabase Dashboard** (2 min)

### Go to: [supabase.com/dashboard](https://supabase.com/dashboard/project/hlcdkhcgbbpxikpfhmkj)

1. **Authentication** → **Providers** → **Google**
2. **Toggle: Enable**
3. **Paste:**
   - Client ID (from Step 1)
   - Client Secret (from Step 1)
4. **Click: Save**

---

## **Step 3: Test Your App** (Now!)

```bash
npx expo start --clear
```

1. Open in Expo Go
2. Click "Sign in with Google"
3. Browser opens → Sign in with Google
4. Complete quiz (new accounts)
5. **You're in!** 🎉

---

## 🎯 **Test These Features**

- ✅ Sign in with Google
- ✅ Complete quiz
- ✅ Match with volunteers
- ✅ Start chat & send messages
- ✅ Upload images in chat
- ✅ Swipe between screens
- ✅ Edit profile settings

### **Admin Account**
- Email: `inform.growtogether@gmail.com`
- Access admin panel
- Promote users to volunteers

---

## 🐛 **If Something Goes Wrong**

| Problem | Solution |
|---------|----------|
| "Sign In Failed" | Double-check Client ID/Secret in Supabase |
| Browser doesn't open | Restart: `npx expo start --clear` |
| App won't load | Check console for errors |

---

## 📚 **Need More Help?**

- **Detailed Setup**: `SUPABASE_GOOGLE_AUTH_SETUP.md`
- **Full Guide**: `READY_TO_PUBLISH.md`
- **App Spec**: `docs/CONTEXT.md`

---

## 📱 **Ready to Publish?**

```bash
# Build for Android
eas build --platform android --profile production
```

Upload to Play Store and you're live! 🚀

---

**That's it! Complete Steps 1-2, then test your app!**


