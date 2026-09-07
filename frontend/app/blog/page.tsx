'use client';

import React from 'react';
import Link from 'next/link';
import { MOCK_ARTICLES } from '@/lib/mock-data';
import { BookOpen, Clock, ArrowRight, User } from 'lucide-react';

export default function BlogPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="bg-[#1b1c1c] text-white p-8 rounded-xl border border-slate-800 space-y-3">
        <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight">
          GYM HUB <span className="text-[#2dff5f]">FITNESS INSIGHTS</span> & SCIENCE BLOG
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
          Peer-reviewed articles, periodization mechanics, intra-workout nutrition strategies, and training plateau breakdowns.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {MOCK_ARTICLES.map((art) => (
          <div key={art.id} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#16191f] overflow-hidden shadow-sm flex flex-col justify-between">
            <div>
              <div className="relative h-60">
                <img src={art.image} alt={art.title} className="w-full h-full object-cover" />
                <span className="absolute top-3 left-3 bg-black/80 px-2.5 py-1 rounded text-white text-[10px] font-black uppercase tracking-wider">
                  {art.category}
                </span>
              </div>

              <div className="p-6 space-y-3">
                <div className="flex items-center gap-3 text-xs text-slate-400 font-bold">
                  <span>{art.date}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {art.readTime}</span>
                </div>

                <h3 className="text-xl font-black uppercase leading-snug">{art.title}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{art.excerpt}</p>

                <div className="pt-2 flex items-center gap-2 text-xs font-bold text-slate-500">
                  <User className="w-3.5 h-3.5 text-emerald-500" />
                  <span>By {art.author} ({art.authorRole})</span>
                </div>
              </div>
            </div>

            <div className="p-6 pt-0">
              <Link
                href={`/blog/${art.id}`}
                className="w-full inline-flex items-center justify-center gap-2 py-3 rounded bg-slate-900 dark:bg-slate-800 hover:bg-emerald-600 text-white font-extrabold text-xs uppercase tracking-wider transition"
              >
                Read Full Article <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
