import React, { useState, useRef, useEffect } from 'react';
import { 
  Radio, 
  Mic, 
  MicOff, 
  Send, 
  Sparkles, 
  ShieldAlert, 
  CheckCircle2, 
  DollarSign, 
  Clock, 
  Users, 
  FileCheck2, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Loader2,
  HelpCircle,
  Activity,
  Zap,
  RadioTower,
  Sliders
} from 'lucide-react';
import { 
  Scenario, 
  ScenarioOption, 
  DirectiveEvaluation, 
  ProjectType, 
  IronTriangleStats, 
  ArtifactType 
} from '../types';
import { evaluateFreeformRadioDirective } from '../services/geminiService';
import { 
  playRadioPttKeyDown, 
  playRadioPttKeyUp, 
  playRadioRogerBeep 
} from '../services/radioAudio';

interface FreeformRadioDirectiveProps {
  scenario: Scenario;
  projectType: ProjectType;
  superName: string;
  currentStats: IronTriangleStats;
  onExecuteDirective: (option: ScenarioOption, artifactType?: ArtifactType) => void;
  disabled?: boolean;
}

export const FreeformRadioDirective: React.FC<FreeformRadioDirectiveProps> = ({
  scenario,
  projectType,
  superName,
  currentStats,
  onExecuteDirective,
  disabled = false
}) => {
  const [directiveText, setDirectiveText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<DirectiveEvaluation | null>(null);
  const [audioFeedbackNotice, setAudioFeedbackNotice] = useState<string | null>(null);
  const [soundFxEnabled, setSoundFxEnabled] = useState(true);
  const [channelFreq, setChannelFreq] = useState('CH 04 • 462.5625 MHz');

  const recognitionRef = useRef<any>(null);
  const isPttActiveRef = useRef(false);

  // Initialize Web Speech API if supported
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript + ' ';
        }
        setDirectiveText(currentTranscript.trim());
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition event:', event.error);
        setIsRecording(false);
        if (event.error === 'not-allowed') {
          setAudioFeedbackNotice('Microphone permission blocked. You can type your exact verbal radio order below.');
        }
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  // Audio helper with sound toggle check
  const triggerAudio = (soundFn: () => void) => {
    if (soundFxEnabled) {
      try {
        soundFn();
      } catch {
        // audio context fallback
      }
    }
  };

  // Push-To-Talk (PTT) Key Down (Mic On + Squelch Break)
  const handlePttDown = () => {
    if (disabled || isEvaluating) return;
    if (isPttActiveRef.current) return;
    isPttActiveRef.current = true;

    triggerAudio(playRadioPttKeyDown);
    setIsRecording(true);
    setAudioFeedbackNotice(null);

    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch {
        // speech recognition was already started or not ready
      }
    } else {
      setAudioFeedbackNotice('Speech recognition unavailable in browser. Transmit your typed command directly.');
    }
  };

  // Push-To-Talk (PTT) Key Up (Mic Off + Radio Dekey Burst)
  const handlePttUp = () => {
    if (!isPttActiveRef.current) return;
    isPttActiveRef.current = false;

    triggerAudio(playRadioPttKeyUp);
    setIsRecording(false);

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
    }
  };

  // Toggle PTT button (click-to-talk mode for desktop/laptop mouse users)
  const handleTogglePtt = () => {
    if (disabled || isEvaluating) return;
    if (isRecording) {
      handlePttUp();
    } else {
      handlePttDown();
    }
  };

  const handleApplyPreset = (preset: string) => {
    triggerAudio(playRadioPttKeyDown);
    setTimeout(() => triggerAudio(playRadioPttKeyUp), 80);
    setDirectiveText(preset);
    setEvaluation(null);
  };

  const handleEvaluate = async () => {
    if (!directiveText.trim() || isEvaluating || disabled) return;
    if (isRecording) {
      handlePttUp();
    }

    // Play radio transmission roger beep
    triggerAudio(playRadioRogerBeep);
    setIsEvaluating(true);

    try {
      const result = await evaluateFreeformRadioDirective(
        directiveText.trim(),
        scenario,
        projectType,
        superName,
        currentStats
      );
      setEvaluation(result);
    } catch (err) {
      console.error('Failed to evaluate radio directive:', err);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleTransmitFieldOrder = () => {
    if (!evaluation || disabled) return;

    triggerAudio(playRadioRogerBeep);

    // Convert evaluation to ScenarioOption
    const chosenOption: ScenarioOption = {
      type: evaluation.impact.safety < 0 
        ? 'aggressive' 
        : evaluation.impact.scheduleDays < 0 
          ? 'conservative' 
          : 'collaborative',
      label: evaluation.actionTitle,
      actionTitle: evaluation.actionTitle,
      strategyBadge: evaluation.strategyBadge,
      description: `Verbal Field Radio Directive by Super ${superName}: "${evaluation.directiveText}"`,
      impact: evaluation.impact,
      feedback: evaluation.feedback,
      tradeReaction: evaluation.tradeReaction
    };

    onExecuteDirective(chosenOption, evaluation.recommendedArtifactType);
  };

  // Preset templates tailored to the scenario
  const sampleDirectives = [
    `Hold the crane pick on ${scenario.location}. Convene an immediate foreman stand-down with the lead trade before anyone touches the load.`,
    `Request an expedited RFI from the structural EOR regarding ${scenario.criticalPathTask}. Swing the crew over to staging B so we don't burn billable hours.`,
    `Laser verify the embed tolerances against the BIM model right now. If it's within 1/4 inch, proceed with the pour under supervision.`
  ];

  return (
    <div className="bg-slate-950 rounded-2xl border border-amber-500/40 p-5 sm:p-7 space-y-6 shadow-2xl relative overflow-hidden">
      
      {/* Motorola Walkie-Talkie Physical Radio Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/30 to-amber-600/10 border border-amber-500/50 flex items-center justify-center text-amber-400 shadow-inner">
            <Radio className={`w-5 h-5 ${isRecording ? 'animate-pulse text-red-400' : 'text-amber-400'}`} />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono font-black uppercase text-amber-400 tracking-wider">
                MOTOROLA APX FIELD RADIO DIRECTIVE
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-900 text-[10px] font-mono font-bold text-amber-300/90 border border-amber-500/30">
                {channelFreq}
              </span>
              <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-slate-400 border border-slate-700">
                TG 101 • OPS-NET
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Issue an authentic unscripted verbal or typed field order. Evaluated against OSHA, Spec Rigor & Trade Buy-In.
            </p>
          </div>
        </div>

        {/* Radio Sound FX & PTT Controls */}
        <div className="flex items-center gap-2">
          {/* Sound FX Squelch Toggle */}
          <button
            type="button"
            onClick={() => setSoundFxEnabled(!soundFxEnabled)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold border transition-colors cursor-pointer ${
              soundFxEnabled 
                ? 'bg-slate-900 border-amber-500/40 text-amber-300' 
                : 'bg-slate-900/60 border-slate-800 text-slate-500'
            }`}
            title="Toggle authentic walkie-talkie audio synthesis (squelch, PTT chirp, static bursts)"
          >
            {soundFxEnabled ? <Volume2 className="w-3.5 h-3.5 text-amber-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-500" />}
            <span>{soundFxEnabled ? 'SQUELCH ON' : 'AUDIO MUTED'}</span>
          </button>

          {/* Live Recording Pulsing Badge */}
          {isRecording && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-950/80 border border-red-500 text-red-400 text-[11px] font-mono font-bold animate-pulse shadow-lg shadow-red-500/20">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
              <span>TX ACTIVE (PTT ENGAGED)</span>
            </div>
          )}
        </div>
      </div>

      {/* If evaluation has NOT been run yet: Show input console */}
      {!evaluation ? (
        <div className="space-y-4">
          
          {/* Quick Directive Preset Chips */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              TACTICAL FIELD DISPATCH PRESETS (CLICK TO PREFILL):
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {sampleDirectives.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyPreset(preset)}
                  className="text-left p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/40 text-slate-300 text-xs font-mono leading-relaxed transition-all cursor-pointer group"
                >
                  <span className="text-[10px] text-amber-400 font-bold block mb-1">
                    [TACTICAL OPTION 0{idx + 1}]
                  </span>
                  <span className="line-clamp-2 text-slate-400 group-hover:text-slate-200">
                    "{preset}"
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Push-to-Talk (PTT) Big Handset Toggle & Audio Controls */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {/* Push to talk button with hold and click support */}
              <button
                type="button"
                onMouseDown={handlePttDown}
                onMouseUp={handlePttUp}
                onTouchStart={handlePttDown}
                onTouchEnd={handlePttUp}
                onClick={handleTogglePtt}
                disabled={disabled || isEvaluating}
                className={`flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-mono text-xs font-black uppercase tracking-wider transition-all cursor-pointer select-none shadow-xl ${
                  isRecording
                    ? 'bg-red-600 hover:bg-red-500 text-white ring-4 ring-red-500/40 shadow-red-500/40 scale-95'
                    : 'bg-gradient-to-b from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 text-amber-400 border border-amber-500/50 hover:border-amber-400'
                }`}
                title="Hold or Click to toggle Push-to-Talk"
              >
                {isRecording ? <MicOff className="w-5 h-5 animate-pulse" /> : <Mic className="w-5 h-5 text-amber-400" />}
                <div className="text-left">
                  <div className="text-xs font-black">{isRecording ? 'RELEASE PTT (TRANSMITTING)' : 'PUSH-TO-TALK (PTT)'}</div>
                  <div className="text-[9px] text-slate-400 font-normal">CLICK OR HOLD TO BROADCAST</div>
                </div>
              </button>

              {/* Realistic Audio Squelch Waveform Indicator */}
              <div className="hidden sm:flex flex-col gap-1">
                <div className="flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-[10px] font-mono text-slate-400">RF SQUELCH / AUDIO CARRIER</span>
                </div>
                <div className="flex items-center gap-1 h-5 px-2 bg-slate-950 rounded-lg border border-slate-800">
                  {(isRecording ? [60, 95, 45, 100, 75, 90, 60, 85, 40, 90, 70, 95] : [10, 15, 10, 20, 10, 15, 10, 15, 10, 20, 10, 15]).map((val, i) => (
                    <div
                      key={i}
                      style={{ height: `${Math.max(4, val * 0.16)}px` }}
                      className={`w-1 rounded-full transition-all duration-150 ${
                        isRecording ? 'bg-amber-400 animate-pulse' : 'bg-slate-700'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="text-right font-mono text-[11px] text-slate-400">
              <span className="text-amber-400 font-bold block">RUBRIC AUDIT (0-100):</span>
              <span>OSHA Safety • Spec Rigor • Sub Buy-In</span>
            </div>
          </div>

          {/* Text/Speech Input Terminal */}
          <div className="relative rounded-2xl border border-slate-800 bg-slate-900 focus-within:border-amber-500 focus-within:ring-1 focus-within:ring-amber-500/30 transition-all p-3 sm:p-4">
            
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/80 text-[11px] font-mono text-slate-400">
              <div className="flex items-center gap-2">
                <RadioTower className="w-3.5 h-3.5 text-amber-400" />
                <span>SUPERINTENDENT RADIO MIC ({superName.toUpperCase()})</span>
              </div>
              <span>{directiveText.length} CHARACTERS</span>
            </div>

            <textarea
              value={directiveText}
              onChange={e => setDirectiveText(e.target.value)}
              disabled={disabled || isEvaluating}
              placeholder='Speak using Push-To-Talk or type your exact field order (e.g., "Hold the crane pick on gridline 4 until the high gusts drop below 25 mph. Re-route the ironworkers to ground-level bolt torque inspections, and notify the crane rigger on Channel 4...")'
              rows={4}
              className="w-full bg-transparent text-slate-100 placeholder-slate-500 text-sm font-mono leading-relaxed focus:outline-none resize-none"
            />

            {/* Quick Helper tip */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800/60 text-[11px] font-mono text-slate-500">
              <span>Tip: Explicit directives citing locations, trade foremen, and specs score highest on Spec Rigor.</span>
              <span className="text-amber-400/80 font-bold">PTT Synthesizer: Active</span>
            </div>

          </div>

          {/* Feedback notice for audio permissions or tips */}
          {audioFeedbackNotice && (
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs font-mono text-amber-300 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{audioFeedbackNotice}</span>
            </div>
          )}

          {/* Action Button: Evaluate Directive */}
          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={handleEvaluate}
              disabled={!directiveText.trim() || isEvaluating || disabled}
              className={`flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-mono text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-lg ${
                !directiveText.trim() || isEvaluating || disabled
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-800'
                  : 'bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 shadow-amber-500/20'
              }`}
            >
              {isEvaluating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  <span>TRANSMITTING OVER CHANNEL & EVALUATING...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 text-slate-950" />
                  <span>EVALUATE RADIO DIRECTIVE (AI RUBRIC AUDIT)</span>
                </>
              )}
            </button>
          </div>

        </div>
      ) : (
        /* Evaluation Results Card */
        <div className="space-y-5 animate-in fade-in duration-300">
          
          {/* Header of Evaluation */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-mono font-bold uppercase tracking-wider">
                {evaluation.strategyBadge}
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                Triggered Ledger Artifact: <strong className="text-amber-400">{evaluation.recommendedArtifactType}</strong>
              </span>
            </div>

            <h3 className="text-lg sm:text-xl font-bold font-display text-white">
              {evaluation.actionTitle}
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 italic font-mono bg-slate-950 p-2.5 rounded-lg border border-slate-800/80">
              "{evaluation.directiveText}"
            </p>

            <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800/80 text-xs font-mono text-slate-300">
              <span className="text-amber-400 font-bold uppercase block mb-1">VP FIELD OPERATIONS VERDICT:</span>
              <p className="leading-relaxed">{evaluation.feedback}</p>
            </div>
          </div>

          {/* 3 Rigorous Rubric Pillars (0-100) + Cost Liability */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            
            {/* 1. OSHA / Safety Compliance Score (0-100) */}
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-400" /> OSHA Safety
                </span>
                <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold ${
                  evaluation.scores.oshaCompliance.score >= 80 
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40' 
                    : evaluation.scores.oshaCompliance.score >= 50 
                      ? 'bg-amber-950 text-amber-400 border border-amber-500/40' 
                      : 'bg-red-950 text-red-400 border border-red-500/40'
                }`}>
                  {evaluation.scores.oshaCompliance.score} / 100
                </span>
              </div>
              <div className="text-[11px] font-bold text-slate-200">
                {evaluation.scores.oshaCompliance.label}
              </div>
              <p className="text-[11px] font-mono text-slate-400 leading-normal">
                {evaluation.scores.oshaCompliance.commentary}
              </p>
            </div>

            {/* 2. Contractual & Spec Rigor (0-100) */}
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
                  <FileCheck2 className="w-3.5 h-3.5 text-sky-400" /> Spec Rigor
                </span>
                <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold ${
                  evaluation.scores.contractualSpecRigor.score >= 80 
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40' 
                    : evaluation.scores.contractualSpecRigor.score >= 60 
                      ? 'bg-sky-950 text-sky-400 border border-sky-500/40' 
                      : 'bg-red-950 text-red-400 border border-red-500/40'
                }`}>
                  {evaluation.scores.contractualSpecRigor.score} / 100
                </span>
              </div>
              <div className="text-[11px] font-bold text-slate-200">
                {evaluation.scores.contractualSpecRigor.label}
              </div>
              <p className="text-[11px] font-mono text-slate-400 leading-normal">
                {evaluation.scores.contractualSpecRigor.commentary}
              </p>
            </div>

            {/* 3. Trade Friction / Subcontractor Buy-In (0-100) */}
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-indigo-400" /> Sub Buy-In
                </span>
                <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold ${
                  evaluation.scores.subcontractorBuyIn.score >= 80 
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40' 
                    : evaluation.scores.subcontractorBuyIn.score >= 60 
                      ? 'bg-amber-950 text-amber-400 border border-amber-500/40' 
                      : 'bg-red-950 text-red-400 border border-red-500/40'
                }`}>
                  {evaluation.scores.subcontractorBuyIn.score} / 100
                </span>
              </div>
              <div className="text-[11px] font-bold text-slate-200">
                {evaluation.scores.subcontractorBuyIn.label}
              </div>
              <p className="text-[11px] font-mono text-slate-400 leading-normal">
                {evaluation.scores.subcontractorBuyIn.commentary}
              </p>
            </div>

          </div>

          {/* Subcontractor Radio Response */}
          <div className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-800 text-xs font-mono text-slate-300 flex items-start gap-3">
            <Radio className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-amber-400 uppercase mr-2">[FOREMAN RADIO ACKNOWLEDGEMENT]:</span>
              <span className="text-slate-200 italic">"{evaluation.tradeReaction}"</span>
            </div>
          </div>

          {/* Dynamic Stat Deltas calculated from custom score */}
          <div className="p-3.5 bg-slate-950 rounded-xl border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
            <div>
              <span className="text-amber-400 uppercase font-bold text-[10px] block">DYNAMIC STAT IMPACTS DERIVED FROM RUBRIC:</span>
              <span className="text-slate-400 text-[11px]">Applied to Iron Triangle and Cloud Telemetry upon transmission.</span>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-[11px]">
              <span className={`px-2.5 py-1 rounded font-bold ${evaluation.impact.safety >= 0 ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' : 'bg-red-950 text-red-400 border border-red-500/30'}`}>
                OSHA: {evaluation.impact.safety >= 0 ? `+${evaluation.impact.safety}%` : `${evaluation.impact.safety}%`}
              </span>
              <span className={`px-2.5 py-1 rounded font-bold ${evaluation.impact.scheduleDays >= 0 ? 'bg-sky-950 text-sky-400 border border-sky-500/30' : 'bg-red-950 text-red-400 border border-red-500/30'}`}>
                Float: {evaluation.impact.scheduleDays >= 0 ? `+${evaluation.impact.scheduleDays}d` : `${evaluation.impact.scheduleDays}d`}
              </span>
              <span className="px-2.5 py-1 rounded font-bold bg-amber-950 text-amber-400 border border-amber-500/30">
                Cost: -${evaluation.impact.contingencySpent.toLocaleString()}
              </span>
              <span className={`px-2.5 py-1 rounded font-bold ${evaluation.impact.quality >= 0 ? 'bg-indigo-950 text-indigo-400 border border-indigo-500/30' : 'bg-red-950 text-red-400 border border-red-500/30'}`}>
                Spec QC: {evaluation.impact.quality >= 0 ? `+${evaluation.impact.quality}%` : `${evaluation.impact.quality}%`}
              </span>
              <span className={`px-2.5 py-1 rounded font-bold ${evaluation.impact.morale >= 0 ? 'bg-purple-950 text-purple-400 border border-purple-500/30' : 'bg-red-950 text-red-400 border border-red-500/30'}`}>
                Morale: {evaluation.impact.morale >= 0 ? `+${evaluation.impact.morale}%` : `${evaluation.impact.morale}%`}
              </span>
            </div>
          </div>

          {/* Action Buttons: Transmit or Revise */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                triggerAudio(playRadioPttKeyDown);
                setEvaluation(null);
              }}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono font-medium cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span>Revise Radio Directive</span>
            </button>

            <button
              type="button"
              onClick={handleTransmitFieldOrder}
              disabled={disabled}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 text-xs font-mono font-black uppercase tracking-wider cursor-pointer transition-all shadow-lg hover:shadow-amber-500/30"
            >
              <CheckCircle2 className="w-4 h-4 text-slate-950" />
              <span>TRANSMIT FIELD ORDER (EXECUTE SHIFT & GENERATE ARTIFACT)</span>
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
