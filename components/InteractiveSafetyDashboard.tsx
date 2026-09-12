import React, { useState } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  X, 
  Flame, 
  HardHat, 
  Clock, 
  Users, 
  FileCheck, 
  Sparkles, 
  Radio, 
  Plus, 
  Send,
  Eye,
  Info
} from 'lucide-react';
import { SafetyAuditItem, IronTriangleStats, ProjectType } from '../types';
import { INITIAL_SAFETY_AUDIT_ITEMS, SAFETY_TOOLBOX_TALKS } from '../services/siteMediaData';
import { StatusTooltip } from './StatusTooltip';

interface InteractiveSafetyDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  stats: IronTriangleStats;
  onUpdateSafetyScore?: (newScore: number) => void;
  projectType: ProjectType;
  superName: string;
  currentDay: number;
}

export const InteractiveSafetyDashboard: React.FC<InteractiveSafetyDashboardProps> = ({
  isOpen,
  onClose,
  stats,
  onUpdateSafetyScore,
  projectType,
  superName,
  currentDay
}) => {
  const [activeTab, setActiveTab] = useState<'AUDIT' | 'TOOLBOX' | 'NEAR_MISS' | 'OSHA_STANDARDS'>('AUDIT');
  const [auditItems, setAuditItems] = useState<SafetyAuditItem[]>(INITIAL_SAFETY_AUDIT_ITEMS);
  const [selectedToolboxId, setSelectedToolboxId] = useState<string>('TB-01');
  const [signedTalks, setSignedTalks] = useState<Record<string, string>>({
    'TB-01': 'Signed by J. Morrison at 07:00 AM'
  });
  const [nearMisses, setNearMisses] = useState([
    {
      id: 'NM-101',
      date: `Day ${currentDay} • 08:15 AM`,
      location: 'Level 4 Perimeter Cantilever',
      description: 'Decking bundle caught wind gust during crane swing; tag line held load within safety perimeter.',
      actionTaken: 'Enforced dual tag line rule and suspended picks until gust dropped below 20 mph.',
      severity: 'MODERATE'
    },
    {
      id: 'NM-102',
      date: `Day ${Math.max(1, currentDay - 1)} • 02:40 PM`,
      location: 'Substructure Mat Foundation Pit',
      description: 'Subcontractor stepped over rebar dowels without protective mushroom caps.',
      actionTaken: 'All exposed vertical #8 rebar capped immediately. Trade foreman issued written safety memo.',
      severity: 'LOW'
    }
  ]);

  const [newHazardText, setNewHazardText] = useState('');
  const [newHazardLocation, setNewHazardLocation] = useState('');
  const [isAddingHazard, setIsAddingHazard] = useState(false);

  if (!isOpen) return null;

  // Toggle item compliance status
  const handleToggleStatus = (id: string) => {
    setAuditItems(prev => {
      const next = prev.map(item => {
        if (item.id === id) {
          const nextStatus = item.status === 'COMPLIANT' 
            ? 'WARNING' 
            : item.status === 'WARNING' 
              ? 'VIOLATION' 
              : 'COMPLIANT';
          return { ...item, status: nextStatus as any };
        }
        return item;
      });

      // Recalculate dynamic safety score if callback provided
      if (onUpdateSafetyScore) {
        const compliantCount = next.filter(i => i.status === 'COMPLIANT').length;
        const warningCount = next.filter(i => i.status === 'WARNING').length;
        const violationCount = next.filter(i => i.status === 'VIOLATION').length;
        const rawScore = Math.max(35, Math.round((compliantCount * 100 + warningCount * 60 + violationCount * 20) / next.length));
        onUpdateSafetyScore(rawScore);
      }

      return next;
    });
  };

  const handleMarkAllCompliant = () => {
    setAuditItems(prev => prev.map(item => ({ ...item, status: 'COMPLIANT' })));
    if (onUpdateSafetyScore) {
      onUpdateSafetyScore(Math.min(100, Math.max(stats.safety, 96)));
    }
  };

  const handleSignToolboxTalk = (id: string) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setSignedTalks(prev => ({
      ...prev,
      [id]: `Signed & Logged by ${superName} at ${timestamp}`
    }));
  };

  const handleAddHazard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHazardText.trim()) return;

    setNearMisses(prev => [
      {
        id: `NM-${100 + prev.length + 1}`,
        date: `Day ${currentDay} • Just Now`,
        location: newHazardLocation.trim() || 'Active Jobsite Zone',
        description: newHazardText.trim(),
        actionTaken: 'Superintendent on-site corrective directive issued. Verified in person.',
        severity: 'MODERATE'
      },
      ...prev
    ]);

    setNewHazardText('');
    setNewHazardLocation('');
    setIsAddingHazard(false);
  };

  const compliantCount = auditItems.filter(i => i.status === 'COMPLIANT').length;
  const violationCount = auditItems.filter(i => i.status === 'VIOLATION').length;
  const warningCount = auditItems.filter(i => i.status === 'WARNING').length;

  const currentTalk = SAFETY_TOOLBOX_TALKS.find(t => t.id === selectedToolboxId) || SAFETY_TOOLBOX_TALKS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden text-slate-100"
        onClick={e => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-2xl border ${
              stats.safety < 50 
                ? 'bg-red-500/20 text-red-400 border-red-500/50' 
                : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50'
            }`}>
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono text-[10px] font-bold uppercase tracking-wider border border-emerald-500/30">
                  OSHA 1926 ZERO-TOLERANCE PROTOCOL
                </span>
                <span className="text-slate-500 text-xs hidden sm:inline">•</span>
                <span className="text-xs font-mono text-slate-400 hidden sm:inline">
                  {projectType}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black font-display tracking-tight text-white mt-0.5">
                FIELD SAFETY & AUDIT CENTER
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer border border-slate-700"
            title="Close Safety Dashboard"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top Critical Telemetry Banner */}
        <div className="bg-slate-950/80 px-5 sm:px-6 py-3 border-b border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800 flex flex-col">
            <span className="text-[10px] font-mono text-slate-400 uppercase">OSHA Safety Index</span>
            <div className="flex items-baseline justify-between mt-1">
              <span className={`text-xl font-black font-mono ${stats.safety < 50 ? 'text-red-400' : 'text-emerald-400'}`}>
                {Math.round(stats.safety)}%
              </span>
              <span className="text-[10px] font-mono text-slate-500">Floor: 50%</span>
            </div>
          </div>

          <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800 flex flex-col">
            <span className="text-[10px] font-mono text-slate-400 uppercase">Total Recordable Rate (TRIR)</span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-xl font-black font-mono text-sky-400">0.00</span>
              <span className="text-[10px] font-mono text-emerald-400 font-bold">ZERO LTIs</span>
            </div>
          </div>

          <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800 flex flex-col">
            <span className="text-[10px] font-mono text-slate-400 uppercase">Days Without Lost Time</span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-xl font-black font-mono text-amber-400">184</span>
              <span className="text-[10px] font-mono text-slate-500">Consecutive</span>
            </div>
          </div>

          <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800 flex flex-col">
            <span className="text-[10px] font-mono text-slate-400 uppercase">Stop-Work Authority</span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-sm font-black font-mono text-emerald-300 uppercase">ARMED & ACTIVE</span>
              <span className="text-[10px] font-mono text-slate-400">29 CFR 1926</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-5 sm:px-6 pt-3 bg-slate-900/60 border-b border-slate-800 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('AUDIT')}
            className={`px-4 py-2 text-xs font-mono font-bold rounded-t-xl transition-all border-t border-x cursor-pointer ${
              activeTab === 'AUDIT'
                ? 'bg-slate-950 text-amber-400 border-slate-700 shadow-lg'
                : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-800/40'
            }`}
          >
            DAILY AUDIT CHECKLIST ({compliantCount}/{auditItems.length})
          </button>
          <button
            onClick={() => setActiveTab('TOOLBOX')}
            className={`px-4 py-2 text-xs font-mono font-bold rounded-t-xl transition-all border-t border-x cursor-pointer ${
              activeTab === 'TOOLBOX'
                ? 'bg-slate-950 text-amber-400 border-slate-700 shadow-lg'
                : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-800/40'
            }`}
          >
            DAILY TOOLBOX TALK
          </button>
          <button
            onClick={() => setActiveTab('NEAR_MISS')}
            className={`px-4 py-2 text-xs font-mono font-bold rounded-t-xl transition-all border-t border-x cursor-pointer ${
              activeTab === 'NEAR_MISS'
                ? 'bg-slate-950 text-amber-400 border-slate-700 shadow-lg'
                : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-800/40'
            }`}
          >
            NEAR-MISS LOG ({nearMisses.length})
          </button>
          <button
            onClick={() => setActiveTab('OSHA_STANDARDS')}
            className={`px-4 py-2 text-xs font-mono font-bold rounded-t-xl transition-all border-t border-x cursor-pointer ${
              activeTab === 'OSHA_STANDARDS'
                ? 'bg-slate-950 text-amber-400 border-slate-700 shadow-lg'
                : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-800/40'
            }`}
          >
            OSHA PROTOCOLS
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          
          {/* 1. Daily Audit Checklist Tab */}
          {activeTab === 'AUDIT' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                <div>
                  <h3 className="font-bold text-white text-sm">Interactive Jobsite Safety Inspection</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Click any item to cycle status (<span className="text-emerald-400">Compliant</span> &rarr; <span className="text-amber-400">Warning</span> &rarr; <span className="text-red-400">Violation</span>). Safety score automatically updates.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleMarkAllCompliant}
                  className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold transition-all cursor-pointer whitespace-nowrap self-start sm:self-auto"
                >
                  ✓ VERIFY ALL COMPLIANT
                </button>
              </div>

              {/* Items List */}
              <div className="space-y-2.5">
                {auditItems.map(item => (
                  <div
                    key={item.id}
                    onClick={() => handleToggleStatus(item.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer select-none flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      item.status === 'COMPLIANT'
                        ? 'bg-slate-950/80 border-slate-800 hover:border-emerald-500/50'
                        : item.status === 'WARNING'
                          ? 'bg-amber-950/30 border-amber-500/50 hover:border-amber-500'
                          : 'bg-red-950/30 border-red-500/60 hover:border-red-500'
                    }`}
                  >
                    <div className="space-y-1 max-w-xl">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">
                          {item.id} • {item.category}
                        </span>
                        <span className="text-slate-600">|</span>
                        <span className="text-[10px] font-mono text-amber-400/90 font-semibold">
                          {item.standard}
                        </span>
                        {item.criticality === 'LIFE_SAFETY' && (
                          <span className="px-1.5 py-0.2 rounded bg-red-500/20 text-red-400 text-[9px] font-mono font-bold border border-red-500/30">
                            LIFE-SAFETY
                          </span>
                        )}
                      </div>
                      <h4 className="font-semibold text-white text-sm">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-400">
                        {item.notes}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                      <span className={`px-3 py-1 rounded-xl text-xs font-mono font-bold border uppercase tracking-wider flex items-center gap-1.5 ${
                        item.status === 'COMPLIANT'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : item.status === 'WARNING'
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                            : 'bg-red-500/20 text-red-300 border-red-500/40'
                      }`}>
                        {item.status === 'COMPLIANT' ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span>COMPLIANT</span>
                          </>
                        ) : item.status === 'WARNING' ? (
                          <>
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                            <span>WARNING</span>
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                            <span>VIOLATION</span>
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. Daily Toolbox Talk Tab */}
          {activeTab === 'TOOLBOX' && (
            <div className="space-y-4">
              {/* Talk Selector Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {SAFETY_TOOLBOX_TALKS.map(talk => {
                  const isSigned = !!signedTalks[talk.id];
                  const isSelected = selectedToolboxId === talk.id;
                  return (
                    <button
                      key={talk.id}
                      onClick={() => setSelectedToolboxId(talk.id)}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-slate-800 border-amber-500 shadow-lg'
                          : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                        <span className="text-slate-500">{talk.id}</span>
                        {isSigned ? (
                          <span className="text-emerald-400 flex items-center gap-1 font-bold">
                            <CheckCircle2 className="w-3 h-3" /> SIGNED
                          </span>
                        ) : (
                          <span className="text-amber-400 font-bold">PENDING</span>
                        )}
                      </div>
                      <h4 className="font-bold text-white text-xs line-clamp-2">
                        {talk.title}
                      </h4>
                      <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-slate-400">
                        <span>{talk.duration}</span>
                        <span>{talk.attendanceExpected} Workers</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Selected Talk Detail Card */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                  <div>
                    <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[10px] font-mono font-bold uppercase border border-amber-500/30">
                      FOCUS TRADE: {currentTalk.focusTrade}
                    </span>
                    <h3 className="text-lg font-bold text-white mt-1">
                      {currentTalk.title}
                    </h3>
                  </div>

                  {signedTalks[currentTalk.id] ? (
                    <div className="px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-mono text-xs">
                      {signedTalks[currentTalk.id]}
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSignToolboxTalk(currentTalk.id)}
                      className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg hover:shadow-amber-500/20"
                    >
                      LOG & SIGN OFF BRIEFING
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
                    Key Mandatory Briefing Points:
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {currentTalk.keyPoints.map((pt, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-900/60 border border-slate-800/80">
                        <span className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 text-amber-400 font-mono font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span className="leading-relaxed">{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* 3. Near-Miss Log Tab */}
          {activeTab === 'NEAR_MISS' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-white text-sm">Jobsite Near-Miss & Leading Indicator Log</h3>
                  <p className="text-xs text-slate-400">
                    Documenting near-misses proactively prevents catastrophic OSHA OSHA recordables.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddingHazard(!isAddingHazard)}
                  className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  LOG FIELD HAZARD
                </button>
              </div>

              {/* Add Hazard Form */}
              {isAddingHazard && (
                <form onSubmit={handleAddHazard} className="bg-slate-950 p-4 rounded-2xl border border-amber-500/40 space-y-3">
                  <h4 className="text-xs font-mono font-bold text-amber-300 uppercase">
                    New Superintendent Hazard Observation
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Specific Jobsite Location (e.g. Level 3 Core Riser)"
                      value={newHazardLocation}
                      onChange={e => setNewHazardLocation(e.target.value)}
                      className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    />
                    <input
                      type="text"
                      placeholder="Hazard Description & Conditions Observed..."
                      value={newHazardText}
                      onChange={e => setNewHazardText(e.target.value)}
                      required
                      className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingHazard(false)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-mono"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs font-mono flex items-center gap-1.5"
                    >
                      <Send className="w-3 h-3" /> Save Observation
                    </button>
                  </div>
                </form>
              )}

              {/* Log list */}
              <div className="space-y-2.5">
                {nearMisses.map(nm => (
                  <div key={nm.id} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-amber-400 font-bold text-[11px]">{nm.id}</span>
                        <span className="text-slate-600">•</span>
                        <span className="font-semibold text-white">{nm.location}</span>
                      </div>
                      <span className="font-mono text-[10px] text-slate-400">{nm.date}</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {nm.description}
                    </p>
                    <div className="pt-2 border-t border-slate-800/80 text-[11px] text-emerald-400 font-mono">
                      <strong>Corrective Action:</strong> {nm.actionTaken}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. OSHA Standards & Stop-Work Protocol Tab */}
          {activeTab === 'OSHA_STANDARDS' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-mono font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>OSHA 1926 FOCUS FOUR HAZARDS IN CONSTRUCTION</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  OSHA's Focus Four account for over 60% of all construction fatalities. As Superintendent, daily vigilance on these four categories is non-negotiable:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <strong className="text-red-400 block mb-1">1. Falls (OSHA 1926.501)</strong>
                    <span className="text-slate-400 text-[11px]">Unprotected sides, leading edges, holes, scaffolds. 100% tie-off required over 6 feet.</span>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <strong className="text-amber-400 block mb-1">2. Struck-By (OSHA 1926.1400)</strong>
                    <span className="text-slate-400 text-[11px]">Crane loads, heavy equipment blind spots, falling tools. Hardhats & barricades mandatory.</span>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <strong className="text-sky-400 block mb-1">3. Caught-In / Between</strong>
                    <span className="text-slate-400 text-[11px]">Trench cave-ins, crane counterweights, rotating machinery. Shoring required at 5+ ft depth.</span>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <strong className="text-yellow-400 block mb-1">4. Electrocution (OSHA 1926.400)</strong>
                    <span className="text-slate-400 text-[11px]">Overhead powerlines, ungrounded temp spider boxes. 10ft minimum clearance from powerlines.</span>
                  </div>
                </div>
              </div>

              {/* General Duty Clause */}
              <div className="p-4 rounded-2xl bg-red-950/20 border border-red-500/30 text-slate-300 space-y-1.5">
                <span className="text-red-400 font-mono font-bold uppercase tracking-wider text-[11px] block">
                  SUPERINTENDENT STOP-WORK AUTHORITY (OSHA SECTION 5(a)(1))
                </span>
                <p className="text-[11px] leading-relaxed text-slate-300">
                  Every worker and supervisor on this jobsite is legally empowered and required to halt any work activity immediately if an imminent danger to life or health is observed. No subcontractor or project executive may overrule a safety shutdown without an engineered and approved abatement.
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-400 font-mono">
            <HardHat className="w-4 h-4 text-amber-400" />
            <span>Field Superintendent: <strong className="text-white">{superName}</strong></span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
          >
            RETURN TO COMMAND VIEW
          </button>
        </div>

      </div>
    </div>
  );
};
