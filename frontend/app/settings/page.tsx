'use client';

import React from 'react';
import { useTheme } from '@/lib/theme-context';
import { Settings, Shield, Bell, Moon, Sun, Sparkles } from 'lucide-react';

export default function SettingsPage() {
  const { theme, setTheme, userRole, setUserRole } = useTheme();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
        <h1 className="text-3xl font-black uppercase tracking-tight">SYSTEM & UI PREFERENCES</h1>
        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">
          CONFIGURE UI THEME MODES AND ROLE CONTEXT
        </p>
      </div>

      <div className="space-y-6">
        {/* Theme Settings Card */}
        <div className="p-6 rounded-xl bg-white dark:bg-[#16191f] border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
          <h3 className="font-extrabold text-base uppercase">UI Design System Theme</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => setTheme('athletic-minimal')}
              className={`p-4 rounded-lg border text-left space-y-2 transition ${theme === 'athletic-minimal' ? 'border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20' : 'border-slate-200 dark:border-slate-800'}`}
            >
              <div className="flex items-center gap-2">
                <Sun className="w-4 h-4 text-amber-500" />
                <span className="font-bold text-xs">Athletic Minimal</span>
              </div>
              <p className="text-[11px] text-slate-500">Warm Paper `#fbf9f8` light aesthetic with Charcoal typography.</p>
            </button>

            <button
              onClick={() => setTheme('elite-performance')}
              className={`p-4 rounded-lg border text-left space-y-2 transition ${theme === 'elite-performance' ? 'border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20' : 'border-slate-200 dark:border-slate-800'}`}
            >
              <div className="flex items-center gap-2">
                <Moon className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-xs">Elite Command Center</span>
              </div>
              <p className="text-[11px] text-slate-500">High-density Dark Command Center with `#1b1c1c` sidebar.</p>
            </button>

            <button
              onClick={() => setTheme('obsidian-cyber')}
              className={`p-4 rounded-lg border text-left space-y-2 transition ${theme === 'obsidian-cyber' ? 'border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20' : 'border-slate-200 dark:border-slate-800'}`}
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-green-400" />
                <span className="font-bold text-xs">Obsidian Cyber</span>
              </div>
              <p className="text-[11px] text-slate-500">Deep obsidian dark mode with glowing Signal Green accents.</p>
            </button>
          </div>
        </div>

        {/* Role Toggle Card */}
        <div className="p-6 rounded-xl bg-white dark:bg-[#16191f] border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
          <h3 className="font-extrabold text-base uppercase">User Role Context</h3>
          
          <div className="flex gap-4">
            {(['member', 'trainer', 'admin'] as const).map(role => (
              <button
                key={role}
                onClick={() => setUserRole(role)}
                className={`px-4 py-2.5 rounded text-xs font-black uppercase tracking-wider ${userRole === role ? 'bg-[#006e21] dark:bg-[#2dff5f] text-white dark:text-black' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
              >
                {role} Mode
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
