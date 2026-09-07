'use client';

import React from 'react';
import { Users, Search, Plus, MessageSquare, Dumbbell, Activity, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function ClientManagementPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#16191f] p-6 rounded-xl border border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-black uppercase text-white">CLIENT ROSTER MANAGEMENT</h1>
          <p className="text-xs text-slate-400">Track active athletes, workout compliance, body composition, and RPE logs.</p>
        </div>
        <button className="px-4 py-2.5 rounded bg-slate-800 text-slate-300 font-black text-xs uppercase tracking-wider hover:bg-slate-700 transition flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add New Athlete
        </button>
      </div>

      <div className="bg-[#16191f] rounded-xl border border-slate-800 p-10 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center mx-auto">
          <Users className="w-8 h-8 text-slate-500" />
        </div>
        <div>
          <h2 className="text-lg font-black uppercase text-white">Your Roster Is Empty</h2>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
            Athletes will appear here once they book sessions or purchase your plans. There are no shared or pre-populated clients.
          </p>
        </div>
        <Link
          href="/dashboard/programs"
          className="inline-block px-4 py-2.5 rounded bg-[#2dff5f] text-[#002105] font-black text-xs uppercase tracking-wider hover:bg-[#00e54e] transition"
        >
          Create A Plan To Attract Clients
        </Link>
      </div>
    </div>
  );
}
