'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { fetchClubBySlug, fetchEvents } from '@/lib/firestoreService';
import { Club, Event } from '@/lib/types';
import EventCard from '@/components/EventCard';
import {
  Layers,
  Users,
  ChevronDown,
  Sparkles,
  Shield,
  FileCode,
  Calendar,
  ArrowRight,
  Mail,
  Linkedin,
  Github,
  HelpCircle,
  Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ClubWorkspacePage() {
  const params = useParams();
  const slug = params?.clubId as string;
  const [club, setClub] = useState<Club | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchClubBySlug(slug).then((res) => {
        setClub(res);
        setLoading(false);
      });
      fetchEvents().then(setEvents);
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!club) {
    return (
      <div className="max-w-xl mx-auto text-center py-20 space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Club Workspace Not Found</h2>
        <p className="text-sm text-slate-500">The requested club profile does not exist or has moved.</p>
        <Link href="/clubs" className="inline-block px-5 py-2.5 rounded-xl bg-cyan-400 text-slate-950 font-bold text-xs">
          Back to Clubs Directory
        </Link>
      </div>
    );
  }

  const clubEvents = events.filter((e) => e.clubId === club.id || e.clubName === club.name);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      {/* Club Banner Header */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-200 shadow-2xl">
        <div className="relative w-full h-64 sm:h-80">
          <Image
            src={club.bannerUrl}
            alt={club.name}
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/30" />
        </div>

        <div className="relative -mt-20 p-6 sm:p-10 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden border-4 border-slate-950 shadow-2xl bg-slate-50 shrink-0">
              <Image
                src={club.logoUrl}
                alt={club.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-cyan-950/90 text-sac-orange border border-cyan-500/40">
                  {club.category} Society
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-50/90 text-slate-600 border border-slate-200 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-sac-orange" />
                  {club.memberCount} Members
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black font-heading text-slate-900">
                {club.name}
              </h1>
              <p className="text-sm font-medium text-sac-orange/90">{club.tagline}</p>
            </div>
          </div>

          <Link
            href={`/join?club=${encodeURIComponent(club.name)}`}
            className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs text-slate-950 bg-gradient-to-r from-sac-orange to-sac-orange-light shadow-md hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] transition-all flex items-center justify-center gap-2 shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            <span>Apply to Join Society</span>
          </Link>
        </div>
      </div>

      {/* Main Grid: Description & Charter Rules */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Col: Overview & Achievements */}
        <div className="lg:col-span-2 space-y-8">
          <div className="p-8 rounded-3xl bg-slate-50/80 border border-slate-200 space-y-4">
            <h2 className="text-xl font-bold font-heading text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-sac-orange" />
              <span>Society Mission & Overview</span>
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              {club.description}
            </p>

            {club.achievements && (
              <div className="pt-4 border-t border-slate-200 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-sac-blue flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-sac-blue" /> Key Milestones
                </h3>
                <ul className="space-y-2">
                  {club.achievements.map((ach, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-slate-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                      <span>{ach}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* FAQ Accordions with Framer Motion */}
          <div className="p-8 rounded-3xl bg-slate-50/80 border border-slate-200 space-y-6">
            <h2 className="text-xl font-bold font-heading text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-sac-orange" />
              <span>Recruitment & Membership FAQs</span>
            </h2>

            <div className="space-y-3">
              {club.faqs.map((faq, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div
                    key={index}
                    className="rounded-2xl bg-white/60 border border-slate-200 overflow-hidden transition-colors"
                  >
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                      className="w-full p-4 text-left flex items-center justify-between gap-4 focus:outline-none"
                    >
                      <span className="text-xs sm:text-sm font-semibold text-slate-900">
                        {faq.question}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-sac-orange shrink-0 transition-transform duration-200 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-4 pt-1 text-xs text-slate-500 leading-relaxed border-t border-slate-200">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Col: Club Charter & Rules Code Block */}
        <div className="space-y-8">
          <div className="p-6 rounded-3xl bg-white border border-sac-orange/30 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-sac-orange" />
                <span className="text-xs font-mono font-bold text-sac-orange">
                  club-charter.config
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-500">v2.0-LOCKED</span>
            </div>

            <div className="space-y-2.5 font-mono text-xs text-slate-600">
              <p className="text-slate-500">// SAC Constitution Bylaws & Code of Conduct</p>
              {club.charterRules.map((rule, idx) => (
                <div key={idx} className="flex items-start gap-2 py-1 border-b border-slate-200">
                  <span className="text-sac-orange shrink-0">{`0${idx + 1}.`}</span>
                  <span className="text-[11px] leading-relaxed">{rule}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Meet the Leads Mini Grid */}
          <div className="p-6 rounded-3xl bg-slate-50/80 border border-slate-200 space-y-4">
            <h3 className="text-sm font-bold font-heading text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-4 h-4 text-sac-orange" /> Club Executive Leads
            </h3>

            <div className="space-y-3">
              {club.leads.map((lead, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-white/70 border border-slate-200 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-slate-200 shrink-0">
                      <Image
                        src={lead.avatar}
                        alt={lead.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{lead.name}</h4>
                      <p className="text-[10px] font-medium text-sac-orange">{lead.role}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {lead.linkedin && (
                      <a
                        href={lead.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1 rounded-lg text-slate-500 hover:text-sac-orange hover:bg-slate-100"
                        aria-label="LinkedIn"
                      >
                        <Linkedin className="w-3.5 h-3.5" />
                      </a>
                    )}
                    <a
                      href={`mailto:${lead.email}`}
                      className="p-1 rounded-lg text-slate-500 hover:text-sac-orange hover:bg-slate-100"
                      aria-label="Email"
                    >
                      <Mail className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Hosted Events by this Club */}
      {clubEvents.length > 0 && (
        <section className="space-y-6 pt-6 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold font-heading text-slate-900">
              Upcoming Events by {club.name}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clubEvents.map((evt) => (
              <EventCard key={evt.id} event={evt} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
