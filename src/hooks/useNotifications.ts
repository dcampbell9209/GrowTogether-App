// Temporary stub for notifications - will be implemented later
import { useState } from 'react';

export interface NotificationPermissionStatus {
  status: 'granted' | 'denied' | 'undetermined';
  canAskAgain: boolean;
  expires: string;
}

export interface NotificationSettings {
  chatMessages: boolean;
  matchNotifications: boolean;
  reminderNotifications: boolean;
  weeklyReports: boolean;
}

export const useNotifications = () => {
  const [permissions, setPermissions] = useState<NotificationPermissionStatus>({
    status: 'granted',
    canAskAgain: true,
    expires: 'never'
  });

  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);

  const requestPermissions = async () => {
    return { status: 'granted' as const };
  };

  const registerForPushNotifications = async () => {
    return null;
  };

  return {
    permissions,
    expoPushToken,
    requestPermissions,
    registerForPushNotifications,
  };
};

export const useNotificationSettings = () => {
  const [settings, setSettings] = useState<NotificationSettings>({
    chatMessages: true,
    matchNotifications: true,
    reminderNotifications: true,
    weeklyReports: false,
  });

  const updateSettings = async (newSettings: Partial<NotificationSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  return {
    settings,
    updateSettings,
  };
};