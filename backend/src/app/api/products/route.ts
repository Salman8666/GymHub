import { NextResponse } from 'next/server';
import { getProducts, createProduct } from '@/services/productService';
import { requireRole } from '@/lib/auth-middleware';
import { productSchema } from '@/schemas/product';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || undefined;
    const category = searchParams.get('category') || undefined;

    const products = await getProducts({ search, category });
    return NextResponse.json({ success: true, data: products });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: 'FETCH_ERROR', message: error.message } },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = requireRole(req, 'TRAINER');
    if (!session.trainerProfileId) {
      throw new Error('FORBIDDEN: Trainer profile required to create products');
    }
    const body = await req.json();
    const validated = productSchema.parse(body);
    const product = await createProduct(session.trainerProfileId, validated);
    return NextResponse.json({ success: true, data: product });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: 'CREATE_FAILED', message: error.message } },
      { status: 400 }
    );
  }
}
