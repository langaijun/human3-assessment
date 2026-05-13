/**
 * Human3.0 系统版本管理类型定义
 */

/**
 * 应用版本类型
 */
export type AppVersion = 'simple' | 'complete';

/**
 * 支付状态类型
 */
export type PaymentStatus = 'none' | 'pending' | 'success' | 'failed';

/**
 * 版本状态接口
 */
export interface VersionState {
  selectedVersion: AppVersion;
  isPaid: boolean;
  paymentStatus: PaymentStatus;
  paymentId?: string;
  paymentTimestamp?: number;
  lastUpdated?: Date;
}

/**
 * 版本功能描述接口
 */
export interface VersionFeatures {
  id: AppVersion;
  title: string;
  description: string;
  price?: number;
  features: string[];
  recommended?: boolean;
}

export const DEFAULT_VERSION_STATE: VersionState = {
  selectedVersion: 'simple',
  isPaid: false,
  paymentStatus: 'none',
};

export const VERSION_STATE_KEY = 'app-version-state';
