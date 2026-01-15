import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
// import { Button } from '../shared';

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
  actions?: React.ReactNode;
}

export function AdminLayout({ children, title, actions }: AdminLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/login');
  };

  const NavItem = ({ to, icon, label }: { to: string; icon: any; label: string }) => {
    const isActive = location.pathname.startsWith(to);
    return (
      <Link
        to={to}
        className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors rounded-lg mb-1 ${
          isActive
            ? 'bg-emerald-500/10 text-emerald-400'
            : 'text-zinc-400 hover:text-white hover:bg-white/5'
        }`}
      >
        {icon}
        {label}
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex">
      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-[#14141a] border-r border-white/5 transform transition-transform duration-300 md:relative md:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <span className="text-xl font-bold text-white">
              fx<span className="text-emerald-500">society</span>
              <span className="text-xs text-zinc-500 ml-2">CRM</span>
            </span>
            <button 
              className="md:hidden text-zinc-400"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              ✕
            </button>
          </div>

          <nav className="flex-1 space-y-1">
            <NavItem 
              to="/dashboard" 
              label="Overview" 
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>}
            />
            <NavItem 
              to="/customers" 
              label="Customers" 
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
            />
            <NavItem 
              to="/orders" 
              label="Orders" 
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>}
            />
            <NavItem 
              to="/tickets" 
              label="Tickets" 
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>}
            />
            <NavItem 
              to="/products" 
              label="Products" 
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>}
            />
          </nav>

          <div className="pt-6 border-t border-white/5">
            <button 
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-zinc-400 hover:text-white transition-colors w-full rounded-lg hover:bg-white/5"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-white/5 bg-[#14141a] px-4 md:px-8 flex items-center justify-between md:hidden">
          <span className="font-bold text-white">fxsociety Admin</span>
          <button onClick={() => setIsMobileMenuOpen(true)} className="text-zinc-400">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
        </header>

        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            {(title || actions) && (
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                {title && <h1 className="text-2xl font-bold text-white">{title}</h1>}
                {actions && <div className="flex items-center gap-3">{actions}</div>}
              </div>
            )}
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
