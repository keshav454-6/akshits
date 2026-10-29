import React, { useState, useEffect } from 'react';
import { Menu, Shield, RefreshCw, Zap, Bell, CheckCircle2, AlertCircle } from 'lucide-react';

export default function Navbar({ currentTab, setTab, setIsOpen, searchGlobal, setSearchGlobal }) {
  const [backendStatus, setBackendStatus] = useState('checking');

  const checkHealth = async () => {
    try {
      const res = await fetch('/api/health');
      if (res.ok) {
        setBackendStatus('online');
      } else {
        setBackendStatus('offline');
      }
    } catch {
      setBackendStatus('offline');
    }
  };

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const getTabTitle = () => {
    switch (currentTab) {
      case 'dashboard': return 'Threat Intelligence Overview';
      case 'scam': return 'Scam & Fake Customer-Care Detector';
      case 'payment': return 'Suspicious Payment & UPI Request Shield';
      case 'impersonation': return 'Multi-Entity Impersonation Detector';
      case 'url': return 'Fake Website Risk Analyzer & Blocklist';
      case 'leak': return 'Leak Lock — Password & API Key Scanner';
      case 'permission': return 'Permission Lens — App & Sensor Auditor';
      case 'voice': return 'Voice-Clone Scam Protection Guard';
      case 'session': return 'Account Hijacking & Session Anomaly Lab';
      case 'incidents': return 'Unified Security Incident Hub';
      case 'demo': return 'Hackathon Interactive Demo Center';
      default: return 'CyberShield One';
    }
  };

  return (
    <header style={{
      height: '70px',
      borderBottom: '1px solid #D8D5CD',
      background: '#FFFFFF',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 28px',
      position: 'sticky',
      top: 0,
      zIndex: 30,
      boxShadow: '0 1px 4px rgba(0, 0, 0, 0.04)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <button
          onClick={() => setIsOpen(true)}
          style={{
            display: window.innerWidth > 900 ? 'none' : 'flex',
            background: '#F5F3ED',
            padding: '8px',
            borderRadius: '10px',
            color: '#3D4F45',
            border: '1px solid #D8D5CD'
          }}
        >
          <Menu size={20} />
        </button>

        <div>
          <h1 style={{
            fontSize: '1.15rem',
            fontWeight: '800',
            color: '#1A2620',
            letterSpacing: '-0.01em',
            fontFamily: "'Space Grotesk', sans-serif"
          }}>
            {getTabTitle()}
          </h1>
          <p style={{ fontSize: '0.74rem', color: '#3D4F45', fontWeight: '500' }}>
            One Platform. Multiple Threats. One Smarter Defence.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Backend Status indicator */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: backendStatus === 'online' ? 'rgba(33, 76, 58, 0.06)' : 'rgba(183, 74, 74, 0.08)',
          border: `1px solid ${backendStatus === 'online' ? 'rgba(46, 139, 87, 0.25)' : 'rgba(183, 74, 74, 0.25)'}`,
          padding: '5px 12px',
          borderRadius: '20px',
          fontSize: '0.75rem',
          fontWeight: '600'
        }}>
          <span style={{
            width: '7px',
            height: '7px',
            borderRadius: '50%',
            background: backendStatus === 'online' ? '#2E8B57' : '#B74A4A'
          }} />
          <span style={{ color: backendStatus === 'online' ? '#2E8B57' : '#B74A4A' }}>
            {backendStatus === 'online' ? 'API Engine Active' : 'Connecting API...'}
          </span>
        </div>

        {/* Hackathon Try Demo button */}
        <button
          onClick={() => setTab('demo')}
          className="btn-primary"
          style={{ padding: '7px 14px', fontSize: '0.8rem' }}
        >
          <Zap size={14} />
          <span>Try Demo</span>
        </button>
      </div>
    </header>
  );
}







