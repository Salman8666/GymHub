'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { LayoutDashboard, Users, BookOpenCheck, Store, DollarSign, UserCheck, Building2, Settings, Menu, X } from 'lucide-react';

export function DashboardSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const firstName = user?.name.split(' ')[0] ?? 'Coach';

  const navItems = [
    { href: '/dashboard', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { href: '/dashboard/clients', label: 'Clients Roster', icon: <Users className="w-4 h-4" /> },
    { href: '/dashboard/programs', label: 'Program Builder', icon: <BookOpenCheck className="w-4 h-4" /> },
    { href: '/dashboard/store', label: 'My Store Manager', icon: <Store className="w-4 h-4" /> },
    { href: '/dashboard/finances', label: 'Finances & Payouts', icon: <DollarSign className="w-4 h-4" /> },
    { href: '/dashboard/onboarding', label: 'Trainer Profile', icon: <UserCheck className="w-4 h-4" /> },
    { href: '/register-gym', label: 'Register Gym Facility', icon: <Building2 className="w-4 h-4" /> },
    { href: '/settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> }
  ];

  const sidebarContent = (
    <>
      {/* Sidebar Header */}
      <div className="p-5 border-b border-slate-800 bg-[#161717] flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3" onClick={() => setMobileOpen(false)}>
          <div className="w-10 h-10 bg-[#fbf9f8] rounded-xl p-0.5 border-2 border-emerald-500/50 shadow-md flex items-center justify-center overflow-hidden shrink-0">
            <img src="/weblogo.jpeg" alt="GYM HUB Logo" className="w-full h-full object-cover scale-[1.85] origin-center" />
          </div>
          <div>
            <h3 className="font-extrabold uppercase tracking-tight text-xs text-white">Elite Command</h3>
            <p className="text-[8px] text-[#2dff5f] font-extrabold uppercase tracking-widest mt-0.5">CONNECT • TRAIN • GROW</p>
          </div>
        </Link>
        <div className="flex items-center gap-3">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2dff5f]"></span>
          </span>
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-800"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-3 mb-2">
          Trainer Hub Navigation
        </div>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded text-xs font-bold uppercase tracking-wider transition-all ${
                isActive
                  ? 'bg-[#2dff5f] text-[#002105] shadow-[0_0_15px_rgba(45,255,95,0.3)]'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Trainer Quick Status Card */}
      <div className="p-4 border-t border-slate-800 bg-[#141515] m-3 rounded-lg border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</span>
          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-[#2dff5f] border border-emerald-500/40 text-[9px] font-extrabold uppercase">
            {user?.membershipType || 'Verified Coach'}
          </span>
        </div>
        <div className="text-xs font-bold text-white mb-1">{user?.name || 'Coach'}</div>
        <div className="text-[11px] text-slate-400">Command Center Active</div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-[4.5rem] left-4 z-40 p-2.5 rounded-lg bg-[#1b1c1c] border border-slate-700 text-white shadow-lg"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-[#1b1c1c] text-white flex-col border-r border-slate-800 shrink-0 min-h-[calc(100vh-4rem)]">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-[#1b1c1c] text-white flex flex-col border-r border-slate-800">
            {sidebarContent}
          </aside>
        </>
      )}
    </>
  );
}
