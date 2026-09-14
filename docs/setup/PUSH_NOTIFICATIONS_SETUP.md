# Push Notifications Setup Guide

This guide will help you set up push notifications for the GrowTogether mobile app.

## Prerequisites

- Expo development environment
- Supabase project with database set up
- Physical device for testing (push notifications don't work in simulators)

## Step 1: Install Required Dependencies

The following dependencies are already included in your `package.json`:

```bash
npm install expo-notifications expo-device
```

## Step 2: Configure app.json

Update your `app.json` to include notification configuration:

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
    "scheme": "growtogether",
    "notification": {
      "icon": "./assets/notification-icon.png",
      "color": "#ffffff",
      "androidMode": "default",
      "androidCollapsedTitle": "#{unread_notifications} new interactions"
    },
    "plugins": [
      [
        "expo-notifications",
        {
          "icon": "./assets/notification-icon.png",
          "color": "#ffffff",
          "defaultChannel": "default"
        }
      ]
    ]
  }
}
```

## Step 3: Set Up Notification Icons

Create notification icons for your app:

### Android Notification Icon
- Create a 24x24dp icon (96x96px for xxxhdpi)
- Use white/transparent design
- Save as `assets/notification-icon.png`

### iOS Notification Icon
- Create a 20x20pt icon (40x40px for @2x, 60x60px for @3x)
- Use white/transparent design
- Save as `assets/notification-icon.png`

## Step 4: Database Setup

The database schema already includes the `user_push_tokens` table. Make sure to run the updated schema:

```sql
-- The user_push_tokens table is already included in database/schema.sql
-- Run the schema to create the table and RLS policies
```

## Step 5: Initialize Notifications in Your App

The notification service is already implemented. To use it in your app:

```typescript
import { useNotifications } from '@/hooks/useNotifications';

function App() {
  const { initialize, isInitialized } = useNotifications();

  useEffect(() => {
    initialize();
  }, []);

  // Your app content
}
```

## Step 6: Test Push Notifications

### Testing on Physical Device

1. **Build and install on device**:
   ```bash
   npx expo install --fix
   npx expo start --dev-client
   ```

2. **Test local notifications**:
   ```typescript
   import { notificationService } from '@/services/notifications';
   
   // Send a test notification
   await notificationService.sendLocalNotification({
     title: 'Test Notification',
     body: 'This is a test notification',
     data: { type: 'test' }
   });
   ```

3. **Test push notifications**:
   - Sign in to your app
   - The push token should be automatically registered
   - Use the Supabase dashboard to send a test notification

### Testing with Expo Go

For development testing with Expo Go:

1. **Start the development server**:
   ```bash
   npm start
   ```

2. **Open in Expo Go**:
   - Scan the QR code with Expo Go app
   - Test local notifications (push notifications won't work in Expo Go)

## Step 7: Production Setup

### For Production Builds

1. **Configure EAS Build**:
   ```bash
   npx eas build --platform all
   ```

2. **Set up push notification certificates**:
   - iOS: Upload your push notification certificate to EAS
   - Android: Use Firebase Cloud Messaging (FCM)

3. **Update app.json for production**:
   ```json
   {
     "expo": {
       "notification": {
         "icon": "./assets/notification-icon.png",
         "color": "#ffffff",
         "androidMode": "default",
         "androidCollapsedTitle": "#{unread_notifications} new interactions"
       }
     }
   }
   ```

## Step 8: Notification Types

The app supports several notification types:

### Chat Messages
- **Trigger**: New message received
- **Channel**: `chat-messages`
- **Sound**: Default
- **Vibration**: Enabled

### Volunteer Matches
- **Trigger**: New volunteer match found
- **Channel**: `volunteer-matches`
- **Sound**: Default
- **Vibration**: Enabled

### Admin Alerts
- **Trigger**: Important admin notifications
- **Channel**: `admin-alerts`
- **Sound**: Default
- **Vibration**: Enabled

## Step 9: Notification Settings

Users can manage their notification preferences:

1. **Access settings**: Go to Settings → Notifications
2. **Toggle notification types**: Enable/disable specific notification types
3. **Sound and vibration**: Control audio and haptic feedback
4. **Reset to defaults**: Restore default settings

## Step 10: Troubleshooting

### Common Issues

1. **Notifications not appearing**:
   - Check device notification permissions
   - Verify push token is registered
   - Test on physical device (not simulator)

2. **Permission denied**:
   - Request permissions explicitly
   - Check device settings
   - Handle permission rejection gracefully

3. **Push tokens not registering**:
   - Check internet connection
   - Verify Supabase configuration
   - Check database permissions

4. **Notifications not working in production**:
   - Verify production certificates
   - Check app bundle ID matches
   - Test with production build

### Debug Steps

1. **Check notification permissions**:
   ```typescript
   const { permissionStatus } = useNotifications();
   console.log('Permission status:', permissionStatus);
   ```

2. **Verify push token**:
   ```typescript
   const { getPushToken } = notificationService;
   console.log('Push token:', getPushToken());
   ```

3. **Test local notifications**:
   ```typescript
   await notificationService.sendLocalNotification({
     title: 'Test',
     body: 'Testing notifications'
   });
   ```

## Step 11: Best Practices

### Performance
- **Batch notification updates** to avoid excessive API calls
- **Cache push tokens** locally for offline scenarios
- **Clean up old tokens** regularly

### User Experience
- **Respect user preferences** for notification types
- **Provide clear notification content** with actionable information
- **Handle notification responses** appropriately

### Security
- **Validate notification data** before processing
- **Use secure channels** for sensitive notifications
- **Implement rate limiting** for notification sending

## Step 12: Monitoring and Analytics

### Track Notification Metrics
- **Delivery rates**: Monitor successful notification delivery
- **Open rates**: Track user engagement with notifications
- **Permission rates**: Monitor notification permission acceptance

### Set Up Alerts
- **Failed deliveries**: Alert on notification delivery failures
- **Permission issues**: Monitor permission rejection rates
- **Token registration**: Track push token registration success

## Support

If you encounter issues:

1. Check the [Expo Notifications Documentation](https://docs.expo.dev/versions/latest/sdk/notifications/)
2. Review the [React Native Push Notification Guide](https://reactnative.dev/docs/pushnotificationios)
3. Check the [Supabase Realtime Documentation](https://supabase.com/docs/guides/realtime)
4. Ask for help in the [Expo Discord](https://discord.gg/expo) or [Supabase Discord](https://discord.supabase.com)

## Next Steps

After setting up push notifications:

1. **Test all notification types** thoroughly
2. **Implement notification analytics** for monitoring
3. **Set up production monitoring** and alerting
4. **Optimize notification timing** for better user engagement
5. **Add rich notification content** with images and actions





