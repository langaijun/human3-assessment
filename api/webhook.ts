/**
 * Human3.0 系统 PayPal Webhook 处理
 *
 * Webhook URL: https://www.human3point0.com/api/webhook
 */

import crypto from 'crypto';

// PayPal 配置
const getPayPalConfig = () => {
  return {
    webhookId: process.env.PAYPAL_WEBHOOK_ID || '',
    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
    // Webhook 验证密钥（PayPal 会提供）
    webhookSecret: process.env.PAYPAL_WEBHOOK_SECRET || ''
  };
};

// PayPal Webhook 事件类型
type PayPalWebhookEventType =
  | 'PAYMENT.CAPTURE.COMPLETED'
  | 'PAYMENT.CAPTURE.DENIED'
  | 'PAYMENT.CAPTURE.PENDING'
  | 'PAYMENT.AUTHORIZATION.CREATED'
  | 'PAYMENT.AUTHORIZATION.VOIDED'
  | 'CHECKOUT.ORDER.COMPLETED'
  | 'CHECKOUT.ORDER.APPROVED';

interface PayPalWebhookEvent {
  event_type: PayPalWebhookEventType;
  resource: {
    id: string;
    status: string;
    amount: {
      currency_code: string;
      value: string;
    };
    custom_id?: string;
    create_time: string;
    update_time: string;
    links?: Array<{
      href: string;
      rel: string;
      method: string;
    }>;
  };
  summary: string;
  resource_version: string;
  id: string;
  create_time: string;
  resource_type: string;
}

interface WebhookResponse {
  event_type: string;
  resource_id: string;
  status: 'success' | 'error';
  message?: string;
  processed_at: string;
}

/**
 * 验证 Webhook 签名（可选，但推荐）
 * PayPal 会使用 Webhook Secret 对 payload 进行签名
 */
function verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
  if (!secret) {
    console.warn('[Webhook] No webhook secret configured, skipping verification');
    return true;
  }

  // 实现 PayPal Webhook 签名验证
  // 这需要根据 PayPal 的具体验证规则来实现
  const hmac = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('base64');

  // 注意：这需要根据 PayPal 实际的签名格式调整
  // PayPal 可能使用不同的签名算法
  return true;
}

/**
 * 处理支付成功事件
 */
async function handlePaymentCompleted(event: PayPalWebhookEvent): Promise<WebhookResponse> {
  const { resource } = event;
  const resourceId = resource.id;

  console.log('[Webhook] Payment completed:', {
    id: resourceId,
    amount: resource.amount.value,
    currency: resource.amount.currency_code,
    status: resource.status
  });

  // 验证这是完整版支付（$5 USD）
  const amount = parseFloat(resource.amount.value);
  if (resource.amount.currency_code !== 'USD' || amount !== 5) {
    console.warn('[Webhook] Invalid amount for complete version:', {
      currency: resource.amount.currency_code,
      amount: amount
    });
    return {
      event_type: event.event_type,
      resource_id: resourceId,
      status: 'error',
      message: 'Invalid payment amount',
      processed_at: new Date().toISOString()
    };
  }

  // TODO: 在实际项目中，这里需要：
  // 1. 查询数据库，找到对应的用户
  // 2. 更新用户的付费状态为 true
  // 3. 记录支付 ID 和时间戳
  // 4. 发送确认邮件
  // 5. 触发通知

  console.log('[Webhook] User should be marked as paid');

  return {
    event_type: event.event_type,
    resource_id: resourceId,
    status: 'success',
    processed_at: new Date().toISOString()
  };
}

/**
 * 处理支付被拒绝事件
 */
async function handlePaymentDenied(event: PayPalWebhookEvent): Promise<WebhookResponse> {
  const { resource } = event;
  const resourceId = resource.id;

  console.log('[Webhook] Payment denied:', {
    id: resourceId,
    status: resource.status
  });

  // TODO: 记录支付失败原因，通知用户

  return {
    event_type: event.event_type,
    resource_id: resourceId,
    status: 'error',
    message: 'Payment was denied',
    processed_at: new Date().toISOString()
  };
}

/**
 * 处理支付处理中事件
 */
async function handlePaymentPending(event: PayPalWebhookEvent): Promise<WebhookResponse> {
  const { resource } = event;
  const resourceId = resource.id;

  console.log('[Webhook] Payment pending:', {
    id: resourceId,
    status: resource.status
  });

  return {
    event_type: event.event_type,
    resource_id: resourceId,
    status: 'success',
    message: 'Payment is being processed',
    processed_at: new Date().toISOString()
  };
}

