'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { fetchStudentCoordinators, fetchFacultyCoordinators } from '@/lib/firestoreService';
import { StudentCoordinator, FacultyCoordinator } from '@/lib/types';
import FacultyModal from '@/components/FacultyModal';
import {
  Users,
  Award,
  Sparkles,
  Linkedin,
  Github,
  Mail,
  Building2,
  Clock,
  ArrowRight,
  ShieldCheck,
  GraduationCap
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function TeamPage() {
  const [studentCoordinators, setStudentCoordinators] = useState<StudentCoordinator[]>([]);
  const [facultyCoordinators, setFacultyCoordinators] = useState<FacultyCoordinator[]>([]);
  const [selectedFaculty, setSelectedFaculty] = useState<FacultyCoordinator | null>(null);

  useEffect(() => {
    fetchStudentCoordinators().then(setStudentCoordinators);
    fetchFacultyCoordinators().then(setFacultyCoordinators);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-cyan-950/80 text-sac-orange border border-sac-orange/30 shadow-[0_0_20px_rgba(6,182,212,0.25)]">
          <Users className="w-3.5 h-3.5 text-sac-orange" />
          Governance & Leadership Directory
        </div>
        <h1 className="text-4xl sm:text-5xl font-black font-heading tracking-tight text-slate-900">
          Meet the SAC Board
        </h1>
        <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
          Driven by elected student leaders and guided by distinguished faculty mentors to champion innovation, cultural vibrancy, athletic excellence, and student welfare.
        </p>
      </div>

      {/* ============================================================ */}
      {/* SECTION 1: STUDENT COORDINATORS (PRIMARY DISPLAY - CYAN GLOW) */}
      {/* ============================================================ */}
      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-cyan-500/20">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-sac-orange">
              <Sparkles className="w-3.5 h-3.5 text-sac-orange" />
              <span>Section 1 • Primary Leadership</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900">
              Student Executive Council & Club Leads
            </h2>
          </div>
          <span className="text-xs text-sac-orange/80 font-mono bg-sac-orange/10 px-3 py-1 rounded-full border border-sac-orange/30">
            Tenure 2025 - 2026
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {studentCoordinators.map((student) => (
            <motion.div
              key={student.id}
              whileHover={{ y: -8 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="group relative flex flex-col rounded-3xl bg-slate-50/80 border border-slate-200 p-6 overflow-hidden shadow-xl hover:border-sac-orange/50 hover:shadow-md transition-all"
            >
              {/* Subtle background glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl group-hover:bg-sac-orange/10 transition-colors" />

              {/* Student Header with Avatar and Tenure */}
              <div className="flex items-start gap-4">
                <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-sac-orange/30 shrink-0 shadow-[0_0_15px_rgba(6,182,212,0.2)] group-hover:border-cyan-400 transition-colors">
                  <Image
                    src={student.avatarUrl}
                    alt={student.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="space-y-1 flex-1 min-w-0">
                  <div className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-cyan-950/80 text-sac-orange border border-sac-orange/30">
                    {student.sacTenure}
                  </div>
                  <h3 className="text-lg font-bold font-heading text-slate-900 truncate">
                    {student.name}
                  </h3>
                  <p className="text-xs font-semibold text-sac-orange truncate">
                    {student.roleTitle}
                  </p>
                </div>
              </div>

              {/* Expanding Underline Effect on Hover */}
              <div className="relative my-4 h-[2px] w-full bg-white/5 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-teal-400 to-cyan-500 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
              </div>

              {/* Metadata Details */}
              <div className="space-y-2 text-xs text-slate-600 flex-1">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span className="truncate">{student.branch}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span className="truncate text-slate-500">{student.clubAffiliation}</span>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-1.5 pt-3 pb-3 border-t border-slate-200">
                {student.badges.map((badge, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-white border border-slate-200 text-slate-600"
                  >
                    {badge}
                  </span>
                ))}
              </div>

              {/* Interactive Social Fade-in Links */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-200 text-xs">
                <span className="text-[11px] text-slate-500 font-medium">{student.academicYear}</span>
                <div className="flex items-center space-x-2">
                  {student.linkedinUrl && (
                    <a
                      href={student.linkedinUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded-lg bg-white hover:bg-cyan-950 text-slate-500 hover:text-sac-orange border border-slate-200 hover:border-cyan-500/40 transition-colors"
                      aria-label="LinkedIn"
                    >
                      <Linkedin className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {student.githubUrl && (
                    <a
                      href={student.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded-lg bg-white hover:bg-cyan-950 text-slate-500 hover:text-sac-orange border border-slate-200 hover:border-cyan-500/40 transition-colors"
                      aria-label="GitHub"
                    >
                      <Github className="w-3.5 h-3.5" />
                    </a>
                  )}
                  <a
                    href={`mailto:${student.email}`}
                    className="p-1.5 rounded-lg bg-white hover:bg-cyan-950 text-slate-500 hover:text-sac-orange border border-slate-200 hover:border-cyan-500/40 transition-colors"
                    aria-label="Email"
                  >
                    <Mail className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 2: FACULTY COORDINATORS (SECONDARY - REGAL GOLD) */}
      {/* ============================================================ */}
      <section className="space-y-8 pt-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-sac-blue/30">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-sac-blue">
              <Award className="w-3.5 h-3.5 text-sac-blue" />
              <span>Section 2 • Institutional Mentorship</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900">
              Faculty Coordinators & Patrons
            </h2>
          </div>
          <p className="text-xs text-sac-blue/80 font-medium">
            Click on any faculty card to view full office hours & advisory tenure dossier
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {facultyCoordinators.map((faculty) => (
            <div
              key={faculty.id}
              onClick={() => setSelectedFaculty(faculty)}
              className="group cursor-pointer rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border border-sac-blue/30 p-6 space-y-4 hover:border-amber-400 hover:shadow-[0_0_25px_rgba(212,175,55,0.3)] transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="relative w-24 h-24 mx-auto rounded-2xl overflow-hidden border-2 border-amber-500/40 shadow-[0_0_20px_rgba(212,175,55,0.2)] group-hover:scale-105 transition-transform">
                  <Image
                    src={faculty.avatarUrl}
                    alt={faculty.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="text-center space-y-1">
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold text-sac-blue bg-amber-950/80 border border-sac-blue/30">
                    {faculty.advisoryTenure}
                  </span>
                  <h3 className="text-base font-bold font-heading text-slate-900 group-hover:text-sac-blue transition-colors">
                    {faculty.name}
                  </h3>
                  <p className="text-xs font-medium text-sac-blue line-clamp-1">
                    {faculty.academicTitle}
                  </p>
                  <p className="text-[11px] text-slate-500 line-clamp-1">
                    {faculty.department}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 space-y-2 text-xs text-slate-600">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                  <Clock className="w-3 h-3 text-sac-blue shrink-0" />
                  <span className="truncate">{faculty.officeHours}</span>
                </div>
                <div className="w-full py-2 rounded-xl text-center text-xs font-semibold text-sac-blue bg-amber-500/10 group-hover:bg-amber-500 group-hover:text-slate-950 border border-sac-blue/30 transition-all flex items-center justify-center gap-1">
                  <span>View Mentorship Dossier</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Modal for Faculty Mentorship Dossier */}
      <FacultyModal
        faculty={selectedFaculty}
        onClose={() => setSelectedFaculty(null)}
      />
    </div>
  );
}
