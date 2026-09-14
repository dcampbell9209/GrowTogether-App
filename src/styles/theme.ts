import { MD3LightTheme, MD3DarkTheme, configureFonts } from 'react-native-paper';
import type { MD3Theme } from 'react-native-paper';
import { colors } from './colors';
import { typography, fontFamilies } from './typography';
import { spacing } from './spacing';

// Configure fonts for React Native Paper
const fontConfig = {
  displayLarge: {
    ...typography.displayLarge,
    fontFamily: fontFamilies.regular,
  },
  displayMedium: {
    ...typography.displayMedium,
    fontFamily: fontFamilies.regular,
  },
  displaySmall: {
    ...typography.displaySmall,
    fontFamily: fontFamilies.regular,
  },
  headlineLarge: {
    ...typography.headlineLarge,
    fontFamily: fontFamilies.regular,
  },
  headlineMedium: {
    ...typography.headlineMedium,
    fontFamily: fontFamilies.regular,
  },
  headlineSmall: {
    ...typography.headlineSmall,
    fontFamily: fontFamilies.regular,
  },
  titleLarge: {
    ...typography.titleLarge,
    fontFamily: fontFamilies.medium,
  },
  titleMedium: {
    ...typography.titleMedium,
    fontFamily: fontFamilies.medium,
  },
  titleSmall: {
    ...typography.titleSmall,
    fontFamily: fontFamilies.medium,
  },
  bodyLarge: {
    ...typography.bodyLarge,
    fontFamily: fontFamilies.regular,
  },
  bodyMedium: {
    ...typography.bodyMedium,
    fontFamily: fontFamilies.regular,
  },
  bodySmall: {
    ...typography.bodySmall,
    fontFamily: fontFamilies.regular,
  },
  labelLarge: {
    ...typography.labelLarge,
    fontFamily: fontFamilies.medium,
  },
  labelMedium: {
    ...typography.labelMedium,
    fontFamily: fontFamilies.medium,
  },
  labelSmall: {
    ...typography.labelSmall,
    fontFamily: fontFamilies.medium,
  },
};

// Light theme configuration
export const lightTheme: MD3Theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: colors.primary,
    onPrimary: colors.onPrimary,
    primaryContainer: colors.primaryContainer,
    onPrimaryContainer: colors.onPrimary,
    secondary: colors.secondary,
    onSecondary: colors.onSecondary,
    secondaryContainer: colors.secondaryContainer,
    onSecondaryContainer: colors.onSecondary,
    tertiary: colors.tertiary,
    onTertiary: colors.onTertiary,
    tertiaryContainer: colors.tertiaryContainer,
    onTertiaryContainer: colors.onTertiary,
    error: colors.error,
    onError: colors.onPrimary,
    errorContainer: colors.errorLight,
    onErrorContainer: colors.error,
    background: colors.background,
    onBackground: colors.onBackground,
    surface: colors.surface,
    onSurface: colors.onSurface,
    surfaceVariant: colors.surfaceVariant,
    onSurfaceVariant: colors.onSurfaceVariant,
    outline: colors.outline,
    outlineVariant: colors.outlineVariant,
    shadow: '#000000',
    scrim: '#000000',
    inverseSurface: '#313033',
    inverseOnSurface: '#F4EFF4',
    inversePrimary: colors.primaryLight,
    elevation: {
      level0: 'transparent',
      level1: '#F7F2FA',
      level2: '#F2EDF7',
      level3: '#ECE6F0',
      level4: '#EAE4E9',
      level5: '#E6DFE7',
    },
  },
  fonts: configureFonts({ config: fontConfig }),
};

// Dark theme configuration
export const darkTheme: MD3Theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: colors.dark.primary,
    onPrimary: colors.dark.onPrimary,
    primaryContainer: '#004881',
    onPrimaryContainer: '#CCE8FF',
    secondary: colors.dark.secondary,
    onSecondary: colors.dark.onSecondary,
    secondaryContainer: '#2E4F32',
    onSecondaryContainer: '#B8D5BC',
    tertiary: colors.dark.tertiary,
    onTertiary: '#000000',
    tertiaryContainer: '#7A5900',
    onTertiaryContainer: '#FFEDB5',
    error: colors.dark.error,
    onError: '#FFFFFF',
    errorContainer: '#8C1D18',
    onErrorContainer: '#F2B8B5',
    background: colors.dark.background,
    onBackground: colors.dark.onBackground,
    surface: colors.dark.surface,
    onSurface: colors.dark.onSurface,
    surfaceVariant: colors.dark.surfaceVariant,
    onSurfaceVariant: '#C4C7C5',
    outline: colors.dark.outline,
    outlineVariant: '#44474E',
    shadow: '#000000',
    scrim: '#000000',
    inverseSurface: '#E6E1E5',
    inverseOnSurface: '#313033',
    inversePrimary: colors.primary,
    elevation: {
      level0: 'transparent',
      level1: '#22272E',
      level2: '#2D3139',
      level3: '#373E47',
      level4: '#3B4249',
      level5: '#40474F',
    },
  },
  fonts: configureFonts({ config: fontConfig }),
};

// Extended theme with custom properties
export interface ExtendedTheme extends MD3Theme {
  spacing: typeof spacing;
  typography: typeof typography;
  custom: {
    colors: typeof colors;
    chat: {
      messageSent: string;
      messageReceived: string;
      messageSystem: string;
      messageAdmin: string;
    };
    status: {
      online: string;
      offline: string;
      away: string;
      busy: string;
    };
    role: {
      student: string;
      volunteer: string;
      admin: string;
    };
  };
}

// Create extended themes
export const createExtendedTheme = (baseTheme: MD3Theme, isDark: boolean = false): ExtendedTheme => ({
  ...baseTheme,
  spacing,
  typography,
  custom: {
    colors: isDark ? colors.dark : colors,
    chat: {
      messageSent: colors.messageSent,
      messageReceived: colors.messageReceived,
      messageSystem: colors.messageSystem,
      messageAdmin: colors.messageAdmin,
    },
    status: {
      online: colors.online,
      offline: colors.offline,
      away: colors.away,
      busy: colors.busy,
    },
    role: {
      student: colors.student,
      volunteer: colors.volunteer,
      admin: colors.admin,
    },
  },
});

export const extendedLightTheme = createExtendedTheme(lightTheme, false);
export const extendedDarkTheme = createExtendedTheme(darkTheme, true);

// Theme context type
export type ThemeMode = 'light' | 'dark' | 'system';

// Default theme
export const defaultTheme = extendedLightTheme;

// Theme utilities
export const getTheme = (mode: ThemeMode, systemColorScheme: 'light' | 'dark' = 'light'): ExtendedTheme => {
  switch (mode) {
    case 'dark':
      return extendedDarkTheme;
    case 'system':
      return systemColorScheme === 'dark' ? extendedDarkTheme : extendedLightTheme;
    case 'light':
    default:
      return extendedLightTheme;
  }
};

// Component-specific theme overrides
export const componentThemes = {
  button: {
    borderRadius: spacing.borderRadius.medium,
    minHeight: spacing.button.height.medium,
  },
  card: {
    borderRadius: spacing.borderRadius.large,
    elevation: 2,
  },
  chip: {
    borderRadius: spacing.borderRadius.round,
  },
  fab: {
    borderRadius: spacing.borderRadius.round,
  },
  textInput: {
    borderRadius: spacing.borderRadius.medium,
    minHeight: spacing.input.height,
  },
};

