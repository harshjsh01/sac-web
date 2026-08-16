'use client';

import React from 'react';
import QRScannerComponent from '@/components/QRScannerComponent';
import Link from 'next/link';
import { QrCode, ShieldCheck, ArrowLeft, LayoutDashboard } from 'lucide-react';

export default function GateScanPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-950/80 text-sac-blue border border-sac-blue/30">
            <ShieldCheck className="w-3.5 h-3.5 text-sac-blue" />
            Security & Gatekeeping Checkpoint
          </div>
          <h1 className="text-3xl font-black font-heading text-slate-900">
            Real-Time Gate Pass Scanner
          </h1>
        </div>

        <Link
          href="/sac-admin/dashboard"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-white/5 hover:bg-slate-200 border border-slate-200"
        >
          <LayoutDashboard className="w-4 h-4 text-sac-orange" />
          <span>Admin Control Center</span>
        </Link>
      </div>

      {/* Camera & Code Scanner Deck */}
      <QRScannerComponent />
    </div>
  );
}
