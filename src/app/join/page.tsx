'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { fetchClubs, submitClubMembership } from '@/lib/firestoreService';
import { Club } from '@/lib/types';
import {
  UserPlus,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Code,
  Palette,
  Camera,
  Layers,
  Check,
  Send
} from 'lucide-react';
import confetti from 'canvas-confetti';

const SKILL_OPTIONS = [
  'Frontend (React / Next.js)',
  'Backend & APIs (Node / Python)',
  'AI / Machine Learning',
  'UI/UX & Figma Design',
  'Graphic Design & Branding',
  'Video Production & Motion Graphics',
  'Stage Logistics & Event Ops',
  'Content Writing & PR',
  'Sponsorship & Corporate Outreach',
  'Sound & Lighting Engineering',
  'Athletic Coaching & Refereeing'
];

function JoinContent() {
  const searchParams = useSearchParams();
  const preSelectedClub = searchParams.get('club');

  const [clubs, setClubs] = useState<Club[]>([]);
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [branch, setBranch] = useState('Computer Science & Eng.');
  const [academicYear, setAcademicYear] = useState(2);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [primaryClubId, setPrimaryClubId] = useState('');
  const [secondaryClubId, setSecondaryClubId] = useState('');
  const [statement, setStatement] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchClubs().then((res) => {
      setClubs(res);
      if (preSelectedClub) {
        const found = res.find((c) => c.name === preSelectedClub || c.slug === preSelectedClub);
        if (found) {
          setPrimaryClubId(found.id);
        }
      } else if (res.length > 0) {
        setPrimaryClubId(res[0].id);
      }
    });
  }, [preSelectedClub]);

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!primaryClubId || !name || !email || !rollNumber) {
      alert('Please complete all required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const primaryClub = clubs.find((c) => c.id === primaryClubId);
      const secondaryClub = clubs.find((c) => c.id === secondaryClubId);

      await submitClubMembership({
        studentName: name,
        studentEmail: email,
        rollNumber: rollNumber.toUpperCase(),
        branch,
        academicYear,
        primaryClubId,
        primaryClubName: primaryClub?.name || 'SAC Society',
        secondaryClubId: secondaryClubId || undefined,
        secondaryClubName: secondaryClub?.name || undefined,
        skillsTags: selectedSkills,
        statementOfPurpose: statement,
        portfolioUrl: portfolioUrl || undefined,
      });

      setCurrentStep(4);
      try {
        confetti({ particleCount: 100, spread: 70 });
      } catch {}
    } catch (err: any) {
      alert('Application submission failed: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-cyan-950/80 text-sac-orange border border-sac-orange/30">
          <UserPlus className="w-3.5 h-3.5 text-sac-orange" />
          Member Onboarding Wizard
        </div>
        <h1 className="text-3xl sm:text-4xl font-black font-heading text-slate-900">
          Join a SAC Society or Club
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Step into student leadership, collaborate on major fests, and build lifelong technical and artistic skills.
        </p>

        {/* Wizard Steps */}
        <div className="flex items-center justify-center gap-2 pt-2 text-xs font-bold">
          <span className={`px-3 py-1 rounded-xl ${currentStep === 1 ? 'bg-cyan-400 text-slate-950' : 'bg-white/5 text-slate-500'}`}>
            1. Profile
          </span>
          <span className="text-slate-600">&rarr;</span>
          <span className={`px-3 py-1 rounded-xl ${currentStep === 2 ? 'bg-cyan-400 text-slate-950' : 'bg-white/5 text-slate-500'}`}>
            2. Skills & Domain
          </span>
          <span className="text-slate-600">&rarr;</span>
          <span className={`px-3 py-1 rounded-xl ${currentStep === 3 ? 'bg-cyan-400 text-slate-950' : 'bg-white/5 text-slate-500'}`}>
            3. Society Choice
          </span>
        </div>
      </div>

      {/* STEP 1: PERSONAL & ACADEMIC INFO */}
      {currentStep === 1 && (
        <div className="p-6 sm:p-10 rounded-3xl bg-slate-50/80 border border-slate-200 space-y-6 shadow-2xl backdrop-blur-xl">
          <h2 className="text-lg font-bold font-heading text-slate-900">
            Step 1: Academic & Personal Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600">Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Diya Sen"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/90 border border-slate-200 text-sm text-slate-900"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600">Roll Number *</label>
              <input
                type="text"
                required
                placeholder="e.g. 24IT012"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/90 border border-slate-200 text-sm text-slate-900 font-mono uppercase"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600">University Email *</label>
              <input
                type="email"
                required
                placeholder="diya.sen@student.college.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/90 border border-slate-200 text-sm text-slate-900"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600">Department / Branch</label>
              <select
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/90 border border-slate-200 text-sm text-slate-900"
              >
                <option value="Computer Science & Eng.">Computer Science & Eng.</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Electronics & Communication">Electronics & Communication</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
                <option value="Civil Engineering">Civil Engineering</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600">Academic Year</label>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((yr) => (
                <button
                  type="button"
                  key={yr}
                  onClick={() => setAcademicYear(yr)}
                  className={`py-2 rounded-xl text-xs font-bold ${
                    academicYear === yr
                      ? 'bg-cyan-400 text-slate-950'
                      : 'bg-white/90 text-slate-600 border border-slate-200'
                  }`}
                >
                  Year {yr}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              if (!name || !email || !rollNumber) {
                alert('Please fill out all required personal fields.');
                return;
              }
              setCurrentStep(2);
            }}
            className="w-full py-3.5 rounded-xl font-bold text-xs text-slate-950 bg-gradient-to-r from-sac-orange to-sac-orange-light flex items-center justify-center gap-2 shadow-md"
          >
            <span>Proceed to Skills & Vectors</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* STEP 2: SKILLS & PORTFOLIO */}
      {currentStep === 2 && (
        <div className="p-6 sm:p-10 rounded-3xl bg-slate-50/80 border border-slate-200 space-y-6 shadow-2xl backdrop-blur-xl">
          <h2 className="text-lg font-bold font-heading text-slate-900">
            Step 2: Specialized Skills & Vectors
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Select the domain skill vectors where you would like to contribute during club recruitments:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {SKILL_OPTIONS.map((skill) => {
              const isChecked = selectedSkills.includes(skill);
              return (
                <button
                  type="button"
                  key={skill}
                  onClick={() => toggleSkill(skill)}
                  className={`p-3 rounded-2xl text-left text-xs font-medium border flex items-center justify-between transition-all ${
                    isChecked
                      ? 'bg-cyan-950/80 text-cyan-200 border-sac-orange/50 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                      : 'bg-white/60 text-slate-600 border-slate-200 hover:border-white/20'
                  }`}
                >
                  <span>{skill}</span>
                  <div
                    className={`w-4 h-4 rounded-md flex items-center justify-center border ${
                      isChecked ? 'bg-cyan-400 border-cyan-400 text-slate-950' : 'border-slate-600'
                    }`}
                  >
                    {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="space-y-1.5 pt-2">
            <label className="text-xs font-semibold text-slate-600">
              Portfolio / GitHub / LinkedIn Link (Optional)
            </label>
            <input
              type="url"
              placeholder="https://github.com/yourhandle or Figma link"
              value={portfolioUrl}
              onChange={(e) => setPortfolioUrl(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/90 border border-slate-200 text-xs text-slate-900"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="flex-1 py-3 rounded-xl text-xs font-semibold text-slate-600 bg-white/5 hover:bg-slate-200 border border-slate-200 flex items-center justify-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="flex-2 w-full py-3 rounded-xl font-bold text-xs text-slate-950 bg-gradient-to-r from-sac-orange to-sac-orange-light flex items-center justify-center gap-1.5 shadow-md"
            >
              <span>Next: Select Club Preferences</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: CLUB PREFERENCES & STATEMENT */}
      {currentStep === 3 && (
        <form
          onSubmit={handleSubmit}
          className="p-6 sm:p-10 rounded-3xl bg-slate-50/80 border border-slate-200 space-y-6 shadow-2xl backdrop-blur-xl"
        >
          <h2 className="text-lg font-bold font-heading text-slate-900">
            Step 3: Society Preferences & Statement
          </h2>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-sac-orange">Primary Preferred Society *</label>
            <select
              value={primaryClubId}
              onChange={(e) => setPrimaryClubId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white border border-white/15 text-sm text-slate-900"
            >
              {clubs.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.category})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500">Secondary Society (Optional)</label>
            <select
              value={secondaryClubId}
              onChange={(e) => setSecondaryClubId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-sm text-slate-900"
            >
              <option value="">-- None / Only Primary Preference --</option>
              {clubs
                .filter((c) => c.id !== primaryClubId)
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.category})
                  </option>
                ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600">
              Why would you like to join? (Brief Statement of Purpose)
            </label>
            <textarea
              rows={4}
              placeholder="Tell club leads about past projects, extracurricular interests, or goals..."
              value={statement}
              onChange={(e) => setStatement(e.target.value)}
              className="w-full p-4 rounded-xl bg-white/90 border border-slate-200 text-xs text-slate-900"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="flex-1 py-3 rounded-xl text-xs font-semibold text-slate-600 bg-white/5 hover:bg-slate-200 border border-slate-200 flex items-center justify-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-2 w-full py-3.5 rounded-xl font-bold text-xs text-slate-950 bg-gradient-to-r from-sac-orange to-sac-orange-light flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(6,182,212,0.4)]"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Membership Application</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* STEP 4: SUCCESS CONFIRMATION */}
      {currentStep === 4 && (
        <div className="p-8 sm:p-12 rounded-3xl bg-slate-50 border-2 border-sac-orange/50 text-center space-y-6 shadow-[0_0_50px_rgba(6,182,212,0.25)]">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-sac-orange/20 border border-cyan-400 flex items-center justify-center text-sac-orange">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black font-heading text-slate-900">
              Application Successfully Submitted!
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              Your profile and skill vectors have been logged into the SAC Candidate Database. Club leads will review applications and dispatch interview call letters to <strong className="text-sac-orange">{email}</strong>.
            </p>
          </div>

          <div className="pt-4">
            <a
              href="/"
              className="inline-flex px-6 py-3 rounded-xl font-bold text-xs text-slate-950 bg-cyan-400 hover:bg-cyan-300 shadow-lg"
            >
              Return to SAC Portal Home
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default function JoinPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-slate-500">Loading wizard...</div>}>
      <JoinContent />
    </Suspense>
  );
}
