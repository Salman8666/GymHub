import React from 'react';
import { DashboardSidebar } from '@/components/sidebar';
import { TrainerGuard } from '@/components/trainer-guard';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
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
