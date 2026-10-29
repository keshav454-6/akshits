import re

def analyze_scam_message(text: str) -> dict:
    """
    Analyzes SMS, WhatsApp, emails, or customer-care text for phishing, fraud,
    urgency pressure, and credential harvesting indicators.
    """
    if not text or not text.strip():
        return {
            "error": "Empty message provided. Please paste the message content."
        }

    cleaned = text.strip()
    lower_text = cleaned.lower()
    
    score = 0
    warning_signs = []
    explanations = []
    actions = []

    # 1. OTP, PIN, Password, or Banking Credential Phishing
    otp_pattern = re.compile(r'\b(otp|one time password|pin|mpin|cvv|expiry date|netbanking password|passcode|card number)\b', re.IGNORECASE)
    otp_matches = otp_pattern.findall(cleaned)
    if otp_matches:
        score += 35
        unique_matches = list(set([m.upper() for m in otp_matches]))
        warning_signs.append(f"Direct request for sensitive authentication secrets: {', '.join(unique_matches)}")
        explanations.append("Legitimate institutions, banks, and customer care executives NEVER ask for OTPs, PINs, or passwords under any circumstances.")
        actions.append("Never disclose your OTP, PIN, or CVV. End the conversation immediately.")

    # 2. Account Blocking, Suspension, or Panicking Threat
    block_pattern = re.compile(r'\b(block|blocked|suspend|suspended|deactivate|freeze|frozen|terminated|hold|legal action|police complaint|arrest)\b', re.IGNORECASE)
    if block_pattern.search(cleaned):
        score += 25
        warning_signs.append("Threatening tone regarding account blocking, deactivation, or legal penalty")
        explanations.append("Scammers create artificial fear to prevent victims from thinking critically or consulting family/bank authorities.")
        actions.append("Do not panic. Banks provide formal written notice before account action. Check your balance through official netbanking.")

    # 3. Urgency & Time-bomb Pressure Tactics
    urgency_pattern = re.compile(r'\b(immediate|immediately|urgent|urgently|within \d+ hours?|within 24 hours?|within 10 minutes?|today only|last chance|action required)\b', re.IGNORECASE)
    if urgency_pattern.search(cleaned):
        score += 20
        warning_signs.append("Manufactured urgency requiring instant action within strict deadline")
        explanations.append("Urgency is the primary psychological trigger used to force rushed mistakes before verification.")
        actions.append("Step back and take time. Valid customer care issues never demand instantaneous money transfer.")

    # 4. Customer Care & Official Impersonation Keywords
    cust_care_pattern = re.compile(r'\b(customer care|support desk|helpdesk|service executive|officer|sbi support|hdfc care|airtel kyc|jio 5g|electricity board|customs officer|courier officer)\b', re.IGNORECASE)
    if cust_care_pattern.search(cleaned):
        score += 15
        warning_signs.append("Claims to represent customer care or service authority")
        explanations.append("Impersonation of trusted utility providers, telecom operators, or banks lends false credibility to the scam.")
        actions.append("Find the verified contact number from the official website or back of your debit card, not from the message.")

    # 5. Suspicious Links or Unverified APK/Remote App Downloads
    link_pattern = re.compile(r'(https?://[^\s]+|bit\.ly/[^\s]+|tinyurl\.com/[^\s]+|t\.me/[^\s]+|\.apk|\banydesk\b|\brustdesk\b|\bteamviewer\b|\bquicksupport\b)', re.IGNORECASE)
    link_matches = link_pattern.findall(cleaned)
    if link_matches:
        score += 30
        warning_signs.append(f"Contains unverified URL, APK download, or remote-desktop tool mention: {', '.join(link_matches[:2])}")
        explanations.append("Fraudsters frequently ask victims to install screen-sharing apps (AnyDesk/TeamViewer) or malicious APKs that siphon SMS OTPs.")
        actions.append("Never download APK files or install screen-sharing software at the request of an unknown caller or sender.")

    # 6. KYC Update / Electricity Bill / Lottery / Gift Baits
    bait_pattern = re.compile(r'\b(kyc update|kyc pending|pan card update|electricity bill update|lottery winner|lucky draw|cash prize|won \d+|reward points?)\b', re.IGNORECASE)
    if bait_pattern.search(cleaned):
        score += 20
        warning_signs.append("Common scam pretext: KYC update, unpaid utility bill threat, or unexpected financial reward")
        explanations.append("Pretexting with routine admin tasks like KYC or unpaid bills is among the top cyber fraud vectors.")
        actions.append("Visit the official branch or authorized vendor directly to resolve real KYC or billing inquiries.")

    # Normalize score to max 100
    risk_score = min(score, 100)

    # Determine risk level
    if risk_score >= 70:
        risk_level = "Critical Threat"
        badge_color = "red"
    elif risk_score >= 40:
        risk_level = "High Suspicion"
        badge_color = "orange"
    elif risk_score >= 20:
        risk_level = "Medium Caution"
        badge_color = "yellow"
    else:
        risk_level = "Low Risk / Normal"
        badge_color = "green"
        if not warning_signs:
            warning_signs.append("No obvious automated phishing or high-urgency keywords detected.")
            explanations.append("The message does not display standard linguistic red flags, but always maintain vigilance with unsolicited communications.")
            actions.append("Verify the sender address or phone number through standard channels.")

    return {
        "text_preview": cleaned[:120] + ("..." if len(cleaned) > 120 else ""),
        "risk_score": risk_score,
        "risk_level": risk_level,
        "badge_color": badge_color,
        "warning_signs": warning_signs,
        "explanations": explanations,
        "actions": actions,
        "detected_indicators_count": len(warning_signs) if risk_score > 0 else 0
    }

