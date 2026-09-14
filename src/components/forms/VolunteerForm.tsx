import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { 
  MultiSelectDropdown, 
  Button, 
  Loading 
} from '@/components/ui';
import { 
  volunteerSetupSchema, 
  validateForm 
} from '@/utils/validation';
import { Subject, Grade } from '@/types';
import { spacing, colors, commonStyles } from '@/styles';

// Form data interface
export interface VolunteerFormData {
  subjectsToTutor: string[];
  gradeLevelsComfortable: number[];
}

// Form props
export interface VolunteerFormProps {
  initialData?: Partial<VolunteerFormData>;
  onSubmit: (data: VolunteerFormData) => Promise<void>;
  isLoading?: boolean;
  onCancel?: () => void;
}

export const VolunteerForm: React.FC<VolunteerFormProps> = ({
  initialData,
  onSubmit,
  isLoading = false,
  onCancel,
}) => {
  const [formData, setFormData] = useState<VolunteerFormData>({
    subjectsToTutor: initialData?.subjectsToTutor || [],
    gradeLevelsComfortable: initialData?.gradeLevelsComfortable || [],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Create dropdown options
  const subjectOptions = Object.values(Subject).map(subject => ({
    label: subject,
    value: subject,
  }));

  const gradeOptions = Object.values(Grade)
    .filter(g => typeof g === 'number')
    .map(grade => ({
      label: `Grade ${grade}`,
      value: grade as number,
    }));

  // Handle field change
  const handleFieldChange = (field: keyof VolunteerFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    const { data, errors: validationErrors } = validateForm(volunteerSetupSchema, formData);
    
    if (validationErrors.length > 0) {
      const newErrors: Record<string, string> = {};
      validationErrors.forEach(error => {
        newErrors[error.field] = error.message;
      });
      setErrors(newErrors);
      return;
    }

    if (data) {
      await onSubmit(data);
    }
  };

  // Check if form is complete
  const isFormComplete = () => {
    return formData.subjectsToTutor.length > 0 && formData.gradeLevelsComfortable.length > 0;
  };

  if (isLoading) {
    return (
      <SafeAreaView style={commonStyles.centeredContainer}>
        <Loading message="Setting up your volunteer profile..." />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text variant="headlineSmall" style={styles.title}>
          Volunteer Setup
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          Tell us about your tutoring preferences so students can find you
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Welcome card */}
        <Card style={styles.welcomeCard}>
          <Card.Content style={styles.welcomeContent}>
            <Text variant="displaySmall" style={styles.welcomeIcon}>
              🎉
            </Text>
            <Text variant="titleLarge" style={styles.welcomeTitle}>
              Welcome to Volunteering!
            </Text>
            <Text variant="bodyLarge" style={styles.welcomeText}>
              Thank you for joining as a volunteer tutor. Your knowledge and experience will help fellow students succeed in their academic journey.
            </Text>
          </Card.Content>
        </Card>

        {/* Form card */}
        <Card style={styles.formCard}>
          <Card.Content style={styles.cardContent}>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Tutoring Preferences
            </Text>
            
            <MultiSelectDropdown
              label="Subjects You Can Tutor"
              value={formData.subjectsToTutor}
              onSelect={(values) => handleFieldChange('subjectsToTutor', values)}
              options={subjectOptions}
              error={errors.subjectsToTutor}
              required
              placeholder="Select subjects you're comfortable tutoring"
              helperText="Choose all subjects where you feel confident helping other students"
              containerStyle={styles.fieldContainer}
            />

            <MultiSelectDropdown
              label="Grade Levels You're Comfortable With"
              value={formData.gradeLevelsComfortable}
              onSelect={(values) => handleFieldChange('gradeLevelsComfortable', values)}
              options={gradeOptions}
              error={errors.gradeLevelsComfortable}
              required
              placeholder="Select grade levels"
              helperText="Select the grade levels you feel comfortable tutoring"
              containerStyle={styles.fieldContainer}
            />

            {/* Info section */}
            <View style={styles.infoSection}>
              <Text variant="titleSmall" style={styles.infoTitle}>
                📋 What happens next?
              </Text>
              <View style={styles.infoList}>
                <Text variant="bodyMedium" style={styles.infoItem}>
                  • Students will see you in their volunteer matches
                </Text>
                <Text variant="bodyMedium" style={styles.infoItem}>
                  • They can start chats with you for tutoring help
                </Text>
                <Text variant="bodyMedium" style={styles.infoItem}>
                  • You'll earn volunteer hours for each completed session
                </Text>
                <Text variant="bodyMedium" style={styles.infoItem}>
                  • Admins will track and award your community service hours
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Guidelines card */}
        <Card style={styles.guidelinesCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.guidelinesTitle}>
              📝 Volunteer Guidelines
            </Text>
            <View style={styles.guidelinesList}>
              <Text variant="bodyMedium" style={styles.guideline}>
                • Be patient and encouraging with students
              </Text>
              <Text variant="bodyMedium" style={styles.guideline}>
                • Focus on helping them understand, not just giving answers
              </Text>
              <Text variant="bodyMedium" style={styles.guideline}>
                • Keep conversations appropriate and educational
              </Text>
              <Text variant="bodyMedium" style={styles.guideline}>
                • Report any concerns to administrators
              </Text>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>

      {/* Navigation buttons */}
      <View style={styles.buttonContainer}>
        <View style={styles.buttonRow}>
          {onCancel && (
            <Button
              title="Skip for Now"
              variant="text"
              onPress={onCancel}
              style={styles.secondaryButton}
            />
          )}
          
          <Button
            title="Complete Setup"
            variant="contained"
            onPress={handleSubmit}
            disabled={!isFormComplete()}
            loading={isLoading}
            style={styles.primaryButton}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.container,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.outline,
  },
  title: {
    textAlign: 'center',
    marginBottom: spacing.sm,
    color: colors.onSurface,
    fontWeight: 'bold',
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.7,
    lineHeight: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.container,
  },
  welcomeCard: {
    marginTop: spacing.lg,
    marginBottom: spacing.md,
    backgroundColor: colors.primaryContainer,
    elevation: 2,
  },
  welcomeContent: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  welcomeIcon: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  welcomeTitle: {
    textAlign: 'center',
    marginBottom: spacing.md,
    color: colors.primary,
    fontWeight: 'bold',
  },
  welcomeText: {
    textAlign: 'center',
    opacity: 0.8,
    lineHeight: 24,
  },
  formCard: {
    marginBottom: spacing.md,
    elevation: 2,
  },
  cardContent: {
    paddingVertical: spacing.xl,
  },
  sectionTitle: {
    marginBottom: spacing.lg,
    textAlign: 'center',
    color: colors.primary,
    fontWeight: '600',
  },
  fieldContainer: {
    marginBottom: spacing.lg,
  },
  infoSection: {
    marginTop: spacing.xl,
    padding: spacing.md,
    backgroundColor: colors.surfaceVariant,
    borderRadius: spacing.borderRadius.medium,
  },
  infoTitle: {
    marginBottom: spacing.md,
    color: colors.onSurface,
    fontWeight: '600',
  },
  infoList: {
    gap: spacing.sm,
  },
  infoItem: {
    opacity: 0.8,
    lineHeight: 20,
  },
  guidelinesCard: {
    marginBottom: spacing.xl,
    backgroundColor: colors.secondaryContainer,
    elevation: 2,
  },
  guidelinesTitle: {
    marginBottom: spacing.md,
    color: colors.secondary,
    fontWeight: '600',
  },
  guidelinesList: {
    gap: spacing.sm,
  },
  guideline: {
    opacity: 0.8,
    lineHeight: 20,
  },
  buttonContainer: {
    paddingHorizontal: spacing.container,
    paddingVertical: spacing.lg,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.outline,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  primaryButton: {
    flex: 1,
    marginLeft: spacing.md,
  },
  secondaryButton: {
    minWidth: 100,
  },
});

export default VolunteerForm;






