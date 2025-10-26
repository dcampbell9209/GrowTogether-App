import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { router } from 'expo-router';

export default function Dashboard() {
  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        Dashboard
      </Text>
      
      <Text variant="bodyLarge" style={styles.subtitle}>
        Welcome! You're logged in! 🎉
      </Text>
      
      <Button 
        mode="outlined" 
        onPress={() => router.back()}
        style={styles.button}
      >
        Back to Login
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    color: '#2196F3',
    marginBottom: 16,
  },
  subtitle: {
    color: '#666',
    marginBottom: 32,
  },
  button: {
    minWidth: 200,
  },
});

