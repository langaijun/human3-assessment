/**
 * PayPal 支付 API (Vercel Serverless)
 */
import { NextRequest, NextResponse } from 'next/server';

const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET || '';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, currency, csrfToken } = body;

    if (!csrfToken) {
      return NextResponse.json({ error: 'Missing CSRF token' }, { status: 400 });
    }

    const response = await fetch('https://api-m.paypal.com/v2/checkout/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${PAYPAL_CLIENT_SECRET}`,
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: currency || 'USD',
            value: amount.toString(),
          },
        }],
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json({ error: error.message || 'Failed to create order' }, { status: 500 });
    }

    return NextResponse.json(await response.json());
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, csrfToken } = body;

    if (!csrfToken) {
      return NextResponse.json({ error: 'Missing CSRF token' }, { status: 400 });
    }

    const response = await fetch(`https://api-m.paypal.com/v2/checkout/orders/${orderId}/capture`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${PAYPAL_CLIENT_SECRET}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json({ error: error.message || 'Failed to capture order' }, { status: 500 });
    }

    const capture = await response.json();
    return NextResponse.json({
      success: true,
      captureId: capture.id,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
