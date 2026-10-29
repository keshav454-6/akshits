import React, { useState } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

// Views
import DashboardView from './views/DashboardView';
import ScamDetectorView from './views/ScamDetectorView';
import PaymentDetectorView from './views/PaymentDetectorView';
import ImpersonationView from './views/ImpersonationView';
import UrlAnalyzerView from './views/UrlAnalyzerView';
import LeakLockView from './views/LeakLockView';
import PermissionLensView from './views/PermissionLensView';
import VoiceCloneView from './views/VoiceCloneView';
import SessionLabView from './views/SessionLabView';
import IncidentHubView from './views/IncidentHubView';
import DemoCenterView from './views/DemoCenterView';

export default function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchGlobal, setSearchGlobal] = useState('');

  const renderActiveView = () => {
    switch (currentTab) {
      case 'dashboard':
        return <DashboardView setTab={setCurrentTab} />;
      case 'scam':
        return <ScamDetectorView />;
      case 'payment':
        return <PaymentDetectorView />;
      case 'impersonation':
        return <ImpersonationView />;
      case 'url':
        return <UrlAnalyzerView />;
      case 'leak':
        return <LeakLockView />;
      case 'permission':
        return <PermissionLensView />;
      case 'voice':
        return <VoiceCloneView />;
      case 'session':
        return <SessionLabView />;
      case 'incidents':
        return <IncidentHubView />;
      case 'demo':
        return <DemoCenterView setTab={setCurrentTab} />;
      default:
        return <DashboardView setTab={setCurrentTab} />;
    }
  };

  return (
    <div className="app-container">
      {/* Responsive Navigation Sidebar */}
      <Sidebar
        currentTab={currentTab}
        setTab={setCurrentTab}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      {/* Main Content Area */}
      <div className="main-content">
        <Navbar
          currentTab={currentTab}
          setTab={setCurrentTab}
          setIsOpen={setIsSidebarOpen}
          searchGlobal={searchGlobal}
          setSearchGlobal={setSearchGlobal}
        />

        <main className="content-body">
          {renderActiveView()}
        </main>
      </div>
    </div>
  );
}










