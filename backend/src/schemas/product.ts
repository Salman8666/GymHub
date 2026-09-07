import { z } from 'zod';

export const storeSchema = z.object({
  name: z.string().min(3, 'Store name is required'),
  description: z.string().min(10, 'Description is required'),
  logo: z.string().url().optional(),
  banner: z.string().url().optional(),
  contactInformation: z.string().optional(),
});

export const productSchema = z.object({
  name: z.string().min(3, 'Product name is required'),
  description: z.string().min(10, 'Product description is required'),
  features: z.array(z.string().min(1)).max(10).default([]),
  category: z.enum(['Supplements', 'Apparel', 'Gear', 'Digital']),
  price: z.number().min(0.01, 'Price must be greater than 0'),
  stock: z.number().min(0, 'Stock cannot be negative'),
  sku: z.string().optional(),
  image: z.string().url('Product image URL is required'),
  images: z.array(z.string().url()).max(3).default([]),
  featured: z.boolean().default(false),
  variants: z.array(z.object({
    name: z.string().min(1),
    price: z.number().min(0.01),
    stock: z.number().min(0),
    sku: z.string().optional(),
  })).optional(),
});

export const productReviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().min(5, 'Review comment must be at least 5 characters'),
});
