'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { MOCK_ARTICLES } from '@/lib/mock-data';
import { Clock, User, ArrowLeft, Share2 } from 'lucide-react';
import Link from 'next/link';

export default function ArticleDetailPage() {
  const params = useParams();
  const articleId = params?.id as string;
  const article = MOCK_ARTICLES.find(a => a.id === articleId) || MOCK_ARTICLES[0];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <Link href="/blog" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 hover:underline">
        <ArrowLeft className="w-4 h-4" /> Back To Blog Index
      </Link>

      <div className="space-y-4">
        <span className="px-3 py-1 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-black text-xs uppercase tracking-wider">
          {article.category}
        </span>
        <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight leading-tight">{article.title}</h1>
        
        <div className="flex items-center justify-between border-y border-slate-200 dark:border-slate-800 py-3 text-xs font-bold text-slate-500">
          <div className="flex items-center gap-3">
            <User className="w-4 h-4 text-emerald-500" />
            <span>By {article.author} ({article.authorRole})</span>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="w-4 h-4" />
            <span>{article.readTime}</span>
          </div>
        </div>
      </div>

      <div className="h-96 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
        <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
      </div>

      <article className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6 text-sm leading-relaxed">
        <p className="text-base font-semibold leading-relaxed border-l-4 border-[#2dff5f] pl-4 italic">
          {article.excerpt}
        </p>

        <h2 className="text-xl font-black uppercase text-slate-900 dark:text-white pt-4">1. Understanding Progressive Autoregulation</h2>
        <p>
          Linear periodization dictates adding fixed weight every week. However, neuromuscular fatigue, sleep variability, and metabolic substrate depletion mean human strength output fluctuates daily. Rating of Perceived Exertion (RPE) ensures every working set stays within target mechanical tension thresholds.
        </p>

        <h2 className="text-xl font-black uppercase text-slate-900 dark:text-white pt-4">2. Lengthened Partial Reps for Maximum Fiber Hypertrophy</h2>
        <p>
          Recent 2025 muscle architecture studies confirm that mechanical tension at long muscle lengths triggers superior sarcomerogenesis compared to short-length peak contractions. Incorporating lengthened partials at the end of working sets accelerates hypertrophy by up to 28%.
        </p>
      </article>
    </div>
  );
}
