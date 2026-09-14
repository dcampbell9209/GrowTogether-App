// Export all styling modules
export * from './colors';
export * from './typography';
export * from './spacing';
export * from './theme';

// Common style utilities
import { ViewStyle, TextStyle, ImageStyle } from 'react-native';
import { spacing } from './spacing';
import { colors } from './colors';

// Common style combinations
export const commonStyles = {
  // Container styles
  container: {
    flex: 1,
    backgroundColor: colors.background,
  } as ViewStyle,

  screenContainer: {
    flex: 1,
    paddingHorizontal: spacing.screenPaddingHorizontal,
    paddingVertical: spacing.screenPaddingVertical,
    backgroundColor: colors.background,
  } as ViewStyle,

  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  } as ViewStyle,

  // Card styles
  card: {
    backgroundColor: colors.surface,
    borderRadius: spacing.borderRadius.medium,
    padding: spacing.cardPadding,
    marginBottom: spacing.cardMargin,
    shadowColor: colors.onSurface,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  } as ViewStyle,

  // List styles
  listItem: {
    paddingHorizontal: spacing.listItemPadding,
    paddingVertical: spacing.listItemSpacing,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.outline,
  } as ViewStyle,

  // Form styles
  formContainer: {
    padding: spacing.container,
  } as ViewStyle,

  formField: {
    marginBottom: spacing.formFieldSpacing,
  } as ViewStyle,

  // Button styles
  buttonContainer: {
    marginVertical: spacing.component,
  } as ViewStyle,

  // Text styles
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: 4,
  } as TextStyle,

  helperText: {
    color: colors.onSurfaceVariant,
    fontSize: 12,
    marginTop: 4,
  } as TextStyle,

  // Loading styles
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  } as ViewStyle,

  // Header styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.container,
    paddingVertical: spacing.medium,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.outline,
  } as ViewStyle,

  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.onSurface,
  } as TextStyle,

  // Chat styles
  chatContainer: {
    flex: 1,
    backgroundColor: colors.background,
  } as ViewStyle,

  messageBubble: {
    maxWidth: '80%',
    padding: spacing.messageBubblePadding,
    marginVertical: spacing.tiny,
    borderRadius: spacing.borderRadius.large,
  } as ViewStyle,

  messageSent: {
    backgroundColor: colors.messageSent,
    alignSelf: 'flex-end',
    marginRight: spacing.medium,
  } as ViewStyle,

  messageReceived: {
    backgroundColor: colors.messageReceived,
    alignSelf: 'flex-start',
    marginLeft: spacing.medium,
  } as ViewStyle,

  // Avatar styles
  avatar: {
    width: spacing.avatarSize.medium,
    height: spacing.avatarSize.medium,
    borderRadius: spacing.avatarSize.medium / 2,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,

  avatarText: {
    color: colors.onPrimary,
    fontSize: 16,
    fontWeight: '600',
  } as TextStyle,

  // Badge styles
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: colors.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,

  badgeText: {
    color: colors.onPrimary,
    fontSize: 10,
    fontWeight: '600',
  } as TextStyle,

  // Separator styles
  separator: {
    height: 1,
    backgroundColor: colors.outline,
    marginVertical: spacing.small,
  } as ViewStyle,

  // Empty state styles
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xxl,
  } as ViewStyle,

  emptyStateText: {
    textAlign: 'center',
    color: colors.onSurfaceVariant,
    fontSize: 16,
    marginTop: spacing.medium,
  } as TextStyle,

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.backdrop,
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,

  modalContainer: {
    backgroundColor: colors.surface,
    borderRadius: spacing.modal.borderRadius,
    padding: spacing.modal.padding,
    maxWidth: spacing.modal.maxWidth,
    width: '90%',
    maxHeight: '80%',
  } as ViewStyle,

  // Shadow styles
  shadow: {
    shadowColor: colors.onSurface,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  } as ViewStyle,

  shadowLarge: {
    shadowColor: colors.onSurface,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  } as ViewStyle,
};

// Utility functions
export const createStyle = <T extends ViewStyle | TextStyle | ImageStyle>(style: T): T => style;

export const mergeStyles = <T extends ViewStyle | TextStyle | ImageStyle>(...styles: (T | undefined)[]): T => {
  return Object.assign({}, ...styles.filter(Boolean)) as T;
};

// Responsive utilities
export const isTablet = (screenWidth: number): boolean => screenWidth >= 768;
export const isLargePhone = (screenWidth: number): boolean => screenWidth >= 414;
export const isSmallPhone = (screenWidth: number): boolean => screenWidth < 375;

