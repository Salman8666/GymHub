import { prisma } from '../lib/db';
import { calculateProductRankingScore } from './rankingService';

function parseFeatures(featuresJson: string): string[] {
  try {
    const parsed = JSON.parse(featuresJson);
    if (Array.isArray(parsed)) return parsed;
    return [];
  } catch {
    return [];
  }
}

export async function getProducts(filters?: {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}) {
  const where: any = { isPublished: true };

  if (filters?.category) {
    where.category = filters.category;
  }

  if (filters?.search) {
    where.OR = [
      { name: { contains: filters.search } },
      { description: { contains: filters.search } },
      { category: { contains: filters.search } },
    ];
  }

  const products = await prisma.product.findMany({
    where,
    include: {
      store: { select: { name: true, trainerProfileId: true } },
      variants: true,
      images: { orderBy: { orderIndex: 'asc' } },
      reviews: true,
    },
    orderBy: { rankingScore: 'desc' },
  });

  return products.map((p) => {
    const totalReviews = p.reviews.length;
    const avgRating = totalReviews > 0
      ? parseFloat((p.reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(2))
      : 0;

    return {
      ...p,
      features: parseFeatures(p.features),
      rating: avgRating,
      reviewsCount: totalReviews,
    };
  });
}

export async function getProductById(id: string) {
  const p = await prisma.product.findUnique({
    where: { id },
    include: {
      store: { include: { trainerProfile: { include: { user: { select: { name: true, avatar: true } } } } } },
      variants: true,
      images: { orderBy: { orderIndex: 'asc' } },
      reviews: { include: { user: { select: { name: true, avatar: true } } } },
    },
  });

  if (!p) return null;

  const totalReviews = p.reviews.length;
  const avgRating = totalReviews > 0
    ? parseFloat((p.reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(2))
    : 0;

  return {
    ...p,
    features: parseFeatures(p.features),
    rating: avgRating,
    reviewsCount: totalReviews,
  };
}

export async function createProduct(trainerProfileId: string, data: any) {
  let store = await prisma.store.findUnique({ where: { trainerProfileId } });

  if (!store) {
    store = await prisma.store.create({
      data: {
        trainerProfileId,
        name: 'Official Trainer Marketplace Store',
        description: 'Authentic supplements, powerlifting equipment, and high-performance athletic wear.',
      },
    });
  }

  const rankingScore = calculateProductRankingScore({
    rating: 5.0,
    reviewsCount: 1,
    featured: data.featured ?? false,
    inStock: true,
    stock: data.stock ?? 100,
  });

  const imageUrls: string[] = data.images || [];
  const coverImage = data.image || imageUrls[0] || '';

  const product = await prisma.product.create({
    data: {
      storeId: store.id,
      name: data.name,
      description: data.description,
      features: JSON.stringify(data.features || []),
      category: data.category,
      price: data.price,
      stock: data.stock ?? 50,
      sku: data.sku || `SKU-${Date.now()}`,
      image: coverImage,
      featured: data.featured ?? false,
      rankingScore,
    },
  });

  if (imageUrls.length > 0) {
    await prisma.productImage.createMany({
      data: imageUrls.map((url: string, index: number) => ({
        productId: product.id,
        url,
        orderIndex: index,
      })),
    });
  }

  if (data.variants && data.variants.length > 0) {
    for (const v of data.variants) {
      await prisma.productVariant.create({
        data: {
          productId: product.id,
          name: v.name,
          price: v.price ?? data.price,
          stock: v.stock ?? 20,
          sku: v.sku || `VAR-${Date.now()}`,
        },
      });
    }
  }

  return product;
}

export async function createProductReview(
  userId: string,
  productId: string,
  data: { rating: number; comment: string }
) {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { reviews: true },
  });
  if (!product) throw new Error('NOT_FOUND: Product not found');

  const existingReview = await prisma.review.findFirst({
    where: { userId, productId },
  });
  if (existingReview) throw new Error('CONFLICT: You have already reviewed this product');

  const review = await prisma.review.create({
    data: {
      userId,
      productId,
      rating: data.rating,
      comment: data.comment,
    },
    include: { user: { select: { name: true, avatar: true } } },
  });

  const totalReviews = product.reviews.length + 1;
  const avgRating = parseFloat(
    ((product.reviews.reduce((acc, r) => acc + r.rating, 0) + data.rating) / totalReviews).toFixed(2)
  );
  const rankingScore = calculateProductRankingScore({
    rating: avgRating,
    reviewsCount: totalReviews,
    featured: product.featured,
    inStock: product.inStock && product.stock > 0,
    stock: product.stock,
  });

  await prisma.product.update({
    where: { id: productId },
    data: { rankingScore },
  });

  return review;
}
