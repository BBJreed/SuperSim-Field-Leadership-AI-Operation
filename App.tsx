import React, { useState, useEffect } from 'react';
import { 
  ProjectType, 
  SuperintendentProfile, 
  IronTriangleStats, 
  Scenario, 
  ScenarioOption, 
  DecisionRecord, 
  SiteArtifact, 
  ExecutiveEvaluation,
  DayWeather,
  EnterpriseTelemetryEvent,
  ArtifactType
} from './types';
import { 
  SECTOR_CONFIGS, 
  getSectorScenarios,
  DEFAULT_WEATHER_FORECAST 
} from './services/scenarioData';
import { 
  enrichScenario, 
  evaluateSuperintendentPerformance,
  generateSiteArtifactAI 
} from './services/geminiService';
import { 
  createInitialTelemetry, 
  generateDecisionTelemetry 
} from './services/telemetryService';
import { SetupWizard } from './components/SetupWizard';
import { IronTriangleHUD } from './components/IronTriangleHUD';
import { ScenarioCard } from './components/ScenarioCard';
import { ArtifactViewer } from './components/ArtifactViewer';
import { OshaAlertModal } from './components/OshaAlertModal';
import { EvaluationDashboard } from './components/EvaluationDashboard';
import { EnterpriseTelemetryDrawer } from './components/EnterpriseTelemetryDrawer';
import { InteractiveSafetyDashboard } from './components/InteractiveSafetyDashboard';
import { ProjectSitePhotosModal } from './components/ProjectSitePhotosModal';
import { 
  HardHat, 
  ArrowRight, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Layers, 
  Clock, 
  Calendar,
  Sparkles,
  Loader2,
  Terminal
} from 'lucide-react';

