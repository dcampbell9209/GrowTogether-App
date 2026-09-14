import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Card, Divider } from 'react-native-paper';
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
import { School, Subject, Grade, User } from '@/types';
import { spacing, colors, commonStyles } from '@/styles';

// Form data interface
export interface ProfileFormData {
  firstName: string;
  lastName: string;
  currentGrade: number;
  age: number;
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
export interface ProfileFormProps {
  user: User;
  onSubmit: (data: ProfileFormData) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({
  user,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: user.firstName,
    lastName: user.lastName,
    currentGrade: user.currentGrade,
    age: user.age,
    school: user.school,
    studentSubjectPreference: user.studentSubjectPreference,
    availability: user.availability,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hasChanges, setHasChanges] = useState(false);

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

  // Check if form has changes
  const checkForChanges = (newData: ProfileFormData) => {
    const hasDataChanges = 
      newData.firstName !== user.firstName ||
      newData.lastName !== user.lastName ||
      newData.currentGrade !== user.currentGrade ||
      newData.age !== user.age ||
      newData.school !== user.school ||
      newData.studentSubjectPreference !== user.studentSubjectPreference ||
      JSON.stringify(newData.availability) !== JSON.stringify(user.availability);
    
    setHasChanges(hasDataChanges);
  };

  // Handle field change
  const handleFieldChange = (field: keyof ProfileFormData, value: any) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);
    checkForChanges(newFormData);

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

  // Handle form submission
  const handleSubmit = async () => {
    if (!hasChanges) {
      Alert.alert('No Changes', 'No changes have been made to your profile.');
      return;
    }

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

  // Handle cancel with unsaved changes warning
  const handleCancel = () => {
    if (hasChanges) {
      Alert.alert(
        'Unsaved Changes',
        'You have unsaved changes. Are you sure you want to cancel?',
        [
          {
            text: 'Keep Editing',
            style: 'cancel',
          },
          {
            text: 'Discard Changes',
            style: 'destructive',
            onPress: onCancel,
          },
        ]
      );
    } else {
      onCancel?.();
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={commonStyles.centeredContainer}>
        <Loading message="Updating your profile..." />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text variant="headlineSmall" style={styles.title}>
          Edit Profile
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          Update your personal information and preferences
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Personal Information */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Personal Information
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
              containerStyle={styles.fieldContainer}
            />
          </Card.Content>
        </Card>

        {/* School Information */}
        <Card style={styles.card}>
          <Card.Content>
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
              containerStyle={styles.fieldContainer}
            />

            <Dropdown
              label="School"
              value={formData.school}
              onSelect={(value) => handleFieldChange('school', value)}
              options={schoolOptions}
              error={errors.school}
              required
              containerStyle={styles.fieldContainer}
            />
          </Card.Content>
        </Card>

        {/* Academic Preferences */}
        <Card style={styles.card}>
          <Card.Content>
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
              containerStyle={styles.fieldContainer}
            />
          </Card.Content>
        </Card>

        {/* Availability */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Availability
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
          </Card.Content>
        </Card>

        {/* Account Information (Read-only) */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Account Information
            </Text>
            
            <View style={styles.readOnlyField}>
              <Text variant="bodySmall" style={styles.readOnlyLabel}>
                Email
              </Text>
              <Text variant="bodyLarge" style={styles.readOnlyValue}>
                {user.email}
              </Text>
            </View>

            <Divider style={styles.divider} />

            <View style={styles.readOnlyField}>
              <Text variant="bodySmall" style={styles.readOnlyLabel}>
                Role
              </Text>
              <Text variant="bodyLarge" style={styles.readOnlyValue}>
                {user.role === 'student' ? 'Student' : 'Volunteer'}
                {user.isAdmin && ' • Admin'}
              </Text>
            </View>

            <Divider style={styles.divider} />

            <View style={styles.readOnlyField}>
              <Text variant="bodySmall" style={styles.readOnlyLabel}>
                Member Since
              </Text>
              <Text variant="bodyLarge" style={styles.readOnlyValue}>
                {user.createdAt.toLocaleDateString()}
              </Text>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>

      {/* Action buttons */}
      <View style={styles.buttonContainer}>
        <View style={styles.buttonRow}>
          <Button
            title="Cancel"
            variant="outlined"
            onPress={handleCancel}
            style={styles.secondaryButton}
            disabled={isLoading}
          />
          
          <Button
            title="Save Changes"
            variant="contained"
            onPress={handleSubmit}
            disabled={!hasChanges || Object.keys(errors).some(key => errors[key])}
            loading={isLoading}
            style={styles.primaryButton}
          />
        </View>
        
        {hasChanges && (
          <Text variant="bodySmall" style={styles.changesIndicator}>
            You have unsaved changes
          </Text>
        )}
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
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.container,
  },
  card: {
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    elevation: 2,
  },
  sectionTitle: {
    marginBottom: spacing.lg,
    color: colors.primary,
    fontWeight: '600',
  },
  fieldContainer: {
    marginBottom: spacing.md,
  },
  readOnlyField: {
    paddingVertical: spacing.sm,
  },
  readOnlyLabel: {
    opacity: 0.6,
    marginBottom: spacing.xs,
  },
  readOnlyValue: {
    color: colors.onSurface,
  },
  divider: {
    marginVertical: spacing.sm,
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
  changesIndicator: {
    textAlign: 'center',
    marginTop: spacing.sm,
    color: colors.primary,
    fontStyle: 'italic',
  },
});

export default ProfileForm;






