import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Text, Checkbox, HelperText } from 'react-native-paper';
import { spacing, colors } from '@/styles';

export interface CheckboxOption {
  label: string;
  value: string;
}

export interface CheckboxGroupProps {
  label: string;
  options: CheckboxOption[];
  value: string[];
  onChange: (values: string[]) => void;
  error?: string | null;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  containerStyle?: ViewStyle;
  direction?: 'row' | 'column';
  maxSelections?: number;
}

export const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  label,
  options,
  value,
  onChange,
  error,
  helperText,
  required = false,
  disabled = false,
  style,
  containerStyle,
  direction = 'column',
  maxSelections,
}) => {
  const displayLabel = required ? `${label} *` : label;

  const handleToggle = (optionValue: string) => {
    if (disabled) return;

    let newValue: string[];
    
    if (value.includes(optionValue)) {
      // Remove if already selected
      newValue = value.filter(v => v !== optionValue);
    } else {
      // Add if not selected and within max limit
      if (!maxSelections || value.length < maxSelections) {
        newValue = [...value, optionValue];
      } else {
        return; // Don't add if max selections reached
      }
    }
    
    onChange(newValue);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <Text variant="bodyMedium" style={[styles.label, error && styles.errorLabel]}>
        {displayLabel}
      </Text>
      
      <View style={[
        styles.optionsContainer,
        direction === 'row' && styles.rowContainer,
        style
      ]}>
        {options.map((option) => {
          const isChecked = value.includes(option.value);
          const isDisabled = disabled || (
            !isChecked && 
            maxSelections && 
            value.length >= maxSelections
          );

          return (
            <View 
              key={option.value} 
              style={[
                styles.optionContainer,
                direction === 'row' && styles.rowOption
              ]}
            >
              <Checkbox
                status={isChecked ? 'checked' : 'unchecked'}
                onPress={() => handleToggle(option.value)}
                disabled={isDisabled}
              />
              <Text 
                variant="bodyMedium" 
                style={[
                  styles.optionLabel,
                  isDisabled && styles.disabledLabel
                ]}
                onPress={() => handleToggle(option.value)}
              >
                {option.label}
              </Text>
            </View>
          );
        })}
      </View>

      {maxSelections && (
        <Text variant="bodySmall" style={styles.maxSelectionsText}>
          Maximum {maxSelections} selections allowed
        </Text>
      )}
      
      {(error || helperText) && (
        <HelperText type={error ? 'error' : 'info'} visible={!!(error || helperText)}>
          {error || helperText}
        </HelperText>
      )}
    </View>
  );
};

// Specialized component for days of the week
export interface DaysSelectorProps {
  label?: string;
  value: { [key: string]: boolean };
  onChange: (value: { [key: string]: boolean }) => void;
  error?: string | null;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  containerStyle?: ViewStyle;
}

export const DaysSelector: React.FC<DaysSelectorProps> = ({
  label = 'Days Available',
  value,
  onChange,
  error,
  helperText,
  required = false,
  disabled = false,
  style,
  containerStyle,
}) => {
  const daysOptions: CheckboxOption[] = [
    { label: 'Monday', value: 'mon' },
    { label: 'Tuesday', value: 'tue' },
    { label: 'Wednesday', value: 'wed' },
    { label: 'Thursday', value: 'thu' },
    { label: 'Friday', value: 'fri' },
    { label: 'Saturday', value: 'sat' },
    { label: 'Sunday', value: 'sun' },
  ];

  const selectedDays = Object.keys(value).filter(day => value[day]);

  const handleChange = (selectedValues: string[]) => {
    const newValue = { ...value };
    
    // Reset all days to false
    Object.keys(newValue).forEach(day => {
      newValue[day] = false;
    });
    
    // Set selected days to true
    selectedValues.forEach(day => {
      newValue[day] = true;
    });
    
    onChange(newValue);
  };

  return (
    <CheckboxGroup
      label={label}
      options={daysOptions}
      value={selectedDays}
      onChange={handleChange}
      error={error}
      helperText={helperText}
      required={required}
      disabled={disabled}
      style={style}
      containerStyle={containerStyle}
      direction="column"
    />
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    marginBottom: spacing.sm,
    fontWeight: '500',
    color: colors.onSurface,
  },
  errorLabel: {
    color: colors.error,
  },
  optionsContainer: {
    marginBottom: spacing.xs,
  },
  rowContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  rowOption: {
    marginRight: spacing.md,
    marginBottom: spacing.sm,
  },
  optionLabel: {
    marginLeft: spacing.xs,
    flex: 1,
    color: colors.onSurface,
  },
  disabledLabel: {
    opacity: 0.5,
  },
  maxSelectionsText: {
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
    opacity: 0.7,
    fontStyle: 'italic',
  },
});

export default CheckboxGroup;






