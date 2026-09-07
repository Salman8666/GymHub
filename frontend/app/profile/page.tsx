'use client';

import React from 'react';
import { User, QrCode, ShieldCheck, Dumbbell, Calendar, MapPin, Award } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function formatJoinDate(isoDate?: string) {
  if (!isoDate) return 'Member recently';
  const date = new Date(isoDate);
  return `Member since ${date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`;
}

export default function ProfilePage() {
  const { user, setIsAuthOpen, setAuthMode } = useAuth();

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#16191f] border border-slate-800 rounded-xl p-8 text-center space-y-4 shadow-2xl">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-[#2dff5f]">
            <Dumbbell className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black uppercase text-white">Sign In Required</h2>
            <p className="text-xs text-slate-400 mt-1">
              Sign in or create an account to view your profile, digital pass, and account details.
            </p>
          </div>
          <div className="flex gap-2 pt-2">
            <button
              onClick={() => { setAuthMode('login'); setIsAuthOpen(true); }}
              className="flex-1 py-3 rounded bg-slate-800 text-white font-extrabold text-xs uppercase hover:bg-slate-700 transition border border-slate-700"
            >
              Sign In
            </button>
            <button
              onClick={() => { setAuthMode('register'); setIsAuthOpen(true); }}
              className="flex-1 py-3 rounded bg-[#2dff5f] text-[#002105] font-extrabold text-xs uppercase hover:bg-[#00e54e] transition"
            >
              Register Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  const membershipLabel = user.membershipType || (user.role === 'trainer' ? 'Verified Coach' : 'Member');
  const passId = `GH-${user.id.slice(-8).toUpperCase()}`;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* User Header */}
      <div className="p-8 rounded-xl bg-white dark:bg-[#16191f] border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="flex gap-6 items-center">
          <div className="w-24 h-24 rounded-full bg-[#006e21] dark:bg-[#2dff5f] text-white dark:text-black font-black text-3xl flex items-center justify-center border-4 border-slate-200 dark:border-slate-800 overflow-hidden">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              getInitials(user.name)
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black uppercase">{user.name}</h1>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-extrabold text-[10px] uppercase">
                {membershipLabel}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-bold mt-0.5">{formatJoinDate(user.createdAt)}</p>
            <div className="flex items-center gap-4 text-xs font-bold pt-2 text-slate-600 dark:text-slate-300">
              <span>{user.role === 'trainer' ? 'Coach Profile' : 'Athlete Profile'}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Link
            href="/my-plans"
            className="px-4 py-2.5 rounded bg-slate-900 dark:bg-slate-800 text-white font-extrabold text-xs uppercase hover:bg-emerald-600 transition"
          >
            My Active Plans
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Digital Pass Card */}
        <div className="md:col-span-6 bg-gradient-to-br from-[#1b1c1c] via-[#121313] to-[#0d0f12] text-white p-6 rounded-xl border border-slate-800 space-y-6 shadow-xl relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#2dff5f]">GYM HUB DIGITAL PASS</span>
              <h3 className="text-lg font-black uppercase mt-1">IRON SANCTUARY ALL-ACCESS</h3>
            </div>
            <div className="w-8 h-8 rounded bg-[#2dff5f] text-black font-black flex items-center justify-center text-sm">
              GH
            </div>
          </div>

          {/* QR Code Container */}
          <div className="bg-white p-4 rounded-lg w-44 h-44 mx-auto flex flex-col items-center justify-center space-y-2">
            <QrCode className="w-32 h-32 text-slate-900" />
            <span className="text-[9px] font-mono font-bold text-slate-600">ID: {passId}</span>
          </div>

          <div className="flex justify-between items-center text-xs font-bold text-slate-300 pt-2 border-t border-slate-800">
            <span>Pass Type: 24h Day Pass</span>
            <span className="text-[#2dff5f]">Valid Today</span>
          </div>
        </div>

        {/* Account Details Form */}
        <div className="md:col-span-6 p-6 rounded-xl bg-white dark:bg-[#16191f] border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
          <h3 className="font-extrabold text-base uppercase border-b border-slate-200 dark:border-slate-800 pb-2">
            Personal Information
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="font-bold text-slate-500 uppercase">Email Address</label>
              <input type="email" defaultValue={user.email} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded p-2.5 font-bold mt-1" />
            </div>

            <div>
              <label className="font-bold text-slate-500 uppercase">Phone Number</label>
              <input type="text" placeholder="Add phone number" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded p-2.5 font-bold mt-1" />
            </div>

            <div>
              <label className="font-bold text-slate-500 uppercase">Home City / District</label>
              <input type="text" placeholder="Add city or district" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded p-2.5 font-bold mt-1" />
            </div>

            <button className="w-full py-3 rounded bg-[#006e21] dark:bg-[#2dff5f] text-white dark:text-black font-extrabold text-xs uppercase tracking-wider hover:opacity-90 transition mt-2">
              Save Account Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
