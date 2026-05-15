/**
 * Dan Koe Intro - CTA 按钮组件
 */
import { ArrowRight } from 'lucide-react';
import { INTRO_CONTENT } from '@/content/introContent';
import { colors, spacing, borderRadius, bg, border } from '@/styles/tokens';

interface CTAButtonProps {
  onClick: () => void;
}

export function CTAButton({ onClick }: CTAButtonProps) {
  return (
    <div style={{ textAlign: 'center' as const, marginTop: `${spacing.xl}px` }}>
      <button
        onClick={onClick}
        style={{
          padding: `${spacing.md}px ${spacing['2xl']}px`,
          borderRadius: `${borderRadius.md}px`,
          backgroundColor: colors.accent,
          color: bg,
          fontWeight: '600',
          fontSize: '1rem',
          display: 'inline-flex',
          alignItems: 'center',
          gap: `${spacing.sm}px`,
          border: 'none',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => (e.currentTarget as HTMLButtonElement).style.cssText = `
          filter: brightness(0.95);
        `}
        onMouseLeave={(e) => (e.currentTarget as HTMLButtonElement).style.cssText = `
          filter: brightness(1);
        `}
      >
        <span className="flex items-center gap-2 text-base">
          {INTRO_CONTENT.cta.text}
          <ArrowRight className="w-5 h-5" />
        </span>
      </button>
    </div>
  );
}
