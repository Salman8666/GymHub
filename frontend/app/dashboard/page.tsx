'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { apiClient } from '@/lib/api-client';
import { TrendingUp, Users, DollarSign, Dumbbell, Activity, Calendar, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

interface TrainerMetrics {
  activeClients: number;
  monthlyPayout: number;
  totalOrders: number;
  workoutsLogged: number;
  planSales: number;
  revenueTrend: string;
  satisfactionRate: string;
}

export default function DashboardOverviewPage() {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<TrainerMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    apiClient.analytics
      .getMetrics()
      .then((data) => {
        if (!cancelled) {
          setMetrics(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message || 'Failed to load dashboard metrics');
          setLoading(false);
        }
      });
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest animate-pulse">Loading Command Center...</div>
      </div>
    );
  }

  if (error || !metrics) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#16191f] border border-slate-800 rounded-xl p-8 text-center space-y-4">
          <div className="text-red-400 font-black text-sm uppercase">Error Loading Dashboard</div>
          <p className="text-xs text-slate-400">{error || 'Unable to load metrics.'}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded bg-[#2dff5f] text-[#002105] font-extrabold text-xs uppercase"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const coachName = user?.name.toUpperCase() || 'COACH';

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#16191f] p-6 rounded-xl border border-slate-800">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#2dff5f]">Command Center V2.4</span>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white mt-1">
            COACH {coachName} OVERVIEW
          </h1>
        </div>
        <div className="flex gap-3">
          <Link
            href="/dashboard/onboarding"
            className="px-4 py-2.5 rounded border border-slate-600 text-white font-extrabold text-xs uppercase tracking-wider hover:bg-slate-800 transition"
          >
            Edit Coach Profile
          </Link>
          <Link
            href="/dashboard/programs"
            className="px-4 py-2.5 rounded bg-[#2dff5f] text-[#002105] font-extrabold text-xs uppercase tracking-wider hover:bg-[#00e54e] transition"
          >
            + Create New Plan
          </Link>
        </div>
      </div>

      {/* KPI Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-[#16191f] border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="label-caps">Active Athletes</span>
            <Users className="w-4 h-4 text-[#2dff5f]" />
          </div>
          <div className="stats-number text-white">{metrics.activeClients}</div>
          <div className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> {metrics.revenueTrend}
          </div>
        </div>

        <div className="p-5 rounded-xl bg-[#16191f] border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="label-caps">Monthly Payout</span>
            <DollarSign className="w-4 h-4 text-[#2dff5f]" />
          </div>
          <div className="stats-number text-[#2dff5f]">${metrics.monthlyPayout.toLocaleString()}</div>
          <div className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> {metrics.revenueTrend}
          </div>
        </div>

        <div className="p-5 rounded-xl bg-[#16191f] border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="label-caps">Workouts Logged</span>
            <Dumbbell className="w-4 h-4 text-[#2dff5f]" />
          </div>
          <div className="stats-number text-white">{metrics.workoutsLogged}</div>
          <div className="text-[11px] text-slate-400 font-bold">Confirmed sessions</div>
        </div>

        <div className="p-5 rounded-xl bg-[#16191f] border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="label-caps">Plan Sales</span>
            <Activity className="w-4 h-4 text-[#2dff5f]" />
          </div>
          <div className="stats-number text-white">{metrics.planSales}</div>
          <div className="text-[11px] text-[#2dff5f] font-bold">Total enrollments</div>
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Active Client Roster Table */}
        <div className="lg:col-span-8 bg-[#16191f] rounded-xl border border-slate-800 p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <h3 className="font-extrabold text-sm uppercase text-white">Active Client Velocity</h3>
            <Link href="/dashboard/clients" className="text-xs text-[#2dff5f] font-bold uppercase hover:underline">
              View All Roster &rarr;
            </Link>
          </div>

          {metrics.activeClients === 0 ? (
            <div className="text-center py-10 space-y-3">
              <Users className="w-10 h-10 text-slate-600 mx-auto" />
              <div>
                <h4 className="text-sm font-black uppercase text-white">No Active Clients Yet</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                  Client bookings and plan sales will appear here once athletes start training with you.
                </p>
              </div>
              <Link
                href="/dashboard/programs"
                className="inline-block px-4 py-2 rounded bg-[#2dff5f] text-[#002105] font-extrabold text-xs uppercase"
              >
                Publish Your First Plan
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="text-[10px] uppercase font-bold text-slate-400 bg-slate-900/60 border-b border-slate-800">
                  <tr>
                    <th className="p-3">Athlete</th>
                    <th className="p-3">Program</th>
                    <th className="p-3">Progress</th>
                    <th className="p-3">Last Logged</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-semibold text-slate-300">
                  <tr>
                    <td className="p-3 text-slate-500" colSpan={5}>
                      Detailed roster data will be available once client activity is recorded.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Schedule & Quick Tasks */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#16191f] rounded-xl border border-slate-800 p-6 space-y-4">
            <h3 className="font-extrabold text-sm uppercase text-white border-b border-slate-800 pb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#2dff5f]" /> Today's Sessions
            </h3>

            <div className="text-center py-6">
              <Calendar className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-xs text-slate-400">No sessions scheduled for today.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
