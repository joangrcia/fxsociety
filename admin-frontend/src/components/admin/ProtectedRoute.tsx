import { Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect, type ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
}

/**
 * Router-level auth guard for admin routes.
 * Checks for valid admin_token in localStorage.
 * Redirects to /login if not authenticated.
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    
    if (token) {
      // Basic token presence check
      // In production, could verify token expiry here
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
    
    setIsChecking(false);
  }, [location.pathname]);

  // Show loading state briefly while checking auth
  if (isChecking) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login, preserving intended destination
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
