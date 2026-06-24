import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { AppProvider } from './context/AppContext';
import { useApp } from './hooks/useApp';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Quests from './pages/Quests';
import Social from './pages/Social';
import Profile from './pages/Profile';
import PremiumModal from './components/PremiumModal';
import { migrateToSkillEngine } from './utils/migrateToSkillEngine';

function AppRoutes() {
  const { onboardingComplete } = useApp();
  
  // Run migration on app load
  useEffect(() => {
    migrateToSkillEngine();
  }, []);

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            onboardingComplete
              ? <Navigate to="/dashboard" replace />
              : <Onboarding />
          }
        />
        <Route
          path="/dashboard"
          element={onboardingComplete ? <Dashboard /> : <Navigate to="/" replace />}
        />
        <Route
          path="/quests"
          element={onboardingComplete ? <Quests /> : <Navigate to="/" replace />}
        />
        <Route
          path="/social"
          element={onboardingComplete ? <Social /> : <Navigate to="/" replace />}
        />
        <Route
          path="/profile"
          element={onboardingComplete ? <Profile /> : <Navigate to="/" replace />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <PremiumModal />
    </>
  );
}

export default function App() {
  // Ensure migration runs on startup
  useEffect(() => {
    migrateToSkillEngine();
  }, []);

  return (
    <BrowserRouter>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </BrowserRouter>
  );
}
