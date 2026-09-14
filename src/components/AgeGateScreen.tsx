import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, TextInput } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import {
  buildAgeVerificationData,
  isValidBirthDate,
} from '../utils/ageVerification';

interface AgeGateScreenProps {
  onComplete: (data: ReturnType<typeof buildAgeVerificationData>) => void;
}

export function AgeGateScreen({ onComplete }: AgeGateScreenProps) {
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [year, setYear] = useState('');
  const [error, setError] = useState('');

  const handleContinue = () => {
    setError('');

    const birthMonth = parseInt(month, 10);
    const birthDay = parseInt(day, 10);
    const birthYear = parseInt(year, 10);

    if (!month || !day || !year) {
      setError('Please enter your full date of birth.');
      return;
    }

    if (!isValidBirthDate(birthMonth, birthDay, birthYear)) {
      setError('Please enter a valid date of birth.');
      return;
    }

    onComplete(buildAgeVerificationData(birthMonth, birthDay, birthYear));
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <MaterialCommunityIcons name="calendar-account" size={72} color="#2196F3" />
        <Text variant="headlineMedium" style={styles.title}>
          When were you born?
        </Text>
        <Text variant="bodyLarge" style={styles.subtitle}>
          Enter your date of birth to continue.
        </Text>

        <View style={styles.dateRow}>
          <TextInput
            mode="outlined"
            label="Month"
            value={month}
            onChangeText={setMonth}
            keyboardType="number-pad"
            placeholder="MM"
            maxLength={2}
            style={styles.dateInput}
          />
          <TextInput
            mode="outlined"
            label="Day"
            value={day}
            onChangeText={setDay}
            keyboardType="number-pad"
            placeholder="DD"
            maxLength={2}
            style={styles.dateInput}
          />
          <TextInput
            mode="outlined"
            label="Year"
            value={year}
            onChangeText={setYear}
            keyboardType="number-pad"
            placeholder="YYYY"
            maxLength={4}
            style={styles.yearInput}
          />
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <Button
          mode="contained"
          onPress={handleContinue}
          style={styles.continueButton}
          contentStyle={styles.continueButtonContent}
        >
          Continue
        </Button>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
    alignItems: 'center',
  },
  title: {
    marginTop: 24,
    marginBottom: 8,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  subtitle: {
    marginBottom: 32,
    textAlign: 'center',
    color: '#666666',
  },
  dateRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
    marginBottom: 16,
  },
  dateInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  yearInput: {
    flex: 1.4,
    backgroundColor: '#FFFFFF',
  },
  errorText: {
    color: '#D32F2F',
    marginBottom: 16,
    textAlign: 'center',
  },
  continueButton: {
    width: '100%',
    marginTop: 8,
  },
  continueButtonContent: {
    paddingVertical: 8,
  },
});

export default AgeGateScreen;
