'use client';

import React from 'react';
import Link from 'next/link';
import { MOCK_GYMS, MOCK_TRAINERS, MOCK_PRODUCTS, MOCK_PLANS, MOCK_ARTICLES } from '@/lib/mock-data';
import { ArrowRight, Dumbbell, MapPin, Star, ShieldCheck, Zap, Users, ShoppingBag, Award, CheckCircle2, TrendingUp } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 bg-gradient-to-b from-[#1b1c1c] via-[#121313] to-[#0d0f12] text-white">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-25" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Hero Text */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[#2dff5f] text-xs font-bold uppercase tracking-wider">
                <Zap className="w-3.5 h-3.5" /> Next-Gen Fitness Ecosystem
              </div>

              <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight leading-[1.05]">
                UNLEASH YOUR <span className="text-[#2dff5f]">PEAK POTENTIAL</span> WITH GYM HUB
              </h1>

              <p className="text-base sm:text-lg text-slate-300 font-light leading-relaxed max-w-2xl">
                Book day passes at elite strength centers, train with IFBB certified coaches, purchase lab-tested supplements, and execute custom hypertrophy blueprints.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  href="/gyms"
                  className="px-6 py-3.5 rounded bg-[#2dff5f] hover:bg-[#00e54e] text-[#002105] font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(45,255,95,0.4)] transition-all"
                >
                  <MapPin className="w-4 h-4" /> Find Gym Near You
                </Link>
                <Link
                  href="/trainers"
                  className="px-6 py-3.5 rounded bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 border border-slate-700 transition-all"
                >
                  <Users className="w-4 h-4" /> Book Elite Trainer
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 border-t border-slate-800 grid grid-cols-3 gap-4">
                <div>
                  <div className="text-2xl font-black text-white">500+</div>
                  <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Verified Gyms</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-[#2dff5f]">1,200+</div>
                  <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Certified Coaches</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-white">99.4%</div>
                  <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Satisfaction Rate</div>
                </div>
              </div>
            </div>

            {/* Hero Feature Card */}
            <div className="lg:col-span-5">
              <div className="relative rounded-xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-900 group">
                <img
                  src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80"
                  alt="Gym Hub Facility"
                  className="w-full h-[400px] object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 space-y-2">
                  <span className="px-2.5 py-1 rounded bg-[#2dff5f] text-[#002105] text-[10px] font-black uppercase tracking-wider">
                    FEATURED SANCTUARY
                  </span>
                  <h3 className="text-xl font-black text-white uppercase">Iron Sanctuary Performance Center</h3>
                  <p className="text-xs text-slate-300 line-clamp-2">
                    Eleiko Competition Racks, InBody 770 Analyzer, Cryotherapy & 24/7 keycard access.
                  </p>
                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-sm font-extrabold text-[#2dff5f]">$25 / Day Pass</span>
                    <Link
                      href="/gyms/gym-iron-sanctuary"
                      className="text-xs font-bold text-white uppercase tracking-wider underline hover:text-[#2dff5f] flex items-center gap-1"
                    >
                      Book Pass <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Featured Gym Facilities */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="label-caps text-[#006e21] dark:text-[#2dff5f] mb-1">Top Tier Locations</h2>
            <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">EXPLORE VERIFIED GYMS</h3>
          </div>
          <Link href="/gyms" className="text-xs font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1">
            View All Gyms <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {MOCK_GYMS.map((gym) => (
            <div key={gym.id} className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#16191f] overflow-hidden shadow-sm hover:shadow-md transition">
              <div className="relative h-48">
                <img src={gym.image} alt={gym.name} className="w-full h-full object-cover" />
                <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded text-white text-xs font-bold flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {gym.rating} ({gym.reviewsCount})
                </div>
              </div>
              <div className="p-5 space-y-3">
                <h4 className="font-extrabold text-base uppercase line-clamp-1">{gym.name}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{gym.location}</p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {gym.amenities.slice(0, 3).map((amenity, idx) => (
                    <span key={idx} className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {amenity}
                    </span>
                  ))}
                </div>
                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Day Pass</span>
                    <span className="text-base font-black text-emerald-600 dark:text-emerald-400">${gym.dayPassPrice}</span>
                  </div>
                  <Link
                    href={`/gyms/${gym.id}`}
                    className="px-4 py-2 rounded bg-slate-900 dark:bg-slate-800 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider transition"
                  >
                    View Center
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Certified Trainers */}
      <section className="bg-slate-100 dark:bg-[#111317] py-16 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="label-caps text-[#006e21] dark:text-[#2dff5f] mb-1">Coaching Staff</h2>
              <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">TRAIN WITH IFBB & CSCS PROS</h3>
            </div>
            <Link href="/trainers" className="text-xs font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1">
              Browse All Trainers <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {MOCK_TRAINERS.map((trainer) => (
              <div key={trainer.id} className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#16191f] p-5 space-y-4 shadow-sm">
                <div className="flex gap-4">
                  <img src={trainer.image} alt={trainer.name} className="w-20 h-20 rounded-lg object-cover border border-slate-200 dark:border-slate-700" />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-extrabold text-base uppercase">{trainer.name}</h4>
                      {trainer.verified && <ShieldCheck className="w-4 h-4 text-emerald-500" />}
                    </div>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold line-clamp-1">{trainer.title}</p>
                    <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {trainer.rating} ({trainer.reviewsCount} reviews)
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">{trainer.bio}</p>

                <div className="grid grid-cols-3 gap-2 py-2 bg-slate-50 dark:bg-[#0d0f12] p-2 rounded text-center">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Clients</span>
                    <span className="text-xs font-black">{trainer.stats.activeClients} Active</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Workouts</span>
                    <span className="text-xs font-black">{trainer.stats.totalWorkouts}+</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Hourly</span>
                    <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">${trainer.hourlyRate}/hr</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link
                    href={`/trainers/${trainer.id}`}
                    className="w-full text-center py-2.5 rounded bg-[#006e21] dark:bg-[#2dff5f] text-white dark:text-black font-extrabold text-xs uppercase tracking-wider hover:opacity-90 transition"
                  >
                    View Profile & Book
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Marketplace Products Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="label-caps text-[#006e21] dark:text-[#2dff5f] mb-1">Gear & Supplements</h2>
            <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">FEATURED MARKETPLACE ITEMS</h3>
          </div>
          <Link href="/shop" className="text-xs font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1">
            Shop Full Catalog <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {MOCK_PRODUCTS.map((prod) => (
            <div key={prod.id} className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#16191f] overflow-hidden flex flex-col justify-between shadow-sm">
              <div>
                <div className="relative h-44 bg-slate-100 dark:bg-slate-900 p-4">
                  <img src={prod.image} alt={prod.name} className="w-full h-full object-contain" />
                  <span className="absolute top-2 left-2 text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-black/70 text-white">
                    {prod.category}
                  </span>
                </div>
                <div className="p-4 space-y-2">
                  <h4 className="font-extrabold text-xs uppercase line-clamp-2">{prod.name}</h4>
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {prod.rating} ({prod.reviewsCount})
                  </div>
                  <p className="font-black text-base text-emerald-600 dark:text-emerald-400">${prod.price.toFixed(2)}</p>
                </div>
              </div>
              <div className="p-4 pt-0">
                <Link
                  href={`/shop/${prod.id}`}
                  className="w-full block text-center py-2 rounded bg-slate-900 dark:bg-slate-800 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider transition"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
