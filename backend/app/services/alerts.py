import json
import uuid
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional

class AlertService:
    """
    Automated Intelligence Alert Generation and Incident Management.
    Triggers when risk >= 75, mixer interaction detected, or OFAC match flagged.
    """

    @classmethod
    def evaluate_and_generate(cls, trace_result: Dict[str, Any], investigation_id: str) -> Optional[Dict[str, Any]]:
        intel = trace_result.get("intelligence", {})
        meta = trace_result.get("trace_metadata", {})
        risk_score = intel.get("risk_score", 0)
        has_mixer = intel.get("has_mixer", False)
        wallet = meta.get("start_address", "UNKNOWN")
        chain = meta.get("chain", "ETH")

        if risk_score < 75 and not has_mixer:
            return None

        # Determine severity & title
        if has_mixer:
            severity = "CRITICAL"
            title = "🔴 OFAC Mixer / Anonymization Service Intercepted"
            msg = (
                f"Suspect wallet {wallet[:10]}... routed funds directly into a zero-knowledge mixer. "
                f"Severity: CRITICAL (Risk Score: {risk_score}/100). Immediate preservation and freezing notice required."
            )
        elif risk_score >= 85:
            severity = "CRITICAL"
            title = f"🚨 Critical Fraud Pattern Detected ({risk_score}/100)"
            msg = (
                f"Multi-hop laundering chain identified across {intel.get('max_hop_depth', 0)} hops. "
                f"Target VASP: {intel.get('vasp', {}).get('name', 'Centralized Exchange')}. High-probability syndication."
            )
        else:
            severity = "HIGH"
            title = f"⚠️ Elevated Laundering Risk ({risk_score}/100)"
            msg = f"Rapid dispersion and cross-chain bridging flagged for wallet {wallet[:10]}... on {chain} network."

        alert_id = f"ALT-{uuid.uuid4().hex[:6].upper()}"
        now_iso = datetime.now(timezone.utc).isoformat()

        from app.db.database import get_connection
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO alerts
            (id, investigation_id, severity, title, message, wallet_address, chain, risk_score, status, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        """, (
            alert_id, investigation_id, severity, title, msg, wallet, chain, risk_score, "UNREAD", now_iso
        ))
        conn.commit()
        conn.close()

        return {
            "id": alert_id,
            "severity": severity,
            "title": title,
            "message": msg,
            "risk_score": risk_score,
            "status": "UNREAD",
            "created_at": now_iso
        }

    @classmethod
    def list_alerts(cls, limit: int = 50) -> Dict[str, Any]:
        from app.db.database import get_connection
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("SELECT * FROM alerts ORDER BY created_at DESC LIMIT ?", (limit,))
        rows = cur.fetchall()
        conn.close()

        alerts = []
        unread_count = 0
        critical_count = 0

        for r in rows:
            status = r["status"]
            sev = r["severity"]
            if status == "UNREAD":
                unread_count += 1
            if sev == "CRITICAL":
                critical_count += 1

            alerts.append({
                "id": r["id"],
                "investigation_id": r["investigation_id"],
                "severity": sev,
                "title": r["title"],
                "message": r["message"],
                "wallet_address": r["wallet_address"],
                "chain": r["chain"],
                "risk_score": r["risk_score"],
                "status": status,
                "created_at": r["created_at"],
            })

        return {
            "alerts": alerts,
            "total": len(alerts),
            "unread_count": unread_count,
            "critical_count": critical_count
        }

    @classmethod
    def update_status(cls, alert_id: str, new_status: str) -> bool:
        from app.db.database import get_connection
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("UPDATE alerts SET status = ? WHERE id = ?", (new_status, alert_id))
        affected = cur.rowcount
        conn.commit()
        conn.close()
        return affected > 0
