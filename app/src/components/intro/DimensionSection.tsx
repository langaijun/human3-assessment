/**
 * Dan Koe Intro - Four Dimension Assessment Component
 */
import { CheckCircle, Brain, Activity, Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { colors, spacing, borderRadius } from '@/styles/tokens';

export function DimensionSection() {
  const { t } = useTranslation();

  const items = [
    { icon: 'Mind', label: `${t('dimensions.mind')} - ${t('dimensions.mindEn')}` },
    { icon: 'Body', label: `${t('dimensions.body')} - ${t('dimensions.bodyEn')}` },
    { icon: 'Target', label: `${t('dimensions.spirit')} - ${t('dimensions.spiritEn')}` },
    { icon: 'CheckCircle', label: `${t('dimensions.vocation')} - ${t('dimensions.vocationEn')}` },
  ];

  return (
    <div style={{ padding: `${spacing.lg}px`, borderRadius: `${borderRadius.lg}px`, backgroundColor: colors.backgroundLight, border: `1px solid ${colors.border}` }}>
      <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: colors.text, marginBottom: `${spacing.md}px` }}>
        {t('danKoeIntro.framework')}
      </h2>
      <p style={{ fontSize: '0.875rem', lineHeight: '1.5', color: '#6B5F50', marginBottom: `${spacing.lg}px` }}>
        {t('danKoeIntro.frameworkDescription')}
      </p>
      <ul style={{ listStyle: 'none', marginLeft: 0, display: 'flex', flexDirection: 'column', gap: `${spacing.md}px` }}>
        {items.map((item, index) => (
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