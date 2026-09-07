'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { useAuth } from '@/lib/auth-context';
import { Star, MapPin, CheckCircle2, Dumbbell, ArrowRight, Loader2, User, ThumbsUp } from 'lucide-react';
import Link from 'next/link';

export default function GymDetailPage() {
  const params = useParams();
  const gymId = params?.id as string;
  const { user, setIsAuthOpen, setAuthMode } = useAuth();

  const [gym, setGym] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [selectedPass, setSelectedPass] = useState<'day' | 'month'>('day');
  const [passConfirmed, setPassConfirmed] = useState(false);

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  useEffect(() => {
    if (!gymId) return;
    setLoading(true);
    apiClient.gyms
      .getById(gymId)
      .then((data) => {
        setGym(data);
        setError('');
      })
      .catch((err) => setError(err.message || 'Failed to load gym'))
      .finally(() => setLoading(false));
  }, [gymId]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setAuthMode('login');
      setIsAuthOpen(true);
      return;
    }
    if (rating < 1) {
      setReviewError('Please select a star rating');
      return;
    }
    if (comment.trim().length < 3) {
      setReviewError('Review comment must be at least 3 characters');
      return;
    }

    setSubmitting(true);
    setReviewError('');
    try {
      const newReview = await apiClient.gyms.createReview(gymId, { rating, comment: comment.trim() });
      setGym((prev: any) => ({
        ...prev,
        reviews: [newReview, ...(prev.reviews || [])],
        reviewsCount: (prev.reviewsCount || 0) + 1,
        rating: parseFloat(
          (
            ((prev.reviews || []).reduce((acc: number, r: any) => acc + (r.rating || 0), 0) + rating) /
            ((prev.reviews || []).length + 1)
          ).toFixed(2)
        ),
      }));
      setRating(0);
      setComment('');
      setReviewSuccess(true);
      setTimeout(() => setReviewSuccess(false), 4000);
    } catch (err: any) {
      setReviewError(err.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#2dff5f] animate-spin" />
      </div>
    );
  }

  if (error || !gym) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-4">
        <p className="text-red-400 font-bold">{error || 'Gym not found'}</p>
        <Link href="/gyms" className="inline-block px-4 py-2 rounded bg-[#2dff5f] text-black font-black text-xs uppercase">
          Back to Gyms
        </Link>
      </div>
    );
  }

  const dayPrice = gym.dayPassPrice ?? 0;
  const monthPrice = gym.monthlyPrice ?? 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider">
              VERIFIED ATHLETIC LAB
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {gym.rating?.toFixed(1) ?? '5.0'} ({gym.reviewsCount ?? 0} verified reviews)
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight mt-1">{gym.name}</h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1">
            <MapPin className="w-4 h-4 text-emerald-500" /> {gym.address || gym.location}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setSelectedPass('day')}
            className={`px-4 py-2 rounded text-xs font-black uppercase tracking-wider border ${selectedPass === 'day' ? 'bg-[#006e21] dark:bg-[#2dff5f] text-white dark:text-black border-transparent' : 'border-slate-300 dark:border-slate-700'}`}
          >
            Day Pass (${dayPrice})
          </button>
          <button
            onClick={() => setSelectedPass('month')}
            className={`px-4 py-2 rounded text-xs font-black uppercase tracking-wider border ${selectedPass === 'month' ? 'bg-[#006e21] dark:bg-[#2dff5f] text-white dark:text-black border-transparent' : 'border-slate-300 dark:border-slate-700'}`}
          >
            Monthly Membership (${monthPrice})
          </button>
        </div>
      </div>

      {/* Gallery Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 h-[380px] rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800">
          <img src={gym.gallery?.[0] || gym.image} alt={gym.name} className="w-full h-full object-cover" />
        </div>
        <div className="space-y-4">
          {(gym.gallery?.slice(1) || []).map((img: string, idx: number) => (
            <div key={idx} className="h-[180px] rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800">
              <img src={img} alt="Gym Spec" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Info Column */}
        <div className="lg:col-span-8 space-y-8">
          {/* Tagline */}
          <div className="p-6 rounded-lg bg-slate-100 dark:bg-[#16191f] border border-slate-200 dark:border-slate-800 space-y-2">
            <h3 className="label-caps text-[#006e21] dark:text-[#2dff5f]">Facility Ethos</h3>
            <p className="text-base font-bold text-slate-800 dark:text-slate-200 leading-relaxed italic">
              &ldquo;{gym.tagline || 'A premium training facility.'}&rdquo;
            </p>
          </div>

          {/* Amenities */}
          <div className="space-y-4">
            <h3 className="font-extrabold uppercase text-lg">Facility Amenities</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(gym.amenities || []).map((item: string, idx: number) => (
                <div key={idx} className="flex items-center gap-2.5 p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#16191f]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span className="text-xs font-bold">{item}</span>
                </div>
              ))}
              {(gym.amenities || []).length === 0 && (
                <p className="text-xs text-slate-400 col-span-full">No amenities listed yet.</p>
              )}
            </div>
          </div>

          {/* Equipment Inventory */}
          <div className="space-y-4">
            <h3 className="font-extrabold uppercase text-lg">Competition Equipment Inventory</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(gym.equipment || []).map((eq: string, idx: number) => (
                <div key={idx} className="flex items-center gap-2.5 p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#16191f]">
                  <Dumbbell className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span className="text-xs font-bold">{eq}</span>
                </div>
              ))}
              {(gym.equipment || []).length === 0 && (
                <p className="text-xs text-slate-400 col-span-full">No equipment listed yet.</p>
              )}
            </div>
          </div>

          {/* Reviews Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold uppercase text-lg">Member Reviews</h3>
              <span className="text-xs text-slate-400 font-bold">{gym.reviewsCount || 0} reviews</span>
            </div>

            {/* Review Form */}
            <div className="p-5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#16191f] space-y-4">
              <h4 className="font-black text-sm uppercase">{user ? 'Write a Review' : 'Sign in to Review'}</h4>
              {!user ? (
                <div className="space-y-3">
                  <p className="text-xs text-slate-400">Members can share their experience after visiting this facility.</p>
                  <button
                    onClick={() => { setAuthMode('login'); setIsAuthOpen(true); }}
                    className="px-4 py-2 rounded bg-[#2dff5f] text-black font-black text-xs uppercase"
                  >
                    Sign In to Leave a Review
                  </button>
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(star)}
                        className="p-0.5 focus:outline-none"
                      >
                        <Star
                          className={`w-6 h-6 transition ${star <= (hoverRating || rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-500'}`}
                        />
                      </button>
                    ))}
                    <span className="ml-2 text-xs font-bold text-slate-400">{rating > 0 ? `${rating} / 5` : 'Select a rating'}</span>
                  </div>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your experience with this gym..."
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded p-3 text-xs font-bold min-h-[100px] placeholder:text-slate-500"
                  />
                  {reviewError && <p className="text-xs text-red-400 font-bold">{reviewError}</p>}
                  {reviewSuccess && <p className="text-xs text-emerald-400 font-bold">Review submitted successfully.</p>}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2.5 rounded bg-[#2dff5f] text-black font-black text-xs uppercase disabled:opacity-50 flex items-center gap-2"
                  >
                    {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    Submit Review
                  </button>
                </form>
              )}
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
              {(gym.reviews || []).length === 0 ? (
                <div className="p-6 rounded-lg border border-dashed border-slate-700 bg-slate-900/30 text-center space-y-2">
                  <ThumbsUp className="w-8 h-8 text-slate-500 mx-auto" />
                  <p className="text-xs text-slate-400">No reviews yet. Be the first to share your feedback.</p>
                </div>
              ) : (
                gym.reviews.map((review: any) => (
                  <div key={review.id} className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#16191f] space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={review.user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                          alt={review.user?.name || 'Member'}
                          className="w-8 h-8 rounded-full object-cover border border-slate-700"
                        />
                        <div>
                          <p className="text-xs font-black uppercase">{review.user?.name || 'Member'}</p>
                          <p className="text-[10px] text-slate-400">
                            {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : 'Recently'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-amber-400">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span className="text-xs font-black">{review.rating}</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{review.comment}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Booking Pass Box */}
        <div className="lg:col-span-4">
          <div className="sticky top-24 p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#16191f] space-y-6 shadow-lg">
            <div className="flex justify-between items-center pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Selected Pass</span>
                <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                  ${selectedPass === 'day' ? dayPrice : monthPrice}
                </span>
                <span className="text-xs text-slate-400 font-semibold"> / {selectedPass === 'day' ? 'Day Pass' : 'Month'}</span>
              </div>
              <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-extrabold text-[10px] uppercase">
                Instant Keycard QR
              </span>
            </div>

            {passConfirmed ? (
              <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/40 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                <h4 className="font-extrabold text-sm uppercase text-emerald-800 dark:text-emerald-300">Pass Booked Successfully!</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300">Your digital keycard QR pass is now active in your profile.</p>
                <Link
                  href="/profile"
                  className="block py-2 px-4 rounded bg-[#006e21] dark:bg-[#2dff5f] text-white dark:text-black font-extrabold text-xs uppercase tracking-wider"
                >
                  View Digital Pass
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Visit Date</label>
                  <input
                    type="date"
                    defaultValue={new Date().toISOString().split('T')[0]}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded p-2.5 text-xs font-bold"
                  />
                </div>

                <div className="space-y-1 text-xs text-slate-500 dark:text-slate-400 pt-2">
                  <div className="flex justify-between">
                    <span>Base Pass Rate:</span>
                    <span className="font-bold">${selectedPass === 'day' ? dayPrice : monthPrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Facility Service Fee:</span>
                    <span className="font-bold">$2.50</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-slate-800 font-black text-slate-900 dark:text-white">
                    <span>Total Charge:</span>
                    <span className="text-emerald-600 dark:text-emerald-400">${((selectedPass === 'day' ? dayPrice : monthPrice) + 2.5).toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={() => setPassConfirmed(true)}
                  className="w-full py-3.5 rounded bg-[#006e21] dark:bg-[#2dff5f] text-white dark:text-black font-black text-xs uppercase tracking-wider hover:opacity-90 transition shadow-md"
                >
                  Confirm & Generate Pass
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
