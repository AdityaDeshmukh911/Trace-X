import { X, Copy, Check, Clock, Hash, ShieldAlert, Link2 } from "lucide-react";
import { useState } from "react";
import { TraceNode } from "../types";

interface Props {
  node: TraceNode | null;
  onClose: () => void;
}

const TYPE_COLOR: Record<string, string> = {
  SUSPECT:  "text-red-400 border-red-500/40 bg-red-950/40",
  MIXER:    "text-orange-400 border-orange-500/40 bg-orange-950/40",
  EXCHANGE: "text-blue-400 border-blue-500/40 bg-blue-950/40",
  BRIDGE:   "text-purple-400 border-purple-500/40 bg-purple-950/40",
  DEX:      "text-teal-400 border-teal-500/40 bg-teal-950/40",
  UNKNOWN:  "text-slate-400 border-slate-600/40 bg-slate-800/40",
};

export default function NodeDetailModal({ node, onClose }: Props) {
  const [copied, setCopied] = useState(false);
  if (!node) return null;

  const copyAddr = () => {
    navigator.clipboard.writeText(node.id).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const badgeCls = TYPE_COLOR[node.type] ?? TYPE_COLOR.UNKNOWN;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-xl shadow-2xl shadow-black/50 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-5 pt-5 pb-3 border-b border-slate-800">
          <div>
            <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${badgeCls}`}>
              {node.type}
            </span>
            <h3 className="text-white font-semibold text-sm mt-2">{node.label}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4 space-y-3 max-h-[60vh] overflow-y-auto">
          {/* Address */}
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-wide mb-1">Wallet Address</p>
            <button
              onClick={copyAddr}
              className="w-full flex items-center justify-between gap-2 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-left hover:border-blue-500/50 transition-colors"
            >
              <span className="font-mono text-xs text-slate-300 truncate">{node.id}</span>
              {copied ? <Check size={13} className="text-emerald-400 shrink-0" /> : <Copy size={13} className="text-slate-500 shrink-0" />}
            </button>
          </div>

          {/* Grid facts */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-800/60 border border-slate-800 rounded-lg px-3 py-2">
              <p className="text-[10px] text-slate-500 uppercase tracking-wide flex items-center gap-1">
                <Link2 size={10} /> Chain
              </p>
              <p className="text-sm text-white font-mono mt-0.5">{node.chain}</p>
            </div>
            <div className="bg-slate-800/60 border border-slate-800 rounded-lg px-3 py-2">
              <p className="text-[10px] text-slate-500 uppercase tracking-wide flex items-center gap-1">
                <Hash size={10} /> Hop Distance
              </p>
              <p className="text-sm text-white font-mono mt-0.5">{node.hop_distance}</p>
            </div>
            <div className="bg-slate-800/60 border border-slate-800 rounded-lg px-3 py-2">
              <p className="text-[10px] text-slate-500 uppercase tracking-wide flex items-center gap-1">
                <Clock size={10} /> First Seen
              </p>
              <p className="text-sm text-white font-mono mt-0.5">{node.first_seen ?? "—"}</p>
            </div>
            <div className="bg-slate-800/60 border border-slate-800 rounded-lg px-3 py-2">
              <p className="text-[10px] text-slate-500 uppercase tracking-wide">Tx Count</p>
              <p className="text-sm text-white font-mono mt-0.5">{node.tx_count ?? "—"}</p>
            </div>
          </div>

          {/* VASP info if present */}
          {node.vasp_name && (
            <div className="bg-blue-950/30 border border-blue-900/50 rounded-lg px-3 py-2">
              <p className="text-[10px] text-blue-400 uppercase tracking-wide">VASP Identified</p>
              <p className="text-sm text-white font-semibold mt-0.5">{node.vasp_name}</p>
              {node.vasp_jurisdiction && (
                <p className="text-xs text-slate-400 mt-0.5">Jurisdiction: {node.vasp_jurisdiction}</p>
              )}
              {node.confidence !== undefined && (
                <p className="text-xs text-blue-300 mt-0.5">Confidence: {Math.round(node.confidence * 100)}%</p>
              )}
            </div>
          )}

          {/* Sanction status */}
          {node.sanction_status && (
            <div className="flex items-center gap-2 bg-red-950/40 border border-red-900/50 rounded-lg px-3 py-2">
              <ShieldAlert size={14} className="text-red-400 shrink-0" />
              <p className="text-xs text-red-300 font-medium">{node.sanction_status}</p>
            </div>
          )}

          {/* Risk flags */}
          {node.risk_flags && node.risk_flags.length > 0 && (
            <div>
              <p className="text-[10px] text-slate-500 uppercase tracking-wide mb-1.5">Risk Flags</p>
              <div className="flex flex-wrap gap-1.5">
                {node.risk_flags.map((flag) => (
                  <span
                    key={flag}
                    className="text-[10px] font-medium px-2 py-1 rounded-md bg-amber-950/40 border border-amber-800/40 text-amber-300"
                  >
                    {flag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {node.is_suspect && (
            <div className="text-[10px] text-red-400 font-bold uppercase tracking-wide text-center pt-1">
              ⚠ Origin Suspect Wallet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
