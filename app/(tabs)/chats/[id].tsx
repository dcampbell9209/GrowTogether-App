import { View, StyleSheet } from 'react-native';
import { Text, Card } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, Stack } from 'expo-router';
import { colors } from '@/styles/colors';

export default function ChatDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Chat',
        }}
      />
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Card style={styles.card}>
            <Card.Content>
              <Text variant="titleMedium">Chat #{id}</Text>
              <Text variant="bodyMedium" style={styles.cardText}>
                Chat interface coming soon...
              </Text>
            </Card.Content>
          </Card>
        </View>
      </SafeAreaView>
    </>
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
  card: {
    marginTop: 8,
  },
  cardText: {
    marginTop: 8,
    color: colors.text.secondary,
  },
});

