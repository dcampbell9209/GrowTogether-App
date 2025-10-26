import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors } from '@/styles/colors';

export default function NotFoundScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text variant="displayMedium" style={styles.title}>
          404
        </Text>
        <Text variant="headlineMedium" style={styles.subtitle}>
          Page Not Found
        </Text>
        <Text variant="bodyLarge" style={styles.message}>
          The page you're looking for doesn't exist.
        </Text>
        <Button
          mode="contained"
          onPress={() => router.replace('/')}
          style={styles.button}
        >
          Go Home
        </Button>
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    color: colors.primary,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subtitle: {
    color: colors.text.primary,
    marginBottom: 8,
  },
  message: {
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: 32,
  },
  button: {
    minWidth: 200,
  },
});

