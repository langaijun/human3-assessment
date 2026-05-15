/**
 * Design Tokens - 设计系统变量
 */

export const colors = {
  // 主色调
  primary: '#8C7E6A',
  secondary: '#6B5F50',
  accent: '#C4956A',

  // 背景色
  background: '#FDF6E3',
  backgroundCard: '#F8F0D8',
  backgroundLight: '#FFFFFF',

  // 文字色
  text: '#3D3229',
  textMuted: '#8C7E6A',
  textLight: '#6B5F50',
  textDark: '#4A4035',

  // 边框色
  border: '#E8DCC8',
  borderLight: '#F0E6D0',

  // 状态色
  success: '#4CAF50',
  warning: '#FF9800',
  danger: '#EF4444',

  // 支付色
  complete: '#FF9800',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
} as const;

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
} as const;

export const shadows = {
  sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
  md: '0 4px 8px rgba(0, 0, 0, 0.08)',
  lg: '0 8px 16px rgba(0, 0, 0, 0.12)',
} as const;
