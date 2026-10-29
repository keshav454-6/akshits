# CyberShield One 🛡️
> **“One Platform. Multiple Threats. One Smarter Defence.”**
> *Developed for MNIT Hackathon*

---

## 🌟 Executive Summary

**CyberShield One** is a next-generation, all-in-one cybersecurity protection suite engineered to protect digital citizens, remote workers, and enterprises from modern social engineering, financial cyber fraud, credential leakage, over-privileged applications, and generative AI threats.

Rather than relying on brittle cloud APIs or costly third-party subscriptions, CyberShield One operates with **explainable heuristic detection algorithms**, **zero-knowledge local privacy guarantees**, and an **integrated defensive incident hub** that unifies threat intelligence across all attack vectors.

---

## 🚀 Key Modules & Capabilities

| # | Module | Threat Vectors Intercepted | Core Defense Mechanism |
|---|--------|----------------------------|------------------------|
| **1** | **Main Dashboard** | Fragmented threat visibility | Live radar metrics, risk scores, quick launchpad, and consolidated alerts. |
| **2** | **Scam & Customer-Care Detector** | Fake customer care, threatening SMS/WhatsApp, OTP phishing | Urgent deadline heuristics, panicking tone analysis, unverified APK/AnyDesk detection. |
| **3** | **Suspicious Payment Request Shield** | Reverse UPI scams, QR code fraud, refund traps | Logic verification: flags demands to enter UPI PIN or scan QR to receive money. |
| **4** | **Impersonation Detector** | "Digital Arrest" CBI scams, fake bank KYC reps, FedEx customs, "Hi Mom" family emergencies | Pretext analysis, official verification helpline database (1930 / cybercrime.gov.in). |
| **5** | **Fake Website & Blocklist** | Typosquatting, lookalike domains (e.g. `sbi.bank.login-portal...xyz`), unencrypted HTTP | Heuristic hostname inspection, nested subdomain analysis, and local SQLite in-app blocklist. |
| **6** | **Leak Lock (Secrets Scanner)** | Hardcoded AWS keys, OpenAI/Anthropic tokens, GitHub PATs, MongoDB/Postgres URIs | Deterministic regex engine with zero-knowledge secret masking (`AKIA****************`). |
| **7** | **Permission Lens** | Spyware apps over-requesting permissions (e.g. Flashlight app requesting Camera & Contacts) | Utility category necessity matrix + real-time browser sensor probe (`navigator.permissions`). |
| **8** | **Voice-Clone Scam Guard** | AI voice deepfakes, synthesized family hostage calls, emergency extortion | 7-point psychological & behavioral decision matrix, Family Safe-Word protocol. |
| **9** | **Session Anomaly Lab** | Account hijacking, impossible travel velocities, automated botnet credential stuffing | Simulated security lab with synthetic live anomaly injection & 1-click defensive mitigation. |
| **10** | **Unified Incident Hub** | Disconnected security audit trails | Central incident repository, status workflow (`New` -> `Reviewed` -> `Resolved`), and sanitized JSON/print report export. |
| **11** | **Hackathon Try Demo Center** | Evaluation friction during hackathon judging | 8 preloaded 1-click live demo scenarios that test every engine instantly without typing. |

---

## 🛠️ Architecture & Technology Stack

- **Frontend:**
  - React 18 + Vite
  - Modern Custom Responsive CSS (Dark navy `#040814` with electric-blue `#3a86ff` & neon-cyan `#00f5d4` cyberpunk aesthetic)
  - Lucide React iconography
  - Dynamic SVG Risk Gauge Meter with real-time glow transitions
- **Backend:**
  - Python 3.11 with Flask REST API
  - Flask-CORS for secure cross-origin communication
  - SQLite persistent database (`cybershield.db`) for incident logs, blocklist, and session lab events
  - 100% offline, explainable rule-based detectors — **Zero external API costs or secret keys required**

---

## ⚡ Quick Start & Launch Guide (Windows)

### Prerequisites
Both Node.js and Python 3.11 are installed and configured in your workspace environment:
- Node.js LTS (v24+)
- Python 3.11+ with Flask & Flask-CORS

