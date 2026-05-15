/**
 * Human3.0 升级按钮组件
 */
import { ExternalLink } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { PAYMENT } from '@/constants';

const COMPLETE_COLOR = '#FF9800';

export function UpgradeButton() {
  const { selectedVersion, isPaid } = useAppStore();

  const handleClick = () => {
    if (isPaid) return;
    window.open(PAYMENT.PAYPAL_LINK, '_blank');
  };

  // 已付费或已选择完整版时不显示
  if (isPaid || selectedVersion === 'complete') {
    return null;
  }

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-all hover:scale-105"
      style={{
        background: COMPLETE_COLOR,
        color: '#FFFFFF',
        boxShadow: '0 2px 8px rgba(255, 152, 0, 0.15)'
      }}
    >
      <ExternalLink className="w-3 h-3" />
      <span className="font-medium">升级完整版</span>
    </button>
  );
}
