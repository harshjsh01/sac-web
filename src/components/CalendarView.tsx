'use client';

import React, { useState } from 'react';
import { Event } from '@/lib/types';
import { formatDate, formatINR } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, X, MapPin, Users, ArrowRight, Clock } from 'lucide-react';
import Link from 'next/link';

interface CalendarViewProps {
  events: Event[];
}

export default function CalendarView({ events }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 8, 1)); // September 2026 as per mock events
  const [selectedDayEvents, setSelectedDayEvents] = useState<Event[] | null>(null);
  const [selectedDateString, setSelectedDateString] = useState<string>('');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Helper to find events for a specific day
  const getEventsForDay = (day: number) => {
    const targetDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(e => {
      const eDate = e.eventDate.split('T')[0];
      return eDate === targetDateStr;
    });
  };

  const handleDayClick = (day: number) => {
    const dayEvents = getEventsForDay(day);
    if (dayEvents.length > 0) {
      setSelectedDayEvents(dayEvents);
      setSelectedDateString(`${monthNames[month]} ${day}, ${year}`);
    }
  };

  return (
    <div className="relative w-full rounded-3xl bg-slate-50/80 border border-slate-200 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
      {/* Calendar Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-sac-orange">
            Interactive Campus Schedule
          </span>
          <h3 className="text-2xl font-bold font-heading text-slate-900 flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-sac-orange" />
            {monthNames[month]} {year}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevMonth}
            className="p-2 rounded-xl bg-white/5 hover:bg-slate-200 text-slate-600 border border-slate-200 transition-colors"
            aria-label="Previous month"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setCurrentDate(new Date(2026, 8, 1))}
            className="px-3 py-1.5 rounded-xl bg-sac-orange/10 text-sac-orange text-xs font-semibold border border-sac-orange/30 hover:bg-cyan-900/50 transition-colors"
          >
            Current Term
          </button>
          <button
            onClick={handleNextMonth}
            className="p-2 rounded-xl bg-white/5 hover:bg-slate-200 text-slate-600 border border-slate-200 transition-colors"
            aria-label="Next month"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Weekday Labels */}
      <div className="grid grid-cols-7 gap-2 text-center py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
        {daysOfWeek.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-2">
        {/* Empty cells before month start */}
        {Array.from({ length: firstDayIndex }).map((_, i) => (
          <div key={`empty-${i}`} className="h-20 sm:h-24 rounded-2xl bg-white/30 border border-transparent opacity-30" />
        ))}

        {/* Month days */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dayEvents = getEventsForDay(day);
          const hasEvents = dayEvents.length > 0;

          return (
            <div
              key={`day-${day}`}
              onClick={() => handleDayClick(day)}
              className={`h-20 sm:h-24 p-2 rounded-2xl border transition-all relative flex flex-col justify-between ${
                hasEvents
                  ? 'bg-cyan-950/30 border-cyan-500/40 hover:scale-105 hover:bg-cyan-900/40 hover:shadow-[0_0_20px_rgba(6,182,212,0.35)] cursor-pointer group'
                  : 'bg-white/50 border-slate-200 hover:border-slate-200'
              }`}
            >
              <span
                className={`text-xs font-semibold ${
                  hasEvents ? 'text-sac-orange font-bold' : 'text-slate-500'
                }`}
              >
                {day}
              </span>

              {hasEvents && (
                <div className="space-y-1">
                  {dayEvents.map((evt) => (
                    <div
                      key={evt.id}
                      className="px-1.5 py-0.5 rounded text-[10px] font-medium truncate bg-sac-orange/20 text-cyan-200 border border-cyan-400/30"
                      title={evt.title}
                    >
                      {evt.title}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Slide-Over Event Drawer Modal */}
      {selectedDayEvents && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/90 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-slate-50 border border-cyan-500/40 rounded-3xl shadow-[0_0_50px_rgba(6,182,212,0.25)] p-6 space-y-6 overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-sac-orange">
                  Day Schedule
                </span>
                <h4 className="text-xl font-bold font-heading text-slate-900">
                  {selectedDateString}
                </h4>
              </div>
              <button
                onClick={() => setSelectedDayEvents(null)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 bg-white/5 hover:bg-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
              {selectedDayEvents.map((event) => (
                <div
                  key={event.id}
                  className="p-4 rounded-2xl bg-white/90 border border-slate-200 space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[11px] font-semibold uppercase text-sac-orange">
                        {event.clubName}
                      </span>
                      <h5 className="text-base font-bold text-slate-900">{event.title}</h5>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold font-mono bg-amber-400 text-slate-950">
                      {formatINR(event.price)}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {event.shortDescription}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-slate-500 pt-1 border-t border-slate-200">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-sac-blue" />
                      {event.venue}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-sac-orange" />
                      {event.eventType}
                    </span>
                  </div>

                  <Link
                    href={`/events/${event.id}`}
                    onClick={() => setSelectedDayEvents(null)}
                    className="w-full py-2 px-4 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-sac-orange to-sac-orange-light flex items-center justify-center gap-1.5 hover:opacity-90 transition-opacity"
                  >
                    <span>Proceed to Event Details & Registration</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
