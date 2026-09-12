import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Clock, 
  MapPin, 
  Users, 
  Shield, 
  TrendingUp, 
  Wrench, 
  Flame, 
  Zap, 
  Radio, 
  CheckCircle2,
  ChevronRight,
  Info,
  Mic,
  Sparkles,
  Camera
} from 'lucide-react';
import { Scenario, ScenarioOption, ProjectType, IronTriangleStats, ArtifactType } from '../types';
import { FreeformRadioDirective } from './FreeformRadioDirective';
import { SiteInspectionMonitor } from './SiteInspectionMonitor';
import { StatusTooltip } from './StatusTooltip';

interface ScenarioCardProps {
  scenario: Scenario;
  onSelectOption: (option: ScenarioOption, artifactType?: ArtifactType) => void;
  urgencyMemo?: string | null;
  disabled?: boolean;
  projectType: ProjectType;
  superName: string;
  currentStats: IronTriangleStats;
}

export const ScenarioCard: React.FC<ScenarioCardProps> = ({
  scenario,
  onSelectOption,
  urgencyMemo,
  disabled = false,
  projectType,
  superName,
  currentStats
}) => {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [orderMode, setOrderMode] = useState<'PRESETS' | 'FREEFORM'>('PRESETS');
  const [showInspectionMonitor, setShowInspectionMonitor] = useState<boolean>(true);

  const getThreatBadge = (level: string) => {
    switch (level) {
      case 'EMERGENCY':
        return 'bg-red-500/20 text-red-400 border-red-500/40 animate-pulse';
      case 'CRITICAL':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      case 'ELEVATED':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/40';
      default:
        return 'bg-slate-700 text-slate-300 border-slate-600';
    }
  };

  const getOptionStyle = (type: string, isSelected: boolean) => {
    let border = 'border-slate-800 hover:border-slate-700 bg-slate-900/70';
    let badge = 'bg-slate-800 text-slate-300';
    let icon = <Wrench className="w-4 h-4 text-slate-400" />;

    if (type === 'conservative') {
      border = isSelected 
        ? 'border-emerald-500 bg-emerald-950/20 ring-2 ring-emerald-500/30' 
        : 'border-slate-800 hover:border-emerald-500/60 bg-slate-900/60';
      badge = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      icon = <Shield className="w-4 h-4 text-emerald-400" />;
    } else if (type === 'aggressive') {
      border = isSelected 
        ? 'border-red-500 bg-red-950/20 ring-2 ring-red-500/30' 
        : 'border-slate-800 hover:border-red-500/60 bg-slate-900/60';
      badge = 'bg-red-500/20 text-red-300 border-red-500/30';
      icon = <Zap className="w-4 h-4 text-red-400" />;
    } else if (type === 'collaborative') {
      border = isSelected 
        ? 'border-amber-500 bg-amber-950/20 ring-2 ring-amber-500/30' 
        : 'border-slate-800 hover:border-amber-500/60 bg-slate-900/60';
      badge = 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      icon = <TrendingUp className="w-4 h-4 text-amber-400" />;
    }

    return { border, badge, icon };
  };

  const handleChoose = (opt: ScenarioOption, idx: number) => {
    if (disabled) return;
    setSelectedIdx(idx);
    onSelectOption(opt);
  };

  return (
    <div className="w-full bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border-b border-slate-800">
        
        {/* Top metadata badges */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-amber-500 text-slate-950 rounded-lg text-xs font-mono font-black uppercase tracking-wider shadow-sm">
              DAY {scenario.day} • {scenario.time}
            </span>
            <span className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold uppercase tracking-wider border ${getThreatBadge(scenario.threatLevel)}`}>
              {scenario.threatLevel} DILEMMA
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span className="truncate max-w-[220px] sm:max-w-none">{scenario.location}</span>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-white leading-tight uppercase mb-3">
          {scenario.title}
        </h2>

        {/* Critical Path Task Ribbon */}
        <div className="flex items-center gap-2 text-xs font-mono text-amber-300/90 bg-amber-950/30 p-2.5 rounded-xl border border-amber-500/20 mb-4">
          <Flame className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="font-bold text-amber-400">TARGET SCHEDULE MILESTONE:</span>
          <span className="text-slate-200">{scenario.criticalPathTask}</span>
        </div>

        {/* Scenario Dilemma Narrative */}
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          {scenario.description}
        </p>

        {/* Trades Present Tags & Live Camera Toggle */}
        <div className="mt-4 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-500 font-mono flex items-center gap-1">
              <Users className="w-3.5 h-3.5" /> Trades Active:
            </span>
            {scenario.keyTrades.map((trade, i) => (
              <span key={i} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[11px] border border-slate-700/80">
                {trade}
              </span>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setShowInspectionMonitor(!showInspectionMonitor)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-amber-500/40 text-xs font-mono font-bold transition-all shadow-md cursor-pointer"
          >
            <Camera className="w-3.5 h-3.5 text-amber-400" />
            <span>{showInspectionMonitor ? 'HIDE CCTV FEED' : 'INSPECT JOBSITE CCTV (CAM-01)'}</span>
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
          </button>
        </div>

        {/* Live CCTV / Drone Inspection View */}
        {showInspectionMonitor && (
          <div className="mt-5 pt-4 border-t border-slate-800/80">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                <span className="text-[11px] font-mono text-amber-400 uppercase tracking-wider font-bold">
                  OPTICAL RECONNAISSANCE • {scenario.cctvCameraId || 'CAM-01'} FIELD TELEMETRY
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                AISC/OSHA SENSOR OVERLAY ACTIVE
              </span>
            </div>
            <SiteInspectionMonitor scenario={scenario} projectName={projectType} />
          </div>
        )}

        {/* AI Radio Urgency Memo if available */}
        {urgencyMemo && (
          <div className="mt-4 p-3 bg-slate-950 rounded-xl border border-amber-500/40 text-xs font-mono text-amber-300 flex items-start gap-2.5">
            <Radio className="w-4 h-4 text-amber-400 shrink-0 mt-0.5 animate-pulse" />
            <div>
              <span className="font-bold uppercase tracking-wider text-amber-400 mr-2">[FIELD RADIO TRANSMISSION]:</span>
              <span className="italic text-slate-200">"{urgencyMemo}"</span>
            </div>
          </div>
        )}
      </div>

      {/* Mode Selector Tab Bar */}
      <div className="px-6 pt-4 pb-0 bg-slate-950/80 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setOrderMode('PRESETS')}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-mono font-bold tracking-wider uppercase transition-all cursor-pointer flex items-center gap-2 border-t border-x ${
              orderMode === 'PRESETS'
                ? 'bg-slate-900 text-amber-400 border-slate-800 border-b-transparent shadow-md'
                : 'text-slate-400 hover:text-slate-200 border-transparent'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>3 Standard Tactical Orders</span>
          </button>

          <button
            type="button"
            onClick={() => setOrderMode('FREEFORM')}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-mono font-bold tracking-wider uppercase transition-all cursor-pointer flex items-center gap-2 border-t border-x ${
              orderMode === 'FREEFORM'
                ? 'bg-slate-950 text-amber-400 border-amber-500/40 border-b-transparent shadow-md'
                : 'text-slate-400 hover:text-amber-300 border-transparent'
            }`}
          >
            <Mic className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>Freeform Radio Directive</span>
            <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/40">
              AI SCORING
            </span>
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-[11px] font-mono text-slate-500 pb-2">
          {orderMode === 'PRESETS' ? (
            <span>Or click Radio Directive to speak/type unscripted orders</span>
          ) : (
            <span>Evaluates OSHA • Clarity • Trade Friction • Liability</span>
          )}
        </div>
      </div>

      {/* Main Tactical Action Area */}
      <div className="p-6 sm:p-8 space-y-4 bg-slate-950/60">
        {orderMode === 'FREEFORM' ? (
          <FreeformRadioDirective
            scenario={scenario}
            projectType={projectType}
            superName={superName}
            currentStats={currentStats}
            onExecuteDirective={(opt, artifactType) => onSelectOption(opt, artifactType)}
            disabled={disabled}
          />
        ) : (
          <>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-mono font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <Info className="w-3.5 h-3.5 text-amber-400" />
                SELECT TACTICAL SUPERINTENDENT ACTION (CHOOSE 1 OF 3)
              </h3>
              <button
                type="button"
                onClick={() => setOrderMode('FREEFORM')}
                className="text-[11px] font-mono text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
              >
                <Radio className="w-3 h-3" />
                <span>Switch to Verbal Radio Order</span>
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {scenario.options.map((option, idx) => {
                const isSelected = selectedIdx === idx;
                const style = getOptionStyle(option.type, isSelected);

                return (
                  <button
                    key={idx}
                    disabled={disabled}
                    onClick={() => handleChoose(option, idx)}
                    className={`group text-left p-5 sm:p-6 rounded-2xl border transition-all duration-200 cursor-pointer relative overflow-hidden ${style.border} ${
                      disabled ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border flex items-center gap-1.5 ${style.badge}`}>
                            {style.icon}
                            {option.strategyBadge}
                          </span>
                        </div>

                        <h4 className="text-base sm:text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
                          {option.actionTitle}
                        </h4>

                        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                          {option.description}
                        </p>

                        {/* Anticipated Tradeoffs Pill Bar */}
                        <div className="pt-2 flex flex-wrap items-center gap-2 text-[11px] font-mono">
                          <StatusTooltip
                            title="SAFETY IMPACT PROJECTION"
                            statusText={option.impact.safety >= 0 ? `+${option.impact.safety}%` : `${option.impact.safety}%`}
                            statusBadgeColor={option.impact.safety >= 0 ? 'emerald' : 'red'}
                            definition="Projected impact on OSHA 1926 compliance score and jobsite inspection readiness."
                            benchmark="Safety < 50% triggers mandatory Jobsite Stand-Down"
                          >
                            <span className={`px-2 py-0.5 rounded cursor-help ${
                              option.impact.safety >= 0 ? 'bg-emerald-950/80 text-emerald-400' : 'bg-red-950/80 text-red-400'
                            }`}>
                              Safety: {option.impact.safety >= 0 ? `+${option.impact.safety}%` : `${option.impact.safety}%`}
                            </span>
                          </StatusTooltip>

                          <StatusTooltip
                            title="SCHEDULE FLOAT IMPACT"
                            statusText={option.impact.scheduleDays >= 0 ? `+${option.impact.scheduleDays}d Float` : `${option.impact.scheduleDays}d Delay`}
                            statusBadgeColor={option.impact.scheduleDays >= 0 ? 'sky' : 'red'}
                            definition="Critical Path Method delta affecting Friday 17:00 handover milestone."
                            benchmark="Negative float exposes project to liquidated damages"
                          >
                            <span className={`px-2 py-0.5 rounded cursor-help ${
                              option.impact.scheduleDays >= 0 ? 'bg-sky-950/80 text-sky-400' : 'bg-red-950/80 text-red-400'
                            }`}>
                              Sched: {option.impact.scheduleDays >= 0 ? `+${option.impact.scheduleDays}d` : `${option.impact.scheduleDays}d`}
                            </span>
                          </StatusTooltip>

                          <StatusTooltip
                            title="CONTINGENCY BUDGET BURN"
                            statusText={`-$${option.impact.contingencySpent.toLocaleString()}`}
                            statusBadgeColor="amber"
                            definition="Direct financial draw against contractor/owner reserve contingency fund."
                            benchmark="Unplanned burn reduces buffer for structural surprises"
                          >
                            <span className="px-2 py-0.5 rounded bg-amber-950/80 text-amber-400 cursor-help">
                              Cost: -${option.impact.contingencySpent.toLocaleString()}
                            </span>
                          </StatusTooltip>

                          <StatusTooltip
                            title="QUALITY CONTROL SPEC INDEX"
                            statusText={option.impact.quality >= 0 ? `+${option.impact.quality}%` : `${option.impact.quality}%`}
                            statusBadgeColor={option.impact.quality >= 0 ? 'indigo' : 'red'}
                            definition="Fidelity to project specifications, shop drawings, and structural tolerances."
                            benchmark="Substandard quality risks punch-list delays or structural rework"
                          >
                            <span className={`px-2 py-0.5 rounded cursor-help ${
                              option.impact.quality >= 0 ? 'bg-indigo-950/80 text-indigo-400' : 'bg-red-950/80 text-red-400'
                            }`}>
                              QC: {option.impact.quality >= 0 ? `+${option.impact.quality}%` : `${option.impact.quality}%`}
                            </span>
                          </StatusTooltip>
                        </div>
                      </div>

                      {/* Arrow Action Button */}
                      <div className="shrink-0 flex sm:flex-col items-center justify-end">
                        <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 group-hover:bg-amber-500 group-hover:text-slate-950 group-hover:border-amber-400 transition-all shadow-md">
                          <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
