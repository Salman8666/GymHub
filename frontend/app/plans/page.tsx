'use client';

import React from 'react';
import Link from 'next/link';
import { MOCK_PLANS } from '@/lib/mock-data';
import { Dumbbell, Star, Clock, Users, ArrowRight } from 'lucide-react';

export default function PlansPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="bg-[#1b1c1c] text-white p-8 rounded-xl border border-slate-800 space-y-3">
        <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight">
          WORKOUT & NUTRITION <span className="text-[#2dff5f]">PROGRAM BLUEPRINTS</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
          Purchase downloadable and interactive workout programs engineered by IFBB coaches and sports biomechanists.
        </p>
      </div>

      {/* Plans Catalog */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {MOCK_PLANS.map((plan) => (
          <div key={plan.id} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#16191f] overflow-hidden shadow-sm flex flex-col justify-between">
            <div>
              <div className="relative h-56">
                <img src={plan.image} alt={plan.title} className="w-full h-full object-cover" />
                <span className="absolute top-3 left-3 bg-black/80 px-2.5 py-1 rounded text-white text-[10px] font-black uppercase tracking-wider">
                  {plan.category}
                </span>
                <span className="absolute top-3 right-3 bg-[#2dff5f] text-black px-2.5 py-1 rounded text-xs font-black uppercase">
                  ${plan.price}
                </span>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <img src={plan.creatorImage} alt={plan.creator} className="w-10 h-10 rounded-full object-cover border border-slate-300 dark:border-slate-700" />
                  <div>
                    <h4 className="font-extrabold text-xs uppercase">{plan.creator}</h4>
                    <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">{plan.creatorRole}</p>
                  </div>
                </div>

                <h3 className="text-lg font-black uppercase leading-snug">{plan.title}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{plan.description}</p>

                <div className="grid grid-cols-3 gap-2 bg-slate-50 dark:bg-[#0d0f12] p-3 rounded text-center text-xs font-bold">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block">Duration</span>
                    <span>{plan.durationWeeks} Weeks</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block">Frequency</span>
                    <span>{plan.daysPerWeek} Days/Wk</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block">Difficulty</span>
                    <span className="text-emerald-600 dark:text-emerald-400">{plan.difficulty}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 pt-0">
              <button className="w-full py-3 rounded bg-[#006e21] dark:bg-[#2dff5f] text-white dark:text-black font-black text-xs uppercase tracking-wider hover:opacity-90 transition flex items-center justify-center gap-2">
                Enroll & Access Blueprint <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
