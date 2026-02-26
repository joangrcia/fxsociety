import { Link } from 'react-router-dom';

interface DigitalProduct {
  id: string;
  title: string;
  type: 'Ebook' | 'Indicator' | 'Robot';
  status: 'active' | 'pending';
  lastUpdated: string;
  version: string;
  imageUrl: string;
}

// Mock data
const myProducts: DigitalProduct[] = [
  {
    id: '1',
    title: 'Ebook Trading for Beginners',
    type: 'Ebook',
    status: 'active',
    lastUpdated: '2023-10-01',
    version: 'v1.2',
    imageUrl: 'https://placehold.co/400x300/1e1e26/FFF?text=Ebook',
  },
  {
    id: '2',
    title: 'Super Trend Indicator',
    type: 'Indicator',
    status: 'pending',
    lastUpdated: '2023-11-15',
    version: 'v2.0',
    imageUrl: 'https://placehold.co/400x300/1e1e26/FFF?text=Indicator',
  }
];

export function MemberDigitalPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      <header>
        <h1 className="text-3xl font-bold text-white mb-2">Produk Digital</h1>
        <p className="text-zinc-400">Akses semua ebook, indikator, dan robot EA Anda di sini.</p>
      </header>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {myProducts.map((product) => (
          <div 
            key={product.id}
            className="group bg-[#14141a] rounded-2xl border border-white/5 overflow-hidden hover:border-slate-400/20 hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] transition-all duration-300 flex flex-col"
          >
            {/* Image Area */}
            <div className="relative h-48 bg-[#0a0a0f] overflow-hidden">
              <img 
                src={product.imageUrl} 
                alt={product.title}
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" 
              />
              <div className="absolute top-3 left-3">
                 <span className={`
                   px-2.5 py-1 rounded-full text-xs font-medium border
                   ${product.type === 'Ebook' ? 'bg-slate-400/10 text-slate-300 border-slate-400/20' : ''}
                   ${product.type === 'Indicator' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : ''}
                   ${product.type === 'Robot' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : ''}
                 `}>
                   {product.type}
                 </span>
              </div>
            </div>

            {/* Content Area */}
            <div className="p-5 flex-1 flex flex-col">
              <div className="flex-1 mb-6">
                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-slate-300 transition-colors">
                  {product.title}
                </h3>
                <div className="flex items-center gap-3 text-xs text-zinc-500 font-mono">
                  <span>{product.version}</span>
                  <span>•</span>
                  <span>Updated {product.lastUpdated}</span>
                </div>
              </div>

              {/* Action Area */}
              <div>
                {product.status === 'active' ? (
                  <div className="space-y-3">
                    <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-500 text-white font-medium rounded-xl hover:bg-slate-400 transition-colors shadow-lg shadow-slate-400/20">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download File
                    </button>
                    <Link to={`/member/digital/${product.id}`} className="block text-center text-sm text-zinc-500 hover:text-white transition-colors">
                      Lihat Panduan Instalasi
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-xl flex items-start gap-3">
                      <svg className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div className="text-xs">
                        <span className="block text-yellow-500 font-medium mb-0.5">Menunggu Konfirmasi</span>
                        <span className="text-zinc-400">Admin sedang memverifikasi pembayaran Anda.</span>
                      </div>
                    </div>
                    <a 
                      href="https://wa.me/6281234567890?text=Halo%20Admin,%20saya%20sudah%20transfer%20untuk%20order%20Super%20Trend%20Indicator,%20mohon%20diproses."
                      target="_blank"
                      rel="noreferrer"
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1e1e26] border border-white/10 text-white font-medium rounded-xl hover:bg-white/5 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                      Konfirmasi via WA
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Empty State / Add New */}
        <Link to="/shop" className="group rounded-2xl border border-dashed border-white/10 bg-white/5 hover:bg-white/10 hover:border-slate-400/30 transition-all duration-300 flex flex-col items-center justify-center text-center p-8 min-h-[300px]">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-zinc-500 group-hover:scale-110 group-hover:text-slate-300 transition-all mb-4">
             <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
             </svg>
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Tambah Produk Baru</h3>
          <p className="text-sm text-zinc-400 max-w-[200px]">Jelajahi library kami untuk menemukan alat trading lainnya.</p>
        </Link>
      </div>
    </div>
  );
}
