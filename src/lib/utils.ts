import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateBookingSerial(): string {
  const rand = Math.floor(100000 + Math.random() * 900000);
  return `SAC-${rand}`;
}

export function generateTeamCode(prefix: string = "HACK"): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let token = "";
  for (let i = 0; i < 4; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `SAC-${prefix.toUpperCase().slice(0, 4)}-${token}`;
}

export function generateUPIPaymentUrl({
  vpa = "sac.college@okbiz",
  payeeName = "STUDENT_ACTIVITY_CENTER",
  amount,
  orderRef,
}: {
  vpa?: string;
  payeeName?: string;
  amount: number;
  orderRef: string;
}): string {
  const formattedAmount = amount.toFixed(2);
  const note = `SAC-${orderRef}`;
  return `upi://pay?pa=${encodeURIComponent(vpa)}&pn=${encodeURIComponent(
    payeeName
  )}&am=${formattedAmount}&cu=INR&tn=${encodeURIComponent(note)}`;
}

export function formatINR(amount: number): string {
  if (amount === 0) return "Free";
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateString;
  }
}

export function formatTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  } catch {
    return dateString;
  }
}
