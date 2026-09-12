import React, { useState } from 'react';
import { 
  Award, 
  ShieldCheck, 
  Clock, 
  DollarSign, 
  TrendingUp, 
  Users, 
  Download, 
  Copy, 
  Check, 
  RotateCcw, 
  FileText, 
  AlertTriangle, 
  Sparkles,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { 
  ExecutiveEvaluation, 
  IronTriangleStats, 
  DecisionRecord, 
  SuperintendentProfile, 
  ProjectType 
} from '../types';

interface EvaluationDashboardProps {
  evaluation: ExecutiveEvaluation;
  stats: IronTriangleStats;
  profile: SuperintendentProfile;
  projectType: ProjectType;
  history: DecisionRecord[];
  onRestart: () => void;
}

export const EvaluationDashboard: React.FC<EvaluationDashboardProps> = ({
  evaluation,
  stats,
  profile,
  projectType,
  history,
  onRestart
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'postmortem' | 'chronicle' | 'raw_report'>('overview');

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(evaluation.markdownReport);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    const element = document.createElement('a');
    const file = new Blob([evaluation.markdownReport], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = `${profile.name.replace(/\s+/g, '_')}_Superintendent_Evaluation.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleDownloadJSON = () => {
    const element = document.createElement('a');
    const data = {
      candidate: profile,
      project: projectType,
      stats,
      evaluation,
      history
    };
    const file = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    element.href = URL.createObjectURL(file);
    element.download = `${profile.name.replace(/\s+/g, '_')}_SuperSim_Audit.json`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const getHireBadge = () => {
    switch (evaluation.hireStatus) {
      case 'HIRE_SENIOR_LEAD':
        return {
          label: 'HIRE: SENIOR LEAD SUPERINTENDENT',
          bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          dot: 'bg-emerald-400'
        };
      case 'HIRE_PROJECT_SUPER':
        return {
          label: 'HIRE: PROJECT SUPERINTENDENT',
          bg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          dot: 'bg-amber-400'
        };
      case 'CONDITIONAL_TRAINING':
        return {
          label: 'CONDITIONAL: MENTORSHIP REQUIRED',
          bg: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
          dot: 'bg-orange-400'
        };
      case 'DO_NOT_HIRE':
      default:
        return {
          label: 'DISQUALIFIED: OSHA/LIABILITY DEFICIT',
          bg: 'bg-red-500/20 text-red-300 border-red-500/40',
          dot: 'bg-red-400'
        };
    }
  };

  const hire = getHireBadge();

  return (
    <div className="min-h-screen bg-slate-950 blueprint-grid py-8 px-4 sm:px-6 md:px-10 text-slate-100">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Executive Header Banner */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl relative overflow-hidden">
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
              className="w-full h-full object-cover object-center filter saturate-75 brightness-75 opacity-25"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/85 to-slate-900/95" />
            <div className="absolute inset-0 blueprint-grid opacity-20" />
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            
            {/* Candidate Credentials */}
            <div className="flex items-center gap-5">
              <div className="relative">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-4 border-slate-800 shadow-2xl bg-slate-950">
                  <img 
                    src={profile.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250'} 
                    alt="" 
                    aria-hidden="true"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 p-1.5 bg-amber-500 text-slate-950 rounded-lg shadow">
                  <Award className="w-4 h-4" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase font-bold">
                    PERFORMANCE AUDIT DOSSIER
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="text-[10px] font-mono text-amber-400 font-semibold uppercase">
                    5-DAY SHIFT COMPLETE
                  </span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-black font-display tracking-tight text-white uppercase">
                  {profile.name}
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 font-mono">
                  {projectType} • <span className="text-slate-300 font-semibold">{evaluation.roleClassification}</span>
                </p>
              </div>
            </div>

            {/* Composite Rating Dial & Hire Status */}
            <div className="flex items-center gap-4 self-stretch md:self-auto justify-between md:justify-end border-t md:border-t-0 pt-4 md:pt-0 border-slate-800">
              <div className="text-right">
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider border ${hire.bg} mb-2`}>
                  <span className={`w-2 h-2 rounded-full ${hire.dot} animate-pulse`}></span>
                  <span>{hire.label}</span>
                </div>
                <div className="text-[11px] font-mono text-slate-400">
                  {evaluation.hireStatusLabel}
                </div>
              </div>

              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-slate-950 border-2 border-slate-800 flex flex-col items-center justify-center shadow-inner">
                <span className="text-3xl sm:text-4xl font-black font-mono text-amber-400 leading-none">
                  {evaluation.overallRating}
                </span>
                <span className="text-[9px] font-mono font-bold tracking-widest uppercase text-slate-500 mt-1">
                  OPS INDEX
                </span>
              </div>
            </div>

          </div>

          {/* Action Bar (Export, Copy, New Sim) */}
          <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
            
            {/* View Tabs */}
            <div className="flex items-center gap-2 text-xs font-mono">
              {[
                { id: 'overview', label: 'Iron Triangle' },
                { id: 'postmortem', label: 'Field Post-Mortem' },
                { id: 'chronicle', label: '5-Day Log' },
                { id: 'raw_report', label: 'Executive Memo' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded-lg border transition-all ${
                    activeTab === tab.id
                      ? 'bg-amber-500 text-slate-950 font-bold border-amber-400'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Export Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyMarkdown}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-700 rounded-lg text-xs font-mono font-bold text-slate-200 transition-colors"
                title="Copy markdown report for portfolio"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Report'}</span>
              </button>

              <button
                onClick={handleDownloadMarkdown}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-700 rounded-lg text-xs font-mono font-bold text-slate-200 transition-colors"
                title="Download report .md"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export .MD</span>
              </button>

              <button
                onClick={handleDownloadJSON}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-700 rounded-lg text-xs font-mono font-bold text-slate-200 transition-colors"
                title="Download JSON data"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export JSON</span>
              </button>

              <button
                onClick={onRestart}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-mono font-black uppercase tracking-wider transition-colors ml-2"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>New Sim</span>
              </button>
            </div>

          </div>
        </div>

        {/* Tab 1: Overview & Iron Triangle Breakdown */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            
            {/* Executive Summary Card */}
            <div className="p-6 sm:p-8 bg-slate-900 rounded-3xl border border-slate-800">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 block mb-1">
                EXECUTIVE COMMITTEE FINDINGS
              </span>
              <p className="text-base sm:text-lg text-slate-200 leading-relaxed font-sans">
                {evaluation.executiveSummary}
              </p>

              {/* Leadership DNA Badges */}
              <div className="mt-6 pt-4 border-t border-slate-800 flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono text-slate-500 uppercase tracking-wider mr-2">
                  Observed Field DNA:
                </span>
                {evaluation.fieldLeadershipDNA.map((dna, idx) => (
                  <span key={idx} className="px-3 py-1 rounded-full bg-slate-950 text-amber-300 font-mono text-xs border border-amber-500/30">
                    {dna}
                  </span>
                ))}
              </div>
            </div>

            {/* Iron Triangle + Safety 4 Pillars Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Pillar 1: Safety & OSHA Compliance */}
              <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-400 text-xs font-mono font-bold uppercase">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>OSHA Safety Compliance</span>
                  </div>
                  <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                    stats.safety >= 80 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'
                  }`}>
                    {evaluation.pillarBreakdown.safetyAudit.status}
                  </span>
                </div>

                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-mono font-black text-white">{Math.round(stats.safety)}%</span>
                  <span className="text-xs font-mono text-slate-500">Zero-Tolerance: 50%</span>
                </div>

                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${stats.safety >= 80 ? 'bg-emerald-500' : stats.safety >= 50 ? 'bg-amber-500' : 'bg-red-600'}`}
                    style={{ width: `${stats.safety}%` }}
                  />
                </div>

                <p className="text-xs text-slate-400 leading-relaxed pt-1">
                  {evaluation.pillarBreakdown.safetyAudit.commentary}
                </p>
              </div>

              {/* Pillar 2: Master Schedule Float */}
              <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-400 text-xs font-mono font-bold uppercase">
                    <Clock className="w-4 h-4 text-sky-400" />
                    <span>Schedule & Float Control</span>
                  </div>
                  <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                    stats.scheduleVarianceDays >= 0 ? 'bg-sky-500/20 text-sky-300' : 'bg-red-500/20 text-red-300'
                  }`}>
                    {stats.scheduleVarianceDays >= 0 ? `+${stats.scheduleVarianceDays}d Float` : `${stats.scheduleVarianceDays}d Delayed`}
                  </span>
                </div>

                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-mono font-black text-white">{Math.round(stats.schedulePercent)}%</span>
                  <span className="text-xs font-mono text-slate-500">Pace Target: 100%</span>
                </div>

                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-sky-500"
                    style={{ width: `${Math.max(0, Math.min(100, stats.schedulePercent))}%` }}
                  />
                </div>

                <p className="text-xs text-slate-400 leading-relaxed pt-1">
                  {evaluation.pillarBreakdown.scheduleFloat.commentary}
                </p>
              </div>

              {/* Pillar 3: Contingency & Burn Rate */}
              <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-400 text-xs font-mono font-bold uppercase">
                    <DollarSign className="w-4 h-4 text-amber-400" />
                    <span>Contingency Reserve</span>
                  </div>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                    ${(stats.contingencySpent || 0).toLocaleString()} Burned
                  </span>
                </div>

                <div className="flex items-baseline justify-between">
                  <span className="text-2xl sm:text-3xl font-mono font-black text-white">
                    ${(stats.remainingContingency || 0).toLocaleString()}
                  </span>
                  <span className="text-xs font-mono text-slate-500">{Math.round(stats.budgetPercent)}% Left</span>
                </div>

                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-amber-500"
                    style={{ width: `${Math.max(0, Math.min(100, stats.budgetPercent))}%` }}
                  />
                </div>

                <p className="text-xs text-slate-400 leading-relaxed pt-1">
                  {evaluation.pillarBreakdown.budgetContingency.commentary}
                </p>
              </div>

              {/* Pillar 4: Quality & Trade Morale */}
              <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-400 text-xs font-mono font-bold uppercase">
                    <Users className="w-4 h-4 text-indigo-400" />
                    <span>Sub Morale & Spec Quality</span>
                  </div>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                    QA/QC: {Math.round(stats.qualityScore)}%
                  </span>
                </div>

                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-mono font-black text-white">{Math.round(stats.subMorale)}%</span>
                  <span className="text-xs font-mono text-slate-500">Trade Trust Index</span>
                </div>

                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-500"
                    style={{ width: `${Math.max(0, Math.min(100, stats.subMorale))}%` }}
                  />
                </div>

                <p className="text-xs text-slate-400 leading-relaxed pt-1">
                  {evaluation.pillarBreakdown.qualityMorale.commentary}
                </p>
              </div>

            </div>

          </div>
        )}

        {/* Tab 2: Field Post-Mortem (Wins & Hazards) */}
        {activeTab === 'postmortem' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Biggest Field Win */}
              <div className="p-6 sm:p-8 bg-slate-900 rounded-3xl border border-emerald-500/40 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-500/20 rounded-xl text-emerald-400 border border-emerald-500/30">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono tracking-widest text-emerald-400 uppercase font-bold">
                      DAY {evaluation.biggestWin.day} • TACTICAL TRIUMPH
                    </span>
                    <h3 className="text-xl font-bold text-white tracking-tight">
                      {evaluation.biggestWin.title}
                    </h3>
                  </div>
                </div>

                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-sm text-slate-300 font-mono leading-relaxed">
                  {evaluation.biggestWin.impact}
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  Demonstrated exemplary command presence by reconciling subcontractor conflicts and keeping the critical path advancing without violating standard technical specifications.
                </p>
              </div>

              {/* Most Hazardous Tradeoff */}
              <div className="p-6 sm:p-8 bg-slate-900 rounded-3xl border border-red-500/40 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-500/20 rounded-xl text-red-400 border border-red-500/30">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono tracking-widest text-red-400 uppercase font-bold">
                      DAY {evaluation.mostHazardousTradeoff.day} • PEAK RISK ENVELOPE
                    </span>
                    <h3 className="text-xl font-bold text-white tracking-tight">
                      {evaluation.mostHazardousTradeoff.title}
                    </h3>
                  </div>
                </div>

                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-sm text-slate-300 font-mono leading-relaxed">
                  {evaluation.mostHazardousTradeoff.riskExploration}
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  The executive committee noted that this decision created elevated risk exposure (rework liability, warranty claims, or safety inspection scrutiny).
                </p>
              </div>

            </div>
          </div>
        )}

        {/* Tab 3: 5-Day Chronicle */}
        {activeTab === 'chronicle' && (
          <div className="space-y-4">
            {history.map((record) => (
              <div 
                key={record.day}
                className="p-6 bg-slate-900 rounded-2xl border border-slate-800 space-y-3 font-mono text-xs"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-0.5 bg-amber-500 text-slate-950 font-black rounded text-[11px]">
                      DAY {record.day}
                    </span>
                    <h4 className="font-bold text-white text-sm">
                      {record.scenarioTitle}
                    </h4>
                  </div>
                  <span className="text-slate-400">
                    Milestone: {record.criticalPathTask}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block mb-1">CHOSEN ACTION:</span>
                    <span className="text-slate-200 font-bold">{record.chosenOption.actionTitle}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block mb-1">STRATEGY VECTOR:</span>
                    <span className="text-amber-400">{record.chosenOption.strategyBadge}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block mb-1">RECORDED ARTIFACT:</span>
                    <span className="text-emerald-400">{record.generatedArtifact.documentNumber} ({record.generatedArtifact.type})</span>
                  </div>
                </div>

                <p className="text-slate-400 italic bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                  "{record.chosenOption.feedback}"
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Tab 4: Raw Executive Markdown Memo */}
        {activeTab === 'raw_report' && (
          <div className="p-6 sm:p-8 bg-slate-900 rounded-3xl border border-slate-800 font-mono text-xs leading-relaxed text-slate-300 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <span className="text-amber-400 font-bold uppercase">CERTIFIED FIELD OPS EVALUATION REPORT</span>
              <button
                onClick={handleCopyMarkdown}
                className="px-3 py-1 bg-slate-950 hover:bg-slate-800 border border-slate-700 rounded text-slate-200 font-bold"
              >
                {copied ? 'Copied!' : 'Copy Raw Text'}
              </button>
            </div>
            <pre className="whitespace-pre-wrap select-text overflow-x-auto p-4 bg-slate-950 rounded-xl border border-slate-800">
              {evaluation.markdownReport}
            </pre>
          </div>
        )}

      </div>
    </div>
  );
};
