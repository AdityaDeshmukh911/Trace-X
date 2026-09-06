import { useCallback, useEffect } from "react";
import ReactFlow, {
  Background, Controls, MarkerType,
  useNodesState, useEdgesState, Position, Handle,
  Node, Edge, NodeTypes, useReactFlow
} from "reactflow";
import dagre from "@dagrejs/dagre";
import "reactflow/dist/style.css";
import {
  AlertTriangle, Shuffle, Building2, GitFork,
  ArrowLeftRight, HelpCircle, Layers, Maximize2,
  ZoomIn, ZoomOut
} from "lucide-react";
import { TraceNode, TraceEdge } from "../types";

const NODE_W = 180;
const NODE_H = 72;

function applyDagreLayout(nodes: Node[], edges: Edge[]): Node[] {
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: "LR", nodesep: 35, ranksep: 65, marginx: 20, marginy: 20 });
  nodes.forEach((n) => g.setNode(n.id, { width: NODE_W, height: NODE_H }));
  edges.forEach((e) => g.setEdge(e.source, e.target));
  dagre.layout(g);
  return nodes.map((n) => {
    const pos = g.node(n.id);
    return { ...n, position: { x: pos.x - NODE_W / 2, y: pos.y - NODE_H / 2 } };
  });
}

// Wrap inner content in node-inner div so React Flow v11 inline transform is never clobbered
const baseNode = (
  border: string,
  bg: string,
  glow: string,
  icon: React.ReactNode,
  badge: string,
  badgeColor: string,
  data: { label: string; address: string; chain?: string; cluster_id?: string; extra?: string }
) => (
  <div className="node-inner">
    <div className={`px-3.5 py-2.5 rounded-xl border-2 ${border} ${bg} ${glow} min-w-[170px] max-w-[196px] relative backdrop-blur shadow-xl transition-transform hover:scale-105`}>
      <Handle type="target" position={Position.Left}  style={{ background: "#475569", width: 8, height: 8 }} />
      <Handle type="source" position={Position.Right} style={{ background: "#475569", width: 8, height: 8 }} />
      
      <div className="flex items-center gap-1.5 mb-1">
        {icon}
        <span className={`text-[9px] font-bold uppercase tracking-wider ${badgeColor}`}>{badge}</span>
        {data.chain && (
          <span className="ml-auto text-[8px] bg-slate-800 text-slate-300 px-1 rounded font-mono border border-slate-700">
            {data.chain}
          </span>
        )}
      </div>

      <p className="text-white text-[11px] font-bold leading-tight truncate">{data.label}</p>
      <p className="text-slate-400 text-[9px] font-mono mt-0.5">{data.address}</p>

      {data.cluster_id && (
        <div className="mt-1 flex items-center gap-1 text-[8px] text-purple-300 bg-purple-950/80 px-1 py-0.2 rounded border border-purple-800/80 truncate">
          <Layers size={8} />
          <span className="truncate">{data.cluster_id}</span>
        </div>
      )}

      {data.extra && <p className="text-[9px] mt-0.5">{data.extra}</p>}
    </div>
  </div>
);

const SuspectNode  = ({ data }: any) => baseNode(
  "border-red-500", "bg-red-950/90", "shadow-red-500/25",
  <AlertTriangle size={11} className="text-red-400" />, "SUSPECT", "text-red-400", data
);
const MixerNode = ({ data }: any) => baseNode(
  "border-orange-500", "bg-orange-950/90", "shadow-orange-500/25",
  <Shuffle size={11} className="text-orange-400" />, "MIXER", "text-orange-400", data
);
const ExchangeNode = ({ data }: any) => baseNode(
  "border-cyan-400", "bg-cyan-950/90", "shadow-cyan-500/30",
  <Building2 size={11} className="text-cyan-400" />,
  "VASP", "text-cyan-400",
  { ...data, extra: data.confidence ? <span className="text-cyan-300 font-semibold font-mono">Conf: {data.confidence}</span> : undefined }
);
const BridgeNode = ({ data }: any) => baseNode(
  "border-purple-500", "bg-purple-950/90", "shadow-purple-500/20",
  <ArrowLeftRight size={11} className="text-purple-400" />, "BRIDGE", "text-purple-400", data
);
const DexNode = ({ data }: any) => baseNode(
  "border-teal-500", "bg-teal-950/90", "shadow-teal-500/20",
  <GitFork size={11} className="text-teal-400" />, "DEX", "text-teal-400", data
);
const UnknownNode = ({ data }: any) => baseNode(
  "border-slate-700", "bg-slate-900/90", "",
  <HelpCircle size={11} className="text-slate-400" />, "WALLET", "text-slate-400", data
);

const NODE_TYPES: NodeTypes = {
  SUSPECT:  SuspectNode,
  MIXER:    MixerNode,
  EXCHANGE: ExchangeNode,
  BRIDGE:   BridgeNode,
  DEX:      DexNode,
  UNKNOWN:  UnknownNode,
};

const edgeColour = (chain: string) =>
  chain === "TRX" ? "#c084fc" : chain === "BTC" ? "#fbbf24" : "#38bdf8";

