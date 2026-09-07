'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Lock, Mail, User, Dumbbell, ArrowRight, ShieldCheck } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'member' | 'trainer'>('member');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name || !email) {
      setError('Please enter your full name and email address');
      return;
    }
    try {
      await register(name, email, password, role);
      if (role === 'trainer') {
        router.push('/dashboard');
      } else {
        router.push('/profile');
      }
    } catch (err: any) {
      const msg = err?.message || '';
      setError(msg.replace(/^[A-Z_]+:\s*/, '') || 'Registration failed');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-8">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 rounded-xl bg-[#fbf9f8] p-1 border-2 border-emerald-500/50 shadow-md flex items-center justify-center overflow-hidden mx-auto">
          <img src="/weblogo.jpeg" alt="GYM HUB Logo" className="w-full h-full object-cover scale-[1.85] origin-center" />
        </div>
        <h1 className="text-3xl font-black uppercase tracking-tight">CREATE ATHLETE ACCOUNT</h1>
        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
          JOIN THE GYM HUB PERFORMANCE MARKETPLACE
        </p>
      </div>

      <div className="p-8 rounded-xl bg-white dark:bg-[#16191f] border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
        {error && (
          <div className="p-3 rounded bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">Select Account Type</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole('member')}
                className={`py-2.5 px-3 rounded text-xs font-bold uppercase border transition flex items-center justify-center gap-1.5 ${
                  role === 'member'
                    ? 'bg-[#006e21] dark:bg-[#2dff5f] text-white dark:text-black border-transparent'
                    : 'bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-700'
                }`}
              >
                <User className="w-4 h-4" /> Athlete Member
              </button>
              <button
                type="button"
                onClick={() => setRole('trainer')}
                className={`py-2.5 px-3 rounded text-xs font-bold uppercase border transition flex items-center justify-center gap-1.5 ${
                  role === 'trainer'
                    ? 'bg-[#006e21] dark:bg-[#2dff5f] text-white dark:text-black border-transparent'
                    : 'bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-700'
                }`}
              >
                <Dumbbell className="w-4 h-4" /> Certified Coach
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="text"
                placeholder="e.g. Sophia Martinez"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded p-3 pl-10 text-xs font-bold"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="email"
                placeholder="sophia@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded p-3 pl-10 text-xs font-bold"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded p-3 pl-10 text-xs font-bold"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded bg-[#006e21] dark:bg-[#2dff5f] text-white dark:text-black font-black text-xs uppercase tracking-wider hover:opacity-90 transition shadow-md flex items-center justify-center gap-2 mt-2"
          >
            Create Account & Get Started <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs font-bold text-slate-500 pt-2 border-t border-slate-200 dark:border-slate-800">
          Already registered?{' '}
          <Link href="/login" className="text-emerald-600 dark:text-emerald-400 hover:underline">
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
}
