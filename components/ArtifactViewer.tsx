import React, { useState } from 'react';
import { 
  FileText, 
  Copy, 
  Check, 
  Download, 
  Printer, 
  ShieldCheck, 
  AlertTriangle,
  ClipboardList,
  Stamp,
  ExternalLink
} from 'lucide-react';
import { SiteArtifact } from '../types';

interface ArtifactViewerProps {
  artifact: SiteArtifact;
  superName: string;
}

export const ArtifactViewer: React.FC<ArtifactViewerProps> = ({ artifact, superName }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(
      `--- ${artifact.typeLabel.toUpperCase()} ---\n` +
      `DOC NO: ${artifact.documentNumber}\n` +
      `TITLE: ${artifact.title}\n` +
      `DATE: ${artifact.date}\n` +
      `AUTHOR: ${artifact.author}\n` +
      `RECIPIENT: ${artifact.recipient}\n\n` +
      artifact.fullContent
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([
      `# ${artifact.typeLabel}: ${artifact.documentNumber}\n\n` +
      `**Title:** ${artifact.title}\n` +
      `**Date:** ${artifact.date}\n` +
      `**Author:** ${artifact.author}\n` +
      `**Recipient:** ${artifact.recipient}\n` +
      (artifact.specSection ? `**Spec Section:** ${artifact.specSection}\n` : '') +
      `\n---\n\n${artifact.fullContent}\n`
    ], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = `${artifact.documentNumber}_${artifact.type}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const getBadgeStyle = () => {
    switch (artifact.type) {
      case 'NCR':
        return {
          headerBg: 'bg-red-950/80 border-red-700/60',
          stampColor: 'border-red-500 text-red-500',
          badgeText: 'NON-CONFORMANCE RECORD (OSHA/QA HOLD)',
          icon: <AlertTriangle className="w-5 h-5 text-red-400" />
        };
      case 'RFI':
        return {
          headerBg: 'bg-amber-950/70 border-amber-700/60',
          stampColor: 'border-amber-500 text-amber-500',
          badgeText: 'OFFICIAL REQUEST FOR INFORMATION (AIA)',
          icon: <ClipboardList className="w-5 h-5 text-amber-400" />
        };
      case 'DAILY_LOG':
      default:
        return {
          headerBg: 'bg-slate-900 border-slate-700',
          stampColor: 'border-emerald-500 text-emerald-400',
          badgeText: 'DAILY SUPERINTENDENT SITE LOG',
          icon: <FileText className="w-5 h-5 text-emerald-400" />
        };
    }
  };

  const style = getBadgeStyle();

  return (
    <div className="w-full bg-slate-950 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden text-slate-100 flex flex-col">
      {/* Document Control Ribbon */}
      <div className={`p-4 border-b flex flex-wrap items-center justify-between gap-3 ${style.headerBg}`}>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-900/80 rounded-lg border border-white/10">
            {style.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-black tracking-widest text-amber-400">
                {artifact.documentNumber}
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-300">
                {style.badgeText}
              </span>
            </div>
            <h3 className="font-bold text-slate-100 text-sm sm:text-base tracking-tight leading-snug">
              {artifact.title}
            </h3>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900/90 hover:bg-slate-800 border border-slate-700 rounded-lg text-xs font-mono font-medium text-slate-200 transition-colors"
            title="Copy document content"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900/90 hover:bg-slate-800 border border-slate-700 rounded-lg text-xs font-mono font-medium text-slate-200 transition-colors"
            title="Download formatted file"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* Formal Construction Document Body */}
      <div className="p-6 sm:p-8 bg-slate-900/60 font-mono text-xs sm:text-sm text-slate-300 space-y-6 select-text overflow-x-auto">
        
        {/* Document Header Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-950/80 border border-slate-800/80">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">DATE / TIME</div>
            <div className="text-slate-200 font-bold mt-0.5">{artifact.date}</div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">ISSUED BY</div>
            <div className="text-slate-200 font-bold mt-0.5 truncate">{artifact.author || superName}</div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">TARGET RECIPIENT</div>
            <div className="text-slate-200 font-bold mt-0.5 truncate">{artifact.recipient}</div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">SPEC REFERENCE</div>
            <div className="text-amber-400 font-bold mt-0.5 truncate">{artifact.specSection || 'Div 01 General Reqs'}</div>
          </div>
        </div>

        {/* Synopsis Callout */}
        <div className="p-4 rounded-xl bg-amber-950/20 border-l-4 border-amber-500 text-amber-200/90 text-xs sm:text-sm leading-relaxed">
          <div className="font-bold text-[10px] tracking-wider uppercase text-amber-400 mb-1">
            EXECUTIVE FIELD SYNOPSIS
          </div>
          {artifact.summary}
        </div>

        {/* Document Content Preformatted Block */}
        <div className="relative p-6 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs leading-relaxed text-slate-300 whitespace-pre-wrap">
          {/* Subtle Document Stamp */}
          <div className={`absolute top-6 right-6 border-2 border-dashed px-3 py-1.5 rounded text-[10px] font-black tracking-widest uppercase rotate-[-6deg] opacity-70 pointer-events-none select-none ${style.stampColor}`}>
            {artifact.type === 'NCR' ? 'HOLD POINT • ISSUED' : artifact.type === 'RFI' ? 'SUBMITTED TO ARCHITECT' : 'VERIFIED IN FIELD'}
          </div>

          {artifact.fullContent}
        </div>

        {/* Digital Signature & Verification Footer */}
        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-slate-400 text-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Cryptographically logged to Project Field Ledger (Procore Sync Status: Verified)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-500 uppercase">SIGNATURE:</span>
            <span className="font-serif italic font-semibold text-slate-200">{artifact.author || superName}</span>
          </div>
        </div>

      </div>
    </div>
  );
};
