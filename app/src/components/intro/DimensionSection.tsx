/**
 * Dan Koe Intro - 四维度评估组件
 */
import { CheckCircle, Brain, Activity, Heart, Briefcase } from 'lucide-react';
import { INTRO_CONTENT } from '@/content/introContent';
import { colors, spacing, borderRadius, shadows, bg, border } from '@/styles/tokens';

export function DimensionSection() {
  return (
    <div style={{ ...spacing.lg, padding: `${spacing.lg}px`, borderRadius: `${borderRadius.lg}px`, backgroundColor: colors.backgroundLight, border: `1px solid ${border}` }}>
      <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: colors.text, marginBottom: `${spacing.md}px` }}>
        {INTRO_CONTENT.dimensions.title}
      </h2>
      <p style={{ fontSize: '0.875rem', lineHeight: '1.5', color: '#6B5F50', marginBottom: `${spacing.lg}px` }}>
        {INTRO_CONTENT.dimensions.description}
      </p>
      <ul style={{ listStyle: 'none', marginLeft: 0, display: 'flex', flexDirection: 'column', gap: `${spacing.md}px` }}>
        {INTRO_CONTENT.dimensions.items.map((item, index) => (
          <li key={index} style={{ display: 'flex', alignItems: 'flex-start', gap: `${spacing.sm}px` }}>
            <div
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                marginRight: `${spacing.sm}px`,
                backgroundColor: `${colors.primary}15`,
              }}
            >
              {item.icon === 'Mind' && <Brain style={{ color: colors.text }} className="w-4 h-4" />}
              {item.icon === 'Body' && <Activity style={{ color: colors.text }} className="w-4 h-4" />}
              {item.icon === 'Target' && <CheckCircle style={{ color: colors.text }} className="w-4 h-4" />}
              {item.icon === 'CheckCircle' && <Heart style={{ color: colors.text }} className="w-4 h-4" />}
            </div>
            <span>{item.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
