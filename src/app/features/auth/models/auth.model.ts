/**
 * Authentication request payload.
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Authenticated user.
 */
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

/**
 * Login response returned by POST /auth/login.
 */
export interface LoginResponse {
  user: AuthUser;
  token: string;
}

/**
 * Client-side authentication state.
 */
export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
}
