'use client';

import React, { useEffect, useState } from 'react';
import { DollarSign, TrendingUp, Download, ArrowUpRight, CheckCircle2, Wallet } from 'lucide-react';
import { apiClient } from '@/lib/api-client';

export default function FinancesPayoutsPage() {
  const [metrics, setMetrics] = useState<{
    activeClients: number;
    monthlyPayout: number;
    totalOrders: number;
    workoutsLogged: number;
    planSales: number;
    revenueTrend: string;
    satisfactionRate: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.analytics
      .getMetrics()
      .then((data) => setMetrics(data))
      .catch(() => setMetrics(null))
      .finally(() => setLoading(false));
  }, []);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-[#16191f] p-6 rounded-xl border border-slate-800">
        <div>
          <h1 className="text-2xl font-black uppercase text-white">EARNINGS & PAYOUTS ANALYTICS</h1>
          <p className="text-xs text-slate-400">Direct Stripe Express payouts, commission breakdown, and transaction history.</p>
        </div>
        <button
          disabled
          className="px-4 py-2.5 rounded bg-[#2dff5f] text-[#002105] font-black text-xs uppercase tracking-wider hover:bg-[#00e54e] transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="w-4 h-4" /> Export CSV Statement
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 rounded-xl bg-[#16191f] border border-slate-800 space-y-2">
          <span className="label-caps text-slate-400">Available For Payout</span>
          <div className="stats-number text-[#2dff5f]">
            {loading ? '—' : formatCurrency(metrics?.monthlyPayout ?? 0)}
          </div>
          <p className="text-[11px] text-slate-400">Auto-transfers every Monday</p>
        </div>
        <div className="p-5 rounded-xl bg-[#16191f] border border-slate-800 space-y-2">
          <span className="label-caps text-slate-400">Pending Escrow</span>
          <div className="stats-number text-white">{loading ? '—' : formatCurrency(0)}</div>
          <p className="text-[11px] text-slate-400">Uncompleted session bookings</p>
        </div>
        <div className="p-5 rounded-xl bg-[#16191f] border border-slate-800 space-y-2">
          <span className="label-caps text-slate-400">Lifetime Gross Revenue</span>
          <div className="stats-number text-white">{loading ? '—' : formatCurrency(0)}</div>
          <p className="text-[11px] text-slate-400">Based on completed orders and plan sales</p>
        </div>
      </div>

      <div className="bg-[#16191f] rounded-xl border border-slate-800 p-6 space-y-4">
        <h3 className="font-extrabold text-sm uppercase text-white border-b border-slate-800 pb-3">Recent Payout Transfers</h3>
        <div className="p-8 text-center space-y-3">
          <Wallet className="w-10 h-10 text-slate-500 mx-auto" />
          <h4 className="text-sm font-black uppercase text-white">No payout history yet</h4>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Once you start selling plans, products, or booking sessions, your completed payouts will appear here.
          </p>
        </div>
      </div>
    </div>
  );
}
