import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/store/authStore';
import { colors } from '@/styles/colors';

export default function DashboardScreen() {
  const { user } = useAuthStore();
  const isVolunteer = user?.role === 'volunteer';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text variant="headlineMedium" style={styles.title}>
            Welcome, {user?.firstName}!
          </Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            {isVolunteer
              ? 'Ready to help students today?'
              : 'Find a tutor to help you succeed'}
          </Text>
        </View>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleLarge">Dashboard Coming Soon</Text>
            <Text variant="bodyMedium" style={styles.cardText}>
              {isVolunteer
                ? 'View your matched students and upcoming tutoring sessions here.'
                : 'Browse available tutors and connect with someone who can help you.'}
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium">Quick Stats</Text>
            <View style={styles.statsContainer}>
              <View style={styles.stat}>
                <Text variant="headlineSmall" style={styles.statNumber}>
                  0
                </Text>
                <Text variant="bodySmall" style={styles.statLabel}>
                  {isVolunteer ? 'Students' : 'Tutors'}
                </Text>
              </View>
              <View style={styles.stat}>
                <Text variant="headlineSmall" style={styles.statNumber}>
                  0
                </Text>
                <Text variant="bodySmall" style={styles.statLabel}>
                  Messages
                </Text>
              </View>
              <View style={styles.stat}>
                <Text variant="headlineSmall" style={styles.statNumber}>
                  0
                </Text>
                <Text variant="bodySmall" style={styles.statLabel}>
                  Sessions
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>
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
  cardText: {
    marginTop: 8,
    color: colors.text.secondary,
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
  },
});


