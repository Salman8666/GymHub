'use client';

import React from 'react';
import { MOCK_PLANS } from '@/lib/mock-data';
import { Dumbbell, CheckCircle2, Play, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function MyPlansPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
        <h1 className="text-3xl font-black uppercase tracking-tight">MY ENROLLED FITNESS PLANS</h1>
        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">
          TRACK YOUR ACTIVE HYPERTROPHY AND STRENGTH BLUEPRINTS
        </p>
      </div>

      <div className="space-y-6">
        {MOCK_PLANS.map((plan) => (
          <div key={plan.id} className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#16191f] flex flex-col md:flex-row gap-6 items-center justify-between shadow-sm">
            <div className="flex gap-4 items-center">
              <img src={plan.image} alt={plan.title} className="w-24 h-24 rounded-lg object-cover border border-slate-200 dark:border-slate-700" />
              <div className="space-y-1">
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-extrabold text-[10px] uppercase">
                  {plan.category} • Week 4 of {plan.durationWeeks}
                </span>
                <h3 className="font-extrabold text-base uppercase">{plan.title}</h3>
                <p className="text-xs text-slate-500 font-bold">Coach: {plan.creator}</p>
                <div className="w-48 bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden mt-2">
                  <div className="bg-emerald-500 h-full" style={{ width: '35%' }} />
                </div>
              </div>
            </div>

            <div className="flex gap-3 w-full md:w-auto">
              <button className="w-full md:w-auto px-5 py-3 rounded bg-[#006e21] dark:bg-[#2dff5f] text-white dark:text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:opacity-90 transition">
                <Play className="w-4 h-4 fill-current" /> Start Today's Workout
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
