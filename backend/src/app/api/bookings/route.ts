import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-middleware';
import { createBooking, getUserBookings, getTrainerAvailability } from '@/services/bookingService';
import { bookingSchema } from '@/schemas/booking';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const trainerProfileId = searchParams.get('trainerProfileId');
    const date = searchParams.get('date');

    if (trainerProfileId && date) {
      const slots = await getTrainerAvailability(trainerProfileId, date);
      return NextResponse.json({ success: true, data: slots });
    }

    const session = requireAuth(req);
    const bookings = await getUserBookings(session.id);
    return NextResponse.json({ success: true, data: bookings });
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
    const validated = bookingSchema.parse(body);
    const result = await createBooking(session.id, validated);
    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: 'BOOKING_FAILED', message: error.message } },
      { status: 400 }
    );
  }
}
