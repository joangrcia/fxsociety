import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { fetchCurrentUser, type UserResponse } from '../lib/api';

interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  user: UserResponse | null;
  login: (token: string, email?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem('auth_token'));
  const [user, setUser] = useState<UserResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initial load: verify token and get user profile
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('auth_token');
      if (storedToken) {
        try {
          // If we have a token, fetch the user
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

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_email');
    setToken(null);
    setUser(null);
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
