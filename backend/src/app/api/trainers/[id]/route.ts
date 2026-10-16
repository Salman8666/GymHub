import { NextResponse } from 'next/server';
import { getTrainerById } from '@/services/trainerService';

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const trainer = await getTrainerById(id);

    if (!trainer) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Trainer not found' } },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: trainer });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: 'FETCH_ERROR', message: error.message } },
      { status: 500 }
    );
  }
}
