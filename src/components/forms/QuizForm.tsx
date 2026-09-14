import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, ProgressBar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { 
  Input, 
  Dropdown, 
  DaysSelector, 
  Button, 
  Loading 
} from '@/components/ui';
import { 
  informationQuizSchema, 
  validateForm, 
  validateField 
} from '@/utils/validation';
import { School, Subject, Grade } from '@/types';
import { spacing, colors, commonStyles } from '@/styles';

// Form data interface
export interface QuizFormData {
  firstName: string;
  lastName: string;
  currentGrade: number | null;
  age: number | null;
  school: string;
  studentSubjectPreference: string;
  availability: {
    mon: boolean;
    tue: boolean;
    wed: boolean;
    thu: boolean;
    fri: boolean;
    sat: boolean;
    sun: boolean;
  };
}

// Form props
export interface QuizFormProps {
  initialData?: Partial<QuizFormData>;
  onSubmit: (data: QuizFormData) => Promise<void>;
  isLoading?: boolean;
  onCancel?: () => void;
}

// Multi-step form steps
const STEPS = [
  { title: 'Personal Info', fields: ['firstName', 'lastName', 'age'] },
  { title: 'School Info', fields: ['currentGrade', 'school'] },
  { title: 'Preferences', fields: ['studentSubjectPreference'] },
  { title: 'Availability', fields: ['availability'] },
];

