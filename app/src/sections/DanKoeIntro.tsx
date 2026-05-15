/**
 * Human3.0 框架介绍页面 - 重构版
 */
import { ArrowLeft } from 'lucide-react';
import { introStyles } from '@/styles/introStyles';
import { spacing, colors } from '@/styles/tokens';
import { ThreePillars } from '@/components/intro/ThreePillars';
import { DimensionSection } from '@/components/intro/DimensionSection';

interface DanKoeIntroProps {
  onClose: () => void;
}

export default function DanKoeIntro({ onClose }: DanKoeIntroProps) {
  return (
    <div style={introStyles.container}>
      {/* Header with back button */}
      <div style={introStyles.header}>
        <button onClick={onClose} className="p-1">
          <ArrowLeft className="w-6 h-6" style={{ color: colors.text }} />
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
          }}
        >
          {/* Title */}
          <div style={{ textAlign: 'center' as const, marginBottom: `${spacing.xl}px` }}>
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
        </div>
      </div>
    </div>
  );
}
