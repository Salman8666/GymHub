'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth, DEMO_CREDENTIALS, DEMO_PASSWORD } from '@/lib/auth-context';
import { Lock, Mail, KeyRound, ArrowRight, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('alexander@gymhub.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email) {
      setError('Please enter a valid email address');
      return;
    }
    try {
      await login(email, password);
      router.push('/profile');
    } catch (err: any) {
      const msg = err?.message || '';
      setError(msg.replace(/^[A-Z_]+:\s*/, '') || 'Sign in failed');
    }
  };

  const handleQuickDemo = async (demoEmail: string, role: 'member' | 'trainer') => {
    try {
      await login(demoEmail, DEMO_PASSWORD);
      if (role === 'trainer') {
        router.push('/dashboard');
      } else {
        router.push('/profile');
      }
    } catch (err: any) {
      const msg = err?.message || '';
      setError(msg.replace(/^[A-Z_]+:\s*/, '') || 'Demo sign in failed');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-8">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 rounded-xl bg-[#fbf9f8] p-1 border-2 border-emerald-500/50 shadow-md flex items-center justify-center overflow-hidden mx-auto">
          <img src="/weblogo.jpeg" alt="GYM HUB Logo" className="w-full h-full object-cover scale-[1.85] origin-center" />
        </div>
        <h1 className="text-3xl font-black uppercase tracking-tight">SIGN IN TO GYM HUB</h1>
        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
          ACCESS YOUR ATHLETE DIGITAL PASS AND TRAINER DASHBOARD
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
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="email"
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded p-3 pl-10 text-xs font-bold"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded bg-[#006e21] dark:bg-[#2dff5f] text-white dark:text-black font-black text-xs uppercase tracking-wider hover:opacity-90 transition shadow-md flex items-center justify-center gap-2"
          >
            Sign In To Account <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Credentials Box */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-black uppercase text-slate-500">
            <KeyRound className="w-4 h-4 text-emerald-500" />
            <span>Pre-Filled Demo Accounts (1-Click Login):</span>
          </div>

          <div className="space-y-2">
            {DEMO_CREDENTIALS.map((cred) => (
              <button
                key={cred.email}
                onClick={() => handleQuickDemo(cred.email, cred.role)}
                className="w-full p-3 rounded bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 transition flex items-center justify-between text-left"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-xs text-slate-900 dark:text-white">{cred.name}</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-black text-[9px] uppercase">
                      {cred.role}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono block">{cred.email}</span>
                </div>
                <ArrowRight className="w-4 h-4 text-emerald-500" />
              </button>
            ))}
          </div>
        </div>

        <div className="text-center text-xs font-bold text-slate-500 pt-2">
          Don't have an account?{' '}
          <Link href="/register" className="text-emerald-600 dark:text-emerald-400 hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
}
