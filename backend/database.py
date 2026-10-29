import sqlite3
import json
import os
from datetime import datetime

if os.environ.get('VERCEL') or os.environ.get('AWS_LAMBDA_FUNCTION_NAME'):
    DB_PATH = '/tmp/cybershield.db'
else:
    DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'cybershield.db')


def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    cursor = conn.cursor()

    # Table for unified incidents
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS incidents (
            id TEXT PRIMARY KEY,
            module TEXT NOT NULL,
            title TEXT NOT NULL,
            risk_score INTEGER NOT NULL,
            severity TEXT NOT NULL,
            summary TEXT NOT NULL,
            details_json TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'New',
            created_at TEXT NOT NULL
        )
    ''')

    # Table for local URL blocklist
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS blocklist (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            url TEXT NOT NULL UNIQUE,
            domain TEXT NOT NULL,
            reason TEXT NOT NULL,
            risk_score INTEGER NOT NULL,
            created_at TEXT NOT NULL
        )
    ''')

    # Table for simulated security lab session anomalies
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS session_events (
            id TEXT PRIMARY KEY,
            user_email TEXT NOT NULL,
            timestamp TEXT NOT NULL,
            ip_address TEXT NOT NULL,
            location TEXT NOT NULL,
            device TEXT NOT NULL,
            browser TEXT NOT NULL,
            event_type TEXT NOT NULL,
            risk_score INTEGER NOT NULL,
            severity TEXT NOT NULL,
            anomaly_reason TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'Active',
            is_simulated INTEGER DEFAULT 1
        )
    ''')

    conn.commit()

    # Seed initial sample incidents & synthetic session events if table is empty
    cursor.execute('SELECT COUNT(*) FROM incidents')
    if cursor.fetchone()[0] == 0:
        seed_sample_incidents(cursor)

    cursor.execute('SELECT COUNT(*) FROM session_events')
    if cursor.fetchone()[0] == 0:
        seed_sample_sessions(cursor)

    cursor.execute('SELECT COUNT(*) FROM blocklist')
    if cursor.fetchone()[0] == 0:
        seed_sample_blocklist(cursor)

    conn.commit()
    conn.close()

def seed_sample_incidents(cursor):
    sample_incidents = [
        (
            'CS-1082',
            'scam_detector',
            'Threatening KYC Account Suspension SMS',
            92,
            'Critical',
            'Detected aggressive panic-inducing message demanding immediate biometric verification via suspicious link or face permanent bank freeze.',
            json.dumps({
                'indicators': ['Urgent deadline (< 2 hours)', 'Account freeze threat', 'Unverified bit.ly redirect link', 'Request for card details'],
                'recommendation': 'Do not click the link or provide banking details. Verify directly via bank helpline.'
            }),
            'New',
            datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        ),
        (
            'CS-1083',
            'payment_detector',
            'UPI QR Code Cashback Trap',
            88,
            'High',
            'Fraudulent QR payment claim instructing user to enter UPI PIN to receive cashback reward.',
            json.dumps({
                'indicators': ['Entering UPI PIN sends money, never receives it', 'Cashback claim on unverified portal', 'Pressure to scan immediately'],
                'recommendation': 'Reject the transaction immediately. UPI PIN is solely for debiting funds.'
            }),
            'Reviewed',
            datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        ),
        (
            'CS-1084',
            'leak_lock',
            'Exposed AWS Secret Key & MongoDB URI',
            95,
            'Critical',
            'Sensitive cloud provider credentials and database connection string detected in uploaded config script.',
            json.dumps({
                'indicators': ['AWS Access Key ID found (AKIA****************)', 'MongoDB connection string with credentials (mongodb://user:****@cluster0)'],
                'recommendation': 'Immediately rotate AWS access keys and database credentials. Store secrets in environment variables.'
            }),
            'New',
            datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        ),
        (
            'CS-1085',
            'impersonation',
            'Digital Arrest Cyber Police Impersonation',
            94,
            'Critical',
            'Message impersonating Cyber Crime Cell demanding instant video statement and security deposit under threat of warrant.',
            json.dumps({
                'indicators': ['Law enforcement impersonation', 'Demand for financial transfer to avoid arrest', 'Fake legal seal and urgent deadline'],
                'recommendation': 'Law enforcement agencies never issue digital arrests or demand money via UPI/crypto. Report to cybercrime.gov.in.'
            }),
            'Resolved',
            datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        )
    ]
    cursor.executemany('''
        INSERT INTO incidents (id, module, title, risk_score, severity, summary, details_json, status, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', sample_incidents)

def seed_sample_sessions(cursor):
    sample_sessions = [
        (
            'SESS-901',
            'admin@cybershield.corp',
            '10 minutes ago',
            '185.220.101.5',
            'Frankfurt, Germany',
            'Unknown Linux Machine',
            'HeadlessChrome / 120.0',
            'Impossible Travel Login',
            94,
            'Critical',
            'Logged in from Germany 15 minutes after active session in New Delhi, India. Physical travel between locations is impossible in this timeframe.',
            'Active',
            1
        ),
        (
            'SESS-902',
            'developer@cybershield.corp',
            '25 minutes ago',
            '45.154.255.89',
            'St. Petersburg, Russia',
            'Windows 10 Desktop',
            'Firefox 118.0',
            'Brute Force Threshold Exceeded',
            86,
            'High',
            '12 failed authentication attempts detected within 90 seconds followed by a successful credential spray match.',
            'Active',
            1
        ),
        (
            'SESS-903',
            'finance@cybershield.corp',
            '1 hour ago',
            '103.211.54.12',
            'Mumbai, India',
            'Android 14 (Pixel 8)',
            'Mobile Chrome 124.0',
            'New Device & Tor Exit Node',
            78,
            'High',
            'Authentication originated from known Tor relay node using previously unverified mobile hardware identifier.',
            'Under Investigation',
            1
        ),
        (
            'SESS-904',
            'security@cybershield.corp',
            '3 hours ago',
            '122.161.49.201',
            'Bengaluru, India',
            'macOS Sonoma (MacBook Pro)',
            'Safari 17.4',
            'Standard Trusted Login',
            10,
            'Low',
            'Session verified with hardware FIDO2 security key and corporate VPN IP range.',
            'Verified',
            1
        )
    ]
    cursor.executemany('''
        INSERT INTO session_events (id, user_email, timestamp, ip_address, location, device, browser, event_type, risk_score, severity, anomaly_reason, status, is_simulated)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', sample_sessions)

def seed_sample_blocklist(cursor):
    samples = [
        ('http://sbi-netbanking-kyc-verify.vip/login', 'sbi-netbanking-kyc-verify.vip', 'Phishing portal impersonating State Bank of India net banking', 98, datetime.now().strftime('%Y-%m-%d %H:%M:%S')),
        ('http://hdfc-reward-points-claim.top/redeem', 'hdfc-reward-points-claim.top', 'Malicious credential harvesting link sent via SMS spam', 95, datetime.now().strftime('%Y-%m-%d %H:%M:%S')),
        ('http://paytm-cashback-qr92.cc/pay', 'paytm-cashback-qr92.cc', 'UPI reverse debit fraud gateway targeting mobile users', 92, datetime.now().strftime('%Y-%m-%d %H:%M:%S'))
    ]
    cursor.executemany('''
        INSERT INTO blocklist (url, domain, reason, risk_score, created_at)
        VALUES (?, ?, ?, ?, ?)
    ''', samples)

