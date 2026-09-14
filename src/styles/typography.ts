import { TextStyle } from 'react-native';

// Font weights
export const fontWeights = {
  light: '300' as const,
  regular: '400' as const,
  medium: '500' as const,
  semiBold: '600' as const,
  bold: '700' as const,
};

// Font sizes based on Material Design 3
export const fontSizes = {
  // Display
  displayLarge: 57,
  displayMedium: 45,
  displaySmall: 36,

  // Headline
  headlineLarge: 32,
  headlineMedium: 28,
  headlineSmall: 24,

  // Title
  titleLarge: 22,
  titleMedium: 16,
  titleSmall: 14,

  // Label
  labelLarge: 14,
  labelMedium: 12,
  labelSmall: 11,

  // Body
  bodyLarge: 16,
  bodyMedium: 14,
  bodySmall: 12,

  // Custom app sizes
  caption: 12,
  overline: 10,
};

// Line heights
export const lineHeights = {
  displayLarge: 64,
  displayMedium: 52,
  displaySmall: 44,
  headlineLarge: 40,
  headlineMedium: 36,
  headlineSmall: 32,
  titleLarge: 28,
  titleMedium: 24,
  titleSmall: 20,
  labelLarge: 20,
  labelMedium: 16,
  labelSmall: 16,
  bodyLarge: 24,
  bodyMedium: 20,
  bodySmall: 16,
  caption: 16,
  overline: 16,
};

// Typography styles
export const typography: Record<string, TextStyle> = {
  // Display styles
  displayLarge: {
    fontSize: fontSizes.displayLarge,
    lineHeight: lineHeights.displayLarge,
    fontWeight: fontWeights.regular,
    letterSpacing: -0.25,
  },
  displayMedium: {
    fontSize: fontSizes.displayMedium,
    lineHeight: lineHeights.displayMedium,
    fontWeight: fontWeights.regular,
    letterSpacing: 0,
  },
  displaySmall: {
    fontSize: fontSizes.displaySmall,
    lineHeight: lineHeights.displaySmall,
    fontWeight: fontWeights.regular,
    letterSpacing: 0,
  },

  // Headline styles
  headlineLarge: {
    fontSize: fontSizes.headlineLarge,
    lineHeight: lineHeights.headlineLarge,
    fontWeight: fontWeights.regular,
    letterSpacing: 0,
  },
  headlineMedium: {
    fontSize: fontSizes.headlineMedium,
    lineHeight: lineHeights.headlineMedium,
    fontWeight: fontWeights.regular,
    letterSpacing: 0,
  },
  headlineSmall: {
    fontSize: fontSizes.headlineSmall,
    lineHeight: lineHeights.headlineSmall,
    fontWeight: fontWeights.regular,
    letterSpacing: 0,
  },

  // Title styles
  titleLarge: {
    fontSize: fontSizes.titleLarge,
    lineHeight: lineHeights.titleLarge,
    fontWeight: fontWeights.regular,
    letterSpacing: 0,
  },
  titleMedium: {
    fontSize: fontSizes.titleMedium,
    lineHeight: lineHeights.titleMedium,
    fontWeight: fontWeights.medium,
    letterSpacing: 0.15,
  },
  titleSmall: {
    fontSize: fontSizes.titleSmall,
    lineHeight: lineHeights.titleSmall,
    fontWeight: fontWeights.medium,
    letterSpacing: 0.1,
  },

  // Body styles
  bodyLarge: {
    fontSize: fontSizes.bodyLarge,
    lineHeight: lineHeights.bodyLarge,
    fontWeight: fontWeights.regular,
    letterSpacing: 0.5,
  },
  bodyMedium: {
    fontSize: fontSizes.bodyMedium,
    lineHeight: lineHeights.bodyMedium,
    fontWeight: fontWeights.regular,
    letterSpacing: 0.25,
  },
  bodySmall: {
    fontSize: fontSizes.bodySmall,
    lineHeight: lineHeights.bodySmall,
    fontWeight: fontWeights.regular,
    letterSpacing: 0.4,
  },

  // Label styles
  labelLarge: {
    fontSize: fontSizes.labelLarge,
    lineHeight: lineHeights.labelLarge,
    fontWeight: fontWeights.medium,
    letterSpacing: 0.1,
  },
  labelMedium: {
    fontSize: fontSizes.labelMedium,
    lineHeight: lineHeights.labelMedium,
    fontWeight: fontWeights.medium,
    letterSpacing: 0.5,
  },
  labelSmall: {
    fontSize: fontSizes.labelSmall,
    lineHeight: lineHeights.labelSmall,
    fontWeight: fontWeights.medium,
    letterSpacing: 0.5,
  },

  // Custom app styles
  caption: {
    fontSize: fontSizes.caption,
    lineHeight: lineHeights.caption,
    fontWeight: fontWeights.regular,
    letterSpacing: 0.4,
  },
  overline: {
    fontSize: fontSizes.overline,
    lineHeight: lineHeights.overline,
    fontWeight: fontWeights.medium,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },

  // Button styles
  buttonLarge: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: fontWeights.medium,
    letterSpacing: 0.15,
  },
  buttonMedium: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: fontWeights.medium,
    letterSpacing: 0.1,
  },
  buttonSmall: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: fontWeights.medium,
    letterSpacing: 0.5,
  },

  // Input styles
  inputLabel: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: fontWeights.regular,
    letterSpacing: 0.4,
  },
  inputText: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: fontWeights.regular,
    letterSpacing: 0.5,
  },
  inputHelper: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: fontWeights.regular,
    letterSpacing: 0.4,
  },

  // Chat styles
  chatMessage: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: fontWeights.regular,
    letterSpacing: 0.25,
  },
  chatTimestamp: {
    fontSize: 11,
    lineHeight: 16,
    fontWeight: fontWeights.regular,
    letterSpacing: 0.5,
  },
  chatSender: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: fontWeights.medium,
    letterSpacing: 0.4,
  },
};

// Font family configuration (for custom fonts if needed)
export const fontFamilies = {
  regular: 'System',
  medium: 'System',
  bold: 'System',
  // Add custom fonts here when available
  // regular: 'Inter-Regular',
  // medium: 'Inter-Medium',
  // bold: 'Inter-Bold',
};

// Utility function to get typography style
export const getTypographyStyle = (variant: keyof typeof typography): TextStyle => {
  return typography[variant] || typography.bodyMedium;
};

