import re

# Comprehensive signature set for credential leakage scanning
LEAK_SIGNATURES = [
    {
        "type": "AWS Access Key ID",
        "pattern": r'\b(AKIA[0-9A-Z]{16})\b',
        "severity": "Critical",
        "remediation": "Revoke key via AWS IAM console immediately. Rotate credentials and check CloudTrail logs for unauthorized usage."
    },
    {
        "type": "AWS Secret Access Key",
        "pattern": r'(?i)(?:aws_secret_access_key|aws_secret|secret_key)\s*[:=]\s*["\']?([A-Za-z0-9/+=]{40})["\']?',
        "severity": "Critical",
        "remediation": "Deactivate AWS IAM credentials immediately. Use IAM Roles or AWS Secrets Manager instead of hardcoding."
    },
    {
        "type": "GitHub Personal Access Token",
        "pattern": r'\b(ghp_[a-zA-Z0-9]{36}|github_pat_[a-zA-Z0-9_]{82})\b',
        "severity": "Critical",
        "remediation": "Revoke this token from GitHub Settings -> Developer Settings -> Personal Access Tokens. Regenerate with minimal required scopes."
    },
    {
        "type": "Google Cloud / Firebase API Key",
        "pattern": r'\b(AIza[0-9A-Za-z_-]{35})\b',
        "severity": "High",
        "remediation": "Restrict this key in Google Cloud Console by HTTP referrer, IP address, or specific API services. Rotate if full administrative privileges exist."
    },
    {
        "type": "OpenAI / LLM API Key",
        "pattern": r'\b(sk-[a-zA-Z0-9]{32,}|sk-proj-[a-zA-Z0-9_-]{40,})\b',
        "severity": "Critical",
        "remediation": "Delete and revoke key on OpenAI Dashboard -> API Keys. Never commit API keys to version control. Store in .env or OS environment variables."
    },
    {
        "type": "Anthropic API Key",
        "pattern": r'\b(sk-ant-[a-zA-Z0-9_-]{40,})\b',
        "severity": "Critical",
        "remediation": "Revoke key immediately on Anthropic Console. Set up billing alerts to catch unauthorized model querying."
    },
    {
        "type": "Slack Bot / User Token",
        "pattern": r'\b(xox[baprs]-[0-9a-zA-Z]{10,48})\b',
        "severity": "High",
        "remediation": "Revoke the Slack App / Bot token in api.slack.com/apps. Check audit logs for unauthorized message or workspace access."
    },
    {
        "type": "Stripe API Secret / Publishable Key",
        "pattern": r'\b((?:sk|pk)_(?:live|test)_[0-9a-zA-Z]{24,99})\b',
        "severity": "Critical",
        "remediation": "Roll Stripe key from Stripe Dashboard -> Developers -> API Keys. An exposed live key allows attackers to issue refunds or access customer financial data."
    },
    {
        "type": "RSA / OpenSSH Private Key",
        "pattern": r'-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----',
        "severity": "Critical",
        "remediation": "The associated public key must be removed from all authorized_keys files immediately. Generate a new Ed25519 or RSA-4096 keypair."
    },
    {
        "type": "Database Connection URI with Credentials",
        "pattern": r'((?:mongodb(?:\+srv)?|postgres(?:ql)?|mysql|redis)://[^:\s]+:[^@\s]+@[a-zA-Z0-9.-]+:[0-9]+/[^\s"\']*)',
        "severity": "Critical",
        "remediation": "Rotate database user password immediately. Whitelist trusted IP CIDRs and use managed secret stores."
    },
    {
        "type": "JSON Web Token (JWT)",
        "pattern": r'\b(eyJ[a-zA-Z0-9_-]{10,}\.eyJ[a-zA-Z0-9_-]{10,}\.[a-zA-Z0-9_-]{10,})\b',
        "severity": "High",
        "remediation": "Invalidate token on auth server if stateful, or rotate the signing secret key. Check expiration claims (exp)."
    },
    {
        "type": "Hardcoded Password Assignment",
        "pattern": r'(?i)(?:password|passwd|pwd|db_pass|secret)\s*[:=]\s*["\']([^"\']{6,40})["\']',
        "severity": "Medium",
        "remediation": "Extract hardcoded secret into environment variables (.env with gitignore) or secure key vault."
    },
    {
        "type": "Exposed Email Address",
        "pattern": r'\b([a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+)\b',
        "severity": "Low",
        "remediation": "Check if personal identifiable information (PII) is intentionally made public or should be redacted before sharing code."
    },
    {
        "type": "Exposed Phone Number",
        "pattern": r'(?:\+91[-.\s]?)?[6789]\d{9}',
        "severity": "Low",
        "remediation": "Remove sensitive contact information to prevent unsolicited harassment or social engineering vectors."
    }
]

def mask_secret(value: str) -> str:
    """Masks secret so only a few prefix/suffix characters are visible."""
    if not value:
        return ""
    val_len = len(value)
    if val_len <= 6:
        return "******"
    elif val_len <= 12:
        return value[:2] + ("*" * (val_len - 3)) + value[-1]
    else:
        return value[:4] + ("*" * (val_len - 8)) + value[-4:]

def scan_text_for_leaks(content: str) -> dict:
    """
    Performs deterministic pattern matching on code or text files.
    Masks all secrets. Never stores raw payload.
    """
    if not content or not content.strip():
        return {"error": "Content cannot be empty. Please paste code or config snippet."}

    lines = content.split('\n')
    findings = []
    seen_matches = set()

    for line_idx, line in enumerate(lines, start=1):
        for sig in LEAK_SIGNATURES:
            regex = re.compile(sig["pattern"])
            for match in regex.finditer(line):
                # Retrieve the captured secret or entire match
                matched_str = match.group(1) if match.groups() else match.group(0)
                
                # Filter trivial false positives (e.g. example or dummy placeholders)
                if any(dummy in matched_str.lower() for dummy in ['example.com', 'your_password', 'changeme', 'secret_here', 'xxx']):
                    continue

                masked = mask_secret(matched_str)
                key = (sig["type"], line_idx, masked)
                if key not in seen_matches:
                    seen_matches.add(key)
                    findings.append({
                        "type": sig["type"],
                        "severity": sig["severity"],
                        "line_number": line_idx,
                        "masked_value": masked,
                        "remediation": sig["remediation"]
                    })

    # Calculate overall risk score
    severity_weights = {"Critical": 40, "High": 25, "Medium": 15, "Low": 5}
    total_score = sum(severity_weights.get(f["severity"], 10) for f in findings)
    risk_score = min(total_score, 100)

    if risk_score >= 70:
        risk_level = "Severe Credential Compromise"
    elif risk_score >= 35:
        risk_level = "Elevated Leak Risk"
    elif risk_score > 0:
        risk_level = "Mild Information Exposure"
    else:
        risk_level = "Clean / No Exposed Secrets Detected"

    return {
        "total_findings": len(findings),
        "risk_score": risk_score,
        "risk_level": risk_level,
        "findings": findings,
        "privacy_notice": "Zero-Knowledge Scan: CyberShield scans text entirely in-memory on your local machine. Raw secret values are masked and never logged or dispatched to any external cloud provider."
    }