### Option A: 1-Click Launch (Recommended)
Double-click `run_cybershield.bat` in the project root:
```cmd
run_cybershield.bat
```
*Or in PowerShell:*
```powershell
.\run_cybershield.ps1
```
This automatically launches both the Flask backend on port `5000` and the Vite frontend on port `5173`, then opens `http://localhost:5173` in your default browser.

---

### Option B: Manual Command-Line Launch

**Step 1: Start Backend (Terminal 1)**
```powershell
cd c:\Users\akshi\OneDrive\Desktop\akshit\backend
python app.py
```
*Backend will be online at `http://127.0.0.1:5000`.*

**Step 2: Start Frontend (Terminal 2)**
```powershell
cd c:\Users\akshi\OneDrive\Desktop\akshit\frontend
npm run dev
```
*Frontend will be accessible at `http://localhost:5173`.*

---

## ⏱️ 3-Minute Hackathon Demo Script (For Judges)

1. **Minute 1: The Unified Threat Problem & Main Dashboard (0:00 - 1:00)**
   - Open `http://localhost:5173`.
   - Point out the unified dashboard telemetry: Total scans, threats intercepted, high-risk incidents, and active in-app blocklist.
   - Explain the core premise: Cybercrime has fragmented into UPI fraud, voice clones, phishing links, and fake customer care. CyberShield One unites defense across all these vectors under one roof.

2. **Minute 2: Interactive Threat Interception (1:00 - 2:00)**
   - Navigate to **"Try Demo Mode"** in the sidebar.
   - Click **"Run Live Scenario"** on **Scenario 1 (Fake Customer-Care Threat)**:
     - Observe the 80/100 risk score, explanation of account-freeze panic tactics, and actionable defense instructions.
   - Click **Scenario 2 (Payment / UPI QR Trap)**:
     - Show the UPI Golden Rule: *Entering a PIN only debits money, never receives cashback.*
   - Click **Scenario 4 (Lookalike Typosquatting URL)**:
     - Show how the nested domain `sbi.bank.login-portal.secure-verify.xyz` is exposed as high-risk, triggering the prominent Hazardous Website warning. Click **"Block in CyberShield"** to add it to the in-app blocklist.
   - Open **Leak Lock**:
     - Load the AWS/MongoDB snippet. Demonstrate zero-knowledge masking: the credentials are detected (`AKIA****************`), line numbers identified, and raw secrets are never leaked.

3. **Minute 3: Emerging AI Threats & Incident Hub (2:00 - 3:00)**
   - Open **Voice-Clone Scam Guard**:
     - Demonstrate the 7-question psychological questionnaire and highlight the Family Safe-Word Protocol.
   - Open **Session Anomaly Lab**:
     - Click **"+ Impossible Travel (Seoul)"** to inject a live synthetic attack. Terminate the session with 1 click.
   - Open **Unified Incident Hub**:
     - Show how every finding is logged with an Incident ID (e.g. `CS-1082`). Filter by status or category. Click **"Export Audit JSON"** to download the sanitized audit report.

---

## 🔒 Security & Privacy Guarantees

- **Zero-Knowledge In-Memory Scanning:** Raw API keys, passwords, and tokens passed into Leak Lock are evaluated entirely in-memory and masked before rendering. No raw credentials are stored in database records or dispatched over the internet.
- **Honest Platform Boundaries:**
  - *URL Blocklist:* Clearly described as an in-app security layer that flags and prevents malicious interactions within CyberShield, without falsely claiming to intercept external operating system network drivers.
  - *Permission Lens:* Clearly separates simulated/manually audited app categories from live hardware sensors queried via the browser's legitimate `navigator.permissions` API.
  - *Voice-Clone Guard:* Transparently marked as a behavioral and contextual risk assessor rather than pretending to perform forensic biometric spectral analysis without certified lab instruments.

---

## 👥 Hackathon Team & Acknowledgements

- **Project:** CyberShield One
- **Event:** MNIT Hackathon
- **Tagline:** “One Platform. Multiple Threats. One Smarter Defence.”

