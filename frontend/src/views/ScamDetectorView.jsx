import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquareWarning,
  AlertTriangle,
  CheckCircle2,
  Send,
  Sparkles,
  RotateCcw,
  Info,
  ShieldCheck,
  Zap,
  Activity
} from 'lucide-react';
import ScoreGauge from '../components/ScoreGauge';

const SAMPLE_MESSAGES = [
  {
    name: "Threatening Bank KYC Suspension",
    text: "URGENT NOTICE: Your SBI Bank account will be SUSPENDED within 2 hours due to pending PAN KYC. Click http://bit.ly/sbi-kyc-verify-2026 immediately to update details and share OTP to prevent account deactivation."
  },
  {
    name: "Electricity Power Disconnection Threat",
    text: "Dear Consumer, your electricity power supply will be DISCONNECTED tonight at 9:30 PM from the power house because your previous month bill was not updated. Please immediately call our customer care officer at 9876543210."
  },
  {
    name: "Fake Customer Care Remote App Trap",
    text: "Hello, this is Amazon Support Executive. A fraudulent charge of Rs 42,999 was initiated on your card. To cancel this transaction immediately, download QuickSupport or AnyDesk from this link and share the 9-digit code with our agent."
  },
  {
    name: "Legitimate Bank Transaction Notification",
    text: "Dear Customer, INR 450.00 has been debited from your A/c XX4091 on 29-OCT-26 via UPI to Metro Store. Ref no 429381029381. If this was not you, call 1800-11-2211 or SMS BLOCK to 567676."
  }
];

export default function ScamDetectorView() {
  const [inputText, setInputText] = useState(SAMPLE_MESSAGES[0].text);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [liveScanning, setLiveScanning] = useState(false);

  // Debounced Real-Time live analysis as user types/pastes!
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
      setError("Please paste or type a message to inspect.");
      setLiveScanning(false);
      return;
    }
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/scan/message', {
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
      {/* Header Info */}
      <div className="cyber-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="stat-icon-wrapper">
              <MessageSquareWarning size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                Scam & Fake Customer-Care Message Detector
              </h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Inspect SMS, WhatsApp, emails, or chat transcripts for panic triggers, credential harvesting, and fake helpdesk signatures.
              </p>
            </div>
          </div>

          <span className="badge badge-clean" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Zap size={13} />
            <span>As-You-Type Live Scanning Active</span>
          </span>
        </div>

        {/* Sample Demo Chips */}
        <div style={{ marginTop: '16px' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '8px' }}>
            Load Safe Demo Scenario:
          </div>
          <div className="preset-bar">
            {SAMPLE_MESSAGES.map((sample, idx) => (
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

      {/* Main Analysis Input Box */}
      <div className="cyber-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-primary)' }}>
            Paste Message / Conversation Content:
          </label>
          {liveScanning && (
            <span style={{ fontSize: '0.75rem', color: 'var(--primary-accent)', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Activity size={12} className="animate-spin" />
              <span>Analyzing live in real-time...</span>
            </span>
          )}
        </div>

        <textarea
          rows={5}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Paste SMS, WhatsApp forward, email body, or telegram message here (e.g. 'URGENT: Your bank account will be blocked within 2 hours, share OTP to verify...')"
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
            <span>Clear Input</span>
          </button>

          <button
            type="button"
            className="btn-cyan"
            onClick={() => handleAnalyze(inputText, true)}
            disabled={loading}
          >
            <Send size={15} />
            <span>{loading ? 'Evaluating Heuristics...' : 'Save & Log Scan'}</span>
          </button>
        </div>
      </div>

      {/* Results Section (Real-Time Live Updates) */}
      {result && (
        <div className={`cyber-card ${result.risk_score >= 70 ? 'cyber-card-danger' : result.risk_score >= 40 ? 'cyber-card-highlight' : ''}`}>
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
              <ScoreGauge score={result.risk_score} label="Threat Score" />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span className={`badge ${
                    result.risk_score >= 70 ? 'badge-critical' : result.risk_score >= 40 ? 'badge-high' : result.risk_score >= 20 ? 'badge-medium' : 'badge-clean'
                  }`}>
                    {result.risk_level}
                  </span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    {result.detected_indicators_count} Warning Signs Triggered
                  </span>
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                  {result.risk_score >= 70 ? 'High-Risk Malicious Phishing Detected' : result.risk_score >= 40 ? 'Suspicious Urgency / Pretexting Markers' : 'Low Threat Probability'}
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Evaluated live using explainable heuristic pattern matching.
                </p>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span className="badge badge-clean" style={{ fontSize: '0.7rem' }}>
                Live Stream Evaluated
              </span>
            </div>
          </div>

          {/* Warning Signs & Explanations */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '18px' }}>
            {/* Warning Signs */}
            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <AlertTriangle size={16} color={result.risk_score >= 40 ? 'var(--color-danger)' : 'var(--primary-accent)'} />
                <span>Detected Indicators & Red Flags</span>
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {result.warning_signs.map((sign, i) => (
                  <div key={i} className={`finding-item ${result.risk_score >= 70 ? 'danger' : result.risk_score >= 40 ? 'warning' : 'clean'}`}>
                    <div style={{ fontSize: '0.84rem', color: 'var(--text-primary)', fontWeight: '600' }}>
                      {sign}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Explanations & Recommended Actions */}
            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <ShieldCheck size={16} color="var(--primary-accent)" />
                <span>Protective Action Plan</span>
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {result.actions.map((act, i) => (
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
                    <span>{act}</span>
                  </div>
                ))}
              </div>

              {result.explanations.length > 0 && (
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
                  <strong style={{ color: 'var(--primary-accent)' }}>Psychological Vector: </strong>
                  {result.explanations[0]}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}










