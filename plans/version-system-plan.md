# 版本管理系统完整设计方案

## 项目概述

为思维模型评估系统实现基础版（免费）和完整版（$5付费）的版本管理系统，包含完整的支付流程和版本切换功能。

## 核心需求

1. **版本管理**
   - 基础版：免费使用，基础功能
   - 完整版：$5，所有功能（3D可视化、完整版报告、个性化建议）

2. **支付集成**
   - PayPal 集成
   - 安全的后端 API 代理
   - 完整的支付流程

3. **版本切换**
   - 基础版升级完整版时需要重新开始评估
   - 显示确认对话框，明确提示进度丢失
   - 已付费用户可直接切换，未付费需要支付

## 技术架构

### 状态管理

```typescript
// app/types/version.ts
export type AppVersion = 'simple' | 'complete';

export interface VersionState {
  selectedVersion: AppVersion;
  isPaid: boolean;
  paymentStatus: 'none' | 'pending' | 'success' | 'failed';
  paymentId?: string;
}

// 支付状态类型
export interface PaymentStatus {
  status: 'none' | 'pending' | 'success' | 'failed';
  message?: string;
  error?: string;
}
```

### 自定义 Hook

```typescript
// app/src/hooks/usePersistentVersionState.ts
import { useState, useEffect } from 'react';
import type { VersionState } from '@/types';

const STORAGE_KEY = 'app-version-state';

export function usePersistentVersionState() {
  const [versionState, setVersionState] = useState<VersionState>({
    selectedVersion: 'simple',
    isPaid: false,
    paymentStatus: 'none'
  });

  // 从 localStorage 加载
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setVersionState(parsed);
      } catch (e) {
        console.error('Failed to parse saved version state', e);
      }
    }
  }, []);

  // 保存到 localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(versionState));
  }, [versionState]);

  return [versionState, setVersionState] as const;
}
```

## 组件设计

### 1. VersionSelector

```typescript
// app/src/components/VersionSelector.tsx
'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AppVersion } from '@/types';

interface VersionSelectorProps {
  selectedVersion: AppVersion;
  onVersionSelect: (version: AppVersion) => void;
  onStartAssessment: (input: string) => void;
}

const VersionSelector = ({
  selectedVersion,
  onVersionSelect,
  onStartAssessment
}: VersionSelectorProps) => {
  const [versionDisplay, setVersionDisplay] = useState(selectedVersion);
  const [isSwitching, setIsSwitching] = useState(false);

  const handleVersionChange = (newVersion: AppVersion) => {
    setIsSwitching(true);
    setTimeout(() => {
      setVersionDisplay(newVersion);
      setIsSwitching(false);
    }, 300);
  };

  const versions = [
    {
      id: 'simple' as const,
      title: '基础版',
      description: '免费使用核心功能',
      features: ['基本评估', '标准报告', '基础建议']
    },
    {
      id: 'complete' as const,
      title: '完整版',
      description: '$5 - 获得深度分析',
      features: ['完整评估', '3D可视化', '个性化建议', '深度报告']
    }
  ];

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {versions.map((version) => (
        <Card
          key={version.id}
          className={`cursor-pointer transition-all duration-300 ${
            selectedVersion === version.id ?
              'ring-2 scale-105 shadow-lg' :
              'opacity-70 hover:opacity-90 hover:scale-102'
          }`}
          onClick={() => onVersionSelect(version.id)}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">{version.title}</h3>
              {version.id === 'complete' && (
                <span className="text-2xl font-bold text-blue-600">$5</span>
              )}
            </div>
            <p className="text-gray-600 mb-4">{version.description}</p>
            <ul className="space-y-2 mb-6">
              {version.features.map((feature, index) => (
                <li key={index} className="flex items-center text-sm">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
            {version.id === selectedVersion && (
              <Button className="w-full">
                {selectedVersion === 'simple' ? '开始评估' : '重新开始'}
              </Button>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default VersionSelector;
```

### 2. PaymentModal

