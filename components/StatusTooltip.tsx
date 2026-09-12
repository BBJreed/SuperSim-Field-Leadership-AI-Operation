import React, { useState, useRef, useEffect } from 'react';
import { Info, Sparkles, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

export interface StatusTooltipProps {
  title: string;
  statusText?: string;
  statusBadgeColor?: 'emerald' | 'amber' | 'red' | 'sky' | 'indigo' | 'slate';
  definition: string;
  benchmark?: string;
  superTip?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  children: React.ReactNode;
  className?: string;
  interactive?: boolean;
}

export const StatusTooltip: React.FC<StatusTooltipProps> = ({
  title,
  statusText,
  statusBadgeColor = 'amber',
  definition,
  benchmark,
  superTip,
  position = 'bottom',
  children,
  className = '',
  interactive = true
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const show = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsVisible(true);
  };

  const hide = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 150);
  };

  const toggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsVisible(prev => !prev);
  };

  // Close when clicking outside
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsVisible(false);
      }
    };
    if (isVisible) {
      document.addEventListener('mousedown', handleDocumentClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleDocumentClick);
    };
  }, [isVisible]);

  const getBadgeClasses = () => {
    switch (statusBadgeColor) {
      case 'emerald':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'red':
        return 'bg-red-500/20 text-red-300 border-red-500/40';
      case 'sky':
        return 'bg-sky-500/20 text-sky-300 border-sky-500/40';
      case 'indigo':
        return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40';
      case 'slate':
        return 'bg-slate-800 text-slate-300 border-slate-700';
      case 'amber':
      default:
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
    }
  };

  const getPositionClasses = () => {
    switch (position) {
      case 'top':
        return 'bottom-full left-1/2 -translate-x-1/2 mb-2';
      case 'left':
        return 'right-full top-1/2 -translate-y-1/2 mr-2';
      case 'right':
        return 'left-full top-1/2 -translate-y-1/2 ml-2';
      case 'bottom':
      default:
        return 'top-full left-1/2 -translate-x-1/2 mt-2';
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative inline-block ${className}`}
      onMouseEnter={show}
      onMouseLeave={hide}
      onClick={interactive ? toggle : undefined}
    >
      {/* Target element */}
      <div className="cursor-help transition-opacity hover:opacity-95">
        {children}
      </div>

      {/* Tooltip Popover */}
      {isVisible && (
        <div
          role="tooltip"
          className={`absolute z-50 w-72 sm:w-80 bg-slate-950/98 text-slate-100 p-3.5 rounded-xl border border-slate-700 shadow-2xl backdrop-blur-md text-left transition-all duration-200 animate-in fade-in zoom-in-95 pointer-events-auto ${getPositionClasses()}`}
          onMouseEnter={show}
          onMouseLeave={hide}
        >
          {/* Header & Status */}
          <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-800">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0"></span>
              <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-200 truncate">
                {title}
              </span>
            </div>
            {statusText && (
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border tracking-wider uppercase shrink-0 ${getBadgeClasses()}`}>
                {statusText}
              </span>
            )}
          </div>

          {/* Definition */}
          <p className="mt-2 text-xs text-slate-300 leading-relaxed font-sans">
            {definition}
          </p>

          {/* Benchmark / Floor Target */}
          {benchmark && (
            <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
              <span className="text-slate-500 uppercase">Tolerance / Target:</span>
              <span className="text-amber-400 font-bold">{benchmark}</span>
            </div>
          )}

          {/* Superintendent Field Tip */}
          {superTip && (
            <div className="mt-2 p-2 rounded-lg bg-slate-900/90 border border-slate-800 text-[11px] text-slate-400 leading-snug flex items-start gap-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-amber-300 font-semibold">Superintendent Tip:</strong> {superTip}
              </span>
            </div>
          )}

          {/* Micro arrow anchor */}
          <div
            className={`absolute w-2.5 h-2.5 bg-slate-950 border-slate-700 rotate-45 pointer-events-none ${
              position === 'bottom'
                ? '-top-1.5 left-1/2 -translate-x-1/2 border-t border-l'
                : position === 'top'
                  ? '-bottom-1.5 left-1/2 -translate-x-1/2 border-b border-r'
                  : position === 'left'
                    ? '-right-1.5 top-1/2 -translate-y-1/2 border-t border-r'
                    : '-left-1.5 top-1/2 -translate-y-1/2 border-b border-l'
            }`}
          />
        </div>
      )}
    </div>
  );
};
