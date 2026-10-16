import { NextResponse } from 'next/server';
import { getGymById } from '@/services/gymService';

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const gym = await getGymById(id);

    if (!gym) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Gym not found' } },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: gym });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: 'FETCH_ERROR', message: error.message } },
      { status: 500 }
    );
  }
}
