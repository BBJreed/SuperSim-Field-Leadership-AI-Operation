import React, { useState, useEffect } from 'react';
import { Camera, ZoomIn, ZoomOut, Maximize2, Shield, Eye, Layers, Compass, Wind, AlertCircle, Radio, Sparkles } from 'lucide-react';
import { Scenario } from '../types';

interface SiteInspectionMonitorProps {
  scenario: Scenario;
  projectName?: string;
  className?: string;
}

export const SiteInspectionMonitor: React.FC<SiteInspectionMonitorProps> = ({
  scenario,
  projectName = 'Class-A Commercial Tower',
  className = ''
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [visionMode, setVisionMode] = useState<'optical' | 'night' | 'thermal'>('optical');
  const [activeCamIndex, setActiveCamIndex] = useState<number>(0);
  const [timeString, setTimeString] = useState<string>('');
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [showAiTags, setShowAiTags] = useState<boolean>(true);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // Live ticking timestamp with milliseconds
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeStr = now.toISOString().replace('T', ' ').substring(0, 19) + '.' + Math.floor(now.getMilliseconds() / 100);
      setTimeString(timeStr);
    };
    updateTime();
    const interval = setInterval(updateTime, 100);
    return () => clearInterval(interval);
  }, []);

  const cameras = [
    {
      id: scenario.cctvCameraId || 'CAM-01 [FIELD INSPECTION POV]',
      label: 'CAM 01: DILEMMA SITE POV',
      url: scenario.imageUrl || 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=1200&q=80',
      tag: scenario.cameraTelemetry?.inspectionTag || 'ACTIVE FIELD DILEMMA',
      callout: scenario.cameraTelemetry?.calloutText || 'HAZARD ANALYSIS REQUIRED'
    },
    {
      id: 'CAM-02 [TOWER CRANE HOOK CAM]',
      label: 'CAM 02: TOWER CRANE JIB',
      url: 'https://images.unsplash.com/photo-1504307651554-66914ee56a38?auto=format&fit=crop&w=1200&q=80',
      tag: 'RIGGING & HOOK POSITION',
      callout: 'CRANE HOOK ELEVATION: 184 FT • HOIST LOAD: 14.2 TONS'
    },
    {
      id: 'CAM-03 [DECK SLAB & REBAR QC]',
      label: 'CAM 03: DECK & REBAR QC',
      url: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80',
      tag: 'LEVEL 4 DECK SLAB',
      callout: 'FORM ELEVATION VERIFIED • CONDUIT CLEARANCE INSPECTED'
    },
    {
      id: 'CAM-04 [DRONE AERIAL RECON]',
      label: 'CAM 04: DRONE 4K OVERVIEW',
      url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80',
      tag: 'PERIMETER STAGING & LOGISTICS',
      callout: 'GATE 2 TRUCK QUEUE: 4 UNITS • STAGING CLEARANCE OK'
    }
  ];

  const currentCam = cameras[activeCamIndex] || cameras[0];

  const getFilterStyle = () => {
    switch (visionMode) {
      case 'thermal':
        return 'contrast(1.6) saturate(2.4) hue-rotate(180deg) invert(0.15)';
      case 'night':
        return 'brightness(1.1) contrast(1.3) sepia(1) hue-rotate(85deg) saturate(3)';
      default:
        return 'contrast(1.08) saturate(1.1)';
    }
  };

  return (
    <div 
      id="site-inspection-monitor"
      className={`relative bg-slate-950 rounded-xl border border-slate-700/80 shadow-2xl overflow-hidden font-sans select-none transition-all duration-300 ${
        isExpanded ? 'fixed inset-4 z-50 flex flex-col' : className
      }`}
    >
      {/* Top Header Bar */}
      <div className="bg-slate-900/95 border-b border-slate-800 px-3.5 py-2.5 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-red-500/10 border border-red-500/30 text-red-400 font-mono font-bold tracking-wider">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping inline-block" />
            <span>LIVE CCTV</span>
          </div>
          <span className="font-mono text-slate-300 font-semibold truncate hidden sm:inline">
            {currentCam.id}
          </span>
          <span className="text-slate-500 hidden md:inline">•</span>
          <span className="text-slate-400 font-mono hidden md:inline">
            {timeString}
          </span>
        </div>

        {/* Camera Selector Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
          {cameras.map((cam, idx) => (
            <button
              key={idx}
              id={`cam-select-btn-${idx}`}
              onClick={() => setActiveCamIndex(idx)}
              className={`px-2 py-1 rounded text-[11px] font-mono whitespace-nowrap transition-colors ${
                activeCamIndex === idx
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {cam.label.split(':')[0]}
            </button>
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            id="toggle-grid-btn"
            onClick={() => setShowGrid(!showGrid)}
            title="Toggle Survey Reticle Grid"
            className={`p-1.5 rounded transition-colors ${showGrid ? 'bg-slate-800 text-amber-400' : 'text-slate-500 hover:bg-slate-800'}`}
          >
            <Compass className="w-3.5 h-3.5" />
          </button>
          <button
            id="toggle-tags-btn"
            onClick={() => setShowAiTags(!showAiTags)}
            title="Toggle AI Defect Vision"
            className={`p-1.5 rounded transition-colors ${showAiTags ? 'bg-slate-800 text-blue-400' : 'text-slate-500 hover:bg-slate-800'}`}
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            id="expand-monitor-btn"
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? 'Minimize' : 'Maximize Video Stream'}
            className="p-1.5 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Video Viewport */}
      <div className={`relative w-full overflow-hidden bg-black ${isExpanded ? 'flex-1 min-h-0' : 'h-64 sm:h-72 md:h-80'}`}>
        {/* The Live Photo/Video Frame */}
        <div 
          className="w-full h-full transition-transform duration-300 ease-out"
          style={{
            transform: `scale(${zoomLevel})`,
            transformOrigin: 'center center'
          }}
        >
          <img
            id="cctv-live-feed-image"
            src={currentCam.url}
            alt={currentCam.label}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover select-none pointer-events-none"
            style={{ filter: getFilterStyle() }}
          />
        </div>

        {/* Subtle Scanlines & CRT vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/40 pointer-events-none" />
        <div 
          className="absolute inset-0 pointer-events-none opacity-20" 
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 0, 0, 0.4) 2px, rgba(0, 0, 0, 0.4) 4px)'
          }}
        />

        {/* HUD Survey Reticle / Grid Overlay */}
        {showGrid && (
          <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4">
            {/* Top Corners */}
            <div className="flex justify-between items-start">
              <div className="w-6 h-6 border-t-2 border-l-2 border-amber-500/70" />
              <div className="text-center font-mono text-[10px] text-amber-400/90 tracking-widest bg-black/60 px-2 py-0.5 rounded border border-amber-500/20 backdrop-blur-sm">
                FOV: {scenario.cameraTelemetry?.fov || '92° WIDE'} • AZIMUTH: 184° S • ELEV: +42.5 FT
              </div>
              <div className="w-6 h-6 border-t-2 border-r-2 border-amber-500/70" />
            </div>

            {/* Center Targeting Reticle */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-28 h-28 border border-white/20 rounded-full flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
                <div className="absolute w-full h-[1px] bg-white/20" />
                <div className="absolute h-full w-[1px] bg-white/20" />
                <div className="absolute -top-4 font-mono text-[9px] text-amber-300 font-bold tracking-wider">
                  [CROSSHAIR LOCK]
                </div>
              </div>
            </div>

            {/* Bottom Corners */}
            <div className="flex justify-between items-end">
              <div className="w-6 h-6 border-b-2 border-l-2 border-amber-500/70" />
              <div className="font-mono text-[10px] text-slate-300 bg-black/60 px-2 py-0.5 rounded border border-slate-700/60 backdrop-blur-sm">
                GRID: {scenario.cameraTelemetry?.gridOverlay || 'GRID C4-F8'}
              </div>
              <div className="w-6 h-6 border-b-2 border-r-2 border-amber-500/70" />
            </div>
          </div>
        )}

        {/* AI Vision Hazard Tag */}
        {showAiTags && (
          <div className="absolute top-3 left-3 max-w-[85%] sm:max-w-md pointer-events-none">
            <div className="bg-slate-950/90 border border-amber-500/70 backdrop-blur-md rounded-lg p-2.5 shadow-xl animate-fade-in text-amber-200">
              <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold mb-1">
                <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
                <span>AI COMPUTER VISION TELEMETRY</span>
              </div>
              <p className="font-mono text-xs font-semibold leading-tight text-white drop-shadow">
                {currentCam.callout}
              </p>
            </div>
          </div>
        )}

        {/* Thermal / Night Vision Badge */}
        {visionMode !== 'optical' && (
          <div className="absolute top-3 right-3 pointer-events-none">
            <span className={`px-2 py-1 rounded text-[10px] font-mono font-bold uppercase tracking-wider border backdrop-blur-sm ${
              visionMode === 'thermal' 
                ? 'bg-purple-900/80 text-purple-200 border-purple-500' 
                : 'bg-emerald-900/80 text-emerald-200 border-emerald-500'
            }`}>
              {visionMode === 'thermal' ? 'FLIR THERMAL SENSOR' : 'GEN-III NIGHT VISION'}
            </span>
          </div>
        )}

        {/* Bottom Telemetry Overlay Bar */}
        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between gap-2 pointer-events-none">
          <div className="flex items-center gap-2 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-md border border-slate-700/60 font-mono text-[10px] text-slate-300">
            <span className="text-amber-400 font-bold">{projectName}</span>
            <span className="text-slate-500">|</span>
            <span>DAY {scenario.day} • {scenario.time}</span>
            <span className="text-slate-500 hidden sm:inline">|</span>
            <span className="text-blue-300 hidden sm:inline flex items-center gap-1">
              <Wind className="w-2.5 h-2.5" />
              {scenario.weather.windMph} MPH {scenario.weather.windDirection}
            </span>
          </div>

          {/* Quick Zoom & Sensor Controls */}
          <div className="flex items-center gap-1 pointer-events-auto bg-black/70 backdrop-blur-md px-2 py-1 rounded-md border border-slate-700/60">
            <button
              id="zoom-out-btn"
              onClick={() => setZoomLevel(prev => Math.max(1, prev - 0.5))}
              disabled={zoomLevel <= 1}
              className="p-1 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-[11px] text-amber-400 font-bold px-1 min-w-[28px] text-center">
              {zoomLevel.toFixed(1)}x
            </span>
            <button
              id="zoom-in-btn"
              onClick={() => setZoomLevel(prev => Math.min(3, prev + 0.5))}
              disabled={zoomLevel >= 3}
              className="p-1 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>

            <span className="text-slate-700 mx-1">|</span>

            {/* Sensor mode switches */}
            <div className="flex items-center gap-1 font-mono text-[10px]">
              <button
                id="mode-optical-btn"
                onClick={() => setVisionMode('optical')}
                className={`px-1.5 py-0.5 rounded transition-colors ${
                  visionMode === 'optical' ? 'bg-slate-700 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                RGB
              </button>
              <button
                id="mode-thermal-btn"
                onClick={() => setVisionMode('thermal')}
                className={`px-1.5 py-0.5 rounded transition-colors ${
                  visionMode === 'thermal' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                FLIR
              </button>
              <button
                id="mode-night-btn"
                onClick={() => setVisionMode('night')}
                className={`px-1.5 py-0.5 rounded transition-colors ${
                  visionMode === 'night' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                NVG
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Caption strip */}
      <div className="bg-slate-900/90 px-3.5 py-2 border-t border-slate-800 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-slate-300 font-medium truncate">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
          <span className="font-mono text-amber-400 font-semibold shrink-0">LOCATION:</span>
          <span className="truncate text-slate-200">{scenario.location}</span>
        </div>
        <div className="text-[11px] font-mono text-slate-400 hidden sm:inline">
          TASK: <span className="text-slate-200 font-semibold">{scenario.criticalPathTask}</span>
        </div>
      </div>
    </div>
  );
};
