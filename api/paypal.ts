/**
 * Human3.0 系统 PayPal 支付 API (Vite Serverless Function)
 */

// PayPal 配置检查
const getPayPalConfig = () => {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('PayPal configuration missing');
  }

  return { clientId, clientSecret };
};

// 生成 CSRF Token
function generateCSRFToken(): string {
  return Math.random().toString(36).substring(2, 15) +
         Math.random().toString(36).substring(2, 15);
}

// 验证 CSRF Token
function validateCSRFToken(token: string, storedToken: string): boolean {
  return token === storedToken;
}

// 错误类
class PaymentError extends Error {
  constructor(
    message: string,
    public code: string,
    public retryable: boolean = true
  ) {
    super(message);
    this.name = 'PaymentError';
  }
}

// 重试逻辑
async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;

      if (error instanceof PaymentError && !error.retryable) {
        throw error;
      }

      if (attempt < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, attempt)));
      }
    }
  }

  throw lastError || new Error('Payment failed after retries');
}

/**
 * GET - 健康检查
 */
export async function GET(request: Request) {
  return new Response(JSON.stringify({ status: 'healthy' }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

/**
 * POST - 创建 PayPal 订单
 */
export async function POST(request: Request) {
  try {
    // 验证请求体
    const body = await request.json();
    const { amount, currency = 'USD', csrfToken } = body;

    // 从 cookie 获取存储的 CSRF Token
    const cookieHeader = request.headers.get('Cookie') || '';
    const cookies = cookieHeader.split(';').reduce((acc: Record<string, string>, cookie) => {
      const [key, value] = cookie.trim().split('=');
      if (key && value) acc[key] = value;
      return acc;
    }, {});
    const storedToken = cookies['csrf-token'] || '';

    // 验证 CSRF Token
    if (!validateCSRFToken(csrfToken, storedToken)) {
      throw new PaymentError('Invalid CSRF token', 'INVALID_CSRF_TOKEN', false);
    }

    // 验证金额
    if (typeof amount !== 'number' || amount <= 0) {
      throw new PaymentError('Invalid amount', 'INVALID_AMOUNT', false);
    }

    // 验证货币
    if (currency !== 'USD') {
      throw new PaymentError('Unsupported currency', 'UNSUPPORTED_CURRENCY', false);
    }

    // 验证价格是否正确（$5）
    if (amount !== 5) {
      throw new PaymentError('Invalid price for complete version', 'INVALID_PRICE', false);
    }

    const config = getPayPalConfig();

    // 创建订单请求
    const orderRequest = {
      intent: 'CAPTURE',
      purchase_units: [{
        reference_id: 'human3.0-complete-version',
        amount: {
          currency_code: currency,
          value: amount.toString(),
          breakdown: {
            item_total: {
              currency_code: currency,
              value: amount.toString()
            }
          }
        }
      }],
      application_context: {
        brand_name: 'Human3.0',
        landing_page: 'BILLING',
        shipping_preference: 'NO_SHIPPING',
        user_action: 'PAY_NOW',
        return_url: `${process.env.NEXT_PUBLIC_BASE_URL || ''}/payment/success`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || ''}/payment/cancel`
      }
    };

    // 创建订单（使用 fetch 调用 PayPal API）
    const auth = btoa(`${config.clientId}:${config.clientSecret}`);
    const response = await withRetry(async () => {
      const res = await fetch('https://api-m.sandbox.paypal.com/v2/checkout/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${auth}`
        },
        body: JSON.stringify(orderRequest)
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`PayPal API error: ${res.status} - ${errorText}`);
      }

      return await res.json();
    });

    // 记录订单ID（实际项目中应该保存到数据库）
    console.log('[PayPal] Order created:', response.id);

    // 返回订单信息
    return new Response(JSON.stringify({
      orderId: response.id,
      status: response.status,
      links: response.links
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('PayPal create order error:', error);

    if (error instanceof PaymentError) {
      return new Response(JSON.stringify({
        error: error.message,
        code: error.code,
        retryable: error.retryable
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      error: 'Failed to create PayPal order',
      code: 'CREATE_ORDER_FAILED'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * PUT - 捕获 PayPal 订单
 */
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { orderId, csrfToken } = body;

    // 从 cookie 获取存储的 CSRF Token
    const cookieHeader = request.headers.get('Cookie') || '';
    const cookies = cookieHeader.split(';').reduce((acc: Record<string, string>, cookie) => {
      const [key, value] = cookie.trim().split('=');
      if (key && value) acc[key] = value;
      return acc;
    }, {});
    const storedToken = cookies['csrf-token'] || '';

    // 验证 CSRF Token
    if (!validateCSRFToken(csrfToken, storedToken)) {
      throw new PaymentError('Invalid CSRF token', 'INVALID_CSRF_TOKEN', false);
    }

    if (!orderId) {
      throw new PaymentError('Order ID is required', 'MISSING_ORDER_ID', false);
    }

    const config = getPayPalConfig();

    // 捕获订单
    const auth = btoa(`${config.clientId}:${config.clientSecret}`);
    const capture = await withRetry(async () => {
      const res = await fetch(`https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderId}/capture`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${auth}`
        }
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`PayPal API error: ${res.status} - ${errorText}`);
      }

      return await res.json();
    });

    if (capture.status !== 'COMPLETED') {
      throw new PaymentError(
        `Payment capture failed: ${capture.status}`,
        'CAPTURE_FAILED'
      );
    }

    console.log('[PayPal] Payment captured:', capture.id);

    // 返回捕获结果
    return new Response(JSON.stringify({
      success: true,
      captureId: capture.id,
      status: capture.status,
      amount: capture.amount,
      createTime: capture.create_time,
      updateTime: capture.update_time
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('PayPal capture order error:', error);

    if (error instanceof PaymentError) {
      return new Response(JSON.stringify({
        error: error.message,
        code: error.code,
        retryable: error.retryable
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      error: 'Failed to capture PayPal order',
      code: 'CAPTURE_ORDER_FAILED'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * OPTIONS - CORS 预检请求
 */
export async function OPTIONS(request: Request) {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400'
    }
  });
}