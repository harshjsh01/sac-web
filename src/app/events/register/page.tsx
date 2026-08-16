'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { fetchEventById, fetchEvents, createRegistration } from '@/lib/firestoreService';
import { Event, Registration } from '@/lib/types';
import { formatINR, generateUPIPaymentUrl, generateBookingSerial } from '@/lib/utils';
import QRCodeCanvas from '@/components/QRCodeCanvas';
import {
  CreditCard,
  QrCode,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  User,
  Mail,
  GraduationCap,
  FileCheck,
  Upload,
  Sparkles,
  Ticket,
  Printer
} from 'lucide-react';
import confetti from 'canvas-confetti';

function RegisterContent() {
  const searchParams = useSearchParams();
  const eventIdParam = searchParams.get('eventId');
  const router = useRouter();

  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [branch, setBranch] = useState('Computer Science & Eng.');
  const [academicYear, setAcademicYear] = useState<number>(3);
  const [teamName, setTeamName] = useState('');
  const [teamCode, setTeamCode] = useState('');
  const [utrNumber, setUtrNumber] = useState('');
  const [receiptFile, setReceiptFile] = useState<string | null>(null);

  // Flow State
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Info, 2: Payment & UTR, 3: Success Pass
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedPass, setConfirmedPass] = useState<Registration | null>(null);
  const [orderRef, setOrderRef] = useState<string>('');

  useEffect(() => {
    fetchEvents().then((evts) => {
      setEvents(evts);
      if (eventIdParam) {
        const found = evts.find((e) => e.id === eventIdParam);
        if (found) setSelectedEvent(found);
      } else if (evts.length > 0) {
        setSelectedEvent(evts[0]);
      }
    });
    setOrderRef(Math.floor(100000 + Math.random() * 900000).toString());
  }, [eventIdParam]);

  const handleInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !rollNumber) {
      alert('Please fill out all required personal fields.');
      return;
    }

    if (selectedEvent && selectedEvent.price === 0) {
      // Free event -> Directly create registration
      handleFinalSubmission();
    } else {
      // Paid event -> Move to Payment & UPI Screen
      setStep(2);
    }
  };

  const handleFinalSubmission = async () => {
    if (!selectedEvent) return;

    if (selectedEvent.price > 0 && (!utrNumber || utrNumber.trim().length < 6)) {
      alert('Please provide a valid 12-digit transaction UTR reference number.');
      return;
    }

    setIsSubmitting(true);
    try {
      const reg = await createRegistration({
        studentName: fullName,
        studentEmail: email,
        rollNumber: rollNumber.toUpperCase(),
        branch,
        academicYear,
        eventId: selectedEvent.id,
        eventTitle: selectedEvent.title,
        clubName: selectedEvent.clubName,
        eventType: selectedEvent.eventType,
        teamName: teamName || undefined,
        teamCode: teamCode || undefined,
        amountPaid: selectedEvent.price,
        utrNumber: selectedEvent.price === 0 ? `FREE-${Date.now()}` : utrNumber.trim(),
        receiptUrl: receiptFile || undefined,
      });

      setConfirmedPass(reg);
      setStep(3);

      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {}
    } catch (e: any) {
      alert('Registration failed: ' + e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const upiUrl = selectedEvent
    ? generateUPIPaymentUrl({
        vpa: 'sac.college@okbiz',
        payeeName: 'STUDENT_ACTIVITY_CENTER',
        amount: selectedEvent.price,
        orderRef: orderRef,
      })
    : '';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Step Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-cyan-950/80 text-sac-orange border border-sac-orange/30">
          <Ticket className="w-3.5 h-3.5 text-sac-orange" />
          SAC Event Pass Terminal
        </div>
        <h1 className="text-3xl sm:text-4xl font-black font-heading text-slate-900">
          Event Registration & Check-In Pass
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Complete the form and link payment UTR reference to generate your verified digital pass.
        </p>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <div
            className={`flex items-center gap-2 px-3 py-1 rounded-xl text-xs font-bold ${
              step === 1 ? 'bg-cyan-400 text-slate-950' : 'bg-white/5 text-slate-500'
            }`}
          >
            1. Student Info
          </div>
          <span className="text-slate-600">&rarr;</span>
          <div
            className={`flex items-center gap-2 px-3 py-1 rounded-xl text-xs font-bold ${
              step === 2 ? 'bg-cyan-400 text-slate-950' : 'bg-white/5 text-slate-500'
            }`}
          >
            2. Dynamic UPI Bridge
          </div>
          <span className="text-slate-600">&rarr;</span>
          <div
            className={`flex items-center gap-2 px-3 py-1 rounded-xl text-xs font-bold ${
              step === 3 ? 'bg-emerald-400 text-slate-950' : 'bg-white/5 text-slate-500'
            }`}
          >
            3. Entry Ticket Pass
          </div>
        </div>
      </div>

      {/* STEP 1: STUDENT DETAILS */}
      {step === 1 && (
        <form
          onSubmit={handleInfoSubmit}
          className="p-6 sm:p-10 rounded-3xl bg-slate-50/80 border border-slate-200 shadow-2xl space-y-6 backdrop-blur-xl"
        >
          {/* Select Event */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-sac-orange">
              Selected Competition / Event
            </label>
            <select
              value={selectedEvent?.id || ''}
              onChange={(e) => {
                const found = events.find((ev) => ev.id === e.target.value);
                if (found) setSelectedEvent(found);
              }}
              className="w-full px-4 py-3.5 rounded-2xl bg-white/90 border border-white/15 text-sm font-semibold text-slate-900 focus:outline-none focus:border-cyan-500"
            >
              {events.map((ev) => (
                <option key={ev.id} value={ev.id}>
                  {ev.title} — {formatINR(ev.price)} ({ev.eventType})
                </option>
              ))}
            </select>
          </div>

          {/* Student Name & Roll Number */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-sac-orange" /> Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Aryan Sharma"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/70 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-sac-orange" /> College Roll Number *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 23CS104"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/70 border border-slate-200 text-sm text-slate-900 font-mono uppercase focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Email & Department */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-sac-orange" /> University Email *
              </label>
              <input
                type="email"
                required
                placeholder="e.g. aryan.s@student.college.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/70 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600">Department / Branch</label>
              <select
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/70 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-cyan-500"
              >
                <option value="Computer Science & Eng.">Computer Science & Eng.</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Electronics & Communication">Electronics & Communication</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
                <option value="Electrical Engineering">Electrical Engineering</option>
                <option value="Civil Engineering">Civil Engineering</option>
              </select>
            </div>
          </div>

          {/* Academic Year */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600">Academic Year</label>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((year) => (
                <button
                  type="button"
                  key={year}
                  onClick={() => setAcademicYear(year)}
                  className={`py-2 rounded-xl text-xs font-bold transition-colors ${
                    academicYear === year
                      ? 'bg-cyan-400 text-slate-950 shadow-md'
                      : 'bg-white/90 text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Year {year}
                </button>
              ))}
            </div>
          </div>

          {/* Team Fields (if event is Team) */}
          {selectedEvent?.eventType === 'Team' && (
            <div className="p-4 rounded-2xl bg-white/60 border border-cyan-500/20 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-sac-orange flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-sac-orange" /> Team Details
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-500">Team Name</label>
                  <input
                    type="text"
                    placeholder="e.g. AlgoHacks"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-500">Team Code (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. SAC-HACK-8392"
                    value={teamCode}
                    onChange={(e) => setTeamCode(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-mono uppercase"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-4 rounded-2xl font-bold text-sm text-slate-950 bg-gradient-to-r from-sac-orange to-sac-orange-light shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:shadow-[0_0_35px_rgba(6,182,212,0.6)] transition-all flex items-center justify-center gap-2"
          >
            <span>
              {selectedEvent?.price === 0
                ? 'Confirm Free Registration'
                : `Proceed to Payment (${formatINR(selectedEvent?.price || 0)})`}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      )}

      {/* STEP 2: DYNAMIC UPI PAYMENT & UTR AUDIT */}
      {step === 2 && selectedEvent && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left: Dynamic UPI QR Card */}
          <div className="space-y-4">
            <QRCodeCanvas
              upiUrl={upiUrl}
              orderRef={orderRef}
              amount={selectedEvent.price}
            />
            <div className="p-4 rounded-2xl bg-white/80 border border-slate-200 space-y-2 text-xs text-slate-500">
              <p className="font-semibold text-slate-900">Payment Instructions:</p>
              <ol className="list-decimal pl-4 space-y-1">
                <li>Scan the QR code with any UPI app on your phone.</li>
                <li>The payable amount (₹{selectedEvent.price}) and Reference note (SAC-{orderRef}) are locked.</li>
                <li>Complete transaction and copy the 12-digit UTR / Reference number.</li>
              </ol>
            </div>
          </div>

          {/* Right: Verification Form */}
          <div className="p-8 rounded-3xl bg-slate-50/80 border border-slate-200 space-y-6 flex flex-col justify-between backdrop-blur-xl">
            <div className="space-y-4">
              <h3 className="text-lg font-bold font-heading text-slate-900">
                Payment Verification Upload
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Enter your transaction reference number to enable automatic verification by SAC Gatekeeping system.
              </p>

              {/* UTR Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  12-Digit UPI Transaction UTR Number *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 428901847291"
                  value={utrNumber}
                  onChange={(e) => setUtrNumber(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/90 border border-slate-200 text-sm font-mono text-sac-orange focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Screenshot Upload Simulator */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Payment Screenshot (Optional / For Audit)
                </label>
                <label className="border-2 border-dashed border-white/15 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-sac-orange/50 transition-colors bg-white/40">
                  <Upload className="w-6 h-6 text-slate-500" />
                  <span className="text-xs text-slate-500">
                    {receiptFile ? 'Receipt attached: payment-proof.png' : 'Click to attach payment screenshot'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setReceiptFile(URL.createObjectURL(e.target.files[0]));
                      }
                    }}
                  />
                </label>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-200">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleFinalSubmission}
                className="w-full py-3.5 rounded-xl font-bold text-sm text-slate-950 bg-gradient-to-r from-sac-orange to-sac-orange-light shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:shadow-[0_0_35px_rgba(6,182,212,0.6)] transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <FileCheck className="w-4 h-4" />
                    <span>Submit & Generate Entry Pass</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full py-2 text-xs text-slate-500 hover:text-slate-900 text-center"
              >
                &larr; Back to Student Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: DIGITAL ENTRANCE TICKET PASS */}
      {step === 3 && confirmedPass && (
        <div className="max-w-xl mx-auto space-y-6">
          <div className="p-8 rounded-3xl bg-slate-50 border-2 border-sac-orange/50 shadow-[0_0_50px_rgba(6,182,212,0.25)] space-y-6 relative overflow-hidden">
            {/* Top Pass Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-sac-orange" />
                <span className="font-heading font-bold text-lg text-slate-900">
                  SAC DIGITAL ENTRANCE PASS
                </span>
              </div>
              <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-cyan-950 text-sac-orange border border-sac-orange/30">
                {confirmedPass.bookingSerial}
              </span>
            </div>

            {/* Ticket Information */}
            <div className="space-y-4 text-xs">
              <div className="space-y-1">
                <span className="text-slate-500 uppercase text-[10px] tracking-wider font-semibold">
                  Event Title
                </span>
                <h3 className="text-lg font-bold text-slate-900">{confirmedPass.eventTitle}</h3>
                <p className="text-sac-orange font-medium">{confirmedPass.clubName}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-white/90 border border-slate-200">
                <div>
                  <span className="text-slate-500">Attendee Name:</span>
                  <p className="font-bold text-slate-900">{confirmedPass.studentName}</p>
                </div>
                <div>
                  <span className="text-slate-500">Roll Number:</span>
                  <p className="font-mono font-bold text-slate-900">{confirmedPass.rollNumber}</p>
                </div>
                <div>
                  <span className="text-slate-500">Status:</span>
                  <p className="font-semibold text-emerald-400">{confirmedPass.paymentStatus}</p>
                </div>
                <div>
                  <span className="text-slate-500">UTR Reference:</span>
                  <p className="font-mono text-slate-600">{confirmedPass.utrNumber}</p>
                </div>
              </div>

              {/* QR Verification Payload */}
              <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white border border-cyan-500/20 space-y-2">
                <QRCodeCanvas
                  upiUrl={confirmedPass.bookingSerial}
                  orderRef={confirmedPass.bookingSerial}
                  amount={confirmedPass.amountPaid}
                />
                <span className="text-[10px] text-slate-500 text-center">
                  Present this QR code or Reference ID at the venue gate for instant check-in.
                </span>
              </div>
            </div>

            {/* Print & Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-white/10 hover:bg-white/15 border border-slate-200 flex items-center justify-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / Save PDF</span>
              </button>
              <Link
                href="/"
                className="flex-1 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-sac-orange to-sac-orange-light flex items-center justify-center gap-1.5"
              >
                <span>Return to Portal</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-slate-500">Loading terminal...</div>}>
      <RegisterContent />
    </Suspense>
  );
}
