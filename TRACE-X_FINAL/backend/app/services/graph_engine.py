import networkx as nx
from datetime import datetime, timezone
from typing import Dict, List, Optional, Tuple

from app.services.blockchain_adapter import BlockchainAdapter
from app.services.clustering import ClusteringEngine
from app.services.typology import TypologyClassifier
from app.services.ml_anomaly import MLAnomalyDetector
from app.services.evidence import EvidenceService

SANCTION_LABELS = {
    "OFAC_SDN": "OFAC SDN sanctioned entity",
    "SEIZED_FBI_DOJ_2023": "seized by FBI/DOJ (2023)",
    "HIGH_RISK_PRIVACY": "high-risk privacy protocol",
    "ILLICIT_HEIST": "confirmed hack/theft address",
    "CYBER_EXTORTION": "ransomware extortion repository"
}

def _sanction_label(status: Optional[str]) -> str:
    if not status:
        return "unregistered / non-KYC mixing service"
    return SANCTION_LABELS.get(status, status.replace("_", " "))

class TraceEngine:
    """
    Core BFS Graph Traversal and Intelligence Attribution Engine.
    Employs NetworkX for graph analysis, multi-factor risk attribution,
    wallet clustering, automated typology classification, and AI/ML anomaly scoring.
    """

    def __init__(self):
        self.adapter = BlockchainAdapter()
        self.clustering_engine = ClusteringEngine()
        self.typology_classifier = TypologyClassifier()
        self.anomaly_detector = MLAnomalyDetector()

    def build_trace(self, start_address: str, chain: str, max_hops: int = 5) -> dict:
        G = nx.DiGraph()
        nodes: Dict[str, dict] = {}
        edges: List[dict] = []
        queue: List[Tuple[str, int]] = [(start_address, 0)]
        visited: set = set()
        hop_distances: Dict[str, int] = {start_address: 0}

        # Seed origin
        nodes[start_address] = self._create_node(start_address, is_suspect=True, chain=chain)
        G.add_node(start_address)

        while queue:
            current_addr, current_hop = queue.pop(0)

            if current_addr in visited or current_hop >= max_hops:
                continue
            visited.add(current_addr)

            txs = self.adapter.get_transactions(current_addr, chain)

            for tx in txs:
                to_addr = tx["to"]
                tx_chain = tx.get("chain", chain)
                edge_id = f"e-{tx['hash']}"

                edge_data = {
                    "id": edge_id,
                    "source": current_addr,
                    "target": to_addr,
                    "amount": tx["amount"],
                    "timestamp": tx.get("timestamp", ""),
                    "chain": tx_chain,
                    "hash": tx["hash"],
                }
                edges.append(edge_data)
                G.add_edge(current_addr, to_addr, **edge_data)

                if to_addr not in nodes:
                    nodes[to_addr] = self._create_node(to_addr, is_suspect=False, chain=tx_chain)
                    hop_distances[to_addr] = current_hop + 1
                    G.add_node(to_addr)

                    entity = self.adapter.get_known_entity(to_addr)
                    # Don't traverse beyond terminal exchanges
                    if entity.get("type") not in ("EXCHANGE",):
                        queue.append((to_addr, current_hop + 1))

        # Annotate nodes with hop distance
        for addr, dist in hop_distances.items():
            if addr in nodes:
                nodes[addr]["hop_distance"] = dist

        node_list = list(nodes.values())

        # ── 1. Graph Risk Intelligence Analysis ──
        intelligence = self._analyze(G, nodes, edges, start_address)

        # ── 2. Run Wallet Clustering Engine ──
        discovered_clusters = self.clustering_engine.analyze_graph_clusters(node_list, edges)
        # Map cluster IDs back onto nodes
        addr_to_cluster = {}
        for c in discovered_clusters:
            for m in c["member_addresses"]:
                addr_to_cluster[m] = c["cluster_id"]

        for n in node_list:
            if n["id"] in addr_to_cluster:
                n["cluster_id"] = addr_to_cluster[n["id"]]

        # ── 3. AI/ML Anomaly Detection ──
        ml_anomaly = self.anomaly_detector.detect(node_list, edges, start_address)

        raw_result = {
            "nodes": node_list,
            "edges": edges,
            "intelligence": intelligence,
            "clustering": {
                "clusters": discovered_clusters,
                "total_clusters": len(discovered_clusters),
            },
            "ml_anomaly": ml_anomaly,
            "trace_metadata": {
                "start_address": start_address,
                "chain": chain,
                "total_nodes": len(node_list),
                "total_edges": len(edges),
                "max_hop_depth": max(hop_distances.values(), default=0),
                "timestamp": datetime.now(timezone.utc).isoformat(),
            },
        }

        # ── 4. Automated Fraud Typology Classification ──
        typology = self.typology_classifier.classify(raw_result)
        raw_result["typology"] = typology

        # ── 5. Cryptographic Evidence & Section 65B Certification ──
        sha256_hash = EvidenceService.compute_canonical_hash(raw_result)
        certificate = EvidenceService.generate_certificate("TEMP", sha256_hash)
        raw_result["evidence"] = {
            "canonical_sha256": sha256_hash,
            "certificate_65b": certificate
        }

        return raw_result

    def _create_node(self, address: str, is_suspect: bool, chain: str) -> dict:
        entity = self.adapter.get_known_entity(address)
        return {
            "id": address,
            "type": entity.get("type", "UNKNOWN"),
            "label": entity.get("label", "Untagged Wallet"),
            "chain": entity.get("chain", chain),
            "is_suspect": is_suspect,
            "sanction_status": entity.get("sanction_status"),
            "confidence": entity.get("confidence"),
            "vasp_name": entity.get("vasp_name"),
            "vasp_jurisdiction": entity.get("vasp_jurisdiction"),
            "first_seen": entity.get("first_seen"),
            "tx_count": entity.get("tx_count"),
            "risk_flags": entity.get("risk_flags", []),
            "hop_distance": 0,
        }

    def _analyze(self, G: nx.DiGraph, nodes: dict, edges: list, start_address: str) -> dict:
        risk_score = 0
        risk_factors = []
        vasp_match: Optional[dict] = None
        chains_used: set = set()

        for node_data in nodes.values():
            chains_used.add(node_data.get("chain", "ETH"))

        # Factor 1: Mixer Interaction
        mixer_nodes = [n for n in nodes.values() if n.get("type") == "MIXER"]
        if mixer_nodes:
            mixer = mixer_nodes[0]
            label = _sanction_label(mixer.get("sanction_status"))
            risk_score += 35
            risk_factors.append({
                "factor": "MIXER_INTERACTION",
                "points": 35,
                "description": f"Funds routed through {mixer['label']} — {label}. "
                               f"Mixer usage severs traceability and is a primary red-flag indicator under PMLA 2002.",
                "severity": "CRITICAL",
                "icon": "🔴",
            })

        # Factor 2: Cross-Chain Obfuscation
        if len(chains_used) > 1:
            risk_score += 25
            risk_factors.append({
                "factor": "CROSS_CHAIN_OBFUSCATION",
                "points": 25,
                "description": f"Cross-chain bridge used to move funds across "
                               f"{' → '.join(sorted(chains_used))} networks. "
                               f"Significantly increases attribution complexity.",
                "severity": "HIGH",
                "icon": "🌉",
            })

        # Factor 3: High-Velocity Fan-Out
        outgoing = [e for e in edges if e["source"] == start_address]
        if len(outgoing) >= 3:
            risk_score += 15
            risk_factors.append({
                "factor": "HIGH_VELOCITY_FAN_OUT",
                "points": 15,
                "description": f"Origin wallet split funds to {len(outgoing)} addresses "
                               f"within a short time window — consistent with automated layering scripts.",
                "severity": "HIGH",
                "icon": "⚡",
            })

        # Factor 4: Deep Multi-Hop Chain
        max_depth = max((n.get("hop_distance", 0) for n in nodes.values()), default=0)
        if max_depth >= 4:
            risk_score += 12
            risk_factors.append({
                "factor": "DEEP_LAYERING",
                "points": 12,
                "description": f"Transaction chain reaches {max_depth} hops from origin. "
                               f"Depth beyond 3 hops is a primary indicator of deliberate layering.",
                "severity": "MEDIUM",
                "icon": "🔗",
            })

        # Factor 5: Associated Suspect Wallets
        assoc_suspects = [
            n for addr, n in nodes.items()
            if n.get("type") == "SUSPECT" and addr != start_address
        ]
        if assoc_suspects:
            risk_score += 10
            risk_factors.append({
                "factor": "ASSOCIATED_SUSPECT_NETWORK",
                "points": 10,
                "description": f"{len(assoc_suspects)} additional suspect wallet(s) identified in transaction graph.",
                "severity": "MEDIUM",
                "icon": "🕸️",
            })

        # Factor 6: High Transaction Complexity
        if len(edges) > 10:
            risk_score += 8
            risk_factors.append({
                "factor": "COMPLEX_TRANSACTION_GRAPH",
                "points": 8,
                "description": f"{len(edges)} total transactions detected across graph. "
                               f"High edge density indicates systematic obfuscation.",
                "severity": "MEDIUM",
                "icon": "📊",
            })

        risk_score = min(risk_score, 100)

        # Terminal VASP identification
        exchange_nodes = [
            (addr, n) for addr, n in nodes.items() if n.get("type") == "EXCHANGE"
        ]
        if exchange_nodes:
            exchange_nodes.sort(key=lambda x: x[1].get("hop_distance", 999))
            best_addr, best_node = exchange_nodes[0]
            confidence = best_node.get("confidence", 0.85)
            v_name = best_node.get("vasp_name") or best_node.get("label")
            vasp_match = {
                "name": v_name,
                "label": best_node.get("label"),
                "address": best_addr,
                "confidence": confidence,
                "confidence_pct": f"{int(confidence * 100)}%",
                "distance_hops": best_node.get("hop_distance", 0),
                "chain": best_node.get("chain", "ETH"),
                "jurisdiction": best_node.get("vasp_jurisdiction", "Unknown"),
                "action": f"Serve legal summons under Section 91 CrPC / Section 94 BNSS to {v_name} compliance unit for emergency account freeze & KYC seizure.",
            }

        secondary_vasps = []
        if len(exchange_nodes) > 1:
            for addr, n in exchange_nodes[1:]:
                secondary_vasps.append({
                    "name": n.get("vasp_name") or n.get("label"),
                    "address": addr,
                    "confidence": n.get("confidence", 0.7),
                    "confidence_pct": f"{int(n.get('confidence', 0.7) * 100)}%",
                    "distance_hops": n.get("hop_distance", 0),
                    "chain": n.get("chain", "ETH"),
                })

        return {
            "risk_score": risk_score,
            "risk_level": "CRITICAL" if risk_score > 75 else "HIGH" if risk_score > 55 else "ELEVATED",
            "risk_factors": risk_factors,
            "vasp": vasp_match,
            "secondary_vasps": secondary_vasps,
            "chains_involved": sorted(chains_used),
            "total_transactions": len(edges),
            "total_nodes": len(nodes),
            "has_mixer": bool(mixer_nodes),
            "has_cross_chain": len(chains_used) > 1,
            "max_hop_depth": max_depth,
        }
