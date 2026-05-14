/**
 * Human3.0 系统 PayPal 支付组件
 */
import { useState } from 'react';
import { useVersion } from '@/context/VersionContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { PAYMENT } from '@/constants';

interface PayPalPaymentProps {
  onClose?: () => void;
  onSuccess?: () => void;
  onFail?: (error: string) => void;
}

export default function PayPalPayment({
  onClose,
  onSuccess,
  onFail
}: PayPalPaymentProps) {
  const { state, actions } = useVersion();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateCSRFToken = () => {
    return Math.random().toString(36).substring(2, 15) +
           Math.random().toString(36).substring(2, 15);
  };

  const createOrder = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const csrfToken = generateCSRFToken();
      document.cookie = `csrf-token=${csrfToken}; path=/; max-age=3600`;

      const response = await fetch('/api/paypal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: PAYMENT.COMPLETE,
          currency: PAYMENT.CURRENCY,
          csrfToken
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create order');
      }

      await captureOrder(data.orderId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      onFail?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const captureOrder = async (orderId: string) => {
    const csrfToken = generateCSRFToken();

    const response = await fetch('/api/paypal', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderId,
        csrfToken
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to capture order');
    }

    actions.setPaidStatus(true);
    actions.setPaymentStatus('success');
    actions.setPaymentId(data.captureId);
    actions.updatePaymentTimestamp();

    toast.success('支付成功！');
    onSuccess?.();
  };

  const handleCancel = () => {
    actions.setPaymentStatus('none');
    onClose?.();
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span>正在处理支付...</span>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="flex flex-col items-center space-y-4">
          <AlertCircle className="w-8 h-8 text-red-500" />
          <p className="text-red-500">{error}</p>
          <Button onClick={createOrder} disabled={isLoading}>
            重试支付
          </Button>
        </div>
      </Card>
    );
  }

  if (state.paymentStatus === 'success') {
    return (
      <Card className="p-6">
        <div className="flex flex-col items-center space-y-4">
          <CheckCircle className="w-8 h-8 text-green-500" />
          <p className="text-green-600">支付成功！</p>
          <p className="text-sm text-gray-600">
            订单号: {state.paymentId}
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold">完整版升级</h3>
          <p className="text-2xl font-bold text-blue-600">${PAYMENT.COMPLETE}</p>
        </div>

        <Button
          onClick={createOrder}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? '处理中...' : '使用 PayPal 支付'}
        </Button>

        <Button
          variant="outline"
          onClick={handleCancel}
          className="w-full"
        >
          取消
        </Button>
      </div>
    </Card>
  );
}

export function PayPalPaymentWithRetry(props: PayPalPaymentProps) {
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = PAYMENT.MAX_RETRIES;

  const handleFail = (error: string) => {
    props.onFail?.(error);

    if (retryCount < maxRetries) {
      setTimeout(() => {
        setRetryCount(prev => prev + 1);
      }, PAYMENT.RETRY_DELAY_BASE * Math.pow(2, retryCount));
    }
  };

  return (
    <div>
      <PayPalPayment
        {...props}
        onFail={handleFail}
      />
      {retryCount > 0 && (
        <p className="text-sm text-gray-600 mt-2">
          重试次数: {retryCount}/{maxRetries}
        </p>
      )}
    </div>
  );
}
