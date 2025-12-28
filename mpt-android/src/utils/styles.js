import { StyleSheet } from 'react-native';

// Common colors
export const colors = {
  primary: '#14b8a6',
  secondary: '#2563eb',
  success: '#16a34a',
  error: '#dc2626',
  warning: '#f59e0b',
  background: '#f0f9ff',
  surface: '#ffffff',
  text: '#1e293b',
  textSecondary: '#64748b',
  border: '#e2e8f0',
};

// Common dimensions
export const dimensions = {
  padding: {
    small: 8,
    medium: 16,
    large: 24,
    xlarge: 32,
  },
  borderRadius: {
    small: 8,
    medium: 12,
    large: 16,
  },
  elevation: {
    small: 2,
    medium: 4,
    large: 8,
  },
};

// Common styles
export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: dimensions.borderRadius.large,
    padding: dimensions.padding.large,
    margin: dimensions.padding.medium,
    elevation: dimensions.elevation.medium,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: dimensions.padding.medium,
  },
  subtitle: {
    fontSize: 20,
    color: colors.text,
    textAlign: 'center',
    marginBottom: dimensions.padding.medium,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: dimensions.borderRadius.medium,
    padding: dimensions.padding.medium,
    alignItems: 'center',
    elevation: dimensions.elevation.small,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  buttonDisabled: {
    backgroundColor: '#9ca3af',
  },
  buttonText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: dimensions.borderRadius.medium,
    padding: dimensions.padding.medium,
    fontSize: 16,
    backgroundColor: '#f8fafc',
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
    textAlign: 'center',
    marginTop: dimensions.padding.small,
  },
});

// Button variations
export const buttonStyles = {
  primary: commonStyles.button,
  secondary: StyleSheet.compose(commonStyles.button, {
    backgroundColor: colors.secondary,
  }),
  success: StyleSheet.compose(commonStyles.button, {
    backgroundColor: colors.success,
  }),
  error: StyleSheet.compose(commonStyles.button, {
    backgroundColor: colors.error,
  }),
  warning: StyleSheet.compose(commonStyles.button, {
    backgroundColor: colors.warning,
  }),
};

// Text variations
export const textStyles = {
  heading: StyleSheet.compose(commonStyles.title, {
    fontSize: 32,
  }),
  subheading: StyleSheet.compose(commonStyles.subtitle, {
    fontSize: 18,
  }),
  body: {
    fontSize: 16,
    color: colors.text,
  },
  caption: {
    fontSize: 14,
    color: colors.textSecondary,
  },
};
