'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Dumbbell, ShieldAlert, Home, LogIn } from 'lucide-react';

export function TrainerGuard({ children }: { children: React.ReactNode }) {
  const { user, setIsAuthOpen, setAuthMode } = useAuth();
  const router = useRouter();

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#16191f] border border-slate-800 rounded-xl p-8 text-center space-y-4 shadow-2xl">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-[#2dff5f]">
            <Dumbbell className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black uppercase text-white">Trainer Access Only</h2>
            <p className="text-xs text-slate-400 mt-1">
              The Command Center is restricted to verified trainers. Please sign in with a trainer account.
            </p>
          </div>
          <div className="flex gap-2 pt-2">
            <button
              onClick={() => router.push('/')}
              className="flex-1 py-3 rounded bg-slate-800 text-white font-extrabold text-xs uppercase hover:bg-slate-700 transition border border-slate-700 flex items-center justify-center gap-1"
            >
              <Home className="w-3.5 h-3.5" /> Home
            </button>
            <button
              onClick={() => { setAuthMode('login'); setIsAuthOpen(true); }}
              className="flex-1 py-3 rounded bg-[#2dff5f] text-[#002105] font-extrabold text-xs uppercase hover:bg-[#00e54e] transition flex items-center justify-center gap-1"
            >
              <LogIn className="w-3.5 h-3.5" /> Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (user.role !== 'trainer') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#16191f] border border-slate-800 rounded-xl p-8 text-center space-y-4 shadow-2xl">
          <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto text-red-400">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black uppercase text-white">Access Denied</h2>
            <p className="text-xs text-slate-400 mt-1">
              This area is for trainers only. Athlete accounts can browse plans, trainers, and the shop from the main menu.
            </p>
          </div>
          <button
            onClick={() => router.push('/')}
            className="w-full py-3 rounded bg-[#2dff5f] text-[#002105] font-extrabold text-xs uppercase hover:bg-[#00e54e] transition"
          >
            Return To Marketplace
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
