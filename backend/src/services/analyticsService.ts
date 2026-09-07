import { prisma } from '../lib/db';

export async function getTrainerDashboardAnalytics(trainerProfileId: string) {
  // 1. Calculate Store Orders & Total Revenue
  const storeOrders = await prisma.storeOrder.findMany({
    where: { trainerProfileId, status: { not: 'CANCELLED' } },
  });

  const totalStoreRevenue = storeOrders.reduce((sum, o) => sum + o.subtotal, 0);

  // 2. Count Active Bookings & Booking Revenue
  const bookings = await prisma.booking.findMany({
    where: { trainerProfileId, status: { in: ['CONFIRMED', 'COMPLETED'] } },
  });

  const totalBookingRevenue = bookings.reduce((sum, b) => sum + b.price, 0);
  const totalRevenue = totalStoreRevenue + totalBookingRevenue;

  // 3. Count Active Clients (distinct users with bookings or orders)
  const bookingUserIds = bookings.map((b) => b.userId);
  const distinctClients = new Set(bookingUserIds).size;

  // 4. Count Published Fitness Plan Sales
  const plans = await prisma.fitnessPlan.findMany({
    where: { trainerProfileId },
  });
  const totalPlanEnrollments = plans.reduce((sum, p) => sum + p.enrolledCount, 0);

  return {
    activeClients: distinctClients,
    monthlyPayout: parseFloat(totalRevenue.toFixed(2)),
    totalOrders: storeOrders.length,
    workoutsLogged: bookings.length,
    planSales: totalPlanEnrollments,
    revenueTrend: '+0.0% vs last mo',
    satisfactionRate: '—',
  };
}
