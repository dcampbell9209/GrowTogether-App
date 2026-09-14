import { Database } from './database';

export type UserRole = 'student' | 'volunteer';
export type AdminActionType = 'PROMOTE' | 'DEMOTE' | 'ADMIN_MESSAGE' | 'CHAT_ARCHIVE';

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isAdmin: boolean;
  profileCompleted: boolean;
  volunteerProfileCompleted: boolean;
}

export interface GoogleAuthResponse {
  access_token: string;
  refresh_token?: string;
  id_token: string;
  expires_in: number;
  token_type: string;
}

export interface AuthSession {
  user: AuthUser;
  accessToken: string;
  refreshToken?: string;
  expiresAt: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials extends LoginCredentials {
  firstName: string;
  lastName: string;
}

export interface AuthError {
  message: string;
  code?: string;
  details?: any;
}

export interface AuthState {
  user: AuthUser | null;
  session: AuthSession | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: AuthError | null;
}

// Auth API response types
export interface AuthResponse {
  user: AuthUser | null;
  session: AuthSession | null;
  error: AuthError | null;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  error?: AuthError;
}

