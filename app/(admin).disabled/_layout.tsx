import { Stack } from 'expo-router';
import { Text } from 'react-native-paper';

export default function AdminLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTitle: () => <Text variant="headlineSmall">Admin Panel</Text>,
        headerStyle: {
          backgroundColor: '#f5f5f5',
        },
      }}
    >
      <Stack.Screen name="panel" />
    </Stack>
  );
}
