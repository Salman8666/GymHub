import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-middleware';
import { getUserCart, addToCart, removeFromCart, updateCartItemQuantity } from '@/services/cartService';

export async function GET(req: Request) {
  try {
    const session = requireAuth(req);
    const cart = await getUserCart(session.id);
    return NextResponse.json({ success: true, data: cart });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: 'UNAUTHORIZED', message: error.message } },
      { status: 401 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = requireAuth(req);
    const body = await req.json();
    const { productId, variantId, quantity } = body;
    const cart = await addToCart(session.id, productId, variantId, quantity || 1);
    return NextResponse.json({ success: true, data: cart });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: 'CART_ERROR', message: error.message } },
      { status: 400 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const session = requireAuth(req);
    const { searchParams } = new URL(req.url);
    const itemId = searchParams.get('itemId');
    if (!itemId) {
      throw new Error('Item ID is required');
    }
    const cart = await removeFromCart(session.id, itemId);
    return NextResponse.json({ success: true, data: cart });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: 'CART_ERROR', message: error.message } },
      { status: 400 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const session = requireAuth(req);
    const body = await req.json();
    const { itemId, quantity } = body;
    if (!itemId || typeof quantity !== 'number') {
      throw new Error('itemId and quantity are required');
    }
    const cart = await updateCartItemQuantity(session.id, itemId, quantity);
    return NextResponse.json({ success: true, data: cart });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: 'CART_ERROR', message: error.message } },
      { status: 400 }
    );
  }
}
