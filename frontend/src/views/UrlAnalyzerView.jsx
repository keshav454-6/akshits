import React, { useState, useEffect } from 'react';
import {
  Globe,
  AlertTriangle,
  CheckCircle2,
  Send,
  Sparkles,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  Ban,
  Trash2,
  ExternalLink,
  Lock,
  Unlock,
  Zap,
  Activity
} from 'lucide-react';
import ScoreGauge from '../components/ScoreGauge';

const SAMPLE_URLS = [
  {
    name: "Multi-Subdomain SBI Phishing",
    url: "http://sbi.bank.login-portal.secure-verify.xyz/account/signin"
  },
  {
    name: "PayPal Typosquat Lookalike",
    url: "http://paypal-security-verification-center.top/resolve"
  },
  {
    name: "Direct IP Address Banking Form",
    url: "http://192.168.1.105/netbanking/login.php"
  },
  {
    name: "Legitimate Corporate Domain",
    url: "https://www.onlinesbi.sbi"
  }
];

export default function UrlAnalyzerView() {
  const [inputUrl, setInputUrl] = useState(SAMPLE_URLS[0].url);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [blocklist, setBlocklist] = useState([]);
  const [blockStatus, setBlockStatus] = useState('');
  const [liveScanning, setLiveScanning] = useState(false);

  // Fetch local blocklist on load
  const fetchBlocklist = async () => {
    try {
      const res = await fetch('/api/blocklist');
      const data = await res.json();
      setBlocklist(data);
    } catch (e) {
      console.error("Failed to load blocklist", e);
    }
  };

  useEffect(() => {
    fetchBlocklist();
  }, []);

  // Debounced real-time analysis as user types/pastes a URL!
  useEffect(() => {
    if (!inputUrl.trim()) {
      setResult(null);
      setError('');
      return;
    }

    setLiveScanning(true);
    const timer = setTimeout(() => {
      handleAnalyze(inputUrl, false);
    }, 400);

    return () => clearTimeout(timer);
  }, [inputUrl]);

  const handleAnalyze = async (urlToScan = inputUrl, shouldLog = true) => {
    if (!urlToScan.trim()) {
      setError("Please enter a URL to inspect.");
      setLiveScanning(false);
      return;
    }
    setError('');
    setBlockStatus('');
    setLoading(true);

    try {
      const res = await fetch('/api/scan/url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: urlToScan, auto_log: shouldLog })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to analyze URL");
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

  const handleBlockUrl = async () => {
    if (!result) return;
    try {
      const res = await fetch('/api/blocklist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: result.input_url,
          reason: `Flagged as high-risk (${result.risk_level}) by CyberShield analyzer`,
          risk_score: result.risk_score
        })
      });
      const data = await res.json();
      if (res.ok) {
        setBlockStatus("URL added to CyberShield In-App Blocklist!");
        fetchBlocklist();
        handleAnalyze(result.input_url, false);
      } else {
        setBlockStatus(data.error || "Could not add to blocklist.");
      }
    } catch (err) {
      setBlockStatus("Failed to update blocklist: " + err.message);
    }
  };

  const handleRemoveBlock = async (id) => {
    try {
      await fetch(`/api/blocklist/${id}`, { method: 'DELETE' });
      fetchBlocklist();
      if (result) handleAnalyze(result.input_url, false);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Overview Card */}
      <div className="cyber-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="stat-icon-wrapper">
              <Globe size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                Fake Website Risk Analyzer & In-App Blocklist
              </h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Detect lookalike typosquatting, deceptive nested subdomains, raw IP hosts, and manage your local in-app blocklist.
              </p>
            </div>
          </div>

          <span className="badge badge-clean" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Zap size={13} />
            <span>As-You-Type URL Scanner Active</span>
          </span>
        </div>

        {/* Demo chips */}
        <div style={{ marginTop: '16px' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '8px' }}>
            Load Safe URL Demo Scenario:
          </div>
          <div className="preset-bar">
            {SAMPLE_URLS.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                className="preset-chip"
                onClick={() => setInputUrl(sample.url)}
              >
                <Sparkles size={12} style={{ display: 'inline', marginRight: '4px' }} />
                {sample.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* URL Input Form */}
      <div className="cyber-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-primary)' }}>
            Target Website URL to Inspect:
          </label>
          {liveScanning && (
            <span style={{ fontSize: '0.75rem', color: 'var(--primary-accent)', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Activity size={12} className="animate-spin" />
              <span>Analyzing domain heuristics in real-time...</span>
            </span>
          )}
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '12px' }}>
          <input
            type="text"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            placeholder="e.g. http://sbi.bank.login-portal.secure-verify.xyz or https://paypal-security.top"
            style={{ flex: 1, minWidth: '280px', padding: '12px 16px', fontSize: '0.9rem' }}
          />
          <button
            type="button"
            className="btn-cyan"
            onClick={() => handleAnalyze(inputUrl, true)}
            disabled={loading}
          >
            <Send size={15} />
            <span>{loading ? 'Inspecting Host...' : 'Save & Log Scan'}</span>
          </button>
        </div>

        {error && (
          <div style={{
            color: 'var(--color-danger)',
            background: 'rgba(183, 74, 74, 0.08)',
            border: '1px solid rgba(183, 74, 74, 0.2)',
            padding: '10px 14px',
            borderRadius: '8px',
            fontSize: '0.82rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertTriangle size={16} />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Prominent High-Risk Warning Screen / Result (Real-Time Live Updates) */}
      {result && (
        <div className={`cyber-card ${result.risk_score >= 60 ? 'cyber-card-danger' : result.risk_score >= 35 ? 'cyber-card-highlight' : ''}`}>
          {/* High Risk Banner if critical */}
          {result.risk_score >= 60 && (
            <div style={{
              background: 'linear-gradient(90deg, rgba(183, 74, 74, 0.12) 0%, rgba(183, 74, 74, 0.06) 100%)',
              border: '1px solid rgba(183, 74, 74, 0.3)',
              borderRadius: '10px',
              padding: '14px 18px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <ShieldAlert size={28} color="var(--color-danger)" />
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--color-danger)' }}>
                    HAZARDOUS WEBSITE WARNING
                  </h4>
                  <p style={{ fontSize: '0.82rem', color: 'var(--color-warning)' }}>
                    This destination demonstrates strong hallmarks of deceptive credential harvesting or typosquatting.
                  </p>
                </div>
              </div>

              {!result.is_blocked_locally ? (
                <button
                  type="button"
                  className="btn-danger"
                  onClick={handleBlockUrl}
                >
                  <Ban size={15} />
                  <span>Block in CyberShield</span>
                </button>
              ) : (
                <span className="badge badge-critical" style={{ fontSize: '0.78rem' }}>
                  Locally Blocked Shield Active
                </span>
              )}
            </div>
          )}

          {blockStatus && (
            <div style={{
              marginBottom: '16px',
              padding: '8px 14px',
              background: 'rgba(33, 76, 58, 0.06)',
              border: '1px solid rgba(46, 139, 87, 0.2)',
              borderRadius: '8px',
              color: 'var(--primary-accent)',
              fontSize: '0.82rem'
            }}>
              {blockStatus}
            </div>
          )}

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
              <ScoreGauge score={result.risk_score} label="URL Risk" />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span className={`badge ${
                    result.risk_score >= 60 ? 'badge-critical' : result.risk_score >= 35 ? 'badge-high' : 'badge-clean'
                  }`}>
                    {result.risk_level}
                  </span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    Protocol: {result.scheme} • Host: {result.hostname}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-primary)', wordBreak: 'break-all' }}>
                  {result.input_url}
                </h3>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '8px',
                background: result.is_https ? 'rgba(33, 76, 58, 0.06)' : 'rgba(183, 74, 74, 0.08)',
                border: `1px solid ${result.is_https ? 'rgba(46, 139, 87, 0.2)' : 'rgba(183, 74, 74, 0.2)'}`,
                fontSize: '0.8rem',
                fontWeight: '600',
                color: result.is_https ? 'var(--primary-accent)' : 'var(--color-danger)'
              }}>
                {result.is_https ? <Lock size={14} /> : <Unlock size={14} />}
                <span>{result.is_https ? 'HTTPS Encrypted' : 'Unencrypted HTTP'}</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '18px' }}>
            {/* Warning Indicators */}
            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <AlertTriangle size={16} color={result.risk_score >= 35 ? 'var(--color-warning)' : 'var(--primary-accent)'} />
                <span>Heuristic Findings</span>
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {result.warning_indicators.map((ind, i) => (
                  <div key={i} className={`finding-item ${result.risk_score >= 60 ? 'danger' : result.risk_score >= 35 ? 'warning' : 'clean'}`}>
                    <div style={{ fontSize: '0.84rem', color: 'var(--text-primary)', fontWeight: '600' }}>
                      {ind}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <ShieldCheck size={16} color="var(--primary-accent)" />
                <span>Safety Guidance</span>
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {result.safety_recommendations.map((rec, i) => (
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
                    <span>{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Active In-App Blocklist Manager */}
      <div className="cyber-card">
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '14px',
          paddingBottom: '10px',
          borderBottom: '1px solid #D8D5CD'
        }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)' }}>
              CyberShield In-App Blocklist ({blocklist.length})
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Locally blacklisted domains stored in SQLite database. Marked unsafe upon re-analysis.
            </p>
          </div>
          <span className="badge badge-neutral" style={{ fontSize: '0.68rem' }}>
            In-App Protection Scope
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {blocklist.length > 0 ? (
            blocklist.map((item) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  background: '#FFFFFF',
                  borderRadius: '8px',
                  border: '1px solid rgba(183, 74, 74, 0.2)',
                  flexWrap: 'wrap',
                  gap: '10px'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--color-danger)' }}>
                    {item.domain}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                    {item.reason} • Added: {item.created_at}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    onClick={() => setInputUrl(item.url)}
                    className="btn-secondary"
                    style={{ padding: '5px 10px', fontSize: '0.75rem' }}
                  >
                    Inspect
                  </button>
                  <button
                    onClick={() => handleRemoveBlock(item.id)}
                    style={{
                      background: 'rgba(183, 74, 74, 0.08)',
                      border: '1px solid rgba(183, 74, 74, 0.2)',
                      color: 'var(--color-danger)',
                      padding: '5px 8px',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                    title="Remove from blocklist"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
              No URLs currently on the local blocklist.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}










