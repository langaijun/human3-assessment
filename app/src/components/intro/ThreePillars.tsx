/**
 * Dan Koe Intro - 三大支柱组件
 */
import { Eye, Target, User } from 'lucide-react';
import { INTRO_CONTENT } from '@/content/introContent';
import { colors, spacing, borderRadius, shadows, bg, border } from '@/styles/tokens';

export function ThreePillars() {
  return (
    <div style={{ ...bg, ...spacing.lg, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: `${spacing.lg}px`, marginBottom: `${spacing.xl}px` }}>
      {INTRO_CONTENT.threePillars.map((pillar) => (
        <div
          key={pillar.id}
          style={{
            padding: `${spacing.lg}px`,
            borderRadius: `${borderRadius.lg}px`,
            backgroundColor: bg,
            border: `1px solid ${border}`,
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget as HTMLDivElement).style.cssText = `
            padding: ${spacing.lg}px;
            borderRadius: ${borderRadius.lg}px;
            backgroundColor: colors.backgroundLight;
            border: 1px solid ${colors.border};
            transform: scale(1.05);
            box-shadow: ${shadows.md};
          `}
          onMouseLeave={(e) => (e.currentTarget as HTMLDivElement).style.cssText = `
            padding: ${spacing.lg}px;
            borderRadius: ${borderRadius.lg}px`;
            backgroundColor: colors.backgroundLight;
            border: 1px solid ${colors.border};
          `}
        >
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: `0 auto ${spacing.md}px`,
            backgroundColor: `${colors.primary}15`,
          }}>
            {pillar.id === 'vision' && <Eye style={{ color: colors.text }} className="w-8 h-8" />}
            {pillar.id === 'clarity' && <Target style={{ color: colors.text }} className="w-8 h-8" />}
            {pillar.id === 'identity' && <User style={{ color: colors.text }} className="w-8 h-8" />}
          </div>
          <h3 style={{ fontWeight: '600', fontSize: '1.125rem', color: colors.text, marginBottom: `${spacing.sm}px` }}>{pillar.title}</h3>
          <p style={{ fontSize: '0.875rem', color: colors.textMuted, marginBottom: `${spacing.xs}px` }}>{pillar.titleEn}</p>
          <p style={{ fontSize: '0.875rem', lineHeight: '1.5', color: '#6B5F50' }}>{pillar.description}</p>
        </div>
      ))}
    </div>
  );
}
