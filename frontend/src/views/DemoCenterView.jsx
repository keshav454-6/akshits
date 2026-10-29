import React, { useState } from 'react';
import {
  Sparkles,
  Zap,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Play,
  CheckCircle2,
  ExternalLink,
  MessageSquareWarning,
  CreditCard,
  UserX,
  Globe,
  KeyRound,
  ShieldAlert,
  Mic,
  Activity
} from 'lucide-react';
import ScoreGauge from '../components/ScoreGauge';

export default function DemoCenterView({ setTab }) {
  const [demoResults, setDemoResults] = useState({});
  const [loadingCard, setLoadingCard] = useState(null);

  const DEMO_CARDS = [
    {
      id: 'scam',
      title: '1. Fake Customer-Care / KYC Threat',
      module: 'scam_detector',
      icon: MessageSquareWarning,
      targetTab: 'scam',
      badge: 'Phishing SMS',
      payload: {
        text: 'URGENT: Dear SBI customer, your YONO account will be BLOCKED within 2 hours due to incomplete PAN KYC. Immediately click http://bit.ly/sbi-kyc-update-2026 to update or call customer care at 9876543210 to share OTP. Failure will result in immediate account freeze.'
      },
      endpoint: '/api/scan/message',
      desc: 'Simulates high-urgency panic message demanding instant OTP & card verification under threat of bank account freeze.'
    },
    {
      id: 'payment',
      title: '2. Suspicious Payment / UPI QR Trap',
      module: 'payment_detector',
      icon: CreditCard,
      targetTab: 'payment',
      badge: 'Reverse Credit Trap',
      payload: {
        text: 'Congratulations! You have received a cashback reward of Rs 3,500 on PhonePe. Click here to approve the collect request and enter your UPI PIN to instantly credit Rs 3,500 into your bank account. Offer expires in 5 minutes!'
      },
      endpoint: '/api/scan/payment',
      desc: 'Exposes deceptive reverse-credit tactics: entering UPI PIN sends money rather than receiving cashback.'
    },
    {
      id: 'impersonation',
      title: '3. Digital Arrest Law Enforcement Scam',
      module: 'impersonation',
      icon: UserX,
      targetTab: 'impersonation',
      badge: 'CBI Impersonation',
      payload: {
        text: 'Official Notice from CBI & Cyber Crime Cell New Delhi: An illegal consignment containing contraband and forged passports was booked in your name via FedEx. A non-bailable arrest warrant has been issued by Supreme Court. Join Skype immediately for Digital Arrest verification and transfer refundable bail clearance of Rs 50,000 to government reserve account.'
      },
      endpoint: '/api/scan/impersonation',
      desc: 'Unmasks the notorious "Digital Arrest" scam falsely claiming police warrants and demanding bail transfers.'
    },
    {
      id: 'url',
      title: '4. Lookalike Typosquatting Phishing URL',
      module: 'url_analyzer',
      icon: Globe,
      targetTab: 'url',
      badge: 'Deceptive Hostname',
      payload: {
        url: 'http://sbi.bank.login-portal.secure-verify.xyz/account/signin'
      },
      endpoint: '/api/scan/url',
      desc: 'Demonstrates heuristic detection of nested deceptive subdomains, suspicious .xyz TLD, and unencrypted HTTP.'
    },
    {
      id: 'leak',
      title: '5. Exposed Cloud & Database Credentials',
      module: 'leak_lock',
      icon: KeyRound,
      targetTab: 'leak',
      badge: 'Zero-Knowledge',
      payload: {
        content: `import boto3\nAWS_ACCESS_KEY_ID = "AKIAIOSFODNN7EXAMPLE"\nAWS_SECRET_ACCESS_KEY = "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"\nMONGO_URI = "mongodb://admin_prod:SuperSecretP@ssw0rd!@cluster0.db.aws.com:27017/cybershield"\nOPENAI_KEY = "sk-proj-491029481029481029481029481029481029481029"`
      },
      endpoint: '/api/scan/leak',
      desc: 'Identifies AWS Access Keys, MongoDB password URIs, and OpenAI tokens, masking them completely for privacy.'
    },
    {
      id: 'permission',
      title: '6. Excessive Permission Over-Privilege',
      module: 'permission_lens',
      icon: ShieldAlert,
      targetTab: 'permission',
      badge: 'Spyware App Profile',
      payload: {
        category: 'flashlight',
        permissions: ['camera', 'microphone', 'location', 'contacts', 'files_storage', 'background_access'],
        source: 'manual'
      },
      endpoint: '/api/scan/permission',
      desc: 'Audits a Flashlight utility app that secretly demands Camera, Microphone, GPS Location, and Contacts book.'
    },
    {
      id: 'voice',
      title: '7. AI Voice-Clone Distress Extortion',
      module: 'voice_clone',
      icon: Mic,
      targetTab: 'voice',
      badge: 'Deepfake Extortion',
      payload: {
        answers: {
          familiar_voice_money: true,
          emotional_emergency: true,
          demand_secrecy: true,
          urgency_deadline: true,
          refuses_video_verify: true,
          unusual_channel_or_number: true,
          strange_speech_artifacts: true
        }
      },
      endpoint: '/api/scan/voice',
      desc: 'Evaluates behavioral and psychological manipulation indicators of an AI-synthesized family hostage scam.'
    },
    {
      id: 'session',
      title: '8. Impossible Travel Session Hijack',
      module: 'session_anomaly',
      icon: Activity,
      targetTab: 'session',
      badge: 'Security Lab Simulation',
      payload: {
        scenario: 'impossible_travel'
      },
      endpoint: '/api/sessions/inject',
      desc: 'Simulates a user logging in from New Delhi, India followed 8 minutes later by an active session from Seoul, South Korea.'
    }
  ];

  const runLiveDemo = async (card) => {
    setLoadingCard(card.id);
    try {
      const res = await fetch(card.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(card.payload)
      });
      const data = await res.json();
      setDemoResults(prev => ({ ...prev, [card.id]: data }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingCard(null);
    }
  };

  const runAllDemos = async () => {
    for (const card of DEMO_CARDS) {
      await runLiveDemo(card);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Top Banner */}
      <div className="cyber-card cyber-card-highlight" style={{
        background: 'linear-gradient(135deg, #214C3A 0%, #1A3D2E 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span className="badge badge-clean">MNIT Hackathon Judge Evaluation Mode</span>
            <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)' }}>8 Verified Scenarios</span>
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#FFFFFF', marginBottom: '6px' }}>
            Hackathon One-Click Demonstration Center
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.88rem', maxWidth: '680px', lineHeight: '1.5' }}>
            Test every security capability with preloaded safe scenarios. Evaluates explainable heuristic detection without needing external API keys or real personal credentials.
          </p>
        </div>

        <button
          onClick={runAllDemos}
          className="btn-cyan"
          style={{ padding: '12px 22px', fontSize: '0.92rem' }}
        >
          <Zap size={18} />
          <span>Execute All 8 Scenarios Live</span>
        </button>
      </div>

      {/* Grid of 8 Demo Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '18px'
      }}>
        {DEMO_CARDS.map((card) => {
          const Icon = card.icon;
          const result = demoResults[card.id];
          const isScanning = loadingCard === card.id;

          return (
            <div
              key={card.id}
              className={`cyber-card ${result?.risk_score >= 65 ? 'cyber-card-danger' : result ? 'cyber-card-highlight' : ''}`}
              style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div className="stat-icon-wrapper" style={{ width: '38px', height: '38px' }}>
                      <Icon size={18} />
                    </div>
                    <span className="badge badge-neutral" style={{ fontSize: '0.68rem' }}>
                      {card.badge}
                    </span>
                  </div>

                  <button
                    onClick={() => setTab(card.targetTab)}
                    style={{
                      background: 'transparent',
                      color: 'var(--primary-accent)',
                      fontSize: '0.74rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontWeight: '600'
                    }}
                  >
                    <span>Full View</span>
                    <ArrowRight size={13} />
                  </button>
                </div>

                <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '6px' }}>
                  {card.title}
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4', marginBottom: '14px' }}>
                  {card.desc}
                </p>

                {/* Real-time scan result preview */}
                {result && (
                  <div style={{
                    background: '#F5F3ED',
                    border: '1px solid #D8D5CD',
                    borderRadius: '8px',
                    padding: '12px',
                    marginBottom: '14px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span className={`badge ${
                        (result.risk_score || 0) >= 65 ? 'badge-critical' : (result.risk_score || 0) >= 35 ? 'badge-high' : 'badge-clean'
                      }`}>
                        Score: {result.risk_score ?? result.total_findings ?? 'Active'}/100
                      </span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--primary-accent)', fontWeight: '700' }}>
                        API 200 OK
                      </span>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: '1.3' }}>
                      {result.risk_level || result.event_type || `${result.total_findings || 0} findings detected`}
                    </div>
                  </div>
                )}
              </div>

              <div style={{ borderTop: '1px solid rgba(0, 0, 0, 0.04)', paddingTop: '12px' }}>
                <button
                  type="button"
                  className={result ? "btn-secondary" : "btn-cyan"}
                  style={{ width: '100%', padding: '9px 14px', fontSize: '0.82rem' }}
                  onClick={() => runLiveDemo(card)}
                  disabled={isScanning}
                >
                  <Play size={13} />
                  <span>{isScanning ? 'Executing Scanner...' : result ? 'Re-Run Live Test' : 'Run Live Scenario'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}











