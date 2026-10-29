def evaluate_voice_clone_scam(answers: dict) -> dict:
    """
    Evaluates potential AI voice-cloning scam indicators using a transparent,
    explainable behavioral and situational decision matrix.
    
    Expected keys in answers:
      - familiar_voice_money: bool (Did someone sounding like a loved one/friend urgently ask for funds?)
      - emotional_emergency: bool (Was an emergency cited like hospital, bail, arrest, accident?)
      - demand_secrecy: bool (Did they plead not to inform parents, spouse, or police?)
      - urgency_deadline: bool (Were you pressured to transfer money within minutes?)
      - refuses_video_verify: bool (Did they refuse a video call or hang up when questioned?)
      - unusual_channel_or_number: bool (Did the call arrive from an unfamiliar or hidden number?)
      - strange_speech_artifacts: bool (Did the voice have robotic pauses, repetitive cadence, or unusual audio background?)
    """
    weights = {
        "familiar_voice_money": 25,
        "emotional_emergency": 20,
        "demand_secrecy": 20,
        "urgency_deadline": 15,
        "refuses_video_verify": 20,
        "unusual_channel_or_number": 15,
        "strange_speech_artifacts": 15
    }

    labels = {
        "familiar_voice_money": "Urgent Financial Request from Purportedly Known Voice",
        "emotional_emergency": "Extreme Emotional Crisis Pretext (Hospital/Arrest/Accident)",
        "demand_secrecy": "Insistence on Strict Secrecy / Concealment from Others",
        "urgency_deadline": "High-Pressure Clock Countdown Demanding Immediate Action",
        "refuses_video_verify": "Refusal / Evasion of Secondary Visual Verification",
        "unusual_channel_or_number": "Incoming Call from Unknown Number Claiming to be Known Contact",
        "strange_speech_artifacts": "Synthetic Artifacts / Unnatural Cadence Detected in Audio"
    }

    detected_indicators = []
    total_score = 0

    for key, weight in weights.items():
        if answers.get(key) is True:
            total_score += weight
            detected_indicators.append(labels[key])

    risk_score = min(total_score, 100)

    if risk_score >= 70:
        risk_level = "High Probability AI Voice-Clone Scam"
        verdict = "Multiple textbook indicators of an AI voice-cloning social engineering attack detected."
    elif risk_score >= 40:
        risk_level = "Suspicious Distress Pretext"
        verdict = "Significant psychological pressure tactics detected. High caution required before any funds transfer."
    elif risk_score > 0:
        risk_level = "Low to Moderate Caution"
        verdict = "Some urgency detected. Verification is recommended before taking financial action."
    else:
        risk_level = "Minimal Scam Risk"
        verdict = "No primary psychological or operational voice clone scam vectors indicated in the assessment."

    recommendations = [
        "DO NOT send money or crypto immediately, regardless of how convincing the caller sounds.",
        "Hang up immediately and call the family member or friend back on their authentic, pre-saved phone number.",
        "Ask a predetermined Family Code Word or a private question that an AI model scraping social media would not know (e.g. 'What was the name of our first childhood pet?').",
        "Demand an instant FaceTime, WhatsApp, or Google Meet video call with clear lighting to confirm their live physical presence.",
        "Contact another mutual relative or friend to cross-verify the claimed emergency before transferring any funds.",
        "Report attempted cyber extortion to the National Cyber Crime Reporting Portal (1930 / cybercrime.gov.in)."
    ]

    return {
        "risk_score": risk_score,
        "risk_level": risk_level,
        "verdict": verdict,
        "active_indicators": detected_indicators,
        "actionable_countermeasures": recommendations,
        "transparency_notice": "Important Transparency Notice: This module evaluates behavioral, linguistic, and operational scam patterns characteristic of AI voice-cloning fraud. It does not perform raw biometric audio waveform spectral analysis and does not claim to conclusively verify audio files without lab forensic certification."
    }

