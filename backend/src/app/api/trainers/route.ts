import { NextResponse } from 'next/server';
import { getTrainers } from '@/services/trainerService';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || undefined;
    const maxHourlyRate = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined;
    const minExperience = searchParams.get('experience') ? parseInt(searchParams.get('experience')!, 10) : undefined;

    const trainers = await getTrainers({ search, maxHourlyRate, minExperience });
    return NextResponse.json({ success: true, data: trainers });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: 'FETCH_ERROR', message: error.message } },
      { status: 500 }
    );
  }
}
