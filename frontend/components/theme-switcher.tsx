'use client';

import React, { useState } from 'react';
import { useTheme, ThemeMode } from '@/lib/theme-context';
import { Sun, Moon, Sparkles, User, Shield, Dumbbell } from 'lucide-react';

export function ThemeSwitcher() {
  const { theme, setTheme, userRole, setUserRole } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const themes: { id: ThemeMode; label: string; icon: React.ReactNode; color: string }[] = [
    {
      id: 'athletic-minimal',
      label: 'Athletic Minimal (Light)',
      icon: <Sun className="w-4 h-4 text-amber-500" />,
      color: 'bg-[#fbf9f8] border-emerald-600 text-slate-900'
    },
    {
      id: 'elite-performance',
      label: 'Elite Command Center (Dark)',
      icon: <Moon className="w-4 h-4 text-emerald-400" />,
      color: 'bg-[#1b1c1c] border-emerald-500 text-white'
    },
    {
      id: 'obsidian-cyber',
      label: 'Obsidian Cyber (Neon)',
      icon: <Sparkles className="w-4 h-4 text-green-400" />,
      color: 'bg-[#0d0f12] border-green-400 text-emerald-400'
    }
  ];

  return (
    <div className="relative z-50">
      <div className="flex items-center">
        {/* Theme Picker Dropdown Trigger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 hover:border-[#1df269] shadow-sm transition-all flex items-center justify-center shrink-0"
          title="Switch UI Theme"
        >
          {theme === 'athletic-minimal' && <Sun className="w-4 h-4 text-amber-400" />}
          {theme === 'elite-performance' && <Moon className="w-4 h-4 text-[#1df269]" />}
          {theme === 'obsidian-cyber' && <Sparkles className="w-4 h-4 text-[#1df269]" />}
        </button>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-2 z-50">
          {/* Role Toggle inside Dropdown */}
          <div className="p-2 border-b border-slate-200 dark:border-slate-800 mb-2">
            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
              Active Demo Role
            </div>
            <div className="grid grid-cols-3 gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-md text-xs">
              <button
                onClick={() => setUserRole('member')}
                className={`flex items-center justify-center gap-1 py-1 rounded transition-all font-bold text-[10px] uppercase ${
                  userRole === 'member'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <User className="w-3 h-3" /> Member
              </button>
              <button
                onClick={() => setUserRole('trainer')}
                className={`flex items-center justify-center gap-1 py-1 rounded transition-all font-bold text-[10px] uppercase ${
                  userRole === 'trainer'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Dumbbell className="w-3 h-3" /> Trainer
              </button>
              <button
                onClick={() => setUserRole('admin')}
                className={`flex items-center justify-center gap-1 py-1 rounded transition-all font-bold text-[10px] uppercase ${
                  userRole === 'admin'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Shield className="w-3 h-3" /> Admin
              </button>
            </div>
          </div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-2 py-1 mb-1">
            Select UI Theme
          </div>
          {themes.map(t => (
            <button
              key={t.id}
              onClick={() => {
                setTheme(t.id);
                setIsOpen(false);
              }}
              className={`w-full flex items-center justify-between p-2.5 rounded-md text-xs font-semibold mb-1 transition-all ${
                theme === t.id
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/50 text-emerald-700 dark:text-emerald-300'
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2">
                {t.icon}
                <span>{t.label}</span>
              </div>
              {theme === t.id && (
                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(45,255,95,0.8)]" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