export const QuizForm: React.FC<QuizFormProps> = ({
  initialData,
  onSubmit,
  isLoading = false,
  onCancel,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<QuizFormData>({
    firstName: initialData?.firstName || '',
    lastName: initialData?.lastName || '',
    currentGrade: initialData?.currentGrade || null,
    age: initialData?.age || null,
    school: initialData?.school || '',
    studentSubjectPreference: initialData?.studentSubjectPreference || '',
    availability: initialData?.availability || {
      mon: false,
      tue: false,
      wed: false,
      thu: false,
      fri: false,
      sat: false,
      sun: false,
    },
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());

  // Create dropdown options
  const gradeOptions = Object.values(Grade)
    .filter(g => typeof g === 'number')
    .map(grade => ({
      label: `Grade ${grade}`,
      value: grade as number,
    }));

  const ageOptions = Array.from({ length: 21 }, (_, i) => i + 5).map(age => ({
    label: age.toString(),
    value: age,
  }));

  const schoolOptions = Object.values(School).map(school => ({
    label: school,
    value: school,
  }));

  const subjectOptions = Object.values(Subject).map(subject => ({
    label: subject,
    value: subject,
  }));

  // Validate current step
  const validateCurrentStep = () => {
    const currentStepFields = STEPS[currentStep].fields;
    const stepData: any = {};
    
    currentStepFields.forEach(field => {
      stepData[field] = formData[field as keyof QuizFormData];
    });

    const { errors: validationErrors } = validateForm(
      informationQuizSchema.pick(
        currentStepFields.reduce((acc, field) => {
          acc[field] = true;
          return acc;
        }, {} as any)
      ),
      stepData
    );

    const newErrors: Record<string, string> = {};
    validationErrors.forEach(error => {
      newErrors[error.field] = error.message;
    });

    setErrors(prev => ({ ...prev, ...newErrors }));
    return validationErrors.length === 0;
  };

  // Handle field change
  const handleFieldChange = (field: keyof QuizFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setTouchedFields(prev => new Set(prev).add(field));

    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    // Validate field
    const error = validateField(informationQuizSchema, field, value);
    if (error) {
      setErrors(prev => ({ ...prev, [field]: error }));
    }
  };

  // Handle next step
  const handleNext = () => {
    if (validateCurrentStep()) {
      if (currentStep < STEPS.length - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        handleSubmit();
      }
    }
  };

  // Handle previous step
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    const { data, errors: validationErrors } = validateForm(informationQuizSchema, formData);
    
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

  // Get current step errors
  const getCurrentStepErrors = () => {
    const currentStepFields = STEPS[currentStep].fields;
    return currentStepFields.some(field => errors[field]);
  };

  // Check if current step is complete
  const isCurrentStepComplete = () => {
    const currentStepFields = STEPS[currentStep].fields;
    return currentStepFields.every(field => {
      const value = formData[field as keyof QuizFormData];
      if (field === 'availability') {
        return Object.values(value as any).some(day => day === true);
      }
      return value !== null && value !== '';
    });
  };

  if (isLoading) {
    return (
      <SafeAreaView style={commonStyles.centeredContainer}>
        <Loading message="Setting up your profile..." />
      </SafeAreaView>
    );
  }

  const progress = (currentStep + 1) / STEPS.length;
  const isLastStep = currentStep === STEPS.length - 1;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with progress */}
      <View style={styles.header}>
        <Text variant="headlineSmall" style={styles.title}>
          Complete Your Profile
        </Text>
        <Text variant="bodyMedium" style={styles.stepText}>
          Step {currentStep + 1} of {STEPS.length}: {STEPS[currentStep].title}
        </Text>
        <ProgressBar progress={progress} style={styles.progressBar} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Card style={styles.formCard}>
          <Card.Content style={styles.cardContent}>
            {/* Step 1: Personal Info */}
            {currentStep === 0 && (
              <View>
                <Text variant="titleMedium" style={styles.sectionTitle}>
                  Tell us about yourself
                </Text>
                
                <Input
                  label="First Name"
                  value={formData.firstName}
                  onChangeText={(value) => handleFieldChange('firstName', value)}
                  error={errors.firstName}
                  required
                  autoCapitalize="words"
                  containerStyle={styles.fieldContainer}
                />

                <Input
                  label="Last Name"
                  value={formData.lastName}
                  onChangeText={(value) => handleFieldChange('lastName', value)}
                  error={errors.lastName}
                  required
                  autoCapitalize="words"
                  containerStyle={styles.fieldContainer}
                />

                <Dropdown
                  label="Age"
                  value={formData.age}
                  onSelect={(value) => handleFieldChange('age', value)}
                  options={ageOptions}
                  error={errors.age}
                  required
                  placeholder="Select your age"
                  containerStyle={styles.fieldContainer}
                />
              </View>
            )}

            {/* Step 2: School Info */}
            {currentStep === 1 && (
              <View>
                <Text variant="titleMedium" style={styles.sectionTitle}>
                  School Information
                </Text>
                
                <Dropdown
                  label="Current Grade"
                  value={formData.currentGrade}
                  onSelect={(value) => handleFieldChange('currentGrade', value)}
                  options={gradeOptions}
                  error={errors.currentGrade}
                  required
                  placeholder="Select your grade"
                  containerStyle={styles.fieldContainer}
                />

                <Dropdown
                  label="School"
                  value={formData.school}
                  onSelect={(value) => handleFieldChange('school', value)}
                  options={schoolOptions}
                  error={errors.school}
                  required
                  placeholder="Select your school"
                  containerStyle={styles.fieldContainer}
                />
              </View>
            )}

            {/* Step 3: Preferences */}
            {currentStep === 2 && (
              <View>
                <Text variant="titleMedium" style={styles.sectionTitle}>
                  Academic Preferences
                </Text>
                
                <Dropdown
                  label="Subject You Need Help With"
                  value={formData.studentSubjectPreference}
                  onSelect={(value) => handleFieldChange('studentSubjectPreference', value)}
                  options={subjectOptions}
                  error={errors.studentSubjectPreference}
                  required
                  placeholder="Select a subject"
                  containerStyle={styles.fieldContainer}
                />

                <Text variant="bodyMedium" style={styles.helperText}>
                  Choose the subject where you'd most like to receive tutoring help.
                </Text>
              </View>
            )}

            {/* Step 4: Availability */}
            {currentStep === 3 && (
              <View>
                <Text variant="titleMedium" style={styles.sectionTitle}>
                  When are you available?
                </Text>
                
                <DaysSelector
                  label="Days Available for Tutoring"
                  value={formData.availability}
                  onChange={(value) => handleFieldChange('availability', value)}
                  error={errors.availability}
                  required
                  helperText="Select the days when you're available to meet with volunteers"
                  containerStyle={styles.fieldContainer}
                />
              </View>
            )}
          </Card.Content>
        </Card>
      </ScrollView>

      {/* Navigation buttons */}
      <View style={styles.buttonContainer}>
        <View style={styles.buttonRow}>
          {currentStep > 0 && (
            <Button
              title="Previous"
              variant="outlined"
              onPress={handlePrevious}
              style={styles.secondaryButton}
            />
          )}
          
          {onCancel && currentStep === 0 && (
            <Button
              title="Cancel"
              variant="text"
              onPress={onCancel}
              style={styles.secondaryButton}
            />
          )}
          
          <Button
            title={isLastStep ? "Complete Profile" : "Next"}
            variant="contained"
            onPress={handleNext}
            disabled={!isCurrentStepComplete() || getCurrentStepErrors()}
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
  stepText: {
    textAlign: 'center',
    marginBottom: spacing.md,
    opacity: 0.7,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.container,
  },
  formCard: {
    marginTop: spacing.lg,
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
  helperText: {
    textAlign: 'center',
    opacity: 0.7,
    lineHeight: 20,
    marginTop: spacing.md,
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

export default QuizForm;






