import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth-middleware';
import { getTrainerDashboardAnalytics } from '@/services/analyticsService';

export async function GET(req: Request) {
  try {
    const session = requireRole(req, 'TRAINER');
    if (!session.trainerProfileId) {
      throw new Error('FORBIDDEN: Trainer profile required');
    }
    const analytics = await getTrainerDashboardAnalytics(session.trainerProfileId);
    return NextResponse.json({ success: true, data: analytics });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: 'UNAUTHORIZED', message: error.message } },
      { status: 401 }
    );
  }
}
