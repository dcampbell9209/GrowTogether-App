import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, List, Button, Divider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { colors } from '@/styles/colors';

export default function SettingsScreen() {
  const { user, signOut } = useAuthStore();

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await signOut();
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text variant="headlineMedium" style={styles.title}>
          Settings
        </Text>

        <List.Section>
          <List.Subheader>Account</List.Subheader>
          <List.Item
            title="Edit Profile"
            description="Update your personal information"
            left={props => <List.Icon {...props} icon="account-edit" />}
            onPress={() => {}}
          />
          <List.Item
            title="Change Password"
            description="Update your password"
            left={props => <List.Icon {...props} icon="lock" />}
            onPress={() => {}}
          />
          <Divider />

          <List.Subheader>Preferences</List.Subheader>
          <List.Item
            title="Notifications"
            description="Manage notification settings"
            left={props => <List.Icon {...props} icon="bell" />}
            onPress={() => {}}
          />
          <List.Item
            title="Privacy"
            description="Control your privacy settings"
            left={props => <List.Icon {...props} icon="shield-account" />}
            onPress={() => {}}
          />
          <Divider />

          <List.Subheader>Support</List.Subheader>
          <List.Item
            title="Help & FAQ"
            description="Get help and find answers"
            left={props => <List.Icon {...props} icon="help-circle" />}
            onPress={() => {}}
          />
          <List.Item
            title="About"
            description="App version and info"
            left={props => <List.Icon {...props} icon="information" />}
            onPress={() => {}}
          />
        </List.Section>

        <Button
          mode="contained"
          onPress={handleSignOut}
          style={styles.signOutButton}
          buttonColor={colors.error}
        >
          Sign Out
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  content: {
    padding: 16,
  },
  title: {
    color: colors.text.primary,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  signOutButton: {
    marginTop: 24,
  },
});