```typescript
// app/src/components/PaymentModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { usePayPalScriptLoader } from '@paypal/react-paypal-js';
import type { VersionState } from '@/types';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (paymentId: string) => void;
  onFailure: (error: string) => void;
  initialInput: string;
}

const PaymentModal = ({
  isOpen,
  onClose,
  onSuccess,
  onFailure,
  initialInput
}: PaymentModalProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;

  const { isLoaded, loadScriptError } = usePayPalScriptLoader({
    'client-id': process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
    currency: 'USD'
  });

  const handlePayPalError = (err: any) => {
    const errorMessages = {
      CANCELED: '用户取消了支付',
      NETWORK_ERROR: '网络连接失败，请重试',
      INVALID_PAYMENT: '支付信息有误，请检查',
      UNKNOWN: '支付失败，请稍后重试'
    };

    const errorCode = err?.details?.[0]?.issue || 'UNKNOWN';
    const errorMessage = errorMessages[errorCode as keyof typeof errorMessages] || errorMessages.UNKNOWN;

    setError(errorMessage);
    toast.error(errorMessage);
  };

  const createOrder = async () => {
    try {
      const response = await fetch('/api/paypal/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 5, currency: 'USD' }),
      });

      if (!response.ok) throw new Error('Failed to create order');

      const { id } = await response.json();
      return id;
    } catch (err) {
      if (retryCount < MAX_RETRIES) {
        setRetryCount(prev => prev + 1);
        await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
        return createOrder();
      }
      throw err;
    }
  };

  const onApprove = async (data: any, actions: any) => {
    setIsProcessing(true);
    try {
      const response = await fetch('/api/paypal/capture-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: data.orderID }),
      });

      if (!response.ok) throw new Error('Failed to capture order');

      const { success, paymentId } = await response.json();

      if (success) {
        onSuccess(paymentId);
        toast.success('支付成功！');
      } else {
        throw new Error('Payment failed');
      }
    } catch (err) {
      handlePayPalError(err);
      onFailure(err instanceof Error ? err.message : 'Payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (loadScriptError) {
      handlePayPalError(loadScriptError);
    }
  }, [loadScriptError]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="payment-modal">
        <DialogHeader>
          <DialogTitle>升级到完整版</DialogTitle>
          <p className="text-gray-600">支付 $5 获得完整版功能</p>
        </DialogHeader>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          <Card className="p-4">
            <h4 className="font-semibold mb-2">完整版功能</h4>
            <ul className="text-sm space-y-1">
              <li>• 3D 可视化展示</li>
              <li>• 个性化深度分析</li>
              <li>• 详细的改进建议</li>
              <li>• 完整版报告</li>
            </ul>
          </Card>

          {isLoaded && !isProcessing && (
            <div className="paypal-button-container">
              {/* PayPal 按钮将在这里渲染 */}
            </div>
          )}

          {isProcessing && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3">处理支付中...</span>
            </div>
          )}

          <div className="flex justify-between">
            <Button variant="outline" onClick={onClose}>
              取消
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
```

### 3. PaymentSuccess

```typescript
// app/src/components/PaymentSuccess.tsx
'use client';

import { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight } from 'lucide-react';

interface PaymentSuccessProps {
  paymentId: string;
  isOpen: boolean;
  onClose: () => void;
  onStartAssessment: (input: string) => void;
  initialInput: string;
}

const PaymentSuccess = ({
  paymentId,
  isOpen,
  onClose,
  onStartAssessment,
  initialInput
}: PaymentSuccessProps) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onStartAssessment(initialInput);
        onClose();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isOpen, onStartAssessment, initialInput, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="w-6 h-6 text-green-600" />
            升级成功！
          </DialogTitle>
        </DialogHeader>

        <div className="text-center py-6">
          <p className="text-gray-600 mb-4">
            已成功升级到完整版！
          </p>
          <p className="text-sm text-gray-500 mb-6">
            正在为您重新开始评估...
          </p>

          <div className="animate-pulse">
            <ArrowRight className="w-8 h-8 mx-auto text-blue-600" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentSuccess;
```

### 4. ConfirmDialog

