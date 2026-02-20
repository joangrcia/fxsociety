import { useState, useEffect } from 'react';
import { ProductCard } from '../components/shared';
import { fetchProducts, apiProductToProduct, type ProductCategory } from '../lib/api';
import type { Product } from '../types/product';

type SortOption = 'newest' | 'price_asc' | 'price_desc' | 'name';

const categoryFilters: { key: ProductCategory | 'all'; label: string }[] = [
  { key: 'all', label: 'Semua' },
  { key: 'indikator', label: 'Indikator' },
  { key: 'robot', label: 'Robot EA' },
  { key: 'ebook', label: 'Ebook' },
  { key: 'merchandise', label: 'Merchandise' },
];

const sortOptions: { key: SortOption; label: string }[] = [
  { key: 'newest', label: 'Terbaru' },
  { key: 'price_asc', label: 'Harga Terendah' },
  { key: 'price_desc', label: 'Harga Tertinggi' },
  { key: 'name', label: 'Nama A-Z' },
];

type LoadingState = 'loading' | 'success' | 'error';

export function ShopPage() {
  const [activeCategory, setActiveCategory] = useState<ProductCategory | 'all'>('all');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingState, setLoadingState] = useState<LoadingState>('loading');
  const [error, setError] = useState<string | null>(null);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch products when filters change
  useEffect(() => {
    setLoadingState('loading');
    setError(null);

    fetchProducts({
      category: activeCategory === 'all' ? undefined : activeCategory,
      search: debouncedSearch || undefined,
      sort: sortBy,
      page_size: 100, // Get all products for now
    })
      .then((response) => {
        setProducts(response.items.map(apiProductToProduct));
        setLoadingState('success');
      })
      .catch((err) => {
        console.error('Failed to fetch products:', err);
        setError(err.message || 'Gagal memuat produk');
        setLoadingState('error');
      });
  }, [activeCategory, sortBy, debouncedSearch]);

  return (
    <main className="min-h-screen pt-24 pb-20 px-4 md:px-6 bg-[#0a0a0f]">
      <div className="max-w-7xl mx-auto">
        {/* Cinematic Header */}
        <section className="relative mb-12 overflow-hidden rounded-[2rem] border border-white/5 bg-[#0f0f16] px-6 py-16 md:px-12 md:py-20 shadow-2xl">
          {/* Background Effects */}
            <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-4xl bg-orange-500/5 blur-[120px] rounded-full" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 blur-[100px] rounded-full mix-blend-screen" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-500/5 blur-[100px] rounded-full mix-blend-screen" />
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10 bg-center" />
          </div>

          <div className="relative z-10 text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-orange-500/20 bg-orange-500/5 text-orange-400 text-xs tracking-widest uppercase font-medium mb-6 animate-fade-in">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
              Toko Resmi
            </div>

            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6 animate-slide-up">
              Marketplace <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">FXSociety</span>
            </h1>

            <p className="text-lg md:text-xl text-zinc-400 leading-relaxed animate-slide-up" style={{ animationDelay: '100ms' }}>
              Koleksi alat trading premium, robot EA, dan materi edukasi pilihan.
              <br className="hidden md:block" />
              Dikurasi khusus untuk membantu perjalanan trading Anda.
            </p>
          </div>
        </section>

        {/* Floating Filter Bar */}
        <div className="sticky top-24 z-30 mb-10 transition-all duration-300">
          <div className="rounded-2xl border border-white/10 bg-[#14141a]/80 backdrop-blur-xl shadow-2xl p-4 md:p-5">
            <div className="flex flex-col md:flex-row gap-6 justify-between items-center">
              
              {/* Category Pills */}
              <div className="w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                <div className="flex gap-2">
                  {categoryFilters.map((filter) => (
                    <button
                      key={filter.key}
                      onClick={() => setActiveCategory(filter.key)}
                      className={`
                        shrink-0 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300
                        ${activeCategory === filter.key
                          ? 'bg-orange-500 text-white shadow-[0_0_20px_rgba(249,115,22,0.4)] scale-105'
                          : 'bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white border border-white/5'
                        }
                      `}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tools */}
              <div className="flex w-full md:w-auto gap-3">
                 {/* Sort */}
                 <div className="relative group shrink-0">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as SortOption)}
                      className="appearance-none bg-[#1e1e26] text-zinc-300 text-sm rounded-xl border border-white/10 pl-4 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500/50 cursor-pointer hover:border-white/20 transition-colors"
                    >
                      {sortOptions.map((option) => (
                        <option key={option.key} value={option.key}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 4.5L6 8L9.5 4.5"/></svg>
                    </div>
                 </div>

                 {/* Search */}
                 <div className="relative flex-1 md:w-64">
                    <input
                      type="text"
                      placeholder="Cari..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-[#1e1e26] text-white text-sm rounded-xl border border-white/10 pl-10 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500/50 placeholder:text-zinc-600 hover:border-white/20 transition-colors"
                    />
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    </div>
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      </button>
                    )}
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {loadingState === 'loading' ? (
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
             {[...Array(8)].map((_, i) => (
               <div key={i} className="rounded-2xl bg-[#14141a] border border-white/5 overflow-hidden animate-pulse">
                 <div className="aspect-[4/3] bg-white/5" />
                 <div className="p-5 space-y-3">
                   <div className="h-5 w-3/4 bg-white/5 rounded" />
                   <div className="h-4 w-1/2 bg-white/5 rounded" />
                   <div className="h-8 w-1/3 bg-white/5 rounded mt-4" />
                 </div>
               </div>
             ))}
           </div>
        ) : loadingState === 'error' ? (
           <div className="text-center py-20">
             <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 text-red-400 mb-4">
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
             </div>
             <h3 className="text-xl font-bold text-white mb-2">Terjadi Kesalahan</h3>
             <p className="text-zinc-400 mb-6">{error}</p>
             <button onClick={() => window.location.reload()} className="px-6 py-2 rounded-xl bg-white text-black font-medium hover:bg-zinc-200 transition-colors">
               Coba Lagi
             </button>
           </div>
        ) : (
           <>
             {products.length > 0 ? (
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 animate-slide-up">
                 {products.map((product) => (
                   <ProductCard key={product.id} product={product} />
                 ))}
               </div>
             ) : (
               <div className="text-center py-32 border border-dashed border-white/10 rounded-3xl">
                 <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-zinc-800/50 text-zinc-500 mb-4">
                   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                 </div>
                 <h3 className="text-xl font-medium text-white mb-2">Tidak ada produk ditemukan</h3>
                 <p className="text-zinc-500 max-w-sm mx-auto">
                   Coba ubah kata kunci pencarian atau kategori filter Anda.
                 </p>
                 <button onClick={() => { setActiveCategory('all'); setSearchQuery(''); }} className="mt-6 text-orange-400 hover:text-orange-300 font-medium text-sm">
                   Reset Filter
                 </button>
               </div>
             )}
           </>
        )}
      </div>
    </main>
  );
}
