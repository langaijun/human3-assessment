/**
 * Human3.0 框架介绍页面 - 重构版
 */
import { X } from 'lucide-react';
import { introStyles } from '@/styles/introStyles';
import { spacing } from '@/styles/tokens';
import { ThreePillars } from '@/components/intro/ThreePillars';
import { DimensionSection } from '@/components/intro/DimensionSection';
import { CTAButton } from '@/components/intro/CTAButton';

interface DanKoeIntroProps {
  onClose: () => void;
  onStartAssessment: (initialInput?: string) => void;
}

export default function DanKoeIntro({ onClose, onStartAssessment }: DanKoeIntroProps) {
  return (
    <div style={introStyles.container}>
      {/* Header */}
      <div style={introStyles.header}>
        <div style={introStyles.logo}>
          <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: introStyles.container.backgroundColor }}>H</span>
        </div>
        <button onClick={onClose}>
          <X
            className="w-6 h-6"
            style={{ color: introStyles.closeButton.color }}
          />
        </button>
      </div>

      {/* Content */}
      <div
        style={{
          flex: 1,
          padding: `${spacing.md}px ${spacing.md}px`,
          overflowY: 'auto',
        }}
      >
        <div
          style={{
            maxWidth: '48rem',
            margin: '0 auto',
            paddingBottom: `${spacing.md}px`,
            ...introStyles.titleSection,
          }}
        >
          {/* Title */}
          <div style={{ ...introStyles.titleSection, textAlign: 'center' as const }}>
            <h1 style={introStyles.title}>
              思想框架
            </h1>
            <p style={introStyles.subtitle}>
              重塑你的思维模型
            </p>
          </div>

          {/* Three Pillars */}
          <ThreePillars />

          {/* Assessment Dimensions */}
          <DimensionSection />

          {/* CTA */}
          <div style={{ textAlign: 'center', marginTop: `${spacing.xl}px` }}>
            <CTAButton onClick={() => onStartAssessment?.()} />
          </div>
        </div>
      </div>
    </div>
  );
}
