/**
 * Human3.0 系统常量定义
 */

// 版本常量
export const VERSIONS = {
  SIMPLE: 'simple' as const,
  COMPLETE: 'complete' as const,
} as const;

// 版本价格
export const PRICES = {
  COMPLETE: 5,
} as const;

// 支付状态常量
export const PAYMENT_STATUSES = {
  NONE: 'none' as const,
  PENDING: 'pending' as const,
  SUCCESS: 'success' as const,
  FAILED: 'failed' as const,
} as const;

// 版本功能配置
export const VERSION_FEATURES = {
  simple: {
    id: 'simple',
    title: '快速评估',
    description: '12轮对话，快速了解自己',
    features: [
      '快速评估',
      '基础报告',
      '简单建议'
    ],
    recommended: false
  },
  complete: {
    id: 'complete',
    title: '深度评估',
    description: '20轮对话，详细探索成长',
    features: [
      '完整评估',
      '深度分析',
      '详细建议'
    ],
    recommended: true
  }
} as const;

// 支付相关常量
export const PAYMENT = {
  CURRENCY: 'USD',
  COMPLETE: 5,
  MAX_RETRIES: 3,
  RETRY_DELAY_BASE: 1000,
  PAYPAL_LINK: import.meta.env.VITE_PAYPAL_PAYMENT_LINK || 'https://www.paypal.com/ncp/payment/LMNRNT3SAXPZS',
} as const;

// 本地存储键名
export const STORAGE_KEYS = {
  VERSION_STATE: 'app-version-state',
} as const;
