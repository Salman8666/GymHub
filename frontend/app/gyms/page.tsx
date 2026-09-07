'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiClient } from '@/lib/api-client';
import { Search, MapPin, Star, Filter, CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';

export default function ExploreGymsPage() {
  const [gyms, setGyms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState<'all' | 'under25' | 'under35'>('all');

  useEffect(() => {
    setLoading(true);
    apiClient.gyms
      .getAll()
      .then((data) => {
        setGyms(data);
        setError('');
      })
      .catch((err) => setError(err.message || 'Failed to load gyms'))
      .finally(() => setLoading(false));
  }, []);

  const filteredGyms = gyms.filter((gym) => {
    const matchesSearch =
      gym.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gym.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gym.address?.toLowerCase().includes(searchTerm.toLowerCase());
    if (priceFilter === 'under25') return matchesSearch && (gym.dayPassPrice || 0) <= 25;
    if (priceFilter === 'under35') return matchesSearch && (gym.dayPassPrice || 0) <= 35;
    return matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-[#1b1c1c] text-white p-8 rounded-xl border border-slate-800 space-y-4">
        <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight">
          EXPLORE <span className="text-[#2dff5f]">VERIFIED GYMS</span> & ATHLETIC LABS
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
          Book instant day passes, keycard monthly access, and access competition-grade strength equipment across our nationwide network.
        </p>

        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search by city, gym name, or equipment (e.g. Eleiko, New York)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded text-xs text-white pl-10 pr-4 py-3 focus:outline-none focus:border-[#2dff5f]"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPriceFilter('all')}
              className={`px-3 py-2.5 rounded text-xs font-bold uppercase tracking-wider ${priceFilter === 'all' ? 'bg-[#2dff5f] text-black' : 'bg-slate-800 text-white'}`}
            >
              All Passes
            </button>
            <button
              onClick={() => setPriceFilter('under25')}
              className={`px-3 py-2.5 rounded text-xs font-bold uppercase tracking-wider ${priceFilter === 'under25' ? 'bg-[#2dff5f] text-black' : 'bg-slate-800 text-white'}`}
            >
              &le; $25 Day Pass
            </button>
          </div>
        </div>
      </div>

      {/* Loading / Error */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 text-[#2dff5f] animate-spin" />
        </div>
      )}
      {error && <p className="text-center text-red-400 font-bold py-8">{error}</p>}

      {/* Gym Directory List */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredGyms.map((gym) => (
            <div key={gym.id} className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#16191f] overflow-hidden shadow-sm flex flex-col justify-between">
              <div>
                <div className="relative h-52">
                  <img src={gym.image || gym.gallery?.[0]} alt={gym.name} className="w-full h-full object-cover" />
                  <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded text-white text-xs font-bold flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {gym.rating?.toFixed(1) ?? '5.0'} ({gym.reviewsCount || 0})
                  </div>
                  <div className="absolute bottom-3 left-3 bg-black/80 px-2 py-1 rounded text-[10px] text-white font-mono uppercase">
                    {gym.hours || '24 Hours'}
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <h3 className="font-extrabold text-lg uppercase leading-snug">{gym.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-500" /> {gym.address || gym.location}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-300 italic">{gym.tagline}</p>

                  <div className="space-y-1 pt-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Key Equipment</span>
                    <div className="flex flex-wrap gap-1">
                      {(gym.equipment || []).slice(0, 4).map((eq: string, idx: number) => (
                        <span key={idx} className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {eq}
                        </span>
                      ))}
                      {(gym.equipment || []).length === 0 && (
                        <span className="text-[10px] text-slate-500">No equipment listed</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-slate-100 dark:border-slate-800/80 mt-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Instant Day Pass</span>
                  <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">${gym.dayPassPrice ?? 0}</span>
                </div>
                <Link
                  href={`/gyms/${gym.id}`}
                  className="px-4 py-2.5 rounded bg-[#006e21] dark:bg-[#2dff5f] text-white dark:text-black font-extrabold text-xs uppercase tracking-wider hover:opacity-90 transition flex items-center gap-1"
                >
                  Book Pass <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
