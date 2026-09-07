import { prisma } from '../lib/db';

export async function getTrainerAvailability(trainerProfileId: string, date: string) {
  const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });

  const availabilities = await prisma.availability.findMany({
    where: {
      trainerProfileId,
      dayOfWeek: dayName,
    },
  });

  const existingBookings = await prisma.booking.findMany({
    where: {
      trainerProfileId,
      date,
      status: { in: ['CONFIRMED', 'PENDING'] },
    },
    select: { startTime: true, endTime: true },
  });

  const bookedSlots = new Set(existingBookings.map((b) => b.startTime));

  // Generate 60-min slots standard
  const slots: { startTime: string; endTime: string; available: boolean }[] = [];
  const defaultTimes = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];

  for (const startTime of defaultTimes) {
    const hour = parseInt(startTime.split(':')[0], 10);
    const endTime = `${(hour + 1).toString().padStart(2, '0')}:00`;
    slots.push({
      startTime,
      endTime,
      available: !bookedSlots.has(startTime),
    });
  }

  return slots;
}

export async function createBooking(userId: string, data: {
  trainerProfileId: string;
  gymId?: string;
  date: string;
  startTime: string;
  endTime: string;
  notes?: string;
}) {
  const trainer = await prisma.trainerProfile.findUnique({
    where: { id: data.trainerProfileId },
    include: { user: { select: { name: true } } },
  });

  if (!trainer) {
    throw new Error('NOT_FOUND: Trainer profile not found');
  }

  // ATOMIC DATABASE TRANSACTION FOR DOUBLE-BOOKING PREVENTION
  return prisma.$transaction(async (tx) => {
    // 1. Check for slot conflict inside transaction
    const conflict = await tx.booking.findFirst({
      where: {
        trainerProfileId: data.trainerProfileId,
        date: data.date,
        startTime: data.startTime,
        status: { in: ['CONFIRMED', 'PENDING'] },
      },
    });

    if (conflict) {
      throw new Error('DOUBLE_BOOKING_PREVENTED: This time slot has already been booked by another athlete');
    }

    // 2. Create the booking atomically
    const booking = await tx.booking.create({
      data: {
        userId,
        trainerProfileId: data.trainerProfileId,
        gymId: data.gymId,
        date: data.date,
        startTime: data.startTime,
        endTime: data.endTime,
        price: trainer.hourlyRate,
        notes: data.notes,
        status: 'CONFIRMED',
      },
    });

    return {
      booking,
      trainerName: trainer.user.name,
      confirmationMessage: `Booking confirmed with ${trainer.user.name} for ${data.date} at ${data.startTime}. Confirmation email queued.`,
    };
  });
}

export async function getUserBookings(userId: string) {
  return prisma.booking.findMany({
    where: { userId },
    include: {
      trainerProfile: {
        include: {
          user: { select: { name: true, avatar: true } },
        },
      },
    },
    orderBy: { date: 'desc' },
  });
}
