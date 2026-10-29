import React, { useState, useEffect } from 'react';
import {
  Mic,
  AlertTriangle,
  CheckCircle2,
  Send,
  Sparkles,
  RotateCcw,
  ShieldCheck,
  PhoneOff,
  Key,
  Video,
  Info,
  Volume2,
  Zap
} from 'lucide-react';
import ScoreGauge from '../components/ScoreGauge';

const QUESTIONS = [
  {
    key: "familiar_voice_money",
    title: "1. Urgent Money Transfer Request",
    desc: "Did someone who sounded like your child, parent, spouse, or friend call urgently demanding funds or crypto?"
  },
  {
    key: "emotional_emergency",
    title: "2. Extreme Emergency Pretext",
    desc: "Was an intense crisis claimed (e.g. car accident, hospital ICU admission, jail bail, kidnapper ransom, or impounded luggage)?"
  },
  {
    key: "demand_secrecy",
    title: "3. Insistence on Strict Secrecy",
    desc: "Did the caller beg you not to tell anyone else ('Don't call mom/dad', 'Don't involve police', 'Keep this between us')?"
  },
  {
    key: "urgency_deadline",
    title: "4. Extreme Time-Pressure Deadline",
    desc: "Did the caller insist that money must be sent within minutes or something catastrophic will occur?"
  },
  {
    key: "refuses_video_verify",
    title: "5. Refusal of Live Video Verification",
    desc: "Did they refuse a FaceTime / WhatsApp video call, claiming bad reception, broken camera, or strict room rules?"
  },
  {
    key: "unusual_channel_or_number",
    title: "6. Call from Unfamiliar / Hidden Number",
    desc: "Did the call originate from an unknown number or messaging account claiming their primary phone broke or was stolen?"
  },
  {
    key: "strange_speech_artifacts",
    title: "7. Synthetic Audio or Robotic Pauses",
    desc: "Did the voice exhibit unnatural pauses, clipped breaths, odd background static, or an unusual emotional flat tone?"
  }
];

