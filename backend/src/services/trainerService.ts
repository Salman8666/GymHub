import { prisma } from '../lib/db';
import { calculateTrainerRankingScore } from './rankingService';

function computeReviewStats(reviews: { rating: number }[]) {
  const reviewsCount = reviews.length;
  const rating = reviewsCount > 0
    ? parseFloat((reviews.reduce((acc, r) => acc + r.rating, 0) / reviewsCount).toFixed(2))
    : 5.0;
  return { rating, reviewsCount };
}

export async function getTrainers(filters?: {
  niche?: string;
  minExperience?: number;
  maxHourlyRate?: number;
  search?: string;
}) {
  const where: any = {};

  if (filters?.minExperience) {
    where.experienceYears = { gte: filters.minExperience };
  }

  if (filters?.maxHourlyRate) {
    where.hourlyRate = { lte: filters.maxHourlyRate };
  }

  if (filters?.search) {
    where.OR = [
      { title: { contains: filters.search } },
      { bio: { contains: filters.search } },
      { location: { contains: filters.search } },
      { user: { name: { contains: filters.search } } },
    ];
  }

  const profiles = await prisma.trainerProfile.findMany({
    where,
    include: {
      user: {
        select: { name: true, avatar: true },
      },
      certifications: true,
      reviews: true,
    },
    orderBy: { rankingScore: 'desc' },
  });

  return profiles.map((p) => {
    const totalReviews = p.reviews.length;
    const avgRating = totalReviews > 0
      ? parseFloat((p.reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(2))
      : 0;

    let specialtiesArr: string[] = [];
    try {
      specialtiesArr = JSON.parse(p.specialties);
    } catch {
      specialtiesArr = [];
    }

    return {
      id: p.id,
      name: p.user.name,
      title: p.title,
      bio: p.bio,
      location: p.location,
      specialties: specialtiesArr,
      experienceYears: p.experienceYears,
      hourlyRate: p.hourlyRate,
      verified: p.verified,
      image: p.user.avatar,
      rating: avgRating,
      reviewsCount: totalReviews,
      rankingScore: p.rankingScore,
      certifications: p.certifications,
    };
  });
}

export async function getTrainerById(id: string) {
  const p = await prisma.trainerProfile.findUnique({
    where: { id },
    include: {
      user: { select: { name: true, avatar: true } },
      certifications: true,
      gyms: true,
      fitnessPlans: true,
      store: { include: { products: true } },
      reviews: { include: { user: { select: { name: true, avatar: true } } } },
    },
  });

  if (!p) return null;

  let specialtiesArr: string[] = [];
  try {
    specialtiesArr = JSON.parse(p.specialties);
  } catch {
    specialtiesArr = [];
  }

  return {
    ...p,
    name: p.user.name,
    image: p.user.avatar,
    specialties: specialtiesArr,
  };
}

export async function getTrainerProfileByUserId(userId: string) {
  const p = await prisma.trainerProfile.findUnique({
    where: { userId },
    include: {
      user: { select: { name: true, avatar: true } },
      certifications: true,
      gyms: true,
      fitnessPlans: { orderBy: { createdAt: 'desc' } },
      store: { include: { products: { orderBy: { createdAt: 'desc' } } } },
      reviews: { include: { user: { select: { name: true, avatar: true } } } },
    },
  });

  if (!p) return null;

  let specialtiesArr: string[] = [];
  try {
    specialtiesArr = JSON.parse(p.specialties);
  } catch {
    specialtiesArr = [];
  }

  return {
    ...p,
    name: p.user.name,
    image: p.user.avatar,
    specialties: specialtiesArr,
  };
}

export async function createTrainerReview(
  userId: string,
  trainerProfileId: string,
  data: { rating: number; comment: string }
) {
  const profile = await prisma.trainerProfile.findUnique({
    where: { id: trainerProfileId },
    include: { reviews: true },
  });
  if (!profile) throw new Error('NOT_FOUND: Trainer not found');

  const existingReview = await prisma.review.findFirst({
    where: { userId, trainerProfileId },
  });
  if (existingReview) throw new Error('CONFLICT: You have already reviewed this trainer');

  const review = await prisma.review.create({
    data: {
      userId,
      trainerProfileId,
      rating: data.rating,
      comment: data.comment,
    },
    include: { user: { select: { name: true, avatar: true } } },
  });

  const stats = computeReviewStats([...profile.reviews, review]);
  const rankingScore = calculateTrainerRankingScore({
    rating: stats.rating,
    reviewsCount: stats.reviewsCount,
    experienceYears: profile.experienceYears,
    verified: profile.verified,
    featured: profile.rankingScore > 80,
    profileCompleteness: profile.profileCompleteness,
  });

  await prisma.trainerProfile.update({
    where: { id: trainerProfileId },
    data: { rankingScore },
  });

  return review;
}

export async function updateTrainerProfile(
  userId: string,
  data: any & { certifications?: { name: string; issuingBody: string; year: number }[] }
) {
  const profile = await prisma.trainerProfile.findUnique({
    where: { userId },
    include: { reviews: true, certifications: true },
  });
  if (!profile) throw new Error('FORBIDDEN: Trainer profile not found');

  let completeness = 50;
  if (data.title) completeness += 10;
  if (data.bio && data.bio.length > 30) completeness += 15;
  if (data.specialties && data.specialties.length > 0) completeness += 15;
  if (data.hourlyRate > 0) completeness += 10;
  if (data.certifications && data.certifications.length > 0) completeness += 10;
  completeness = Math.min(completeness, 100);

  const stats = computeReviewStats(profile.reviews);
  const rankingScore = calculateTrainerRankingScore({
    rating: stats.rating,
    reviewsCount: stats.reviewsCount,
    experienceYears: data.experienceYears ?? profile.experienceYears,
    verified: profile.verified,
    featured: profile.rankingScore > 80,
    profileCompleteness: completeness,
  });

  const certificationUpdates: any[] = [];
  if (data.certifications) {
    certificationUpdates.push(
      prisma.trainerCertification.deleteMany({ where: { trainerProfileId: profile.id } })
    );
    for (const cert of data.certifications) {
      certificationUpdates.push(
        prisma.trainerCertification.create({
          data: {
            trainerProfileId: profile.id,
            name: cert.name,
            issuingBody: cert.issuingBody,
            year: cert.year,
          },
        })
      );
    }
  }

  const [updated] = await prisma.$transaction([
    prisma.trainerProfile.update({
      where: { id: profile.id },
      data: {
        title: data.title ?? profile.title,
        bio: data.bio ?? profile.bio,
        location: data.location ?? profile.location,
        specialties: data.specialties ? JSON.stringify(data.specialties) : profile.specialties,
        experienceYears: data.experienceYears ?? profile.experienceYears,
        hourlyRate: data.hourlyRate ?? profile.hourlyRate,
        whatsapp: data.whatsapp ?? profile.whatsapp,
        profileCompleteness: completeness,
        rankingScore,
      },
    }),
    ...certificationUpdates,
  ]);

  return updated;
}
