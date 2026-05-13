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
    title: '基础版',
    description: '免费使用核心功能',
    price: 0,
    features: [
      '基本评估',
      '标准报告',
      '基础建议'
    ],
    recommended: false
  },
  complete: {
    id: 'complete',
    title: '完整版',
    description: '$5 - 获得深度分析',
    price: 5,
    features: [
      '完整评估',
      '个性化深度分析',
      '详细改进建议',
      '完整版报告'
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
} as const;

// 本地存储键名
export const STORAGE_KEYS = {
  VERSION_STATE: 'app-version-state',
} as const;
