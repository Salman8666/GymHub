import { prisma } from '../lib/db';

export async function createStore(trainerProfileId: string, data: {
  name: string;
  description: string;
  logo?: string;
  banner?: string;
  contactInformation?: string;
}) {
  const existingStore = await prisma.store.findUnique({
    where: { trainerProfileId },
  });

  if (existingStore) {
    throw new Error('ONE_STORE_LIMIT: Each trainer may only create one marketplace store');
  }

  const store = await prisma.store.create({
    data: {
      trainerProfileId,
      name: data.name,
      description: data.description,
      logo: data.logo || 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?auto=format&fit=crop&w=200&q=80',
      banner: data.banner || 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80',
      contactInformation: data.contactInformation,
    },
  });

  return store;
}

export async function getStoreByTrainerId(trainerProfileId: string) {
  return prisma.store.findUnique({
    where: { trainerProfileId },
    include: { products: { include: { variants: true } } },
  });
}
