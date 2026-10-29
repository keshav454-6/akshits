import React from 'react';
import {
  LayoutDashboard,
  MessageSquareWarning,
  CreditCard,
  UserX,
  Globe,
  KeyRound,
  ShieldAlert,
  Mic,
  Activity,
  ShieldCheck,
  Sparkles,
  Shield,
  X
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Main Dashboard', icon: LayoutDashboard },
  { id: 'scam', label: 'Scam & Care Detector', icon: MessageSquareWarning },
  { id: 'payment', label: 'Payment Request Shield', icon: CreditCard },
  { id: 'impersonation', label: 'Impersonation Detector', icon: UserX },
  { id: 'url', label: 'Fake Website & Blocklist', icon: Globe },
  { id: 'leak', label: 'Leak Lock (Keys & Secrets)', icon: KeyRound },
  { id: 'permission', label: 'Permission Lens', icon: ShieldAlert },
  { id: 'voice', label: 'Voice-Clone Guard', icon: Mic },
  { id: 'session', label: 'Session Anomaly Lab', icon: Activity },
  { id: 'incidents', label: 'Unified Incident Hub', icon: ShieldCheck },
  { id: 'demo', label: 'Try Demo Mode', icon: Sparkles, badge: 'Live Presets' },
];

export default function Sidebar({ currentTab, setTab, isOpen, setIsOpen }) {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(38, 51, 44, 0.3)',
            backdropFilter: 'blur(4px)',
            zIndex: 40
          }}
        />
      )}

      <aside
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          width: '260px',
          background: '#EAE7DF',
          borderRight: '1px solid #D8D5CD',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 50,
          transition: 'transform 0.3s ease',
          transform: isOpen || window.innerWidth > 900 ? 'translateX(0)' : 'translateX(-100%)'
        }}
      >
        {/* Brand Header */}
        <div style={{
          padding: '22px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #D8D5CD'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '12px',
              background: '#214C3A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(33, 76, 58, 0.25)'
            }}>
              <Shield size={22} color="#FFFFFF" strokeWidth={2.5} />
            </div>
            <div>
              <div style={{
                fontSize: '1.05rem',
                fontWeight: '800',
                letterSpacing: '-0.02em',
                color: '#1A2620',
                fontFamily: "'Space Grotesk', sans-serif"
              }}>
                CyberShield One
              </div>
              <div style={{ fontSize: '0.68rem', color: '#3D4F45', fontWeight: '600' }}>
                MNIT Hackathon Edition
              </div>
            </div>
          </div>

          <button 
            onClick={() => setIsOpen(false)}
            style={{
              display: window.innerWidth > 900 ? 'none' : 'flex',
              background: 'transparent',
              color: '#3D4F45',
              padding: '4px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation list */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '14px 10px',
          display: 'flex',
          flexDirection: 'column',
          gap: '2px'
        }}>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setTab(item.id);
                  if (window.innerWidth <= 900) setIsOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  background: isActive ? '#FFFFFF' : 'transparent',
                  border: isActive ? '1px solid #D8D5CD' : '1px solid transparent',
                  color: isActive ? '#1A2620' : '#3D4F45',
                  fontWeight: isActive ? '700' : '500',
                  fontSize: '0.86rem',
                  textAlign: 'left',
                  boxShadow: isActive ? '0 2px 8px rgba(0, 0, 0, 0.06)' : 'none',
                  position: 'relative',
                  transition: 'all 180ms ease'
                }}
              >
                <Icon 
                  size={18} 
                  color={isActive ? '#214C3A' : '#3D4F45'} 
                  strokeWidth={isActive ? 2.2 : 1.8}
                />
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.badge && (
                  <span style={{
                    fontSize: '0.65rem',
                    background: 'rgba(33, 76, 58, 0.15)',
                    color: '#214C3A',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontWeight: '700',
                    border: '1px solid rgba(33, 76, 58, 0.2)'
                  }}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Sidebar Footer */}
        <div style={{
          padding: '16px',
          borderTop: '1px solid #D8D5CD',
          background: '#E4E1D9'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#2E8B57',
              boxShadow: '0 0 6px rgba(46, 139, 87, 0.4)'
            }} />
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#1A2620' }}>
              Shield Defense Active
            </span>
          </div>
          <div style={{ fontSize: '0.68rem', color: '#3D4F45' }}>
            Zero-Knowledge Local Engines
          </div>
        </div>
      </aside>
    </>
  );
}