export default function VoiceCloneView() {
  const [answers, setAnswers] = useState({
    familiar_voice_money: true,
    emotional_emergency: true,
    demand_secrecy: false,
    urgency_deadline: false,
    refuses_video_verify: false,
    unusual_channel_or_number: false,
    strange_speech_artifacts: false
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Auto-evaluate in real time whenever any answer changes!
  useEffect(() => {
    handleEvaluate(answers);
  }, [answers]);

  const toggleAnswer = (key) => {
    setAnswers(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleEvaluate = async (currentAnswers = answers) => {
    setLoading(true);
    try {
      const res = await fetch('/api/scan/voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: currentAnswers, auto_log: false })
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadPresetAttack = () => {
    setAnswers({
      familiar_voice_money: true,
      emotional_emergency: true,
      demand_secrecy: true,
      urgency_deadline: true,
      refuses_video_verify: true,
      unusual_channel_or_number: true,
      strange_speech_artifacts: true
    });
  };

  const resetAll = () => {
    setAnswers({
      familiar_voice_money: false,
      emotional_emergency: false,
      demand_secrecy: false,
      urgency_deadline: false,
      refuses_video_verify: false,
      unusual_channel_or_number: false,
      strange_speech_artifacts: false
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Overview Card */}
      <div className="cyber-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="stat-icon-wrapper">
              <Mic size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                Voice-Clone Scam Protection Guard
              </h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Defend against AI voice deepfakes. Evaluate psychological coercion, emergency pretexts, and deploy immediate verification protocols.
              </p>
            </div>
          </div>

          <span className="badge badge-clean" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Zap size={13} />
            <span>Instant Real-Time Evaluation</span>
          </span>
        </div>

        {/* Mandatory Transparency Disclaimer */}
        <div style={{
          marginTop: '12px',
          padding: '10px 14px',
          borderRadius: '8px',
          background: 'rgba(0, 0, 0, 0.06)',
          border: '1px solid rgba(0, 0, 0, 0.08)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '0.78rem',
          color: 'var(--primary-accent)'
        }}>
          <Info size={16} style={{ flexShrink: 0 }} />
          <span>
            <strong>Transparency Disclaimer:</strong> This module assesses behavioral, operational, and psychological scam indicators characteristic of AI voice fraud. It does not perform raw biometric spectral waveform analysis and clearly warns users not to rely on automated systems alone to certify audio.
          </span>
        </div>

        {/* Action presets */}
        <div style={{ marginTop: '16px' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '8px' }}>
            Quick Demo Scenario:
          </div>
          <div className="preset-bar">
            <button
              type="button"
              className="preset-chip"
              onClick={loadPresetAttack}
            >
              <Sparkles size={12} style={{ display: 'inline', marginRight: '4px' }} />
              Simulate Full AI Kidnapping / Bail Extortion Call
            </button>
            <button
              type="button"
              className="preset-chip"
              onClick={resetAll}
            >
              <RotateCcw size={12} style={{ display: 'inline', marginRight: '4px' }} />
              Reset All Questions
            </button>
          </div>
        </div>
      </div>

      {/* Guided Questionnaire */}
      <div className="cyber-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)' }}>
            Interactive Scam Assessment Questionnaire
          </h3>
          <span style={{ fontSize: '0.78rem', color: 'var(--primary-accent)' }}>
            ⚡ Real-time reactive: clicks update threat score instantly
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {QUESTIONS.map(q => {
            const isChecked = answers[q.key];
            return (
              <div
                key={q.key}
                onClick={() => toggleAnswer(q.key)}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '14px',
                  padding: '14px 16px',
                  borderRadius: '10px',
                  background: isChecked ? 'rgba(183, 74, 74, 0.08)' : '#F5F3ED',
                  border: isChecked ? '1px solid rgba(183, 74, 74, 0.3)' : '1px solid rgba(0, 0, 0, 0.04)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '5px',
                  border: `2px solid ${isChecked ? 'var(--color-danger)' : 'var(--border-subtle)'}`,
                  background: isChecked ? 'var(--color-danger)' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: '2px',
                  flexShrink: 0
                }}>
                  {isChecked && <CheckCircle2 size={14} color="var(--text-primary)" />}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: '700', color: isChecked ? 'var(--text-primary)' : 'var(--text-primary)' }}>
                    {q.title}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px', lineHeight: '1.4' }}>
                    {q.desc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Results View (Instantly updated in real time) */}
      {result && (
        <div className={`cyber-card ${result.risk_score >= 60 ? 'cyber-card-danger' : result.risk_score >= 35 ? 'cyber-card-highlight' : ''}`}>
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
              <ScoreGauge score={result.risk_score} label="Clone Threat" />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span className={`badge ${
                    result.risk_score >= 60 ? 'badge-critical' : result.risk_score >= 35 ? 'badge-high' : 'badge-clean'
                  }`}>
                    {result.risk_level}
                  </span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    {result.active_indicators.length} Operational Red Flags Flagged
                  </span>
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                  {result.verdict}
                </h3>
              </div>
            </div>

            <div style={{
              background: '#F5F3ED',
              border: '1px solid rgba(46, 139, 87, 0.2)',
              borderRadius: '10px',
              padding: '12px 16px',
              maxWidth: '300px'
            }}>
              <div style={{ fontSize: '0.74rem', color: 'var(--primary-accent)', fontWeight: '800', textTransform: 'uppercase', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Key size={14} />
                <span>Family Safe-Word Protocol</span>
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: '1.3' }}>
                Agree upon a secret word known only to your family. If someone calls claiming an emergency, demand the Safe-Word.
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '18px' }}>
            {/* Active Indicators */}
            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <AlertTriangle size={16} color={result.risk_score >= 35 ? 'var(--color-warning)' : 'var(--primary-accent)'} />
                <span>Active Extortion Indicators</span>
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {result.active_indicators.length > 0 ? (
                  result.active_indicators.map((ind, i) => (
                    <div key={i} className={`finding-item ${result.risk_score >= 60 ? 'danger' : 'warning'}`}>
                      <div style={{ fontSize: '0.84rem', color: 'var(--text-primary)', fontWeight: '600' }}>
                        {ind}
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ fontSize: '0.82rem', color: 'var(--primary-accent)', padding: '10px' }}>
                    No red flags selected. Voice interaction appears standard.
                  </div>
                )}
              </div>
            </div>

            {/* Actionable Countermeasures */}
            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <ShieldCheck size={16} color="var(--primary-accent)" />
                <span>Immediate Countermeasures</span>
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {result.actionable_countermeasures.map((cm, i) => (
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
                    <span>{cm}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}










