import { prisma } from '../lib/db';
import { calculateGymRankingScore } from './rankingService';

function computeReviewStats(reviews: { rating: number }[]) {
  const reviewsCount = reviews.length;
  const rating = reviewsCount > 0
    ? parseFloat((reviews.reduce((acc, r) => acc + r.rating, 0) / reviewsCount).toFixed(2))
    : 5.0;
  return { rating, reviewsCount };
}

function parseJsonArray(value: string | null | undefined): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function getGyms(filters?: {
  location?: string;
  acType?: string;
  maxDayPass?: number;
  search?: string;
}) {
  const where: any = { isPublished: true };

  if (filters?.acType) {
    where.acType = filters.acType;
  }

  if (filters?.maxDayPass) {
    where.dayPassPrice = { lte: filters.maxDayPass };
  }

  if (filters?.search) {
    where.OR = [
      { name: { contains: filters.search } },
      { tagline: { contains: filters.search } },
      { location: { contains: filters.search } },
      { address: { contains: filters.search } },
    ];
  }

  const gyms = await prisma.gym.findMany({
    where,
    include: {
      images: { orderBy: { orderIndex: 'asc' } },
      reviews: true,
    },
    orderBy: { rankingScore: 'desc' },
  });

  return gyms.map((g) => {
    const stats = computeReviewStats(g.reviews);
    return {
      ...g,
      rating: stats.rating,
      reviewsCount: stats.reviewsCount,
      gallery: g.images.length > 0 ? g.images.map((img) => img.url) : [g.image],
      amenities: parseJsonArray(g.amenities),
      equipment: parseJsonArray(g.equipment),
    };
  });
}

export async function getGymById(id: string) {
  const gym = await prisma.gym.findUnique({
    where: { id },
    include: {
      images: { orderBy: { orderIndex: 'asc' } },
      reviews: { include: { user: { select: { name: true, avatar: true } } } },
      trainerProfile: { include: { user: { select: { name: true, avatar: true } } } },
    },
  });

  if (!gym) return null;

  const stats = computeReviewStats(gym.reviews);
  return {
    ...gym,
    rating: stats.rating,
    reviewsCount: stats.reviewsCount,
    gallery: gym.images.length > 0 ? gym.images.map((img) => img.url) : [gym.image],
    amenities: parseJsonArray(gym.amenities),
    equipment: parseJsonArray(gym.equipment),
  };
}

export async function createGymReview(userId: string, gymId: string, data: { rating: number; comment: string }) {
  const gym = await prisma.gym.findUnique({ where: { id: gymId } });
  if (!gym) throw new Error('NOT_FOUND: Gym facility not found');

  const existing = await prisma.review.findFirst({
    where: { userId, gymId },
  });
  if (existing) throw new Error('CONFLICT: You have already reviewed this gym');

  const review = await prisma.review.create({
    data: {
      userId,
      gymId,
      rating: data.rating,
      comment: data.comment,
      verifiedPurchase: true,
    },
    include: {
      user: { select: { name: true, avatar: true } },
    },
  });

  const allReviews = await prisma.review.findMany({
    where: { gymId },
    select: { rating: true },
  });
  const stats = computeReviewStats(allReviews);

  await prisma.gym.update({
    where: { id: gymId },
    data: {
      rating: stats.rating,
      reviewsCount: stats.reviewsCount,
    },
  });

  return review;
}

export async function createGym(trainerProfileId: string, data: any) {
  const images: string[] = data.images?.length > 0 ? data.images : data.image ? [data.image] : [];
  const mainImage = images[0] ?? '';
  const amenities = Array.isArray(data.amenities) ? data.amenities : [];
  const equipment = Array.isArray(data.equipment) ? data.equipment : [];

  const rankingScore = calculateGymRankingScore({
    rating: 5.0,
    reviewsCount: 1,
    featured: data.featured ?? false,
    dayPassPrice: data.dayPassPrice,
    monthlyPrice: data.monthlyPrice,
    amenitiesCount: amenities.length,
  });

  const gym = await prisma.gym.create({
    data: {
      trainerProfileId,
      name: data.name,
      tagline: data.tagline,
      location: data.location,
      address: data.address || data.location,
      dayPassPrice: data.dayPassPrice,
      monthlyPrice: data.monthlyPrice,
      image: mainImage,
      hours: data.hours || '24 Hours',
      acType: data.acType ?? 'AC',
      admissionFee: data.admissionFee ?? 0,
      googleMapsLocation: data.googleMapsLocation,
      whatsapp: data.whatsapp,
      featured: data.featured ?? false,
      rankingScore,
      amenities: JSON.stringify(amenities),
      equipment: JSON.stringify(equipment),
    },
  });

  if (images.length > 0) {
    await prisma.gymImage.createMany({
      data: images.map((url: string, index: number) => ({
        gymId: gym.id,
        url,
        orderIndex: index,
      })),
    });
  }

  return gym;
}
