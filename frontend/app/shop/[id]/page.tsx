'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { useCart } from '@/lib/cart-context';
import { useAuth } from '@/lib/auth-context';
import { Star, ShieldCheck, ShoppingBag, Truck, RotateCcw, CheckCircle2, User, Send } from 'lucide-react';
import Link from 'next/link';

interface ProductVariant {
  id: string;
  name: string;
  price: number;
  stock: number;
}

interface ProductReview {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: { name: string; avatar: string };
}

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  rating: number;
  reviewsCount: number;
  image: string;
  images: { id: string; url: string; orderIndex: number }[];
  description: string;
  features: string[];
  inStock: boolean;
  stock: number;
  variants: ProductVariant[];
  reviews: ProductReview[];
}

export default function ProductDetailPage() {
  const params = useParams();
  const prodId = params?.id as string;
  const { addToCart } = useCart();
  const { user, setIsAuthOpen, setAuthMode } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVariantId, setSelectedVariantId] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [added, setAdded] = useState(false);

  const [activeImage, setActiveImage] = useState<string>('');

  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  useEffect(() => {
    if (!prodId) return;
    apiClient.products
      .getById(prodId)
      .then((data) => {
        setProduct(data);
        const images = data.images || [];
        setActiveImage(data.image || images[0]?.url || '');
        if (data.variants && data.variants.length > 0) {
          setSelectedVariantId(data.variants[0].id);
        }
      })
      .catch((err) => setError(err.message || 'Failed to load product'))
      .finally(() => setIsLoading(false));
  }, [prodId]);

  const selectedVariant = product?.variants.find((v) => v.id === selectedVariantId);
  const displayPrice = selectedVariant ? selectedVariant.price : product?.price ?? 0;
  const availableStock = selectedVariant ? selectedVariant.stock : product?.stock ?? 0;
  const canAddToCart = product ? product.inStock && availableStock >= quantity : false;

  const allImages = product
    ? [product.image, ...(product.images || []).map((img) => img.url)].filter((url, idx, arr) => url && arr.indexOf(url) === idx)
    : [];

  const handleAddToCart = async () => {
    if (!user) {
      setAuthMode('login');
      setIsAuthOpen(true);
      return;
    }
    if (!product || !canAddToCart) return;

    try {
      await addToCart(product.id, selectedVariantId || undefined, quantity);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch {
      // Error surfaced in cart context
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setAuthMode('login');
      setIsAuthOpen(true);
      return;
    }
    if (!product) return;
    if (reviewComment.trim().length < 5) {
      setReviewError('Review comment must be at least 5 characters.');
      return;
    }

    setReviewSubmitting(true);
    setReviewError(null);
    setReviewSuccess(false);

    try {
      await apiClient.products.createReview(product.id, {
        rating: reviewRating,
        comment: reviewComment.trim(),
      });
      setReviewSuccess(true);
      setReviewComment('');
      setReviewRating(5);
      // Refresh product to show new review
      const updated = await apiClient.products.getById(product.id);
      setProduct(updated);
    } catch (err: any) {
      setReviewError(err.message || 'Failed to submit review');
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <p className="text-sm text-slate-500 font-bold uppercase">Loading product...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-4">
        <p className="text-sm text-red-500 font-bold">{error || 'Product not found'}</p>
        <Link href="/shop" className="inline-block px-6 py-3 rounded bg-[#006e21] dark:bg-[#2dff5f] text-white dark:text-black font-extrabold text-xs uppercase tracking-wider">
          Back to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Product Image Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-slate-100 dark:bg-[#16191f] p-8 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-center h-[420px]">
            <img src={activeImage} alt={product.name} className="max-h-full max-w-full object-contain" />
          </div>
          {allImages.length > 1 && (
            <div className="flex gap-3 overflow-x-auto">
              {allImages.map((url, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(url)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg border overflow-hidden p-2 bg-slate-100 dark:bg-slate-900 ${activeImage === url ? 'border-[#2dff5f] ring-1 ring-[#2dff5f]' : 'border-slate-300 dark:border-slate-700'}`}
                >
                  <img src={url} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details & Selection */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <span className="px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-extrabold text-xs uppercase tracking-wider">
              {product.category}
            </span>
            <h1 className="text-3xl font-black uppercase mt-2">{product.name}</h1>
            
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-1 text-xs font-bold">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" /> {product.rating}
              </div>
              <span className="text-slate-400">•</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-bold">{product.reviewsCount} Verified Athlete Reviews</span>
            </div>

            <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-4">
              ${displayPrice.toFixed(2)}
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {product.description}
          </p>

          {product.features && product.features.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Key Features</h3>
              <ul className="space-y-1.5">
                {product.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                    <ShieldCheck className="w-4 h-4 text-[#2dff5f] flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Variants Selector */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Select Variant</label>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariantId(variant.id)}
                    className={`px-3 py-2 rounded text-xs font-bold border transition ${selectedVariantId === variant.id ? 'bg-[#006e21] dark:bg-[#2dff5f] text-white dark:text-black border-transparent' : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900'}`}
                  >
                    {variant.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity & Add Button */}
          <div className="flex gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="w-24">
              <input
                type="number"
                min="1"
                max={Math.max(1, availableStock)}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full text-center p-3 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-extrabold text-sm"
              />
            </div>
            <button
              onClick={handleAddToCart}
              disabled={!canAddToCart}
              className="flex-1 py-3.5 rounded bg-[#006e21] dark:bg-[#2dff5f] text-white dark:text-black font-black text-xs uppercase tracking-wider hover:opacity-90 transition flex items-center justify-center gap-2 shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {added ? <CheckCircle2 className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
              {added ? 'Added To Cart!' : canAddToCart ? 'Add To Cart' : 'Out of Stock'}
            </button>
          </div>

          {/* Shipping Guarantees */}
          <div className="grid grid-cols-2 gap-4 pt-4 text-xs font-bold text-slate-500">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-emerald-500" />
              <span>Same-Day Express Dispatch</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-emerald-500" />
              <span>30-Day Money Back Guarantee</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="border-t border-slate-200 dark:border-slate-800 pt-10 space-y-8">
        <h2 className="text-xl font-black uppercase">Verified Athlete Reviews</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Review Form */}
          <div className="lg:col-span-1">
            <div className="bg-[#16191f] rounded-xl border border-slate-800 p-5 space-y-4 sticky top-4">
              <h3 className="font-extrabold text-sm uppercase text-[#2dff5f]">Write a Review</h3>
              {reviewSuccess ? (
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 text-xs font-bold">
                  Thank you! Your review has been posted.
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-3">
                  {reviewError && (
                    <div className="p-3 rounded-lg bg-red-950/40 border border-red-500/40 text-red-400 text-xs font-bold">
                      {reviewError}
                    </div>
                  )}
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Rating</label>
                    <select
                      value={reviewRating}
                      onChange={(e) => setReviewRating(parseInt(e.target.value, 10))}
                      className="w-full bg-slate-900 border border-slate-700 rounded p-2.5 text-xs font-bold text-white"
                    >
                      <option value={5}>5 - Excellent</option>
                      <option value={4}>4 - Very Good</option>
                      <option value={3}>3 - Good</option>
                      <option value={2}>2 - Fair</option>
                      <option value={1}>1 - Poor</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Your Review</label>
                    <textarea
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Share your experience with this product..."
                      required
                      minLength={5}
                      rows={4}
                      className="w-full bg-slate-900 border border-slate-700 rounded p-2.5 text-xs font-bold text-white"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={reviewSubmitting}
                    className="w-full py-2.5 rounded bg-[#2dff5f] text-[#002105] font-black text-xs uppercase tracking-wider hover:bg-[#00e54e] transition flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {reviewSubmitting ? 'Submitting...' : <><Send className="w-3.5 h-3.5" /> Submit Review</>}
                  </button>
                  {!user && (
                    <p className="text-[10px] text-slate-500">You must be logged in to leave a review.</p>
                  )}
                </form>
              )}
            </div>
          </div>

          {/* Reviews List */}
          <div className="lg:col-span-2 space-y-4">
            {product.reviews && product.reviews.length > 0 ? (
              product.reviews.map((review) => (
                <div key={review.id} className="bg-[#16191f] rounded-xl border border-slate-800 p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {review.user.avatar ? (
                        <img src={review.user.avatar} alt={review.user.name} className="w-8 h-8 rounded-full object-cover" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
                          <User className="w-4 h-4 text-slate-400" />
                        </div>
                      )}
                      <span className="text-xs font-bold text-white">{review.user.name}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-bold text-amber-400">
                      <Star className="w-3.5 h-3.5 fill-amber-400" /> {review.rating}
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{review.comment}</p>
                  <p className="text-[10px] text-slate-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-12 border border-dashed border-slate-700 rounded-xl">
                <p className="text-xs text-slate-500 font-bold uppercase">No reviews yet. Be the first to review this product.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
