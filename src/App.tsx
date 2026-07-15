import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, lazy, Suspense } from 'react';
import { AuthProvider } from './features/auth/authContext';
import { SkillProvider } from './features/skills/skillContext';
import { QuestProvider } from './features/quests/questContext';
import { SocialProvider } from './features/social/socialContext';
import { SettingsProvider } from './features/settings/settingsContext';
import { AppProvider } from './context/AppContext';
import { useAuth } from './features/auth/authContext';
import { useQuest } from './features/quests/questContext';
import AuthGuard from './features/auth/authGuard';
import ErrorBoundary from './components/ErrorBoundary';
import { migrateToSkillEngine } from './utils/migrateToSkillEngine';
import { useProductEngines } from './hooks/useProductEngines';
import { initializeFirebase } from './core/config/firebaseConfig';
import { reportEvent, reportError } from './core/telemetry/telemetryService';

// Lazy load pages for code splitting
const Onboarding = lazy(() => import('./pages/Onboarding'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Quests = lazy(() => import('./pages/Quests'));
const Social = lazy(() => import('./pages/Social'));
const Profile = lazy(() => import('./pages/Profile'));
const PremiumPaywall = lazy(() => import('./pages/PremiumPaywall'));

// Lazy load heavy components
const PremiumModal = lazy(() => import('./components/PremiumModal'));
const DebugPanel = lazy(() => import('./components/DebugPanel'));

// Loading component for lazy loaded routes
function PageLoader() {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      background: '#0d0d1a',
      color: '#6C63FF'
    }}>
      <div style={{ fontSize: 24 }}>Yükleniyor...</div>
    </div>
  );
}

function AppRoutes() {
  const { onboardingComplete } = useQuest();
  const { isAuthenticated, userNeedsOnboarding } = useAuth();
  useProductEngines(); // Execute periodic game loops and decays

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Root Route */}
        <Route
          path="/"
          element={
            isAuthenticated
              ? userNeedsOnboarding
                ? <Navigate to="/onboarding" replace />
                : <Navigate to="/dashboard" replace />
              : onboardingComplete
              ? <Navigate to="/dashboard" replace />
              : <Onboarding />
          }
        />

        {/* Onboarding — accessible to both guests and newly-registered users */}
        <Route path="/onboarding" element={<Onboarding />} />
        {/* Auth Pages - Only accessible when NOT logged in */}
        <Route
          path="/login"
          element={
            <AuthGuard guestOnly>
              <Login />
            </AuthGuard>
          }
        />
        
        <Route
          path="/signup"
          element={
            <AuthGuard guestOnly>
              <Signup />
            </AuthGuard>
          }
        />
        
        <Route
          path="/reset-password"
          element={
            <AuthGuard guestOnly>
              <ResetPassword />
            </AuthGuard>
          }
        />

        {/* Protected Routes - Login required */}
        <Route
          path="/dashboard"
          element={
            <AuthGuard>
              <Dashboard />
            </AuthGuard>
          }
        />
        
        <Route
          path="/quests"
          element={
            <AuthGuard>
              <Quests />
            </AuthGuard>
          }
        />
        
        <Route
          path="/social"
          element={
            <AuthGuard>
              <Social />
            </AuthGuard>
          }
        />
        
        <Route
          path="/profile"
          element={
            <AuthGuard>
              <Profile />
            </AuthGuard>
          }
        />

        <Route
          path="/premium"
          element={
            <AuthGuard>
              <PremiumPaywall />
            </AuthGuard>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Suspense fallback={null}>
        <PremiumModal />
        {import.meta.env.DEV && <DebugPanel />}
      </Suspense>
    </Suspense>
  );
}

export default function App() {
  // Ensure migration runs on startup once
  useEffect(() => {
    try {
      migrateToSkillEngine();
      reportEvent('app_started', { path: window.location.pathname });

      // Initialize Firebase
      initializeFirebase();
      
      // Notification initialization will be handled by product engines
      // when skill engine determines a notification is needed
    } catch (error) {
      console.error('[App] Firebase initialization error:', error);
      reportError(error as Error, { stage: 'app_boot' });
    }
  }, []);

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AppProvider>
          <AuthProvider>
            <SkillProvider>
              <QuestProvider>
                <SocialProvider>
                  <SettingsProvider>
                    <AppRoutes />
                  </SettingsProvider>
                </SocialProvider>
              </QuestProvider>
            </SkillProvider>
          </AuthProvider>
        </AppProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
