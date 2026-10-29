import React, { useState, useEffect } from 'react';
import {
  UserX,
  AlertTriangle,
  CheckCircle2,
  Send,
  Sparkles,
  RotateCcw,
  ShieldCheck,
  Building2,
  PhoneCall,
  Zap,
  Activity
} from 'lucide-react';
import ScoreGauge from '../components/ScoreGauge';

const IMPERSONATION_SAMPLES = [
  {
    name: "CBI & Cyber Crime 'Digital Arrest' Scam",
    text: "URGENT OFFICIAL SUMMONS: Central Bureau of Investigation (CBI) & Cyber Crime Division. A courier booked in your name with FedEx was seized containing 140 grams of narcotics and fake passports. The Supreme Court has issued an immediate Non-Bailable Arrest Warrant. Connect to Skype video immediately for Digital Arrest questioning and transfer refundable security clearance of Rs 1,00,000 to the RBI clearance account."
  },
  {
    name: "FedEx Customs Officer Impersonation",
    text: "Dear Customer, your international FedEx parcel #FX-9821 has been placed on hold by Mumbai Customs due to unpaid duty taxes and suspicious contraband. To clear your parcel before police handover, call customs verification officer Rajesh Sharma at 9123456789."
  },
  {
    name: "Distressed Family Member ('Hi Mom' Scam)",
    text: "Hi mom, I had a terrible accident and dropped my phone in the street so this is my friend's temporary number. I'm in urgent need of Rs 15,000 for emergency hospital admission right now. Please transfer immediately to his UPI: friendhelp@okaxis. Don't tell dad yet, I will explain later!"
  },
  {
    name: "Bank Manager KYC Verification Call",
    text: "Hello Sir, I am calling from SBI Corporate Head Office, Mumbai. Your debit card reward points are expiring today. I am sending an OTP to verify your identity; kindly read out the 6 numbers so I can convert points to cash."
  }
];

