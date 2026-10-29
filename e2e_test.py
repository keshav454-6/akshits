import urllib.request
import urllib.parse
import json
import sys

BASE_API = "http://127.0.0.1:5000/api"
FRONTEND_URL = "http://localhost:5173"

def make_req(endpoint, data=None, method="GET"):
    url = f"{BASE_API}/{endpoint}" if not endpoint.startswith("http") else endpoint
    req = urllib.request.Request(url, method=method)
    req.add_header('Content-Type', 'application/json')
    if data is not None:
        body = json.dumps(data).encode('utf-8')
        req.data = body
    with urllib.request.urlopen(req, timeout=5) as resp:
        content = resp.read().decode('utf-8')
        return resp.status, json.loads(content) if resp.headers.get_content_type() == 'application/json' else content

def run_tests():
    print("==================================================")
    print("    RUNNING CYBERSHIELD ONE END-TO-END TESTS      ")
    print("==================================================")

    # 1. Health
    status, res = make_req("health")
    assert status == 200 and res["status"] == "online", f"Health failed: {res}"
    print("[PASS] 1. Backend Health Check OK:", res["service"])

    # 2. Stats
    status, res = make_req("stats")
    assert status == 200 and "total_scans" in res, f"Stats failed: {res}"
    print(f"[PASS] 2. Dashboard Telemetry OK: {res['total_scans']} scans, {res['threats_detected']} threats")

    # 3. Scam Detector
    status, res = make_req("scan/message", {
        "text": "URGENT: Your bank account will be blocked within 2 hours. Click http://bit.ly/sbi-verify and share OTP.",
        "auto_log": True
    }, method="POST")
    assert status == 200 and res["risk_score"] >= 70, f"Scam detection failed: {res}"
    print(f"[PASS] 3. Scam Detector OK: Score {res['risk_score']}/100, Level: {res['risk_level']}")

    # 4. Payment Detector
    status, res = make_req("scan/payment", {
        "text": "Scan this QR code and enter UPI PIN to receive cashback reward of Rs 3,500.",
        "auto_log": True
    }, method="POST")
    assert status == 200 and res["risk_score"] >= 65, f"Payment detection failed: {res}"
    print(f"[PASS] 4. Payment Detector OK: Score {res['risk_score']}/100, Level: {res['risk_level']}")

    # 5. Impersonation Detector
    status, res = make_req("scan/impersonation", {
        "text": "Official Notice from CBI: An illegal parcel with passports booked in your name. Join Skype for Digital Arrest.",
        "auto_log": True
    }, method="POST")
    assert status == 200 and res["risk_score"] >= 60, f"Impersonation failed: {res}"
    print(f"[PASS] 5. Impersonation Detector OK: Entities: {res['impersonated_entities']}, Score {res['risk_score']}")

    # 6. URL Analyzer & Blocklist
    status, res = make_req("scan/url", {
        "url": "http://sbi.bank.login-portal.secure-verify.xyz/signin",
        "auto_log": True
    }, method="POST")
    assert status == 200 and res["risk_score"] >= 60, f"URL analyzer failed: {res}"
    print(f"[PASS] 6. URL Analyzer OK: Score {res['risk_score']}/100, Flags: {len(res['warning_indicators'])}")

    # 7. Blocklist API
    status, res = make_req("blocklist", {
        "url": "http://sbi.bank.login-portal.secure-verify.xyz/signin",
        "reason": "Test Block",
        "risk_score": 90
    }, method="POST")
    # Might be 200 or 409 if already present
    assert status in [200, 409], f"Blocklist add failed: {res}"
    status, bl = make_req("blocklist")
    assert status == 200 and len(bl) >= 1, f"Blocklist list failed: {bl}"
    print(f"[PASS] 7. In-App Blocklist OK: {len(bl)} active blocked domains")

    # 8. Leak Lock Scanner
    code_snippet = 'AWS_KEY = "AKIAIOSFODNN7EXAMPLE"\nOPENAI = "sk-proj-491029481029481029481029481029481029481029"'
    status, res = make_req("scan/leak", {"content": code_snippet, "auto_log": True}, method="POST")
    assert status == 200 and res["total_findings"] >= 1, f"Leak lock failed: {res}"
    masked = res["findings"][0]["masked_value"]
    assert "AKIA" in masked and "*" in masked, f"Secret was not properly masked: {masked}"
    print(f"[PASS] 8. Leak Lock OK: Found {res['total_findings']} credentials, zero-knowledge mask: {masked}")

    # 9. Permission Lens
    status, res = make_req("scan/permission", {
        "category": "flashlight",
        "permissions": ["camera", "microphone", "location", "contacts"],
        "source": "manual",
        "auto_log": True
    }, method="POST")
    assert status == 200 and res["excessive_count"] >= 3, f"Permission lens failed: {res}"
    print(f"[PASS] 9. Permission Lens OK: {res['excessive_count']} excessive permissions flagged for Flashlight")

    # 10. Voice-Clone Scam
    status, res = make_req("scan/voice", {
        "answers": {
            "familiar_voice_money": True,
            "emotional_emergency": True,
            "demand_secrecy": True,
            "urgency_deadline": True,
            "refuses_video_verify": True,
            "unusual_channel_or_number": True,
            "strange_speech_artifacts": True
        },
        "auto_log": True
    }, method="POST")
    assert status == 200 and res["risk_score"] >= 80, f"Voice clone failed: {res}"
    print(f"[PASS] 10. Voice-Clone Scam Guard OK: Score {res['risk_score']}/100, Verdict: {res['verdict']}")

    # 11. Session Anomaly Lab
    status, sessions = make_req("sessions")
    assert status == 200 and len(sessions) > 0, f"Sessions list failed: {sessions}"
    first_id = sessions[0]["id"]
    status, rem_res = make_req("sessions/action", {"event_id": first_id, "action": "revoke"}, method="POST")
    assert status == 200 and rem_res["new_status"] == "Terminated", f"Remediation failed: {rem_res}"
    print(f"[PASS] 11. Session Lab OK: Terminated session {first_id} ({rem_res['new_status']})")

    # 12. Unified Incident Hub
    status, incidents = make_req("incidents")
    assert status == 200 and len(incidents) > 0, f"Incidents failed: {incidents}"
    inc_id = incidents[0]["id"]
    status, up_res = make_req(f"incidents/{inc_id}/status", {"status": "Reviewed"}, method="PATCH")
    assert status == 200 and up_res["status"] == "Reviewed", f"Status update failed: {up_res}"
    print(f"[PASS] 12. Unified Incident Hub OK: {len(incidents)} logged incidents, updated {inc_id} to Reviewed")

    # 13. Frontend Vite Server check
    req = urllib.request.Request(FRONTEND_URL)
    with urllib.request.urlopen(req, timeout=5) as resp:
        html = resp.read().decode('utf-8')
        assert resp.status == 200 and "CyberShield One" in html, f"Frontend did not return CyberShield HTML: {resp.status}"
    print(f"[PASS] 13. Vite Frontend Server OK: Responding at {FRONTEND_URL} with title 'CyberShield One'")

    print("==================================================")
    print("   ALL 13 END-TO-END VERIFICATION TESTS PASSED!   ")
    print("==================================================")

if __name__ == "__main__":
    try:
        run_tests()
    except Exception as e:
        print("[FAIL] Test failure:", e)
        sys.exit(1)

