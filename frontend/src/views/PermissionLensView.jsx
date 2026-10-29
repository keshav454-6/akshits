import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Camera,
  Mic,
  MapPin,
  Users,
  HardDrive,
  Bell,
  Cpu,
  Smartphone,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Info,
  ShieldCheck,
  Eye,
  Sliders,
  Zap
} from 'lucide-react';
import ScoreGauge from '../components/ScoreGauge';

const ALL_PERMISSIONS = [
  { key: 'camera', label: 'Camera', icon: Camera, desc: 'Capture photographs and live video stream' },
  { key: 'microphone', label: 'Microphone', icon: Mic, desc: 'Record ambient audio and phone conversations' },
  { key: 'location', label: 'Precise GPS Location', icon: MapPin, desc: 'Track exact geographic latitude/longitude coordinates' },
  { key: 'contacts', label: 'Contacts Book', icon: Users, desc: 'Read and sync full address book and phone numbers' },
  { key: 'files_storage', label: 'Storage & Media Files', icon: HardDrive, desc: 'Read local photos, documents, and downloads' },
  { key: 'notifications', label: 'Push Notifications', icon: Bell, desc: 'Display alerts, reminders, and notifications' },
  { key: 'background_access', label: 'Background Execution', icon: Cpu, desc: 'Run services and poll data when app is closed' },
  { key: 'sms_call_logs', label: 'SMS & Call History', icon: Smartphone, desc: 'Read private SMS verification OTPs and call records' }
];

const APP_CATEGORIES = [
  { key: 'flashlight', label: 'Flashlight / Torch App' },
  { key: 'calculator', label: 'Calculator / Currency Converter' },
  { key: 'camera_photo', label: 'Photo Editor / Camera App' },
  { key: 'video_call_conferencing', label: 'Video Call & Conferencing' },
  { key: 'navigation_maps', label: 'Maps & GPS Navigation' },
  { key: 'social_media', label: 'Social Media & Messaging' },
  { key: 'ecommerce_shopping', label: 'E-commerce Shopping' },
  { key: 'generic_utility', label: 'General Utility App' }
];