export default function ImpersonationView() {
  const [inputText, setInputText] = useState(IMPERSONATION_SAMPLES[0].text);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [liveScanning, setLiveScanning] = useState(false);

  // Debounced real-time analysis as user types/pastes!
  useEffect(() => {
    if (!inputText.trim()) {
      setResult(null);
      setError('');
      return;
    }

    setLiveScanning(true);
    const timer = setTimeout(() => {
      handleAnalyze(inputText, false);
    }, 350);

    return () => clearTimeout(timer);
  }, [inputText]);

  const handleAnalyze = async (textToScan = inputText, shouldLog = true) => {
    if (!textToScan.trim()) {
      setError("Please paste a message or communication transcript to evaluate.");
      setLiveScanning(false);
      return;
    }
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/scan/impersonation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textToScan, auto_log: shouldLog })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to analyze message");
      } else {
        setResult(data);
      }
    } catch (err) {
      setError("Network error connecting to analysis engine: " + err.message);
    } finally {
      setLoading(false);
      setLiveScanning(false);
    }
  };

  const loadPreset = (presetText) => {
    setInputText(presetText);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Overview Card */}
      <div className="cyber-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="stat-icon-wrapper purple">
              <UserX size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                Multi-Entity Impersonation Scam Detector
              </h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Detect deceptive identity spoofing across law enforcement (Digital Arrest), courier operators, bank managers, and loved ones in distress.
              </p>
            </div>
          </div>

          <span className="badge badge-clean" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Zap size={13} />
            <span>As-You-Type Pretexting Radar Active</span>
          </span>
        </div>

        {/* Demo Chips */}
        <div style={{ marginTop: '16px' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '8px' }}>
            Load Safe Impersonation Demo Scenario:
          </div>
          <div className="preset-bar">
            {IMPERSONATION_SAMPLES.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                className="preset-chip"
                onClick={() => loadPreset(sample.text)}
              >
                <Sparkles size={12} style={{ display: 'inline', marginRight: '4px' }} />
                {sample.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Input Textarea */}
      <div className="cyber-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-primary)' }}>
            Suspicious Communication Transcript / Message:
          </label>
          {liveScanning && (
            <span style={{ fontSize: '0.75rem', color: 'var(--primary-accent)', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Activity size={12} className="animate-spin" />
              <span>Analyzing authority markers live...</span>
            </span>
          )}
        </div>

        <textarea
          rows={5}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Paste message claiming to be from Police, CBI, FedEx, your bank, or family member asking for urgent assistance..."
          style={{
            width: '100%',
            padding: '14px',
            fontSize: '0.9rem',
            lineHeight: '1.5',
            resize: 'vertical',
            marginBottom: '14px'
          }}
        />

        {error && (
          <div style={{
            color: 'var(--color-danger)',
            background: 'rgba(183, 74, 74, 0.08)',
            border: '1px solid rgba(183, 74, 74, 0.2)',
            padding: '10px 14px',
            borderRadius: '8px',
            fontSize: '0.82rem',
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertTriangle size={16} />
            <span>{error}</span>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => { setInputText(''); setResult(null); setError(''); }}
          >
            <RotateCcw size={15} />
            <span>Reset Input</span>
          </button>

          <button
            type="button"
            className="btn-cyan"
            onClick={() => handleAnalyze(inputText, true)}
            disabled={loading}
          >
            <Send size={15} />
            <span>{loading ? 'Evaluating Pretext...' : 'Save & Log Scan'}</span>
          </button>
        </div>
      </div>

      {/* Results View (Real-Time Live Updates) */}
      {result && (
        <div className={`cyber-card ${result.risk_score >= 65 ? 'cyber-card-danger' : result.risk_score >= 35 ? 'cyber-card-highlight' : ''}`}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '20px',
            borderBottom: '1px solid #D8D5CD',
            paddingBottom: '18px',
            marginBottom: '18px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <ScoreGauge score={result.risk_score} label="Spoof Score" />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span className={`badge ${
                    result.risk_score >= 65 ? 'badge-critical' : result.risk_score >= 35 ? 'badge-high' : 'badge-clean'
                  }`}>
                    {result.risk_level}
                  </span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    Identified Authority Profile
                  </span>
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                  Targeted Entity: {result.impersonated_entities.join(', ')}
                </h3>
              </div>
            </div>

            <div style={{
              background: 'rgba(183, 74, 74, 0.06)',
              border: '1px solid rgba(183, 74, 74, 0.2)',
              borderRadius: '10px',
              padding: '10px 14px',
              maxWidth: '320px'
            }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--color-danger)', fontWeight: '700', textTransform: 'uppercase', marginBottom: '3px' }}>
                Official Reality Check
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: '1.3' }}>
                No legitimate police department or court conducts "Digital Arrests" via video calls or accepts money transfers to cancel warrants.
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '18px' }}>
            {/* Warning Indicators */}
            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <AlertTriangle size={16} color={result.risk_score >= 35 ? 'var(--color-warning)' : 'var(--primary-accent)'} />
                <span>Impersonation Red Flags</span>
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {result.warning_indicators.map((ind, i) => (
                  <div key={i} className={`finding-item ${result.risk_score >= 65 ? 'danger' : 'warning'}`}>
                    <div style={{ fontSize: '0.84rem', color: 'var(--text-primary)', fontWeight: '600' }}>
                      {ind}
                    </div>
                  </div>
                ))}
              </div>

              {result.threat_explanations.length > 0 && (
                <div style={{
                  marginTop: '12px',
                  padding: '12px',
                  borderRadius: '8px',
                  background: '#F5F3ED',
                  border: '1px solid #D8D5CD',
                  fontSize: '0.78rem',
                  color: 'var(--text-muted)',
                  lineHeight: '1.4'
                }}>
                  <strong style={{ color: 'var(--primary-accent)' }}>Threat Context: </strong>
                  {result.threat_explanations[0]}
                </div>
              )}
            </div>

            {/* Verification Protocols */}
            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <ShieldCheck size={16} color="var(--primary-accent)" />
                <span>Official Verification Protocol</span>
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {result.official_verification_steps.map((step, i) => (
                  <div key={i} style={{
                    padding: '10px 14px',
                    borderRadius: '8px',
                    background: 'rgba(33, 76, 58, 0.04)',
                    border: '1px solid rgba(33, 76, 58, 0.15)',
                    fontSize: '0.82rem',
                    color: 'var(--text-primary)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '8px'
                  }}>
                    <CheckCircle2 size={16} color="var(--primary-accent)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>{step}</span>
                  </div>
                ))}
              </div>

              <div style={{
                marginTop: '14px',
                padding: '10px 12px',
                background: 'rgba(0, 0, 0, 0.06)',
                border: '1px solid rgba(0, 0, 0, 0.06)',
                borderRadius: '8px',
                fontSize: '0.78rem',
                color: 'var(--primary-accent)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <PhoneCall size={16} style={{ flexShrink: 0 }} />
                <span>
                  National Cyber Crime Helpline (India): <strong>1930</strong> | Portal: <strong>cybercrime.gov.in</strong>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}










