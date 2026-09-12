import React, { useState, useRef } from 'react';
import { 
  Building2, 
  Building, 
  Warehouse, 
  Construction, 
  HardHat, 
  Shield, 
  CheckCircle2, 
  ArrowRight, 
  Camera, 
  User, 
  Sparkles,
  DollarSign,
  Clock,
  AlertTriangle,
  Flame,
  CloudSun,
  X,
  Crosshair,
  Radio
} from 'lucide-react';
import { 
  ProjectType, 
  ExperienceLevel, 
  RiskTolerance, 
  SuperintendentProfile, 
  SectorDetails 
} from '../types';
import { SECTOR_CONFIGS, DEFAULT_WEATHER_FORECAST } from '../services/scenarioData';

interface SetupWizardProps {
  onComplete: (projectType: ProjectType, profile: SuperintendentProfile) => void;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&q=80&w=400', // Veteran Super with hardhat
  'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&q=80&w=400', // Senior Project Superintendent
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400', // Field Operations QA Lead
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400'  // Commercial General Super
];

export const SetupWizard: React.FC<SetupWizardProps> = ({ onComplete }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedSector, setSelectedSector] = useState<ProjectType>(ProjectType.COMMERCIAL);
  
  // Profile Form State
  const [superName, setSuperName] = useState('Jack Morrison');
  const [experience, setExperience] = useState<ExperienceLevel>('Lead Superintendent');
  const [riskTolerance, setRiskTolerance] = useState<RiskTolerance>('Balanced / Standard Spec');
  const [avatarUrl, setAvatarUrl] = useState<string>(PRESET_AVATARS[0]);
  const [cameraError, setCameraError] = useState<string | null>(null);
  
  // Camera state
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const sectorDetails: SectorDetails = SECTOR_CONFIGS[selectedSector];

  const getSectorIcon = (type: ProjectType) => {
    switch (type) {
      case ProjectType.COMMERCIAL: return <Building2 className="w-6 h-6 text-amber-400" />;
      case ProjectType.HIGH_RISE: return <Building className="w-6 h-6 text-amber-400" />;
      case ProjectType.INDUSTRIAL: return <Warehouse className="w-6 h-6 text-amber-400" />;
      case ProjectType.INFRASTRUCTURE: return <Construction className="w-6 h-6 text-amber-400" />;
    }
  };

  const startCamera = async () => {
    setCameraError(null);
    try {
      setCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch {
      setCameraError("Camera device unavailable. Field avatar badge selected automatically.");
      setCameraActive(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        canvas.width = 300;
        canvas.height = 300;
        ctx.drawImage(video, 0, 0, 300, 300);
        const dataUrl = canvas.toDataURL('image/png');
        setAvatarUrl(dataUrl);
        stopCamera();
      }
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  const handleLaunch = () => {
    onComplete(selectedSector, {
      name: superName.trim() || 'Field Superintendent',
      experience,
      riskTolerance,
      avatarUrl
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 blueprint-grid flex items-center justify-center p-4 sm:p-6 md:p-10">
      <div className="w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col">
        
        {/* Top Stepper Header with Real Construction Jobsite Backdrop */}
        <div className="relative overflow-hidden p-6 sm:p-8 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
          {/* Real Construction Site Photo Backdrop */}
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=1920&q=80"
              alt=""
              aria-hidden="true"
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.currentTarget.src = "https://images.unsplash.com/photo-1504307651554-66914ee56a38?auto=format&fit=crop&w=1920&q=80";
              }}
              className="w-full h-full object-cover object-center filter saturate-75 brightness-75 opacity-35"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/75 to-slate-950/90" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/30 to-slate-950" />
            <div className="absolute inset-0 blueprint-grid opacity-20" />
          </div>

          <div className="relative z-10 flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20">
              <HardHat className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold tracking-widest text-amber-400 uppercase">
                  ENTERPRISE SIMULATION ENGINE v2.0
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black font-display tracking-tight text-white uppercase">
                SUPERSIM: FIELD LEADERSHIP EVALUATOR
              </h1>
            </div>
          </div>

          {/* Step Progress Indicators */}
          <div className="flex items-center gap-2 sm:gap-4 text-xs font-mono">
            <button
              onClick={() => setStep(1)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${
                step === 1 
                  ? 'bg-amber-500 text-slate-950 font-bold border-amber-400 shadow-md' 
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-slate-950/20 text-center leading-4 font-bold text-[10px]">1</span>
              <span className="hidden sm:inline">Sector</span>
            </button>

            <span className="text-slate-700">→</span>

            <button
              onClick={() => setStep(2)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${
                step === 2 
                  ? 'bg-amber-500 text-slate-950 font-bold border-amber-400 shadow-md' 
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-slate-950/20 text-center leading-4 font-bold text-[10px]">2</span>
              <span className="hidden sm:inline">Super Profile</span>
            </button>

            <span className="text-slate-700">→</span>

            <button
              onClick={() => setStep(3)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${
                step === 3 
                  ? 'bg-amber-500 text-slate-950 font-bold border-amber-400 shadow-md' 
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-slate-950/20 text-center leading-4 font-bold text-[10px]">3</span>
              <span className="hidden sm:inline">Site Briefing</span>
            </button>
          </div>
        </div>

        {/* Step 1: Select Sector */}
        {step === 1 && (
          <div className="p-6 sm:p-8 md:p-10 space-y-6">
            <div>
              <span className="text-xs font-mono text-amber-400 uppercase tracking-wider font-bold">
                STEP 1 OF 3 • PROJECT JURISDICTION
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase font-display mt-1">
                Select Construction Sector
              </h2>
              <p className="text-slate-400 text-sm mt-1 max-w-2xl">
                Each project archetype tests distinct logistical trade-offs: tight urban access, vertical hoist queuing, high-wind crane operations, or civil safety barriers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.values(ProjectType).map((type) => {
                const conf = SECTOR_CONFIGS[type];
                const isSelected = selectedSector === type;

                return (
                  <button
                    key={type}
                    onClick={() => setSelectedSector(type)}
                    className={`p-6 rounded-2xl border text-left transition-all duration-200 cursor-pointer relative overflow-hidden group ${
                      isSelected
                        ? 'bg-slate-800/95 border-amber-500 shadow-xl ring-2 ring-amber-500/30'
                        : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                    }`}
                  >
                    {/* Background Sector Photo with Gradient Overlay */}
                    {conf.imageUrl && (
                      <div className="absolute inset-0 z-0 opacity-25 group-hover:opacity-35 transition-opacity duration-300">
                        <img 
                          src={conf.imageUrl} 
                          alt="" 
                          aria-hidden="true"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/30"></div>
                      </div>
                    )}

                    <div className="relative z-10">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 group-hover:border-amber-500/50 transition-colors backdrop-blur-sm">
                          {getSectorIcon(type)}
                        </div>
                        <div className="text-right">
                          <span className="font-mono text-xs font-bold text-amber-400 block">{conf.valuation}</span>
                          <span className="text-[10px] font-mono text-slate-400 uppercase">{conf.durationMonths} Mos Schedule</span>
                        </div>
                      </div>

                      <h3 className="font-bold text-white text-lg tracking-tight mb-1">
                        {type}
                      </h3>
                      <p className="text-xs text-slate-300 mb-4 line-clamp-2">
                        {conf.tagline} • {conf.squareFeet}
                      </p>

                      {/* Sector Key Risks Tags */}
                      <div className="pt-3 border-t border-slate-800/80 space-y-1">
                        <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-bold block">
                          Field Risk Vector:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {conf.keyRisks.map((risk, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded bg-slate-900/90 text-[10px] font-mono text-slate-300 border border-slate-700/80">
                              {risk}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="absolute top-3 right-3 text-amber-400 z-20">
                        <CheckCircle2 className="w-5 h-5 fill-amber-400 text-slate-950" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
              <div className="text-xs font-mono text-slate-500">
                Selected: <span className="text-amber-400 font-bold">{selectedSector}</span>
              </div>
              <button
                onClick={() => setStep(2)}
                className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-6 py-3 rounded-xl font-mono text-xs tracking-wider uppercase transition-all shadow-lg hover:shadow-amber-500/20"
              >
                <span>Continue to Superintendent Profile</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Initialize Super Profile */}
        {step === 2 && (
          <div className="p-6 sm:p-8 md:p-10 space-y-6">
            <div>
              <span className="text-xs font-mono text-amber-400 uppercase tracking-wider font-bold">
                STEP 2 OF 3 • FIELD COMMAND PROFILE
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase font-display mt-1">
                Superintendent Credentials
              </h2>
              <p className="text-slate-400 text-sm mt-1">
                Define your field persona, authority tier, and baseline tactical risk envelope.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              
              {/* Left Column: ID Photo & Badge */}
              <div className="md:col-span-4 bg-slate-950 p-6 rounded-2xl border border-slate-800 flex flex-col items-center justify-center text-center relative overflow-hidden">
                <div className="relative mb-4">
                  <div className="w-28 h-28 rounded-2xl overflow-hidden border-4 border-slate-800 shadow-2xl relative bg-slate-900">
                    <img 
                      src={avatarUrl} 
                      alt="" 
                      aria-hidden="true"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent"></div>
                    <div className="absolute bottom-1.5 left-0 right-0 text-[9px] font-mono font-bold text-amber-400 uppercase tracking-widest text-center">
                      VERIFIED SUPER
                    </div>
                  </div>

                  <button
                    onClick={startCamera}
                    className="absolute -bottom-2 -right-2 p-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-full shadow-lg transition-transform hover:scale-110"
                    title="Take webcam snapshot"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-center mb-4">
                  <h4 className="font-bold text-white text-base">{superName || 'Field Super'}</h4>
                  <p className="text-[11px] font-mono text-amber-400">{experience}</p>
                </div>

                {/* Preset Avatar Selector */}
                <div className="w-full">
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block mb-2">
                    Quick Badge Select:
                  </span>
                  <div className="flex justify-center gap-2">
                    {PRESET_AVATARS.map((url, i) => (
                      <button
                        key={i}
                        onClick={() => setAvatarUrl(url)}
                        className={`w-9 h-9 rounded-lg overflow-hidden border-2 transition-all ${
                          avatarUrl === url ? 'border-amber-500 scale-110' : 'border-slate-800 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={url} alt={`Avatar ${i}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>

                {cameraError && (
                  <div className="mt-3 p-2 bg-amber-500/10 border border-amber-500/30 rounded-lg text-[10px] font-mono text-amber-300 text-center">
                    {cameraError}
                  </div>
                )}

                {/* Camera Overlay Modal */}
                {cameraActive && (
                  <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-between p-4 z-20">
                    <div className="w-full flex justify-between items-center text-xs text-white">
                      <span className="font-mono text-amber-400 uppercase">Field Camera Feed</span>
                      <button onClick={stopCamera} className="text-slate-400 hover:text-white">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="relative w-40 h-40 rounded-xl overflow-hidden border-2 border-amber-500 my-2">
                      <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                    </div>
                    <button
                      onClick={capturePhoto}
                      className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono font-bold text-xs px-4 py-2 rounded-xl"
                    >
                      Snap ID Photo
                    </button>
                    <canvas ref={canvasRef} className="hidden" />
                  </div>
                )}
              </div>

              {/* Right Column: Form Inputs */}
              <div className="md:col-span-8 space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 font-bold mb-1.5">
                    Candidate Full Name:
                  </label>
                  <input
                    type="text"
                    value={superName}
                    onChange={(e) => setSuperName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                  />
                </div>

                {/* Experience Tier */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 font-bold mb-1.5">
                    Experience Level / Operational Tier:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      'Assistant Superintendent',
                      'Lead Superintendent',
                      'General Superintendent',
                      'Field Operations VP'
                    ].map((tier) => (
                      <button
                        key={tier}
                        type="button"
                        onClick={() => setExperience(tier as ExperienceLevel)}
                        className={`p-3 rounded-xl border text-left font-mono text-xs transition-all ${
                          experience === tier
                            ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        {tier}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Risk Tolerance */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 font-bold mb-1.5">
                    Starting Field Risk Tolerance:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {[
                      { val: 'Conservative / Safety-First', desc: 'Zero regulatory risk, strictly protects spec & safety' },
                      { val: 'Balanced / Standard Spec', desc: 'Pragmatic commercial pace with active trade diplomacy' },
                      { val: 'Aggressive Fast-Track', desc: 'Pushes critical path, prioritizes liquidated damages' }
                    ].map((item) => (
                      <button
                        key={item.val}
                        type="button"
                        onClick={() => setRiskTolerance(item.val as RiskTolerance)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          riskTolerance === item.val
                            ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <div className="font-mono text-xs">{item.val.split(' / ')[0]}</div>
                        <div className="text-[10px] text-slate-500 mt-1 line-clamp-2 leading-tight">
                          {item.desc}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

              </div>

            </div>

            <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={() => setStep(1)}
                className="text-xs font-mono text-slate-400 hover:text-white px-4 py-2"
              >
                ← Back to Sector
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-6 py-3 rounded-xl font-mono text-xs tracking-wider uppercase transition-all shadow-lg hover:shadow-amber-500/20"
              >
                <span>Review Site Conditions</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Site Conditions & Launch Day 1 */}
        {step === 3 && (
          <div className="p-6 sm:p-8 md:p-10 space-y-6">
            <div>
              <span className="text-xs font-mono text-amber-400 uppercase tracking-wider font-bold">
                STEP 3 OF 3 • FIELD OPERATIONS DOSSIER
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase font-display mt-1">
                Site Conditions & 5-Day Forecast
              </h2>
              <p className="text-slate-400 text-sm mt-1">
                Inspect critical project baselines before walking onto the jobsite at 07:00 AM on Day 1.
              </p>
            </div>

            {/* Site Overview Stats Bento Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 font-bold block">
                  STARTING CONTINGENCY
                </span>
                <div className="text-xl sm:text-2xl font-black font-mono text-amber-400 mt-1">
                  ${sectorDetails.startingContingency.toLocaleString()}
                </div>
                <span className="text-[10px] text-slate-500 font-mono">Owner Controlled</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 font-bold block">
                  SCHEDULE FLOAT
                </span>
                <div className="text-xl sm:text-2xl font-black font-mono text-sky-400 mt-1">
                  +{sectorDetails.initialFloatDays} Days
                </div>
                <span className="text-[10px] text-slate-500 font-mono">Critical Path Buffer</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 font-bold block">
                  SUBCONTRACTORS ON SITE
                </span>
                <div className="text-xl sm:text-2xl font-black font-mono text-indigo-400 mt-1">
                  {sectorDetails.tradesOnSite} Trades
                </div>
                <span className="text-[10px] text-slate-500 font-mono">~140 Craft Laborers</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 font-bold block">
                  ZERO-TOLERANCE FLOOR
                </span>
                <div className="text-xl sm:text-2xl font-black font-mono text-red-400 mt-1">
                  50% OSHA
                </div>
                <span className="text-[10px] text-slate-500 font-mono">Below = Stop-Work Order</span>
              </div>
            </div>

            {/* Live Aerial Drone Site Reconnaissance Card */}
            {sectorDetails.aerialDroneUrl && (
              <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden relative shadow-2xl">
                <div className="px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Crosshair className="w-3.5 h-3.5" />
                      DRONE RECONNAISSANCE SATELLITE & HOVER SURVEY
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">ALT: 320FT • FLIGHT PATH 04A SECURE</span>
                </div>

                <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-slate-950">
                  <img
                    src={sectorDetails.aerialDroneUrl}
                    alt=""
                    aria-hidden="true"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover opacity-85"
                  />
                  {/* Drone HUD Grid Lines & Targeting Reticle */}
                  <div className="absolute inset-0 blueprint-grid opacity-30 pointer-events-none"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40 pointer-events-none"></div>

                  {/* Telemetry Tags on Drone View */}
                  <div className="absolute top-3 left-3 bg-slate-950/85 backdrop-blur-md px-2.5 py-1 rounded border border-slate-700 text-[10px] font-mono text-slate-300 flex items-center gap-2">
                    <span className="text-amber-400 font-bold">LAT: 37°46'29.7"N</span>
                    <span className="text-slate-500">|</span>
                    <span className="text-sky-400 font-bold">LON: 122°25'09.8"W</span>
                  </div>

                  <div className="absolute top-3 right-3 bg-red-950/85 backdrop-blur-md px-2.5 py-1 rounded border border-red-500/40 text-[10px] font-mono text-red-300 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping"></span>
                    <span>TOWER CRANE SWING RADIUS ARMED</span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] font-mono bg-slate-950/90 backdrop-blur-md p-2.5 rounded-xl border border-slate-800">
                    <span className="text-slate-300">
                      Site Footprint: <strong className="text-amber-400">{sectorDetails.squareFeet}</strong>
                    </span>
                    <span className="text-slate-400 hidden sm:inline">
                      Primary Access: Gate 2 (Logistics Staging)
                    </span>
                    <span className="text-emerald-400 font-bold">
                      AISC SPECIFIED TOLERANCE: ±0.125"
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* 5-Day Weather Matrix */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800">
              <div className="flex items-center justify-between mb-3 text-xs font-mono">
                <span className="text-slate-400 uppercase font-bold flex items-center gap-1.5">
                  <CloudSun className="w-4 h-4 text-amber-400" />
                  NOAA 5-DAY FIELD WEATHER TELEMETRY
                </span>
                <span className="text-slate-500">Doppler Live Radar Active</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {DEFAULT_WEATHER_FORECAST.map((w) => (
                  <div 
                    key={w.day}
                    className={`p-3 rounded-xl border flex flex-col justify-between ${
                      w.rainProbability > 60 
                        ? 'bg-red-950/30 border-red-500/40 text-red-200' 
                        : w.windMph > 25 
                          ? 'bg-amber-950/30 border-amber-500/40 text-amber-200' 
                          : 'bg-slate-900 border-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] font-mono font-bold mb-1">
                      <span>DAY {w.day}</span>
                      <span className="text-slate-400">{w.tempF}°F</span>
                    </div>
                    <div className="text-xs font-semibold truncate my-0.5">{w.condition}</div>
                    <div className="text-[10px] font-mono text-slate-500">
                      Rain: {w.rainProbability}% • Wind: {w.windMph}m
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Launch CTA */}
            <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs font-mono text-slate-400 flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>Superintendent: <strong className="text-white">{superName}</strong> • {selectedSector}</span>
              </div>
              <button
                onClick={handleLaunch}
                className="w-full sm:w-auto flex items-center justify-center gap-3 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black px-8 py-4 rounded-xl font-mono text-sm tracking-widest uppercase transition-all shadow-xl hover:shadow-amber-500/30 hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>LAUNCH DAY 1 OPERATIONS</span>
                <Flame className="w-5 h-5 text-slate-950" />
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
