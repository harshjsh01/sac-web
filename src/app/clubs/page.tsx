'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { fetchClubs } from '@/lib/firestoreService';
import { Club, ClubCategory } from '@/lib/types';
import {
  Layers,
  Sparkles,
  Users,
  ArrowRight,
  Code,
  Music,
  Trophy,
  HeartHandshake,
  CheckCircle,
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function ClubsPage() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    fetchClubs().then(setClubs);
  }, []);

  const categories = ['All', 'Technical', 'Cultural', 'Sports', 'Social'];

  const filteredClubs =
    selectedCategory === 'All'
      ? clubs
      : clubs.filter((c) => c.category === selectedCategory);

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Technical':
        return Code;
      case 'Cultural':
        return Music;
      case 'Sports':
        return Trophy;
      case 'Social':
        return HeartHandshake;
      default:
        return Layers;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-cyan-950/80 text-sac-orange border border-sac-orange/30 shadow-[0_0_20px_rgba(6,182,212,0.25)]">
          <Layers className="w-3.5 h-3.5 text-sac-orange" />
          Clubs & Societies Directory
        </div>
        <h1 className="text-4xl sm:text-5xl font-black font-heading tracking-tight text-slate-900">
          Find Your Tribe at SAC
        </h1>
        <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
          From cutting-edge robotics and hackathons to dramatic theatre and varsity sports, explore vibrant student-led organizations.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {categories.map((cat) => {
          const Icon = getCategoryIcon(cat);
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                isSelected
                  ? 'bg-cyan-400 text-slate-950 shadow-md scale-105'
                  : 'bg-slate-50/80 text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat} Clubs</span>
            </button>
          );
        })}
      </div>

      {/* Clubs Grid with 3D Perspective Hover */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 perspective-1000">
        {filteredClubs.map((club) => (
          <motion.div
            key={club.id}
            whileHover={{ y: -6, rotateX: 2 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="group relative flex flex-col rounded-3xl bg-slate-50/80 border border-slate-200 overflow-hidden shadow-2xl hover:border-cyan-500/40 hover:shadow-[0_0_35px_rgba(6,182,212,0.25)] transition-all"
          >
            {/* Banner Image */}
            <div className="relative w-full h-56 overflow-hidden">
              <Image
                src={club.bannerUrl}
                alt={club.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

              {/* Category Pill */}
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/90 backdrop-blur-md text-sac-orange border border-sac-orange/30">
                  {club.category}
                </span>
              </div>

              {/* Members Count */}
              <div className="absolute top-4 right-4">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/90 backdrop-blur-md text-slate-700 border border-slate-200 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-sac-orange" />
                  {club.memberCount} Members
                </span>
              </div>

              {/* Club Logo in Banner */}
              <div className="absolute -bottom-5 left-6">
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-slate-950 shadow-2xl bg-slate-50">
                  <Image
                    src={club.logoUrl}
                    alt={club.name}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Club Information */}
            <div className="p-6 pt-10 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <h3 className="text-xl font-bold font-heading text-slate-900 group-hover:text-sac-orange transition-colors">
                  {club.name}
                </h3>
                <p className="text-xs font-semibold text-sac-orange/90">{club.tagline}</p>
                <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                  {club.description}
                </p>
              </div>

              {/* Achievements Highlight */}
              {club.achievements && club.achievements.length > 0 && (
                <div className="p-3 rounded-2xl bg-white/60 border border-slate-200 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-sac-blue flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-sac-blue" /> Recent Accolade
                  </span>
                  <p className="text-xs text-slate-600 truncate">
                    {club.achievements[0]}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-3 pt-2">
                <Link
                  href={`/clubs/${club.slug}`}
                  className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-sac-orange to-sac-orange-light flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:opacity-90 transition-opacity"
                >
                  <span>Explore Club Hub</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <Link
                  href={`/join?club=${encodeURIComponent(club.name)}`}
                  className="py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-600 bg-white/5 hover:bg-slate-200 border border-slate-200 transition-colors"
                >
                  Join
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
