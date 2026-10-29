import React, { useState, useEffect } from 'react';
import {
  KeyRound,
  AlertTriangle,
  CheckCircle2,
  Send,
  Sparkles,
  RotateCcw,
  ShieldCheck,
  Lock,
  EyeOff,
  FileCode,
  Info,
  Zap,
  Activity
} from 'lucide-react';
import ScoreGauge from '../components/ScoreGauge';

const SAMPLE_LEAKS = [
  {
    name: "AWS & Mongo Cloud Config (.env)",
    code: `# Production Environment Variables
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY

# Database
DATABASE_URL=mongodb+srv://admin_prod:SuperSecretP@ssw0rd!@cluster0.mongodb.net/production?retryWrites=true
PORT=8080
`
  },
  {
    name: "OpenAI & GitHub API Scripts",
    code: `import os
import openai

# API Credentials
GITHUB_TOKEN = "ghp_984120938401293840192840192840192840"
openai.api_key = "sk-proj-491029481029481029481029481029481029481029"

def fetch_repos():
    # Fetch private repositories
    pass
`
  },
  {
    name: "Private RSA Key File",
    code: `-----BEGIN RSA PRIVATE KEY-----
MIIEowIBAAKCAQEA0Y3F+pW5BvM...[TRUNCATED_FOR_SECURITY]...
d1K8VwIDAQABAoIBABc...
-----END RSA PRIVATE KEY-----
`
  },
  {
    name: "Sanitized Clean Config",
    code: `import os

AWS_KEY = os.getenv("AWS_ACCESS_KEY_ID")
DB_URL = os.getenv("DATABASE_URL")
`
  }
];