```typescript
// app/src/components/ConfirmDialog.tsx
'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message
}: ConfirmDialogProps) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{message}</DialogDescription>
      </DialogHeader>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          取消
        </Button>
        <Button onClick={onConfirm}>
          确认
        </Button>
      </div>
    </DialogContent>
  </Dialog>
);

export default ConfirmDialog;
```

## API 设计

### PayPal API

```typescript
// app/api/paypal.ts
import { VercelRequest, VercelResponse } from '@vercel/node';
import paypal from '@paypal/checkout-server-sdk';

const environment = new paypal.core.SandboxEnvironment(
  process.env.PAYPAL_CLIENT_ID!,
  process.env.PAYPAL_CLIENT_SECRET!
);
const client = new paypal.core.PayPalHttpClient(environment);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS 设置
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    const action = req.body.action;
    const csrfToken = req.headers['x-csrf-token'];

    if (action === 'create-order') {
      const { amount, currency = 'USD' } = req.body;

      // 验证金额
      if (amount !== 5) {
        return res.status(400).json({ error: 'Invalid amount. Only $5 is allowed.' });
      }

      if (currency !== 'USD') {
        return res.status(400).json({ error: 'Currency must be USD.' });
      }

      // 创建订单
      const request = new paypal.orders.OrdersCreateRequest();
      request.requestBody({
        intent: 'CAPTURE',
        purchase_units: [{
          reference_id: 'complete_version_upgrade',
          amount: {
            currency_code: currency,
            value: amount.toString()
          }
        }]
      });

      try {
        const order = await client.execute(request);
        return res.status(200).json({ id: order.result.id });
      } catch (err) {
        console.error('PayPal order creation failed:', err);
        return res.status(500).json({ error: 'Failed to create order' });
      }
    }

    if (action === 'capture-order') {
      const { orderId } = req.body;

      const request = new paypal.orders.OrdersCaptureRequest(orderId);
      request.requestBody({});

      try {
        const capture = await client.execute(request);

        // 这里可以添加订单验证逻辑
        const totalAmount = capture.result.purchase_units[0].amount.value;
        if (parseFloat(totalAmount) !== 5) {
          throw new Error('Invalid amount');
        }

        return res.status(200).json({
          success: true,
          paymentId: capture.result.id
        });
      } catch (err) {
        console.error('PayPal order capture failed:', err);
        return res.status(500).json({ error: 'Failed to capture order' });
      }
    }
  }

  return res.status(405).end();
}
```

## 状态管理优化

### Context API

```typescript
// app/src/context/VersionContext.tsx
import { createContext, useContext, useState } from 'react';
import type { VersionState } from '@/types';

const VersionContext = createContext<{
  versionState: VersionState;
  setVersionState: React.Dispatch<React.SetStateAction<VersionState>>;
} | null>(null);

export const VersionProvider = ({ children }: { children: React.ReactNode }) => {
  const [versionState, setVersionState] = useState<VersionState>({
    selectedVersion: 'simple',
    isPaid: false,
    paymentStatus: 'none'
  });

  return (
    <VersionContext.Provider value={{ versionState, setVersionState }}>
      {children}
    </VersionContext.Provider>
  );
};

export const useVersion = () => {
  const context = useContext(VersionContext);
  if (!context) throw new Error('useVersion must be used within VersionProvider');
  return context;
};
```

### 结合 Custom Hook

```typescript
// app/src/hooks/usePersistentVersionState.ts (优化版)
import { useState, useEffect } from 'react';
import { useVersion } from '@/context/VersionContext';
import type { VersionState } from '@/types';

const STORAGE_KEY = 'app-version-state';

export function usePersistentVersionState() {
  const [state, setState] = useState<VersionState>({
    selectedVersion: 'simple',
    isPaid: false,
    paymentStatus: 'none'
  });
  const { setVersionState } = useVersion();

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setState(parsed);
        setVersionState(parsed);
      } catch (e) {
        console.error('Failed to parse saved version state', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    setVersionState(state);
  }, [state, setVersionState]);

  return [state, setState] as const;
}
```

## 版本切换重新开始流程

### 1. 切换时的确认对话框

