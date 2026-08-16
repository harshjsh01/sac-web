'use client';

import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { Copy, Check, ExternalLink, ShieldCheck } from 'lucide-react';

interface QRCodeCanvasProps {
  upiUrl: string;
  orderRef: string;
  amount: number;
}

export default function QRCodeCanvas({ upiUrl, orderRef, amount }: QRCodeCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (canvasRef.current && upiUrl) {
      QRCode.toCanvas(canvasRef.current, upiUrl, {
        width: 220,
        margin: 2,
        color: {
          dark: '#030712',
          light: '#ffffff',
        },
      }).catch((err) => console.error('QR rendering error:', err));
    }
  }, [upiUrl]);

  const handleCopyUPI = () => {
    navigator.clipboard.writeText('sac.college@okbiz');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-5 rounded-2xl bg-white/90 border border-sac-orange/30 shadow-[0_0_30px_rgba(6,182,212,0.15)]">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-sac-orange bg-cyan-950/80 px-3 py-1 rounded-full border border-sac-orange/30">
        <ShieldCheck className="w-3.5 h-3.5 text-sac-orange" />
        <span>Verified Merchant UPI Bridge</span>
      </div>

      {/* QR Code Canvas */}
      <div className="p-3 bg-white rounded-xl shadow-lg relative group">
        <canvas ref={canvasRef} className="rounded-lg max-w-[200px] h-auto" />
      </div>

      {/* Payment Meta */}
      <div className="text-center space-y-1">
        <p className="text-xs text-slate-500">Scan using GPay, PhonePe, Paytm, or BHIM</p>
        <p className="text-base font-bold font-mono text-sac-orange">₹{amount.toFixed(2)}</p>
        <p className="text-[11px] font-mono text-slate-500">Ref ID: {orderRef}</p>
      </div>

      {/* Quick Action Buttons */}
      <div className="flex items-center gap-2 w-full pt-1">
        <button
          type="button"
          onClick={handleCopyUPI}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium text-slate-700 bg-slate-100/80 hover:bg-slate-700 border border-slate-200 transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'VPA Copied' : 'Copy VPA'}</span>
        </button>

        <a
          href={upiUrl}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold text-slate-950 bg-gradient-to-r from-sac-orange to-sac-orange-light hover:opacity-90 transition-opacity"
        >
          <ExternalLink className="w-3.5 h-3.5 text-slate-950" />
          <span>Pay in App</span>
        </a>
      </div>
    </div>
  );
}
