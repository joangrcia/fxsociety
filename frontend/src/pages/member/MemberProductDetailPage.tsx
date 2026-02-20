import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';

// Mock Data (in real app, fetch from API)
const productData = {
  id: '1',
  title: 'Ebook Trading for Beginners',
  type: 'Ebook',
  version: 'v1.2',
  lastUpdated: '10 Oktober 2023',
  description: 'Panduan lengkap trading forex dari nol hingga mahir. Membahas teknikal, fundamental, dan psikologi trading.',
  downloadUrl: '#',
  guides: [
    { title: 'Persiapan Awal', content: 'Pastikan Anda memiliki PDF Reader terinstal. Kami merekomendasikan Adobe Acrobat Reader.' },
    { title: 'Cara Membaca', content: 'Mulai dari Bab 1 secara berurutan. Jangan loncat ke strategi sebelum paham risk management.' },
  ],
  updates: [
    { version: 'v1.2', date: '2023-10-10', notes: 'Penambahan bab Psikologi Trading' },
    { version: 'v1.1', date: '2023-09-01', notes: 'Koreksi typo dan update grafik' },
    { version: 'v1.0', date: '2023-08-15', notes: 'Rilis perdana' },
  ]
};

export function MemberProductDetailPage() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<'download' | 'guide' | 'updates'>('download');

  console.log('Product ID:', id); // Just to use the variable

  // In real app: fetch product by id. If not found, show 404 or loading.
  // For now we use static mock data.
  const product = productData;

  return (
    <div className="max-w-4xl animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <Link to="/member/digital" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white mb-4 transition-colors text-sm">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Kembali ke Library
        </Link>
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-white">{product.title}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                {product.type}
              </span>
            </div>
            <p className="text-zinc-400 max-w-2xl">{product.description}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10 mb-8">
        {[
          { id: 'download', label: 'Download File' },
          { id: 'guide', label: 'Panduan' },
          { id: 'updates', label: 'Update Log' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as 'download' | 'guide' | 'updates')}
            className={`
              px-6 py-3 text-sm font-medium border-b-2 transition-colors
              ${activeTab === tab.id 
                ? 'border-orange-500 text-orange-400' 
                : 'border-transparent text-zinc-500 hover:text-white hover:border-white/20'
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-[#14141a] rounded-2xl border border-white/5 p-6 md:p-8 min-h-[400px]">
        
        {/* Tab: Download */}
        {activeTab === 'download' && (
          <div className="space-y-8">
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-orange-500">
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Siap untuk diunduh</h3>
              <p className="text-zinc-400 mb-8">
                Versi {product.version} • Terakhir diupdate {product.lastUpdated}
              </p>
              <button className="px-8 py-3 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-500 transition-all shadow-lg shadow-orange-500/20 hover:scale-105">
                Download Sekarang
              </button>
            </div>

            <div className="bg-[#0a0a0f] rounded-xl p-4 border border-white/5">
              <h4 className="text-sm font-semibold text-white mb-2">Penting:</h4>
              <ul className="list-disc list-inside text-sm text-zinc-400 space-y-1">
                <li>File dilindungi password (jika ada). Cek email pembelian Anda.</li>
                <li>Dilarang menyebarluaskan file ini tanpa izin (Hak Cipta Dilindungi).</li>
                <li>Jika file corrupt/rusak, coba download ulang atau hubungi support.</li>
              </ul>
            </div>
          </div>
        )}

        {/* Tab: Guide */}
        {activeTab === 'guide' && (
          <div className="space-y-6 animate-fade-in">
            {product.guides.map((guide, idx) => (
              <div key={idx} className="border-b border-white/5 last:border-0 pb-6 last:pb-0">
                <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-zinc-800 text-xs text-white border border-white/10">
                    {idx + 1}
                  </span>
                  {guide.title}
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed pl-9">
                  {guide.content}
                </p>
              </div>
            ))}
            
            <div className="mt-8 pt-6 border-t border-white/10">
              <p className="text-zinc-500 text-sm mb-4">Masih bingung cara pakainya?</p>
              <a 
                href="https://wa.me/6281234567890" 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 text-sm font-medium"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Tanya Tim Support
              </a>
            </div>
          </div>
        )}

        {/* Tab: Updates */}
        {activeTab === 'updates' && (
          <div className="space-y-6 animate-fade-in">
            <div className="relative border-l border-white/10 ml-3 space-y-8">
              {product.updates.map((update, idx) => (
                <div key={idx} className="relative pl-8">
                  {/* Timeline Dot */}
                  <div className={`absolute -left-1.5 top-1.5 w-3 h-3 rounded-full border border-[#14141a] ${idx === 0 ? 'bg-orange-500' : 'bg-zinc-700'}`} />
                  
                  <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 mb-1">
                    <span className="text-white font-bold">{update.version}</span>
                    <span className="text-zinc-500 text-xs font-mono">{update.date}</span>
                  </div>
                  <p className="text-zinc-400 text-sm">
                    {update.notes}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
