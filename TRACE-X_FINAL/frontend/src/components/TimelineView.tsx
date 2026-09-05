import {
  ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import { ArrowRight, Clock } from "lucide-react";
import { TraceEdge, TraceNode } from "../types";

interface Props {
  edges: TraceEdge[];
  nodes: TraceNode[];
}

const CHAIN_COLOR: Record<string, string> = {
  ETH: "#64748b",
  TRX: "#a78bfa",
  BTC: "#f59e0b",
};

function labelFor(nodes: TraceNode[], id: string) {
  return nodes.find((n) => n.id === id)?.label ?? id.slice(0, 10) + "…";
}

export default function TimelineView({ edges, nodes }: Props) {
  const sorted = [...edges].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  const chartData = sorted.map((e, i) => ({
    ...e,
    seq: i + 1,
    t: new Date(e.timestamp).getTime(),
    sourceLabel: labelFor(nodes, e.source),
    targetLabel: labelFor(nodes, e.target),
  }));

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
      {/* Chart */}
      <div className="h-64 shrink-0 border-b border-slate-800 px-4 pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />
            <XAxis
              dataKey="seq"
              name="Hop sequence"
              stroke="#475569"
              tick={{ fill: "#64748b", fontSize: 10 }}
              label={{ value: "Transaction sequence", position: "insideBottom", offset: -3, fill: "#475569", fontSize: 10 }}
            />
            <YAxis
              dataKey="amount"
              name="Amount"
              stroke="#475569"
              tick={{ fill: "#64748b", fontSize: 10 }}
              label={{ value: "Amount", angle: -90, position: "insideLeft", fill: "#475569", fontSize: 10 }}
            />
            <ZAxis range={[80, 80]} />
            <Tooltip
              cursor={{ strokeDasharray: "3 3", stroke: "#334155" }}
              contentStyle={{ background: "#0f172a", border: "1px solid #334155", borderRadius: 8, fontSize: 11 }}
              labelStyle={{ color: "#94a3b8" }}
              formatter={(value: any, name: string) => [value, name]}
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const d = payload[0].payload;
                return (
                  <div className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-[11px]">
                    <p className="text-slate-300 font-mono">{d.sourceLabel} → {d.targetLabel}</p>
                    <p className="text-slate-500 mt-1">{d.amount} · {d.chain} · {new Date(d.t).toLocaleString()}</p>
                  </div>
                );
              }}
            />
            <Scatter data={chartData} fill="#3b82f6">
              {chartData.map((d, i) => (
                <Cell key={i} fill={CHAIN_COLOR[d.chain] ?? "#3b82f6"} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Chronological ledger */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-1.5">
        {sorted.map((e, i) => (
          <div
            key={e.id}
            className="flex items-center gap-3 bg-slate-900/60 border border-slate-800 rounded-lg px-3 py-2 text-xs"
          >
            <span className="text-slate-600 font-mono w-6 text-right shrink-0">{i + 1}</span>
            <Clock size={11} className="text-slate-600 shrink-0" />
            <span className="text-slate-500 font-mono shrink-0 w-40 truncate">
              {new Date(e.timestamp).toLocaleString()}
            </span>
            <span className="text-slate-300 font-mono truncate">{labelFor(nodes, e.source)}</span>
            <ArrowRight size={12} className="text-slate-600 shrink-0" />
            <span className="text-slate-300 font-mono truncate">{labelFor(nodes, e.target)}</span>
            <span
              className="ml-auto font-mono font-semibold shrink-0"
              style={{ color: CHAIN_COLOR[e.chain] ?? "#94a3b8" }}
            >
              {e.amount} {e.chain}
            </span>
          </div>
        ))}
        {sorted.length === 0 && (
          <p className="text-slate-600 text-sm text-center py-8">No transactions to display.</p>
        )}
      </div>
    </div>
  );
}
