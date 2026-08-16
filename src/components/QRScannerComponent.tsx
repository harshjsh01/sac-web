'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { checkInTicket, findRegistrationBySerial } from '@/lib/firestoreService';
import { Registration } from '@/lib/types';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  QrCode,
  RefreshCw,
  Search,
  UserCheck,
  Calendar,
  Layers,
  Clock,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

type ScannerState = 'idle' | 'scanning' | 'success' | 'duplicate' | 'invalid';

export default function QRScannerComponent() {
  const [scannerState, setScannerState] = useState<ScannerState>('idle');
  const [ticketResult, setTicketResult] = useState<Registration | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [scannedTimestamp, setScannedTimestamp] = useState<string>('');
  const [manualCode, setManualCode] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  const startScanner = () => {
    setScannerState('scanning');
    setErrorMessage('');
    setTicketResult(null);

    // Give DOM time to mount reader element
    setTimeout(() => {
      if (document.getElementById('sac-qr-reader')) {
        try {
          const html5QrcodeScanner = new Html5QrcodeScanner(
            'sac-qr-reader',
            {
              fps: 10,
              qrbox: { width: 250, height: 250 },
              aspectRatio: 1.0,
            },
            /* verbose= */ false
          );

          html5QrcodeScanner.render(
            (decodedText) => {
              handleCodeScanned(decodedText);
              html5QrcodeScanner.clear().catch(console.error);
            },
            (error) => {
              // Non-critical scan frame errors
            }
          );

          scannerRef.current = html5QrcodeScanner;
        } catch (e) {
          console.error("Camera scanner error:", e);
        }
      }
    }, 100);
  };

  const stopScanner = () => {
    if (scannerRef.current) {
      scannerRef.current.clear().catch(console.error);
      scannerRef.current = null;
    }
  };

  const handleCodeScanned = async (rawCode: string) => {
    setIsProcessing(true);
    stopScanner();

    try {
      // Clean up raw scan text (e.g. could be "SAC-849201" or full upi payload)
      let cleaned = rawCode.trim();
      const sacMatch = cleaned.match(/SAC-[A-Z0-9-]+/i);
      if (sacMatch) {
        cleaned = sacMatch[0];
      }

      const res = await checkInTicket(cleaned);

      if (res.success && res.registration) {
        setScannerState('success');
        setTicketResult(res.registration);
        setScannedTimestamp(res.scannedAt || new Date().toISOString());
        // Celebration confetti for valid entry
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch {}
      } else if (res.message.includes('ALREADY CHECKED IN')) {
        setScannerState('duplicate');
        setTicketResult(res.registration || null);
        setErrorMessage(res.message);
        setScannedTimestamp(res.scannedAt || '');
      } else {
        setScannerState('invalid');
        setErrorMessage(res.message || 'Invalid or unregistered ticket.');
      }
    } catch (err: any) {
      setScannerState('invalid');
      setErrorMessage(err.message || 'Verification failed.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleManualLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) return;
    handleCodeScanned(manualCode);
  };

  const resetScanner = () => {
    stopScanner();
    setScannerState('idle');
    setTicketResult(null);
    setErrorMessage('');
    setManualCode('');
  };

  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Scanner Control Deck */}
      {scannerState === 'idle' && (
        <div className="p-8 rounded-3xl bg-slate-50/80 border border-slate-200 text-center space-y-6 shadow-2xl backdrop-blur-xl">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.3)]">
            <QrCode className="w-10 h-10 text-sac-orange" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold font-heading text-slate-900">
              Gatekeeper Entry Scanner
            </h2>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              Scan student pass QR code or input ticket serial code directly for instant gate check-in verification.
            </p>
          </div>

          <button
            onClick={startScanner}
            className="w-full py-3.5 px-6 rounded-xl font-bold text-sm text-slate-950 bg-gradient-to-r from-sac-orange to-sac-orange-light shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:shadow-[0_0_35px_rgba(6,182,212,0.6)] transition-all flex items-center justify-center gap-2"
          >
            <QrCode className="w-4 h-4" />
            Launch Live Camera Scanner
          </button>

          {/* Manual Input Form */}
          <div className="pt-4 border-t border-slate-200">
            <form onSubmit={handleManualLookup} className="flex gap-2">
              <input
                type="text"
                placeholder="Or enter serial code e.g. SAC-849201"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-white/70 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-cyan-500"
              />
              <button
                type="submit"
                disabled={isProcessing}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-700 text-slate-900 font-semibold text-xs border border-slate-200 flex items-center gap-1.5"
              >
                <Search className="w-4 h-4" />
                Verify
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Active Camera Frame */}
      {scannerState === 'scanning' && (
        <div className="p-6 rounded-3xl bg-slate-50/90 border border-sac-orange/30 space-y-4 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sac-orange">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping inline-block" />
              Camera Feed Active
            </span>
            <button
              onClick={resetScanner}
              className="text-xs text-slate-500 hover:text-slate-900 px-3 py-1 rounded-lg bg-white/5"
            >
              Cancel
            </button>
          </div>

          <div
            id="sac-qr-reader"
            className="overflow-hidden rounded-2xl bg-black border border-slate-200 min-h-[300px]"
          />

          <p className="text-center text-xs text-slate-500">
            Align the QR code within the frame box to scan automatically.
          </p>
        </div>
      )}

      {/* 🟩 GREEN STATE: VALID ENTRY */}
      {scannerState === 'success' && ticketResult && (
        <div className="p-8 rounded-3xl bg-gradient-to-b from-emerald-950/60 to-slate-900 border-2 border-emerald-500/60 shadow-[0_0_50px_rgba(16,185,129,0.35)] space-y-6 animate-in zoom-in-95 duration-200">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-400 shrink-0">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                ENTRY AUTHORIZED • VERIFIED PASS
              </span>
              <h2 className="text-2xl font-bold font-heading text-slate-900">
                {ticketResult.studentName}
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-white/70 border border-emerald-500/20 text-xs">
            <div>
              <span className="text-slate-500">Ticket Serial:</span>
              <p className="font-mono font-bold text-emerald-300 text-sm">{ticketResult.bookingSerial}</p>
            </div>
            <div>
              <span className="text-slate-500">Roll Number:</span>
              <p className="font-mono font-bold text-slate-900 text-sm">{ticketResult.rollNumber}</p>
            </div>
            <div className="col-span-2 pt-2 border-t border-slate-200">
              <span className="text-slate-500">Event:</span>
              <p className="font-semibold text-slate-900">{ticketResult.eventTitle}</p>
            </div>
            <div>
              <span className="text-slate-500">Branch:</span>
              <p className="text-slate-700">{ticketResult.branch} (Year {ticketResult.academicYear})</p>
            </div>
            <div>
              <span className="text-slate-500">Scan Timestamp:</span>
              <p className="font-mono text-emerald-400">{new Date(scannedTimestamp).toLocaleTimeString()}</p>
            </div>
          </div>

          <button
            onClick={startScanner}
            className="w-full py-3 px-6 rounded-xl font-bold text-sm text-slate-950 bg-emerald-400 hover:bg-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Scan Next Attendee
          </button>
        </div>
      )}

      {/* 🟥 RED STATE: DUPLICATE / ALREADY CHECKED IN */}
      {scannerState === 'duplicate' && (
        <div className="p-8 rounded-3xl bg-gradient-to-b from-rose-950/70 to-slate-900 border-2 border-rose-500/70 shadow-[0_0_50px_rgba(244,63,94,0.35)] space-y-6 animate-in zoom-in-95 duration-200">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/20 border border-rose-400 flex items-center justify-center text-rose-400 shrink-0">
              <XCircle className="w-8 h-8" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-rose-400">
                ENTRY DENIED • DUPLICATE TICKET
              </span>
              <h2 className="text-2xl font-bold font-heading text-slate-900">
                ALREADY CHECKED IN
              </h2>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-xs space-y-2">
            <p className="text-rose-200 leading-relaxed font-medium">
              ⚠️ This digital entrance pass was already scanned and admitted previously. Pass sharing or re-entry is prohibited under SAC event regulations.
            </p>
            {scannedTimestamp && (
              <div className="flex items-center gap-2 text-rose-300 font-mono pt-1">
                <Clock className="w-3.5 h-3.5" />
                <span>Original Admission Time: {new Date(scannedTimestamp).toLocaleString()}</span>
              </div>
            )}
            {ticketResult && (
              <div className="pt-2 text-slate-600 border-t border-rose-500/20">
                Registered Attendee: <span className="font-semibold text-slate-900">{ticketResult.studentName} ({ticketResult.rollNumber})</span>
              </div>
            )}
          </div>

          <button
            onClick={startScanner}
            className="w-full py-3 px-6 rounded-xl font-bold text-sm text-slate-900 bg-rose-600 hover:bg-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.4)] transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Scan Next Attendee
          </button>
        </div>
      )}

      {/* 🟧 ORANGE STATE: INVALID / UNVERIFIED TICKET */}
      {scannerState === 'invalid' && (
        <div className="p-8 rounded-3xl bg-gradient-to-b from-amber-950/70 to-slate-900 border-2 border-amber-500/70 shadow-[0_0_50px_rgba(245,158,11,0.35)] space-y-6 animate-in zoom-in-95 duration-200">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-400 flex items-center justify-center text-sac-blue shrink-0">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-sac-blue">
                VERIFICATION ERROR • PASS NOT FOUND
              </span>
              <h2 className="text-2xl font-bold font-heading text-slate-900">
                Invalid Ticket Reference
              </h2>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-sac-blue/10 border border-sac-blue/30 text-xs text-amber-200">
            <p className="font-medium">{errorMessage}</p>
            <p className="mt-2 text-slate-500">
              Ensure the student registration is verified by the SAC Admin desk and has a valid UTR transaction number.
            </p>
          </div>

          <button
            onClick={startScanner}
            className="w-full py-3 px-6 rounded-xl font-bold text-sm text-slate-950 bg-amber-400 hover:bg-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Retry Scan
          </button>
        </div>
      )}
    </div>
  );
}
