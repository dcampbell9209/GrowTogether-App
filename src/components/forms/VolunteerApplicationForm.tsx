import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Text, Button, Card, TextInput } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';

import {
  submitVolunteerApplication,
  getVolunteerApplicationMailtoUrl,
  VolunteerApplicationData,
} from '@/services/volunteerApplication';
import { volunteerApplicationSchema, validateForm } from '@/utils/validation';

const DAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const;
const DAY_LABELS: Record<string, string> = {
  mon: 'Monday',
  tue: 'Tuesday',
  wed: 'Wednesday',
  thu: 'Thursday',
  fri: 'Friday',
  sat: 'Saturday',
  sun: 'Sunday',
};

const defaultAvailability = {
  mon: false,
  tue: false,
  wed: false,
  thu: false,
  fri: false,
  sat: false,
  sun: false,
};

export interface VolunteerApplicationFormProps {
  initialData?: Partial<VolunteerApplicationData>;
  onSuccess?: () => void;
  onBack?: () => void;
}

export const VolunteerApplicationForm: React.FC<VolunteerApplicationFormProps> = ({
  initialData,
  onSuccess,
  onBack,
}) => {
  const [formData, setFormData] = useState<VolunteerApplicationData>({
    firstName: initialData?.firstName || '',
    lastName: initialData?.lastName || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    currentGrade: initialData?.currentGrade || '',
    age: initialData?.age || 0,
    preferredSubjects: initialData?.preferredSubjects || '',
    availability: initialData?.availability || { ...defaultAvailability },
    motivation: initialData?.motivation || '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleAvailability = (day: string) => {
    setFormData(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: !prev.availability[day as keyof typeof prev.availability],
      },
    }));
    if (errors.availability) {
      setErrors(prev => ({ ...prev, availability: '' }));
    }
  };

  const handleSubmit = async () => {
    const { data, errors: validationErrors } = validateForm(volunteerApplicationSchema, formData);

    if (validationErrors.length > 0) {
      const errorMap: Record<string, string> = {};
      validationErrors.forEach(err => {
        errorMap[err.field] = err.message;
      });
      setErrors(errorMap);
      Alert.alert('Missing Information', 'Please fill in all required fields correctly.');
      return;
    }

    if (!data) return;

    setIsSubmitting(true);
    setErrors({});

    const result = await submitVolunteerApplication(data);

    if (result.success) {
      Alert.alert(
        'Application Submitted!',
        'Thank you for applying to become a volunteer. We will review your application and get back to you soon.',
        [{ text: 'OK', onPress: onSuccess }]
      );
    } else {
      Alert.alert(
        'Email Could Not Be Sent',
        'We could not send your application automatically. Would you like to send it via your email app instead?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Open Email App',
            onPress: async () => {
              const mailtoUrl = getVolunteerApplicationMailtoUrl(data);
              const canOpen = await Linking.canOpenURL(mailtoUrl);
              if (canOpen) {
                await Linking.openURL(mailtoUrl);
              } else {
                Alert.alert('Error', 'No email app is available on this device.');
              }
            },
          },
        ]
      );
    }

    setIsSubmitting(false);
  };

  const updateField = (field: keyof VolunteerApplicationData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <Text variant="headlineMedium" style={styles.screenTitle}>
        Volunteer Application
      </Text>
      <Text variant="bodyMedium" style={styles.screenSubtitle}>
        Fill out the form below to apply to become a volunteer tutor
      </Text>

      <Card style={styles.formCard}>
        <Card.Content>
          <Text style={styles.label}>First Name *</Text>
          <TextInput
            mode="outlined"
            value={formData.firstName}
            onChangeText={text => updateField('firstName', text)}
            placeholder="Jane"
            style={styles.textInput}
            error={!!errors.firstName}
          />
          {errors.firstName ? <Text style={styles.errorText}>{errors.firstName}</Text> : null}

          <Text style={styles.label}>Last Name *</Text>
          <TextInput
            mode="outlined"
            value={formData.lastName}
            onChangeText={text => updateField('lastName', text)}
            placeholder="Smith"
            style={styles.textInput}
            error={!!errors.lastName}
          />
          {errors.lastName ? <Text style={styles.errorText}>{errors.lastName}</Text> : null}

          <Text style={styles.label}>Email *</Text>
          <TextInput
            mode="outlined"
            value={formData.email}
            onChangeText={text => updateField('email', text)}
            placeholder="jane@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.textInput}
            error={!!errors.email}
          />
          {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

          <Text style={styles.label}>Phone *</Text>
          <TextInput
            mode="outlined"
            value={formData.phone}
            onChangeText={text => updateField('phone', text)}
            placeholder="(908) 555-0123"
            keyboardType="phone-pad"
            style={styles.textInput}
            error={!!errors.phone}
          />
          {errors.phone ? <Text style={styles.errorText}>{errors.phone}</Text> : null}

          <Text style={styles.label}>Current Grade / Year *</Text>
          <TextInput
            mode="outlined"
            value={formData.currentGrade}
            onChangeText={text => updateField('currentGrade', text)}
            placeholder="e.g. 11th Grade"
            style={styles.textInput}
            error={!!errors.currentGrade}
          />
          {errors.currentGrade ? <Text style={styles.errorText}>{errors.currentGrade}</Text> : null}

          <Text style={styles.label}>Age *</Text>
          <TextInput
            mode="outlined"
            value={formData.age ? String(formData.age) : ''}
            onChangeText={text => updateField('age', parseInt(text, 10) || 0)}
            placeholder="17"
            keyboardType="number-pad"
            style={styles.textInput}
            error={!!errors.age}
          />
          {errors.age ? <Text style={styles.errorText}>{errors.age}</Text> : null}

          <Text style={styles.label}>Preferred Subjects *</Text>
          <TextInput
            mode="outlined"
            value={formData.preferredSubjects}
            onChangeText={text => updateField('preferredSubjects', text)}
            placeholder="e.g. Math, Science, Spanish"
            style={styles.textInput}
            error={!!errors.preferredSubjects}
          />
          {errors.preferredSubjects ? (
            <Text style={styles.errorText}>{errors.preferredSubjects}</Text>
          ) : null}

          <Text style={styles.label}>Availability *</Text>
          <Text variant="bodySmall" style={styles.hint}>
            Select the days you are available to volunteer
          </Text>
          {DAYS.map(day => (
            <TouchableOpacity key={day} onPress={() => toggleAvailability(day)}>
              <Card
                style={[
                  styles.checkboxCard,
                  formData.availability[day] && styles.checkboxCardSelected,
                ]}
              >
                <Card.Content style={styles.checkboxContent}>
                  <MaterialCommunityIcons
                    name={
                      formData.availability[day] ? 'checkbox-marked' : 'checkbox-blank-outline'
                    }
                    size={24}
                    color="#4CAF50"
                  />
                  <Text style={styles.checkboxText}>{DAY_LABELS[day]}</Text>
                </Card.Content>
              </Card>
            </TouchableOpacity>
          ))}
          {errors.availability ? <Text style={styles.errorText}>{errors.availability}</Text> : null}

          <Text style={styles.label}>Why do you want to volunteer? *</Text>
          <TextInput
            mode="outlined"
            value={formData.motivation}
            onChangeText={text => updateField('motivation', text)}
            placeholder="Tell us why you'd like to help students..."
            multiline
            numberOfLines={4}
            style={[styles.textInput, styles.multilineInput]}
            error={!!errors.motivation}
          />
          {errors.motivation ? <Text style={styles.errorText}>{errors.motivation}</Text> : null}
        </Card.Content>
      </Card>

      <Button
        mode="contained"
        onPress={handleSubmit}
        style={styles.submitButton}
        disabled={isSubmitting}
        icon={isSubmitting ? undefined : 'send'}
      >
        {isSubmitting ? <ActivityIndicator color="#FFF" /> : 'Submit Application'}
      </Button>

      {onBack && (
        <Button mode="text" onPress={onBack} style={styles.backButton}>
          Back
        </Button>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  screenTitle: {
    color: '#4CAF50',
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 8,
    textAlign: 'center',
  },
  screenSubtitle: {
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  formCard: {
    marginBottom: 16,
    borderRadius: 20,
    elevation: 2,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
    marginTop: 12,
  },
  textInput: {
    backgroundColor: '#FFF',
  },
  multilineInput: {
    minHeight: 100,
  },
  hint: {
    color: '#999',
    marginBottom: 8,
  },
  checkboxCard: {
    marginBottom: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  checkboxCardSelected: {
    borderColor: '#4CAF50',
    backgroundColor: '#F1F8F4',
  },
  checkboxContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  checkboxText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#333',
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 12,
    marginTop: 4,
  },
  submitButton: {
    marginTop: 8,
    backgroundColor: '#4CAF50',
  },
  backButton: {
    marginTop: 8,
  },
});

export default VolunteerApplicationForm;
