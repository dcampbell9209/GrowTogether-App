import { View, StyleSheet } from 'react-native';
import { Text, Card } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/styles/colors';

export default function QuizScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text variant="headlineMedium" style={styles.title}>
          Student Quiz
        </Text>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium">Quiz Coming Soon</Text>
            <Text variant="bodyMedium" style={styles.cardText}>
              Complete this quiz to help us match you with the perfect tutor.
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