export const App: React.FC = () => {
  // Screen state: 'setup' | 'simulation' | 'evaluation'
  const [screen, setScreen] = useState<'setup' | 'simulation' | 'evaluation'>('setup');
  
  // Active Project & Profile
  const [projectType, setProjectType] = useState<ProjectType>(ProjectType.COMMERCIAL);
  const [profile, setProfile] = useState<SuperintendentProfile>({
    name: 'Jack Morrison',
    experience: 'Lead Superintendent',
    riskTolerance: 'Balanced / Standard Spec',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250'
  });

  // Enterprise Telemetry State
  const [telemetryEvents, setTelemetryEvents] = useState<EnterpriseTelemetryEvent[]>(() => 
    createInitialTelemetry(ProjectType.COMMERCIAL, {
      name: 'Jack Morrison',
      experience: 'Lead Superintendent',
      riskTolerance: 'Balanced / Standard Spec',
      avatarUrl: ''
    })
  );
  const [isTelemetryDrawerOpen, setIsTelemetryDrawerOpen] = useState<boolean>(false);
  const [unreadTelemetryCount, setUnreadTelemetryCount] = useState<number>(3); // 3 initial webhooks
  const [hasNewEventPulse, setHasNewEventPulse] = useState<boolean>(false);

  // 5-Day Simulation State
  const [currentDay, setCurrentDay] = useState<number>(1);
  const [scenarios, setScenarios] = useState<Scenario[]>(() => getSectorScenarios(ProjectType.COMMERCIAL));
  const [weatherForecast, setWeatherForecast] = useState<DayWeather[]>(DEFAULT_WEATHER_FORECAST);
  
  // Iron Triangle & Safety Stats
  const [stats, setStats] = useState<IronTriangleStats>({
    safety: 95,
    schedulePercent: 96,
    scheduleVarianceDays: 1.5,
    remainingContingency: 1250000,
    contingencySpent: 0,
    budgetPercent: 100,
    qualityScore: 92,
    subMorale: 85
  });

  // Active Day Progress State
  const [dayOutcome, setDayOutcome] = useState<{
    chosenOption: ScenarioOption;
    artifact: SiteArtifact;
  } | null>(null);

  const [history, setHistory] = useState<DecisionRecord[]>([]);
  const [urgencyMemo, setUrgencyMemo] = useState<string | null>(null);
  const [isEnriching, setIsEnriching] = useState<boolean>(false);
  const [showOshaModal, setShowOshaModal] = useState<boolean>(false);
  const [isSafetyDashboardOpen, setIsSafetyDashboardOpen] = useState<boolean>(false);
  const [isSitePhotosOpen, setIsSitePhotosOpen] = useState<boolean>(false);
  const [evaluation, setEvaluation] = useState<ExecutiveEvaluation | null>(null);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);

  // Active scenario for current day
  const activeScenario = scenarios.find(s => s.day === currentDay) || scenarios[0];
  const activeWeather = weatherForecast.find(w => w.day === currentDay) || weatherForecast[0];

  // Fetch optional AI field memo when day changes
  useEffect(() => {
    if (screen === 'simulation' && !dayOutcome) {
      let isMounted = true;
      setIsEnriching(true);
      enrichScenario(projectType, currentDay, history)
        .then((memo) => {
          if (isMounted) {
            setUrgencyMemo(memo);
            setIsEnriching(false);
          }
        })
        .catch(() => {
          if (isMounted) setIsEnriching(false);
        });

      return () => {
        isMounted = false;
      };
    }
  }, [currentDay, screen, dayOutcome, projectType, history]);

  // Handle completion of 3-step setup modal
  const handleSetupComplete = (chosenSector: ProjectType, superProfile: SuperintendentProfile) => {
    const sectorConfig = SECTOR_CONFIGS[chosenSector];
    const chosenScenarios = getSectorScenarios(chosenSector);

    setProjectType(chosenSector);
    setProfile(superProfile);
    setScenarios(chosenScenarios);
    setCurrentDay(1);
    setHistory([]);
    setDayOutcome(null);

    // Initialize enterprise telemetry with real-time bootstrap events
    setTelemetryEvents(createInitialTelemetry(chosenSector, superProfile));

    // Initialize stats based on sector parameters
    setStats({
      safety: 95,
      schedulePercent: 95,
      scheduleVarianceDays: sectorConfig.initialFloatDays,
      remainingContingency: sectorConfig.startingContingency,
      contingencySpent: 0,
      budgetPercent: 100,
      qualityScore: 90,
      subMorale: 85
    });

    setScreen('simulation');
  };

  // Handle tactical decision or freeform radio directive
  const handleSelectOption = async (option: ScenarioOption, overrideArtifactType?: ArtifactType) => {
    // 1. Calculate updated stats
    const newSafety = Math.max(0, Math.min(100, stats.safety + option.impact.safety));
    const newScheduleDays = Number((stats.scheduleVarianceDays + option.impact.scheduleDays).toFixed(1));
    const newSchedulePercent = Math.max(0, Math.min(100, stats.schedulePercent + (option.impact.scheduleDays * 3.5)));
    
    const startingCont = SECTOR_CONFIGS[projectType].startingContingency;
    const newSpent = stats.contingencySpent + option.impact.contingencySpent;
    const newRemaining = Math.max(0, startingCont - newSpent);
    const newBudgetPercent = Math.max(0, Math.min(100, Math.round((newRemaining / startingCont) * 100)));
    
    const newQuality = Math.max(0, Math.min(100, stats.qualityScore + option.impact.quality));
    const newMorale = Math.max(0, Math.min(100, stats.subMorale + option.impact.morale));

    const updatedStats: IronTriangleStats = {
      safety: newSafety,
      schedulePercent: newSchedulePercent,
      scheduleVarianceDays: newScheduleDays,
      remainingContingency: newRemaining,
      contingencySpent: newSpent,
      budgetPercent: newBudgetPercent,
      qualityScore: newQuality,
      subMorale: newMorale
    };

    setStats(updatedStats);

    // 2. Select default artifact or generate AI artifact
    let artifact = activeScenario.defaultArtifactTemplate
      ? activeScenario.defaultArtifactTemplate(
          option,
          profile.name,
          projectType
        )
      : {
          type: 'DAILY_LOG',
          typeLabel: 'DAILY SUPERINTENDENT LOG',
          documentNumber: `DLOG-D0${currentDay}`,
          title: `Field Log: ${activeScenario.title}`,
          date: `Day ${currentDay}, 2026`,
          author: profile.name,
          recipient: 'General Contractor Operations',
          summary: option.feedback,
          fullContent: option.feedback
        } as SiteArtifact;

    if (overrideArtifactType) {
      artifact.type = overrideArtifactType;
      artifact.typeLabel = overrideArtifactType === 'RFI' 
        ? 'REQUEST FOR INFORMATION (RFI)' 
        : overrideArtifactType === 'NCR' 
          ? 'NON-CONFORMANCE REPORT (NCR)' 
          : 'DAILY SUPERINTENDENT LOG';
    }
    
    // 3. Dispatch Procore & Autodesk Construction Cloud live API telemetry
    const newTelemetry = generateDecisionTelemetry(
      currentDay,
      activeScenario,
      option,
      artifact,
      updatedStats,
      profile,
      projectType
    );
    setTelemetryEvents(prev => [...newTelemetry, ...prev]);
    setUnreadTelemetryCount(prev => prev + newTelemetry.length);
    setHasNewEventPulse(true);
    setTimeout(() => setHasNewEventPulse(false), 4000);

    // 4. Check if AI generation can enrich artifact
    generateSiteArtifactAI(
      artifact.type,
      activeScenario.title,
      option,
      profile.name,
      projectType,
      currentDay
    ).then((aiArtifact) => {
      if (aiArtifact && aiArtifact.fullContent) {
        setDayOutcome(prev => {
          if (!prev) return null;
          return {
            ...prev,
            artifact: {
              ...prev.artifact,
              ...aiArtifact
            } as SiteArtifact
          };
        });
      }
    }).catch(() => {});

    // 5. Record decision in historical ledger
    const decisionRecord: DecisionRecord = {
      day: currentDay,
      scenarioTitle: activeScenario.title,
      chosenOption: option,
      resultingStats: updatedStats,
      criticalPathTask: activeScenario.criticalPathTask,
      generatedArtifact: artifact
    };

    setHistory(prev => [...prev, decisionRecord]);
    setDayOutcome({
      chosenOption: option,
      artifact
    });

    // 6. Trigger OSHA stop-work modal if safety dips below 50%
    if (newSafety < 50) {
      setShowOshaModal(true);
    }
  };

  // Handle OSHA stand-down remediation
  const handleOshaRemediation = () => {
    // Restores safety to compliant baseline (65%), consumes $15k contingency and -0.5 days float
    setStats(prev => {
      const newSpent = prev.contingencySpent + 15000;
      const startingCont = SECTOR_CONFIGS[projectType].startingContingency;
      const newRemaining = Math.max(0, startingCont - newSpent);

      return {
        ...prev,
        safety: 65,
        scheduleVarianceDays: Number((prev.scheduleVarianceDays - 0.5).toFixed(1)),
        schedulePercent: Math.max(0, prev.schedulePercent - 4),
        contingencySpent: newSpent,
        remainingContingency: newRemaining,
        budgetPercent: Math.round((newRemaining / startingCont) * 100),
        subMorale: Math.max(0, prev.subMorale - 5)
      };
    });

    // Push remediation telemetry log to Procore
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0] + '.' + String(now.getMilliseconds()).padStart(3, '0');
    const oshaClearEvent: EnterpriseTelemetryEvent = {
      id: `tx_osha_clear_${Date.now()}`,
      timestamp: timeStr,
      platform: 'PROCORE',
      method: 'PATCH',
      endpoint: 'https://api.procore.com/rest/v1.0/projects/84920/observations/osha_standdown_remediation',
      statusCode: 200,
      statusText: 'Remediated',
      latencyMs: 110,
      category: 'SAFETY_FLAG',
      summary: 'OSHA Stand-Down Remediated: 100% Retraining Certified & Baseline Restored',
      headers: {
        'Authorization': 'Bearer prc_prod_live_839210482910',
        'X-Safety-Clearance': 'APPROVED_BY_VP_FIELD_OPS'
      },
      requestPayload: {
        remediation_action: 'Site-wide Safety Stand-Down & Retraining',
        remediation_cost: 15000,
        critical_path_impact: -0.5,
        restored_safety_score: 65,
        certified_by: profile.name
      },
      responsePayload: {
        stop_work_order_revoked: true,
        site_access_cleared: 'FULL_RETURN_TO_WORK'
      }
    };
    setTelemetryEvents(prev => [oshaClearEvent, ...prev]);
    setUnreadTelemetryCount(prev => prev + 1);
    setHasNewEventPulse(true);
    setTimeout(() => setHasNewEventPulse(false), 4000);

    setShowOshaModal(false);
  };

  // Trigger real-time mock ping for testing telemetry
  const handleTriggerTestPing = () => {
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0] + '.' + String(now.getMilliseconds()).padStart(3, '0');
    const isProcore = Math.random() > 0.5;
    const pingEvent: EnterpriseTelemetryEvent = {
      id: `tx_ping_${Date.now()}`,
      timestamp: timeStr,
      platform: isProcore ? 'PROCORE' : 'AUTODESK_ACC',
      method: 'GET',
      endpoint: isProcore 
        ? 'https://api.procore.com/rest/v1.0/health_check' 
        : 'https://developer.api.autodesk.com/construction/v1/health',
      statusCode: 200,
      statusText: 'OK',
      latencyMs: Math.floor(75 + Math.random() * 45),
      category: 'SCHEDULE_SYNC',
      summary: `${isProcore ? 'Procore Webhook Gateway' : 'Autodesk ACC BIM Hub'} Synchronized: Active 2-Way Link Verified`,
      headers: {
        'Authorization': isProcore ? 'Bearer prc_health_ping_token' : 'Bearer acc_health_ping_token',
        'X-Ping-Source': 'SuperSim-Live-Test'
      },
      requestPayload: {
        action: 'HEALTH_CHECK',
        client_timestamp: new Date().toISOString(),
        superintendent: profile.name,
        active_sector: projectType
      },
      responsePayload: {
        gateway: 'HEALTHY',
        cloud_platform: isProcore ? 'Procore Core REST API' : 'Autodesk Construction Cloud (ACC)',
        latency_ms: 88,
        sync_status: 'SYNCHRONIZED'
      }
    };
    setTelemetryEvents(prev => [pingEvent, ...prev]);
    setUnreadTelemetryCount(prev => prev + 1);
    setHasNewEventPulse(true);
    setTimeout(() => setHasNewEventPulse(false), 4000);
  };

  // Dynamically update safety score from interactive safety audits
  const handleUpdateSafetyScore = (newScore: number) => {
    setStats(prev => ({ ...prev, safety: newScore }));
    if (newScore < 50) {
      setShowOshaModal(true);
    }
  };

  // Advance to next day or finalize evaluation
  const handleAdvanceDay = async () => {
    if (currentDay < 5) {
      setCurrentDay(prev => prev + 1);
      setDayOutcome(null);
      setUrgencyMemo(null);
    } else {
      // Completed Day 5 -> Launch Executive Evaluation
      setIsEvaluating(true);
      setScreen('evaluation');
      try {
        const evalResult = await evaluateSuperintendentPerformance(
          projectType,
          profile,
          stats,
          history
        );
        setEvaluation(evalResult);
      } finally {
        setIsEvaluating(false);
      }
    }
  };

  // Restart simulation
  const handleRestart = () => {
    setScreen('setup');
    setDayOutcome(null);
    setHistory([]);
    setEvaluation(null);
    setCurrentDay(1);
  };

  // 1. Setup Wizard Screen
  if (screen === 'setup') {
    return <SetupWizard onComplete={handleSetupComplete} />;
  }

  // 2. Evaluation Screen
  if (screen === 'evaluation') {
    if (isEvaluating || !evaluation) {
      return (
        <div className="min-h-screen bg-slate-950 blueprint-grid flex flex-col items-center justify-center p-6 text-slate-100">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl flex flex-col items-center max-w-md text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
            <h2 className="text-xl font-bold font-display uppercase tracking-tight text-white">
              ANALYZING FIELD DECISION MATRIX
            </h2>
            <p className="text-xs font-mono text-slate-400 leading-relaxed">
              Evaluating candidate performance across OSHA compliance, master schedule float, contingency burn rate, and technical spec fidelity...
            </p>
          </div>
        </div>
      );
    }

    return (
      <EvaluationDashboard
        evaluation={evaluation}
        stats={stats}
        profile={profile}
        projectType={projectType}
        history={history}
        onRestart={handleRestart}
      />
    );
  }

  // 3. Main Simulation Screen
  return (
    <div className="min-h-screen bg-slate-950 blueprint-grid flex flex-col text-slate-100">
      
      {/* Sticky Enterprise Webhook Stream Pill Badge in Top Right */}
      <div className="fixed top-3 sm:top-4 right-4 sm:right-6 z-40">
        <button
          type="button"
          onClick={() => {
            setIsTelemetryDrawerOpen(true);
            setUnreadTelemetryCount(0);
          }}
          className={`group flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-mono text-xs font-bold transition-all shadow-2xl cursor-pointer backdrop-blur-md border ${
            hasNewEventPulse || unreadTelemetryCount > 0
              ? 'bg-slate-900/95 border-emerald-500 text-emerald-300 ring-2 ring-emerald-500/40 shadow-emerald-500/20'
              : 'bg-slate-900/90 border-slate-700/80 hover:border-amber-500/50 text-slate-300 hover:text-white'
          }`}
          title="Open Enterprise Webhook Stream (Procore API, Autodesk ACC, Subcontractor SMS)"
        >
          {/* Pulsing indicator dot */}
          <span className="relative flex h-2.5 w-2.5">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
              hasNewEventPulse || unreadTelemetryCount > 0 ? 'bg-emerald-400' : 'bg-emerald-500'
            }`}></span>
            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
              hasNewEventPulse || unreadTelemetryCount > 0 ? 'bg-emerald-400' : 'bg-emerald-500'
            }`}></span>
          </span>

          <Terminal className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-12 transition-transform" />

          <span className="tracking-wide uppercase text-[11px] hidden sm:inline">
            Enterprise Webhook Stream
          </span>
          <span className="tracking-wide uppercase text-[11px] sm:hidden">
            Webhooks
          </span>

          {unreadTelemetryCount > 0 ? (
            <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-black text-[10px] animate-pulse">
              +{unreadTelemetryCount} NEW
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[10px] border border-slate-700">
              {telemetryEvents.length}
            </span>
          )}
        </button>
      </div>

      {/* Iron Triangle + Safety HUD */}
      <IronTriangleHUD
        stats={stats}
        weather={activeWeather}
        currentDay={currentDay}
        totalDays={5}
        projectType={projectType}
        profile={profile}
        activeCriticalPath={activeScenario.criticalPathTask}
        telemetryCount={telemetryEvents.length}
        unreadTelemetryCount={unreadTelemetryCount}
        hasNewEventPulse={hasNewEventPulse}
        onOpenTelemetry={() => {
          setIsTelemetryDrawerOpen(true);
          setUnreadTelemetryCount(0);
        }}
        onOpenSafetyDashboard={() => setIsSafetyDashboardOpen(true)}
        onOpenSitePhotos={() => setIsSitePhotosOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        
        {/* If decision has NOT been made for current day: Show Scenario Dilemma */}
        {!dayOutcome ? (
          <ScenarioCard
            scenario={activeScenario}
            onSelectOption={handleSelectOption}
            urgencyMemo={urgencyMemo}
            disabled={showOshaModal}
            projectType={projectType}
            superName={profile.name}
            currentStats={stats}
          />
        ) : (
          /* If decision HAS been made: Show Outcome & Authentic Construction Artifact */
          <div className="space-y-6 animate-in fade-in duration-300">
            
            {/* Field Impact Feedback Banner */}
            <div className={`p-6 rounded-3xl border shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              dayOutcome.chosenOption.type === 'conservative'
                ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                : dayOutcome.chosenOption.type === 'aggressive'
                  ? 'bg-red-950/40 border-red-500/50 text-red-200'
                  : 'bg-amber-950/40 border-amber-500/50 text-amber-200'
            }`}>
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-2xl border ${
                  dayOutcome.chosenOption.type === 'conservative'
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                    : dayOutcome.chosenOption.type === 'aggressive'
                      ? 'bg-red-500 text-white border-red-400'
                      : 'bg-amber-500 text-slate-950 border-amber-400'
                }`}>
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold tracking-widest uppercase">
                      FIELD ORDER EXECUTED • {dayOutcome.chosenOption.strategyBadge}
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight mt-0.5">
                    {dayOutcome.chosenOption.actionTitle}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                    {dayOutcome.chosenOption.feedback}
                  </p>
                </div>
              </div>

              {/* Advance Button */}
              <button
                onClick={handleAdvanceDay}
                className="shrink-0 flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-6 py-3.5 rounded-xl font-mono text-xs tracking-wider uppercase transition-all shadow-lg hover:shadow-amber-500/20"
              >
                <span>{currentDay < 5 ? `Advance to Day ${currentDay + 1} Shift` : 'Conduct Executive Audit'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Artifact Section Header */}
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs font-mono font-black uppercase tracking-wider text-slate-300">
                  REAL-TIME GENERATED SITE ARTIFACT (JOB LEDGER SYNC)
                </h3>
              </div>
              <span className="text-[11px] font-mono text-slate-500">
                Official Project Record #{dayOutcome.artifact.documentNumber}
              </span>
            </div>

            {/* Authentic Construction Artifact Viewer */}
            <ArtifactViewer 
              artifact={dayOutcome.artifact}
              superName={profile.name}
            />

            {/* Bottom Next Day Sticky Action Bar */}
            <div className="pt-4 flex justify-end">
              <button
                onClick={handleAdvanceDay}
                className="w-full sm:w-auto flex items-center justify-center gap-3 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black px-8 py-4 rounded-xl font-mono text-sm tracking-widest uppercase transition-all shadow-xl hover:shadow-amber-500/30"
              >
                <span>{currentDay < 5 ? `PROCEED TO DAY ${currentDay + 1} (07:00 AM SHIFT)` : 'FINALIZE 5-DAY PERFORMANCE AUDIT'}</span>
                <ArrowRight className="w-5 h-5 text-slate-950" />
              </button>
            </div>

          </div>
        )}

      </main>

      {/* Floating Enterprise Telemetry Toggle Button */}
      <div className="fixed bottom-4 right-4 z-30">
        <button
          type="button"
          onClick={() => setIsTelemetryDrawerOpen(true)}
          className="flex items-center gap-2.5 px-4 py-2.5 bg-slate-900/95 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-amber-500/50 rounded-full shadow-2xl backdrop-blur-md cursor-pointer transition-all hover:scale-105 group"
          title="Open Procore & Autodesk ACC Cloud Webhook Drawer"
        >
          <Terminal className="w-4 h-4 text-amber-400 group-hover:rotate-6 transition-transform" />
          <span className="text-xs font-mono font-bold tracking-wider hidden sm:inline">PROCORE & ACC CLOUD SYNC</span>
          <span className="text-xs font-mono font-bold tracking-wider sm:hidden">TELEMETRY</span>
          <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono font-black border border-amber-500/40">
            {telemetryEvents.length}
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        </button>
      </div>

      {/* Enterprise Integration Telemetry Drawer */}
      <EnterpriseTelemetryDrawer
        isOpen={isTelemetryDrawerOpen}
        onClose={() => setIsTelemetryDrawerOpen(false)}
        events={telemetryEvents}
        onClear={() => setTelemetryEvents([])}
        onTriggerTestPing={handleTriggerTestPing}
      />

      {/* Zero-Tolerance OSHA Stop-Work Modal */}
      <OshaAlertModal
        isOpen={showOshaModal}
        currentSafetyScore={stats.safety}
        onRemediate={handleOshaRemediation}
      />

      {/* Interactive Field Safety & OSHA Audit Center */}
      <InteractiveSafetyDashboard
        isOpen={isSafetyDashboardOpen}
        onClose={() => setIsSafetyDashboardOpen(false)}
        stats={stats}
        onUpdateSafetyScore={handleUpdateSafetyScore}
        projectType={projectType}
        superName={profile.name}
        currentDay={currentDay}
      />

      {/* Project Site Photos & Drone Inspection Archive */}
      <ProjectSitePhotosModal
        isOpen={isSitePhotosOpen}
        onClose={() => setIsSitePhotosOpen(false)}
        projectType={projectType}
        superName={profile.name}
      />

    </div>
  );
};

export default App;
