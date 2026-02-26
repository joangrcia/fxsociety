import { Outlet, Navigate } from 'react-router-dom';
import { MemberSidebar } from './MemberSidebar';
import { useAuth } from '../../context/AuthContext';

export function MemberLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    // Show loading state (or null) while verifying session
    return <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-slate-400/30 border-t-slate-400 rounded-full animate-spin" />
    </div>;
  }

  // Protect route
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-[#0a0a0f] text-white font-sans">
      <MemberSidebar />
      
      <main className="flex-1 overflow-x-hidden overflow-y-auto">
        {/* Top Mobile Bar (Hidden on Desktop for now) */}
        <div className="md:hidden p-4 border-b border-white/5 flex items-center justify-between bg-[#0f0f16]">
          <span className="font-bold">FXSociety Member</span>
          <button className="text-zinc-400">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>

        {/* Page Content */}
        <div className="p-6 md:p-10 max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
