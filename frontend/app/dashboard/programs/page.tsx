'use client';

import React, { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { BookOpen, Plus, Dumbbell, Save, CheckCircle2, Loader2 } from 'lucide-react';

interface FitnessPlan {
  id: string;
  title: string;
  price: number;
  enrolledCount: number;
}

export default function ProgramBuilderPage() {
  const [profile, setProfile] = useState<any>(null);
  const [plans, setPlans] = useState<FitnessPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [created, setCreated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [durationWeeks, setDurationWeeks] = useState('12');
  const [daysPerWeek, setDaysPerWeek] = useState('5');
  const [category, setCategory] = useState('Hypertrophy');

  const fetchProfile = async () => {
    try {
      const data = await apiClient.trainers.me();
      setProfile(data);
      setPlans(data.fitnessPlans || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load your programs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price) return;
    setSaving(true);
    setError(null);
    try {
      await apiClient.plans.create({
        title,
        price: parseFloat(price),
        durationWeeks: parseInt(durationWeeks, 10),
        daysPerWeek: parseInt(daysPerWeek, 10),
        category,
        description: `${title} — ${durationWeeks}-week ${category.toLowerCase()} program.`,
      });
      setCreated(true);
      setTitle('');
      setPrice('');
      setDurationWeeks('12');
      setDaysPerWeek('5');
      setCategory('Hypertrophy');
      await fetchProfile();
      setTimeout(() => setCreated(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to publish plan');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-[#2dff5f] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-[#16191f] p-6 rounded-xl border border-slate-800">
        <div>
          <h1 className="text-2xl font-black uppercase text-white">WORKOUT PROGRAM BUILDER</h1>
          <p className="text-xs text-slate-400">Design periodized training plans and publish them to your marketplace store.</p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-950/40 border border-red-500/30 text-red-400 text-xs font-bold">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Builder Form */}
        <form onSubmit={handlePublish} className="lg:col-span-8 bg-[#16191f] rounded-xl border border-slate-800 p-6 space-y-4">
          <h3 className="font-extrabold text-sm uppercase text-[#2dff5f] border-b border-slate-800 pb-3">
            Plan Metadata & Split Architecture
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase">Program Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. High-Volume Mechanical Hypertrophy"
                required
                className="w-full bg-slate-900 border border-slate-700 rounded p-2.5 text-xs font-bold text-white mt-1"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase">Marketplace Price ($)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="59.99"
                min="0"
                step="0.01"
                required
                className="w-full bg-slate-900 border border-slate-700 rounded p-2.5 text-xs font-bold text-white mt-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase">Duration (Weeks)</label>
              <input
                type="number"
                value={durationWeeks}
                onChange={(e) => setDurationWeeks(e.target.value)}
                min="1"
                required
                className="w-full bg-slate-900 border border-slate-700 rounded p-2.5 text-xs font-bold text-white mt-1"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase">Days / Week</label>
              <input
                type="number"
                value={daysPerWeek}
                onChange={(e) => setDaysPerWeek(e.target.value)}
                min="1"
                max="7"
                required
                className="w-full bg-slate-900 border border-slate-700 rounded p-2.5 text-xs font-bold text-white mt-1"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase">Target Goal</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded p-2.5 text-xs font-bold text-white mt-1"
              >
                <option>Hypertrophy</option>
                <option>Strength</option>
                <option>Fat Loss</option>
                <option>Athletic Performance</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3.5 rounded bg-[#2dff5f] text-[#002105] font-black text-xs uppercase tracking-wider hover:bg-[#00e54e] transition flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : created ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {saving ? 'Publishing...' : created ? 'Program Published To Marketplace!' : 'Publish Program Blueprint'}
          </button>
        </form>

        {/* Published Plans Right List */}
        <div className="lg:col-span-4 bg-[#16191f] rounded-xl border border-slate-800 p-6 space-y-4">
          <h3 className="font-extrabold text-sm uppercase text-white border-b border-slate-800 pb-3">
            My Published Blueprints ({plans.length})
          </h3>
          {plans.length === 0 ? (
            <div className="text-center py-6 space-y-2">
              <BookOpen className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-xs text-slate-400">You haven't published any plans yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {plans.map((p) => (
                <div key={p.id} className="p-3 bg-slate-900 rounded border border-slate-800 space-y-1">
                  <h4 className="font-bold text-xs text-white uppercase">{p.title}</h4>
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>{p.enrolledCount ?? 0} Enrolled</span>
                    <span className="text-[#2dff5f] font-black">${Number(p.price).toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
