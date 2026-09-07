import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-middleware';
import { getUserOrders, getTrainerStoreOrders } from '@/services/orderService';

export async function GET(req: Request) {
  try {
    const session = requireAuth(req);

    // If Trainer, return isolated trainer store orders
    if (session.role === 'TRAINER' && session.trainerProfileId) {
      const storeOrders = await getTrainerStoreOrders(session.trainerProfileId);
      return NextResponse.json({ success: true, data: storeOrders });
    }

    // Standard User Orders
    const orders = await getUserOrders(session.id);
    return NextResponse.json({ success: true, data: orders });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: 'UNAUTHORIZED', message: error.message } },
      { status: 401 }
    );
  }
}