interface Props {
  traceNodes: TraceNode[];
  traceEdges: TraceEdge[];
  onNodeClick: (node: TraceNode) => void;
  panelOpen?: boolean;
}

function AutoFitHandler({ nodes, panelOpen }: { nodes: Node[]; panelOpen?: boolean }) {
  const { fitView } = useReactFlow();

  useEffect(() => {
    if (nodes.length > 0) {
      // Step 1: Immediate fit after node coordinates apply
      const t1 = setTimeout(() => {
        fitView({ padding: 0.15, duration: 400 });
      }, 60);

      // Step 2: Delayed fit after intelligence panel width transition completes
      const t2 = setTimeout(() => {
        fitView({ padding: 0.15, duration: 300 });
      }, 340);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [nodes, panelOpen, fitView]);

  return null;
}

function CanvasToolbar() {
  const { fitView, zoomIn, zoomOut } = useReactFlow();

  return (
    <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-[#0C101A]/90 backdrop-blur border border-white/[0.1] p-1.5 rounded-xl z-20 shadow-xl">
      <button
        onClick={() => fitView({ padding: 0.15, duration: 400 })}
        className="px-2.5 py-1 text-[11px] font-mono text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/60 rounded-lg flex items-center gap-1.5 font-semibold transition-all border border-emerald-500/20"
        title="Fit All Nodes to Canvas Screen"
      >
        <Maximize2 size={12} /> Auto-Fit
      </button>
      <div className="w-[1px] h-3 bg-white/10" />
      <button
        onClick={() => zoomIn({ duration: 200 })}
        className="p-1 text-slate-400 hover:text-white hover:bg-white/[0.06] rounded-lg transition-colors"
        title="Zoom In"
      >
        <ZoomIn size={13} />
      </button>
      <button
        onClick={() => zoomOut({ duration: 200 })}
        className="p-1 text-slate-400 hover:text-white hover:bg-white/[0.06] rounded-lg transition-colors"
        title="Zoom Out"
      >
        <ZoomOut size={13} />
      </button>
    </div>
  );
}

export default function GraphVisualizer({ traceNodes, traceEdges, onNodeClick, panelOpen }: Props) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    if (!traceNodes.length) return;

    const rawNodes: Node[] = traceNodes.map((n) => ({
      id:   n.id,
      type: n.type,
      position: { x: 0, y: 0 },
      data: {
        label:      n.label,
        address:    `${n.id.slice(0, 8)}...${n.id.slice(-5)}`,
        chain:      n.chain,
        cluster_id: n.cluster_id,
        confidence: n.confidence ? `${Math.round(n.confidence * 100)}%` : undefined,
        extra:      undefined,
        _raw:       n,
      },
    }));

    const rawEdges: Edge[] = traceEdges.map((e) => ({
      id:       e.id,
      source:   e.source,
      target:   e.target,
      animated: true,
      label:    `${e.amount} ${e.chain}`,
      labelStyle: { fill: "#cbd5e1", fontSize: 9, fontFamily: "monospace", fontWeight: 600 },
      labelBgStyle: { fill: "#090d16", fillOpacity: 0.85 },
      style:    { stroke: edgeColour(e.chain), strokeWidth: 1.8 },
      markerEnd: { type: MarkerType.ArrowClosed, color: edgeColour(e.chain), width: 14, height: 14 },
      data:     e,
    }));

    const layouted = applyDagreLayout(rawNodes, rawEdges);
    setNodes(layouted);
    setEdges(rawEdges);
  }, [traceNodes, traceEdges]);

  const handleNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => onNodeClick(node.data._raw as TraceNode),
    [onNodeClick]
  );

  return (
    <div className="w-full h-full bg-[#080B12] rounded-2xl border border-white/[0.08] overflow-hidden relative shadow-2xl">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={NODE_TYPES}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        fitView
        fitViewOptions={{ padding: 0.15 }}
        minZoom={0.2}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#141C2E" gap={24} size={1} />
        <Controls
          style={{ background: "#0C101A", border: "1px solid rgba(255,255,255,0.1)" }}
          showInteractive={false}
        />
        <AutoFitHandler nodes={nodes} panelOpen={panelOpen} />
        <CanvasToolbar />
      </ReactFlow>

      {/* Chain legend */}
      <div className="absolute bottom-4 left-4 flex gap-3 text-[10px] bg-slate-900/90 backdrop-blur border border-slate-800 rounded-xl px-3.5 py-2 shadow-xl z-10">
        <span className="flex items-center gap-1 text-slate-300">
          <span className="w-3 h-0.5 bg-sky-400 inline-block rounded" />ETH
        </span>
        <span className="flex items-center gap-1 text-slate-300">
          <span className="w-3 h-0.5 bg-purple-400 inline-block rounded" />TRX
        </span>
        <span className="flex items-center gap-1 text-slate-300">
          <span className="w-3 h-0.5 bg-amber-400 inline-block rounded" />BTC
        </span>
        <span className="text-slate-600">|</span>
        <span className="text-red-400 font-bold">■ SUSPECT</span>
        <span className="text-orange-400 font-bold">■ MIXER</span>
        <span className="text-cyan-400 font-bold">■ VASP</span>
        <span className="text-purple-400 font-bold">■ BRIDGE</span>
      </div>
    </div>
  );
}
