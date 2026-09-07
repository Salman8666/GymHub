import { z } from 'zod';

export const gymSchema = z.object({
  name: z.string().min(3, 'Gym name must be at least 3 characters'),
  tagline: z.string().min(5, 'Tagline must be at least 5 characters'),
  location: z.string().min(2, 'Location is required'),
  address: z.string().min(5, 'Address is required').optional(),
  dayPassPrice: z.number().min(1, 'Day pass price must be at least $1'),
  monthlyPrice: z.number().min(5, 'Monthly price must be at least $5'),
  image: z.string().url('Main image URL is required').optional(),
  images: z.array(z.string().url()).max(3, 'You can upload up to 3 gym images').optional(),
  hours: z.string().min(2, 'Operating hours are required').optional(),
  acType: z.enum(['AC', 'Non-AC']).default('AC'),
  admissionFee: z.number().min(0).default(0),
  googleMapsLocation: z.string().optional(),
  whatsapp: z.string().optional(),
  featured: z.boolean().default(false),
  amenities: z.array(z.string()).optional(),
  equipment: z.array(z.string()).optional(),
});
