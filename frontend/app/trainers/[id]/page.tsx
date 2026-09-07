'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { useAuth } from '@/lib/auth-context';
import { Star, ShieldCheck, Award, Calendar, Clock, CheckCircle2, Loader2, ThumbsUp, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function TrainerProfilePage() {
  const params = useParams();
  const trainerId = params?.id as string;
  const { user, setIsAuthOpen, setAuthMode } = useAuth();

  const [trainer, setTrainer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [booked, setBooked] = useState(false);

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  useEffect(() => {
    if (!trainerId) return;
    setLoading(true);
    apiClient.trainers
      .getById(trainerId)
      .then((data) => {
        setTrainer(data);
        setError('');
      })
      .catch((err) => setError(err.message || 'Failed to load trainer'))
      .finally(() => setLoading(false));
  }, [trainerId]);

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
      const newReview = await apiClient.trainers.createReview(trainerId, { rating, comment: comment.trim() });
      setTrainer((prev: any) => ({
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

  if (error || !trainer) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-4">
        <p className="text-red-400 font-bold">{error || 'Trainer not found'}</p>
        <Link href="/trainers" className="inline-block px-4 py-2 rounded bg-[#2dff5f] text-black font-black text-xs uppercase">
          Back to Trainers
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header Banner */}
      <div className="p-8 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#16191f] shadow-sm flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
        <div className="flex gap-6 items-center">
          <img src={trainer.image} alt={trainer.name} className="w-28 h-28 rounded-xl object-cover border-2 border-emerald-500 shadow-md" />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black uppercase">{trainer.name}</h1>
              {trainer.verified && <ShieldCheck className="w-5 h-5 text-emerald-500" />}
            </div>
            <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">{trainer.title}</p>
            <p className="text-xs text-slate-500">{trainer.location}</p>
            <div className="flex items-center gap-2 text-xs font-bold pt-1">
              <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {trainer.rating?.toFixed(1) ?? '5.0'}</span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-600 dark:text-slate-300">{trainer.reviewsCount ?? 0} Verified Reviews</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-800 pt-4 md:pt-0 md:pl-6">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Session Rate</span>
            <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">${trainer.hourlyRate}</span>
            <span className="text-xs text-slate-400 font-bold"> / hour</span>
          </div>
        </div>
      </div>

      {/* Profile Details Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-8 space-y-8">
          {/* Biography & Approach */}
          <div className="space-y-3 p-6 rounded-lg bg-white dark:bg-[#16191f] border border-slate-200 dark:border-slate-800">
            <h3 className="font-extrabold uppercase text-lg">Coaching Ethos & Bio</h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {trainer.bio}
            </p>
          </div>

          {/* Specialties */}
          <div className="space-y-4">
            <h3 className="font-extrabold uppercase text-lg">Specialties & Credentials</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {trainer.specialties?.map((sp: string, idx: number) => (
                <div key={idx} className="p-3 rounded bg-white dark:bg-[#16191f] border border-slate-200 dark:border-slate-800 text-center space-y-1">
                  <Award className="w-5 h-5 text-emerald-500 mx-auto" />
                  <span className="text-xs font-bold block line-clamp-1">{sp}</span>
                </div>
              ))}
              {(!trainer.specialties || trainer.specialties.length === 0) && (
                <p className="text-xs text-slate-400 col-span-full">No specialties listed yet.</p>
              )}
            </div>
          </div>

          {/* Certifications */}
          {trainer.certifications && trainer.certifications.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-extrabold uppercase text-lg">Certifications</h3>
              <div className="space-y-2">
                {trainer.certifications.map((cert: any) => (
                  <div key={cert.id} className="flex items-center gap-2 p-3 rounded bg-white dark:bg-[#16191f] border border-slate-200 dark:border-slate-800">
                    <Award className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span className="text-xs font-bold">{cert.name} — {cert.issuingBody} ({cert.year})</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Published Program Library */}
          {trainer.fitnessPlans && trainer.fitnessPlans.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-extrabold uppercase text-lg">Published Programs by {trainer.name}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {trainer.fitnessPlans.map((plan: any) => (
                  <div key={plan.id} className="p-4 rounded-lg bg-white dark:bg-[#16191f] border border-slate-200 dark:border-slate-800 space-y-2">
                    <img src={plan.image} alt={plan.title} className="w-full h-32 object-cover rounded" />
                    <h4 className="font-bold text-xs uppercase line-clamp-1">{plan.title}</h4>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500 font-bold">{plan.durationWeeks} Weeks</span>
                      <span className="font-black text-emerald-600 dark:text-emerald-400">${plan.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reviews Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold uppercase text-lg">Member Reviews</h3>
              <span className="text-xs text-slate-400 font-bold">{trainer.reviewsCount || 0} reviews</span>
            </div>

            {/* Review Form */}
            <div className="p-5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#16191f] space-y-4">
              <h4 className="font-black text-sm uppercase">{user ? 'Write a Review' : 'Sign in to Review'}</h4>
              {!user ? (
                <div className="space-y-3">
                  <p className="text-xs text-slate-400">Members can share their experience after training with this coach.</p>
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
                    placeholder="Share your experience with this trainer..."
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
              {(trainer.reviews || []).length === 0 ? (
                <div className="p-6 rounded-lg border border-dashed border-slate-700 bg-slate-900/30 text-center space-y-2">
                  <ThumbsUp className="w-8 h-8 text-slate-500 mx-auto" />
                  <p className="text-xs text-slate-400">No reviews yet. Be the first to share your feedback.</p>
                </div>
              ) : (
                trainer.reviews.map((review: any) => (
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

        {/* Right Column: Book Session Card */}
        <div className="lg:col-span-4">
          <div className="sticky top-24 p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#16191f] space-y-6 shadow-lg">
            <h3 className="font-extrabold text-base uppercase border-b border-slate-200 dark:border-slate-800 pb-3">
              Book Private Training Session
            </h3>

            {booked ? (
              <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/40 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                <h4 className="font-extrabold text-sm uppercase text-emerald-800 dark:text-emerald-300">Session Request Sent!</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300">Coach {trainer.name} has received your booking confirmation.</p>
                <Link
                  href="/profile"
                  className="block py-2 px-4 rounded bg-[#006e21] dark:bg-[#2dff5f] text-white dark:text-black font-extrabold text-xs uppercase tracking-wider"
                >
                  View My Sessions
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Session Type</label>
                  <select className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded p-2.5 text-xs font-bold">
                    <option>1-on-1 Personal Training Session (${trainer.hourlyRate}/hr)</option>
                    <option>Initial Biomechanics Assessment ($150)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Select Date</label>
                  <input
                    type="date"
                    defaultValue={new Date().toISOString().split('T')[0]}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded p-2.5 text-xs font-bold"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Select Time Slot</label>
                  <select className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded p-2.5 text-xs font-bold">
                    <option>09:00 AM - 10:00 AM</option>
                    <option>02:00 PM - 03:00 PM</option>
                    <option>05:30 PM - 06:30 PM</option>
                  </select>
                </div>

                <button
                  onClick={() => {
                    if (!user) {
                      setAuthMode('login');
                      setIsAuthOpen(true);
                      return;
                    }
                    setBooked(true);
                  }}
                  className="w-full py-3.5 rounded bg-[#006e21] dark:bg-[#2dff5f] text-white dark:text-black font-black text-xs uppercase tracking-wider hover:opacity-90 transition shadow-md"
                >
                  {user ? 'Confirm & Request Session' : 'Sign In To Request Session'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
