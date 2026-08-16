'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Event } from '@/lib/types';
import { formatDate, formatINR } from '@/lib/utils';
import { Calendar, MapPin, Users, Ticket, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  const percentageFilled = Math.min(100, Math.round((event.registeredCount / event.maxCapacity) * 100));
  const remaining = Math.max(0, event.maxCapacity - event.registeredCount);

  const getCategoryStyles = (category: string) => {
    switch (category) {
      case 'Technical':
        return 'text-sac-orange bg-cyan-950/80 border-sac-orange/30 shadow-[0_0_10px_rgba(6,182,212,0.3)]';
      case 'Cultural':
        return 'text-fuchsia-400 bg-fuchsia-950/80 border-fuchsia-500/30 shadow-[0_0_10px_rgba(217,70,239,0.3)]';
      case 'Sports':
        return 'text-sac-blue bg-amber-950/80 border-sac-blue/30 shadow-[0_0_10px_rgba(245,158,11,0.3)]';
      case 'Social':
        return 'text-emerald-400 bg-emerald-950/80 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.3)]';
      default:
        return 'text-slate-500 bg-slate-50 border-slate-200';
    }
  };

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="group relative flex flex-col rounded-3xl bg-slate-50/80 border border-slate-200 overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.5)] hover:border-cyan-500/40 hover:shadow-[0_0_30px_rgba(6,182,212,0.2)] transition-all"
    >
      {/* Banner Media */}
      <div className="relative w-full h-52 overflow-hidden">
        <Image
          src={event.bannerUrl}
          alt={event.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

        {/* Category & Style Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border backdrop-blur-md ${getCategoryStyles(
              event.category
            )}`}
          >
            {event.category}
          </span>
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/90 backdrop-blur-md border border-white/15 text-slate-700 flex items-center gap-1">
            <Users className="w-3 h-3 text-sac-orange" />
            {event.eventType}
          </span>
        </div>

        {/* Price Tag Badge */}
        <div className="absolute bottom-3 right-3">
          <span
            className={`px-3 py-1 rounded-xl text-xs font-extrabold font-mono shadow-md ${
              event.price === 0
                ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/30'
                : 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-amber-500/30'
            }`}
          >
            {formatINR(event.price)}
          </span>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-6 flex flex-col justify-between space-y-4">
        <div className="space-y-2.5">
          <span className="text-xs font-semibold text-sac-orange/90 tracking-wide uppercase">
            {event.clubName}
          </span>
          <h3 className="text-lg font-bold font-heading text-slate-900 group-hover:text-sac-orange transition-colors line-clamp-1">
            {event.title}
          </h3>
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {event.shortDescription}
          </p>
        </div>

        {/* Venue & Date */}
        <div className="space-y-1.5 pt-2 border-t border-slate-200 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-sac-orange shrink-0" />
            <span>{formatDate(event.eventDate)}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-sac-blue shrink-0" />
            <span className="truncate">{event.venue}</span>
          </div>
        </div>

        {/* Capacity Meter */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-[11px] font-medium text-slate-500">
            <span>Capacity</span>
            <span className="text-slate-600">
              {remaining > 0 ? `${remaining} slots remaining` : 'Sold Out'}
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                percentageFilled > 85 ? 'bg-rose-500' : 'bg-gradient-to-r from-cyan-400 to-teal-400'
              }`}
              style={{ width: `${percentageFilled}%` }}
            />
          </div>
        </div>

        {/* Action Button */}
        <Link
          href={`/events/${event.id}`}
          className="mt-2 w-full py-2.5 px-4 rounded-xl text-xs font-bold text-center text-slate-900 bg-white/5 hover:bg-sac-orange/20 border border-slate-200 hover:border-cyan-500/40 transition-all flex items-center justify-center gap-1.5 group-hover:bg-cyan-500 group-hover:text-slate-950"
        >
          <span>View Details & Register</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
}
