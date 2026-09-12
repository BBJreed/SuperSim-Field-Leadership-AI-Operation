import React, { useState } from 'react';
import { 
  Camera, 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  Maximize2, 
  Tag, 
  MapPin, 
  Clock, 
  HardHat, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  Filter,
  Download,
  Plus
} from 'lucide-react';
import { ProjectSitePhoto, ProjectType } from '../types';
import { INITIAL_SITE_PHOTOS } from '../services/siteMediaData';

interface ProjectSitePhotosModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectType: ProjectType;
  superName: string;
}

export const ProjectSitePhotosModal: React.FC<ProjectSitePhotosModalProps> = ({
  isOpen,
  onClose,
  projectType,
  superName
}) => {
  const [photos, setPhotos] = useState<ProjectSitePhoto[]>(INITIAL_SITE_PHOTOS);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [activePhoto, setActivePhoto] = useState<ProjectSitePhoto | null>(null);

  if (!isOpen) return null;

  const categories = [
    'ALL',
    'Structural Steel',
    'Foundation & Concrete',
    'Facade & Glazing',
    'MEP & Rough-In',
    'Safety & QA',
    'Aerial Drone'
  ];

  const filteredPhotos = selectedCategory === 'ALL'
    ? photos
    : photos.filter(p => p.category === selectedCategory);

  const getStatusBadge = (status: ProjectSitePhoto['status']) => {
    switch (status) {
      case 'APPROVED':
        return {
          label: 'QA APPROVED',
          classes: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
        };
      case 'CRITICAL_PATH':
        return {
          label: 'CRITICAL PATH',
          classes: 'bg-sky-500/20 text-sky-300 border-sky-500/40'
        };
      case 'FLAGGED_DEFECT':
        return {
          label: 'DEFECT FLAGGED',
          classes: 'bg-red-500/20 text-red-300 border-red-500/40'
        };
      case 'REQUIRES_ACTION':
      default:
        return {
          label: 'HOLD POINT / ACTION',
          classes: 'bg-amber-500/20 text-amber-300 border-amber-500/40'
        };
    }
  };

  const handleNextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!activePhoto) return;
    const currentIndex = filteredPhotos.findIndex(p => p.id === activePhoto.id);
    const nextIndex = (currentIndex + 1) % filteredPhotos.length;
    setActivePhoto(filteredPhotos[nextIndex]);
  };

  const handlePrevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!activePhoto) return;
    const currentIndex = filteredPhotos.findIndex(p => p.id === activePhoto.id);
    const prevIndex = (currentIndex - 1 + filteredPhotos.length) % filteredPhotos.length;
    setActivePhoto(filteredPhotos[prevIndex]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl w-full max-w-6xl max-h-[92vh] flex flex-col overflow-hidden text-slate-100"
        onClick={e => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
              <Camera className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 font-mono text-[10px] font-bold uppercase tracking-wider border border-amber-500/30">
                  REAL-TIME FIELD RECONNAISSANCE
                </span>
                <span className="text-slate-500 text-xs hidden sm:inline">•</span>
                <span className="text-xs font-mono text-slate-400 hidden sm:inline">
                  {projectType} • JOB #2026-HQ
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black font-display tracking-tight text-white mt-0.5">
                PROJECT SITE PHOTO ARCHIVE
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer border border-slate-700"
            title="Close Site Photos Gallery"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Filter Pills */}
        <div className="px-5 sm:px-6 py-3 bg-slate-950/80 border-b border-slate-800 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <Filter className="w-3.5 h-3.5 text-slate-500 shrink-0 mr-1" />
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer whitespace-nowrap border ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700 hover:bg-slate-800'
              }`}
            >
              {cat.toUpperCase()} {cat === 'ALL' ? `(${photos.length})` : ''}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredPhotos.map(photo => {
              const badge = getStatusBadge(photo.status);
              return (
                <div
                  key={photo.id}
                  onClick={() => setActivePhoto(photo)}
                  className="group bg-slate-950 rounded-2xl border border-slate-800 hover:border-amber-500/50 overflow-hidden shadow-xl transition-all duration-200 cursor-pointer flex flex-col"
                >
                  {/* Image container */}
                  <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-900">
                    <img
                      src={photo.url}
                      alt={photo.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                    
                    {/* Status Badge */}
                    <div className="absolute top-3 left-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border tracking-wider uppercase ${badge.classes}`}>
                        {badge.label}
                      </span>
                    </div>

                    {/* Expand icon on hover */}
                    <div className="absolute top-3 right-3 p-1.5 rounded-lg bg-slate-950/80 backdrop-blur-md text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
                    </div>

                    {/* Timestamp & ID tag */}
                    <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[10px] font-mono text-slate-300">
                      <span className="font-bold text-amber-400">{photo.id}</span>
                      <span>{photo.timestamp}</span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                        {photo.category}
                      </div>
                      <h4 className="font-bold text-white text-sm group-hover:text-amber-300 transition-colors line-clamp-2">
                        {photo.title}
                      </h4>
                      <p className="text-xs text-slate-400 mt-2 line-clamp-2">
                        {photo.notes}
                      </p>
                    </div>

                    {/* Metadata Footer */}
                    <div className="pt-3 border-t border-slate-800/80 text-[11px] font-mono text-slate-400 flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 truncate">
                        <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                        <span className="truncate">{photo.location}</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                        <span>Trade: {photo.subcontractor.split('/')[0]}</span>
                        <span className="text-slate-400">By: {photo.inspectorName.split(' ')[0]}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Bar */}
        <div className="p-4 sm:p-5 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-400 font-mono">
            <HardHat className="w-4 h-4 text-amber-400" />
            <span>Field Superintendent Log: <strong className="text-white">{superName}</strong></span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
          >
            RETURN TO COMMAND VIEW
          </button>
        </div>

        {/* Full-Screen Lightbox Modal for Active Photo */}
        {activePhoto && (
          <div 
            className="fixed inset-0 z-60 bg-slate-950/95 backdrop-blur-xl flex flex-col animate-in fade-in duration-200"
            onClick={() => setActivePhoto(null)}
          >
            {/* Top Lightbox bar */}
            <div 
              className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between gap-4"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-amber-400 font-bold text-sm">{activePhoto.id}</span>
                <span className="text-slate-600">|</span>
                <h3 className="font-bold text-white text-sm sm:text-base truncate max-w-md sm:max-w-xl">
                  {activePhoto.title}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrevPhoto}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 cursor-pointer"
                  title="Previous Photo"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNextPhoto}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 cursor-pointer"
                  title="Next Photo"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setActivePhoto(null)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 cursor-pointer ml-2"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Main Lightbox Body */}
            <div 
              className="flex-1 flex flex-col lg:flex-row overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              {/* Image Preview Container */}
              <div className="flex-1 relative bg-black flex items-center justify-center p-4 overflow-hidden">
                <img
                  src={activePhoto.url}
                  alt={activePhoto.title}
                  referrerPolicy="no-referrer"
                  className="max-h-full max-w-full object-contain rounded-lg shadow-2xl"
                />
              </div>

              {/* Sidebar Inspector Details */}
              <div className="w-full lg:w-96 bg-slate-900 border-t lg:border-t-0 lg:border-l border-slate-800 p-6 overflow-y-auto space-y-4 text-xs font-mono">
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold border uppercase tracking-wider ${getStatusBadge(activePhoto.status).classes}`}>
                    {getStatusBadge(activePhoto.status).label}
                  </span>
                  <span className="text-slate-400">{activePhoto.timestamp}</span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Specific Location</span>
                  <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-slate-200">
                    {activePhoto.location}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Assigned Subcontractor</span>
                  <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-amber-300 font-bold">
                    {activePhoto.subcontractor}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Field Inspection Notes</span>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-slate-300 font-sans leading-relaxed text-xs">
                    {activePhoto.notes}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">Certified Inspector:</span>
                  <span className="text-slate-200 font-bold">{activePhoto.inspectorName}</span>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
