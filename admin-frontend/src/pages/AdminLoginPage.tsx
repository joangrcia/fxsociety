import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/shared';
import { login, ApiError } from '../lib/api';

export function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await login(username, password);
      localStorage.setItem('admin_token', response.access_token);
      navigate('/dashboard');
    } catch (err) {
      console.error('Login failed:', err);
      if (err instanceof ApiError && err.status === 401) {
        setError('Username atau password salah');
      } else {
        setError('Terjadi kesalahan saat login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="pt-24 pb-16 px-4 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md bg-[#1e1e26] rounded-2xl p-8 border border-white/5">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">Admin Login</h1>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-[#14141a] text-white rounded-lg border border-white/10 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#14141a] text-white rounded-lg border border-white/10 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          <Button type="submit" className="w-full" isLoading={isLoading}>
            Masuk
          </Button>
        </form>
      </div>
    </main>
  );
}
