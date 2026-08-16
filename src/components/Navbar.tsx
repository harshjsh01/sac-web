'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Compass,
  Calendar,
  Users,
  ShieldCheck,
  Award,
  BookOpen,
  Mail,
  Menu,
  X,
  Sparkles,
  QrCode,
  Layers,
  Image as ImageIcon,
  UserPlus
} from 'lucide-react';

const NAV_LINKS = [
  { name: 'Home', href: '/', icon: Compass },
  { name: 'Clubs', href: '/clubs', icon: Layers },
  { name: 'Events Hub', href: '/events', icon: Calendar },
  { name: 'Meet the Board', href: '/team', icon: Users },
  { name: 'Gallery', href: '/gallery', icon: ImageIcon },
  { name: 'Alumni', href: '/alumni', icon: Award },
  { name: 'Contact', href: '/contact', icon: Mail },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 sm:px-6 lg:px-8 py-3">
      <div
        className={`max-w-7xl mx-auto rounded-2xl transition-all duration-300 ${
          isScrolled
            ? 'bg-white/90 backdrop-blur-xl border border-slate-200 shadow-soft py-2.5 px-4 sm:px-6'
            : 'bg-white/80 backdrop-blur-lg border border-slate-200 py-3 px-4 sm:px-6'
        }`}
      >
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-12 h-12 flex items-center justify-center p-0.5 group-hover:scale-105 transition-transform">
              <img src="/logo.png" alt="ECB SAC Logo" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-sac-navy to-sac-navy-light bg-clip-text text-transparent">
                ECB SAC
              </span>
              <span className="text-[10px] font-medium uppercase tracking-widest text-sac-orange/90 -mt-1">
                Student Activity Center
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center space-x-1">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'text-sac-orange bg-sac-orange/10 border border-sac-orange/30 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-sac-orange' : 'text-slate-500'}`} />
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-gradient-to-r from-transparent via-sac-orange to-transparent" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="hidden xl:flex items-center gap-2.5">

            {/* Join Member Button */}
            <Link
              href="/join"
              className="relative group overflow-hidden px-4 py-1.5 rounded-lg text-xs font-bold text-slate-950 bg-gradient-to-r from-sac-orange to-sac-orange-light shadow-md hover:shadow-lg transition-all flex items-center gap-1.5"
            >
              <UserPlus className="w-3.5 h-3.5 text-slate-950" />
              <span>Join SAC</span>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex xl:hidden items-center gap-2">

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 bg-white/5 border border-slate-200 hover:bg-slate-200 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div className="xl:hidden mt-4 pt-4 border-t border-slate-200 grid grid-cols-2 gap-2 pb-2">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium ${
                    isActive
                      ? 'bg-sac-orange/10 text-sac-orange border border-sac-orange/30'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4 text-sac-orange" />
                  {link.name}
                </Link>
              );
            })}
            <div className="col-span-2 pt-2 flex flex-col gap-2">
              <Link
                href="/join"
                className="w-full text-center py-2.5 rounded-lg text-xs font-bold text-slate-950 bg-gradient-to-r from-sac-orange to-sac-orange-light flex items-center justify-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                Join as SAC Member
              </Link>
              <Link
                href="/sac-admin/dashboard"
                className="w-full text-center py-2 rounded-lg text-xs font-semibold text-slate-600 bg-slate-100/60 border border-slate-200"
              >
                Admin Control Center
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
