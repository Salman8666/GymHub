import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth-middleware';
import { getTrainerProfileByUserId } from '@/services/trainerService';

export async function GET(req: Request) {
  try {
    const session = requireRole(req, 'TRAINER');
    const profile = await getTrainerProfileByUserId(session.id);

    if (!profile) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Trainer profile not found' } },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: profile });
  } catch (error: any) {
    const message = error.message || 'Failed to fetch trainer profile';
    const isUnauthorized = message.includes('UNAUTHORIZED') || message.includes('FORBIDDEN');

    return NextResponse.json(
      {
        success: false,
        error: {
          code: isUnauthorized ? 'FORBIDDEN' : 'FETCH_ERROR',
          message: message.replace(/^[A-Z_]+:\s*/, ''),
        },
      },
      { status: isUnauthorized ? 403 : 500 }
    );
  }
}
