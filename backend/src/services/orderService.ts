import { prisma } from '../lib/db';

export async function getUserOrders(userId: string) {
  return prisma.order.findMany({
    where: { userId },
    include: {
      storeOrders: {
        include: {
          store: { select: { name: true } },
          items: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}

/**
 * TRAINER ORDER ISOLATION SERVICE
 * Strictly returns only StoreOrders that belong to the authenticated Trainer's profile.
 */
export async function getTrainerStoreOrders(trainerProfileId: string) {
  return prisma.storeOrder.findMany({
    where: { trainerProfileId },
    include: {
      order: {
        include: {
          user: { select: { name: true, email: true, avatar: true } },
        },
      },
      items: {
        include: {
          product: { select: { name: true, image: true, category: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function updateStoreOrderStatus(trainerProfileId: string, storeOrderId: string, status: 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED') {
  const storeOrder = await prisma.storeOrder.findFirst({
    where: {
      id: storeOrderId,
      trainerProfileId, // ENFORCE ISOLATED OWNERSHIP AT DATABASE LEVEL
    },
  });

  if (!storeOrder) {
    throw new Error('FORBIDDEN: You do not have permission to update this store order');
  }

  return prisma.storeOrder.update({
    where: { id: storeOrderId },
    data: { status },
  });
}
