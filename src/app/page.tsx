'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { fetchEvents, fetchClubs } from '@/lib/firestoreService';
import { Event, Club } from '@/lib/types';
import EventCard from '@/components/EventCard';
import CalendarView from '@/components/CalendarView';
import {
  Sparkles,
  ArrowRight,
  ChevronRight,
  Users,
  Calendar,
  Layers,
  Award,
  BookOpen,
  ShieldCheck,
  Zap,
  Flame,
  CheckCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function HomePage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    fetchEvents().then(setEvents);
    fetchClubs().then(setClubs);
  }, []);

  const featuredEvents = events.filter((e) => e.isFeatured) || events.slice(0, 2);

  // Auto-rotate hero banner every 6 seconds
  useEffect(() => {
    if (featuredEvents.length <= 1) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % featuredEvents.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [featuredEvents.length]);

  return (
    <div className="space-y-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* 1. HERO BANNER CAROUSEL */}
      {featuredEvents.length > 0 && (
        <section className="relative rounded-3xl overflow-hidden border border-slate-200 shadow-[0_12px_40px_rgba(0,0,0,0.7)]">
          <div className="relative min-h-[480px] sm:min-h-[520px] flex items-center">
            <AnimatePresence mode="wait">
              {featuredEvents.map(
                (evt, idx) =>
                  idx === activeSlide && (
                    <motion.div
                      key={evt.id}
                      initial={{ opacity: 0, scale: 1.02 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.7, ease: 'easeInOut' }}
                      className="absolute inset-0"
                    >
                      <Image
                        src={evt.bannerUrl}
                        alt={evt.title}
                        fill
                        priority
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-slate-950/40" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                    </motion.div>
                  )
              )}
            </AnimatePresence>

            {/* Slide Content Overlay */}
            <div className="relative z-10 p-6 sm:p-12 max-w-3xl space-y-6">


              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-heading tracking-tight text-slate-900 leading-tight">
                {featuredEvents[activeSlide]?.title}
              </h1>

              <p className="text-sm sm:text-base text-slate-600 line-clamp-3 leading-relaxed max-w-2xl">
                {featuredEvents[activeSlide]?.description}
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href={`/events/${featuredEvents[activeSlide]?.id}`}
                  className="px-6 py-3.5 rounded-xl font-bold text-sm text-slate-950 bg-gradient-to-r from-sac-orange to-sac-orange-light shadow-[0_0_30px_rgba(6,182,212,0.5)] hover:shadow-[0_0_40px_rgba(6,182,212,0.7)] transition-all flex items-center gap-2"
                >
                  <Zap className="w-4 h-4 text-slate-950 fill-slate-950" />
                  <span>Register for Event</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/events"
                  className="px-6 py-3.5 rounded-xl font-semibold text-sm text-slate-700 bg-white/5 hover:bg-slate-200 border border-white/15 backdrop-blur-md transition-colors"
                >
                  Explore All Events
                </Link>
              </div>
            </div>

            {/* Slide Navigation Indicators */}
            <div className="absolute bottom-6 right-6 z-20 flex items-center space-x-2 bg-white/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-200">
              {featuredEvents.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveSlide(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === activeSlide ? 'w-6 bg-cyan-400' : 'w-2 bg-slate-600 hover:bg-slate-400'
                  }`}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 2. STATS & IMPACT METRICS */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-6 rounded-3xl bg-white/80 border border-slate-200 backdrop-blur-md flex items-center gap-4 hover:border-sac-orange/30 transition-colors">
          <div className="w-12 h-12 rounded-2xl bg-cyan-950/80 border border-sac-orange/30 flex items-center justify-center text-sac-orange shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900">
              {clubs.length}+
            </span>
            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
              Clubs & Guilds
            </p>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white/80 border border-slate-200 backdrop-blur-md flex items-center gap-4 hover:border-sac-orange/30 transition-colors">
          <div className="w-12 h-12 rounded-2xl bg-cyan-950/80 border border-sac-orange/30 flex items-center justify-center text-sac-orange shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900">
              {clubs.reduce((sum, c) => sum + (c.memberCount || 0), 0).toLocaleString('en-IN')}+
            </span>
            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
              Active Members
            </p>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white/80 border border-amber-500/20 backdrop-blur-md flex items-center gap-4 hover:border-amber-500/40 transition-colors">
          <div className="w-12 h-12 rounded-2xl bg-amber-950/80 border border-sac-blue/30 flex items-center justify-center text-sac-blue shadow-[0_0_15px_rgba(212,175,55,0.3)]">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900">
              {events.length}+
            </span>
            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
              Annual Events
            </p>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white/80 border border-amber-500/20 backdrop-blur-md flex items-center gap-4 hover:border-amber-500/40 transition-colors">
          <div className="w-12 h-12 rounded-2xl bg-amber-950/80 border border-sac-blue/30 flex items-center justify-center text-sac-blue shadow-[0_0_15px_rgba(212,175,55,0.3)]">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900">
              ₹{(events.reduce((sum, e) => sum + (e.price * e.maxCapacity), 0)).toLocaleString('en-IN')}+
            </span>
            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
              Prizes & Grants
            </p>
          </div>
        </div>
      </section>

      {/* 3. QUICK NAVIGATION TILES */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-sac-orange">
              SAC Portals
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900">
              Core Hubs & Utilities
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <Link
            href="/clubs"
            className="p-6 rounded-3xl bg-slate-50/70 border border-slate-200 hover:border-cyan-500/40 hover:shadow-[0_0_30px_rgba(6,182,212,0.2)] transition-all group space-y-3"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-sac-orange/30 flex items-center justify-center text-sac-orange group-hover:scale-110 transition-transform">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-sac-orange transition-colors">
              Clubs & Committees
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Explore technical societies, cultural guilds, athletics unions, and social cells.
            </p>
          </Link>

          <Link
            href="/team"
            className="p-6 rounded-3xl bg-slate-50/70 border border-slate-200 hover:border-cyan-500/40 hover:shadow-[0_0_30px_rgba(6,182,212,0.2)] transition-all group space-y-3"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-sac-orange/30 flex items-center justify-center text-sac-orange group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-sac-orange transition-colors">
              Meet the Board
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Discover student council coordinators first (Cyan glow) followed by faculty mentors (Gold dossier).
            </p>
          </Link>



          <Link
            href="/join"
            className="p-6 rounded-3xl bg-slate-50/70 border border-slate-200 hover:border-cyan-500/40 hover:shadow-[0_0_30px_rgba(6,182,212,0.2)] transition-all group space-y-3"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-sac-orange/30 flex items-center justify-center text-sac-orange group-hover:scale-110 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-sac-orange transition-colors">
              Join as Member
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Multi-step wizard tracking student skills, portfolio links, and prioritized club recruitment.
            </p>
          </Link>



          <Link
            href="/alumni"
            className="p-6 rounded-3xl bg-slate-50/70 border border-amber-500/20 hover:border-amber-500/40 hover:shadow-[0_0_30px_rgba(212,175,55,0.2)] transition-all group space-y-3"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-950/80 border border-sac-blue/30 flex items-center justify-center text-sac-blue group-hover:scale-110 transition-transform">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-sac-blue transition-colors">
              Alumni Wall of Fame
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Connect with alumni mentors from Google, Stripe & McKinsey, or request VIP fest passes.
            </p>
          </Link>
        </div>
      </section>

      {/* 4. UPCOMING EVENTS SHOWCASE */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-sac-orange">
              Live Registrations Open
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900">
              Upcoming Events & Competitions
            </h2>
          </div>
          <Link
            href="/events"
            className="text-xs font-bold text-sac-orange hover:text-sac-orange flex items-center gap-1 group"
          >
            <span>View All Competitions</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.slice(0, 3).map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </section>

      {/* 5. INTERACTIVE LIVE CALENDAR */}
      <section className="space-y-6">
        <CalendarView events={events} />
      </section>
    </div>
  );
}
