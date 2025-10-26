// Temporary stub for notifications - will be implemented later
export const requestPermissions = async () => {
  return { status: 'granted' };
};

export const registerForPushNotifications = async () => {
  return null;
};

export const sendPushNotification = async (expoPushToken: string, title: string, body: string) => {
  console.log('Push notification:', { expoPushToken, title, body });
};

export const schedulePushNotification = async (title: string, body: string, seconds: number) => {
  console.log('Scheduled notification:', { title, body, seconds });
};

export const addNotificationReceivedListener = (listener: any) => {
  return { remove: () => {} };
};

export const addNotificationResponseReceivedListener = (listener: any) => {
  return { remove: () => {} };
};