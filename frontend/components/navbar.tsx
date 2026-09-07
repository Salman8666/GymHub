'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/lib/cart-context';
import { useAuth } from '@/lib/auth-context';
import { ThemeSwitcher } from './theme-switcher';
import { ShoppingBag, Dumbbell, MapPin, Users, BookOpen, Store, User, LogIn, LogOut, Menu, X, ShieldCheck } from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const { totalItems, setIsCartOpen } = useCart();
  const { user, setIsAuthOpen, setAuthMode, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const isTrainer = user?.role === 'trainer';

  const navItems = [
    { label: 'Gyms', href: '/gyms', icon: MapPin },
    { label: 'Trainers', href: '/trainers', icon: Users },
    { label: 'Shop Gear', href: '/shop', icon: Store },
    { label: 'Programs', href: '/plans', icon: Dumbbell },
    { label: 'Insights', href: '/blog', icon: BookOpen },
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/95 border-b border-slate-200 dark:bg-[#1b1c1c]/95 dark:border-slate-800 text-slate-900 dark:text-white transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 min-w-0">
          
          {/* Brand Logo & Desktop Navigation */}
          <div className="flex items-center gap-3 xl:gap-6 min-w-0">
            <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#fbf9f8] p-1 border-2 border-[#1df269]/50 shadow-md flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform shrink-0">
                <img src="/weblogo.jpeg" alt="GYM HUB Logo" className="w-full h-full object-cover scale-[1.85] origin-center" />
              </div>
              <div className="flex flex-col shrink-0">
                <span className="font-black tracking-tighter text-base sm:text-lg leading-none text-slate-900 dark:text-white uppercase">
                  GYM<span className="text-[#1df269]">HUB</span>
                </span>
                <span className="text-[7.5px] sm:text-[8px] font-extrabold tracking-widest text-[#1df269] uppercase leading-tight mt-1">
                  CONNECT • TRAIN • GROW
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 p-1 bg-slate-100/80 dark:bg-slate-900/80 rounded-xl border border-slate-200 dark:border-slate-800">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] xl:text-xs font-extrabold uppercase tracking-wider transition-all duration-200 whitespace-nowrap ${
                      isActive
                        ? 'bg-slate-200 dark:bg-slate-800 text-emerald-700 dark:text-[#1df269] shadow-sm border border-[#1df269]/40 font-black'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-700 dark:text-[#1df269]' : 'text-slate-500 dark:text-slate-400'}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}

              {/* Command Center Link */}
              {isTrainer && (() => {
                const isDashboardActive = pathname.startsWith('/dashboard');
                return (
                  <Link
                    href="/dashboard"
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] xl:text-xs font-black uppercase tracking-wider transition-all duration-200 whitespace-nowrap ml-1 border ${
                      isDashboardActive
                        ? 'bg-[#1df269] text-black border-[#1df269] shadow-[0_0_12px_rgba(29,242,105,0.4)]'
                        : 'bg-white text-slate-700 border-slate-300 hover:border-[#1df269]/60 hover:text-emerald-700 dark:bg-slate-900 dark:text-slate-200 dark:border-slate-700/80 dark:hover:text-[#1df269]'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1df269] animate-pulse" />
                    Command Center
                  </Link>
                );
              })()}
            </nav>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Theme Switcher */}
            <ThemeSwitcher />

            {/* Shopping Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 rounded-md border border-slate-200 bg-white text-slate-900 hover:border-[#1df269] transition shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              title="View Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4 text-[#1df269]" />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#1df269] text-black font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow-md">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Auth / Account Profile Button */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-md border border-slate-200 bg-white text-slate-900 hover:border-[#1df269] transition shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                >
                  <img src={user.avatar} alt={user.name} className="w-6 h-6 rounded-full object-cover border border-[#1df269]" />
                  <span className="text-xs font-bold uppercase tracking-wider hidden xl:inline">{user.name.split(' ')[0]}</span>
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-lg bg-white dark:bg-[#1b1c1c] border border-slate-200 dark:border-slate-800 shadow-2xl p-2 z-50">
                    <div className="p-2 border-b border-slate-200 dark:border-slate-800 mb-1">
                      <p className="font-extrabold text-xs text-slate-900 dark:text-white line-clamp-1">{user.name}</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded bg-[#1df269]/20 text-[#1df269] text-[9px] font-black uppercase border border-[#1df269]/30">
                        {user.role} Account
                      </span>
                    </div>

                    {isTrainer && (
                      <Link
                        href="/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="block px-3 py-2 text-xs font-black text-[#1df269] hover:bg-[#1df269]/10 rounded transition flex items-center justify-between"
                      >
                        <span>Trainer Dashboard</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-[#1df269] animate-pulse" />
                      </Link>
                    )}
                    <Link
                      href="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="block px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 rounded transition"
                    >
                      My Profile & Digital Pass
                    </Link>
                    <Link
                      href="/my-plans"
                      onClick={() => setUserDropdownOpen(false)}
                      className="block px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 rounded transition"
                    >
                      My Fitness Plans
                    </Link>
                    <Link
                      href="/orders"
                      onClick={() => setUserDropdownOpen(false)}
                      className="block px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 rounded transition"
                    >
                      Order History
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-bold text-red-400 hover:bg-red-950/40 rounded transition flex items-center gap-1.5 mt-1 border-t border-slate-800"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setAuthMode('login');
                    setIsAuthOpen(true);
                  }}
                  className="px-3 py-1.5 rounded text-xs font-black uppercase tracking-wider text-slate-700 hover:text-emerald-700 transition dark:text-slate-200 dark:hover:text-[#1df269]"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setAuthMode('register');
                    setIsAuthOpen(true);
                  }}
                  className="px-3.5 py-1.5 rounded bg-[#1df269] text-black font-black text-xs uppercase tracking-wider hover:opacity-90 transition shadow-sm"
                >
                  Register
                </button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-md text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-[#1b1c1c] border-b border-slate-200 dark:border-slate-800 px-4 pt-3 pb-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-extrabold uppercase tracking-wider transition ${
                  isActive
                    ? 'bg-[#1df269]/10 text-emerald-700 dark:text-[#1df269] border border-[#1df269]/30'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-700 dark:text-[#1df269]' : 'text-slate-500 dark:text-slate-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}

          {isTrainer && (
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition mt-1 border ${
                pathname.startsWith('/dashboard')
                  ? 'bg-[#1df269] text-black border-[#1df269]'
                  : 'bg-white text-slate-700 border-slate-300 dark:bg-slate-900 dark:text-slate-200 dark:border-slate-700'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#1df269] animate-pulse" />
              <span>Command Center</span>
            </Link>
          )}

          {!user ? (
            <div className="pt-3 border-t border-slate-800 flex gap-2">
              <button
                onClick={() => {
                  setAuthMode('login');
                  setIsAuthOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 rounded border border-slate-300 text-slate-900 dark:border-slate-700 dark:text-white text-xs font-black uppercase text-center"
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setAuthMode('register');
                  setIsAuthOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 rounded bg-[#1df269] text-black text-xs font-black uppercase text-center"
              >
                Register
              </button>
            </div>
          ) : (
            <div className="pt-3 border-t border-slate-800 flex justify-between items-center">
              <Link href="/profile" onClick={() => setMobileMenuOpen(false)} className="text-xs font-bold uppercase text-[#1df269]">
                My Account ({user.name})
              </Link>
              <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="text-xs font-bold text-red-400 uppercase">
                Sign Out
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
