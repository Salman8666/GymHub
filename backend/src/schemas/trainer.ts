import { z } from 'zod';

export const ALLOWED_NICHES = [
  'Weight Loss',
  'Muscle Building',
  'Strength',
  'Bodybuilding',
  'Functional Training',
  'Mobility',
  'HIIT',
  'Sports Performance',
  'Women\'s Fitness',
  'Senior Fitness',
  'Hypertrophy Science',
  'Powerlifting',
  'Olympic Lifting',
] as const;

export const trainerProfileSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  bio: z.string().min(10, 'Bio must be at least 10 characters'),
  location: z.string().min(2, 'Location is required'),
  specialties: z.array(z.string()).min(1, 'Select at least one specialty'),
  experienceYears: z.number().min(0, 'Experience must be 0 or greater'),
  hourlyRate: z.number().min(5, 'Hourly rate must be at least $5'),
  whatsapp: z.string().optional(),
});

export const certificationSchema = z.object({
  name: z.string().min(2),
  issuingBody: z.string().min(2),
  year: z.number().min(1950).max(new Date().getFullYear()),
});
