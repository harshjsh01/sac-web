'use client';

import React, { useState } from 'react';
import { submitGrievance } from '@/lib/firestoreService';
import {
  Mail,
  Shield,
  ShieldCheck,
  Send,
  CheckCircle2,
  MapPin,
  Phone,
  EyeOff,
  AlertTriangle,
  HeartHandshake
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ContactGrievancesPage() {
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [category, setCategory] = useState<'Infrastructure' | 'Event Management' | 'Harassment / Safety' | 'General Query'>('General Query');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [studentRollNumber, setStudentRollNumber] = useState('');

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !message) {
      alert('Please fill out the subject and message description.');
      return;
    }

    setIsSubmitting(true);
    try {
      await submitGrievance({
        category,
        subject,
        message,
        isAnonymous,
        studentName: isAnonymous ? undefined : studentName,
        studentEmail: isAnonymous ? undefined : studentEmail,
        studentRollNumber: isAnonymous ? undefined : studentRollNumber,
      });

      setIsSubmitted(true);
      try {
        confetti({ particleCount: 70, spread: 60 });
      } catch {}
    } catch (err: any) {
      alert('Failed to submit grievance: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-950/80 text-rose-300 border border-rose-500/30 shadow-[0_0_20px_rgba(244,63,94,0.25)]">
          <Shield className="w-3.5 h-3.5 text-rose-400" />
          Student Welfare & Helpdesk
        </div>
        <h1 className="text-4xl sm:text-5xl font-black font-heading tracking-tight text-slate-900">
          Support & Grievances Desk
        </h1>
        <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
          Submit official queries, event feedback, or report safety concerns with our optional end-to-end Anonymous Privacy Shield.
        </p>
      </div>

      {/* Centered Form */}
      <div className="max-w-2xl mx-auto space-y-6">
          {isSubmitted ? (
            <div className="p-8 sm:p-12 rounded-3xl bg-slate-50 border border-cyan-500/40 text-center space-y-4 shadow-2xl">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-400 mx-auto flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold font-heading text-slate-900">
                Grievance / Feedback Received
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
                {isAnonymous
                  ? 'Your submission has been filed completely anonymously with all identification parameters zeroed out. The SAC Dean office has received your report.'
                  : 'Your query has been logged with your student credentials. A representative will contact you via your university email.'}
              </p>
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setSubject('');
                  setMessage('');
                }}
                className="mt-2 px-5 py-2.5 rounded-xl font-bold text-xs text-slate-950 bg-cyan-400 hover:bg-cyan-300"
              >
                Submit Another Inquiry
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="p-6 sm:p-10 rounded-3xl bg-slate-50/80 border border-slate-200 space-y-6 shadow-2xl backdrop-blur-xl"
            >
              {/* Anonymous Toggle Pill */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-950 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                    <EyeOff className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Anonymous Privacy Shield</h4>
                    <p className="text-[11px] text-slate-500">
                      Zeroes out name, roll number, and email before saving.
                    </p>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-100 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500" />
                </label>
              </div>

              {/* Category */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600">Category of Grievance</label>
                <select
                  value={category}
                  onChange={(e: any) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-900"
                >
                  <option value="General Query">General Query & Feedback</option>
                  <option value="Event Management">Event Management & Registrations</option>
                  <option value="Infrastructure">SAC Infrastructure & Lab Facilities</option>
                  <option value="Harassment / Safety">Harassment, Ragging or Safety Concern</option>
                </select>
              </div>

              {/* Student fields (only if not anonymous) */}
              {!isAnonymous && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-500">Full Name</label>
                    <input
                      type="text"
                      placeholder="Your Name"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-500">Roll Number</label>
                    <input
                      type="text"
                      placeholder="e.g. 23CS010"
                      value={studentRollNumber}
                      onChange={(e) => setStudentRollNumber(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 uppercase font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-500">Email Address</label>
                    <input
                      type="email"
                      placeholder="you@college.edu"
                      value={studentEmail}
                      onChange={(e) => setStudentEmail(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900"
                    />
                  </div>
                </div>
              )}

              {/* Subject */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600">Subject / Headline *</label>
                <input
                  type="text"
                  required
                  placeholder="Summary of issue or query"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-900"
                />
              </div>

              {/* Message */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600">Detailed Message *</label>
                <textarea
                  required
                  rows={5}
                  placeholder="Provide complete context, relevant dates, clubs involved, or requested remedies..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-4 rounded-xl bg-white border border-slate-200 text-xs text-slate-900"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl font-bold text-xs text-slate-950 bg-gradient-to-r from-sac-orange to-sac-orange-light shadow-md flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Grievance Dossier</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>


        </div>
      </div>
    </div>
  );
}
