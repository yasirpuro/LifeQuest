import { Navigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from './authContext';

interface AuthGuardProps {
  children: ReactNode;
  guestOnly?: boolean;
}

export default function AuthGuard({ children, guestOnly = false }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div style={{ padding: 24, color: '#fff' }}>Yükleniyor...</div>;
  }

  if (guestOnly && isAuthenticated) {
    return <Navigate to="/dashboard" replace state={{ from: location }} />;
  }

  if (!guestOnly && !isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
}
