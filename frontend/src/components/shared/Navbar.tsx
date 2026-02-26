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

  // Handle navbar scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const navbarStyles = `
    fixed top-0 left-0 right-0 z-50
    transition-all duration-300
    ${isScrolled 
      ? 'bg-[#0a0a0f]/95 backdrop-blur-md shadow-lg' 
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
            fx<span className="text-blue-500">society</span>
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
                      ? 'text-blue-400 bg-blue-500/10'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                    }
                  `}
                >
                  {item.label}
                </Link>
              );
            })}
            
            {/* Member Area Link (Visible if logged in) */}
            {isAuthenticated && (
              <Link
                to="/member"
                className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20 ml-2"
              >
                Area Member
              </Link>
            )}
          </div>

          {/* Desktop Login Button (Hidden if logged in) */}
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
          <div className="md:hidden pb-4 border-t border-white/5 mt-2 pt-4">
            <div className="flex flex-col gap-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`
                      px-4 py-3 rounded-lg text-base font-medium
                      transition-all duration-200
                      ${isActive 
                        ? 'text-blue-400 bg-blue-500/10'
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
                  className="px-4 py-3 rounded-lg text-base font-bold text-blue-400 bg-blue-500/10 transition-all duration-200"
                >
                  Area Member
                </Link>
              )}

              <div className="mt-4 px-4">
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
