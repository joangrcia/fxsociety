import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from './Button';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { label: 'Beranda', href: '/' },
  { label: 'Shop', href: '/shop' },
  { label: 'Cara Kerja', href: '/how-it-works' },
  { label: 'Tentang Kami', href: '/about' },
  { label: 'Bantuan', href: '/support' },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const navbarStyles = `
    fixed top-0 left-0 right-0 z-50
    transition-all duration-300
    ${isScrolled 
      ? 'bg-[#0a0a0f]/95 backdrop-blur-md shadow-lg border-b border-blue-500/10 shadow-[0_1px_0_rgba(59,130,246,0.08)]' 
      : 'bg-transparent'
    }
  `;

  return (
    <nav className={navbarStyles}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link 
            to="/" 
            className="text-xl md:text-2xl font-bold text-white hover:text-slate-200 transition-colors"
          >
            fx<span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-100 to-slate-400">society</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-medium
                    transition-all duration-200
                    ${isActive
                      ? 'text-white bg-white/10 shadow-[0_0_15px_rgba(59,130,246,0.08)] border border-blue-500/20'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                    }
                  `}
                >
                  {item.label}
                </Link>
              );
            })}
            
            {isAuthenticated && (
              <Link
                to="/member"
                className="px-4 py-2 rounded-lg text-sm font-bold text-white bg-white/5 border border-white/10 hover:bg-white/10 transition-all ml-2 flex items-center gap-2"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.5)]"></span>
                Area Member
              </Link>
            )}
          </div>

          {/* Desktop Login Button */}
          <div className="hidden md:block">
            {!isAuthenticated && (
              <Button variant="secondary" size="sm" href="/login">
                Masuk
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-zinc-400 hover:text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-[#0d0d14]/98 backdrop-blur-xl border-t border-white/8 mt-1 pb-6 pt-3 rounded-b-2xl shadow-2xl">
            <div className="flex flex-col gap-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`
                      px-4 py-3.5 rounded-xl text-base font-semibold
                      transition-all duration-200
                      ${isActive 
                        ? 'text-white bg-white/12 border border-blue-500/20'
                        : 'text-zinc-200 hover:text-white hover:bg-white/8'
                      }
                    `}
                  >
                    {item.label}
                  </Link>
                );
              })}
              
              {isAuthenticated && (
                <Link
                  to="/member"
                  className="px-4 py-3 rounded-lg text-base font-bold text-white bg-white/5 border border-white/10 transition-all duration-200 flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                  Area Member
                </Link>
              )}

              <div className="mt-3 px-2">
                {!isAuthenticated && (
                  <Button variant="secondary" size="md" href="/login" className="w-full">
                    Masuk
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
