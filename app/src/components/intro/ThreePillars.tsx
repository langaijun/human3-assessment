/**
 * Dan Koe Intro - Three Pillars Component
 */
import { Eye, Target, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { colors, spacing, borderRadius, shadows } from '@/styles/tokens';

export function ThreePillars() {
  const { t } = useTranslation();

  const pillars = [
    {
      id: 'vision',
      title: t('pillars.vision'),
      description: t('pillars.visionDesc'),
    },
    {
      id: 'clarity',
      title: t('pillars.clarity'),
      description: t('pillars.clarityDesc'),
    },
    {
      id: 'identity',
      title: t('pillars.identity'),
      description: t('pillars.identityDesc'),
    },
  ];

  return (
    <div style={{ backgroundColor: colors.background, padding: `${spacing.md}px`, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: `${spacing.md}px`, marginBottom: `${spacing.lg}px` }}>
      {pillars.map((pillar) => (
        <div
          key={pillar.id}
          style={{
            padding: `${spacing.md}px`,
            borderRadius: `${borderRadius.md}px`,
            backgroundColor: colors.backgroundCard,
            border: `1px solid ${colors.border}`,
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget as HTMLDivElement).style.cssText = `
            padding: ${spacing.md}px;
            borderRadius: ${borderRadius.md}px;
            backgroundColor: colors.backgroundLight;
            border: 1px solid ${colors.border};
            transform: scale(1.02);
            box-shadow: ${shadows.md};
          `}
          onMouseLeave={(e) => (e.currentTarget as HTMLDivElement).style.cssText = `
            padding: ${spacing.md}px;
            borderRadius: ${borderRadius.md}px;
            backgroundColor: colors.backgroundLight;
            border: 1px solid ${colors.border};
          `}
        >
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: `0 auto ${spacing.sm}px`,
            backgroundColor: `${colors.primary}15`,
          }}>
            {pillar.id === 'vision' && <Eye style={{ color: colors.text }} className="w-6 h-6" />}
            {pillar.id === 'clarity' && <Target style={{ color: colors.text }} className="w-6 h-6" />}
            {pillar.id === 'identity' && <User style={{ color: colors.text }} className="w-6 h-6" />}
          </div>
          <h3 style={{ fontWeight: '600', fontSize: '1rem', color: colors.text, marginBottom: `${spacing.xs}px` }}>{pillar.title}</h3>
          <p style={{ fontSize: '0.75rem', lineHeight: '1.4', color: '#6B5F50' }}>{pillar.description}</p>
        </div>
      ))}
    </div>
  );
}