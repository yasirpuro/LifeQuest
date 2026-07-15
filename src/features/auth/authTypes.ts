import type { Session } from '@supabase/supabase-js';

export interface AuthUser {
  id: string;
  email: string;
  createdAt?: string;
}

export interface AuthState {
  user: AuthUser | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  email: string;
  password: string;
  username?: string;
}

export interface AuthResult {
  success: boolean;
  user?: AuthUser | null;
  error?: string;
}

export interface AuthValidationError {
  field: string;
  message: string;
}
