'use client';

import React from 'react';
import { FacultyCoordinator } from '@/lib/types';
import { X, Building2, Clock, Mail, Phone, Award, Sparkles, BookOpen } from 'lucide-react';
import Image from 'next/image';

interface FacultyModalProps {
  faculty: FacultyCoordinator | null;
  onClose: () => void;
}

export default function FacultyModal({ faculty, onClose }: FacultyModalProps) {
  if (!faculty) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/90 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-slate-50 border border-sac-blue/30 rounded-2xl shadow-[0_0_50px_rgba(212,175,55,0.2)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Gold Accent */}
        <div className="relative px-6 py-5 bg-gradient-to-r from-amber-950/60 via-slate-900 to-slate-900 border-b border-amber-500/20 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sac-blue font-semibold text-sm">
            <Award className="w-4 h-4 text-sac-blue" />
            <span>Faculty Advisory & Mentorship Dossier</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 bg-white/5 hover:bg-slate-200 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-2 border-amber-500/40 shrink-0 shadow-[0_0_20px_rgba(212,175,55,0.25)]">
              <Image
                src={faculty.avatarUrl}
                alt={faculty.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="space-y-1.5 flex-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-sac-blue border border-sac-blue/30">
                <Sparkles className="w-3 h-3 text-sac-blue" />
                {faculty.advisoryTenure}
              </div>
              <h3 className="text-2xl font-bold font-heading text-slate-900">{faculty.name}</h3>
              <p className="text-sm font-medium text-sac-blue">{faculty.academicTitle}</p>
              <p className="text-xs text-slate-500">{faculty.department}</p>
            </div>
          </div>

          {/* Quick info grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-white/60 border border-slate-200 space-y-1">
              <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                <Building2 className="w-3.5 h-3.5 text-sac-blue" />
                <span>Office Location</span>
              </div>
              <p className="text-xs font-medium text-slate-700">{faculty.officeLocation}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-white/60 border border-slate-200 space-y-1">
              <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                <Clock className="w-3.5 h-3.5 text-sac-blue" />
                <span>Office Consultation Hours</span>
              </div>
              <p className="text-xs font-medium text-slate-700">{faculty.officeHours}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-white/60 border border-slate-200 space-y-1">
              <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                <Mail className="w-3.5 h-3.5 text-sac-blue" />
                <span>University Email</span>
              </div>
              <a
                href={`mailto:${faculty.email}`}
                className="text-xs font-mono text-sac-orange hover:underline"
              >
                {faculty.email}
              </a>
            </div>

            <div className="p-3.5 rounded-xl bg-white/60 border border-slate-200 space-y-1">
              <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                <BookOpen className="w-3.5 h-3.5 text-sac-blue" />
                <span>Research Specialization</span>
              </div>
              <p className="text-xs text-slate-600 line-clamp-1">{faculty.specialization}</p>
            </div>
          </div>

          {/* Bio statement */}
          <div className="p-4 rounded-xl bg-white/90 border border-amber-500/20 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-sac-blue">
              Advisory Role & Profile
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{faculty.bio}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-white/90 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-white/5 hover:bg-slate-200 border border-slate-200 transition-colors"
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
}
