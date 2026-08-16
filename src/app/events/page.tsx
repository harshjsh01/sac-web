'use client';

import React, { useEffect, useState } from 'react';
import { fetchEvents } from '@/lib/firestoreService';
import { Event } from '@/lib/types';
import EventCard from '@/components/EventCard';
import {
  Calendar,
  Search,
  Filter,
  Users,
  Sparkles,
  DollarSign,
  Tag
} from 'lucide-react';

export default function EventsHubPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [priceFilter, setPriceFilter] = useState<string>('All');
  const [styleFilter, setStyleFilter] = useState<string>('All');

  useEffect(() => {
    fetchEvents().then(setEvents);
  }, []);

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.clubName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      categoryFilter === 'All' || event.category === categoryFilter;

    const matchesPrice =
      priceFilter === 'All' ||
      (priceFilter === 'Free' && event.price === 0) ||
      (priceFilter === 'Paid' && event.price > 0);

    const matchesStyle =
      styleFilter === 'All' || event.eventType === styleFilter;

    return matchesSearch && matchesCategory && matchesPrice && matchesStyle;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-cyan-950/80 text-sac-orange border border-sac-orange/30 shadow-[0_0_20px_rgba(6,182,212,0.25)]">
          <Calendar className="w-3.5 h-3.5 text-sac-orange" />
          Unified Events & Fest Hub
        </div>
        <h1 className="text-4xl sm:text-5xl font-black font-heading tracking-tight text-slate-900">
          Explore Campus Competitions
        </h1>
        <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
          Search, filter, and register for 36-hour hackathons, cultural battles, athletic championships, and community drives.
        </p>
      </div>

      {/* Advanced Control Center / Filters */}
      <div className="p-6 rounded-3xl bg-slate-50/80 border border-slate-200 shadow-2xl backdrop-blur-xl space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input
            type="text"
            placeholder="Search by event title, host club, or keywords (e.g. Hackathon, AI, Music, Football)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/90 border border-slate-200 text-sm text-slate-900 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>

        {/* Filter Pill Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          {/* Category Filter */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-sac-orange" /> Club Category
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/90 border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:border-cyan-500"
            >
              <option value="All">All Categories</option>
              <option value="Technical">Technical Societies</option>
              <option value="Cultural">Cultural & Arts</option>
              <option value="Sports">Sports & Athletics</option>
              <option value="Social">Social Impact</option>
            </select>
          </div>

          {/* Pricing Filter */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5 text-sac-blue" /> Entry Fee
            </label>
            <select
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/90 border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:border-cyan-500"
            >
              <option value="All">All Prices (Free & Paid)</option>
              <option value="Free">Free Events</option>
              <option value="Paid">Paid / Premium Pass</option>
            </select>
          </div>

          {/* Style Filter */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-sac-orange" /> Participation Style
            </label>
            <select
              value={styleFilter}
              onChange={(e) => setStyleFilter(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/90 border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:border-cyan-500"
            >
              <option value="All">All Formats</option>
              <option value="Solo">Solo Individual</option>
              <option value="Team">Team Collaboration</option>
            </select>
          </div>
        </div>
      </div>

      {/* Events Results Grid */}
      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center rounded-3xl bg-white/80 border border-slate-200 space-y-3">
          <p className="text-base font-semibold text-slate-900">No events match your selected filters</p>
          <p className="text-xs text-slate-500">Try adjusting your search keywords or resetting filters.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setCategoryFilter('All');
              setPriceFilter('All');
              setStyleFilter('All');
            }}
            className="px-4 py-2 rounded-xl bg-white/10 text-xs font-semibold text-slate-900 hover:bg-white/15"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
