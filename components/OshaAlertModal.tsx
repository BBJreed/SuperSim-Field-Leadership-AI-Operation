import React from 'react';
import { 
  AlertOctagon, 
  ShieldAlert, 
  FileWarning, 
  Users, 
  Clock, 
  ArrowRight,
  HardHat
} from 'lucide-react';

interface OshaAlertModalProps {
  isOpen: boolean;
  currentSafetyScore: number;
  onRemediate: () => void;
}

export const OshaAlertModal: React.FC<OshaAlertModalProps> = ({
  isOpen,
  currentSafetyScore,
  onRemediate
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
      <div className="w-full max-w-2xl bg-slate-900 border-2 border-red-500 rounded-3xl shadow-[0_0_50px_rgba(239,68,68,0.4)] overflow-hidden flex flex-col critical-stop-work-glow">
        
        {/* Red Alarm Header */}
        <div className="bg-red-600 p-6 text-white flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-950 flex items-center justify-center text-red-500 shadow-xl shrink-0">
            <AlertOctagon className="w-8 h-8" />
          </div>
          <div>
            <div className="text-[10px] font-mono font-black uppercase tracking-[0.25em] text-red-200">
              ZERO-TOLERANCE THRESHOLD BREACHED
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-display tracking-tight uppercase">
              OSHA STOP-WORK ORDER IN EFFECT
            </h2>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 text-slate-300 text-sm font-mono">
          <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/30 text-red-200 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold uppercase tracking-wider block text-red-400">
                CRITICAL SITE SAFETY RATING: {Math.round(currentSafetyScore)}% (BELOW 50% MANDATORY FLOOR)
              </span>
              <p className="mt-1 text-xs text-red-300/90 leading-relaxed">
                Repeated hazard exposure or willful non-compliance has triggered an emergency federal/GC stop-work order. All elevated deck, crane picks, and framing operations are frozen.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Mandatory Investigation & Stand-Down Protocols:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center gap-2.5">
                <Users className="w-4 h-4 text-amber-400" />
                <span>All-Hands Stand-Down (140 Craft)</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-sky-400" />
                <span>4-Hour Critical Path Delay</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center gap-2.5">
                <FileWarning className="w-4 h-4 text-red-400" />
                <span>Mandatory Corrective Action Plan (CAP)</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center gap-2.5">
                <HardHat className="w-4 h-4 text-emerald-400" />
                <span>100% PFAS & Rigging Audit</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            To lift the Stop-Work Order and resume operations, you must personally lead an immediate emergency safety stand-down, certify retraining with trade stewards, and authorize $15,000 in third-party safety watch staging.
          </p>

          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button
              onClick={onRemediate}
              className="w-full sm:w-auto flex items-center justify-center gap-3 bg-red-600 hover:bg-red-500 text-white font-black px-6 py-3.5 rounded-xl font-mono text-xs tracking-widest uppercase transition-all shadow-lg hover:shadow-red-600/30"
            >
              <span>EXECUTE EMERGENCY SAFETY STAND-DOWN & RESUME</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