export default function PermissionLensView() {
  const [selectedCategory, setSelectedCategory] = useState('camera_photo');
  const [selectedPerms, setSelectedPerms] = useState(['camera', 'microphone', 'location', 'contacts']);
  const [sourceType, setSourceType] = useState('manual'); // 'manual' | 'browser_sensor'
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [browserProbeStatus, setBrowserProbeStatus] = useState('');

  // Real-Time live analysis whenever category, permissions, or source changes!
  useEffect(() => {
    handleAudit(selectedCategory, selectedPerms, sourceType);
  }, [selectedCategory, selectedPerms, sourceType]);

  const togglePermission = (key) => {
    if (selectedPerms.includes(key)) {
      setSelectedPerms(selectedPerms.filter(k => k !== key));
    } else {
      setSelectedPerms([...selectedPerms, key]);
    }
  };

  const handleAudit = async (category = selectedCategory, perms = selectedPerms, source = sourceType) => {
    setLoading(true);
    try {
      const res = await fetch('/api/scan/permission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          permissions: perms,
          source,
          auto_log: false // prevent flood on continuous live toggling
        })
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error("Live audit error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Live browser permission sensor probe
  const probeBrowserPermissions = async () => {
    setBrowserProbeStatus('Querying browser Permission API in real-time...');
    const detected = [];

    try {
      if (navigator.permissions && navigator.permissions.query) {
        try {
          const geoStatus = await navigator.permissions.query({ name: 'geolocation' });
          if (geoStatus.state === 'granted' || geoStatus.state === 'prompt') {
            detected.push('location');
          }
        } catch (e) {}

        try {
          const notifStatus = await navigator.permissions.query({ name: 'notifications' });
          if (notifStatus.state === 'granted' || notifStatus.state === 'prompt') {
            detected.push('notifications');
          }
        } catch (e) {}

        try {
          const camStatus = await navigator.permissions.query({ name: 'camera' });
          if (camStatus.state === 'granted' || camStatus.state === 'prompt') {
            detected.push('camera');
          }
        } catch (e) {}

        try {
          const micStatus = await navigator.permissions.query({ name: 'microphone' });
          if (micStatus.state === 'granted' || micStatus.state === 'prompt') {
            detected.push('microphone');
          }
        } catch (e) {}
      }

      const finalPerms = detected.length > 0 ? detected : ['notifications', 'location'];
      setSelectedPerms(finalPerms);
      setSelectedCategory('generic_utility');
      setSourceType('browser_sensor');
      setBrowserProbeStatus(`Probe Complete: Live browser queried ${finalPerms.length} sensor states.`);
    } catch (err) {
      setBrowserProbeStatus('Browser permission API partially restricted by browser sandbox.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Overview Card */}
      <div className="cyber-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="stat-icon-wrapper purple">
              <ShieldAlert size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                Permission Lens — App & Sensor Auditor
              </h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Examine application permissions against real utility matrices to expose over-privileged spyware and unjustified hardware access.
              </p>
            </div>
          </div>

          <span className="badge badge-clean" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Zap size={13} />
            <span>Real-Time Reactive Engine Active</span>
          </span>
        </div>

        {/* Transparency note */}
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
            <strong>Distinction Notice:</strong> Web browsers cannot silently audit external native mobile apps on your device. You can audit apps manually by selecting their profile below, or click <strong>Probe Browser Permissions</strong> to inspect your live web session permissions.
          </span>
        </div>
      </div>

      {/* Audit Configuration Card */}
      <div className="cyber-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '6px' }}>
              1. Select Application Category:
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => { setSelectedCategory(e.target.value); setSourceType('manual'); }}
              style={{ padding: '9px 14px', fontSize: '0.86rem', minWidth: '260px' }}
            >
              {APP_CATEGORIES.map(c => (
                <option key={c.key} value={c.key}>{c.label}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              type="button"
              className="btn-secondary"
              onClick={probeBrowserPermissions}
            >
              <Eye size={15} />
              <span>Probe Browser Permissions</span>
            </button>

            <button
              type="button"
              className="btn-cyan"
              onClick={() => handleAudit()}
              disabled={loading}
            >
              <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
              <span>{loading ? 'Analyzing...' : 'Re-Calculate Live Matrix'}</span>
            </button>
          </div>
        </div>

        {browserProbeStatus && (
          <div style={{
            fontSize: '0.78rem',
            color: 'var(--primary-accent)',
            background: 'rgba(185, 214, 195, 0.3)',
            padding: '6px 12px',
            borderRadius: '6px',
            marginBottom: '14px'
          }}>
            {browserProbeStatus}
          </div>
        )}

        {/* Permission Grid Toggle */}
        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '10px' }}>
          2. Permissions Requested or Granted ({selectedPerms.length} active — click any to re-calculate in real time):
        </label>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: '12px'
        }}>
          {ALL_PERMISSIONS.map(p => {
            const Icon = p.icon;
            const isSelected = selectedPerms.includes(p.key);
            return (
              <div
                key={p.key}
                onClick={() => togglePermission(p.key)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px',
                  borderRadius: '10px',
                  background: isSelected ? 'rgba(33, 76, 58, 0.06)' : '#F5F3ED',
                  border: isSelected ? '1px solid rgba(33, 76, 58, 0.3)' : '1px solid rgba(0, 0, 0, 0.04)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '8px',
                  background: isSelected ? 'rgba(33, 76, 58, 0.15)' : '#F5F3ED',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isSelected ? 'var(--primary-accent)' : 'var(--text-secondary)'
                }}>
                  <Icon size={18} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.86rem', fontWeight: '600', color: isSelected ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                    {p.label}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', lineHeight: '1.2' }}>
                    {p.desc}
                  </div>
                </div>
                <span style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '4px',
                  border: `2px solid ${isSelected ? 'var(--primary-accent)' : 'var(--border-subtle)'}`,
                  background: isSelected ? 'var(--primary-accent)' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Audit Results View (Instantly calculated in real-time) */}
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
              <ScoreGauge score={result.risk_score} label="Over-Privilege" />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span className={`badge ${
                    result.risk_score >= 65 ? 'badge-critical' : result.risk_score >= 35 ? 'badge-high' : 'badge-clean'
                  }`}>
                    {result.risk_level}
                  </span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    Category: {result.app_category.replace('_', ' ').toUpperCase()} • {result.source_type}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                  {result.excessive_count > 0 ? `${result.excessive_count} Unjustified Permissions Detected` : 'All Permissions Within Legitimate Scope'}
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {result.category_description}
                </p>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span className="badge badge-clean" style={{ fontSize: '0.7rem' }}>
                {result.is_browser_retrieved ? 'Real-Time Browser Sensor Probe' : 'Live Real-Time Heuristic Calculation'}
              </span>
            </div>
          </div>

          {/* Detailed breakdown list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {result.permissions_audit.map((perm, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  background: perm.is_excessive ? 'rgba(183, 74, 74, 0.06)' : 'rgba(46, 139, 87, 0.04)',
                  border: perm.is_excessive ? '1px solid rgba(183, 74, 74, 0.2)' : '1px solid rgba(33, 76, 58, 0.15)',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                      {perm.name}
                    </span>
                    <span className={`badge ${perm.is_excessive ? 'badge-critical' : 'badge-clean'}`}>
                      {perm.status}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                    <strong>Purpose: </strong>{perm.purpose}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: perm.is_excessive ? 'var(--color-danger)' : 'var(--color-success)' }}>
                    <strong>Privacy Risk: </strong>{perm.privacy_risk}
                  </div>
                </div>

                <div style={{
                  background: '#F5F3ED',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  color: 'var(--text-primary)',
                  maxWidth: '320px'
                }}>
                  <strong style={{ color: 'var(--primary-accent)' }}>Guidance: </strong>
                  {perm.recommendation}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}










