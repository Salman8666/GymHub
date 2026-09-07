/**
 * Gym Hub Data-Driven Ranking Service
 * Calculates deterministic ranking scores for Gyms, Trainers, and Products
 */

export function calculateGymRankingScore(gym: {
  rating: number;
  reviewsCount: number;
  featured: boolean;
  dayPassPrice: number;
  monthlyPrice: number;
  amenitiesCount: number;
}): number {
  let score = 0;
  score += gym.rating * 15; // Max 75 pts
  score += Math.min(gym.reviewsCount * 2, 40); // Max 40 pts
  if (gym.featured) score += 20; // 20 pts bonus
  if (gym.amenitiesCount > 3) score += 10;
  return parseFloat(score.toFixed(2));
}

export function calculateTrainerRankingScore(trainer: {
  rating: number;
  reviewsCount: number;
  experienceYears: number;
  verified: boolean;
  featured: boolean;
  profileCompleteness: number;
}): number {
  let score = 0;
  score += trainer.rating * 12;
  score += Math.min(trainer.reviewsCount * 2, 30);
  score += Math.min(trainer.experienceYears * 3, 20);
  if (trainer.verified) score += 15;
  if (trainer.featured) score += 15;
  score += (trainer.profileCompleteness / 100) * 10;
  return parseFloat(score.toFixed(2));
}

export function calculateProductRankingScore(product: {
  rating: number;
  reviewsCount: number;
  featured: boolean;
  inStock: boolean;
  stock: number;
}): number {
  let score = 0;
  score += product.rating * 15;
  score += Math.min(product.reviewsCount * 2, 35);
  if (product.featured) score += 20;
  if (product.inStock && product.stock > 0) score += 15;
  return parseFloat(score.toFixed(2));
}
