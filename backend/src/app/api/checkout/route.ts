import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-middleware';
import { createStripeCheckoutSession } from '@/services/checkoutService';

export async function POST(req: Request) {
  try {
    const session = requireAuth(req);
    const body = await req.json();
    const result = await createStripeCheckoutSession(session.id, body);
    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: 'CHECKOUT_FAILED', message: error.message } },
      { status: 400 }
    );
  }
}
