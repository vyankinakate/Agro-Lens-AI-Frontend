import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProviders } from './contexts/AppContext';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import OfflineBanner from './components/OfflineBanner';
import EmergencyButton from './components/EmergencyButton';
import Onboarding from './pages/Onboarding';
import Detect from './pages/Detect';
import Dashboard from './pages/Dashboard';
import Community from './pages/Community';
import Resources from './pages/Resources';
import Chatbot from './pages/Chatbot';
import './index.css';

function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
      <Header />
      <OfflineBanner />
      <main className="pb-20 pt-16">
        {children}
      </main>
      <BottomNav />
      <EmergencyButton />
    </div>
  );
}

function App() {
  const [showOnboarding, setShowOnboarding] = useState(true);

  if (showOnboarding) {
    return (
      <AppProviders>
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
          <Onboarding onStart={() => setShowOnboarding(false)} />
        </div>
      </AppProviders>
    );
  }

  return (
    <AppProviders>
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Detect />} />
            <Route path="/detect" element={<Detect />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/chat" element={<Chatbot />} />
            <Route path="/community" element={<Community />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </AppProviders>
  );
}

export default App;
