import { useState, useEffect, type FormEvent } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { login as apiLogin } from '../lib/api';
import { useAuth } from '../context/AuthContext';

type LoginLocationState = { from?: string; openOrder?: boolean };

function getSafeRedirectTarget(from: unknown): string {
  if (typeof from !== 'string') return '/member';
  if (!from.startsWith('/')) return '/member';
  if (from.startsWith('//')) return '/member';
  return from;
}

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/member', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiLogin(email, password);
      
      // Use AuthContext login (handles token storage + user fetch)
      await login(response.access_token, email);
      
      const routeState = location.state as LoginLocationState | null;
      const redirectTo = routeState?.from ? getSafeRedirectTarget(routeState.from) : '/member';
      const shouldOpenOrder = routeState?.openOrder === true;

      navigate(redirectTo, {
        replace: true,
        state: shouldOpenOrder ? { openOrder: true } : null,
      });
    } catch (err) {
      console.error('Login failed:', err);
      // Gentle error message
      setError('Sepertinya ada yang salah, yuk coba lagi');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen relative flex items-center justify-center px-4 bg-[#0a0a0f]">
      {/* Background Ambient Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/6 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-400/5 rounded-full blur-[100px]" />
      </div>

      <div className="w-full max-w-[420px] relative z-10 animate-fade-in-up">
        {/* Header Section */}
        <div className="text-center mb-8">
          <Link 
            to="/" 
            className="inline-block text-2xl font-bold text-white mb-8 tracking-tight opacity-90 hover:opacity-100 transition-opacity"
          >
            fx<span className="text-slate-400 font-normal">society</span>
          </Link>
          <h1 className="text-3xl md:text-4xl font-light tracking-wide bg-gradient-to-r from-slate-100 via-white to-slate-400 bg-clip-text text-transparent mb-3">
            Selamat Datang Kembali
          </h1>
          <p className="text-zinc-400 text-sm font-light tracking-wide leading-relaxed">
            Lanjutkan pembelajaran trading Anda.
          </p>
        </div>

        {/* Floating Container */}
        <div className="bg-[#14141a] border border-white/5 rounded-2xl p-8 shadow-2xl hover:border-white/10 transition-all">
          
          {/* Error Message */}
          {error && (
            <div className="mb-8 p-4 rounded-xl bg-red-500/5 border border-red-500/10 text-red-400 text-sm text-center font-light tracking-wide flex items-center justify-center gap-2 animate-fade-in">
              <svg className="w-4 h-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2 group">
              <label className="block text-xs font-medium text-zinc-500 uppercase tracking-widest pl-1 group-focus-within:text-zinc-300 transition-colors">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 text-white rounded-xl border border-white/10 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/30 placeholder:text-zinc-600 transition-all"
                placeholder="nama@email.com"
                required
              />
            </div>

            <div className="space-y-2 group">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-medium text-zinc-500 uppercase tracking-widest pl-1 group-focus-within:text-zinc-300 transition-colors">
                  Password
                </label>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 text-white rounded-xl border border-white/10 px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/30 placeholder:text-zinc-600 transition-all"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-300 transition-colors p-2"
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-br from-slate-100 via-white to-slate-300 text-black font-bold h-12 rounded-xl hover:shadow-[0_0_24px_rgba(59,130,246,0.18)] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading && (
                  <svg
                    className="animate-spin h-5 w-5 text-black"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                )}
                Masuk ke Akun
              </button>
            </div>
          </form>
        </div>

        {/* Footer Actions */}
        <div className="mt-8 text-center space-y-4">
          <p className="text-sm text-zinc-500 font-light">
            Belum punya akun?{' '}
            <Link to="/register" className="text-zinc-300 hover:text-white transition-colors border-b border-zinc-700 hover:border-white pb-0.5">
              Daftar disini
            </Link>
          </p>
          
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs text-zinc-700 hover:text-zinc-400 transition-colors tracking-[0.2em] uppercase"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali
          </Link>
        </div>
      </div>
    </main>
  );
}
