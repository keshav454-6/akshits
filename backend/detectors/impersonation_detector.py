import re

def analyze_impersonation(text: str) -> dict:
    """
    Detects targeted impersonation of financial institutions, law enforcement,
    delivery companies, tech giants, and close personal contacts.
    Provides verifiable official counter-measures.
    """
    if not text or not text.strip():
        return {"error": "Message text is required for impersonation analysis."}

    cleaned = text.strip()
    score = 0
    impersonated_entities = []
    indicators = []
    explanations = []
    verification_guide = []

    # 1. Government / Law Enforcement / Digital Arrest Impersonation
    gov_regex = re.compile(
        r'\b(cbi|police|cyber cell|enforcement directorate|ed|customs|narcotics control bureau|ncb|court order|arrest warrant|supreme court|digital arrest|inspector|sub-inspector)\b',
        re.IGNORECASE
    )
    gov_match = gov_regex.findall(cleaned)
    if gov_match:
        score += 45
        entities = list(set([m.upper() for m in gov_match]))
        impersonated_entities.append(f"Law Enforcement / Judicial Authority ({', '.join(entities)})")
        indicators.append("Claims to represent police, CBI, customs, or court authorities")
        explanations.append("The 'Digital Arrest' scam is a widespread organized racket. Fraudsters pose as police/CBI on Skype/WhatsApp and falsely claim an illegal parcel or money laundering case in your name.")
        verification_guide.append("Indian law enforcement NEVER conducts trials over Skype/WhatsApp or demands security deposits to dismiss cases. Disconnect and report immediately to cybercrime.gov.in (Helpline: 1930).")

    # 2. Banking / Central Bank (RBI) Impersonation
    bank_regex = re.compile(
        r'\b(rbi|reserve bank|sbi|state bank|hdfc|icici|axis bank|punjab national bank|pnb|bank manager|kyc officer|compliance department)\b',
        re.IGNORECASE
    )
    bank_match = bank_regex.findall(cleaned)
    if bank_match:
        score += 35
        entities = list(set([m.upper() for m in bank_match]))
        impersonated_entities.append(f"Banking Institution / Regulatory Body ({', '.join(entities)})")
        indicators.append("Claims to originate from bank management, KYC department, or RBI")
        explanations.append("Banks will never contact customers via unverified mobile numbers or messaging apps to update personal banking records or credentials.")
        verification_guide.append("Call the customer care number printed on the back of your physical ATM/Debit card, or visit your local branch in person.")

    # 3. Delivery / Courier Services (FedEx / India Post / DHL / BlueDart)
    courier_regex = re.compile(
        r'\b(fedex|dhl|india post|bluedart|delhivery|parcel|courier|consignment|customs|contraband|narcotics|passports?|package)\b',
        re.IGNORECASE
    )
    courier_match = courier_regex.findall(cleaned)
    if courier_match:
        score += 30
        entities = list(set([m.upper() for m in courier_match]))
        impersonated_entities.append(f"Courier / Intercepted Consignment ({', '.join(entities[:3])})")
        indicators.append("Claims a high-value or intercepted parcel has been held or contains illegal goods")
        explanations.append("Courier scams trick people into believing a package containing passports or narcotics was booked using their Aadhaar/ID, escalating to a fake police transfer.")
        verification_guide.append("Track tracking numbers solely on the official courier portal (e.g. fedex.com or indiapost.gov.in). Never call phone numbers provided in unsolicited SMS.")

    # 4. Friends, Family, or Colleague Emergency ("Grandparent / Mom Scam")
    relative_regex = re.compile(
        r'\b(hi mom|hi dad|hello mom|hello dad|lost my phone|new number|friend\'s phone|in hospital|met with an accident|emergency cash|send money urgently)\b',
        re.IGNORECASE
    )
    if relative_regex.search(cleaned):
        score += 40
        impersonated_entities.append("Family Member or Close Friend in Distress")
        indicators.append("Claims to be a close relative who changed numbers due to an urgent emergency")
        explanations.append("This is an emotional blackmail vector where scammers pretend to be a son, daughter, or grandchild who lost their phone and urgently needs medical or bail money.")
        verification_guide.append("Directly call the family member's known existing phone number, or reach another mutual family member to confirm before sending any money.")

    # 5. Tech Support / Corporate IT / Helpdesk Impersonation
    tech_regex = re.compile(
        r'\b(microsoft support|windows security|apple support|google accounts team|it administrator|helpdesk department|hr payroll|payroll update)\b',
        re.IGNORECASE
    )
    tech_match = tech_regex.findall(cleaned)
    if tech_match:
        score += 30
        impersonated_entities.append(f"Tech Platform / Corporate Support ({', '.join(set([m.title() for m in tech_match]))})")
        indicators.append("Claims your computer has a virus or that corporate payroll/credentials need updating")
        explanations.append("Tech companies do not proactively send unsolicited messages or popups with phone numbers instructing users to call for virus removal.")
        verification_guide.append("Contact your internal IT helpdesk directly via corporate intranet or navigate to the official vendor account portal directly.")

    # Additional Urgency / Coercion / Digital Arrest factor
    coercion = re.search(r'\b(warrant|lawsuit|legal penalty|jail|confidential|do not tell anyone|keep secret|skype|digital arrest|bail|summons)\b', cleaned, re.IGNORECASE)
    if coercion:
        score += 20
        indicators.append("Extreme coercion tactics, Digital Arrest summons, or insistence on strict secrecy")

    risk_score = min(score, 100)

    if risk_score >= 65:
        risk_level = "High-Confidence Impersonation"
    elif risk_score >= 35:
        risk_level = "Suspicious Profile / Potential Impersonation"
    elif risk_score > 0:
        risk_level = "Mild Impersonation Indicators"
    else:
        risk_level = "No Impersonation Detected"
        indicators.append("No typical institutional or familial pretexting phrases detected.")
        verification_guide.append("Ensure sender's caller ID or email domain matches verified corporate contact directories.")

    return {
        "text_preview": cleaned[:120] + ("..." if len(cleaned) > 120 else ""),
        "risk_score": risk_score,
        "risk_level": risk_level,
        "impersonated_entities": impersonated_entities if impersonated_entities else ["None Detected"],
        "warning_indicators": indicators,
        "threat_explanations": explanations,
        "official_verification_steps": verification_guide
    }
