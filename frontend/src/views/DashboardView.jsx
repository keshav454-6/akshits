import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Globe,
  Radio,
  ArrowRight,
  RefreshCw,
  Zap,
  Lock,
  MessageSquareWarning,
  CreditCard,
  UserX,
  KeyRound,
  Mic,
  Activity,
  CheckCircle2
} from 'lucide-react';
import ScoreGauge from '../components/ScoreGauge';

export default function DashboardView({ setTab }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/stats');
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error("Failed to load dashboard stats", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const MODULES = [
    {
      id: 'scam',
      title: 'Scam & Care Detector',
      desc: 'Detect fake customer-care, urgent payment threats, and OTP harvesting.',
      icon: MessageSquareWarning,
      color: 'blue'
    },
    {
      id: 'payment',
      title: 'Payment Request Shield',
      desc: 'Verify UPI QR scams, cashback traps, and reverse-credit fraud requests.',
      icon: CreditCard,
      color: 'cyan'
    },
    {
      id: 'impersonation',
      title: 'Impersonation Detector',
      desc: 'Unmask fake CBI/Police Digital Arrests, SBI/HDFC reps, and FedEx customs.',
      icon: UserX,
      color: 'purple'
    },
    {
      id: 'url',
      title: 'Fake Website Risk Analyzer',
      desc: 'Examine lookalike domains, TLS encryption, and enforce in-app blocklist.',
      icon: Globe,
      color: 'blue'
    },
    {
      id: 'leak',
      title: 'Leak Lock (Keys & Secrets)',
      desc: 'Deterministic zero-knowledge scanner for AWS, OpenAI, GitHub, and DB secrets.',
      icon: KeyRound,
      color: 'cyan'
    },
    {
      id: 'permission',
      title: 'Permission Lens',
      desc: 'Audit mobile & browser permissions against real utility necessity matrices.',
      icon: ShieldAlert,
      color: 'purple'
    },
    {
      id: 'voice',
      title: 'Voice-Clone Scam Guard',
      desc: 'Interactive guided risk assessment for AI-synthesized family extortion calls.',
      icon: Mic,
      color: 'blue'
    },
    {
      id: 'session',
      title: 'Session Anomaly Lab',
      desc: 'Synthetic security lab detecting impossible travel & credential stuffing attacks.',
      icon: Activity,
      color: 'cyan'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
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
            <span className="badge badge-clean">Active Defense Grid</span>
            <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)' }}>v1.0 Hackathon Ready</span>
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#FFFFFF', marginBottom: '6px' }}>
            CyberShield One Defense Operations
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.9rem', maxWidth: '640px', lineHeight: '1.5' }}>
            Comprehensive heuristic, explainable protection against scam communications, payment traps, brand spoofing, credential exposure, and generative voice fraud.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={fetchStats} className="btn-secondary">
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            <span>Refresh Telemetry</span>
          </button>
          <button onClick={() => setTab('demo')} className="btn-cyan">
            <Zap size={16} />
            <span>Launch Hackathon Demo</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="stats-grid">
        <div className="cyber-card stat-card">
          <div className="stat-icon-wrapper cyan">
            <ShieldCheck size={26} />
          </div>
          <div className="stat-info">
            <span className="stat-val">{stats?.total_scans ?? '--'}</span>
            <span className="stat-lbl">Total Scans Performed</span>
          </div>
        </div>

        <div className="cyber-card stat-card">
          <div className="stat-icon-wrapper">
            <AlertTriangle size={26} />
          </div>
          <div className="stat-info">
            <span className="stat-val">{stats?.threats_detected ?? '--'}</span>
            <span className="stat-lbl">Threats Intercepted</span>
          </div>
        </div>

        <div className="cyber-card stat-card">
          <div className="stat-icon-wrapper danger">
            <ShieldAlert size={26} />
          </div>
          <div className="stat-info">
            <span className="stat-val">{stats?.high_risk_incidents ?? '--'}</span>
            <span className="stat-lbl">High-Risk Incidents</span>
          </div>
        </div>

        <div className="cyber-card stat-card">
          <div className="stat-icon-wrapper purple">
            <Globe size={26} />
          </div>
          <div className="stat-info">
            <span className="stat-val">{stats?.blocked_sites ?? '--'}</span>
            <span className="stat-lbl">In-App Blocked Domains</span>
          </div>
        </div>
      </div>

      {/* Quick Launchpad to all 8 modules */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-primary)' }}>
              Specialized Defense Modules
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Select a tool to analyze pasted text, links, source code, or synthetic sessions.
            </p>
          </div>
          <button 
            onClick={() => setTab('incidents')} 
            style={{ background: 'transparent', color: 'var(--primary-accent)', fontSize: '0.82rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <span>View Incident Hub</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="quick-grid">
          {MODULES.map((m) => {
            const Icon = m.icon;
            return (
              <div 
                key={m.id} 
                onClick={() => setTab(m.id)}
                className="cyber-card quick-card"
              >
                <div>
                  <div className="quick-card-top">
                    <div className="quick-icon">
                      <Icon size={20} />
                    </div>
                    <div>
                      <div className="quick-title">{m.title}</div>
                      <div className="quick-desc">{m.desc}</div>
                    </div>
                  </div>
                </div>
                <div className="quick-footer">
                  <span className="badge badge-neutral" style={{ fontSize: '0.65rem' }}>Active Engine</span>
                  <div className="quick-link-text">
                    <span>Open Module</span>
                    <ArrowRight size={13} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Alerts & Incident History stream */}
      <div className="cyber-card">
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px',
          paddingBottom: '12px',
          borderBottom: '1px solid #D8D5CD'
        }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)' }}>
              Recent Security Incidents & Threat Telemetry
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Live consolidated feed from all detection layers
            </p>
          </div>
          <button onClick={() => setTab('incidents')} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.78rem' }}>
            <span>Manage All Incidents</span>
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {stats?.recent_activity && stats.recent_activity.length > 0 ? (
            stats.recent_activity.map((item) => (
              <div 
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  background: '#FFFFFF',
                  borderRadius: '10px',
                  border: '1px solid #D8D5CD',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    color: 'var(--primary-accent)',
                    background: 'rgba(33, 76, 58, 0.06)',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    border: '1px solid rgba(33, 76, 58, 0.15)'
                  }}>
                    {item.id}
                  </span>
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                      {item.title}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                      Logged at {item.time} • Category: {item.module}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span className={`badge ${
                    item.risk_score >= 70 ? 'badge-critical' : item.risk_score >= 35 ? 'badge-high' : 'badge-low'
                  }`}>
                    Risk: {item.risk_score}/100
                  </span>
                  <span className={`badge ${
                    item.status === 'Resolved' ? 'badge-clean' : item.status === 'Reviewed' ? 'badge-medium' : 'badge-neutral'
                  }`}>
                    {item.status}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              No incidents recorded yet. Use any module or Try Demo to run tests.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}











