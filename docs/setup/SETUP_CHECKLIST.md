# ✅ GrowTogether Setup Checklist

## 📋 **Complete This Checklist to Get Your App Running**

---

## ☑️ **Setup Steps**

### **✅ Already Done**
- [x] ✅ Supabase project created
- [x] ✅ `.env` file created with credentials
- [x] ✅ App code updated with OAuth
- [x] ✅ Dependencies installed
- [x] ✅ Documentation created

### **⬜ To Do (7 Minutes)**

#### **Step 1: Google Cloud Console** (5 minutes)

- [ ] 1. Go to [console.cloud.google.com](https://console.cloud.google.com/)
- [ ] 2. Create or select a project
- [ ] 3. Enable Google+ API
  - Go to "APIs & Services" → "Library"
  - Search "Google+ API"
  - Click "Enable"
- [ ] 4. Create OAuth credentials
  - Go to "APIs & Services" → "Credentials"
  - Click "Create Credentials" → "OAuth client ID"
  - Select "Web application"
  - Add redirect URI: `https://hlcdkhcgbbpxikpfhmkj.supabase.co/auth/v1/callback`
  - Click "Create"
- [ ] 5. Copy Client ID and Client Secret

#### **Step 2: Supabase Dashboard** (2 minutes)

- [ ] 6. Go to [Supabase Dashboard](https://supabase.com/dashboard/project/hlcdkhcgbbpxikpfhmkj)
- [ ] 7. Navigate to Authentication → Providers
- [ ] 8. Find and click Google
- [ ] 9. Enable Google Auth (toggle ON)
- [ ] 10. Paste Client ID from Step 1
- [ ] 11. Paste Client Secret from Step 1
- [ ] 12. Click "Save"

#### **Step 3: Test Your App** (Now!)

- [ ] 13. Run: `npx expo start --clear`
- [ ] 14. Scan QR code in Expo Go
- [ ] 15. Click "Sign in with Google"
- [ ] 16. Sign in with your Google account
- [ ] 17. Complete the quiz (for new accounts)
- [ ] 18. Test all features!

---

## 🎯 **Features to Test After Setup**

### **Authentication**
- [ ] Sign in with Google
- [ ] Complete onboarding quiz
- [ ] Sign out and sign in again
- [ ] Test admin account (`inform.growtogether@gmail.com`)

### **Student Features**
- [ ] View matched volunteers
- [ ] Start a chat with a volunteer
- [ ] Send text messages
- [ ] Upload and send an image
- [ ] Zoom an image in chat
- [ ] Swipe between screens
- [ ] Edit profile settings

### **Volunteer Features** (promote a student account first)
- [ ] View incoming student chats
- [ ] Respond to chat messages
- [ ] Complete/close a chat
- [ ] Edit volunteer preferences

### **Admin Features** (admin account only)
- [ ] Access admin panel
- [ ] View user statistics
- [ ] View all chats
- [ ] Promote a student to volunteer

---

## 📱 **When Ready to Publish**

- [ ] Test thoroughly with multiple accounts
- [ ] Create Android OAuth client in Google Cloud
- [ ] Update Supabase with Android client ID
- [ ] Run: `eas build --platform android --profile production`
- [ ] Upload to Google Play Store

---

## 📚 **Quick Reference**

| Need Help With... | See This File |
|-------------------|---------------|
| Quick setup (7 min) | `QUICK_START.md` |
| Detailed OAuth setup | `SUPABASE_GOOGLE_AUTH_SETUP.md` |
| Publishing guide | `READY_TO_PUBLISH.md` |
| What was implemented | `OAUTH_COMPLETE.md` |
| Full app spec | `docs/CONTEXT.md` |

---

## 🚀 **Current Status**

### **✅ Complete**
- Supabase integration
- Google OAuth code
- All app features
- Documentation

### **⚙️ Needs Setup**
- Google Cloud OAuth credentials (5 min)
- Supabase dashboard configuration (2 min)

### **🎉 Then You're Live!**
- Test in Expo Go
- Build for production
- Publish to Play Store

---

## 📞 **Need Help?**

1. Check the troubleshooting section in `SUPABASE_GOOGLE_AUTH_SETUP.md`
2. Review console logs for errors
3. Verify all setup steps were completed
4. Try restarting: `npx expo start --clear`

---

**✨ Complete the checklist and you're ready to go! ✨**


