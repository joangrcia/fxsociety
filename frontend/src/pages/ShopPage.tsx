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
    <main className="pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Toko</h1>
          <p className="text-zinc-400 max-w-xl mx-auto">
            Temukan tools dan panduan yang tepat untuk perjalanan trading Anda.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="bg-[#14141a] rounded-2xl p-4 md:p-6 border border-white/5 mb-8">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 mb-4">
            {categoryFilters.map((filter) => (
              <button
                key={filter.key}
                onClick={() => setActiveCategory(filter.key)}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${activeCategory === filter.key
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-white/5 text-zinc-400 border border-transparent hover:bg-white/10 hover:text-white'
                  }
                `}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Sort & Search */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <label htmlFor="sort" className="text-sm text-zinc-500">
                Urutkan:
              </label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="bg-[#1e1e26] text-zinc-300 text-sm rounded-lg border border-white/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                {sortOptions.map((option) => (
                  <option key={option.key} value={option.key}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Search Input */}
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Cari produk..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#1e1e26] text-zinc-300 text-sm rounded-lg border border-white/10 pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder:text-zinc-600"
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loadingState === 'loading' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-[#1e1e26] rounded-2xl overflow-hidden animate-pulse">
                <div className="aspect-[4/3] bg-zinc-800" />
                <div className="p-5 space-y-3">
                  <div className="h-5 w-3/4 bg-zinc-800 rounded" />
                  <div className="h-4 w-full bg-zinc-800 rounded" />
                  <div className="h-4 w-1/2 bg-zinc-800 rounded" />
                  <div className="h-6 w-24 bg-zinc-800 rounded" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {loadingState === 'error' && (
          <div className="text-center py-16">
            <div className="text-zinc-500 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Gagal Memuat Produk</h3>
            <p className="text-zinc-400 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="text-emerald-400 hover:text-emerald-300 text-sm"
            >
              Coba lagi
            </button>
          </div>
        )}

        {/* Success State */}
        {loadingState === 'success' && (
          <>
            {/* Results Count */}
            <div className="mb-6">
              <p className="text-sm text-zinc-500">
                Menampilkan <span className="text-zinc-300">{products.length}</span> produk
              </p>
            </div>

            {/* Product Grid */}
            {products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-zinc-500 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Tidak Ada Produk</h3>
                <p className="text-zinc-400">
                  Coba ubah filter atau kata kunci pencarian Anda.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
