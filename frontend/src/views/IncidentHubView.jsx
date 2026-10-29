import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Filter,
  Search,
  Download,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Eye,
  FileText,
  RefreshCw,
  Printer
} from 'lucide-react';
import ScoreGauge from '../components/ScoreGauge';

export default function IncidentHubView() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [moduleFilter, setModuleFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIncident, setSelectedIncident] = useState(null);

  const fetchIncidents = async () => {
    setLoading(true);
    try {
      const url = `/api/incidents?status=${statusFilter}&module=${moduleFilter}&q=${encodeURIComponent(searchQuery)}`;
      const res = await fetch(url);
      const data = await res.json();
      setIncidents(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, [statusFilter, moduleFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchIncidents();
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await fetch(`/api/incidents/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      fetchIncidents();
      if (selectedIncident && selectedIncident.id === id) {
        setSelectedIncident(prev => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const exportSanitizedJSON = async () => {
    try {
      const res = await fetch('/api/incidents/export');
      const data = await res.json();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const href = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = href;
      link.download = `cybershield_audit_report_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      alert("Export failed: " + err.message);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Header Bar */}
      <div className="cyber-card">
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '14px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="stat-icon-wrapper cyan">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                Unified Incident Hub
              </h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Centralized ledger correlating security alerts, evidence, and risk scores across all 8 defense modules.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={exportSanitizedJSON}
              className="btn-cyan"
              style={{ padding: '8px 14px', fontSize: '0.8rem' }}
            >
              <Download size={15} />
              <span>Export Audit JSON</span>
            </button>
            <button
              onClick={() => window.print()}
              className="btn-secondary"
              style={{ padding: '8px 14px', fontSize: '0.8rem' }}
            >
              <Printer size={15} />
              <span>Print Report</span>
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1, minWidth: '220px' }}>
            <div style={{ position: 'relative', width: '100%' }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search incident ID, keyword, or summary..."
                style={{ width: '100%', padding: '9px 12px 9px 34px', fontSize: '0.86rem' }}
              />
              <Search size={15} color="var(--text-secondary)" style={{ position: 'absolute', left: '10px', top: '11px' }} />
            </div>
          </div>

          {/* Status Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ padding: '8px 12px', fontSize: '0.84rem' }}
            >
              <option value="All">All Statuses</option>
              <option value="New">New</option>
              <option value="Reviewed">Reviewed</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          {/* Module Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Module:</span>
            <select
              value={moduleFilter}
              onChange={(e) => setModuleFilter(e.target.value)}
              style={{ padding: '8px 12px', fontSize: '0.84rem' }}
            >
              <option value="All">All Modules</option>
              <option value="scam_detector">Scam Detector</option>
              <option value="payment_detector">Payment Shield</option>
              <option value="impersonation">Impersonation</option>
              <option value="url_analyzer">URL Analyzer</option>
              <option value="leak_lock">Leak Lock</option>
              <option value="permission_lens">Permission Lens</option>
              <option value="voice_clone">Voice Clone</option>
            </select>
          </div>

          <button type="submit" className="btn-secondary" style={{ padding: '8px 14px', fontSize: '0.84rem' }}>
            <span>Filter</span>
          </button>
        </form>
      </div>

      {/* Incidents Table / Stream */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {incidents.length > 0 ? (
          incidents.map((inc) => (
            <div
              key={inc.id}
              className={`cyber-card ${inc.risk_score >= 70 ? 'cyber-card-danger' : inc.risk_score >= 35 ? 'cyber-card-highlight' : ''}`}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '16px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                <ScoreGauge score={inc.risk_score} size={80} label="Threat" />

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.8rem',
                      color: 'var(--primary-accent)',
                      background: 'rgba(33, 76, 58, 0.08)',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontWeight: '700'
                    }}>
                      {inc.id}
                    </span>
                    <span className="badge badge-neutral" style={{ fontSize: '0.68rem' }}>
                      {inc.module}
                    </span>
                    <span className={`badge ${
                      inc.risk_score >= 70 ? 'badge-critical' : inc.risk_score >= 35 ? 'badge-high' : 'badge-clean'
                    }`}>
                      {inc.severity}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                    {inc.title}
                  </h3>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px', lineHeight: '1.4' }}>
                    {inc.summary}
                  </p>

                  <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
                    Logged on: {inc.created_at}
                  </div>
                </div>
              </div>

              {/* Status and actions */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Status:</span>
                  <select
                    value={inc.status}
                    onChange={(e) => updateStatus(inc.id, e.target.value)}
                    style={{ padding: '4px 8px', fontSize: '0.75rem', fontWeight: '600' }}
                  >
                    <option value="New">New</option>
                    <option value="Reviewed">Reviewed</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>

                <button
                  type="button"
                  className="btn-secondary"
                  style={{ padding: '5px 10px', fontSize: '0.75rem' }}
                  onClick={() => setSelectedIncident(inc)}
                >
                  <Eye size={13} />
                  <span>Inspect Evidence</span>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="cyber-card" style={{ textAlign: 'center', padding: '36px', color: 'var(--text-secondary)' }}>
            No incidents matched your query. Use any scanner to record new findings.
          </div>
        )}
      </div>

      {/* Evidence Modal */}
      {selectedIncident && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(3, 7, 18, 0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 60,
          padding: '20px'
        }}>
          <div className="cyber-card" style={{ maxWidth: '600px', width: '100%', maxHeight: '80vh', overflowY: 'auto' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
              paddingBottom: '12px',
              marginBottom: '16px'
            }}>
              <div>
                <span className="badge badge-clean">{selectedIncident.id}</span>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-primary)', marginTop: '4px' }}>
                  {selectedIncident.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedIncident(null)}
                style={{ background: 'transparent', color: 'var(--text-muted)', fontSize: '1.2rem' }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <strong style={{ fontSize: '0.8rem', color: 'var(--primary-accent)' }}>Summary:</strong>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-primary)', marginTop: '2px' }}>
                  {selectedIncident.summary}
                </p>
              </div>

              <div>
                <strong style={{ fontSize: '0.8rem', color: 'var(--primary-accent)' }}>Sanitized Forensic Evidence (JSON):</strong>
                <pre style={{
                  marginTop: '4px',
                  background: 'rgba(5, 9, 21, 0.9)',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #D8D5CD',
                  fontSize: '0.78rem',
                  color: 'var(--primary-accent)',
                  overflowX: 'auto'
                }}>
                  {JSON.stringify(selectedIncident.details, null, 2)}
                </pre>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setSelectedIncident(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}











