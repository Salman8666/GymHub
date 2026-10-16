import { NextResponse } from 'next/server';
import { requireAuth, requireRole } from '@/lib/auth-middleware';
import { getUserOrders, getTrainerStoreOrders, updateStoreOrderStatus } from '@/services/orderService';

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

export async function PATCH(req: Request) {
  try {
    const session = requireRole(req, 'TRAINER');
    if (!session.trainerProfileId) {
      throw new Error('FORBIDDEN: Trainer profile required');
    }

    const body = await req.json();
    const { storeOrderId, status } = body;

    if (!storeOrderId || !status) {
      throw new Error('storeOrderId and status are required');
    }

    const updated = await updateStoreOrderStatus(session.trainerProfileId, storeOrderId, status);
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    const message = error.message || 'Failed to update order status';
    const isForbidden = message.includes('FORBIDDEN');
    return NextResponse.json(
      { success: false, error: { code: isForbidden ? 'FORBIDDEN' : 'UPDATE_FAILED', message } },
      { status: isForbidden ? 403 : 400 }
    );
  }
}

