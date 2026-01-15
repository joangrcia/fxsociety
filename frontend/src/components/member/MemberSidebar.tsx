import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface SidebarItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

function SidebarItem({ to, icon, label, active }: SidebarItemProps) {
  return (
    <Link
      to={to}
      className={`
        flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
        ${active 
          ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' 
          : 'text-zinc-400 hover:text-white hover:bg-white/5'
        }
      `}
    >
      <div className={`
        ${active ? 'text-orange-400' : 'text-zinc-500 group-hover:text-white'} 
        transition-colors
      `}>
        {icon}
      </div>
      <span className="font-medium text-sm">{label}</span>
    </Link>
  );
}

export function MemberSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="w-64 bg-[#0f0f16] border-r border-white/5 flex flex-col h-screen sticky top-0">
      {/* Logo Area */}
      <div className="p-6 border-b border-white/5">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white font-bold text-lg">
            F
          </div>
          <span className="text-xl font-bold text-white tracking-tight">
            FXSociety
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        <div className="px-4 mb-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
          Library
        </div>
        <SidebarItem
          to="/member/digital"
          active={isActive('/member/digital') || isActive('/member')}
          label="Produk Digital"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          }
        />
        <SidebarItem
          to="/member/merchandise"
          active={isActive('/member/merchandise')}
          label="Merchandise"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          }
        />

        <div className="px-4 mt-8 mb-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
          Support
        </div>
        <SidebarItem
          to="/member/support"
          active={isActive('/member/support')}
          label="Pusat Bantuan"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          }
        />

        <div className="px-4 mt-8 mb-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
          Settings
        </div>
        <SidebarItem
          to="/member/profile"
          active={isActive('/member/profile')}
          label="Akun Saya"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          }
        />
      </div>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-white/5">
        <button 
          onClick={() => {
            logout();
            navigate('/login');
          }}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-zinc-400 hover:bg-white/5 hover:text-white transition-all"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className="font-medium text-sm">Keluar</span>
        </button>
      </div>
    </aside>
  );
}
