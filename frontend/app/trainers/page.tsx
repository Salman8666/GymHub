'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiClient } from '@/lib/api-client';
import { Search, Star, ShieldCheck, Award, ArrowRight } from 'lucide-react';

export default function FindTrainerPage() {
  const [trainers, setTrainers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('all');

  useEffect(() => {
    apiClient.trainers
      .getAll()
      .then((data) => {
        setTrainers(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const filteredTrainers = trainers.filter((tr) => {
    const matchesSearch =
      tr.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tr.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tr.specialties?.some((s: string) => s.toLowerCase().includes(searchTerm.toLowerCase()));
    if (specialtyFilter === 'hypertrophy') return matchesSearch && tr.specialties?.some((s: string) => s.toLowerCase().includes('hypertrophy'));
    if (specialtyFilter === 'powerlifting') return matchesSearch && tr.specialties?.some((s: string) => s.toLowerCase().includes('powerlifting') || s.toLowerCase().includes('strength'));
    return matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="bg-[#1b1c1c] text-white p-8 rounded-xl border border-slate-800 space-y-4">
        <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight">
          HIRE <span className="text-[#2dff5f]">CERTIFIED PERFORMANCE</span> COACHES
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
          Book 1-on-1 personal training, custom hypertrophy plan design, and virtual form analysis with verified IFBB Pros & CSCS specialists.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search by specialty, coach name, or location (e.g. Hypertrophy, Marcus)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded text-xs text-white pl-10 pr-4 py-3 focus:outline-none focus:border-[#2dff5f]"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSpecialtyFilter('all')}
              className={`px-3 py-2.5 rounded text-xs font-bold uppercase tracking-wider ${specialtyFilter === 'all' ? 'bg-[#2dff5f] text-black' : 'bg-slate-800 text-white'}`}
            >
              All Specialties
            </button>
            <button
              onClick={() => setSpecialtyFilter('hypertrophy')}
              className={`px-3 py-2.5 rounded text-xs font-bold uppercase tracking-wider ${specialtyFilter === 'hypertrophy' ? 'bg-[#2dff5f] text-black' : 'bg-slate-800 text-white'}`}
            >
              Hypertrophy
            </button>
            <button
              onClick={() => setSpecialtyFilter('powerlifting')}
              className={`px-3 py-2.5 rounded text-xs font-bold uppercase tracking-wider ${specialtyFilter === 'powerlifting' ? 'bg-[#2dff5f] text-black' : 'bg-slate-800 text-white'}`}
            >
              Powerlifting
            </button>
          </div>
        </div>
      </div>

      {loading && (
        <div className="text-center py-12 text-slate-500 text-xs font-bold uppercase tracking-wider">
          Loading verified coaches...
        </div>
      )}

      {error && (
        <div className="p-4 rounded-lg bg-red-950/40 border border-red-500/40 text-red-400 text-xs font-bold">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredTrainers.map((tr) => (
            <div key={tr.id} className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#16191f] p-5 flex flex-col justify-between space-y-4 shadow-sm">
              <div className="space-y-4">
                <div className="flex gap-4">
                  <img src={tr.image} alt={tr.name} className="w-20 h-20 rounded-lg object-cover border border-slate-200 dark:border-slate-700" />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-extrabold text-base uppercase">{tr.name}</h3>
                      {tr.verified && <ShieldCheck className="w-4 h-4 text-emerald-500" />}
                    </div>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold line-clamp-1">{tr.title}</p>
                    <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {tr.rating} ({tr.reviewsCount} reviews)
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{tr.bio}</p>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Specialty Matrix</span>
                  <div className="flex flex-wrap gap-1">
                    {tr.specialties?.map((sp: string, idx: number) => (
                      <span key={idx} className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {sp}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 bg-slate-50 dark:bg-[#0d0f12] p-2.5 rounded text-center">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Rate</span>
                    <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">${tr.hourlyRate}/hr</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Exp</span>
                    <span className="text-xs font-black">{tr.experienceYears} Yrs</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Verified</span>
                    <span className="text-xs font-black">{tr.verified ? 'Yes' : 'No'}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href={`/trainers/${tr.id}`}
                  className="w-full block text-center py-2.5 rounded bg-[#006e21] dark:bg-[#2dff5f] text-white dark:text-black font-extrabold text-xs uppercase tracking-wider hover:opacity-90 transition"
                >
                  View Profile & Book Session
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && !error && filteredTrainers.length === 0 && (
        <div className="text-center py-12 text-slate-500 text-xs font-bold uppercase tracking-wider">
          No coaches match your search.
        </div>
      )}
    </div>
  );
}
