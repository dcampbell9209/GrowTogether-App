import { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, TextInput, RadioButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { colors } from '@/styles/colors';

export default function SignupScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState<'student' | 'volunteer'>('student');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signUp } = useAuthStore();

  const handleSignup = async () => {
    if (!email || !password || !firstName || !lastName) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await signUp(email, password, {
        firstName,
        lastName,
        role,
      });
      // Navigation is handled by the auth store's redirectAfterAuth
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text variant="headlineLarge" style={styles.title}>
            Create Account
          </Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            Join GrowTogether today
          </Text>
        </View>

        <View style={styles.form}>
          {error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : null}

          <TextInput
            label="First Name"
            value={firstName}
            onChangeText={setFirstName}
            style={styles.input}
            mode="outlined"
          />

          <TextInput
            label="Last Name"
            value={lastName}
            onChangeText={setLastName}
            style={styles.input}
            mode="outlined"
          />

          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
            mode="outlined"
          />

          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
            mode="outlined"
          />

          <TextInput
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            style={styles.input}
            mode="outlined"
          />

          <View style={styles.radioGroup}>
            <Text variant="titleMedium" style={styles.radioLabel}>
              I am a:
            </Text>
            <RadioButton.Group onValueChange={value => setRole(value as 'student' | 'volunteer')} value={role}>
              <View style={styles.radioItem}>
                <RadioButton value="student" />
                <Text>Student (looking for help)</Text>
              </View>
              <View style={styles.radioItem}>
                <RadioButton value="volunteer" />
                <Text>Volunteer (offering to tutor)</Text>
              </View>
            </RadioButton.Group>
          </View>

          <Button
            mode="contained"
            onPress={handleSignup}
            loading={loading}
            disabled={loading}
            style={styles.button}
          >
            Create Account
          </Button>

          <Button
            mode="text"
            onPress={() => router.back()}
            disabled={loading}
            style={styles.linkButton}
          >
            Already have an account? Sign In
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    color: colors.primary,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    color: colors.text.secondary,
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  input: {
    marginBottom: 16,
  },
  radioGroup: {
    marginBottom: 24,
  },
  radioLabel: {
    marginBottom: 8,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  button: {
    marginTop: 8,
  },
  linkButton: {
    marginTop: 16,
  },
  errorText: {
    color: colors.error,
    marginBottom: 16,
    textAlign: 'center',
  },
});


