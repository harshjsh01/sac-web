'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import VideoOverlay from '@/components/VideoOverlay';
import { fetchGalleryItems } from '@/lib/firestoreService';
import { GalleryItem } from '@/lib/types';
import {
  Image as ImageIcon,
  Play,
  Filter,
  Sparkles,
  Camera,
  Layers,
  Calendar
} from 'lucide-react';
import { motion } from 'framer-motion';

const FALLBACK_GALLERY: GalleryItem[] = [
  { id: 'g-1', title: 'HackMatrix Grand Finals Pitches', clubName: 'CodeCrafters Technical Society', year: 2026, type: 'image', thumbnailUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80', credits: 'SAC Photography Club / Yash Sharma' },
  { id: 'g-2', title: 'SoundSurge EDM Night Highlights', clubName: 'Dhwani Cultural Guild', year: 2025, type: 'video', thumbnailUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', credits: 'Dhwani Media Crew' },
  { id: 'g-3', title: 'Inter-Collegiate Futsal Championship Trophy', clubName: 'Stride Sports Union', year: 2025, type: 'image', thumbnailUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&auto=format&fit=crop&q=80', credits: 'Stride Media Team' },
  { id: 'g-4', title: 'Campus 5K Eco Marathon Sapling Drive', clubName: 'EcoSphere Social Impact Cell', year: 2026, type: 'image', thumbnailUrl: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=800&auto=format&fit=crop&q=80', credits: 'EcoSphere Media' },
  { id: 'g-5', title: 'Classical Sitar & Tabla Duet Rehearsals', clubName: 'Dhwani Cultural Guild', year: 2025, type: 'image', thumbnailUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80', credits: 'Acoustic Labs Archive' },
  { id: 'g-6', title: 'RoboWars Battle Arena Knockouts', clubName: 'CodeCrafters Technical Society', year: 2026, type: 'video', thumbnailUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=80', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', credits: 'Tech PR Cell' },
];

export default function GalleryPage() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [filterType, setFilterType] = useState<string>('All');
  const [filterClub, setFilterClub] = useState<string>('All');
  const [activeVideo, setActiveVideo] = useState<{ url: string; title: string } | null>(null);

  useEffect(() => {
    fetchGalleryItems().then(items => {
      setGalleryItems(items.length > 0 ? items : FALLBACK_GALLERY);
    });
  }, []);

  const filteredItems = galleryItems.filter((item) => {
    const matchesType = filterType === 'All' || item.type === filterType.toLowerCase();
    const matchesClub = filterClub === 'All' || item.clubName.includes(filterClub);
    return matchesType && matchesClub;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-cyan-950/80 text-sac-orange border border-sac-orange/30 shadow-[0_0_20px_rgba(6,182,212,0.25)]">
          <Camera className="w-3.5 h-3.5 text-sac-orange" />
          SAC Media Archives
        </div>
        <h1 className="text-4xl sm:text-5xl font-black font-heading tracking-tight text-slate-900">
          Moments of Glory & Passion
        </h1>
        <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
          High-definition captures and highlight reels of hackathons, concerts, dramatic plays, and athletic triumphs.
        </p>
      </div>

      {/* Floating Filter Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {['All', 'Image', 'Video'].map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              filterType === type
                ? 'bg-cyan-400 text-slate-950 shadow-md'
                : 'bg-slate-50/80 text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            {type === 'All' ? 'All Media' : `${type}s`}
          </button>
        ))}

        <div className="h-6 w-[1px] bg-white/10 mx-2 hidden sm:block" />

        {['All', 'CodeCrafters', 'Dhwani', 'Stride', 'EcoSphere'].map((club) => (
          <button
            key={club}
            onClick={() => setFilterClub(club)}
            className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
              filterClub === club
                ? 'bg-amber-400 text-slate-950 font-bold shadow-md'
                : 'bg-slate-50/80 text-slate-500 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            {club}
          </button>
        ))}
      </div>

      {/* Responsive Masonry Grid */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
        {filteredItems.map((item) => (
          <motion.div
            key={item.id}
            whileHover={{ y: -6 }}
            transition={{ duration: 0.2 }}
            onClick={() => {
              if (item.type === 'video' && item.videoUrl) {
                setActiveVideo({ url: item.videoUrl, title: item.title });
              }
            }}
            className="group relative rounded-3xl overflow-hidden bg-slate-50 border border-slate-200 break-inside-avoid shadow-xl cursor-pointer"
          >
            <div className="relative w-full aspect-video sm:aspect-auto sm:h-72">
              <Image
                src={item.thumbnailUrl}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

              {/* Video Play Indicator */}
              {item.type === 'video' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-cyan-500/80 backdrop-blur-md flex items-center justify-center text-slate-950 shadow-[0_0_25px_rgba(6,182,212,0.6)] group-hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 fill-slate-950 ml-0.5" />
                  </div>
                </div>
              )}

              {/* Year & Type Pills */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-white/90 text-sac-orange border border-sac-orange/30">
                  {item.type}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-white/90 text-slate-600 border border-slate-200">
                  Batch {item.year}
                </span>
              </div>

              {/* Caption Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-5 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-sac-orange">
                  {item.clubName}
                </span>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-sac-orange transition-colors">
                  {item.title}
                </h3>
                <p className="text-[10px] text-slate-500 pt-1">
                  📸 Credits: {item.credits}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Video Modal Lightbox */}
      <VideoOverlay
        isOpen={Boolean(activeVideo)}
        videoUrl={activeVideo?.url || ''}
        title={activeVideo?.title || 'SAC Video Feature'}
        onClose={() => setActiveVideo(null)}
      />
    </div>
  );
}
