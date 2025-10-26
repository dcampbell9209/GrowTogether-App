import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Avatar, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/store/authStore';
import { colors } from '@/styles/colors';

export default function ProfileScreen() {
  const { user } = useAuthStore();

  const getInitials = () => {
    if (!user?.firstName || !user?.lastName) return '??';
    return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
  };

  const getRoleBadgeColor = () => {
    switch (user?.role) {
      case 'student':
        return colors.role.student;
      case 'volunteer':
        return colors.role.volunteer;
      case 'admin':
        return colors.role.admin;
      default:
        return colors.primary;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Avatar.Text
            size={80}
            label={getInitials()}
            style={[styles.avatar, { backgroundColor: getRoleBadgeColor() }]}
          />
          <Text variant="headlineMedium" style={styles.name}>
            {user?.firstName} {user?.lastName}
          </Text>
          <Text variant="bodyLarge" style={styles.role}>
            {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'User'}
          </Text>
        </View>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium">Account Information</Text>
            <View style={styles.infoRow}>
              <Text variant="bodyMedium" style={styles.infoLabel}>
                Email:
              </Text>
              <Text variant="bodyMedium" style={styles.infoValue}>
                {user?.email || 'Not set'}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text variant="bodyMedium" style={styles.infoLabel}>
                Phone:
              </Text>
              <Text variant="bodyMedium" style={styles.infoValue}>
                {user?.phone || 'Not set'}
              </Text>
            </View>
          </Card.Content>
        </Card>

        {user?.role === 'student' && (
          <Card style={styles.card}>
            <Card.Content>
              <Text variant="titleMedium">Student Profile</Text>
              <View style={styles.infoRow}>
                <Text variant="bodyMedium" style={styles.infoLabel}>
                  Grade:
                </Text>
                <Text variant="bodyMedium" style={styles.infoValue}>
                  Not set
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text variant="bodyMedium" style={styles.infoLabel}>
                  School:
                </Text>
                <Text variant="bodyMedium" style={styles.infoValue}>
                  Not set
                </Text>
              </View>
            </Card.Content>
          </Card>
        )}

        {user?.role === 'volunteer' && (
          <Card style={styles.card}>
            <Card.Content>
              <Text variant="titleMedium">Volunteer Profile</Text>
              <View style={styles.infoRow}>
                <Text variant="bodyMedium" style={styles.infoLabel}>
                  Subjects:
                </Text>
                <Text variant="bodyMedium" style={styles.infoValue}>
                  Not set
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text variant="bodyMedium" style={styles.infoLabel}>
                  Availability:
                </Text>
                <Text variant="bodyMedium" style={styles.infoValue}>
                  Not set
                </Text>
              </View>
            </Card.Content>
          </Card>
        )}

        <Button mode="outlined" style={styles.editButton}>
          Edit Profile
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
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    marginBottom: 16,
  },
  name: {
    color: colors.text.primary,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  role: {
    color: colors.text.secondary,
    textTransform: 'capitalize',
  },
  card: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  infoLabel: {
    color: colors.text.secondary,
    fontWeight: '600',
  },
  infoValue: {
    color: colors.text.primary,
  },
  editButton: {
    marginTop: 8,
  },
});