```typescript
// App.tsx
const handleVersionSwitch = useCallback((newVersion: AppVersion) => {
  // 如果是从基础版切换到完整版
  if (versionState.selectedVersion === 'simple' && newVersion === 'complete') {
    // 如果用户已经开始评估（不在hero阶段）
    if (phase !== 'hero' && phase !== 'report') {
      // 显示确认对话框
      setShowConfirmDialog(true);
      setConfirmCallback(() => {
        // 如果用户已在评估阶段
        if (phase !== 'hero' && phase !== 'report') {
          // 立即返回hero阶段，清除评估结果
          setPhase('hero');
          setAssessmentResult(null);
          setInitialInput('');
        }

        // 处理支付或直接切换
        if (versionState.isPaid) {
          // 已支付，直接更新版本状态
          setVersionState(prev => ({ ...prev, selectedVersion: 'complete' }));
          // 更新UI显示完整版选择
          setVersionDisplay('complete');
        } else {
          // 未支付，触发支付流程
          setShowPaymentModal(true);
        }
      });
    } else {
      // 未开始评估，直接切换
      if (versionState.isPaid) {
        setVersionState(prev => ({ ...prev, selectedVersion: 'complete' }));
        setVersionDisplay('complete');
      } else {
        setShowPaymentModal(true);
      }
    }
  } else {
    // 其他切换逻辑
    setVersionState(prev => ({ ...prev, selectedVersion: newVersion }));
    setVersionDisplay(newVersion);
  }
}, [phase, versionState.isPaid]);
```

### 2. HeroSection 中的版本切换状态

```typescript
// HeroSection.tsx
const HeroSection = ({ onStartAssessment }) => {
  const [versionDisplay, setVersionDisplay] = useState(versionState.selectedVersion);
  const [isSwitching, setIsSwitching] = useState(false);

  // 接收从 App 传来的版本显示更新
  const handleVersionChange = (newVersion) => {
    setIsSwitching(true);
    setTimeout(() => {
      setVersionDisplay(newVersion);
      setIsSwitching(false);
    }, 300);
  };

  return (
    <div className="relative">
      {isSwitching && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
          <div className="bg-white p-4 rounded">
            <p>切换中...</p>
          </div>
        </div>
      )}

      <VersionSelector
        selectedVersion={versionDisplay}
        onVersionSelect={(version) => {
          if (version !== versionState.selectedVersion) {
            handleVersionChange(version);
          }
        }}
        onStartAssessment={onStartAssessment}
        // ... 其他props
      />
    </div>
  );
};
```

### 3. 支付成功后的自动开始

```typescript
// PaymentSuccess 组件
const PaymentSuccess = ({ paymentId, isOpen, onClose, onStartAssessment, initialInput }) => {
  useEffect(() => {
    if (isOpen) {
      // 更新状态为已支付完整版
      setVersionState(prev => ({
        ...prev,
        selectedVersion: 'complete',
        isPaid: true,
        paymentStatus: 'success',
        paymentId
      }));

      // 延迟后开始评估
      const timer = setTimeout(() => {
        onStartAssessment(initialInput);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isOpen, onStartAssessment, initialInput]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>升级成功！</DialogTitle>
          <DialogDescription>
            已升级到完整版，正在为您重新开始评估...
          </DialogDescription>
        </DialogHeader>
        {/* ... 其他内容 */}
      </DialogContent>
    </Dialog>
  );
};
```

### 4. ReportPage 升级重新开始选项

