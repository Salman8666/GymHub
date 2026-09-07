import { NextResponse } from 'next/server';
import { getFitnessPlans, createFitnessPlan } from '@/services/planService';
import { requireRole } from '@/lib/auth-middleware';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || undefined;
    const category = searchParams.get('category') || undefined;
    const difficulty = searchParams.get('difficulty') || undefined;

    const plans = await getFitnessPlans({ search, category, difficulty });
    return NextResponse.json({ success: true, data: plans });
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
      throw new Error('FORBIDDEN: Trainer profile required to create fitness plans');
    }
    const body = await req.json();
    const plan = await createFitnessPlan(session.trainerProfileId, body);
    return NextResponse.json({ success: true, data: plan });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: 'CREATE_FAILED', message: error.message } },
      { status: 400 }
    );
  }
}
