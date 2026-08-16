'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { fetchAlumni } from '@/lib/firestoreService';
import { Alumni } from '@/lib/types';
import {
  Award,
  Sparkles,
  Building2,
  Linkedin,
  Search,
  CheckCircle2,
  Mail,
  Send,
  Ticket,
  Heart,
  ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function AlumniPage() {
  const [alumniList, setAlumniList] = useState<Alumni[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [mentorshipModalAlumni, setMentorshipModalAlumni] = useState<Alumni | null>(null);
  const [mentorshipNote, setMentorshipNote] = useState('');
  const [mentorshipSent, setMentorshipSent] = useState(false);

  // VIP Pass & Sponsor widget state
  const [vipRequested, setVipRequested] = useState(false);

  useEffect(() => {
    fetchAlumni().then(setAlumniList);
  }, []);

  const hallOfFame = alumniList.filter((a) => a.isHallOfFame);
  const filteredMentors = alumniList.filter((a) => {
    const q = searchQuery.toLowerCase();
    return (
      a.name.toLowerCase().includes(q) ||
      a.company.toLowerCase().includes(q) ||
      a.currentRole.toLowerCase().includes(q) ||
      a.domainSkills.some((s) => s.toLowerCase().includes(q))
    );
  });

  const handleSendMentorship = (e: React.FormEvent) => {
    e.preventDefault();
    setMentorshipSent(true);
    try {
      confetti({ particleCount: 70, spread: 60 });
    } catch {}
    setTimeout(() => {
      setMentorshipModalAlumni(null);
      setMentorshipSent(false);
      setMentorshipNote('');
    }, 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-950/80 text-sac-blue border border-sac-blue/30 shadow-[0_0_20px_rgba(212,175,55,0.25)]">
          <Award className="w-3.5 h-3.5 text-sac-blue" />
          Legacy & Mentorship Desk
        </div>
        <h1 className="text-4xl sm:text-5xl font-black font-heading tracking-tight text-slate-900">
          Alumni Wall of Fame
        </h1>
        <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
          Celebrating trailblazing former presidents, founders, and industry engineers from Google, Stripe, and Y Combinator giving back to campus innovators.
        </p>
      </div>

      {/* 1. HALL OF FAME SHOWCASE */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-sac-blue pb-2 border-b border-sac-blue/30">
          <Sparkles className="w-4 h-4 text-sac-blue" />
          <span>Distinguished Hall of Fame Inductees</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {hallOfFame.map((alumnus) => (
            <div
              key={alumnus.id}
              className="p-6 rounded-3xl bg-gradient-to-b from-amber-950/40 via-slate-900 to-slate-950 border border-sac-blue/30 shadow-[0_0_30px_rgba(212,175,55,0.15)] flex flex-col justify-between space-y-5 hover:border-amber-400 transition-all group"
            >
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-amber-500/40 shrink-0 group-hover:scale-105 transition-transform shadow-lg">
                    <Image
                      src={alumnus.avatarUrl}
                      alt={alumnus.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="space-y-0.5 min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-sac-blue">
                      Class of {alumnus.graduatingYear}
                    </span>
                    <h3 className="text-base font-bold font-heading text-slate-900 truncate">
                      {alumnus.name}
                    </h3>
                    <p className="text-xs font-medium text-slate-600 truncate">
                      {alumnus.currentRole}
                    </p>
                    <p className="text-xs font-semibold text-sac-blue/90 truncate">
                      {alumnus.company}
                    </p>
                  </div>
                </div>

                {alumnus.quote && (
                  <p className="text-xs italic text-slate-500 leading-relaxed p-3 rounded-xl bg-white/60 border border-slate-200">
                    &ldquo;{alumnus.quote}&rdquo;
                  </p>
                )}

                <div className="flex flex-wrap gap-1">
                  {alumnus.domainSkills.map((sk, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md text-[10px] bg-white border border-slate-200 text-slate-600"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                <span className="text-[10px] text-slate-500 font-mono">
                  {alumnus.pastSacRole}
                </span>
                <button
                  onClick={() => setMentorshipModalAlumni(alumnus)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 transition-colors"
                >
                  Request Mentorship
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. SEARCHABLE MENTOR DIRECTORY */}
      <section className="space-y-6 pt-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold font-heading text-slate-900">
              Alumni Mentorship Registry
            </h2>
            <p className="text-xs text-slate-500">
              Connect with senior alumni for resume teardowns, mock interviews, and project advice.
            </p>
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search by company, role, or skill..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-md">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-white/90 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <tr>
                <th className="p-4">Alumnus</th>
                <th className="p-4">Current Organization</th>
                <th className="p-4">Past SAC Role</th>
                <th className="p-4">Domain Skills</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredMentors.map((m) => (
                <tr key={m.id} className="hover:bg-slate-100 transition-colors">
                  <td className="p-4 font-semibold text-slate-900 flex items-center gap-3">
                    <div className="relative w-8 h-8 rounded-full overflow-hidden border border-slate-200 shrink-0">
                      <Image src={m.avatarUrl} alt={m.name} fill className="object-cover" />
                    </div>
                    <div>
                      <div>{m.name}</div>
                      <div className="text-[10px] text-slate-500">Batch of {m.graduatingYear}</div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-sac-blue">{m.company}</div>
                    <div className="text-[10px] text-slate-500">{m.currentRole}</div>
                  </td>
                  <td className="p-4 font-mono text-slate-500">{m.pastSacRole}</td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {m.domainSkills.map((s, idx) => (
                        <span
                          key={idx}
                          className="px-1.5 py-0.5 rounded bg-white text-[10px] border border-slate-200 text-slate-600"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => setMentorshipModalAlumni(m)}
                      className="px-3 py-1.5 rounded-lg text-[11px] font-bold bg-white/10 hover:bg-amber-400 hover:text-slate-950 text-slate-700 transition-colors"
                    >
                      Connect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 3. ALUMNI GIVING & VIP PASSES WIDGET */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
        <div className="p-8 rounded-3xl bg-slate-50/80 border border-slate-200 space-y-4">
          <div className="w-10 h-10 rounded-xl bg-amber-950/80 border border-sac-blue/30 flex items-center justify-center text-sac-blue">
            <Ticket className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold font-heading text-slate-900">
            Request Alumni VIP Fest Pass
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Visiting campus during the annual hackfest or cultural night? Request guaranteed backstage VIP access and reserved seating.
          </p>
          {vipRequested ? (
            <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-xs text-emerald-300 font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>VIP Pass Request Logged! Pass sent to registered alumni email.</span>
            </div>
          ) : (
            <button
              onClick={() => setVipRequested(true)}
              className="px-5 py-2.5 rounded-xl font-bold text-xs text-slate-950 bg-amber-400 hover:bg-amber-300 transition-colors"
            >
              Generate Alumni VIP Fest Pass
            </button>
          )}
        </div>

        <div className="p-8 rounded-3xl bg-slate-50/80 border border-slate-200 space-y-4">
          <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-sac-orange/30 flex items-center justify-center text-sac-orange">
            <Heart className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold font-heading text-slate-900">
            Sponsor SAC Student Innovation Projects
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Empower first-generation collegiate builders with micro-grants for hardware prototyping, cloud server credits, and tournament sponsorships.
          </p>
          <a
            href="mailto:dean.studentaffairs@college.edu?subject=Alumni%20Sponsorship%20Inquiry%20-%20SAC%20Projects"
            className="inline-block px-5 py-2.5 rounded-xl font-bold text-xs text-slate-900 bg-slate-100 hover:bg-slate-700 border border-white/15 transition-colors"
          >
            Contact SAC Patron for Giving Grants &rarr;
          </a>
        </div>
      </section>

      {/* Mentorship Request Modal */}
      {mentorshipModalAlumni && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/90 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-slate-50 border border-amber-500/40 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-sac-blue">
                  Direct Mentorship Request
                </span>
                <h3 className="text-xl font-bold font-heading text-slate-900">
                  Connect with {mentorshipModalAlumni.name}
                </h3>
                <p className="text-xs text-slate-500">
                  {mentorshipModalAlumni.currentRole} at {mentorshipModalAlumni.company}
                </p>
              </div>
              <button
                onClick={() => setMentorshipModalAlumni(null)}
                className="text-slate-500 hover:text-slate-900 text-xs"
              >
                Cancel
              </button>
            </div>

            {mentorshipSent ? (
              <div className="p-6 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <h4 className="text-base font-bold text-slate-900">Mentorship Request Dispatched!</h4>
                <p className="text-xs text-slate-600">
                  {mentorshipModalAlumni.name} has been notified via the SAC Alumni Network.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendMentorship} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">
                    What would you like mentorship on?
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Describe your question or portfolio project (e.g. System Design advice, SWE interview roadmap, etc.)..."
                    value={mentorshipNote}
                    onChange={(e) => setMentorshipNote(e.target.value)}
                    className="w-full p-3.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-900"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl font-bold text-xs text-slate-950 bg-amber-400 hover:bg-amber-300 flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Mentorship Invitation</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
