// Spacing system based on 8pt grid
export const spacing = {
  // Base unit (8px)
  unit: 8,
  
  // Spacing scale
  xs: 4,    // 0.5 * unit
  sm: 8,    // 1 * unit
  md: 16,   // 2 * unit
  lg: 24,   // 3 * unit
  xl: 32,   // 4 * unit
  xxl: 40,  // 5 * unit
  xxxl: 48, // 6 * unit
  
  // Semantic spacing
  none: 0,
  tiny: 2,
  small: 4,
  medium: 8,
  large: 16,
  xlarge: 24,
  xxlarge: 32,
  xxxlarge: 40,
  huge: 48,
  xhuge: 56,
  xxhuge: 64,
  
  // Component-specific spacing
  container: 16,      // Default container padding
  containerLarge: 24, // Large screen container padding
  section: 32,        // Section spacing
  element: 16,        // Element spacing
  component: 8,       // Component internal spacing
  
  // Layout spacing
  screenPadding: 16,
  screenPaddingHorizontal: 16,
  screenPaddingVertical: 24,
  
  // Card spacing
  cardPadding: 16,
  cardMargin: 8,
  cardSpacing: 12,
  
  // List spacing
  listItemPadding: 16,
  listItemSpacing: 8,
  listSectionSpacing: 24,
  
  // Form spacing
  formFieldSpacing: 16,
  formSectionSpacing: 24,
  formButtonSpacing: 32,
  
  // Chat spacing
  messageBubblePadding: 12,
  messageSpacing: 8,
  chatInputPadding: 16,
  
  // Tab bar and navigation
  tabBarHeight: 60,
  headerHeight: 56,
  bottomSheetHandle: 4,
  
  // Border radius
  borderRadius: {
    none: 0,
    small: 4,
    medium: 8,
    large: 12,
    xlarge: 16,
    round: 999,
  },
  
  // Icon sizes
  iconSize: {
    tiny: 12,
    small: 16,
    medium: 24,
    large: 32,
    xlarge: 40,
    huge: 48,
  },
  
  // Avatar sizes
  avatarSize: {
    small: 32,
    medium: 40,
    large: 56,
    xlarge: 80,
  },
  
  // Button dimensions
  button: {
    height: {
      small: 32,
      medium: 40,
      large: 48,
    },
    minWidth: {
      small: 64,
      medium: 80,
      large: 120,
    },
    padding: {
      horizontal: 16,
      vertical: 8,
    },
  },
  
  // Input dimensions
  input: {
    height: 48,
    padding: 16,
    marginBottom: 16,
  },
  
  // Modal and overlay
  modal: {
    padding: 24,
    borderRadius: 16,
    maxWidth: 400,
  },
  
  // Safe area
  safeArea: {
    top: 44,    // iOS status bar height
    bottom: 34, // iOS home indicator height
  },
};

// Utility functions for spacing
export const getSpacing = (multiplier: number): number => {
  return spacing.unit * multiplier;
};

export const getHorizontalSpacing = (size: keyof typeof spacing): number => {
  return typeof spacing[size] === 'number' ? spacing[size] as number : spacing.medium;
};

export const getVerticalSpacing = (size: keyof typeof spacing): number => {
  return typeof spacing[size] === 'number' ? spacing[size] as number : spacing.medium;
};

// Responsive spacing helpers
export const responsiveSpacing = {
  // Responsive padding based on screen size
  getResponsivePadding: (baseSize: number, screenWidth: number) => {
    if (screenWidth < 375) return baseSize * 0.8;  // Small phones
    if (screenWidth > 768) return baseSize * 1.2;  // Tablets
    return baseSize; // Default phones
  },
  
  // Responsive margin based on screen size
  getResponsiveMargin: (baseSize: number, screenWidth: number) => {
    if (screenWidth < 375) return baseSize * 0.8;
    if (screenWidth > 768) return baseSize * 1.5;
    return baseSize;
  },
};

// Common spacing combinations
export const spacingCombinations = {
  // Card spacing
  card: {
    padding: spacing.cardPadding,
    margin: spacing.cardMargin,
    borderRadius: spacing.borderRadius.medium,
  },
  
  // List item spacing
  listItem: {
    paddingHorizontal: spacing.listItemPadding,
    paddingVertical: spacing.listItemSpacing,
    marginBottom: spacing.tiny,
  },
  
  // Form field spacing
  formField: {
    marginBottom: spacing.formFieldSpacing,
    paddingHorizontal: spacing.input.padding,
    height: spacing.input.height,
  },
  
  // Screen container spacing
  screenContainer: {
    paddingHorizontal: spacing.screenPaddingHorizontal,
    paddingVertical: spacing.screenPaddingVertical,
  },
  
  // Modal spacing
  modalContainer: {
    padding: spacing.modal.padding,
    borderRadius: spacing.modal.borderRadius,
    maxWidth: spacing.modal.maxWidth,
  },
};

