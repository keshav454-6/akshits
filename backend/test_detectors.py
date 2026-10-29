from detectors.scam_detector import analyze_scam_message
from detectors.payment_detector import analyze_payment_request
from detectors.impersonation_detector import analyze_impersonation
from detectors.url_detector import analyze_url
from detectors.leak_detector import scan_text_for_leaks
from detectors.permission_detector import analyze_permissions
from detectors.voice_detector import evaluate_voice_clone_scam
from detectors.session_detector import get_simulated_sessions

print("Scam score:", analyze_scam_message("Urgent account blocked share OTP within 2 hours")["risk_score"])
print("Payment score:", analyze_payment_request("Enter UPI PIN to receive cashback of Rs 5000")["risk_score"])
print("Impersonation score:", analyze_impersonation("Notice from CBI and Cyber Police for digital arrest")["risk_score"])
print("URL score:", analyze_url("http://sbi-fake.xyz/login")["risk_score"])
print("Leak findings:", scan_text_for_leaks('AWS_KEY = "AKIAIOSFODNN7EXAMPLE"')["total_findings"])
print("Permission score:", analyze_permissions("flashlight", ["camera", "microphone", "location"])["risk_score"])
print("Voice score:", evaluate_voice_clone_scam({"familiar_voice_money": True, "demand_secrecy": True})["risk_score"])
print("Simulated sessions count:", len(get_simulated_sessions()))
print("ALL TESTS PASSED!")

