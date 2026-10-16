'use client';

import React from 'react';
import { DashboardSidebar } from '@/components/sidebar';
import { TrainerGuard } from '@/components/trainer-guard';
import { useAuth } from '@/lib/auth-context';
import { usePathname } from 'next/navigation';
import { MemberDashboardView } from './member-dashboard';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const pathname = usePathname();

  // If user is an athlete member visiting the main /dashboard overview, display the athlete dashboard
  if (user && user.role !== 'trainer' && pathname === '/dashboard') {
    return (
      <div className="bg-[#0d0f12] text-white min-h-[calc(100vh-4rem)] p-4 sm:p-8 max-w-7xl mx-auto">
        <MemberDashboardView />
      </div>
    );
  }

  return (
    <TrainerGuard>
      <div className="flex bg-[#0d0f12] text-white min-h-[calc(100vh-4rem)]">
        <DashboardSidebar />
        <div className="flex-1 overflow-y-auto p-4 pt-16 lg:p-8 space-y-6">
          {children}
        </div>
      </div>
    </TrainerGuard>
  );
}