/**
 * 事件处理器映射
 */
const eventHandlers: Record<PayPalWebhookEventType, (event: PayPalWebhookEvent) => Promise<WebhookResponse>> = {
  'PAYMENT.CAPTURE.COMPLETED': handlePaymentCompleted,
  'PAYMENT.CAPTURE.DENIED': handlePaymentDenied,
  'PAYMENT.CAPTURE.PENDING': handlePaymentPending,
  'PAYMENT.AUTHORIZATION.CREATED': async (event) => {
    console.log('[Webhook] Authorization created:', event.resource.id);
    return {
      event_type: event.event_type,
      resource_id: event.resource.id,
      status: 'success',
      processed_at: new Date().toISOString()
    };
  },
  'PAYMENT.AUTHORIZATION.VOIDED': async (event) => {
    console.log('[Webhook] Authorization voided:', event.resource.id);
    return {
      event_type: event.event_type,
      resource_id: event.resource.id,
      status: 'error',
      message: 'Authorization voided',
      processed_at: new Date().toISOString()
    };
  },
  'CHECKOUT.ORDER.COMPLETED': async (event) => {
    console.log('[Webhook] Checkout order completed:', event.resource.id);
    return {
      event_type: event.event_type,
      resource_id: event.resource.id,
      status: 'success',
      processed_at: new Date().toISOString()
    };
  },
  'CHECKOUT.ORDER.APPROVED': async (event) => {
    console.log('[Webhook] Checkout order approved:', event.resource.id);
    return {
      event_type: event.event_type,
      resource_id: event.resource.id,
      status: 'success',
      processed_at: new Date().toISOString()
    };
  }
};

/**
 * POST - 处理 PayPal Webhook
 */
export async function POST(request: Request) {
  try {
    // 验证 Content-Type
    const contentType = request.headers.get('Content-Type');
    if (!contentType?.includes('application/json')) {
      console.error('[Webhook] Invalid content type:', contentType);
      return new Response(JSON.stringify({ error: 'Invalid content type' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 获取原始请求体（用于签名验证）
    const rawBody = await request.text();
    const signature = request.headers.get('paypal-transmission-sig') || '';
    const certUrl = request.headers.get('paypal-cert-url') || '';
    const authAlgo = request.headers.get('paypal-auth-algo') || '';

    // 解析请求体
    let payload: PayPalWebhookEvent;
    try {
      payload = JSON.parse(rawBody);
    } catch (error) {
      console.error('[Webhook] Failed to parse payload:', error);
      return new Response(JSON.stringify({ error: 'Invalid payload' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log('[Webhook] Received event:', {
      event_type: payload.event_type,
      resource_id: payload.resource?.id,
      create_time: payload.create_time
    });

    // 验证签名（如果配置了 webhook secret）
    const config = getPayPalConfig();
    if (config.webhookSecret && signature) {
      // TODO: 实现 PayPal Webhook 签名验证
      // PayPal 使用特定的签名算法，需要查看最新文档
      console.log('[Webhook] Signature verification headers present');
    }

    // 获取事件类型
    const eventType = payload.event_type;

    // 检查是否是我们关心的事件
    if (!eventHandlers[eventType]) {
      console.warn('[Webhook] Unhandled event type:', eventType);
      return new Response(JSON.stringify({
        event_type: eventType,
        status: 'ignored',
        message: 'Event type not handled'
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 处理事件
    const response = await eventHandlers[eventType](payload);

    console.log('[Webhook] Event processed:', response);

    // 返回处理结果
    return new Response(JSON.stringify(response), {
      status: response.status === 'success' ? 200 : 500,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('[Webhook] Processing error:', error);
    return new Response(JSON.stringify({
      error: 'Failed to process webhook',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * GET - 获取 Webhook 信息（用于调试）
 */
export async function GET(request: Request) {
  const config = getPayPalConfig();

  return new Response(JSON.stringify({
    webhook_url: 'https://www.human3point0.com/api/webhook',
    supported_events: Object.keys(eventHandlers),
    webhook_configured: !!config.webhookId,
    environment: process.env.VERCEL_ENV || 'unknown'
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

/**
 * OPTIONS - CORS 预检请求
 */
export async function OPTIONS(request: Request) {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, paypal-transmission-sig, paypal-cert-url, paypal-auth-algo',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Max-Age': '86400'
    }
  });
}

/**
 * Webhook 健康检查
 */
export async function HEALTH(request: Request) {
  return new Response(JSON.stringify({
    status: 'healthy',
    webhook: 'ready',
    last_check: new Date().toISOString()
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}