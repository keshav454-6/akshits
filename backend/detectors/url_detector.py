import re
from urllib.parse import urlparse
import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'cybershield.db')

POPULAR_BRANDS = [
    'google', 'paypal', 'microsoft', 'apple', 'amazon', 'facebook', 'instagram',
    'netflix', 'sbi', 'hdfc', 'icici', 'axisbank', 'paytm', 'phonepe',
    'bank', 'chase', 'wellsfargo', 'binance', 'coinbase', 'whatsapp', 'telegram'
]

SUSPICIOUS_TLDS = {
    'top', 'xyz', 'cc', 'work', 'buzz', 'click', 'link', 'country', 'stream',
    'gq', 'cf', 'ml', 'ga', 'tk', 'rest', 'fit', 'club', 'surf', 'vip'
}

def analyze_url(url_input: str) -> dict:
    """
    Analyzes URLs for protocol security, lookalike domains, excessive subdomains,
    IP hostnames, suspicious TLDs, and queries the local SQLite blocklist.
    """
    if not url_input or not url_input.strip():
        return {"error": "URL cannot be empty."}

    raw_url = url_input.strip()
    
    # Prepend http:// if user entered domain without protocol to parse safely
    target_url = raw_url
    if not re.match(r'^[a-zA-Z]+://', target_url):
        target_url = 'http://' + target_url

    parsed = urlparse(target_url)
    hostname = (parsed.hostname or '').lower()
    path = parsed.path or ''
    scheme = parsed.scheme.lower()

    score = 0
    warning_indicators = []
    safety_recommendations = []
    lookalike_findings = []

    # 0. Check Local Blocklist first
    is_blocked_locally = False
    blocklist_reason = None
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("SELECT reason, risk_score FROM blocklist WHERE url = ? OR domain = ?", (raw_url, hostname))
        row = cursor.fetchone()
        if row:
            is_blocked_locally = True
            blocklist_reason = row[0]
            score = max(score, row[1])
            warning_indicators.append(f"PREVIOUSLY BLOCKED: This domain is marked unsafe in your CyberShield In-App Blocklist ({blocklist_reason})")
        conn.close()
    except Exception as e:
        pass

    # 1. HTTPS Protocol Check
    if scheme != 'https':
        score += 25
        warning_indicators.append("Unencrypted connection: Uses HTTP instead of secure HTTPS")
        safety_recommendations.append("Never submit passwords, card details, or sensitive personal data on non-HTTPS sites.")
    else:
        safety_recommendations.append("HTTPS is present (traffic is encrypted, though attackers can also provision free certificates).")

    # 2. IP Address as Hostname (e.g. http://192.168.1.50/login or http://45.33.32.156)
    ip_pattern = re.compile(r'^(\d{1,3}\.){3}\d{1,3}$')
    if ip_pattern.match(hostname):
        score += 40
        warning_indicators.append(f"Raw IP address used as hostname ({hostname}) instead of registered domain name")
        safety_recommendations.append("Legitimate consumer web services utilize registered brand domains, not bare IP addresses.")

    # 3. Suspicious or Cheap TLDs
    tld = hostname.split('.')[-1] if '.' in hostname else ''
    if tld in SUSPICIOUS_TLDS:
        score += 25
        warning_indicators.append(f"High-risk Top-Level Domain (.{tld}) with high historical phishing correlation")
        safety_recommendations.append(f"Scammers register disposable domains on .{tld} due to low cost and lack of KYC validation.")

    # 4. Excessive Subdomains or Nested Hostname Deception
    # Example: login.paypal.com.customer-verification-portal.xyz
    parts = hostname.split('.')
    if len(parts) >= 4:
        score += 25
        warning_indicators.append(f"Excessive subdomains detected ({len(parts)} levels: {hostname}). Often used to mimic trusted brands.")
        safety_recommendations.append("Examine the actual Root Domain (the last two segments before the path) to identify who actually owns the site.")

    # 5. Lookalike Brand Spoofing / Typosquatting
    # Check if a popular brand appears in a subdomain or in a hypenated fraud domain
    for brand in POPULAR_BRANDS:
        if brand in hostname:
            # Check if it is the authentic domain (e.g. paypal.com or login.paypal.com)
            is_authentic = False
            if hostname == f"{brand}.com" or hostname.endswith(f".{brand}.com") or hostname == f"{brand}.in" or hostname.endswith(f".{brand}.in") or hostname == f"{brand}.org":
                is_authentic = True

            if not is_authentic:
                score += 35
                lookalike_findings.append(f"Brand spoofing indicator: '{brand}' appears inside untrusted host '{hostname}'")
                warning_indicators.append(f"Potential typosquatting/impersonation of '{brand.upper()}' brand")
                safety_recommendations.append(f"This site is NOT official {brand.upper()}. It is an unauthorized third-party mimicking the brand name.")

    # 6. Suspicious characters (@ symbol, punycode, double dashes)
    if '@' in raw_url:
        score += 30
        warning_indicators.append("Deceptive '@' symbol in URL: Browsers ignore anything before '@' and route to the following host")
    if 'xn--' in hostname:
        score += 35
        warning_indicators.append("Punycode / Homoglyph attack: Internationalized domain name using lookalike Cyrillic/Greek characters")
    if '--' in hostname:
        score += 15
        warning_indicators.append("Double hyphen '--' detected in domain name, common in spoofing domains")

    # 7. Phishing keywords in path or query
    phish_keywords = ['login', 'signin', 'verify', 'account', 'banking', 'secure', 'update', 'password', 'wallet', 'kyc']
    keyword_matches = [k for k in phish_keywords if k in path.lower() or k in hostname]
    if keyword_matches and score > 20:
        score += 15
        warning_indicators.append(f"Phishing-associated keywords detected in URL path: {', '.join(keyword_matches[:3])}")

    risk_score = min(score, 100)

    if is_blocked_locally:
        risk_level = "Blocked (Local Shield)"
    elif risk_score >= 70:
        risk_level = "High Risk / Hazardous"
    elif risk_score >= 40:
        risk_level = "Suspicious URL"
    elif risk_score >= 20:
        risk_level = "Moderate Caution"
    else:
        risk_level = "Low Risk / Standard"
        if not warning_indicators:
            warning_indicators.append("No active heuristic threat patterns found.")
            safety_recommendations.append("Domain follows standard naming conventions and standard TLS practices.")

    return {
        "input_url": raw_url,
        "normalized_url": target_url,
        "hostname": hostname,
        "scheme": scheme.upper(),
        "is_https": scheme == 'https',
        "risk_score": risk_score,
        "risk_level": risk_level,
        "is_blocked_locally": is_blocked_locally,
        "warning_indicators": warning_indicators,
        "lookalike_findings": lookalike_findings,
        "safety_recommendations": safety_recommendations
    }

