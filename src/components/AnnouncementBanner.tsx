'use client';

import React, { useEffect, useState } from 'react';
import { fetchAnnouncements } from '@/lib/firestoreService';
import { Announcement } from '@/lib/types';
import { Bell, Sparkles, AlertCircle, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function AnnouncementBanner() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    fetchAnnouncements().then(setAnnouncements);
  }, []);

  if (announcements.length === 0) return null;

  // Duplicate items to make an infinite seamless loop
  const displayItems = [...announcements, ...announcements, ...announcements];

  return (
    <div className="relative w-full bg-gradient-to-r from-sac-dark via-slate-900 to-sac-dark border-b border-cyan-500/20 py-2.5 overflow-hidden z-40">
      {/* Left indicator badge */}
      <div className="absolute left-0 top-0 bottom-0 z-10 flex items-center px-4 bg-gradient-to-r from-sac-dark via-slate-900 to-transparent pr-8">
        <span className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-sac-orange bg-cyan-950/80 border border-sac-orange/30 rounded-full shadow-[0_0_12px_rgba(6,182,212,0.35)]">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping inline-block" />
          Live SAC Ticker
        </span>
      </div>

      {/* Infinite scrolling marquee */}
      <div className="flex animate-marquee items-center space-x-12 pl-40">
        {displayItems.map((item, index) => (
          <div key={`${item.id}-${index}`} className="flex items-center space-x-3 shrink-0">
            {item.category === 'Achievement' && (
              <span className="flex items-center gap-1 text-sac-blue text-xs font-medium px-2 py-0.5 rounded bg-amber-950/60 border border-sac-blue/30">
                <Sparkles className="w-3 h-3 text-sac-blue" /> Milestone
              </span>
            )}
            {item.category === 'Urgent' && (
              <span className="flex items-center gap-1 text-rose-400 text-xs font-medium px-2 py-0.5 rounded bg-rose-950/60 border border-rose-500/30">
                <AlertCircle className="w-3 h-3 text-rose-400" /> Deadline
              </span>
            )}
            {item.category === 'Reminder' && (
              <span className="flex items-center gap-1 text-sac-orange text-xs font-medium px-2 py-0.5 rounded bg-sac-orange/10 border border-sac-orange/30">
                <Calendar className="w-3 h-3 text-sac-orange" /> Notice
              </span>
            )}
            <span className="text-sm font-medium text-slate-700 hover:text-sac-orange transition-colors">
              {item.tickerText}
            </span>
            <span className="text-slate-600 font-bold">•</span>
          </div>
        ))}
      </div>
    </div>
  );
}
