// Color palette for GrowTogether app
export const colors = {
  // Primary brand colors
  primary: '#2196F3', // Blue - trustworthy, educational
  primaryLight: '#64B5F6',
  primaryDark: '#1976D2',
  primaryContainer: '#E3F2FD',

  // Secondary colors
  secondary: '#4CAF50', // Green - growth, success
  secondaryLight: '#81C784',
  secondaryDark: '#388E3C',
  secondaryContainer: '#E8F5E8',

  // Tertiary colors
  tertiary: '#FF9800', // Orange - energy, enthusiasm
  tertiaryLight: '#FFB74D',
  tertiaryDark: '#F57C00',
  tertiaryContainer: '#FFF3E0',

  // Background colors (with nested structure for compatibility)
  background: {
    default: '#FFFFFF',
    paper: '#FAFAFA',
  },
  
  // Surface colors
  surface: '#FAFAFA',
  surfaceVariant: '#F5F5F5',
  outline: '#E0E0E0',
  outlineVariant: '#EEEEEE',
  border: '#E0E0E0',

  // Text colors (with nested structure for compatibility)
  text: {
    primary: '#1C1C1E',
    secondary: '#49454F',
    disabled: 'rgba(0, 0, 0, 0.38)',
  },
  
  // Legacy text colors for backward compatibility
  onPrimary: '#FFFFFF',
  onSecondary: '#FFFFFF',
  onTertiary: '#000000',
  onBackground: '#1C1C1E',
  onSurface: '#1C1C1E',
  onSurfaceVariant: '#49454F',

  // Semantic colors
  success: '#4CAF50',
  successLight: '#C8E6C9',
  warning: '#FF9800',
  warningLight: '#FFE0B2',
  error: '#F44336',
  errorLight: '#FFCDD2',
  info: '#2196F3',
  infoLight: '#BBDEFB',

  // Chat colors
  messageSent: '#2196F3',
  messageReceived: '#F5F5F5',
  messageSystem: '#FFF3E0',
  messageAdmin: '#E8F5E8',

  // Status colors
  online: '#4CAF50',
  offline: '#9E9E9E',
  away: '#FF9800',
  busy: '#F44336',

  // Role-specific colors (with nested structure for compatibility)
  role: {
    student: '#2196F3',
    volunteer: '#4CAF50',
    admin: '#F44336',
  },
  
  // Legacy role colors for backward compatibility
  student: '#2196F3',
  volunteer: '#4CAF50',
  admin: '#F44336',

  // Overlay colors
  backdrop: 'rgba(0, 0, 0, 0.5)',
  overlay: 'rgba(0, 0, 0, 0.12)',
  disabled: 'rgba(0, 0, 0, 0.38)',

  // Dark theme colors (for future implementation)
  dark: {
    primary: '#90CAF9',
    secondary: '#A5D6A7',
    tertiary: '#FFCC02',
    background: '#121212',
    surface: '#1E1E1E',
    surfaceVariant: '#2C2C2C',
    onPrimary: '#000000',
    onSecondary: '#000000',
    onBackground: '#FFFFFF',
    onSurface: '#FFFFFF',
    outline: '#3C3C3C',
    error: '#CF6679',
  },
};

// Color utility functions
export const getColorWithOpacity = (color: string, opacity: number): string => {
  // Handle hex colors
  if (color.startsWith('#')) {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
  
  // Handle rgb/rgba colors
  if (color.startsWith('rgb')) {
    return color.replace('rgb(', 'rgba(').replace(')', `, ${opacity})`);
  }
  
  return color;
};

export const getRoleColor = (role: 'student' | 'volunteer' | 'admin'): string => {
  switch (role) {
    case 'student':
      return colors.student;
    case 'volunteer':
      return colors.volunteer;
    case 'admin':
      return colors.admin;
    default:
      return colors.primary;
  }
};

export const getStatusColor = (status: 'online' | 'offline' | 'away' | 'busy'): string => {
  switch (status) {
    case 'online':
      return colors.online;
    case 'offline':
      return colors.offline;
    case 'away':
      return colors.away;
    case 'busy':
      return colors.busy;
    default:
      return colors.offline;
  }
};

export const getChatStatusColor = (status: 'active' | 'student_closed' | 'volunteer_completed' | 'archived'): string => {
  switch (status) {
    case 'active':
      return colors.success;
    case 'student_closed':
    case 'volunteer_completed':
      return colors.warning;
    case 'archived':
      return colors.offline;
    default:
      return colors.primary;
  }
};

