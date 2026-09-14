import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { TextInput, TextInputProps, HelperText } from 'react-native-paper';
import { spacing } from '@/styles';

export interface InputProps extends Omit<TextInputProps, 'error'> {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string | null;
  helperText?: string;
  required?: boolean;
  style?: ViewStyle;
  containerStyle?: ViewStyle;
}

export const Input: React.FC<InputProps> = ({
  label,
  value,
  onChangeText,
  error,
  helperText,
  required = false,
  style,
  containerStyle,
  ...props
}) => {
  const displayLabel = required ? `${label} *` : label;

  return (
    <View style={containerStyle}>
      <TextInput
        label={displayLabel}
        value={value}
        onChangeText={onChangeText}
        error={!!error}
        mode="outlined"
        style={[styles.input, style]}
        {...props}
      />
      {(error || helperText) && (
        <HelperText type={error ? 'error' : 'info'} visible={!!(error || helperText)}>
          {error || helperText}
        </HelperText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    marginBottom: spacing.xs,
  },
});

export default Input;
