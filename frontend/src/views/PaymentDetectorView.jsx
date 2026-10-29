import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  AlertTriangle,
  CheckCircle2,
  Send,
  Sparkles,
  RotateCcw,
  ShieldCheck,
  QrCode,
  Lock,
  ArrowRight,
  Zap,
  Activity
} from 'lucide-react';
import ScoreGauge from '../components/ScoreGauge';

const PAYMENT_SAMPLES = [
  {
    name: "UPI Reverse PIN Cashback Trap",
    text: "Dear User, congratulations! You have won Rs 4,899 cashback reward from PhonePe. To receive the money in your bank account, click this link to open PhonePe and enter your 6-digit UPI PIN to credit the balance."
  },
  {
    name: "OLX / Marketplace Buyer QR Scam",
    text: "I am ready to buy your sofa for Rs 12,000. I have sent an official payment QR code on WhatsApp. Please scan this QR code using your Google Pay app to accept and receive the advance payment into your account immediately."
  },
  {
    name: "Accidental Money Transfer Claim",
    text: "Sir, by mistake I sent Rs 25,000 to your Google Pay number instead of my brother's account in hospital. Please return it immediately via UPI to urgent-medical@paytm. Check your SMS for confirmation."
  },
  {
    name: "Standard Commercial Invoice",
    text: "Invoice #9824 from Cloud Services for $19.00 has been issued. Payment was automatically processed via Visa ending in 4102. No action required."
  }
];

export default function PaymentDetectorView() {
  const [inputText, setInputText] = useState(PAYMENT_SAMPLES[0].text);
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
      setError("Please paste a payment message or UPI claim to analyze.");
      setLiveScanning(false);
      return;
    }
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/scan/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textToScan, auto_log: shouldLog })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to analyze payment request");
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
            <div className="stat-icon-wrapper cyan">
              <CreditCard size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                Suspicious Payment & UPI Request Shield
              </h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Inspect claims regarding UPI collect requests, QR payment scanning to receive funds, refund reversions, and PIN entry traps.
              </p>
            </div>
          </div>

          <span className="badge badge-clean" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Zap size={13} />
            <span>Real-Time UPI Engine Active</span>
          </span>
        </div>

        {/* Demo scenarios */}
        <div style={{ marginTop: '16px' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '8px' }}>
            Load Safe Payment Demo Scenario:
          </div>
          <div className="preset-bar">
            {PAYMENT_SAMPLES.map((sample, idx) => (
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

      {/* Input Form */}
      <div className="cyber-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-primary)' }}>
            Payment Text / Instruction / SMS Content:
          </label>
          {liveScanning && (
            <span style={{ fontSize: '0.75rem', color: 'var(--primary-accent)', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Activity size={12} className="animate-spin" />
              <span>Evaluating live payment heuristics...</span>
            </span>
          )}
        </div>

        <textarea
          rows={5}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Paste payment text, WhatsApp message from buyer/seller, or SMS claiming cashback / refund (e.g. 'Scan this QR code to receive Rs 5,000 cashback...')"
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
            <span>{loading ? 'Evaluating Payment Logic...' : 'Save & Log Scan'}</span>
          </button>
        </div>
      </div>

      {/* Results Box (Real-Time Live Updates) */}
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
              <ScoreGauge score={result.risk_score} label="Fraud Score" />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span className={`badge ${
                    result.risk_score >= 65 ? 'badge-critical' : result.risk_score >= 35 ? 'badge-high' : 'badge-clean'
                  }`}>
                    {result.risk_level}
                  </span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    Live Rule-Based Logic Evaluated
                  </span>
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                  {result.assessment}
                </h3>
              </div>
            </div>

            <div style={{
              background: '#F5F3ED',
              border: '1px solid rgba(33, 76, 58, 0.15)',
              borderRadius: '10px',
              padding: '10px 14px',
              maxWidth: '300px'
            }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--primary-accent)', fontWeight: '700', textTransform: 'uppercase', marginBottom: '3px' }}>
                Golden Rule of UPI
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: '1.3' }}>
                Entering your UPI PIN or scanning a QR code is ONLY needed to SEND money, never to RECEIVE money.
              </div>
            </div>
          </div>

          {/* Flags and Verification Details */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '18px' }}>
            {/* Suspicious Flags */}
            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <AlertTriangle size={16} color={result.risk_score >= 35 ? 'var(--color-warning)' : 'var(--primary-accent)'} />
                <span>Detected Payment Anomalies</span>
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {result.detected_flags.map((flag, i) => (
                  <div key={i} className={`finding-item ${result.risk_score >= 65 ? 'danger' : result.risk_score >= 35 ? 'warning' : 'clean'}`}>
                    <div style={{ fontSize: '0.84rem', color: 'var(--text-primary)', fontWeight: '600' }}>
                      {flag}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Independent Verification Steps */}
            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <ShieldCheck size={16} color="var(--primary-accent)" />
                <span>Independent Verification Checklist</span>
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {result.independent_verification_steps.map((step, i) => (
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

              {result.risk_explanations.length > 0 && (
                <div style={{
                  marginTop: '14px',
                  padding: '12px',
                  borderRadius: '8px',
                  background: '#F5F3ED',
                  border: '1px solid #D8D5CD',
                  fontSize: '0.78rem',
                  color: 'var(--text-muted)',
                  lineHeight: '1.4'
                }}>
                  <strong style={{ color: 'var(--primary-accent)' }}>Fraud Mechanics: </strong>
                  {result.risk_explanations[0]}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}










