'use client';

import React from 'react';
import { HelpCircle, Mail, MessageSquare, PhoneCall, CheckCircle2 } from 'lucide-react';

export default function SupportPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="bg-[#1b1c1c] text-white p-8 rounded-xl border border-slate-800 space-y-3">
        <h1 className="text-3xl font-black uppercase tracking-tight">SUPPORT & KNOWLEDGE DESK</h1>
        <p className="text-xs text-slate-300">
          Have questions about your digital gym pass, trainer session escrow, or supplement shipping? We are here 24/7.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 rounded-xl bg-white dark:bg-[#16191f] border border-slate-200 dark:border-slate-800 text-center space-y-2">
          <Mail className="w-8 h-8 text-emerald-500 mx-auto" />
          <h3 className="font-extrabold text-sm uppercase">Email Desk</h3>
          <p className="text-xs text-slate-500">support@gymhub.com</p>
        </div>

        <div className="p-5 rounded-xl bg-white dark:bg-[#16191f] border border-slate-200 dark:border-slate-800 text-center space-y-2">
          <MessageSquare className="w-8 h-8 text-emerald-500 mx-auto" />
          <h3 className="font-extrabold text-sm uppercase">Live Chat</h3>
          <p className="text-xs text-slate-500">Average response &lt; 3 mins</p>
        </div>

        <div className="p-5 rounded-xl bg-white dark:bg-[#16191f] border border-slate-200 dark:border-slate-800 text-center space-y-2">
          <PhoneCall className="w-8 h-8 text-emerald-500 mx-auto" />
          <h3 className="font-extrabold text-sm uppercase">VIP Hotline</h3>
          <p className="text-xs text-slate-500">+1 (800) 555-GYMHUB</p>
        </div>
      </div>
    </div>
  );
}
