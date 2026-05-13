/**
 * PayPal 支付相关类型定义
 */

export type PayPalOrderStatus = 'created' | 'approved' | 'completed' | 'failed';
export type PayPalCaptureStatus = 'completed' | 'failed';

export interface PayPalOrder {
  id: string;
  status: PayPalOrderStatus;
  create_time: string;
  update_time: string;
  purchase_units: PayPalPurchaseUnit[];
}

export interface PayPalPurchaseUnit {
  reference_id: string;
  amount: PayPalAmount;
  payee?: PayPalPayee;
}

export interface PayPalAmount {
  currency_code: string;
  value: string;
  breakdown?: PayPalBreakdown;
}

export interface PayPalBreakdown {
  item_total?: PayPalAmount;
  tax_total?: PayPalAmount;
  shipping_total?: PayPalAmount;
  handling_total?: PayPalAmount;
  insurance_total?: PayPalAmount;
  shipping_discount?: PayPalAmount;
  discount?: PayPalAmount;
}

export interface PayPalPayee {
  merchant_id: string;
}

export interface PayPalCapture {
  id: string;
  status: PayPalCaptureStatus;
  amount: PayPalAmount;
  create_time: string;
  update_time: string;
  final_capture?: boolean;
}

export interface CreateOrderRequest {
  amount: number;
  currency?: string;
}

export interface CreateOrderResponse {
  id: string;
}

export interface CaptureOrderRequest {
  orderId: string;
}

export interface CaptureOrderResponse {
  success: boolean;
  paymentId?: string;
  error?: string;
}

export const PayPalErrorCode = {
  CANCELED: 'CANCELED',
  NETWORK_ERROR: 'NETWORK_ERROR',
  INVALID_PAYMENT: 'INVALID_PAYMENT',
  UNKNOWN: 'UNKNOWN'
} as const;

export type PayPalErrorCodeType = typeof PayPalErrorCode[keyof typeof PayPalErrorCode];

export const PayPalErrorMessages: Record<PayPalErrorCodeType, string> = {
  CANCELED: '用户取消了支付',
  NETWORK_ERROR: '网络连接失败，请重试',
  INVALID_PAYMENT: '支付信息有误，请检查',
  UNKNOWN: '支付失败，请稍后重试'
};
