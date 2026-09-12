import React, { useState } from 'react';
import { 
  X, 
  Terminal, 
  Layers, 
  Send, 
  Check, 
  Copy, 
  Download, 
  Trash2, 
  MessageSquare,
  Building2,
  Box,
  ChevronDown,
  ChevronRight,
  Zap,
  Filter,
  Search,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { EnterpriseTelemetryEvent } from '../types';

interface EnterpriseTelemetryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  events: EnterpriseTelemetryEvent[];
  onClear: () => void;
  onTriggerTestPing: () => void;
}

type TabCategory = 'ALL' | 'PROCORE' | 'AUTODESK_ACC' | 'SUB_SMS_DISPATCH';

/**
 * Syntax-highlighted JSON renderer for portfolio and executive demonstrations
 */
const JsonSyntaxViewer: React.FC<{ data: any }> = ({ data }) => {
  const jsonString = typeof data === 'string' ? data : JSON.stringify(data, null, 2);

  // Parse lines with color tokens
  const renderHighlightedLine = (line: string, index: number) => {
    // Regex for key, string, number, boolean, null
    const parts = line.split(/("(?:\\u[\da-fA-F]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(?:true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g);

    return (
      <div key={index} className="table-row font-mono text-[11px] leading-relaxed">
        <span className="table-cell pr-3 select-none text-slate-600 text-right opacity-50 w-8">
          {index + 1}
        </span>
        <span className="table-cell whitespace-pre">
          {parts.map((part, i) => {
            if (!part) return null;
            if (/^".*":$/.test(part)) {
              // Object Key
              return <span key={i} className="text-amber-300 font-semibold">{part}</span>;
            } else if (/^".*"$/.test(part)) {
              // String Value
              return <span key={i} className="text-emerald-400">{part}</span>;
            } else if (/^(true|false)$/.test(part)) {
              // Boolean
              return <span key={i} className="text-purple-400 font-bold">{part}</span>;
            } else if (/^null$/.test(part)) {
              // Null
              return <span key={i} className="text-rose-400 font-bold">{part}</span>;
            } else if (/^-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?$/.test(part)) {
              // Number
              return <span key={i} className="text-sky-400 font-semibold">{part}</span>;
            }
            // Syntax punctuation
            return <span key={i} className="text-slate-400">{part}</span>;
          })}
        </span>
      </div>
    );
  };

  const lines = jsonString.split('\n');

  return (
    <div className="table w-full select-text">
      {lines.map((line, idx) => renderHighlightedLine(line, idx))}
    </div>
  );
};

export const EnterpriseTelemetryDrawer: React.FC<EnterpriseTelemetryDrawerProps> = ({
  isOpen,
  onClose,
  events,
  onClear,
  onTriggerTestPing
}) => {
  const [selectedPlatformTab, setSelectedPlatformTab] = useState<TabCategory>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(events[0]?.id || null);
  const [activeSubTab, setActiveSubTab] = useState<'REQUEST' | 'RESPONSE' | 'HEADERS'>('REQUEST');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  // Filter events based on Platform Tabs and Search
  const filteredEvents = events.filter(e => {
    if (selectedPlatformTab === 'PROCORE' && e.platform !== 'PROCORE') return false;
    if (selectedPlatformTab === 'AUTODESK_ACC' && e.platform !== 'AUTODESK_ACC') return false;
    if (selectedPlatformTab === 'SUB_SMS_DISPATCH' && e.platform !== 'SUB_SMS_DISPATCH') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match = e.summary.toLowerCase().includes(q) ||
                    e.endpoint.toLowerCase().includes(q) ||
                    e.statusCode.toString().includes(q) ||
                    JSON.stringify(e.requestPayload).toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const handleCopyPayload = (id: string, data: any) => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(events, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `supersim_enterprise_telemetry_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const procoreCount = events.filter(e => e.platform === 'PROCORE').length;
  const autodeskCount = events.filter(e => e.platform === 'AUTODESK_ACC').length;
  const smsCount = events.filter(e => e.platform === 'SUB_SMS_DISPATCH').length;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div 
        onClick={onClose} 
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity animate-in fade-in cursor-pointer"
      />

      {/* Slide-out Drawer Panel */}
      <div className="relative w-full max-w-2xl bg-slate-900 border-l border-slate-800 shadow-2xl z-10 flex flex-col h-full animate-in slide-in-from-right duration-300">
        
        {/* Drawer Header */}
        <div className="p-5 sm:p-6 bg-slate-950 border-b border-slate-800 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <Terminal className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-black font-display tracking-tight text-white uppercase">
                    ENTERPRISE INTEGRATION TELEMETRY
                  </h2>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-mono text-[10px] font-bold animate-pulse">
                    LIVE WEBHOOKS
                  </span>
                </div>
                <p className="text-xs font-mono text-slate-400">
                  Real-time payloads to Procore API v1.0, Autodesk ACC (BIM 360), & Subcontractor SMS Dispatch
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Close drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Platform Status Indicators */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 text-[11px] font-mono">
            
            {/* Procore API */}
            <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
              <div className="truncate">
                <div className="text-[10px] text-slate-500 font-bold">PROCORE API</div>
                <div className="text-slate-200 font-bold truncate">REST v1.0 SYNC</div>
              </div>
            </div>

            {/* Autodesk ACC */}
            <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse"></span>
              <div className="truncate">
                <div className="text-[10px] text-slate-500 font-bold">AUTODESK ACC</div>
                <div className="text-slate-200 font-bold truncate">BIM 360 CLOUD</div>
              </div>
            </div>

            {/* Subcontractor SMS */}
            <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <div className="truncate">
                <div className="text-[10px] text-slate-500 font-bold">SUB SMS GATEWAY</div>
                <div className="text-slate-200 font-bold truncate">TWILIO DIRECT</div>
              </div>
            </div>

          </div>
        </div>

        {/* Tabbed Views for Enterprise Integrations */}
        <div className="p-4 bg-slate-900/90 border-b border-slate-800 space-y-3">
          
          {/* Primary Platform Tabs */}
          <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono">
            
            <button
              type="button"
              onClick={() => setSelectedPlatformTab('ALL')}
              className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg transition-all cursor-pointer ${
                selectedPlatformTab === 'ALL'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">All</span>
              <span className="text-[10px] opacity-80">({events.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedPlatformTab('PROCORE')}
              className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg transition-all cursor-pointer ${
                selectedPlatformTab === 'PROCORE'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Procore</span>
              <span className="text-[10px] opacity-80">({procoreCount})</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedPlatformTab('AUTODESK_ACC')}
              className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg transition-all cursor-pointer ${
                selectedPlatformTab === 'AUTODESK_ACC'
                  ? 'bg-sky-500 text-slate-950 font-black shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Box className="w-3.5 h-3.5" />
              <span>ACC / BIM</span>
              <span className="text-[10px] opacity-80">({autodeskCount})</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedPlatformTab('SUB_SMS_DISPATCH')}
              className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg transition-all cursor-pointer ${
                selectedPlatformTab === 'SUB_SMS_DISPATCH'
                  ? 'bg-emerald-500 text-slate-950 font-black shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Sub SMS</span>
              <span className="text-[10px] opacity-80">({smsCount})</span>
            </button>

          </div>

          {/* Search, Ping, and Export Action Strip */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter payloads (endpoint, RFI, status code)..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onTriggerTestPing}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-medium border border-slate-700 cursor-pointer transition-colors"
                title="Send test health ping to simulated cloud endpoints"
              >
                <Send className="w-3 h-3 text-amber-400" />
                <span>Test Webhook</span>
              </button>

              <button
                onClick={handleExportJson}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-medium border border-slate-700 cursor-pointer transition-colors"
                title="Export all webhook JSON payloads"
              >
                <Download className="w-3 h-3 text-sky-400" />
                <span className="hidden sm:inline">Export</span>
              </button>

              <button
                onClick={onClear}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-950/60 hover:text-red-300 text-slate-400 text-xs font-mono border border-slate-700 hover:border-red-500/40 cursor-pointer transition-colors"
                title="Clear telemetry logs"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

        {/* Telemetry Stream List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          {filteredEvents.length === 0 ? (
            <div className="p-8 text-center text-slate-500 font-mono text-xs">
              <Terminal className="w-8 h-8 mx-auto mb-2 opacity-40 text-slate-400" />
              No telemetry events match your filter. Make a decision or transmit a radio directive in the simulation to trigger live payloads.
            </div>
          ) : (
            filteredEvents.map(event => {
              const isExpanded = expandedId === event.id;
              const isCopied = copiedId === event.id;
              const isSuccess = event.statusCode >= 200 && event.statusCode < 300;

              return (
                <div 
                  key={event.id}
                  className={`rounded-2xl border transition-all ${
                    isExpanded 
                      ? 'bg-slate-950 border-amber-500/60 shadow-xl ring-1 ring-amber-500/20' 
                      : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {/* Event summary header row */}
                  <div 
                    onClick={() => setExpandedId(isExpanded ? null : event.id)}
                    className="p-3.5 sm:p-4 flex items-start justify-between gap-3 cursor-pointer select-none"
                  >
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Platform Badge */}
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-black uppercase tracking-wider ${
                          event.platform === 'PROCORE' 
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' 
                            : event.platform === 'AUTODESK_ACC'
                              ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40'
                              : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        }`}>
                          {event.platform === 'PROCORE' ? 'PROCORE API' : event.platform === 'AUTODESK_ACC' ? 'AUTODESK ACC' : 'TWILIO SMS'}
                        </span>

                        {/* HTTP Method */}
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                          event.method === 'POST' ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' :
                          event.method === 'PATCH' ? 'bg-purple-950 text-purple-400 border border-purple-500/30' :
                          'bg-sky-950 text-sky-400 border border-sky-500/30'
                        }`}>
                          {event.method}
                        </span>

                        {/* HTTP Status Code */}
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold flex items-center gap-1 ${
                          isSuccess 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
                            : 'bg-red-500/20 text-red-400 border border-red-500/40'
                        }`}>
                          {isSuccess ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <AlertCircle className="w-3 h-3 text-red-400" />}
                          <span>{event.statusCode} {event.statusText}</span>
                        </span>

                        {/* Latency */}
                        <span className="text-[10px] font-mono text-slate-500">
                          {event.latencyMs}ms
                        </span>

                        {/* Timestamp */}
                        <span className="text-[10px] font-mono text-slate-500 ml-auto hidden sm:inline">
                          {event.timestamp}
                        </span>
                      </div>

                      {/* Event Summary */}
                      <h4 className="text-xs sm:text-sm font-bold text-slate-200 truncate">
                        {event.summary}
                      </h4>

                      {/* Endpoint URI */}
                      <div className="text-[11px] font-mono text-slate-400 truncate opacity-80">
                        {event.endpoint}
                      </div>
                    </div>

                    <div className="shrink-0 p-1 text-slate-400">
                      {isExpanded ? <ChevronDown className="w-4 h-4 text-amber-400" /> : <ChevronRight className="w-4 h-4" />}
                    </div>
                  </div>

                  {/* Expanded Syntax-Highlighted Payload Inspector */}
                  {isExpanded && (
                    <div className="border-t border-slate-800/80 p-4 bg-slate-900/60 rounded-b-2xl space-y-3">
                      
                      {/* Inspector Sub-Tabs & Copy Payload Button */}
                      <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
                        <div className="flex items-center gap-2 text-xs font-mono">
                          {(['REQUEST', 'RESPONSE', 'HEADERS'] as const).map(tab => (
                            <button
                              key={tab}
                              onClick={() => setActiveSubTab(tab)}
                              className={`px-2.5 py-1 rounded text-[11px] font-bold transition-colors cursor-pointer ${
                                activeSubTab === tab
                                  ? 'bg-slate-800 text-amber-400 border border-amber-500/30'
                                  : 'text-slate-400 hover:text-slate-200'
                              }`}
                            >
                              {tab === 'REQUEST' ? 'Request Body' : tab === 'RESPONSE' ? 'Response Body' : 'HTTP Headers'}
                            </button>
                          ))}
                        </div>

                        {/* Prominent Copy Payload Button for Portfolio Demo */}
                        <button
                          onClick={() => handleCopyPayload(
                            event.id, 
                            activeSubTab === 'REQUEST' ? event.requestPayload : activeSubTab === 'RESPONSE' ? event.responsePayload : event.headers
                          )}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-[11px] font-mono font-bold cursor-pointer transition-all shadow-sm"
                          title="Copy full JSON payload to clipboard"
                        >
                          {isCopied ? <Check className="w-3.5 h-3.5 text-slate-950" /> : <Copy className="w-3.5 h-3.5 text-slate-950" />}
                          <span>{isCopied ? 'PAYLOAD COPIED' : 'COPY PAYLOAD'}</span>
                        </button>
                      </div>

                      {/* Code Block Display with Syntax Highlighting */}
                      <div className="relative p-3.5 bg-slate-950 rounded-xl border border-slate-800 overflow-x-auto max-h-72 scrollbar-thin">
                        <JsonSyntaxViewer 
                          data={
                            activeSubTab === 'REQUEST' 
                              ? event.requestPayload 
                              : activeSubTab === 'RESPONSE' 
                                ? event.responsePayload 
                                : event.headers
                          } 
                        />
                      </div>

                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1">
                        <span>Standard: REST v1.0 & ISO/IEC 27001 Construction Telemetry</span>
                        <span>TX ID: {event.id}</span>
                      </div>

                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>REST Webhooks Active ({events.length} dispatches logged)</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold cursor-pointer transition-colors"
          >
            Close Telemetry
          </button>
        </div>

      </div>
    </div>
  );
};
