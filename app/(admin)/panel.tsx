import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Card, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { colors } from '@/styles/colors';

export default function AdminPanelScreen() {
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
        <View style={styles.header}>
          <Text variant="headlineMedium" style={styles.title}>
            Admin Panel
          </Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            Welcome, {user?.firstName}
          </Text>
        </View>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleLarge">System Overview</Text>
            <View style={styles.statsContainer}>
              <View style={styles.stat}>
                <Text variant="headlineSmall" style={styles.statNumber}>
                  0
                </Text>
                <Text variant="bodySmall" style={styles.statLabel}>
                  Total Users
                </Text>
              </View>
              <View style={styles.stat}>
                <Text variant="headlineSmall" style={styles.statNumber}>
                  0
                </Text>
                <Text variant="bodySmall" style={styles.statLabel}>
                  Active Chats
                </Text>
              </View>
              <View style={styles.stat}>
                <Text variant="headlineSmall" style={styles.statNumber}>
                  0
                </Text>
                <Text variant="bodySmall" style={styles.statLabel}>
                  Reports
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium">Quick Actions</Text>
            <Button
              mode="outlined"
              style={styles.actionButton}
              onPress={() => {}}
            >
              Manage Users
            </Button>
            <Button
              mode="outlined"
              style={styles.actionButton}
              onPress={() => {}}
            >
              View Chat Oversight
            </Button>
            <Button
              mode="outlined"
              style={styles.actionButton}
              onPress={() => {}}
            >
              Review Reports
            </Button>
          </Card.Content>
        </Card>

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
  header: {
    marginBottom: 24,
  },
  title: {
    color: colors.text.primary,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    color: colors.text.secondary,
  },
  card: {
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  stat: {
    alignItems: 'center',
  },
  statNumber: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  statLabel: {
    color: colors.text.secondary,
    marginTop: 4,
    textAlign: 'center',
  },
  actionButton: {
    marginTop: 12,
  },
  signOutButton: {
    marginTop: 24,
  },
});

