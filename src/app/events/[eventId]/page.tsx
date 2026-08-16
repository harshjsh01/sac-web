'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { fetchEventById } from '@/lib/firestoreService';
import { Event } from '@/lib/types';
import { formatDate, formatINR } from '@/lib/utils';
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  ShieldAlert,
  Award,
  ArrowRight,
  CheckCircle2,
  Share2,
  Sparkles,
  Zap,
  Building2
} from 'lucide-react';

export default function SingleEventPage() {
  const params = useParams();
  const eventId = params?.eventId as string;
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (eventId) {
      fetchEventById(eventId).then((res) => {
        setEvent(res);
        setLoading(false);
      });
    }
  }, [eventId]);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-xl mx-auto text-center py-20 space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Event Not Found</h2>
        <p className="text-sm text-slate-500">This event listing is currently unavailable.</p>
        <Link href="/events" className="inline-block px-5 py-2.5 rounded-xl bg-cyan-400 text-slate-950 font-bold text-xs">
          Back to Events Hub
        </Link>
      </div>
    );
  }

  const remaining = Math.max(0, event.maxCapacity - event.registeredCount);
  const percentFilled = Math.min(100, Math.round((event.registeredCount / event.maxCapacity) * 100));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Event Header Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-200 shadow-2xl">
        <div className="relative w-full h-72 sm:h-96">
          <Image
            src={event.bannerUrl}
            alt={event.title}
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/20" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-cyan-950/90 text-sac-orange border border-cyan-500/40">
              {event.category}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-50/90 text-slate-600 border border-slate-200 flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-sac-orange" />
              {event.eventType} Event
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black font-heading text-slate-900">
            {event.title}
          </h1>

          <p className="text-xs sm:text-sm font-medium text-sac-orange">
            Hosted by {event.clubName}
          </p>
        </div>
      </div>

      {/* Split-Screen Visual Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Panel: Rules, Timeline, Venue Coordinates */}
        <div className="lg:col-span-2 space-y-8">
          {/* Overview Statement */}
          <div className="p-8 rounded-3xl bg-slate-50/80 border border-slate-200 space-y-4">
            <h2 className="text-xl font-bold font-heading text-slate-900">About the Event</h2>
            <p className="text-sm text-slate-600 leading-relaxed">{event.description}</p>
          </div>

          {/* Timeline Schedule */}
          {event.schedule && event.schedule.length > 0 && (
            <div className="p-8 rounded-3xl bg-slate-50/80 border border-slate-200 space-y-6">
              <h2 className="text-xl font-bold font-heading text-slate-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-sac-orange" />
                <span>Event Timeline & Schedule</span>
              </h2>

              <div className="relative pl-6 border-l-2 border-sac-orange/30 space-y-6">
                {event.schedule.map((item, idx) => (
                  <div key={idx} className="relative group">
                    <div className="absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full bg-white border-2 border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.6)]" />
                    <span className="text-xs font-mono font-bold text-sac-orange">{item.time}</span>
                    <p className="text-sm font-medium text-slate-700 mt-0.5">{item.activity}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rules & Guidelines */}
          <div className="p-8 rounded-3xl bg-slate-50/80 border border-slate-200 space-y-4">
            <h2 className="text-xl font-bold font-heading text-slate-900 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-sac-blue" />
              <span>Rules & Participation Code</span>
            </h2>

            <ul className="space-y-3">
              {event.rules.map((rule, idx) => (
                <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-600">
                  <span className="w-5 h-5 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-[10px] font-mono text-sac-orange shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Judging Criteria */}
          {event.judgingCriteria && (
            <div className="p-8 rounded-3xl bg-slate-50/80 border border-slate-200 space-y-4">
              <h2 className="text-xl font-bold font-heading text-slate-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-sac-blue" />
                <span>Judging & Evaluation Rubric</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {event.judgingCriteria.map((criterion, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-white/70 border border-amber-500/20 text-xs font-semibold text-slate-700 flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4 text-sac-blue shrink-0" />
                    <span>{criterion}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Panel: Registration Gate, Pricing & Ticket Status */}
        <div className="space-y-6">
          <div className="sticky top-28 p-6 sm:p-8 rounded-3xl bg-slate-50/90 border border-sac-orange/30 shadow-[0_0_40px_rgba(6,182,212,0.15)] space-y-6 backdrop-blur-xl">
            {/* Price & Format */}
            <div className="flex items-center justify-between pb-6 border-b border-slate-200">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Registration Fee
                </span>
                <div className="text-3xl font-black font-mono text-slate-900">
                  {formatINR(event.price)}
                </div>
              </div>
              <span className="px-3 py-1 rounded-xl text-xs font-bold bg-cyan-950 text-sac-orange border border-sac-orange/30">
                {event.eventType === 'Team' ? 'Per Team' : 'Per Attendee'}
              </span>
            </div>

            {/* Quick Meta List */}
            <div className="space-y-3 text-xs text-slate-600">
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/60 border border-slate-200">
                <Calendar className="w-4 h-4 text-sac-orange shrink-0" />
                <div>
                  <p className="text-[10px] text-slate-500 font-semibold uppercase">Date & Time</p>
                  <p className="font-medium text-slate-900">{formatDate(event.eventDate)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/60 border border-slate-200">
                <MapPin className="w-4 h-4 text-sac-blue shrink-0" />
                <div>
                  <p className="text-[10px] text-slate-500 font-semibold uppercase">Venue</p>
                  <p className="font-medium text-slate-900">{event.venue}</p>
                </div>
              </div>

              {event.eventType === 'Team' && (
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/60 border border-slate-200">
                  <Users className="w-4 h-4 text-sac-orange shrink-0" />
                  <div>
                    <p className="text-[10px] text-slate-500 font-semibold uppercase">Team Size</p>
                    <p className="font-medium text-slate-900">
                      {event.minTeamSize || 2} to {event.maxTeamSize || 4} Members
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Capacity Progress */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="text-slate-500">Pass Availability</span>
                <span className="text-sac-orange font-semibold">
                  {remaining > 0 ? `${remaining} slots left` : 'Sold Out'}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-sac-orange to-sac-orange-light rounded-full transition-all duration-500"
                  style={{ width: `${percentFilled}%` }}
                />
              </div>
            </div>

            {/* Registration CTA */}
            <Link
              href={`/events/register?eventId=${event.id}`}
              className="w-full py-4 px-6 rounded-2xl font-bold text-sm text-slate-950 bg-gradient-to-r from-sac-orange to-sac-orange-light shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:shadow-[0_0_35px_rgba(6,182,212,0.6)] transition-all flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4 fill-slate-950" />
              <span>Proceed to Registration & Payment</span>
              <ArrowRight className="w-4 h-4" />
            </Link>


          </div>
        </div>
      </div>
    </div>
  );
}
