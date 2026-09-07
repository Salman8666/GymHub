import { NextResponse } from 'next/server';
import { getGyms, createGym } from '@/services/gymService';
import { requireRole } from '@/lib/auth-middleware';
import { gymSchema } from '@/schemas/gym';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || undefined;
    const acType = searchParams.get('acType') || undefined;
    const maxDayPass = searchParams.get('maxDayPass') ? parseFloat(searchParams.get('maxDayPass')!) : undefined;

    const gyms = await getGyms({ search, acType, maxDayPass });
    return NextResponse.json({ success: true, data: gyms });
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
      throw new Error('FORBIDDEN: Trainer profile required to create gyms');
    }
    const body = await req.json();
    const validated = gymSchema.parse(body);
    const gym = await createGym(session.trainerProfileId, validated);
    return NextResponse.json({ success: true, data: gym });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: 'CREATE_FAILED', message: error.message } },
      { status: 400 }
    );
  }
}