```typescript
// ReportPage.tsx
const ReportPage = ({ result, onRestart }) => {
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);

  const handleUpgradeAndRestart = () => {
    // 确认升级
    setShowConfirmDialog(true);
    setConfirmCallback(() => {
      // 切换版本
      setVersionState({ ...versionState, selectedVersion: 'complete' });

      if (versionState.isPaid) {
        // 已支付，直接重新开始
        onRestart();
        // 设置版本为完整版
        setTimeout(() => {
          setPhase('hero');
        }, 100);
      } else {
        // 未支付，显示支付流程
        setShowUpgradeDialog(true);
        setShowPaymentModal(true);
      }
    });
  };

  return (
    <div>
      {/* ... 报告内容 */}

      {versionState.selectedVersion === 'simple' && (
        <div className="fixed bottom-4 right-4 bg-yellow-100 border-2 border-yellow-400 rounded-lg p-4 max-w-sm">
          <div className="flex items-start gap-3">
            <div className="bg-yellow-400 rounded-full p-2">
              <svg>升级图标</svg>
            </div>
            <div>
              <h3 className="font-medium">升级到完整版</h3>
              <p className="text-sm mt-1">
                重新开始获得更深入的个性化分析和建议
              </p>
              <div className="mt-3 flex gap-2">
                <Button onClick={handleUpgradeAndRestart}>
                  立即升级 $5
                </Button>
                <Button variant="outline" onClick={() => setShowUpgradeDialog(false)}>
                  稍后再说
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 支付对话框 */}
      {showUpgradeDialog && (
        <PaymentModal
          isOpen={showUpgradeDialog}
          onClose={() => setShowUpgradeDialog(false)}
          onSuccess={(paymentId) => {
            // 支付成功后重新开始
            onRestart();
            setTimeout(() => {
              setPhase('hero');
              setShowUpgradeDialog(false);
            }, 100);
          }}
          onFailure={(error) => {
            // 处理支付失败
            console.error('Upgrade payment failed:', error);
          }}
        />
      )}
    </div>
  );
};
```

## 优化建议详述

### 1. 用户体验优化

#### 自定义确认模态框
- 替换原生 `confirm()` 为美观的自定义对话框
- 提供清晰的标题和描述信息
- 包含"取消"和"确认"按钮，防止误操作

#### 进度指示器
- 版本切换时显示"切换中..."动画
- 支付处理时显示加载状态
- 支付成功时显示成功动画

#### Toast 通知
- 使用 `sonner` 库提供统一的提示信息
- 支持成功、错误、警告等不同类型
- 自动消失，不干扰用户操作

### 2. 错误处理增强

#### PayPal 错误分类处理
```typescript
const errorMessages = {
  CANCELED: '用户取消了支付',
  NETWORK_ERROR: '网络连接失败，请重试',
  INVALID_PAYMENT: '支付信息有误，请检查',
  UNKNOWN: '支付失败，请稍后重试'
};
```

#### 网络重试机制
- 最多重试 3 次
- 指数退避策略（1s, 2s, 4s）
- 提供重试状态反馈

### 3. 状态管理优化

#### Context API + Custom Hook
- 使用 Context 减少 props drilling
- 结合 localStorage 实现持久化
- 状态更新自动同步到所有组件

### 4. 安全性增强

#### 金额验证
```typescript
if (amount !== 5) {
  return res.status(400).json({ error: 'Invalid amount. Only $5 is allowed.' });
}
```

#### CSRF 保护
```typescript
const csrfToken = req.headers['x-csrf-token'];
if (!csrfToken || csrfToken !== process.env.CSRF_TOKEN) {
  return res.status(403).json({ error: 'Invalid CSRF token' });
}
```

#### 支付状态验证
- 验证 PayPal 订单 ID 格式
- 验证支付金额是否正确
- 记录支付日志用于审计

### 5. 性能优化

#### 组件懒加载
```typescript
const PaymentModal = React.lazy(() => import('./components/PaymentModal'));
const PaymentSuccess = React.lazy(() => import('./components/PaymentSuccess'));

<Suspense fallback={<div>Loading payment...</div>}>
  {showPaymentModal && <PaymentModal ... />}
  {showPaymentSuccess && <PaymentSuccess ... />}
</Suspense>
```

#### React.memo 优化
```typescript
const VersionCard = React.memo(({
  version,
  isSelected,
  onClick
}) => {
  // 组件实现
});
```

### 6. 移动端适配

#### 响应式设计
```css
.payment-modal {
  @media (max-width: 640px) {
    width: 90%;
    top: 20px;
    bottom: 20px;
    transform: none;
  }
}
```

#### 触摸优化
- 按钮大小适配手指点击
- 合适的间距和边距
- 防止意外触摸

### 7. 数据分析

