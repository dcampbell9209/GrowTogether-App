import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import { commonStyles, spacing } from '@/styles';

interface LoadingProps {
  size?: 'small' | 'large';
  message?: string;
  fullScreen?: boolean;
  style?: ViewStyle;
  color?: string;
}

export const Loading: React.FC<LoadingProps> = ({
  size = 'large',
  message,
  fullScreen = false,
  style,
  color,
}) => {
  const containerStyle = [
    fullScreen ? commonStyles.loadingContainer : styles.container,
    style,
  ];

  return (
    <View style={containerStyle}>
      <ActivityIndicator 
        size={size} 
        color={color}
        style={styles.indicator}
      />
      {message && (
        <Text variant="bodyMedium" style={styles.message}>
          {message}
        </Text>
      )}
    </View>
  );
};

// Overlay loading component
export const LoadingOverlay: React.FC<LoadingProps> = (props) => {
  return (
    <View style={styles.overlay}>
      <View style={styles.overlayContent}>
        <Loading {...props} />
      </View>
    </View>
  );
};

// Inline loading component for buttons or small areas
export const InlineLoading: React.FC<Omit<LoadingProps, 'fullScreen'>> = ({
  size = 'small',
  color,
  style,
}) => {
  return (
    <ActivityIndicator 
      size={size} 
      color={color}
      style={[styles.inline, style]}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  indicator: {
    marginBottom: spacing.sm,
  },
  message: {
    textAlign: 'center',
    opacity: 0.7,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  overlayContent: {
    backgroundColor: 'white',
    borderRadius: spacing.borderRadius.medium,
    padding: spacing.xl,
    alignItems: 'center',
    minWidth: 120,
  },
  inline: {
    marginHorizontal: spacing.sm,
  },
});

export default Loading;





