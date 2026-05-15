/**
 * Dan Koe Intro 样式配置
 */
import { colors, spacing, borderRadius, shadows } from './tokens';

export const introStyles = {
  // 主容器
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: colors.background,
  },

  // Header
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: `${spacing.sm}px ${spacing.sm}px`,
    borderBottom: `1px solid ${colors.border}`,
  },

  // Logo
  logo: {
    width: '24px',
    height: '24px',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.text,
  },

  // Title Section
  titleSection: {
    textAlign: 'center' as const,
    marginTop: `${spacing.xl}px`,
    marginBottom: `${spacing['2xl']}px`,
  },

  title: {
    fontSize: 'clamp(1.5rem, 2.5rem, 4rem)',
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: `${spacing.sm}px`,
  },

  subtitle: {
    fontSize: '1rem',
    color: colors.textMuted,
  },

  // Three Pillars
  pillarsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: `${spacing.lg}px`,
    marginBottom: `${spacing.xl}px`,
  },

  pillarCard: {
    textAlign: 'center' as const,
    padding: `${spacing.lg}px`,
    borderRadius: `${borderRadius.lg}px`,
    backgroundColor: colors.backgroundLight,
    border: `1px solid ${colors.border}`,
    transition: 'all 0.3s ease',
  },

  pillarCardHover: {
    transform: 'scale(1.05)',
    boxShadow: shadows.md,
  },

  pillarIconWrapper: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: `0 auto ${spacing.md}px`,
    backgroundColor: `${colors.primary}15`,
  },

  pillarTitle: {
    fontWeight: '600',
    fontSize: '1.125rem',
    color: colors.text,
    marginBottom: `${spacing.sm}px`,
  },

  pillarTitleEn: {
    fontSize: '0.875rem',
    color: colors.textMuted,
    marginBottom: `${spacing.xs}px`,
  },

  pillarDescription: {
    fontSize: '0.875rem',
    lineHeight: '1.5',
    color: '#6B5F50',
  },

  // Dimension Section
  dimensionSection: {
    padding: `${spacing.lg}px`,
    borderRadius: `${borderRadius.lg}px`,
    backgroundColor: colors.backgroundLight,
    border: `1px solid ${colors.border}`,
  },

  dimensionSectionTitle: {
    fontSize: '1.125rem',
    fontWeight: '600',
    color: colors.text,
    marginBottom: `${spacing.md}px`,
  },

  dimensionSectionDescription: {
    fontSize: '0.875rem',
    lineHeight: '1.5',
    color: '#6B5F50',
    marginBottom: `${spacing.lg}px`,
  },

  dimensionItems: {
    listStyle: 'none',
    marginLeft: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: `${spacing.md}px`,
  },

  dimensionItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: `${spacing.sm}px`,
  },

  // CTA Button
  ctaSection: {
    textAlign: 'center' as const,
  },

  ctaButton: {
    padding: `${spacing.md}px ${spacing['2xl']}px`,
    borderRadius: `${borderRadius.md}px`,
    backgroundColor: colors.accent,
    color: colors.backgroundLight,
    fontWeight: '600',
    fontSize: '1rem',
    display: 'inline-flex',
    alignItems: 'center',
    gap: `${spacing.sm}px`,
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },

  ctaButtonHover: {
    filter: 'brightness(0.95)',
  },

  // Close Button
  closeButton: {
    color: colors.textMuted,
    transition: 'all 0.2s',
  },

  closeButtonHover: {
    color: colors.text,
  },

  // 辅助常量
  bg: colors.background,
  border: colors.border,
} as const;
