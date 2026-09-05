import os
from datetime import datetime
from typing import Dict, List, Optional

from app.services.graph_engine import _sanction_label

# Claude model used for the optional AI-generated narrative. Kept as a
# constant so it's easy to bump without hunting through the method body.
NARRATIVE_MODEL = "claude-sonnet-4-6"


class IntelligenceService:
    """
    Generates human-readable narratives and enriches trace results with
    structured intelligence output for investigators.

    Narrative generation has two modes:
      - LLM mode: if ANTHROPIC_API_KEY is set, a real Claude call writes the
        narrative from a structured, facts-only summary of the trace (never
        raw internal objects — this keeps the model from inventing details
        that aren't actually in the graph).
      - TEMPLATE mode: a deterministic rule-based narrative (no ML), used
        whenever no API key is configured, or if the LLM call fails for any
        reason (network, rate limit, etc.) — this fallback is silent so a
        live demo never breaks on stage.

    Either way, `trace_result["narrative_source"]` is set to "LLM" or
    "TEMPLATE" so the PDF/report can label the section honestly instead of
    always claiming "AI-generated" regardless of which path actually ran.
    """

    def __init__(self):
        self.llm_available = bool(os.getenv("ANTHROPIC_API_KEY"))

    def enrich(self, trace_result: dict) -> dict:
        """Add a narrative (LLM or template) to an existing trace result."""
        narrative, source = self._generate_narrative(trace_result)
        trace_result["narrative"] = narrative
        trace_result["narrative_source"] = source
        return trace_result

    def _generate_narrative(self, trace_result: dict) -> tuple:
        if self.llm_available:
            try:
                return self._generate_narrative_llm(trace_result), "LLM"
            except Exception:
                # Silent fallback to the template — protects live demos from
                # a flaky network call or an expired/invalid key.
                pass
        return self._generate_narrative_template(trace_result), "TEMPLATE"

    # ── LLM narrative ────────────────────────────────────────────────────

    def _generate_narrative_llm(self, trace_result: dict) -> str:
        """
        Calls Claude with a compact, structured, facts-only summary of the
        trace (see _build_facts_summary) and asks it to write the report
        narrative. The system prompt explicitly forbids inventing details
        not present in the summary, so the model can only rephrase/organise
        real trace data — not hallucinate new addresses or amounts.
        """
        import anthropic

        client = anthropic.Anthropic()
        facts = self._build_facts_summary(trace_result)

        resp = client.messages.create(
            model=NARRATIVE_MODEL,
            max_tokens=800,
            system=(
                "You are a financial-crimes intelligence analyst drafting the "
                "narrative section of a law-enforcement crypto-fraud investigation "
                "report for Indian cyber cell investigators. You will be given a "
                "structured, facts-only summary of a blockchain trace. "
                "Write ONLY from those facts — never invent wallet addresses, "
                "amounts, dates, entity names, or confidence figures that are not "
                "given to you. Write 4-7 short, professional paragraphs. Cover, in "
                "order: (1) a one-paragraph overview of the trace, (2) fund "
                "dispersal pattern, (3) any mixer/DEX/bridge findings, (4) VASP "
                "attribution and recommended legal action, (5) a CONCLUSION "
                "paragraph stating the numeric risk score/level and citing that "
                "findings are investigative intelligence only, not legal evidence. "
                "Plain text output, paragraphs separated by a blank line — no "
                "markdown headers, no bullet lists."
            ),
            messages=[{"role": "user", "content": facts}],
        )
        text = "".join(b.text for b in resp.content if getattr(b, "type", "") == "text")
        return text.strip()

    def _build_facts_summary(self, trace_result: dict) -> str:
        """Flattens the trace into a compact fact sheet for the LLM prompt."""
        nodes = trace_result.get("nodes", [])
        edges = trace_result.get("edges", [])
        intel = trace_result.get("intelligence", {})
        meta  = trace_result.get("trace_metadata", {})
        vasp  = intel.get("vasp")

        lines = [
            f"Origin wallet: {meta.get('start_address', 'UNKNOWN')}",
            f"Origin chain: {meta.get('chain', 'ETH')}",
            f"Total nodes: {meta.get('total_nodes', len(nodes))}",
            f"Total transactions: {meta.get('total_edges', len(edges))}",
            f"Max hop depth: {meta.get('max_hop_depth', 0)}",
            f"Chains involved: {', '.join(intel.get('chains_involved', []))}",
            f"Risk score: {intel.get('risk_score', 0)}/100 ({intel.get('risk_level', 'ELEVATED')})",
        ]

        factors = intel.get("risk_factors", [])
        if factors:
            lines.append("Risk factors triggered:")
            for f in factors:
                lines.append(f"  - {f.get('factor')}: {f.get('description')} (+{f.get('points')} pts, {f.get('severity')})")

        mixers = [n for n in nodes if n.get("type") == "MIXER"]
        for m in mixers:
            lines.append(
                f"Mixer encountered: {m.get('label')} "
                f"(designation: {_sanction_label(m.get('sanction_status'))})"
            )

        bridges = [n for n in nodes if n.get("type") == "BRIDGE"]
        for b in bridges:
            lines.append(f"Bridge encountered: {b.get('label')}")

        dex_nodes = [n for n in nodes if n.get("type") == "DEX"]
        for d in dex_nodes:
            lines.append(f"DEX encountered: {d.get('label')}")

        assoc_suspects = [n for n in nodes if n.get("type") == "SUSPECT" and not n.get("is_suspect")]
        if assoc_suspects:
            lines.append(f"Associated suspect wallets found: {len(assoc_suspects)}")

        if vasp:
            lines.append(
                f"Primary VASP attribution: {vasp.get('name')} "
                f"(confidence {vasp.get('confidence_pct')}, jurisdiction {vasp.get('jurisdiction')}, "
                f"{vasp.get('distance_hops')} hops from origin)"
            )
        secondary = intel.get("secondary_vasps", [])
        for sv in secondary:
            lines.append(
                f"Secondary VASP: {sv.get('name')} (confidence {sv.get('confidence_pct')}, "
                f"{sv.get('distance_hops')} hops)"
            )

        return "\n".join(lines)

    # ── Template (deterministic, no ML) narrative ───────────────────────

    def _generate_narrative_template(self, trace_result: dict) -> str:
        nodes = trace_result.get("nodes", [])
        edges = trace_result.get("edges", [])
        intel = trace_result.get("intelligence", {})
        meta  = trace_result.get("trace_metadata", {})

        mixers      = [n for n in nodes if n.get("type") == "MIXER"]
        bridges     = [n for n in nodes if n.get("type") == "BRIDGE"]
        exchanges   = [n for n in nodes if n.get("type") == "EXCHANGE"]
        suspects    = [n for n in nodes if n.get("is_suspect")]
        dex_nodes   = [n for n in nodes if n.get("type") == "DEX"]

        vasp        = intel.get("vasp")
        risk_score  = intel.get("risk_score", 0)
        risk_level  = intel.get("risk_level", "ELEVATED")
        chains      = intel.get("chains_involved", ["ETH"])
        start_addr  = meta.get("start_address", "UNKNOWN")
        max_depth   = meta.get("max_hop_depth", 0)

        short_addr  = f"{start_addr[:10]}...{start_addr[-6:]}"
        now_str     = datetime.utcnow().strftime("%d %b %Y at %H:%M UTC")

        paragraphs: List[str] = []

        # ── Opening ──────────────────────────────────────────────────
        chain_str = " and ".join(chains) if len(chains) > 1 else chains[0]
        paragraphs.append(
            f"TRACE-X automated analysis executed on {now_str}. "
            f"Subject wallet {short_addr} is the identified origin of a {len(edges)}-transaction "
            f"fund movement chain spanning {meta.get('total_nodes', 0)} wallet addresses "
            f"across the {chain_str} {'networks' if len(chains) > 1 else 'network'}."
        )

        # ── Fund flow summary ─────────────────────────────────────────
        outgoing = [e for e in edges if e["source"] == start_addr]
        if outgoing:
            first_ts = outgoing[0].get("timestamp", "T+0")
            total_out = sum(e.get("amount", 0) for e in outgoing)
            origin_chain = meta.get("chain") or (outgoing[0].get("chain") if outgoing else "ETH")
            paragraphs.append(
                f"Fund dispersal originated at {first_ts}. A total of {total_out:.2f} {origin_chain} was "
                f"split across {len(outgoing)} recipient addresses, "
                f"{'a pattern consistent with automated layering scripts' if len(outgoing) >= 3 else 'a direct transfer pattern'}. "
                f"The maximum trace depth reached {max_depth} hops from the origin wallet, "
                f"indicating {'advanced' if max_depth >= 4 else 'moderate'} obfuscation complexity."
            )

        # ── Mixer alert ───────────────────────────────────────────────
        if mixers:
            m = mixers[0]
            label = _sanction_label(m.get("sanction_status"))
            date_note = f" (designated {m['sanction_date']})" if m.get("sanction_date") else ""
            paragraphs.append(
                f"⚠ MIXER ALERT: Funds were directly routed through {m['label']} — {label}{date_note}. "
                f"This constitutes a deliberate attempt to sever the traceable transaction trail "
                f"and is a primary red-flag indicator under the Prevention of Money Laundering Act (PMLA) 2002 "
                f"and IT Act 2000. Mixer transactions complicate direct attribution; however, "
                f"TRACE-X continues post-mixer output analysis to identify downstream VASP receipt."
            )

        # ── DEX usage note ────────────────────────────────────────────
        if dex_nodes:
            d = dex_nodes[0]
            paragraphs.append(
                f"SWAP DETECTED: A portion of funds was routed through {d['label']}, "
                f"a decentralised exchange. DEX usage may indicate token swapping to obscure "
                f"fund denomination prior to bridging or VASP deposit."
            )

        # ── Cross-chain bridge ────────────────────────────────────────
        if bridges:
            b = bridges[0]
            chain_from = chains[0] if chains else "ETH"
            chain_to   = chains[-1] if len(chains) > 1 else "TRX"
            paragraphs.append(
                f"🌉 CROSS-CHAIN OBFUSCATION: The {b['label']} was used to move funds from the "
                f"{chain_from} network to the {chain_to} network. Cross-chain bridge usage is an "
                f"advanced laundering technique; however, TRACE-X's multi-chain correlation engine "
                f"successfully tracked the funds post-bridge using timestamp and amount fingerprinting, "
                f"maintaining chain-of-custody continuity."
            )

        # ── VASP attribution ──────────────────────────────────────────
        if vasp:
            paragraphs.append(
                f"🔵 VASP ATTRIBUTION: Terminal funds were traced to {vasp['name']} "
                f"(Confidence: {vasp['confidence_pct']}, Jurisdiction: {vasp.get('jurisdiction', 'Unknown')}) "
                f"on the {vasp['chain']} network, at a graph distance of {vasp['distance_hops']} hops "
                f"from the origin wallet. "
                f"RECOMMENDED ACTION: Immediate legal subpoena under Section 91 CrPC "
                f"and/or MLAT request to {vasp['name']} for KYC records and account freeze. "
                f"Time-critical: frozen assets may be liquidated or withdrawn within 24–72 hours."
            )

        # ── Secondary VASPs ───────────────────────────────────────────
        secondary = intel.get("secondary_vasps", [])
        if secondary:
            names = ", ".join(v["name"] for v in secondary)
            paragraphs.append(
                f"SECONDARY VASP(s) IDENTIFIED: {names}. "
                f"Parallel subpoenas to these entities may recover additional fund fractions."
            )

        # ── Conclusion ────────────────────────────────────────────────
        action = (
            "Immediate freeze request via I4C / SAHYOG portal is strongly recommended. "
            "Escalate to NCRP with this report as supporting intelligence."
            if risk_score > 75
            else "Priority investigation warranted. Escalate to NCRP within 24 hours."
        )
        paragraphs.append(
            f"CONCLUSION: Risk Score {risk_score}/100 — {risk_level}. {action} "
            f"All TRACE-X findings represent probabilistic attribution and constitute "
            f"investigative intelligence only. They do not constitute legal evidence and "
            f"require appropriate judicial authorisation before enforcement action."
        )

        return "\n\n".join(paragraphs)
