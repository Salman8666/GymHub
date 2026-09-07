'use client';

import React, { useState } from 'react';
import { useAuth, DEMO_CREDENTIALS, DEMO_PASSWORD } from '@/lib/auth-context';
import { X, Lock, Mail, User, ShieldCheck, Dumbbell, KeyRound, CheckCircle2, ArrowRight, Eye, EyeOff } from 'lucide-react';

export function AuthModal() {
  const { isAuthOpen, setIsAuthOpen, authMode, setAuthMode, login, register } = useAuth();
  
  const [email, setEmail] = useState('alexander@gymhub.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [selectedRole, setSelectedRole] = useState<'member' | 'trainer'>('member');
  const [error, setError] = useState('');

  if (!isAuthOpen) return null;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !emailRegex.test(email.trim())) {
      setError('Please enter a valid email address (e.g. athlete@gymhub.com)');
      return;
    }

    if (authMode === 'login') {
      if (!password) {
        setError('Please enter your password');
        return;
      }
      try {
        await login(email, password);
      } catch (err: any) {
        const msg = err.message || '';
        if (msg.includes('USER_EXISTS')) {
          setError('An account with this email already exists.');
        } else if (msg.includes('INVALID_CREDENTIALS')) {
          setError('Incorrect email or password. Please check your credentials and try again.');
        } else {
          setError(msg.replace(/^[A-Z_]+:\s*/, '') || 'Invalid sign in attempt');
        }
      }
    } else {
      if (!name || name.trim().length < 2) {
        setError('Please enter your full name (at least 2 characters)');
        return;
      }
      if (!passwordRegex.test(password)) {
        setError('Password must be at least 8 characters long and include at least 1 uppercase letter, 1 lowercase letter, and 1 number (e.g. Password123)');
        return;
      }
      try {
        await register(name, email, password, selectedRole);
      } catch (err: any) {
        const msg = err.message || '';
        setError(msg.replace(/^[A-Z_]+:\s*/, '') || 'Registration failed');
      }
    }
  };

  const handleQuickLogin = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword(DEMO_PASSWORD);
    login(demoEmail, DEMO_PASSWORD).catch((err: any) => {
      const msg = err?.message || '';
      setError(msg.replace(/^[A-Z_]+:\s*/, '') || 'Demo sign in failed');
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={() => setIsAuthOpen(false)}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-md bg-white dark:bg-[#16191f] text-slate-900 dark:text-slate-100 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-10">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0d0f12] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#fbf9f8] p-0.5 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-center overflow-hidden shrink-0">
              <img src="/weblogo.jpeg" alt="GYM HUB" className="w-full h-full object-cover scale-[1.85] origin-center" />
            </div>
            <div>
              <h2 className="font-extrabold uppercase text-base leading-none">
                {authMode === 'login' ? 'Sign In To Gym Hub' : 'Create Athlete Account'}
              </h2>
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mt-1 block">
                CONNECT • TRAIN • GROW
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsAuthOpen(false)}
            className="p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 text-xs font-black uppercase tracking-wider">
          <button
            onClick={() => { setAuthMode('login'); setError(''); }}
            className={`flex-1 py-3 text-center transition border-b-2 ${
              authMode === 'login'
                ? 'border-emerald-600 dark:border-emerald-400 text-emerald-600 dark:text-emerald-400 bg-white dark:bg-[#16191f]'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 bg-slate-50 dark:bg-slate-900/50'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setAuthMode('register'); setError(''); }}
            className={`flex-1 py-3 text-center transition border-b-2 ${
              authMode === 'register'
                ? 'border-emerald-600 dark:border-emerald-400 text-emerald-600 dark:text-emerald-400 bg-white dark:bg-[#16191f]'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 bg-slate-50 dark:bg-slate-900/50'
            }`}
          >
            Register Account
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-bold leading-relaxed">
              {error}
            </div>
          )}

          {authMode === 'register' && (
            <>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">Account Role</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedRole('member')}
                    className={`py-2 px-3 rounded text-xs font-bold uppercase border transition flex items-center justify-center gap-1.5 ${
                      selectedRole === 'member'
                        ? 'bg-emerald-600 dark:bg-emerald-500 text-white dark:text-black border-transparent'
                        : 'bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-700'
                    }`}
                  >
                    <User className="w-3.5 h-3.5" /> Athlete Member
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedRole('trainer')}
                    className={`py-2 px-3 rounded text-xs font-bold uppercase border transition flex items-center justify-center gap-1.5 ${
                      selectedRole === 'trainer'
                        ? 'bg-emerald-600 dark:bg-emerald-500 text-white dark:text-black border-transparent'
                        : 'bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-700'
                    }`}
                  >
                    <Dumbbell className="w-3.5 h-3.5" /> Certified Coach
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="e.g. Alexander Wright"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded p-2.5 pl-9 text-xs font-bold"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                placeholder="alexander@gymhub.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded p-2.5 pl-9 text-xs font-bold"
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-1 font-semibold">Must be a valid format (e.g. name@domain.com).</p>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded p-2.5 pl-9 pr-9 text-xs font-bold"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition focus:outline-none"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {authMode === 'register' && (
              <p className="text-[10px] text-slate-400 mt-1 font-semibold">
                Must be at least 8 characters with 1 uppercase, 1 lowercase & 1 number (e.g. Password123).
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded bg-emerald-600 dark:bg-emerald-500 text-white dark:text-black font-black text-xs uppercase tracking-wider hover:opacity-90 transition shadow-md flex items-center justify-center gap-2 mt-2"
          >
            {authMode === 'login' ? 'Sign In To Account' : 'Create Account Now'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Credentials Section */}
        <div className="p-4 bg-slate-100 dark:bg-[#0d0f12] border-t border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center gap-1.5 text-[11px] font-black uppercase text-slate-500">
            <KeyRound className="w-3.5 h-3.5 text-emerald-500" />
            <span>Instant Demo Accounts (Click to Sign In):</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {DEMO_CREDENTIALS.map((cred) => (
              <button
                key={cred.email}
                type="button"
                onClick={() => handleQuickLogin(cred.email)}
                className="p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 transition text-left space-y-0.5"
              >
                <span className="text-[10px] font-black uppercase block text-emerald-600 dark:text-emerald-400 leading-none">
                  {cred.role}
                </span>
                <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 block truncate">
                  {cred.name.split(' ')[0]}
                </span>
                <span className="text-[9px] text-slate-400 block font-mono">
                  {cred.email.split('@')[0]}
                </span>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
