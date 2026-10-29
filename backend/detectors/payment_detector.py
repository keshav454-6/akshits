import re

def analyze_payment_request(text: str) -> dict:
    """
    Evaluates payment claims, UPI messages, QR codes, refund pretexts,
    and requests to approve collect requests or enter authentication PINs.
    Follows a cautious, explainable evaluation standard without making
    unsubstantiated definitive claims.
    """
    if not text or not text.strip():
        return {"error": "Payment message text is required."}

    cleaned = text.strip()
    score = 0
    flags = []
    explanations = []
    verification_steps = []

    # 1. Reverse UPI Scam: Enter PIN to receive money / credit
    pin_to_receive = re.search(r'\b(enter\s+(?:upi\s+)?pin\s+(?:to|for)\s+(?:receive|claim|credit|accept|get))\b', cleaned, re.IGNORECASE)
    if pin_to_receive:
        score += 45
        flags.append("CRITICAL: Request asks you to enter your UPI PIN to RECEIVE or CLAIM money")
        explanations.append("Fundamental UPI Rule: Your UPI PIN is strictly used to DEBIT funds from your account. Entering a PIN will transfer money out of your account, NEVER into it.")
        verification_steps.append("DO NOT enter your PIN. Receiving funds via UPI requires ZERO authorization or PIN entry.")

    # 2. General PIN / MPIN mention in payment context
    pin_general = re.search(r'\b(upi pin|mpin|atm pin|enter 4 digit|enter 6 digit pin)\b', cleaned, re.IGNORECASE)
    if pin_general and not pin_to_receive:
        score += 25
        flags.append("Mentions entering confidential UPI/ATM PIN")
        explanations.append("Payment requests should never require sharing or typing PINs into unverified web forms or chat windows.")
        verification_steps.append("Only type your UPI PIN within your verified banking app's authentic keypad overlay.")

    # 3. QR Code claiming to credit balance
    qr_claim = re.search(r'\b(scan\s+(?:this\s+)?qr\s+(?:code\s+)?(?:to|and)\s+(?:receive|get|claim|credit|refund))\b', cleaned, re.IGNORECASE)
    if qr_claim:
        score += 35
        flags.append("QR Code Scanning to Receive Money Claim")
        explanations.append("Scanning a QR code in any UPI application initiates a PAY/TRANSFER operation. Scanning a QR cannot receive or deposit money into your account.")
        verification_steps.append("Never scan a QR code sent by a buyer (e.g. OLX/Facebook Marketplace buyers claiming advance payment).")

    # 4. Refund / Reversal / Mistaken Transfer Pressure
    refund_reversal = re.search(r'\b(refund|transferred by mistake|sent money by mistake|return excess|overpaid|cashback reward|claim reward)\b', cleaned, re.IGNORECASE)
    if refund_reversal:
        score += 25
        flags.append("Claims of accidental overpayment, lottery reward, or pending refund")
        explanations.append("A prevalent scam involves sending a fake SMS of credited money, followed by frantic calls claiming 'I sent you money by mistake, please send it back'.")
        verification_steps.append("Open your official banking app and check your actual updated account statement. Do not rely on SMS notifications.")

    # 5. Collect Request / Approve Payment Trap
    collect_trap = re.search(r'\b(approve\s+(?:the\s+)?(?:request|payment|debit)|accept\s+request|click\s+pay\s+to\s+receive)\b', cleaned, re.IGNORECASE)
    if collect_trap:
        score += 30
        flags.append("Collect Request Approval instruction")
        explanations.append("Scammers trigger UPI 'Collect Requests' for amounts like ₹5,000 or ₹20,000, instructing victims to press 'Approve' to receive their prize or salary.")
        verification_steps.append("Decline any unknown UPI Collect Request. Check the sender VPA (UPI ID) carefully.")

    # 6. Pressure / Urgency in payment
    urgency = re.search(r'\b(expire\s+in|valid\s+for\s+\d+|within\s+\d+\s+min|immediate|urgent|right\s+now)\b', cleaned, re.IGNORECASE)
    if urgency:
        score += 15
        flags.append("High time pressure on financial transaction")
        explanations.append("Creating rushed time limits prevents users from verifying transactions with family, friends, or banks.")
        verification_steps.append("Legitimate commercial transactions do not expire in 2-3 minutes with threats.")

    # 7. Unverified Third-party Payment Portals / Shortened Links
    link_present = re.search(r'(https?://[^\s]+|bit\.ly|[a-z0-9-]+\.(?:top|xyz|cc|tk|club))', cleaned, re.IGNORECASE)
    if link_present:
        score += 20
        flags.append(f"External payment link detected: {link_present.group(0)[:40]}")
        explanations.append("Links can lead to phishing portals that spoof PhonePe, Google Pay, or Paytm landing pages.")
        verification_steps.append("Always initiate transactions from within the verified mobile application, never through links sent in messages.")

    risk_score = min(score, 100)

    if risk_score >= 65:
        risk_level = "High Financial Hazard"
        assessment = "Multiple suspicious indicators strongly characteristic of known payment fraud vectors."
    elif risk_score >= 35:
        risk_level = "Moderate Caution Required"
        assessment = "Contains questionable payment instructions or unverified claims. Verification is advised."
    elif risk_score > 0:
        risk_level = "Low Risk / Standard Transaction"
        assessment = "Minor payment patterns detected. Review details before completing any authorization."
    else:
        risk_level = "No Specific Risk Detected"
        assessment = "No known fraudulent payment instructions, deceptive reverse-credit language, or PIN traps identified."
        flags.append("No typical UPI reverse debit or cashback trap patterns found.")
        verification_steps.append("Verify payment recipient VPA or bank details through your regular address book.")

    return {
        "text_preview": cleaned[:120] + ("..." if len(cleaned) > 120 else ""),
        "risk_score": risk_score,
        "risk_level": risk_level,
        "assessment": assessment,
        "detected_flags": flags,
        "risk_explanations": explanations,
        "independent_verification_steps": verification_steps
    }

