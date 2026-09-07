import { z } from 'zod';

export const reviewSchema = z.object({
  rating: z.number().int().min(1, 'Rating must be at least 1').max(5, 'Rating cannot exceed 5'),
  comment: z.string().min(3, 'Review comment must be at least 3 characters').max(1000, 'Review comment must be under 1000 characters'),
});

export const gymReviewSchema = reviewSchema;
export const trainerReviewSchema = reviewSchema;
