import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Card, Switch, List } from 'react-native-paper';
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
import { Subject, Grade, User, VolunteerProfile } from '@/types';
import { spacing, colors, commonStyles } from '@/styles';

// Form data interface
export interface VolunteerProfileFormData {
  subjectsToTutor: string[];
  gradeLevelsComfortable: number[];
  isDiscoverable: boolean;
}

// Form props
export interface VolunteerProfileFormProps {
  user: User;
  volunteerProfile: VolunteerProfile | null;
  onSubmit: (data: VolunteerProfileFormData) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

export const VolunteerProfileForm: React.FC<VolunteerProfileFormProps> = ({
  user,
  volunteerProfile,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<VolunteerProfileFormData>({
    subjectsToTutor: volunteerProfile?.subjectsToTutor || [],
    gradeLevelsComfortable: volunteerProfile?.gradeLevelsComfortable || [],
    isDiscoverable: volunteerProfile?.isDiscoverable || false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hasChanges, setHasChanges] = useState(false);

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

  // Check if form has changes
  const checkForChanges = (newData: VolunteerProfileFormData) => {
    if (!volunteerProfile) {
      setHasChanges(true);
      return;
    }

    const hasDataChanges = 
      JSON.stringify(newData.subjectsToTutor.sort()) !== JSON.stringify(volunteerProfile.subjectsToTutor.sort()) ||
      JSON.stringify(newData.gradeLevelsComfortable.sort()) !== JSON.stringify(volunteerProfile.gradeLevelsComfortable.sort()) ||
      newData.isDiscoverable !== volunteerProfile.isDiscoverable;
    
    setHasChanges(hasDataChanges);
  };

  // Handle field change
  const handleFieldChange = (field: keyof VolunteerProfileFormData, value: any) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);
    checkForChanges(newFormData);

    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!hasChanges && volunteerProfile) {
      Alert.alert('No Changes', 'No changes have been made to your volunteer profile.');
      return;
    }

    // Validate required fields only
    const requiredData = {
      subjectsToTutor: formData.subjectsToTutor,
      gradeLevelsComfortable: formData.gradeLevelsComfortable,
    };

    const { data, errors: validationErrors } = validateForm(volunteerSetupSchema, requiredData);
    
    if (validationErrors.length > 0) {
      const newErrors: Record<string, string> = {};
      validationErrors.forEach(error => {
        newErrors[error.field] = error.message;
      });
      setErrors(newErrors);
      return;
    }

    if (data) {
      await onSubmit(formData);
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

  // Toggle discoverability with confirmation
  const handleDiscoverabilityToggle = (value: boolean) => {
    if (!value) {
      Alert.alert(
        'Hide from Students',
        'Are you sure you want to hide your profile from students? They won\'t be able to find you for tutoring help.',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Hide Profile',
            onPress: () => handleFieldChange('isDiscoverable', false),
          },
        ]
      );
    } else {
      // Check if profile is complete before making discoverable
      if (formData.subjectsToTutor.length === 0 || formData.gradeLevelsComfortable.length === 0) {
        Alert.alert(
          'Incomplete Profile',
          'Please select at least one subject and grade level before making your profile discoverable.',
          [{ text: 'OK' }]
        );
        return;
      }
      handleFieldChange('isDiscoverable', true);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={commonStyles.centeredContainer}>
        <Loading message="Updating your volunteer profile..." />
      </SafeAreaView>
    );
  }

