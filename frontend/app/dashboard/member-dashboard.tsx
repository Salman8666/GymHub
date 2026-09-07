'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Dumbbell, Calendar, ShoppingBag, ShieldCheck, Flame, ArrowRight, Award, MapPin } from 'lucide-react';

export function MemberDashboardView() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#16191f] p-6 rounded-xl border border-slate-800">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">Athlete Hub • Active Member</span>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white mt-1">
            WELCOME BACK, {user?.name.toUpperCase() || 'ATHLETE'}
          </h1>
        </div>
        <div className="flex gap-3">
          <Link
            href="/my-plans"
            className="px-4 py-2.5 rounded bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs uppercase tracking-wider transition flex items-center gap-2"
          >
            <Dumbbell className="w-4 h-4" /> My Training Plans
          </Link>
          <Link
            href="/profile"
            className="px-4 py-2.5 rounded bg-slate-800 text-white font-extrabold text-xs uppercase tracking-wider hover:bg-slate-700 transition flex items-center gap-2 border border-slate-700"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Gym Pass
          </Link>
        </div>
      </div>

      {/* KPI Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-[#16191f] border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="label-caps">Weekly Workout Streak</span>
            <Flame className="w-4 h-4 text-orange-500" />
          </div>
          <div className="stats-number text-white">5 Days</div>
          <div className="text-[11px] text-emerald-400 font-bold">Personal Record Streak</div>
        </div>

        <div className="p-5 rounded-xl bg-[#16191f] border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="label-caps">Enrolled Programs</span>
            <Dumbbell className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="stats-number text-emerald-400">2 Active</div>
          <div className="text-[11px] text-slate-400 font-bold">Mechanical Hypertrophy</div>
        </div>

        <div className="p-5 rounded-xl bg-[#16191f] border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="label-caps">Upcoming Sessions</span>
            <Calendar className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="stats-number text-white">1 Scheduled</div>
          <div className="text-[11px] text-emerald-400 font-bold">Today @ 09:00 AM</div>
        </div>

        <div className="p-5 rounded-xl bg-[#16191f] border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="label-caps">Store Gear Orders</span>
            <ShoppingBag className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="stats-number text-white">3 Orders</div>
          <div className="text-[11px] text-emerald-400 font-bold">1 In Transit</div>
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Active Training Program Progress */}
        <div className="lg:col-span-8 bg-[#16191f] rounded-xl border border-slate-800 p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <h3 className="font-extrabold text-sm uppercase text-white flex items-center gap-2">
              <Dumbbell className="w-4 h-4 text-emerald-400" /> Current Training Systems
            </h3>
            <Link href="/my-plans" className="text-xs text-emerald-400 font-bold uppercase hover:underline">
              View Workouts &rarr;
            </Link>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[9px] font-black uppercase text-emerald-400 tracking-wider block">HYPERTROPHY • WEEK 4 OF 12</span>
                  <h4 className="font-black text-sm text-white uppercase mt-0.5">12-Week Mechanical Tension Hypertrophy System</h4>
                  <p className="text-xs text-slate-400">Coach Marcus Vance • 5 Days / Week</p>
                </div>
                <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase border border-emerald-500/30">
                  Active Program
                </span>
              </div>
              <div>
                <div className="flex justify-between text-[11px] font-bold text-slate-400 mb-1">
                  <span>Overall Program Completion</span>
                  <span className="text-emerald-400">33% Completed</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-emerald-400 h-full rounded-full" style={{ width: '33%' }} />
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[9px] font-black uppercase text-emerald-400 tracking-wider block">ATHLETIC PERFORMANCE</span>
                  <h4 className="font-black text-sm text-white uppercase mt-0.5">Explosive Power & Rotational Mobility</h4>
                  <p className="text-xs text-slate-400">Coach Ethan Rodriguez • 3 Days / Week</p>
                </div>
                <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 text-[10px] font-black uppercase border border-slate-700">
                  Active Program
                </span>
              </div>
              <div>
                <div className="flex justify-between text-[11px] font-bold text-slate-400 mb-1">
                  <span>Overall Program Completion</span>
                  <span className="text-emerald-400">60% Completed</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-emerald-400 h-full rounded-full" style={{ width: '60%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Trainer Sessions & Gym Pass Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#16191f] rounded-xl border border-slate-800 p-6 space-y-4">
            <h3 className="font-extrabold text-sm uppercase text-white border-b border-slate-800 pb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-400" /> Scheduled Coaching
            </h3>

            <div className="space-y-3">
              <div className="p-3.5 rounded bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase">Confirmed Session</span>
                  <span className="text-[10px] text-slate-400">Today</span>
                </div>
                <div>
                  <h4 className="font-bold text-xs text-white">1-on-1 Form Check & Heavy Bench</h4>
                  <p className="text-[11px] text-slate-400">Coach Marcus Vance • 09:00 AM</p>
                  <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3 text-slate-400" /> Iron Sanctuary Performance Center
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-[#16191f] rounded-xl border border-emerald-500/30 p-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase text-emerald-400 tracking-widest">DIGITAL ATHLETE PASS</span>
              <Award className="w-4 h-4 text-emerald-400" />
            </div>
            <h4 className="text-lg font-black uppercase text-white">Pro Member Access</h4>
            <p className="text-xs text-slate-400">Valid at 45+ partner fitness facilities with scan entry.</p>
            <Link
              href="/profile"
              className="w-full py-2.5 rounded bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs uppercase tracking-wider transition block text-center mt-2"
            >
              Show Digital QR Pass &rarr;
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
