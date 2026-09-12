import React from 'react';
import { 
  ShieldAlert, 
  Clock, 
  DollarSign, 
  Award, 
  Users, 
  CloudRain, 
  Wind, 
  Sun, 
  AlertTriangle,
  Flame,
  CheckCircle2,
  Terminal,
  Camera,
  HardHat,
  Crosshair,
  Compass,
  ArrowUpRight,
  Info
} from 'lucide-react';
import { IronTriangleStats, DayWeather, ProjectType, SuperintendentProfile } from '../types';
import { StatusTooltip } from './StatusTooltip';

interface IronTriangleHUDProps {
  stats: IronTriangleStats;
  weather: DayWeather;
  currentDay: number;
  totalDays: number;
  projectType: ProjectType;
  profile: SuperintendentProfile;
  activeCriticalPath: string;
  telemetryCount?: number;
  unreadTelemetryCount?: number;
  hasNewEventPulse?: boolean;
  onOpenTelemetry?: () => void;
  onOpenSafetyDashboard?: () => void;
  onOpenSitePhotos?: () => void;
  photoCount?: number;
}

export const IronTriangleHUD: React.FC<IronTriangleHUDProps> = ({
  stats,
  weather,
  currentDay,
  totalDays,
  projectType,
  profile,
  activeCriticalPath,
  telemetryCount = 0,
  unreadTelemetryCount = 0,
  hasNewEventPulse = false,
  onOpenTelemetry,
  onOpenSafetyDashboard,
  onOpenSitePhotos,
  photoCount = 8
}) => {
  const isSafetyCritical = stats.safety < 50;
  const isSafetyWarning = stats.safety >= 50 && stats.safety < 70;

  const getWeatherIcon = (cond: string) => {
    if (cond.includes('Rain') || cond.includes('Storm')) return <CloudRain className="w-4 h-4 text-sky-400" />;
    if (cond.includes('Wind')) return <Wind className="w-4 h-4 text-amber-300" />;
    return <Sun className="w-4 h-4 text-amber-400" />;
  };

  const getRiskBadge = () => {
    if (stats.safety < 50) {
      return { 
        label: 'OSHA STOP-WORK THREAT', 
        bg: 'bg-red-950/90 border-red-500 text-red-200 animate-pulse',
        desc: 'Safety score below 50% triggers mandatory OSHA stop-work protocol & full jobsite stand-down.'
      };
    }
    if (stats.safety < 70 || stats.scheduleVarianceDays < -1) {
      return { 
        label: 'ELEVATED FIELD RISK', 
        bg: 'bg-amber-950/80 border-amber-500 text-amber-300',
        desc: 'Significant schedule or quality friction detected. Field intervention recommended.'
      };
    }
    return { 
      label: 'STABLE CONTROL', 
      bg: 'bg-emerald-950/80 border-emerald-500 text-emerald-300',
      desc: 'All trades operating within AISC and OSHA tolerance envelopes.'
    };
  };

  const risk = getRiskBadge();

  return (
    <div className="w-full relative overflow-hidden bg-slate-950 border-b border-slate-800 text-slate-100 shadow-2xl">
      
      {/* Real Construction Site Photo Backdrop */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1504307651554-66914ee56a38?auto=format&fit=crop&w=2000&q=80"
          alt=""
          aria-hidden="true"
          referrerPolicy="no-referrer"
          onError={(e) => {
            e.currentTarget.src = "https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=2000&q=80";
          }}
          className="w-full h-full object-cover object-center filter saturate-75 brightness-75 opacity-35"
        />
        {/* Gradients to keep contrast 100% dark, professional & crisp while showcasing real construction */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-slate-950/90"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/40 to-slate-950"></div>
        <div className="absolute inset-0 blueprint-grid opacity-20"></div>
      </div>

      {/* Subtle Construction Hazard Amber Top Accent Stripe */}
      <div className="relative z-10 w-full h-1 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 shadow-sm shadow-amber-500/50"></div>

      {/* Top Telemetry Strip */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 text-xs">
        {/* Left: Project & Profile Identification */}
        <div className="flex items-center gap-3">
          <StatusTooltip
            title="JOBSITE TELEMETRY STATUS"
            statusText="LIVE GATEWAY"
            statusBadgeColor="emerald"
            definition="Continuous bidirectional telemetry link between jobsite sensors, crane anemometers, and field tablet logs."
            benchmark="Latency < 120ms • 99.9% Uptime"
            superTip="Real-time field observations are cryptographically hashed and verified against Procore & Autodesk ACC."
          >
            <div className="flex items-center gap-2 px-2 py-0.5 rounded-full bg-slate-900/90 border border-slate-700/80">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-mono text-slate-300 uppercase tracking-widest text-[11px] font-bold">JOB #2026-HQ</span>
            </div>
          </StatusTooltip>

          <span className="text-slate-700 hidden sm:inline">|</span>
          <span className="font-bold text-white tracking-tight truncate max-w-[200px] sm:max-w-none">{projectType}</span>
          <span className="text-slate-700 hidden md:inline">|</span>

          {/* Superintendent Profile Chip */}
          <div className="hidden md:flex items-center gap-2 text-slate-300 bg-slate-900/80 px-2 py-0.5 rounded-lg border border-slate-800">
            {profile.avatarUrl ? (
              <img 
                src={profile.avatarUrl} 
                alt="" 
                aria-hidden="true"
                referrerPolicy="no-referrer" 
                className="w-5 h-5 rounded-full object-cover border border-amber-500/50" 
              />
            ) : (
              <HardHat className="w-4 h-4 text-amber-400" />
            )}
            <span className="text-slate-400 text-[11px]">Super:</span>
            <span className="font-semibold text-amber-400 text-[11px]">{profile.name}</span>
            <span className="text-[10px] text-slate-400 font-mono px-1.5 py-0.2 bg-slate-800 rounded">
              {profile.experience.replace(' Superintendent', '')}
            </span>
          </div>
        </div>

        {/* Right: Actions, Weather & Risk Controls */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[11px]">
          
          {/* 1. Project Site Photos Trigger */}
          {onOpenSitePhotos && (
            <button
              type="button"
              onClick={onOpenSitePhotos}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-amber-500/60 transition-all text-[11px] font-mono font-bold cursor-pointer group shadow-md"
              title="Open Project Site Photos & Drone Inspection Archive"
            >
              <Camera className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline">SITE PHOTOS</span>
              <span className="px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/40">
                {photoCount}
              </span>
            </button>
          )}

          {/* 2. Interactive Safety Center Trigger */}
          {onOpenSafetyDashboard && (
            <button
              type="button"
              onClick={onOpenSafetyDashboard}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full border transition-all text-[11px] font-mono font-bold cursor-pointer group shadow-md ${
                isSafetyCritical
                  ? 'bg-red-950 text-red-200 border-red-500 ring-2 ring-red-500/40 animate-pulse'
                  : 'bg-slate-900/90 hover:bg-slate-800 text-slate-200 border-slate-700 hover:border-emerald-500/60'
              }`}
              title="Open Interactive Field Safety & OSHA Audit Dashboard"
            >
              <ShieldAlert className={`w-3.5 h-3.5 ${isSafetyCritical ? 'text-red-400' : 'text-emerald-400'} group-hover:scale-110 transition-transform`} />
              <span className="hidden sm:inline">SAFETY AUDIT:</span>
              <span className={`font-mono font-black ${isSafetyCritical ? 'text-red-300' : 'text-emerald-300'}`}>
                {Math.round(stats.safety)}%
              </span>
            </button>
          )}

          {/* 3. Enterprise Webhooks Trigger */}
          {onOpenTelemetry && (
            <button
              type="button"
              onClick={onOpenTelemetry}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full border cursor-pointer transition-all text-[11px] font-mono group ${
                hasNewEventPulse || unreadTelemetryCount > 0
                  ? 'bg-slate-900 border-emerald-500 text-emerald-300 ring-2 ring-emerald-500/40 shadow-lg shadow-emerald-500/20'
                  : 'bg-slate-900/90 hover:bg-slate-800 text-slate-200 border-slate-700 hover:border-amber-500/50'
              }`}
              title="Open Enterprise Webhook Stream (Procore API, Autodesk ACC, Twilio SMS)"
            >
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  hasNewEventPulse || unreadTelemetryCount > 0 ? 'bg-emerald-400' : 'bg-emerald-500'
                }`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${
                  hasNewEventPulse || unreadTelemetryCount > 0 ? 'bg-emerald-400' : 'bg-emerald-500'
                }`}></span>
              </span>
              <Terminal className="w-3 h-3 text-amber-400 group-hover:rotate-6 transition-transform" />
              <span className="font-bold hidden sm:inline">WEBHOOKS:</span>
              <span className="text-amber-400 font-bold">{telemetryCount}</span>
            </button>
          )}

          {/* Weather Sensor Tooltip */}
          <StatusTooltip
            title="JOBSITE WEATHER SENSOR & CRANE TELEMETRY"
            statusText={`${weather.condition.toUpperCase()} • ${weather.windMph} MPH`}
            statusBadgeColor={weather.windMph > 25 ? 'red' : 'sky'}
            definition="Micro-climate anemometer & barometric sensors situated atop Tower Crane 1 jib."
            benchmark="Crane pick shutoff threshold: 30 mph sustained gusts"
            superTip={weather.windMph > 20 ? 'High winds detected. Cease all tandem crane picks and secure loose plywood.' : 'Weather is within safe operating parameters for concrete hydration and roofing.'}
          >
            <div className="flex items-center gap-2 bg-slate-900/90 px-2.5 py-1 rounded-md border border-slate-700/80">
              {getWeatherIcon(weather.condition)}
              <span className="font-mono font-bold text-slate-200">{weather.tempF}°F</span>
              <span className="text-slate-400 hidden sm:inline">{weather.condition}</span>
              <span className="text-slate-500 font-mono hidden md:inline">({weather.windMph} mph)</span>
            </div>
          </StatusTooltip>

          {/* Overall Field Risk Badge Tooltip */}
          <StatusTooltip
            title="FIELD CONTROL & RISK INDEX"
            statusText={risk.label}
            statusBadgeColor={stats.safety < 50 ? 'red' : stats.safety < 70 ? 'amber' : 'emerald'}
            definition={risk.desc}
            benchmark="Floor: Safety 50% | Critical Path Float > 0 Days"
            superTip="Balanced superintendents prioritize life-safety first; schedule float can be recouped through resequencing."
          >
            <div className={`px-2.5 py-1 rounded-md border text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 ${risk.bg}`}>
              {stats.safety < 50 ? <AlertTriangle className="w-3 h-3 text-red-400" /> : <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
              {risk.label}
            </div>
          </StatusTooltip>

        </div>
      </div>

      {/* Main HUD Metrics Bar (Iron Triangle + Safety) */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
          
          {/* Day & Timeline Card */}
          <StatusTooltip
            title="WORK SHIFT PROGRESSION"
            statusText={`DAY ${currentDay} OF ${totalDays}`}
            statusBadgeColor="amber"
            definition="5-Day high-stakes project simulation tracking daily trade coordination, inspection sign-offs, and critical path progression."
            benchmark="07:00 AM Shift Start &bull; 17:30 Daily Log Lock"
            superTip="Each day represents 1,200+ worker-hours of trade coordination. Early decisions compound throughout the week."
            className="col-span-2 md:col-span-1"
          >
            <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800/90 flex flex-col justify-between h-full hover:border-slate-700 transition-all shadow-lg">
              <div className="flex items-center justify-between text-slate-400 text-[10px] font-mono tracking-wider uppercase mb-1">
                <span>WORK SHIFT</span>
                <span className="text-amber-400 font-bold">DAY {currentDay} / {totalDays}</span>
              </div>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-2xl font-black font-display tracking-tight text-white">DAY {currentDay}</span>
                <span className="text-xs text-slate-400 font-mono">07:00 - 17:30</span>
              </div>
              <div className="w-full bg-slate-800/80 h-1.5 rounded-full mt-2.5 overflow-hidden">
                <div 
                  className="bg-amber-500 h-full transition-all duration-500 shadow-sm shadow-amber-500" 
                  style={{ width: `${(currentDay / totalDays) * 100}%` }}
                />
              </div>
            </div>
          </StatusTooltip>

          {/* Metric 1: Safety & OSHA Compliance (Zero-Tolerance) */}
          <StatusTooltip
            title="OSHA SAFETY & ZERO-TOLERANCE INDEX"
            statusText={isSafetyCritical ? 'CRITICAL STOP-WORK RISK' : isSafetyWarning ? 'INSPECTION AT RISK' : 'COMPLIANT (95%+)'}
            statusBadgeColor={isSafetyCritical ? 'red' : isSafetyWarning ? 'amber' : 'emerald'}
            definition="Enforces OSHA 29 CFR 1926 Safety & Health Regulations for Construction. Scores below 50% trigger automatic Stop-Work Authority."
            benchmark="Floor: 50% (Hard Stop) • Target: 100%"
            superTip="Click this card to open the Interactive Field Safety & Audit Center."
            className="w-full"
          >
            <div 
              onClick={onOpenSafetyDashboard}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer h-full flex flex-col justify-between ${
                isSafetyCritical 
                  ? 'bg-red-950/60 border-red-500/80 critical-stop-work-glow' 
                  : isSafetyWarning 
                    ? 'bg-amber-950/40 border-amber-500/60 hover:border-amber-500' 
                    : 'bg-slate-950/80 border-slate-800/90 hover:border-emerald-500/50'
              } shadow-lg`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono font-semibold tracking-wider text-slate-400 uppercase flex items-center gap-1.5">
                  <ShieldAlert className={`w-3.5 h-3.5 ${isSafetyCritical ? 'text-red-500' : isSafetyWarning ? 'text-amber-400' : 'text-emerald-400'}`} />
                  OSHA SAFETY
                </span>
                <span className={`text-[9px] font-bold font-mono px-1.5 py-0.5 rounded ${
                  isSafetyCritical 
                    ? 'bg-red-600 text-white' 
                    : isSafetyWarning 
                      ? 'bg-amber-500/20 text-amber-300' 
                      : 'bg-emerald-500/20 text-emerald-300'
                }`}>
                  {isSafetyCritical ? 'STOP-WORK RISK' : isSafetyWarning ? 'WARNING' : 'COMPLIANT'}
                </span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className={`text-2xl font-black font-mono ${
                  isSafetyCritical ? 'text-red-400' : isSafetyWarning ? 'text-amber-300' : 'text-emerald-400'
                }`}>
                  {Math.round(stats.safety)}%
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Floor: 50%</span>
              </div>
              <div className="w-full bg-slate-800/80 h-1.5 rounded-full mt-2.5 overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${
                    isSafetyCritical ? 'bg-red-600' : isSafetyWarning ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.max(0, Math.min(100, stats.safety))}%` }}
                />
              </div>
            </div>
          </StatusTooltip>

          {/* Metric 2: Master Schedule & Float */}
          <StatusTooltip
            title="CRITICAL PATH SCHEDULE & FLOAT"
            statusText={stats.scheduleVarianceDays >= 0 ? `+${stats.scheduleVarianceDays}d Float` : `${stats.scheduleVarianceDays}d Delayed`}
            statusBadgeColor={stats.scheduleVarianceDays >= 0 ? 'sky' : 'red'}
            definition="Critical Path Method (CPM) baseline schedule. Total Float represents days an activity can be delayed without extending the contract completion date."
            benchmark="Baseline: 0.0 Days Float • Liquidated Damages: $15,000/day"
            superTip="Protecting schedule float gives the field flexibility to absorb rain days and inspector delays."
            className="w-full"
          >
            <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800/90 h-full flex flex-col justify-between hover:border-sky-500/50 transition-all shadow-lg">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono font-semibold tracking-wider text-slate-400 uppercase flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-sky-400" />
                  CRITICAL PATH
                </span>
                <span className={`text-[10px] font-bold font-mono px-1.5 py-0.5 rounded ${
                  stats.scheduleVarianceDays >= 0 
                    ? 'bg-sky-500/20 text-sky-300' 
                    : 'bg-red-500/20 text-red-300'
                }`}>
                  {stats.scheduleVarianceDays >= 0 ? `+${stats.scheduleVarianceDays}d Float` : `${stats.scheduleVarianceDays}d Delayed`}
                </span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-black font-mono text-sky-300">
                  {Math.round(stats.schedulePercent)}%
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Target: 100%</span>
              </div>
              <div className="w-full bg-slate-800/80 h-1.5 rounded-full mt-2.5 overflow-hidden">
                <div 
                  className="bg-sky-500 h-full transition-all duration-500"
                  style={{ width: `${Math.max(0, Math.min(100, stats.schedulePercent))}%` }}
                />
              </div>
            </div>
          </StatusTooltip>

          {/* Metric 3: Budget & Contingency */}
          <StatusTooltip
            title="OWNER & CONTRACTOR CONTINGENCY"
            statusText={`$${(stats.remainingContingency || 0).toLocaleString()} LEFT`}
            statusBadgeColor="amber"
            definition="Reserve capital allocated for unforeseen subsurface conditions, accelerated trade overtime, and engineered field fixes."
            benchmark={`Spent: $${(stats.contingencySpent || 0).toLocaleString()} &bull; Budget Remaining: ${Math.round(stats.budgetPercent)}%`}
            superTip="Don't burn contingency on preventable trade coordination blunders. Reserve it for structural unknowns."
            className="w-full"
          >
            <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800/90 h-full flex flex-col justify-between hover:border-amber-500/50 transition-all shadow-lg">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono font-semibold tracking-wider text-slate-400 uppercase flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-amber-400" />
                  CONTINGENCY
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  -${(stats.contingencySpent || 0).toLocaleString()}
                </span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-lg sm:text-xl font-black font-mono text-amber-300 truncate">
                  ${(stats.remainingContingency || 0).toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">{Math.round(stats.budgetPercent)}%</span>
              </div>
              <div className="w-full bg-slate-800/80 h-1.5 rounded-full mt-2.5 overflow-hidden">
                <div 
                  className="bg-amber-500 h-full transition-all duration-500"
                  style={{ width: `${Math.max(0, Math.min(100, stats.budgetPercent))}%` }}
                />
              </div>
            </div>
          </StatusTooltip>

          {/* Metric 4: Trade Morale & Spec Quality Index */}
          <StatusTooltip
            title="TRADE MORALE & SPEC QUALITY"
            statusText={stats.subMorale >= 80 ? 'HIGH TRUST' : stats.subMorale >= 60 ? 'MODERATE' : 'FRICTION'}
            statusBadgeColor={stats.subMorale >= 75 ? 'indigo' : 'amber'}
            definition="Tracks subcontractor partner trust, daily trade cooperation, and QA/QC specification adherence without punch-list backlog."
            benchmark={`QC Spec Index: ${Math.round(stats.qualityScore)}% &bull; Morale: ${Math.round(stats.subMorale)}%`}
            superTip="A respected superintendent who listens to foremen prevents slow-downs and costly trade stacking."
            className="col-span-2 sm:col-span-1"
          >
            <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800/90 h-full flex flex-col justify-between hover:border-indigo-500/50 transition-all shadow-lg">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono font-semibold tracking-wider text-slate-400 uppercase flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-indigo-400" />
                  TRADE MORALE
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  QC: {Math.round(stats.qualityScore)}%
                </span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-black font-mono text-indigo-300">
                  {Math.round(stats.subMorale)}%
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  {stats.subMorale >= 80 ? 'High Trust' : stats.subMorale >= 60 ? 'Moderate' : 'Friction'}
                </span>
              </div>
              <div className="w-full bg-slate-800/80 h-1.5 rounded-full mt-2.5 overflow-hidden">
                <div 
                  className="bg-indigo-500 h-full transition-all duration-500"
                  style={{ width: `${Math.max(0, Math.min(100, stats.subMorale))}%` }}
                />
              </div>
            </div>
          </StatusTooltip>

        </div>

        {/* Active Critical Path Ribbon with Tooltip */}
        <StatusTooltip
          title="ACTIVE CRITICAL PATH MILESTONE"
          statusText="ZERO SLACK TASK"
          statusBadgeColor="amber"
          definition={`Any delay to "${activeCriticalPath}" directly impacts final substantial completion date.`}
          benchmark="Target: Turn Over by Friday 17:00 Shift Close"
          superTip="Prioritize crane hook time and inspector walk-throughs for critical path trades first."
          className="w-full"
        >
          <div className="mt-3 py-2 px-3.5 bg-slate-950/90 rounded-xl border border-slate-800/90 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs hover:border-amber-500/40 transition-all">
            <div className="flex items-center gap-2.5">
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 font-mono font-bold text-[10px] uppercase tracking-wider">
                CRITICAL PATH ACTIVITY
              </span>
              <span className="font-semibold text-slate-200">{activeCriticalPath}</span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              <span>Zero-Tolerance Target: Zero LTIs • Deliver by Friday 17:00</span>
            </div>
          </div>
        </StatusTooltip>

      </div>
    </div>
  );
};
