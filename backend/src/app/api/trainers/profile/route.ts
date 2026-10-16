import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth-middleware';
import { updateTrainerProfile } from '@/services/trainerService';

export async function PUT(req: Request) {
  try {
    const session = requireRole(req, 'TRAINER');
    const body = await req.json();

    const updated = await updateTrainerProfile(session.id, body);
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    const message = error.message || 'Failed to update trainer profile';
    const isUnauthorized = message.includes('UNAUTHORIZED') || message.includes('FORBIDDEN');

    return NextResponse.json(
      {
        success: false,
        error: {
          code: isUnauthorized ? 'FORBIDDEN' : 'UPDATE_FAILED',
          message: message.replace(/^[A-Z_]+:\s*/, ''),
        },
      },
      { status: isUnauthorized ? 403 : 400 }
    );
  }
}
