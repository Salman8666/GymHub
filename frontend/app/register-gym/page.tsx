'use client';

import React, { useState } from 'react';
import { MapPin, Building, Upload, CheckCircle2, Dumbbell, ArrowRight, Loader2, ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { apiClient } from '@/lib/api-client';
import { useAuth } from '@/lib/auth-context';

const SAMPLE_GYM_IMAGES = [
  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?auto=format&fit=crop&w=800&q=80',
];

export default function RegisterGymPage() {
  const { user, setIsAuthOpen, setAuthMode } = useAuth();

  const [form, setForm] = useState({
    name: '',
    location: '',
    tagline: '',
    amenities: '',
    equipment: '',
    image1: '',
    image2: '',
    image3: '',
    dayPassPrice: '',
    monthlyPrice: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [createdGymId, setCreatedGymId] = useState<string | null>(null);

  const isTrainer = user?.role === 'trainer';

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError('');
  };

  const fillSampleImages = () => {
    setForm((prev) => ({
      ...prev,
      image1: SAMPLE_GYM_IMAGES[0],
      image2: SAMPLE_GYM_IMAGES[1],
      image3: SAMPLE_GYM_IMAGES[2],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setAuthMode('login');
      setIsAuthOpen(true);
      return;
    }

    if (!isTrainer) {
      setError('Only trainer accounts can register gym facilities.');
      return;
    }

    if (!form.name.trim() || !form.location.trim() || !form.tagline.trim()) {
      setError('Please fill in gym name, location, and facility ethos.');
      return;
    }

    const images = [form.image1, form.image2, form.image3].filter((url) => url.trim().length > 0);
    if (images.length === 0) {
      setError('Please provide at least one gym image URL.');
      return;
    }

    const dayPassPrice = parseFloat(form.dayPassPrice);
    const monthlyPrice = parseFloat(form.monthlyPrice);

    if (Number.isNaN(dayPassPrice) || dayPassPrice < 1) {
      setError('Day pass price must be at least $1.');
      return;
    }

    if (Number.isNaN(monthlyPrice) || monthlyPrice < 5) {
      setError('Monthly membership price must be at least $5.');
      return;
    }

    const payload = {
      name: form.name.trim(),
      tagline: form.tagline.trim(),
      location: form.location.trim(),
      dayPassPrice,
      monthlyPrice,
      images,
      amenities: form.amenities
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      equipment: form.equipment
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    };

    setSubmitting(true);
    setError('');

    try {
      const gym = await apiClient.gyms.create(payload);
      setCreatedGymId(gym.id);
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Failed to register gym. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="bg-[#1b1c1c] text-white p-8 rounded-xl border border-slate-800 space-y-3">
        <h1 className="text-3xl font-black uppercase tracking-tight">REGISTER YOUR GYM FACILITY</h1>
        <p className="text-xs text-slate-300">
          List your strength conditioning center, powerlifting gym, or athletic lab on Gym Hub to sell day passes and keycard memberships.
        </p>
      </div>

      {submitted ? (
        <div className="p-8 rounded-xl bg-white dark:bg-[#16191f] border border-slate-200 dark:border-slate-800 text-center space-y-4 shadow-sm">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
          <h3 className="text-xl font-black uppercase">Facility Registered Successfully!</h3>
          <p className="text-xs text-slate-500">Your gym is now live on the Gym Hub network and available for member bookings.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/gyms"
              className="inline-flex items-center gap-1 px-6 py-2.5 rounded bg-[#006e21] dark:bg-[#2dff5f] text-white dark:text-black font-extrabold text-xs uppercase"
            >
              Browse Gym Network <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            {createdGymId && (
              <Link
                href={`/gyms/${createdGymId}`}
                className="inline-flex items-center gap-1 px-6 py-2.5 rounded border border-slate-300 dark:border-slate-700 font-extrabold text-xs uppercase"
              >
                View Facility Page
              </Link>
            )}
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="p-6 rounded-xl bg-white dark:bg-[#16191f] border border-slate-200 dark:border-slate-800 space-y-5 shadow-sm"
        >
          {!user && (
            <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-300 text-xs font-bold">
              Please sign in with a trainer account to register a gym facility.
            </div>
          )}

          <div className="space-y-4 text-xs font-bold">
            <div>
              <label className="text-slate-500 uppercase">Facility Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => updateField('name', e.target.value)}
                placeholder="e.g. Iron Vault Performance Lab"
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded p-2.5 font-bold mt-1"
              />
            </div>

            <div>
              <label className="text-slate-500 uppercase">City / Location</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => updateField('location', e.target.value)}
                  placeholder="Austin, TX"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded p-2.5 pl-9 font-bold mt-1"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-500 uppercase">Facility Ethos</label>
              <input
                type="text"
                value={form.tagline}
                onChange={(e) => updateField('tagline', e.target.value)}
                placeholder="A premium training facility built for serious athletes."
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded p-2.5 font-bold mt-1"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-slate-500 uppercase">Day Pass Price ($)</label>
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  value={form.dayPassPrice}
                  onChange={(e) => updateField('dayPassPrice', e.target.value)}
                  placeholder="25.00"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded p-2.5 font-bold mt-1"
                />
              </div>
              <div>
                <label className="text-slate-500 uppercase">Monthly Membership ($)</label>
                <input
                  type="number"
                  min="5"
                  step="0.01"
                  value={form.monthlyPrice}
                  onChange={(e) => updateField('monthlyPrice', e.target.value)}
                  placeholder="79.00"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded p-2.5 font-bold mt-1"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-500 uppercase">Facility Amenities (Comma separated)</label>
              <textarea
                value={form.amenities}
                onChange={(e) => updateField('amenities', e.target.value)}
                placeholder="Sauna, Ice Bath, InBody 770, Turf Track, Locker Rooms..."
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded p-2.5 font-bold mt-1 h-20"
              />
            </div>

            <div>
              <label className="text-slate-500 uppercase">Competition Equipment Inventory (Comma separated)</label>
              <textarea
                value={form.equipment}
                onChange={(e) => updateField('equipment', e.target.value)}
                placeholder="Eleiko Competition Racks, Rogue Deadlift Platform, Watson Dumbbells up to 150lb..."
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded p-2.5 font-bold mt-1 h-20"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-slate-500 uppercase flex items-center gap-1">
                  <ImageIcon className="w-3.5 h-3.5" /> Gym Images (up to 3)
                </label>
                <button
                  type="button"
                  onClick={fillSampleImages}
                  className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  Fill Sample Images
                </button>
              </div>
              {[1, 2, 3].map((idx) => {
                const field = `image${idx}` as keyof typeof form;
                return (
                  <div key={idx} className="relative">
                    <Upload className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                    <input
                      type="url"
                      value={form[field]}
                      onChange={(e) => updateField(field, e.target.value)}
                      placeholder={`Image ${idx} URL`}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded p-2.5 pl-9 font-bold"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {error && <p className="text-xs text-red-400 font-bold">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 rounded bg-[#006e21] dark:bg-[#2dff5f] text-white dark:text-black font-black text-xs uppercase tracking-wider hover:opacity-90 transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {user ? 'Register Gym Facility' : 'Sign In to Register Gym'}
          </button>
        </form>
      )}
    </div>
  );
}
