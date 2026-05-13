/**
 * Human3.0 系统支付成功提示组件
 */
import { useEffect, useState } from 'react';
import { CheckCircle, Sparkles, ArrowRight } from 'lucide-react';
import { useVersion } from '@/context/VersionContext';

interface PaymentSuccessProps {
  onComplete?: () => void;
  autoDelay?: number;
  showButton?: boolean;
}

export default function PaymentSuccess({
  onComplete,
  autoDelay = 2000,
  showButton = false
}: PaymentSuccessProps) {
  const { state, actions } = useVersion();
  const [showConfetti, setShowConfetti] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    actions.setPaidStatus(true);
    actions.setPaymentStatus('success');

    setTimeout(() => setShowConfetti(true), 200);

    if (!showButton && onComplete) {
      const timer = setTimeout(() => {
        onComplete();
      }, autoDelay);
      return () => clearTimeout(timer);
    }
  }, [actions, onComplete, autoDelay, showButton]);

  useEffect(() => {
    if (showConfetti && progress < 100) {
      const timer = setTimeout(() => {
        setProgress(p => Math.min(p + 5, 100));
      }, 50);
      return () => clearTimeout(timer);
    }
    return () => { if (timer) clearTimeout(timer); };
  }, [showConfetti, progress]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: '#FDF6E3' }}>
      {showConfetti && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.1}s`,
                opacity: 1 - (progress / 100)
              }}
            >
              <Sparkles
                className="w-4 h-4"
                style={{
                  color: ['#4CAF50', '#2196F3', '#FF9800', '#9C27B0'][i % 4],
                  transform: `rotate(${i * 18}deg)`
                }}
              />
            </div>
          ))}
        </div>
      )}

      <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500"
          style={{
            background: `conic-gradient(from 0deg, #4CAF50 ${progress * 3.6}deg, #E8F5E9 ${progress * 3.6}deg)`,
            boxShadow: showConfetti ? '0 0 30px rgba(76, 175, 80, 0.5)' : 'none',
            transform: showConfetti ? 'scale(1.1)' : 'scale(1)'
          }}
        >
          <div className="w-14 h-14 rounded-full flex items-center justify-center bg-white">
            {showConfetti ? (
              <CheckCircle className="w-8 h-8 text-green-500" />
            ) : (
              <div className="w-6 h-6 border-2 border-green-500 rounded-full animate-spin" />
            )}
          </div>
        </div>

        <div className="mt-8 text-center">
          <h2 className="text-2xl font-bold mb-2" style={{ color: '#3D3229' }}>
            升级成功！
          </h2>
          <p className="text-sm mb-6" style={{ color: '#8C7E6A' }}>
            恭喜！您已成功升级到完整版
          </p>

          <div className="space-y-3 mb-6 text-left">
            {[
              { icon: '✓', text: '深度评估流程（20轮对话）' },
              { icon: '✓', text: '个性化分析报告' },
              { icon: '✓', text: '详细改进建议' },
              { icon: '✓', text: '完整版所有功能' },
            ].map((feature) => (
              <div
                key={feature.text}
                className="flex items-center gap-2 text-sm"
                style={{
                  opacity: progress >= (feature.icon === '✓' ? 25 : 75) ? 1 : 0.3,
                  transition: 'opacity 0.3s'
                }}
              >
                <span className="font-bold text-green-500">{feature.icon}</span>
                <span style={{ color: '#5C5245' }}>{feature.text}</span>
              </div>
            ))}
          </div>

          {state.paymentId && (
            <div className="p-3 rounded-lg mb-6" style={{ background: '#F0FDF4' }}>
              <p className="text-xs" style={{ color: '#8C7E6A' }}>
                订单号: {state.paymentId}
              </p>
            </div>
          )}

          {showButton && onComplete && (
            <button
              onClick={onComplete}
              disabled={progress < 100}
              className="w-full py-3 rounded-lg font-medium text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{ background: '#4CAF50' }}
            >
              {progress < 100 ? (
                <span className="animate-pulse">准备中...</span>
              ) : (
                <>
                  <span>开始完整版测评</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          )}

          {!showButton && progress < 100 && (
            <p className="text-xs mt-4 animate-pulse" style={{ color: '#8C7E6A' }}>
              正在自动跳转... {Math.round(progress)}%
            </p>
          )}
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(10deg);
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}

export function PaymentSuccessModal({
  open,
  onClose,
  onStartAssessment
}: {
  open: boolean;
  onClose: () => void;
  onStartAssessment: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0, 0, 0, 0.7)' }}>
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>

        <h2 className="text-xl font-bold mb-2" style={{ color: '#3D3229' }}>
          升级成功！
        </h2>
        <p className="text-sm mb-6" style={{ color: '#8C7E6A' }}>
          您现在可以使用完整版的所有功能
        </p>

        <button
          onClick={() => {
            onStartAssessment();
            onClose();
          }}
          className="w-full py-3 rounded-lg font-medium text-white mb-2"
          style={{ background: '#4CAF50' }}
        >
          立即开始测评
        </button>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-lg text-sm transition-all hover:bg-gray-50"
          style={{ border: '1px solid #E8DCC8', color: '#8C7E6A' }}
        >
          稍后再说
        </button>
      </div>
    </div>
  );
}

export function PaymentSuccessBanner({
  onDismiss,
  onStartAssessment
}: {
  onDismiss: () => void;
  onStartAssessment: () => void;
}) {
  return (
    <div className="fixed top-4 right-4 z-40 max-w-sm animate-slide-in">
      <div className="bg-white rounded-lg shadow-lg border-2 border-green-500 p-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
            <CheckCircle className="w-5 h-5 text-green-500" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold mb-1" style={{ color: '#3D3229' }}>
              升级成功！
            </h3>
            <p className="text-xs mb-3" style={{ color: '#8C7E6A' }}>
              您已获得完整版所有功能
            </p>
            <div className="flex gap-2">
              <button
                onClick={onStartAssessment}
                className="flex-1 py-2 rounded-lg text-xs font-medium text-white"
                style={{ background: '#4CAF50' }}
              >
                开始测评
              </button>
              <button
                onClick={onDismiss}
                className="text-xs hover:underline"
                style={{ color: '#8C7E6A' }}
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
