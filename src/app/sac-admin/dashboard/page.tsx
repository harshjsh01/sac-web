'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  fetchClubs,
  fetchEvents,
  fetchStudentCoordinators,
  fetchAlumni,
  fetchGalleryItems,
  fetchClubMemberships,
  fetchGrievances,
  saveClub,
  deleteClub,
  saveEvent,
  deleteEvent,
  saveStudentCoordinator,
  deleteStudentCoordinator,
  saveAlumni,
  deleteAlumni,
  saveGalleryItem,
  deleteGalleryItem,
  uploadImage,
} from '@/lib/firestoreService';
import { Club, Event, StudentCoordinator, Alumni, GalleryItem, ClubMembership, Grievance } from '@/lib/types';
import {
  LayoutDashboard,
  Users,
  Calendar,
  Layers,
  Edit2,
  Trash2,
  Plus,
  CreditCard,
  QrCode,
  X,
  AlertTriangle,
  ImageIcon,
  GraduationCap,
  Mail,
  UserPlus,
  Upload,
  Loader2,
  Eye,
  EyeOff
} from 'lucide-react';

type TabType = 'clubs' | 'events' | 'board' | 'gallery' | 'alumni' | 'contacts' | 'joiners';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<TabType>('clubs');
  const [clubs, setClubs] = useState<Club[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [board, setBoard] = useState<StudentCoordinator[]>([]);
  const [alumni, setAlumni] = useState<Alumni[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [memberships, setMemberships] = useState<ClubMembership[]>([]);
  const [grievances, setGrievances] = useState<Grievance[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [editingItem, setEditingItem] = useState<any>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadData = async () => {
    const [c, e, b, a, g, m, gr] = await Promise.all([
      fetchClubs(),
      fetchEvents(),
      fetchStudentCoordinators(),
      fetchAlumni(),
      fetchGalleryItems(),
      fetchClubMemberships(),
      fetchGrievances(),
    ]);
    setClubs(c);
    setEvents(e);
    setBoard(b);
    setAlumni(a);
    setGallery(g);
    setMemberships(m);
    setGrievances(gr);
  };

  useEffect(() => {
    loadData();
  }, []);

  const openModal = (mode: 'add' | 'edit', data?: any) => {
    setModalMode(mode);
    setSaveError(null);
    if (mode === 'edit' && data) {
      setEditingItem(JSON.parse(JSON.stringify(data)));
    } else {
      const templates: Record<string, any> = {
        clubs: { id: `club-${Date.now()}`, name: "", slug: "", category: "Technical", description: "", tagline: "", logoUrl: "", bannerUrl: "", memberCount: 0, charterRules: [], leads: [], faqs: [], achievements: [] },
        events: { id: `evt-${Date.now()}`, title: "", description: "", shortDescription: "", clubId: "", clubName: "", eventDate: "", venue: "", bannerUrl: "", price: 0, maxCapacity: 100, registeredCount: 0, eventType: "Solo", category: "Technical", rules: [], schedule: [], tags: [], isFeatured: false },
        board: { id: `sc-${Date.now()}`, name: "", roleTitle: "", branch: "", academicYear: "", clubAffiliation: "", sacTenure: "", avatarUrl: "", linkedinUrl: "", githubUrl: "", email: "", badges: [] },
        gallery: { id: `gal-${Date.now()}`, title: "", clubName: "", year: new Date().getFullYear(), type: "image", thumbnailUrl: "", videoUrl: "", credits: "" },
        alumni: { id: `alum-${Date.now()}`, name: "", graduatingYear: new Date().getFullYear(), pastSacRole: "", currentRole: "", company: "", domainSkills: [], isHallOfFame: false, avatarUrl: "", linkedinUrl: "", quote: "" },
      };
      setEditingItem(templates[activeTab] || {});
    }
    setIsModalOpen(true);
  };

  const handleImageUpload = async (field: string) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e: any) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setIsUploading(true);
      try {
        const path = `sac-uploads/${activeTab}/${Date.now()}-${file.name}`;
        const url = await uploadImage(file, path);
        setEditingItem((prev: any) => ({ ...prev, [field]: url }));
      } catch (err: any) {
        setSaveError(err.message || "Image upload failed.");
      } finally {
        setIsUploading(false);
      }
    };
    input.click();
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveError(null);
    try {
      if (activeTab === 'clubs') await saveClub(editingItem as Club);
      else if (activeTab === 'events') await saveEvent(editingItem as Event);
      else if (activeTab === 'board') await saveStudentCoordinator(editingItem as StudentCoordinator);
      else if (activeTab === 'gallery') await saveGalleryItem(editingItem as GalleryItem);
      else if (activeTab === 'alumni') await saveAlumni(editingItem as Alumni);
      setIsModalOpen(false);
      loadData();
    } catch (e: any) {
      setSaveError(e.message || "Failed to save.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    try {
      if (activeTab === 'clubs') await deleteClub(id);
      else if (activeTab === 'events') await deleteEvent(id);
      else if (activeTab === 'board') await deleteStudentCoordinator(id);
      else if (activeTab === 'gallery') await deleteGalleryItem(id);
      else if (activeTab === 'alumni') await deleteAlumni(id);
      loadData();
    } catch (e: any) {
      alert(e.message || "Failed to delete.");
    }
  };

  // -------------------------------------------------------
  // IMAGE UPLOAD BUTTON COMPONENT
  // -------------------------------------------------------
  const ImageUploadField = ({ label, field, currentUrl }: { label: string; field: string; currentUrl: string }) => (
    <div>
      <label className="block text-xs font-bold text-slate-700 mb-1">{label}</label>
      <div className="flex items-center gap-3">
        <input type="text" placeholder="Image URL (or upload)" className="flex-1 p-2 border border-slate-200 rounded-lg text-sm" value={currentUrl || ''} onChange={e => setEditingItem({...editingItem, [field]: e.target.value})} />
        <button type="button" onClick={() => handleImageUpload(field)} disabled={isUploading} className="px-3 py-2 bg-sac-orange text-white rounded-lg text-xs font-bold flex items-center gap-1.5 hover:bg-sac-orange-light transition-colors disabled:opacity-50">
          {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          Upload
        </button>
      </div>
      {currentUrl && (
        <div className="mt-2 relative w-20 h-20 rounded-lg overflow-hidden border border-slate-200">
          <img src={currentUrl} alt="Preview" className="w-full h-full object-cover" />
        </div>
      )}
    </div>
  );

  // -------------------------------------------------------
  // GUI FORMS
  // -------------------------------------------------------

  const ClubForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div><label className="block text-xs font-bold text-slate-700 mb-1">Club Name</label><input type="text" className="w-full p-2 border border-slate-200 rounded-lg text-sm" value={editingItem.name} onChange={e => setEditingItem({...editingItem, name: e.target.value})} /></div>
        <div><label className="block text-xs font-bold text-slate-700 mb-1">Slug</label><input type="text" className="w-full p-2 border border-slate-200 rounded-lg text-sm" value={editingItem.slug} onChange={e => setEditingItem({...editingItem, slug: e.target.value})} /></div>
        <div><label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
          <select className="w-full p-2 border border-slate-200 rounded-lg text-sm" value={editingItem.category} onChange={e => setEditingItem({...editingItem, category: e.target.value})}>
            <option value="Technical">Technical</option><option value="Cultural">Cultural</option><option value="Sports">Sports</option><option value="Social">Social</option>
          </select></div>
        <div><label className="block text-xs font-bold text-slate-700 mb-1">Tagline</label><input type="text" className="w-full p-2 border border-slate-200 rounded-lg text-sm" value={editingItem.tagline} onChange={e => setEditingItem({...editingItem, tagline: e.target.value})} /></div>
      </div>
      <div><label className="block text-xs font-bold text-slate-700 mb-1">Description</label><textarea className="w-full p-2 border border-slate-200 rounded-lg text-sm h-24" value={editingItem.description} onChange={e => setEditingItem({...editingItem, description: e.target.value})} /></div>
      <ImageUploadField label="Logo Image" field="logoUrl" currentUrl={editingItem.logoUrl} />
      <ImageUploadField label="Banner Image" field="bannerUrl" currentUrl={editingItem.bannerUrl} />
      <div>
        <div className="flex justify-between items-center mb-1"><label className="block text-xs font-bold text-slate-700">Charter Rules</label><button onClick={() => setEditingItem({...editingItem, charterRules: [...(editingItem.charterRules || []), ""]})} className="text-[10px] bg-slate-200 hover:bg-slate-300 px-2 py-1 rounded font-bold">+ Add Rule</button></div>
        <div className="space-y-2">{(editingItem.charterRules || []).map((rule: string, idx: number) => (
          <div key={idx} className="flex gap-2"><input type="text" className="flex-1 p-2 border border-slate-200 rounded-lg text-sm" value={rule} onChange={e => { const r = [...editingItem.charterRules]; r[idx] = e.target.value; setEditingItem({...editingItem, charterRules: r}); }} /><button onClick={() => { const r = [...editingItem.charterRules]; r.splice(idx, 1); setEditingItem({...editingItem, charterRules: r}); }} className="p-2 text-rose-500 bg-rose-50 rounded-lg hover:bg-rose-100"><Trash2 className="w-4 h-4"/></button></div>
        ))}</div>
      </div>
    </div>
  );

  const EventForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div><label className="block text-xs font-bold text-slate-700 mb-1">Event Title</label><input type="text" className="w-full p-2 border border-slate-200 rounded-lg text-sm" value={editingItem.title} onChange={e => setEditingItem({...editingItem, title: e.target.value})} /></div>
        <div><label className="block text-xs font-bold text-slate-700 mb-1">Hosting Club</label><input type="text" className="w-full p-2 border border-slate-200 rounded-lg text-sm" value={editingItem.clubName} onChange={e => setEditingItem({...editingItem, clubName: e.target.value})} /></div>
        <div><label className="block text-xs font-bold text-slate-700 mb-1">Date</label><input type="text" placeholder="e.g. 2026-09-15 10:00" className="w-full p-2 border border-slate-200 rounded-lg text-sm" value={editingItem.eventDate} onChange={e => setEditingItem({...editingItem, eventDate: e.target.value})} /></div>
        <div><label className="block text-xs font-bold text-slate-700 mb-1">Venue</label><input type="text" className="w-full p-2 border border-slate-200 rounded-lg text-sm" value={editingItem.venue} onChange={e => setEditingItem({...editingItem, venue: e.target.value})} /></div>
        <div><label className="block text-xs font-bold text-slate-700 mb-1">Price (₹)</label><input type="number" className="w-full p-2 border border-slate-200 rounded-lg text-sm" value={editingItem.price} onChange={e => setEditingItem({...editingItem, price: Number(e.target.value)})} /></div>
        <div><label className="block text-xs font-bold text-slate-700 mb-1">Capacity</label><input type="number" className="w-full p-2 border border-slate-200 rounded-lg text-sm" value={editingItem.maxCapacity} onChange={e => setEditingItem({...editingItem, maxCapacity: Number(e.target.value)})} /></div>
      </div>
      <div><label className="block text-xs font-bold text-slate-700 mb-1">Short Description</label><textarea className="w-full p-2 border border-slate-200 rounded-lg text-sm h-16" value={editingItem.shortDescription} onChange={e => setEditingItem({...editingItem, shortDescription: e.target.value})} /></div>
      <ImageUploadField label="Event Banner" field="bannerUrl" currentUrl={editingItem.bannerUrl} />
      <div className="flex items-center gap-3">
        <label className="text-xs font-bold text-slate-700">Featured on Homepage?</label>
        <button onClick={() => setEditingItem({...editingItem, isFeatured: !editingItem.isFeatured})} className={`px-3 py-1 rounded-full text-xs font-bold ${editingItem.isFeatured ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
          {editingItem.isFeatured ? '✓ Featured' : 'Not Featured'}
        </button>
      </div>
      <div>
        <div className="flex justify-between items-center mb-1"><label className="block text-xs font-bold text-slate-700">Schedule</label><button onClick={() => setEditingItem({...editingItem, schedule: [...(editingItem.schedule || []), {time: "", activity: ""}]})} className="text-[10px] bg-slate-200 hover:bg-slate-300 px-2 py-1 rounded font-bold">+ Add Slot</button></div>
        <div className="space-y-2">{(editingItem.schedule || []).map((slot: any, idx: number) => (
          <div key={idx} className="flex gap-2 items-center bg-slate-50 p-2 rounded-lg border border-slate-200">
            <input type="text" placeholder="Time" className="w-1/3 p-1.5 border border-slate-200 rounded text-sm" value={slot.time} onChange={e => { const s = [...editingItem.schedule]; s[idx].time = e.target.value; setEditingItem({...editingItem, schedule: s}); }} />
            <input type="text" placeholder="Activity" className="flex-1 p-1.5 border border-slate-200 rounded text-sm" value={slot.activity} onChange={e => { const s = [...editingItem.schedule]; s[idx].activity = e.target.value; setEditingItem({...editingItem, schedule: s}); }} />
            <button onClick={() => { const s = [...editingItem.schedule]; s.splice(idx, 1); setEditingItem({...editingItem, schedule: s}); }} className="p-1.5 text-rose-500 hover:bg-rose-100 rounded"><Trash2 className="w-4 h-4"/></button>
          </div>
        ))}</div>
      </div>
    </div>
  );

  const BoardForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div><label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label><input type="text" className="w-full p-2 border border-slate-200 rounded-lg text-sm" value={editingItem.name} onChange={e => setEditingItem({...editingItem, name: e.target.value})} /></div>
        <div><label className="block text-xs font-bold text-slate-700 mb-1">Role Title</label><input type="text" className="w-full p-2 border border-slate-200 rounded-lg text-sm" value={editingItem.roleTitle} onChange={e => setEditingItem({...editingItem, roleTitle: e.target.value})} /></div>
        <div><label className="block text-xs font-bold text-slate-700 mb-1">Branch</label><input type="text" className="w-full p-2 border border-slate-200 rounded-lg text-sm" value={editingItem.branch} onChange={e => setEditingItem({...editingItem, branch: e.target.value})} /></div>
        <div><label className="block text-xs font-bold text-slate-700 mb-1">Club Affiliation</label><input type="text" className="w-full p-2 border border-slate-200 rounded-lg text-sm" value={editingItem.clubAffiliation} onChange={e => setEditingItem({...editingItem, clubAffiliation: e.target.value})} /></div>
        <div><label className="block text-xs font-bold text-slate-700 mb-1">SAC Tenure</label><input type="text" placeholder="e.g. 2025 - 2026" className="w-full p-2 border border-slate-200 rounded-lg text-sm" value={editingItem.sacTenure} onChange={e => setEditingItem({...editingItem, sacTenure: e.target.value})} /></div>
        <div><label className="block text-xs font-bold text-slate-700 mb-1">Email</label><input type="email" className="w-full p-2 border border-slate-200 rounded-lg text-sm" value={editingItem.email} onChange={e => setEditingItem({...editingItem, email: e.target.value})} /></div>
      </div>
      <ImageUploadField label="Profile Photo" field="avatarUrl" currentUrl={editingItem.avatarUrl} />
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
        <h4 className="text-xs font-bold uppercase text-slate-500">Social Links</h4>
        <div><label className="block text-xs font-bold text-slate-700 mb-1">LinkedIn URL</label><input type="text" className="w-full p-2 border border-slate-200 rounded-lg text-sm" value={editingItem.linkedinUrl || ''} onChange={e => setEditingItem({...editingItem, linkedinUrl: e.target.value})} /></div>
        <div><label className="block text-xs font-bold text-slate-700 mb-1">GitHub URL</label><input type="text" className="w-full p-2 border border-slate-200 rounded-lg text-sm" value={editingItem.githubUrl || ''} onChange={e => setEditingItem({...editingItem, githubUrl: e.target.value})} /></div>
      </div>
    </div>
  );

  const GalleryForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div><label className="block text-xs font-bold text-slate-700 mb-1">Title</label><input type="text" className="w-full p-2 border border-slate-200 rounded-lg text-sm" value={editingItem.title} onChange={e => setEditingItem({...editingItem, title: e.target.value})} /></div>
        <div><label className="block text-xs font-bold text-slate-700 mb-1">Club Name</label><input type="text" className="w-full p-2 border border-slate-200 rounded-lg text-sm" value={editingItem.clubName} onChange={e => setEditingItem({...editingItem, clubName: e.target.value})} /></div>
        <div><label className="block text-xs font-bold text-slate-700 mb-1">Year</label><input type="number" className="w-full p-2 border border-slate-200 rounded-lg text-sm" value={editingItem.year} onChange={e => setEditingItem({...editingItem, year: Number(e.target.value)})} /></div>
        <div><label className="block text-xs font-bold text-slate-700 mb-1">Type</label>
          <select className="w-full p-2 border border-slate-200 rounded-lg text-sm" value={editingItem.type} onChange={e => setEditingItem({...editingItem, type: e.target.value})}>
            <option value="image">Image</option><option value="video">Video</option>
          </select></div>
        <div className="col-span-2"><label className="block text-xs font-bold text-slate-700 mb-1">Credits / Photographer</label><input type="text" className="w-full p-2 border border-slate-200 rounded-lg text-sm" value={editingItem.credits} onChange={e => setEditingItem({...editingItem, credits: e.target.value})} /></div>
      </div>
      <ImageUploadField label="Thumbnail / Photo" field="thumbnailUrl" currentUrl={editingItem.thumbnailUrl} />
      {editingItem.type === 'video' && (
        <div><label className="block text-xs font-bold text-slate-700 mb-1">Video Embed URL</label><input type="text" placeholder="https://www.youtube.com/embed/..." className="w-full p-2 border border-slate-200 rounded-lg text-sm" value={editingItem.videoUrl || ''} onChange={e => setEditingItem({...editingItem, videoUrl: e.target.value})} /></div>
      )}
    </div>
  );

  const AlumniForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div><label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label><input type="text" className="w-full p-2 border border-slate-200 rounded-lg text-sm" value={editingItem.name} onChange={e => setEditingItem({...editingItem, name: e.target.value})} /></div>
        <div><label className="block text-xs font-bold text-slate-700 mb-1">Graduating Year</label><input type="number" className="w-full p-2 border border-slate-200 rounded-lg text-sm" value={editingItem.graduatingYear} onChange={e => setEditingItem({...editingItem, graduatingYear: Number(e.target.value)})} /></div>
        <div><label className="block text-xs font-bold text-slate-700 mb-1">Past SAC Role</label><input type="text" className="w-full p-2 border border-slate-200 rounded-lg text-sm" value={editingItem.pastSacRole} onChange={e => setEditingItem({...editingItem, pastSacRole: e.target.value})} /></div>
        <div><label className="block text-xs font-bold text-slate-700 mb-1">Current Role</label><input type="text" className="w-full p-2 border border-slate-200 rounded-lg text-sm" value={editingItem.currentRole} onChange={e => setEditingItem({...editingItem, currentRole: e.target.value})} /></div>
        <div><label className="block text-xs font-bold text-slate-700 mb-1">Company</label><input type="text" className="w-full p-2 border border-slate-200 rounded-lg text-sm" value={editingItem.company} onChange={e => setEditingItem({...editingItem, company: e.target.value})} /></div>
        <div><label className="block text-xs font-bold text-slate-700 mb-1">LinkedIn URL</label><input type="text" className="w-full p-2 border border-slate-200 rounded-lg text-sm" value={editingItem.linkedinUrl || ''} onChange={e => setEditingItem({...editingItem, linkedinUrl: e.target.value})} /></div>
      </div>
      <ImageUploadField label="Profile Photo" field="avatarUrl" currentUrl={editingItem.avatarUrl} />
      <div><label className="block text-xs font-bold text-slate-700 mb-1">Quote</label><textarea className="w-full p-2 border border-slate-200 rounded-lg text-sm h-16" value={editingItem.quote || ''} onChange={e => setEditingItem({...editingItem, quote: e.target.value})} /></div>
      <div className="flex items-center gap-3">
        <label className="text-xs font-bold text-slate-700">Hall of Fame?</label>
        <button onClick={() => setEditingItem({...editingItem, isHallOfFame: !editingItem.isHallOfFame})} className={`px-3 py-1 rounded-full text-xs font-bold ${editingItem.isHallOfFame ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'}`}>
          {editingItem.isHallOfFame ? '⭐ Hall of Fame' : 'Not in Hall of Fame'}
        </button>
      </div>
    </div>
  );

  // Check if tab is editable
  const isEditableTab = ['clubs', 'events', 'board', 'gallery', 'alumni'].includes(activeTab);

  const tabConfig = [
    { key: 'clubs' as TabType, label: 'Clubs', icon: Layers, count: clubs.length },
    { key: 'events' as TabType, label: 'Events', icon: Calendar, count: events.length },
    { key: 'board' as TabType, label: 'Board', icon: Users, count: board.length },
    { key: 'gallery' as TabType, label: 'Gallery', icon: ImageIcon, count: gallery.length },
    { key: 'alumni' as TabType, label: 'Alumni', icon: GraduationCap, count: alumni.length },
    { key: 'contacts' as TabType, label: 'Contacts', icon: Mail, count: grievances.length },
    { key: 'joiners' as TabType, label: 'Join SAC', icon: UserPlus, count: memberships.length },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-cyan-950/80 text-sac-orange border border-sac-orange/30">
            <LayoutDashboard className="w-3.5 h-3.5 text-sac-orange" />
            SAC Content Management System
          </div>
          <h1 className="text-3xl font-black font-heading text-slate-900 mt-2">
            Website Administration
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/sac-admin/payments" className="px-4 py-2.5 rounded-xl font-bold text-xs text-slate-600 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-colors flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-emerald-600" /> Payment Verification
          </Link>
          <Link href="/sac-admin/scan" className="px-4 py-2.5 rounded-xl font-bold text-xs text-slate-950 bg-gradient-to-r from-amber-400 to-amber-300 shadow-[0_0_20px_rgba(212,175,55,0.4)] flex items-center gap-2">
            <QrCode className="w-4 h-4" /> Gate Scanner
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-4">
        {tabConfig.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === tab.key ? 'bg-cyan-400 text-slate-950 shadow-md' : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}>
            <tab.icon className="w-3.5 h-3.5" /> {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-slate-900 capitalize">{activeTab === 'contacts' ? 'Contact Submissions' : activeTab === 'joiners' ? 'Join SAC Applications' : `${activeTab} Database`}</h2>
          {isEditableTab && (
            <button onClick={() => openModal('add')} className="px-4 py-2 bg-sac-blue hover:bg-sac-blue-dark text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors">
              <Plus className="w-4 h-4" /> Add New Entry
            </button>
          )}
        </div>

        {/* EDITABLE TABS: Clubs, Events, Board, Gallery, Alumni */}
        {isEditableTab && (
          <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-slate-50/80 shadow-xl">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-white text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="p-4">ID</th>
                  <th className="p-4">Name / Title</th>
                  <th className="p-4">Details</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {activeTab === 'clubs' && clubs.map(c => (
                  <tr key={c.id} className="hover:bg-slate-100/50">
                    <td className="p-4 font-mono text-xs">{c.id}</td>
                    <td className="p-4 font-bold text-slate-900">{c.name}</td>
                    <td className="p-4 text-sac-orange">{c.category}</td>
                    <td className="p-4 text-right space-x-2">
                      <button onClick={() => openModal('edit', c)} className="p-1.5 bg-slate-200 hover:bg-slate-300 rounded text-slate-700"><Edit2 className="w-4 h-4"/></button>
                      <button onClick={() => handleDelete(c.id)} className="p-1.5 bg-rose-100 hover:bg-rose-200 rounded text-rose-600"><Trash2 className="w-4 h-4"/></button>
                    </td>
                  </tr>
                ))}
                {activeTab === 'events' && events.map(e => (
                  <tr key={e.id} className="hover:bg-slate-100/50">
                    <td className="p-4 font-mono text-xs">{e.id}</td>
                    <td className="p-4 font-bold text-slate-900">{e.title}</td>
                    <td className="p-4 text-sac-blue">{e.category} · {e.eventDate}</td>
                    <td className="p-4 text-right space-x-2">
                      <button onClick={() => openModal('edit', e)} className="p-1.5 bg-slate-200 hover:bg-slate-300 rounded text-slate-700"><Edit2 className="w-4 h-4"/></button>
                      <button onClick={() => handleDelete(e.id)} className="p-1.5 bg-rose-100 hover:bg-rose-200 rounded text-rose-600"><Trash2 className="w-4 h-4"/></button>
                    </td>
                  </tr>
                ))}
                {activeTab === 'board' && board.map(b => (
                  <tr key={b.id} className="hover:bg-slate-100/50">
                    <td className="p-4 font-mono text-xs">{b.id}</td>
                    <td className="p-4 font-bold text-slate-900">{b.name}</td>
                    <td className="p-4 text-slate-600">{b.roleTitle}</td>
                    <td className="p-4 text-right space-x-2">
                      <button onClick={() => openModal('edit', b)} className="p-1.5 bg-slate-200 hover:bg-slate-300 rounded text-slate-700"><Edit2 className="w-4 h-4"/></button>
                      <button onClick={() => handleDelete(b.id)} className="p-1.5 bg-rose-100 hover:bg-rose-200 rounded text-rose-600"><Trash2 className="w-4 h-4"/></button>
                    </td>
                  </tr>
                ))}
                {activeTab === 'gallery' && gallery.map(g => (
                  <tr key={g.id} className="hover:bg-slate-100/50">
                    <td className="p-4 font-mono text-xs">{g.id}</td>
                    <td className="p-4 font-bold text-slate-900">{g.title}</td>
                    <td className="p-4 text-slate-600">{g.clubName} · {g.year}</td>
                    <td className="p-4 text-right space-x-2">
                      <button onClick={() => openModal('edit', g)} className="p-1.5 bg-slate-200 hover:bg-slate-300 rounded text-slate-700"><Edit2 className="w-4 h-4"/></button>
                      <button onClick={() => handleDelete(g.id)} className="p-1.5 bg-rose-100 hover:bg-rose-200 rounded text-rose-600"><Trash2 className="w-4 h-4"/></button>
                    </td>
                  </tr>
                ))}
                {activeTab === 'alumni' && alumni.map(a => (
                  <tr key={a.id} className="hover:bg-slate-100/50">
                    <td className="p-4 font-mono text-xs">{a.id}</td>
                    <td className="p-4 font-bold text-slate-900">{a.name}</td>
                    <td className="p-4 text-slate-600">{a.currentRole} @ {a.company}</td>
                    <td className="p-4 text-right space-x-2">
                      <button onClick={() => openModal('edit', a)} className="p-1.5 bg-slate-200 hover:bg-slate-300 rounded text-slate-700"><Edit2 className="w-4 h-4"/></button>
                      <button onClick={() => handleDelete(a.id)} className="p-1.5 bg-rose-100 hover:bg-rose-200 rounded text-rose-600"><Trash2 className="w-4 h-4"/></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* READ-ONLY: Contact Submissions (Grievances) */}
        {activeTab === 'contacts' && (
          <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-slate-50/80 shadow-xl">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-white text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="p-4">Category</th>
                  <th className="p-4">Subject</th>
                  <th className="p-4">Student</th>
                  <th className="p-4">Message</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {grievances.length === 0 ? (
                  <tr><td colSpan={5} className="p-8 text-center text-slate-400">No contact submissions received yet.</td></tr>
                ) : grievances.map(g => (
                  <tr key={g.id} className="hover:bg-slate-100/50">
                    <td className="p-4"><span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-600">{g.category}</span></td>
                    <td className="p-4 font-bold text-slate-900">{g.subject}</td>
                    <td className="p-4">
                      {g.isAnonymous ? (
                        <span className="flex items-center gap-1 text-xs text-indigo-500"><EyeOff className="w-3 h-3" /> Anonymous</span>
                      ) : (
                        <div><div className="text-sm">{g.studentName}</div><div className="text-[10px] text-slate-400">{g.studentRollNumber}</div></div>
                      )}
                    </td>
                    <td className="p-4 max-w-xs truncate text-slate-600 text-xs">{g.message}</td>
                    <td className="p-4"><span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${g.status === 'Resolved' ? 'bg-emerald-100 text-emerald-700' : g.status === 'Under Review' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>{g.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* READ-ONLY: Join SAC Memberships */}
        {activeTab === 'joiners' && (
          <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-slate-50/80 shadow-xl">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-white text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="p-4">Student</th>
                  <th className="p-4">Preferred Club</th>
                  <th className="p-4">Skills</th>
                  <th className="p-4">Statement of Purpose</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {memberships.length === 0 ? (
                  <tr><td colSpan={5} className="p-8 text-center text-slate-400">No join applications submitted yet.</td></tr>
                ) : memberships.map(m => (
                  <tr key={m.id} className="hover:bg-slate-100/50">
                    <td className="p-4"><div className="font-bold text-slate-900">{m.studentName}</div><div className="text-[10px] text-slate-400 font-mono">{m.rollNumber} · {m.branch} (Yr {m.academicYear})</div></td>
                    <td className="p-4 font-bold text-sac-orange">{m.primaryClubName}</td>
                    <td className="p-4"><div className="flex flex-wrap gap-1 max-w-xs">{m.skillsTags.map((t, i) => (<span key={i} className="px-1.5 py-0.5 rounded bg-slate-200 text-[10px] text-slate-600">{t}</span>))}</div></td>
                    <td className="p-4 max-w-xs truncate text-xs text-slate-600">{m.statementOfPurpose || 'N/A'}</td>
                    <td className="p-4"><span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-100 text-cyan-700">{m.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* GUI Modal */}
      {isModalOpen && editingItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-2xl flex flex-col shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh]">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-900 uppercase tracking-widest text-sm">
                {modalMode === 'add' ? 'Create New' : 'Edit'} {activeTab === 'clubs' ? 'Club' : activeTab === 'events' ? 'Event' : activeTab === 'board' ? 'Board Member' : activeTab === 'gallery' ? 'Gallery Item' : 'Alumni'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-slate-200 rounded-full text-slate-500"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 flex-1 overflow-y-auto">
              {saveError && (
                <div className="mb-4 flex items-start gap-2 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm">
                  <AlertTriangle className="w-5 h-5 shrink-0" />
                  <p><strong>Error:</strong> {saveError}</p>
                </div>
              )}
              {activeTab === 'clubs' && <ClubForm />}
              {activeTab === 'events' && <EventForm />}
              {activeTab === 'board' && <BoardForm />}
              {activeTab === 'gallery' && <GalleryForm />}
              {activeTab === 'alumni' && <AlumniForm />}
            </div>
            <div className="p-4 border-t border-slate-200 flex justify-end gap-3 bg-slate-50">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-200">Cancel</button>
              <button disabled={isSaving || isUploading} onClick={handleSave} className="px-6 py-2 rounded-xl text-sm font-bold bg-emerald-500 hover:bg-emerald-600 text-white shadow-md disabled:opacity-50">
                {isSaving ? "Saving..." : "Save to Database"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
