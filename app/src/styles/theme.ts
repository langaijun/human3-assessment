/**
 * Global Theme Configuration
 */
import { colors, spacing, borderRadius, shadows } from './tokens';

export const theme = {
  ...colors,
  ...spacing,
  ...borderRadius,
  ...shadows,
} as const;

export const commonStyles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },

  text: {
    fontSize: '0.875rem',
    lineHeight: '1.5',
  },

  textSmall: {
    fontSize: '0.75rem',
    lineHeight: '1.4',
  },

  textXs: {
    fontSize: '0.6875rem',
    lineHeight: '1.3',
  },
} as const;