  const isProfileComplete = formData.subjectsToTutor.length > 0 && formData.gradeLevelsComfortable.length > 0;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text variant="headlineSmall" style={styles.title}>
          Volunteer Profile
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          Manage your tutoring preferences and availability
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Status Card */}
        <Card style={[styles.card, styles.statusCard]}>
          <Card.Content>
            <View style={styles.statusRow}>
              <View style={styles.statusInfo}>
                <Text variant="titleMedium" style={styles.statusTitle}>
                  Profile Status
                </Text>
                <Text variant="bodyMedium" style={styles.statusText}>
                  {isProfileComplete 
                    ? (formData.isDiscoverable ? 'Active - Visible to students' : 'Complete - Hidden from students')
                    : 'Incomplete - Not visible to students'
                  }
                </Text>
              </View>
              <View style={styles.statusIndicator}>
                <View style={[
                  styles.statusDot,
                  { backgroundColor: isProfileComplete && formData.isDiscoverable ? colors.success : colors.warning }
                ]} />
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Tutoring Preferences */}
        <Card style={styles.card}>
          <Card.Content>
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
          </Card.Content>
        </Card>

        {/* Visibility Settings */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Visibility Settings
            </Text>
            
            <List.Item
              title="Discoverable by Students"
              description={formData.isDiscoverable 
                ? "Students can find and message you for tutoring help"
                : "Your profile is hidden from students"
              }
              left={(props) => <List.Icon {...props} icon="eye" />}
              right={() => (
                <Switch
                  value={formData.isDiscoverable}
                  onValueChange={handleDiscoverabilityToggle}
                  disabled={!isProfileComplete}
                />
              )}
            />

            {!isProfileComplete && (
              <Text variant="bodySmall" style={styles.warningText}>
                Complete your tutoring preferences to become discoverable
              </Text>
            )}
          </Card.Content>
        </Card>

        {/* Guidelines Reminder */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              📝 Volunteer Guidelines
            </Text>
            <View style={styles.guidelinesList}>
              <Text variant="bodyMedium" style={styles.guideline}>
                • Be patient and encouraging with students
              </Text>
              <Text variant="bodyMedium" style={styles.guideline}>
                • Focus on helping them understand concepts
              </Text>
              <Text variant="bodyMedium" style={styles.guideline}>
                • Keep conversations educational and appropriate
              </Text>
              <Text variant="bodyMedium" style={styles.guideline}>
                • Complete sessions to earn volunteer hours
              </Text>
            </View>
          </Card.Content>
        </Card>

        {/* Statistics (if volunteer profile exists) */}
        {volunteerProfile && (
          <Card style={styles.card}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Your Impact
              </Text>
              <View style={styles.statsGrid}>
                <View style={styles.statItem}>
                  <Text variant="headlineSmall" style={styles.statNumber}>
                    0
                  </Text>
                  <Text variant="bodySmall" style={styles.statLabel}>
                    Students Helped
                  </Text>
                </View>
                <View style={styles.statItem}>
                  <Text variant="headlineSmall" style={styles.statNumber}>
                    0
                  </Text>
                  <Text variant="bodySmall" style={styles.statLabel}>
                    Hours Volunteered
                  </Text>
                </View>
                <View style={styles.statItem}>
                  <Text variant="headlineSmall" style={styles.statNumber}>
                    0
                  </Text>
                  <Text variant="bodySmall" style={styles.statLabel}>
                    Sessions Completed
                  </Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        )}
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
  statusCard: {
    backgroundColor: colors.surfaceVariant,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusInfo: {
    flex: 1,
  },
  statusTitle: {
    marginBottom: spacing.xs,
    color: colors.onSurface,
    fontWeight: '600',
  },
  statusText: {
    opacity: 0.8,
  },
  statusIndicator: {
    alignItems: 'center',
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  sectionTitle: {
    marginBottom: spacing.lg,
    color: colors.primary,
    fontWeight: '600',
  },
  fieldContainer: {
    marginBottom: spacing.md,
  },
  warningText: {
    color: colors.warning,
    fontStyle: 'italic',
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  guidelinesList: {
    gap: spacing.sm,
  },
  guideline: {
    opacity: 0.8,
    lineHeight: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  statLabel: {
    opacity: 0.7,
    textAlign: 'center',
    marginTop: spacing.xs,
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

export default VolunteerProfileForm;






