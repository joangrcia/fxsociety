import { useAuth } from '../../context/AuthContext';

export function MemberProfilePage() {
  const { user } = useAuth();

  if (!user) return null;

  const displayName = user.full_name || user.email.split('@')[0];
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="max-w-2xl animate-fade-in">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Akun Saya</h1>
        <p className="text-zinc-400">Informasi profil dan pengaturan akun Anda.</p>
      </header>

      <div className="bg-[#14141a] rounded-2xl border border-white/5 overflow-hidden">
        {/* Profile Header */}
        <div className="p-8 border-b border-white/5 flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white text-3xl font-bold">
            {initial}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">{displayName}</h2>
            <p className="text-zinc-400">Member aktif</p>
          </div>
        </div>

        {/* Details */}
        <div className="p-8 space-y-6">
          <div>
             <label className="block text-sm font-medium text-zinc-500 mb-1">Email</label>
             <div className="text-white font-medium">{user.email}</div>
          </div>
          {/* Note: WhatsApp field is not yet in backend User model, so hiding for now or using placeholder */}
          
          <div className="pt-6 border-t border-white/5">
             <button className="text-sm text-zinc-500 hover:text-white underline transition-colors">
               Ubah Password
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
