import sqlite3
import os
import uuid
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'cybershield.db')

def get_simulated_sessions() -> list:
    """Returns all simulated session lab events from the SQLite database."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM session_events ORDER BY rowid DESC")
    rows = cursor.fetchall()
    conn.close()

    sessions = []
    for r in rows:
        sessions.append({
            "id": r["id"],
            "user_email": r["user_email"],
            "timestamp": r["timestamp"],
            "ip_address": r["ip_address"],
            "location": r["location"],
            "device": r["device"],
            "browser": r["browser"],
            "event_type": r["event_type"],
            "risk_score": r["risk_score"],
            "severity": r["severity"],
            "anomaly_reason": r["anomaly_reason"],
            "status": r["status"],
            "is_simulated": bool(r["is_simulated"])
        })
    return sessions

def perform_session_remediation(event_id: str, action: str) -> dict:
    """
    Executes simulated defensive actions (Revoke Session, Force Password Reset,
    Enforce Hardware MFA, or Lock Account).
    """
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    valid_actions = {
        "revoke": ("Terminated", "Active session invalidated. Auth token revoked and IP blacklisted in firewall rules."),
        "mfa": ("MFA Enforced", "Mandatory FIDO2/TOTP Multi-Factor Authentication challenge triggered for next login."),
        "reset_password": ("Password Reset", "Immediate credential invalidation dispatched with one-time secure reset link."),
        "lock_account": ("Account Locked", "Target identity suspended pending manual security team review.")
    }

    if action not in valid_actions:
        conn.close()
        return {"error": f"Invalid remediation action '{action}'"}

    new_status, log_msg = valid_actions[action]

    cursor.execute("UPDATE session_events SET status = ? WHERE id = ?", (new_status, event_id))
    conn.commit()
    conn.close()

    return {
        "event_id": event_id,
        "action_taken": action,
        "new_status": new_status,
        "message": log_msg,
        "remediated_at": datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    }

def inject_synthetic_anomaly(scenario_type: str) -> dict:
    """
    Generates a new synthetic security lab event for live demonstration.
    """
    scenarios = {
        "impossible_travel": {
            "user_email": "cto@cybershield.corp",
            "ip_address": "194.26.29.112",
            "location": "Seoul, South Korea",
            "device": "Android 14 (Samsung S24)",
            "browser": "Chrome Mobile 123.0",
            "event_type": "Impossible Travel Anomaly",
            "risk_score": 96,
            "severity": "Critical",
            "anomaly_reason": "Session initiated from South Korea 8 minutes after confirmed physical badge swipe in Bangalore office."
        },
        "credential_stuffing": {
            "user_email": "billing@cybershield.corp",
            "ip_address": "185.191.171.12",
            "location": "Warsaw, Poland",
            "device": "Debian Linux x86_64",
            "browser": "Python Requests / 2.31.0",
            "event_type": "Automated Credential Spraying",
            "risk_score": 89,
            "severity": "High",
            "anomaly_reason": "47 rapid automated POST /api/login requests from known botnet subnet using dictionary passwords."
        },
        "session_hijack": {
            "user_email": "sarah.lead@cybershield.corp",
            "ip_address": "91.240.118.84",
            "location": "Bucharest, Romania",
            "device": "MacBook Air (M2)",
            "browser": "Firefox 120.0",
            "event_type": "Cookie / Session Token Hijacking",
            "risk_score": 92,
            "severity": "Critical",
            "anomaly_reason": "Pre-authenticated session cookie presented from unfamiliar ISP with mutated TLS fingerprint."
        }
    }

    selected = scenarios.get(scenario_type, scenarios["impossible_travel"])
    new_id = f"SESS-{uuid.uuid4().hex[:4].upper()}"

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO session_events (id, user_email, timestamp, ip_address, location, device, browser, event_type, risk_score, severity, anomaly_reason, status, is_simulated)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
    """, (
        new_id,
        selected["user_email"],
        "Just now",
        selected["ip_address"],
        selected["location"],
        selected["device"],
        selected["browser"],
        selected["event_type"],
        selected["risk_score"],
        selected["severity"],
        selected["anomaly_reason"],
        "Active"
    ))
    conn.commit()
    conn.close()

    return {
        "id": new_id,
        **selected,
        "status": "Active",
        "is_simulated": True
    }

