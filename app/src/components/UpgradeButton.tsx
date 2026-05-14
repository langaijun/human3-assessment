/**
 * Human3.0 升级按钮组件
 */
import { useState } from 'react';
import { Crown } from 'lucide-react';
import { usePersistentVersionState } from '@/hooks/usePersistentVersionState';

const COMPLETE_COLOR = '#4CAF50';

export function UpgradeButton() {
  const [showPayment, setShowPayment] = useState(false);
  const { versionState } = usePersistentVersionState();
  const isCompleteVersion = versionState.selectedVersion === 'complete';

  const handleClick = () => {
    if (isCompleteVersion || versionState.isPaid) {
      return;
    }
    setShowPayment(true);
  };

  const handlePaymentSuccess = () => {
    setShowPayment(false);
  };

  if (isCompleteVersion || versionState.isPaid) {
    return null;
  }

  return (
    <>
      <button
        onClick={handleClick}
        className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs transition-all hover:scale-105"
        style={{
          background: COMPLETE_COLOR,
          color: '#FFFFFF',
          boxShadow: '0 4px 12px rgba(255, 152, 0, 0.1)'
        }}
      >
        <Crown className="w-3 h-3" />
        <span>升级完整版</span>
      </button>
      {showPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 text-center">
            <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 2l4 4-4h6l-4 4h6m-4 4 4-4" />
              </svg>
            </div>
            <p className="text-lg font-semibold" style={{ color: '#3D3229' }}>
              升级功能开发中
            </p>
            <p className="text-sm" style={{ color: '#8C7E6A' }}>
              支付功能正在完善中，敬请期待！
            </p>
            <button
              onClick={handlePaymentSuccess}
              className="px-6 py-3 rounded-lg text-white transition-all"
              style={{ background: '#8C7E6A' }}
            >
              好的，稍后再说
            </button>
          </div>
        </div>
      )}
    </>
  );
}
