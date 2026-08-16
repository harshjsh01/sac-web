'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  fetchRegistrations,
  updatePaymentVerification,
  checkInTicket
} from '@/lib/firestoreService';
import { Registration } from '@/lib/types';
import { formatINR } from '@/lib/utils';
import {
  QrCode,
  CheckCircle2,
  Search,
  RefreshCw,
  DollarSign,
  ArrowLeft
} from 'lucide-react';

export default function AdminPaymentsPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadData = async () => {
    setIsRefreshing(true);
    const regs = await fetchRegistrations();
    setRegistrations(regs);
    setIsRefreshing(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalRevenue = registrations
    .filter((r) => r.paymentStatus === 'Verified')
    .reduce((sum, r) => sum + r.amountPaid, 0);

  const checkedInCount = registrations.filter((r) => r.isCheckedIn).length;
  const pendingVerificationCount = registrations.filter((r) => r.paymentStatus === 'Pending').length;

  const handleVerify = async (id: string, status: 'Verified' | 'Rejected') => {
    await updatePaymentVerification(id, status);
    setRegistrations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, paymentStatus: status } : r))
    );
  };

  const handleCheckIn = async (id: string) => {
    const res = await checkInTicket(id);
    if (res.success) {
      loadData();
    } else {
      alert(res.message);
    }
  };

  const filteredRegistrations = registrations.filter((r) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      r.studentName.toLowerCase().includes(q) ||
      r.rollNumber.toLowerCase().includes(q) ||
      r.bookingSerial.toLowerCase().includes(q) ||
      r.utrNumber.toLowerCase().includes(q) ||
      r.eventTitle.toLowerCase().includes(q);

    const matchesStatus = filterStatus === 'All' || r.paymentStatus === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <Link href="/sac-admin/dashboard" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors mb-2">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
          </Link>
          <div className="flex items-center gap-2 mt-1">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <DollarSign className="w-5 h-5 text-emerald-600" />
            </div>
            <h1 className="text-3xl font-black font-heading text-slate-900">
              Payment Verification
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            disabled={isRefreshing}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-slate-200 text-slate-600 border border-slate-200"
            title="Refresh database"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>

          <Link
            href="/sac-admin/scan"
            className="px-4 py-2.5 rounded-xl font-bold text-xs text-slate-950 bg-gradient-to-r from-amber-400 to-amber-300 shadow-[0_0_20px_rgba(212,175,55,0.4)] flex items-center gap-2"
          >
            <QrCode className="w-4 h-4" />
            <span>Launch Gate Scanner</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-slate-50/80 border border-slate-200 space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Total Passes Issued
          </span>
          <div className="text-2xl sm:text-3xl font-black font-mono text-slate-900">
            {registrations.length}
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-slate-50/80 border border-emerald-500/30 space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
            Verified Revenue
          </span>
          <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-600">
            {formatINR(totalRevenue)}
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-slate-50/80 border border-sac-orange/30 space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-sac-orange">
            Checked-In Attendees
          </span>
          <div className="text-2xl sm:text-3xl font-black font-mono text-sac-orange">
            {checkedInCount}
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-slate-50/80 border border-sac-blue/30 space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-sac-blue">
            Pending UTR Audits
          </span>
          <div className="text-2xl sm:text-3xl font-black font-mono text-sac-blue">
            {pendingVerificationCount}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search by student, roll, serial, or UTR..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900"
            />
          </div>

          <div className="flex gap-2">
            {['All', 'Pending', 'Verified', 'Rejected'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${
                  filterStatus === status
                    ? 'bg-cyan-400 text-slate-950'
                    : 'bg-slate-50 text-slate-500 border border-slate-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-slate-50/80 shadow-2xl backdrop-blur-xl">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-white text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <tr>
                <th className="p-4">Serial / Pass ID</th>
                <th className="p-4">Student</th>
                <th className="p-4">Event</th>
                <th className="p-4">UTR Number</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Payment Status</th>
                <th className="p-4">Gate Check-in</th>
                <th className="p-4 text-right">Verification Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-medium">
              {filteredRegistrations.map((reg) => (
                <tr key={reg.id} className="hover:bg-slate-100 transition-colors">
                  <td className="p-4 font-mono font-bold text-sac-orange">{reg.bookingSerial}</td>
                  <td className="p-4">
                    <div className="font-semibold text-slate-900">{reg.studentName}</div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      {reg.rollNumber} • {reg.branch}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-slate-700">{reg.eventTitle}</div>
                    <div className="text-[10px] text-sac-orange">{reg.clubName}</div>
                  </td>
                  <td className="p-4 font-mono text-slate-600">{reg.utrNumber}</td>
                  <td className="p-4 font-mono font-bold text-slate-900">{formatINR(reg.amountPaid)}</td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                        reg.paymentStatus === 'Verified'
                          ? 'bg-emerald-100 text-emerald-700 border border-emerald-500/30'
                          : reg.paymentStatus === 'Pending'
                          ? 'bg-amber-100 text-sac-blue border border-sac-blue/30'
                          : 'bg-rose-100 text-rose-700 border border-rose-500/30'
                      }`}
                    >
                      {reg.paymentStatus}
                    </span>
                  </td>
                  <td className="p-4">
                    {reg.isCheckedIn ? (
                      <span className="text-emerald-500 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Admitted
                      </span>
                    ) : (
                      <button
                        onClick={() => handleCheckIn(reg.id)}
                        className="px-2 py-1 rounded bg-white hover:bg-cyan-400 hover:text-slate-950 text-[10px] font-semibold text-slate-600 border border-slate-200 transition-colors"
                      >
                        Check-in Now
                      </button>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    {reg.paymentStatus === 'Pending' ? (
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleVerify(reg.id, 'Verified')}
                          className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-400 text-slate-950 hover:bg-emerald-300"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleVerify(reg.id, 'Rejected')}
                          className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-white text-rose-500 border border-rose-200 hover:bg-rose-50"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-slate-500 text-[11px]">Audit Complete</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
