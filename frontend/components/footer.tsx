'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Dumbbell, ShieldCheck, Mail, ArrowUpRight, Globe, Video, Share2 } from 'lucide-react';

export function Footer() {
  const { user } = useAuth();
  const isTrainer = user?.role === 'trainer';

  return (
    <footer className="bg-white dark:bg-[#1b1c1c] text-slate-900 dark:text-white border-t border-slate-200 dark:border-slate-800 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-200 dark:border-slate-800">
          
          {/* Brand & Mission */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 rounded-xl bg-[#fbf9f8] p-1 border-2 border-[#1df269]/50 shadow-md flex items-center justify-center overflow-hidden shrink-0">
                <img src="/weblogo.jpeg" alt="GYM HUB Logo" className="w-full h-full object-cover scale-[1.85] origin-center" />
              </div>
              <div className="flex flex-col">
                <span className="font-black tracking-tighter text-xl text-slate-900 dark:text-white uppercase">
                  GYM<span className="text-[#1df269]">HUB</span>
                </span>
                <span className="text-[8px] font-extrabold tracking-widest text-[#1df269] uppercase leading-tight mt-1">
                  CONNECT • TRAIN • GROW
                </span>
              </div>
            </Link>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              The premier performance marketplace connecting athletes, elite trainers, certified equipment labs, and strength conditioning centers worldwide.
            </p>
            <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
              <a href="#" className="p-2 rounded bg-slate-100 dark:bg-slate-800 hover:text-emerald-700 dark:hover:text-[#1df269] transition"><Globe className="w-4 h-4" /></a>
              <a href="#" className="p-2 rounded bg-slate-100 dark:bg-slate-800 hover:text-emerald-700 dark:hover:text-[#1df269] transition"><Video className="w-4 h-4" /></a>
              <a href="#" className="p-2 rounded bg-slate-100 dark:bg-slate-800 hover:text-emerald-700 dark:hover:text-[#1df269] transition"><Share2 className="w-4 h-4" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="label-caps text-[#1df269]">Marketplace Hub</h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300 font-semibold uppercase tracking-wider">
              <li><Link href="/gyms" className="hover:text-[#1df269] transition">Explore Gym Centers</Link></li>
              <li><Link href="/trainers" className="hover:text-[#1df269] transition">Find Elite Trainers</Link></li>
              <li><Link href="/shop" className="hover:text-[#1df269] transition">Supplements & Gear</Link></li>
              <li><Link href="/plans" className="hover:text-[#1df269] transition">Workout Blueprint Programs</Link></li>
              <li><Link href="/blog" className="hover:text-[#1df269] transition">Training Science Blog</Link></li>
            </ul>
          </div>

          {/* Partner & Trainer Hub */}
          <div className="space-y-3">
            <h4 className="label-caps text-[#1df269]">Trainers & Gyms</h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300 font-semibold uppercase tracking-wider">
              {isTrainer && (
                <>
                  <li><Link href="/dashboard" className="hover:text-[#1df269] transition">Trainer Command Center</Link></li>
                  <li><Link href="/dashboard/onboarding" className="hover:text-[#1df269] transition">Trainer Profile</Link></li>
                  <li><Link href="/dashboard/programs" className="hover:text-[#1df269] transition">Publish Program Blueprint</Link></li>
                </>
              )}
              <li><Link href="/register-gym" className="hover:text-[#1df269] transition">Register Your Gym Facility</Link></li>
              <li><Link href="/support" className="hover:text-[#1df269] transition">Support & Knowledge Desk</Link></li>
            </ul>
          </div>

          {/* Newsletter / Dispatch */}
          <div className="space-y-4">
            <h4 className="label-caps text-[#1df269]">Performance Intelligence</h4>
            <p className="text-xs text-slate-400">
              Receive weekly scientific hypertrophy protocols, gear drops, and trainer insights directly to your inbox.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email address"
                className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs px-3 py-2 rounded focus:outline-none focus:border-[#1df269] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
              />
              <button className="bg-[#1df269] text-black font-black text-xs px-4 rounded uppercase tracking-wider transition hover:opacity-90">
                Join
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4">
          <p>© 2026 GYM-HUB Performance Systems. All rights reserved.</p>
          <div className="flex gap-6 font-semibold uppercase tracking-wider text-[11px]">
            <a href="#" className="hover:text-slate-700 dark:hover:text-slate-300">Privacy Policy</a>
            <a href="#" className="hover:text-slate-700 dark:hover:text-slate-300">Terms of Service</a>
            <a href="#" className="hover:text-slate-700 dark:hover:text-slate-300">Security Specs</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
