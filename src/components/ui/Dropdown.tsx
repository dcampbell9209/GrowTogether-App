import React, { useState } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Menu, TextInput, HelperText, List } from 'react-native-paper';
import { spacing } from '@/styles';

export interface DropdownOption {
  label: string;
  value: string | number;
}

export interface DropdownProps {
  label: string;
  value: string | number | null;
  onSelect: (value: string | number) => void;
  options: DropdownOption[];
  error?: string | null;
  helperText?: string;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  style?: ViewStyle;
  containerStyle?: ViewStyle;
}

export const Dropdown: React.FC<DropdownProps> = ({
  label,
  value,
  onSelect,
  options,
  error,
  helperText,
  required = false,
  placeholder = 'Select an option',
  disabled = false,
  style,
  containerStyle,
}) => {
  const [visible, setVisible] = useState(false);
  
  const displayLabel = required ? `${label} *` : label;
  const selectedOption = options.find(option => option.value === value);
  const displayValue = selectedOption ? selectedOption.label : '';

  const openMenu = () => {
    if (!disabled) {
      setVisible(true);
    }
  };

  const closeMenu = () => setVisible(false);

  const handleSelect = (optionValue: string | number) => {
    onSelect(optionValue);
    closeMenu();
  };

  return (
    <View style={containerStyle}>
      <Menu
        visible={visible}
        onDismiss={closeMenu}
        anchor={
          <TextInput
            label={displayLabel}
            value={displayValue}
            placeholder={placeholder}
            error={!!error}
            disabled={disabled}
            mode="outlined"
            editable={false}
            right={<TextInput.Icon icon="chevron-down" onPress={openMenu} />}
            onPress={openMenu}
            style={[styles.input, style]}
          />
        }
        contentStyle={styles.menuContent}
      >
        {options.map((option) => (
          <Menu.Item
            key={option.value}
            title={option.label}
            onPress={() => handleSelect(option.value)}
            titleStyle={[
              styles.menuItem,
              option.value === value && styles.selectedMenuItem
            ]}
          />
        ))}
      </Menu>
      
      {(error || helperText) && (
        <HelperText type={error ? 'error' : 'info'} visible={!!(error || helperText)}>
          {error || helperText}
        </HelperText>
      )}
    </View>
  );
};

// Multi-select dropdown component
export interface MultiSelectDropdownProps extends Omit<DropdownProps, 'value' | 'onSelect'> {
  value: (string | number)[];
  onSelect: (values: (string | number)[]) => void;
  maxSelections?: number;
}

export const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  label,
  value,
  onSelect,
  options,
  error,
  helperText,
  required = false,
  placeholder = 'Select options',
  disabled = false,
  maxSelections,
  style,
  containerStyle,
}) => {
  const [visible, setVisible] = useState(false);
  
  const displayLabel = required ? `${label} *` : label;
  const selectedOptions = options.filter(option => value.includes(option.value));
  const displayValue = selectedOptions.length > 0 
    ? `${selectedOptions.length} selected`
    : '';

  const openMenu = () => {
    if (!disabled) {
      setVisible(true);
    }
  };

  const closeMenu = () => setVisible(false);

  const handleSelect = (optionValue: string | number) => {
    let newValue: (string | number)[];
    
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
    
    onSelect(newValue);
  };

  return (
    <View style={containerStyle}>
      <Menu
        visible={visible}
        onDismiss={closeMenu}
        anchor={
          <TextInput
            label={displayLabel}
            value={displayValue}
            placeholder={placeholder}
            error={!!error}
            disabled={disabled}
            mode="outlined"
            editable={false}
            right={<TextInput.Icon icon="chevron-down" onPress={openMenu} />}
            onPress={openMenu}
            style={[styles.input, style]}
          />
        }
        contentStyle={styles.menuContent}
      >
        {options.map((option) => (
          <Menu.Item
            key={option.value}
            title={option.label}
            onPress={() => handleSelect(option.value)}
            titleStyle={[
              styles.menuItem,
              value.includes(option.value) && styles.selectedMenuItem
            ]}
            leadingIcon={value.includes(option.value) ? 'check' : undefined}
          />
        ))}
      </Menu>
      
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
  menuContent: {
    maxHeight: 300,
  },
  menuItem: {
    fontSize: 16,
  },
  selectedMenuItem: {
    fontWeight: '600',
  },
});

export default Dropdown;