export default function LeakLockView() {
  const [content, setContent] = useState(SAMPLE_LEAKS[0].code);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [liveScanning, setLiveScanning] = useState(false);

  // Debounced real-time analysis as user pastes/edits code!
  useEffect(() => {
    if (!content.trim()) {
      setResult(null);
      setError('');
      return;
    }

    setLiveScanning(true);
    const timer = setTimeout(() => {
      handleScan(content, false);
    }, 400);

    return () => clearTimeout(timer);
  }, [content]);

  const handleScan = async (codeToScan = content, shouldLog = true) => {
    if (!codeToScan.trim()) {
      setError("Please paste code, config, or environment variables to inspect.");
      setLiveScanning(false);
      return;
    }
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/scan/leak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: codeToScan, auto_log: shouldLog })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to scan secrets");
      } else {
        setResult(data);
      }
    } catch (err) {
      setError("Network error connecting to scanner: " + err.message);
    } finally {
      setLoading(false);
      setLiveScanning(false);
    }
  };

  const loadPreset = (code) => {
    setContent(code);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Overview Card */}
      <div className="cyber-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="stat-icon-wrapper cyan">
              <KeyRound size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                Leak Lock — Password & API Key Leakage Scanner
              </h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Zero-knowledge deterministic scanner for hardcoded credentials, cloud provider tokens, database connection URIs, and private keys.
              </p>
            </div>
          </div>

          <span className="badge badge-clean" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Zap size={13} />
            <span>As-You-Type In-Memory Scanner Active</span>
          </span>
        </div>

        {/* Security / Privacy Warning Banner */}
        <div style={{
          marginTop: '12px',
          padding: '10px 14px',
          borderRadius: '8px',
          background: 'rgba(212, 164, 75, 0.08)',
          border: '1px solid rgba(212, 164, 75, 0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '0.78rem',
          color: 'var(--color-warning)'
        }}>
          <Info size={16} style={{ flexShrink: 0 }} />
          <span>
            <strong>Demo Safety Notice:</strong> Please use safe demo snippets or test dummy keys. All scanning executes locally in-memory, secrets are strictly masked, and raw secrets are never committed to history.
          </span>
        </div>

        {/* Preset Chips */}
        <div style={{ marginTop: '16px' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '8px' }}>
            Load Safe Demo Code:
          </div>
          <div className="preset-bar">
            {SAMPLE_LEAKS.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                className="preset-chip"
                onClick={() => loadPreset(sample.code)}
              >
                <Sparkles size={12} style={{ display: 'inline', marginRight: '4px' }} />
                {sample.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Code Input Box */}
      <div className="cyber-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-primary)' }}>
            Paste Source Code, Configuration (.env / YAML), or Text:
          </label>
          {liveScanning && (
            <span style={{ fontSize: '0.75rem', color: 'var(--primary-accent)', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Activity size={12} className="animate-spin" />
              <span>Scanning lines in-memory...</span>
            </span>
          )}
        </div>

        <textarea
          rows={7}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={`# Paste .env, Python, JS, or YAML files\nAWS_KEY=AKIAIOSFODNN7EXAMPLE\nDATABASE_URL=postgres://user:password@localhost:5432/db`}
          style={{
            width: '100%',
            padding: '14px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.86rem',
            lineHeight: '1.4',
            resize: 'vertical',
            marginBottom: '14px',
            background: 'rgba(5, 9, 21, 0.9)'
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
            onClick={() => { setContent(''); setResult(null); setError(''); }}
          >
            <RotateCcw size={15} />
            <span>Clear Code</span>
          </button>

          <button
            type="button"
            className="btn-cyan"
            onClick={() => handleScan(content, true)}
            disabled={loading}
          >
            <EyeOff size={15} />
            <span>{loading ? 'Running Regex Scanner...' : 'Save & Log Findings'}</span>
          </button>
        </div>
      </div>

      {/* Results View (Real-Time Live Updates) */}
      {result && (
        <div className={`cyber-card ${result.risk_score >= 60 ? 'cyber-card-danger' : result.risk_score > 0 ? 'cyber-card-highlight' : ''}`}>
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
              <ScoreGauge score={result.risk_score} label="Exposure" />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span className={`badge ${
                    result.risk_score >= 60 ? 'badge-critical' : result.risk_score > 0 ? 'badge-high' : 'badge-clean'
                  }`}>
                    {result.risk_level}
                  </span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    {result.total_findings} Credentials Detected
                  </span>
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                  {result.total_findings > 0 ? 'Exposed Sensitive Secrets Found' : 'Clean Scan: Zero Secrets Detected'}
                </h3>
              </div>
            </div>

            <span className="badge badge-clean" style={{ fontSize: '0.7rem' }}>
              Zero-Knowledge Redaction Applied
            </span>
          </div>

          {/* Masked Findings Table */}
          {result.findings && result.findings.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(0, 0, 0, 0.06)', textAlign: 'left', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '10px 12px' }}>Secret Type</th>
                    <th style={{ padding: '10px 12px' }}>Severity</th>
                    <th style={{ padding: '10px 12px' }}>Line #</th>
                    <th style={{ padding: '10px 12px' }}>Masked Value</th>
                    <th style={{ padding: '10px 12px' }}>Remediation Advice</th>
                  </tr>
                </thead>
                <tbody>
                  {result.findings.map((finding, idx) => (
                    <tr
                      key={idx}
                      style={{
                        borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
                        background: idx % 2 === 0 ? '#F8F7F3' : 'transparent'
                      }}
                    >
                      <td style={{ padding: '12px', fontWeight: '700', color: 'var(--text-primary)' }}>
                        {finding.type}
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span className={`badge ${
                          finding.severity === 'Critical' ? 'badge-critical' : finding.severity === 'High' ? 'badge-high' : 'badge-medium'
                        }`}>
                          {finding.severity}
                        </span>
                      </td>
                      <td style={{ padding: '12px', fontFamily: 'var(--font-mono)', color: 'var(--primary-accent)' }}>
                        L:{finding.line_number}
                      </td>
                      <td style={{ padding: '12px', fontFamily: 'var(--font-mono)', color: 'var(--color-danger)', background: 'rgba(183, 74, 74, 0.05)', borderRadius: '4px' }}>
                        {finding.masked_value}
                      </td>
                      <td style={{ padding: '12px', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                        {finding.remediation}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{
              padding: '24px',
              textAlign: 'center',
              color: 'var(--primary-accent)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px'
            }}>
              <CheckCircle2 size={36} />
              <div style={{ fontSize: '1rem', fontWeight: '700' }}>
                Zero Hardcoded Credentials Detected!
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Your snippet does not appear to contain exposed AWS keys, tokens, or plaintext DB URIs.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}










