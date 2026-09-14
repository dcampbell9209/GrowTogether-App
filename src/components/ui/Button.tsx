import React from 'react';
import { StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Button as PaperButton, ButtonProps as PaperButtonProps } from 'react-native-paper';
import { spacing, typography } from '@/styles';

export interface ButtonProps extends Omit<PaperButtonProps, 'children'> {
  title: string;
  variant?: 'contained' | 'outlined' | 'text';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  icon?: string;
  style?: ViewStyle;
  labelStyle?: TextStyle;
  onPress?: () => void;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'contained',
  size = 'medium',
  fullWidth = false,
  loading = false,
  disabled = false,
  icon,
  style,
  labelStyle,
  onPress,
  ...props
}) => {
  const buttonStyle = [
    styles.button,
    styles[size],
    fullWidth && styles.fullWidth,
    style,
  ];

  const textStyle = [
    styles.text,
    styles[`text${size.charAt(0).toUpperCase() + size.slice(1)}`],
    labelStyle,
  ];

  return (
    <PaperButton
      mode={variant}
      loading={loading}
      disabled={disabled || loading}
      icon={icon}
      onPress={onPress}
      style={buttonStyle}
      labelStyle={textStyle}
      contentStyle={[
        styles.content,
        styles[`content${size.charAt(0).toUpperCase() + size.slice(1)}`],
      ]}
      {...props}
    >
      {title}
    </PaperButton>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: spacing.borderRadius.medium,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Size variants
  small: {
    minHeight: spacing.button.height.small,
  },
  medium: {
    minHeight: spacing.button.height.medium,
  },
  large: {
    minHeight: spacing.button.height.large,
  },
  
  // Content size variants
  contentSmall: {
    height: spacing.button.height.small,
    paddingHorizontal: spacing.sm,
  },
  contentMedium: {
    height: spacing.button.height.medium,
    paddingHorizontal: spacing.md,
  },
  contentLarge: {
    height: spacing.button.height.large,
    paddingHorizontal: spacing.lg,
  },
  
  // Text styles
  text: {
    fontWeight: '500',
  },
  textSmall: {
    ...typography.buttonSmall,
  },
  textMedium: {
    ...typography.buttonMedium,
  },
  textLarge: {
    ...typography.buttonLarge,
  },
  
  // Full width
  fullWidth: {
    width: '100%',
  },
});

export default Button;






