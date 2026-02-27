import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/shared';
import { registerUser, ApiError } from '../lib/api';

export function RegisterPage() {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await registerUser(formData);
      // Success, redirect to login
      alert('Registrasi berhasil! Silakan login.');
      navigate('/login');
    } catch (err) {
      console.error('Registration failed:', err);
      if (err instanceof ApiError) {
        setError(err.detail as string);
      } else {
        setError('Terjadi kesalahan saat registrasi');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <main className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#0a0a0f] px-4 py-12">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/6 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-400/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Header Section */}
        <div className="text-center mb-8">
          <Link 
            to="/" 
            className="inline-block text-3xl font-bold text-white hover:opacity-80 transition-opacity tracking-tight"
          >
            fx<span className="text-slate-400">society</span>
          </Link>
          <h1 className="text-2xl font-bold tracking-wide bg-gradient-to-r from-slate-100 via-white to-slate-400 bg-clip-text text-transparent mt-6 mb-2">
            Selamat Datang
          </h1>
          <p className="text-zinc-400 text-sm">
            Bergabunglah dengan komunitas trading eksklusif kami
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#14141a] border border-white/5 rounded-2xl p-8 shadow-2xl hover:border-white/10 transition-all">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg mb-6 flex items-start gap-2">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Field */}
              <div className="space-y-1.5">
                <label htmlFor="full_name" className="block text-xs font-medium text-zinc-400 uppercase tracking-wider">
                  Nama Lengkap
                </label>
                <div className="relative group/input">
                  <input
                    id="full_name"
                    type="text"
                    value={formData.full_name}
                    onChange={(e) => handleChange('full_name', e.target.value)}
                    placeholder="Masukkan nama lengkap"
                    required
                    className="w-full bg-white/5 text-white rounded-xl border border-white/10 px-4 py-3 text-sm
                    focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/30
                    placeholder:text-zinc-600 transition-all duration-300 group-hover/input:border-white/20"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-1.5">
                <label htmlFor="email" className="block text-xs font-medium text-zinc-400 uppercase tracking-wider">
                  Email
                </label>
                <div className="relative group/input">
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="nama@email.com"
                    required
                    className="w-full bg-white/5 text-white rounded-xl border border-white/10 px-4 py-3 text-sm
                    focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/30
                    placeholder:text-zinc-600 transition-all duration-300 group-hover/input:border-white/20"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <label htmlFor="password" className="block text-xs font-medium text-zinc-400 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative group/input">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    placeholder="Buat password aman"
                    required
                    className="w-full bg-white/5 text-white rounded-xl border border-white/10 px-4 py-3 pr-12 text-sm
                    focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/30
                    placeholder:text-zinc-600 transition-all duration-300 group-hover/input:border-white/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors p-1"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-br from-slate-100 via-white to-slate-300 text-black font-bold h-12 rounded-xl hover:shadow-[0_0_24px_rgba(59,130,246,0.18)] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading && (
                    <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  )}
                  Buat Akun
                </button>
              </div>
            </form>

            {/* Login Link */}
            <div className="text-center mt-8 pt-6 border-t border-white/5">
              <p className="text-sm text-zinc-400">
                Sudah memiliki akun?{' '}
                <Link
                  to="/login"
                  className="text-slate-400 hover:text-slate-300 font-medium transition-colors hover:underline decoration-slate-400/30 underline-offset-4"
                >
                  Login sekarang
                </Link>
              </p>
            </div>
        </div>
        
        {/* Simple Footer Links */}
        <div className="mt-8 text-center flex justify-center space-x-6">
          <Link to="/support" className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors">Bantuan</Link>
          <Link to="/terms" className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors">Syarat & Ketentuan</Link>
        </div>
      </div>
    </main>
  );
}