#### 事件追踪
```typescript
// app/src/utils/analytics.ts
export const trackEvent = (eventName: string, properties?: any) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, properties);
  }
};

// 使用示例
trackEvent('version_selected', { version: 'simple' | 'complete' });
trackEvent('payment_started', { amount: 5 });
trackEvent('payment_completed', { paymentId });
```

### 8. 离线支持

#### 网络状态检测
```typescript
// app/src/hooks/useOnlineStatus.ts
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}
```

### 9. 类型安全增强

#### PayPal API 类型定义
```typescript
// app/src/types/paypal.ts
export interface PayPalOrder {
  id: string;
  status: 'created' | 'approved' | 'completed' | 'failed';
  purchase_units: {
    reference_id: string;
    amount: {
      currency_code: string;
      value: string;
    };
  }[];
}

export interface PayPalCapture {
  id: string;
  status: 'completed' | 'failed';
  amount: {
    currency_code: string;
    value: string;
  };
}
```

### 10. 代码组织优化

#### 常量提取
```typescript
// app/src/constants/index.ts
export const VERSIONS = {
  SIMPLE: 'simple',
  COMPLETE: 'complete'
} as const;

export const PRICES = {
  COMPLETE: 5
} as const;

export const PAYMENT_STATUSES = {
  NONE: 'none',
  PENDING: 'pending',
  SUCCESS: 'success',
  FAILED: 'failed'
} as const;
```

#### 统一错误处理
```typescript
// app/src/utils/errors.ts
export class PaymentError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'PaymentError';
  }
}

export class VersionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'VersionError';
  }
}
```

## 测试要点

### 1. 版本持久化测试
- 刷新页面后版本状态保持
- 清除 localStorage 后行为验证
- 多标签页状态同步

### 2. 免费版本流程测试
- 基础版功能完整性
- 升级提示显示
- 错误处理机制

### 3. 基础版升级测试
- 确认对话框显示
- 进度丢失警告
- 取消操作恢复

### 4. 支付流程测试
- PayPal SDK 加载
- 订单创建成功
- 支付完成处理
- 支付取消处理
- 网络异常重试

### 5. 已支付用户切换测试
- 直接切换完整版
- 无需重新支付
- 状态同步验证

### 6. 刷新后状态保持测试
- 支付状态保持
- 评估进度保持
- 版本信息保持

## 文件结构

### 新增文件
```
app/
├── src/
│   ├── components/
│   │   ├── VersionSelector.tsx
│   │   ├── PaymentModal.tsx
│   │   ├── PaymentSuccess.tsx
│   │   └── ConfirmDialog.tsx
│   ├── context/
│   │   └── VersionContext.tsx
│   ├── hooks/
│   │   ├── usePersistentVersionState.ts
│   │   └── useOnlineStatus.ts
│   ├── types/
│   │   ├── version.ts
│   │   └── paypal.ts
│   ├── utils/
│   │   ├── analytics.ts
│   │   └── errors.ts
│   └── constants/
│       └── index.ts
└── api/
    └── paypal.ts
```

### 更新文件
```
app/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── HeroSection.tsx
│   │   ├── ChatInterface.tsx
│   │   ├── Visualization3D.tsx
│   │   └── ReportPage.tsx
│   └── lib/
│       ├── ai.ts
│       └── assessment.ts
└── public/
    └── images/
```

## 部署和环境变量

### 必需的环境变量
```bash
# PayPal 配置
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret

# CSRF 保护
CSRF_TOKEN=your_csrf_token

# 分析追踪
GOOGLE_ANALYTICS_ID=your_ga_id
```

## 联系方式

如有任何问题或建议，请联系：
- **邮箱**: langaijun@foxmail.com

## 致谢

**特别致谢：**

Human3.0 是由个人成长领域专家 Dan Koe 提出的一套个人发展框架，旨在帮助人们系统性地提升在人生多个维度的综合能力，实现更全面、更有意义的生活。
向Dan Koe ,思想框架提出者致敬！

这个创新性的评估框架为我们提供了宝贵的视角，帮助我们更好地理解和优化个人的思维模型。通过这个系统，我们希望能够帮助更多人提升思维能力，实现个人成长。

---

*最后更新：2026年5月13日*