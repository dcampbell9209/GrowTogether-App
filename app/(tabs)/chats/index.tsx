import { View, StyleSheet } from 'react-native';
import { Text, Card } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/styles/colors';

export default function ChatsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text variant="headlineMedium" style={styles.title}>
          Messages
        </Text>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium">No messages yet</Text>
            <Text variant="bodyMedium" style={styles.cardText}>
              Start a conversation with a tutor or student to begin chatting.
            </Text>
          </Card.Content>
        </Card>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    color: colors.text.primary,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  card: {
    marginTop: 8,
  },
  cardText: {
    marginTop: 8,
    color: colors.text.secondary,
  },
});

