import { prisma } from '../lib/db';

export async function getFitnessPlans(filters?: {
  category?: string;
  difficulty?: string;
  maxPrice?: number;
  search?: string;
}) {
  const where: any = { isPublished: true };

  if (filters?.category) {
    where.category = filters.category;
  }

  if (filters?.difficulty) {
    where.difficulty = filters.difficulty;
  }

  if (filters?.maxPrice) {
    where.price = { lte: filters.maxPrice };
  }

  if (filters?.search) {
    where.OR = [
      { title: { contains: filters.search } },
      { description: { contains: filters.search } },
      { category: { contains: filters.search } },
    ];
  }

  const plans = await prisma.fitnessPlan.findMany({
    where,
    include: {
      trainerProfile: {
        include: {
          user: { select: { name: true, avatar: true } },
        },
      },
      schedules: true,
    },
    orderBy: { rankingScore: 'desc' },
  });

  return plans.map((p) => ({
    id: p.id,
    title: p.title,
    creator: p.trainerProfile.user.name,
    creatorRole: p.trainerProfile.title,
    creatorImage: p.trainerProfile.user.avatar || 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&w=150&q=80',
    category: p.category,
    durationWeeks: p.durationWeeks,
    daysPerWeek: p.daysPerWeek,
    difficulty: p.difficulty,
    price: p.price,
    rating: p.rating,
    enrolledCount: p.enrolledCount,
    image: p.image,
    description: p.description,
    schedules: p.schedules,
  }));
}

export async function createFitnessPlan(trainerProfileId: string, data: any) {
  const plan = await prisma.fitnessPlan.create({
    data: {
      trainerProfileId,
      title: data.title,
      category: data.category ?? 'Hypertrophy',
      durationWeeks: data.durationWeeks ?? 12,
      daysPerWeek: data.daysPerWeek ?? 5,
      difficulty: data.difficulty ?? 'Intermediate',
      price: data.price,
      image: data.image ?? 'https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?auto=format&fit=crop&w=600&q=80',
      description: data.description,
      rankingScore: 85.0,
    },
  });

  return plan;
}
