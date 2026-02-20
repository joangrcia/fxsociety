import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { fetchCurrentUser, onAuthError, type UserResponse } from '../lib/api';

interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  user: UserResponse | null;
  login: (token: string, email?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ============================================================================
// JWT Token Utilities
// ============================================================================

/**
 * Decode JWT payload without verification.
 * Used for client-side expiry checking.
 */
function decodeJwtPayload(token: string): { exp?: number; sub?: string } | null {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

/**
 * Check if token is expired or will expire soon (within buffer).
 * @param token JWT token
 * @param bufferSeconds Seconds before expiry to consider as "expired" (default: 60)
 */
function isTokenExpired(token: string, bufferSeconds = 60): boolean {
  const payload = decodeJwtPayload(token);
  if (!payload?.exp) return true; // If no exp claim, treat as expired
  
  const now = Math.floor(Date.now() / 1000);
  return payload.exp - bufferSeconds <= now;
}

/**
 * Get seconds until token expires.
 */
function getTokenExpiresIn(token: string): number {
  const payload = decodeJwtPayload(token);
  if (!payload?.exp) return 0;
  
  const now = Math.floor(Date.now() / 1000);
  return Math.max(0, payload.exp - now);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem('auth_token'));
  const [user, setUser] = useState<UserResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Logout function - wrapped in useCallback to avoid effect dependencies
  const logout = useCallback(() => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_email');
    setToken(null);
    setUser(null);
  }, []);

  // Subscribe to auth errors (401 from fetchWithAuth)
  useEffect(() => {
    const unsubscribe = onAuthError(() => {
      console.log('Auth error received - logging out');
      logout();
    });
    return unsubscribe;
  }, [logout]);

  // Token expiry checker - proactively logout before API calls fail
  useEffect(() => {
    if (!token) return;

    // Check if token is already expired
    if (isTokenExpired(token)) {
      console.log('Token expired on check - logging out');
      logout();
      return;
    }

    // Set timeout to logout just before token expires
    const expiresIn = getTokenExpiresIn(token);
    const logoutBuffer = 30; // Logout 30 seconds before expiry
    const timeoutMs = Math.max(0, (expiresIn - logoutBuffer) * 1000);

    if (timeoutMs > 0 && timeoutMs < 24 * 60 * 60 * 1000) { // Only set if < 24h
      const timeoutId = setTimeout(() => {
        console.log('Token about to expire - logging out proactively');
        logout();
      }, timeoutMs);

      return () => clearTimeout(timeoutId);
    }
  }, [token, logout]);

  // Initial load: verify token and get user profile
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('auth_token');
      if (storedToken) {
        // Check if token is expired before making API call
        if (isTokenExpired(storedToken)) {
          console.log('Stored token expired - clearing');
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user_email');
          setToken(null);
          setUser(null);
          setIsLoading(false);
          return;
        }

        try {
          // If we have a valid token, fetch the user
          const userData = await fetchCurrentUser(storedToken);
          setToken(storedToken);
          setUser(userData);
        } catch (error) {
          console.error('Failed to restore session:', error);
          // Token invalid/expired
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user_email');
          setToken(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (newToken: string, email?: string) => {
    setIsLoading(true);
    localStorage.setItem('auth_token', newToken);
    if (email) localStorage.setItem('user_email', email);
    
    setToken(newToken);
    
    try {
      const userData = await fetchCurrentUser(newToken);
      setUser(userData);
    } catch (error) {
      console.error('Login profile fetch failed', error);
      // Still authenticated with token, but maybe failed to get full profile
      // In strict mode, we might want to fail login here.
      // For now, let's allow it but user is null (MemberLayout checks user, so this is important)
      
      // Fallback: create minimal user object if API fails but token is valid
      // This prevents the redirect loop if /me fails
      if (email) {
        setUser({ id: 0, email, is_active: true, created_at: '', full_name: '' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      token, 
      isAuthenticated: !!token, 
      isLoading,
      user,
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
