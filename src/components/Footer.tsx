import React from 'react';
import Link from 'next/link';
import { Sparkles, MapPin, Mail, Phone, Shield, ArrowUpRight, Github, Linkedin, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative bg-white/90 border-t border-slate-200 pt-16 pb-12 overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-200">
          {/* Col 1 & 2: Branding & Overview */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 flex items-center justify-center p-0.5">
                <img src="/logo.png" alt="ECB SAC Logo" className="w-full h-full object-contain" />
              </div>
              <span className="font-heading font-extrabold text-xl tracking-tight text-slate-900">
                ECB SAC
              </span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed max-w-sm">
              The heart of collegiate innovation, artistic culture, athletic glory, and student governance. Empowering next-generation leaders across 20+ specialized clubs and societies.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-sac-orange hover:border-cyan-500/40 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-sac-orange hover:border-cyan-500/40 transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-sac-orange hover:border-cyan-500/40 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 3: Portal Sitemaps */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-sac-orange mb-4">
              Explore & Engage
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/clubs" className="text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1 group">
                  Clubs & Guilds
                  <ArrowUpRight className="w-3 h-3 text-slate-600 group-hover:text-sac-orange transition-colors" />
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1 group">
                  Events & Fest Hub
                  <ArrowUpRight className="w-3 h-3 text-slate-600 group-hover:text-sac-orange transition-colors" />
                </Link>
              </li>
              <li>
                <Link href="/team" className="text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1 group">
                  Meet the Board
                  <ArrowUpRight className="w-3 h-3 text-slate-600 group-hover:text-sac-orange transition-colors" />
                </Link>
              </li>
              <li>
                <Link href="/join" className="text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1 group">
                  Join as Member
                  <ArrowUpRight className="w-3 h-3 text-slate-600 group-hover:text-sac-orange transition-colors" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Operations & Governance */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-sac-blue mb-4">
              Resources
            </h4>
            <ul className="space-y-2.5 text-sm">

              <li>
                <Link href="/alumni" className="text-slate-500 hover:text-slate-900 transition-colors">
                  Alumni Wall of Fame
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-slate-500 hover:text-slate-900 transition-colors">
                  Media & Event Gallery
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-slate-500 hover:text-slate-900 transition-colors">
                  Anonymous Grievances
                </Link>
              </li>
            </ul>
          </div>


        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Student Activity Center (SAC). All Rights Reserved.</p>
          <div className="flex items-center space-x-6">
            <Link href="#" className="hover:text-slate-600 transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-slate-600 transition-colors">Terms of Service</Link>
            <Link href="/sac-admin/dashboard" className="text-slate-500 hover:text-sac-orange transition-colors flex items-center gap-1">
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
