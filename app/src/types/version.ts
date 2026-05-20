/**
 * Human3.0 系统版本管理类型定义
 */

/**
 * 应用版本类型
 */
export type AppVersion = 'simple' | 'complete';

/**
 * 版本功能描述接口
 */
export interface VersionFeatures {
  id: AppVersion;
  title: string;
  description: string;
  features: string[];
  recommended?: boolean;
}