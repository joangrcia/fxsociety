import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/shared';
import { fetchOrdersByEmail, apiOrderToOrder } from '../lib/api';
import { formatPrice, formatDate, getStatusLabel, getStatusColor } from '../utils/orders';
import type { Order } from '../types/order';

type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [email, setEmail] = useState('');
  const [searchEmail, setSearchEmail] = useState('');
  const [loadingState, setLoadingState] = useState<LoadingState>('idle');
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setSearchEmail(email);
    setLoadingState('loading');
    setError(null);

    try {
      const response = await fetchOrdersByEmail(email.trim());
      setOrders(response.items.map(apiOrderToOrder));
      setLoadingState('success');
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      setError(err instanceof Error ? err.message : 'Gagal memuat pesanan');
      setLoadingState('error');
    }
  };

  return (
    <main className="pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
            Pesanan Saya
          </h1>
          <p className="text-zinc-400 text-sm">
            Masukkan email untuk melihat daftar pesanan Anda
          </p>
        </div>

        {/* Email Search Form */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Masukkan email Anda..."
              required
              className="flex-1 bg-[#1e1e26] text-white rounded-lg border border-white/10 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder:text-zinc-600 transition-all"
            />
            <Button type="submit" isLoading={loadingState === 'loading'}>
              Cari Pesanan
            </Button>
          </div>
        </form>

        {/* Loading State */}
        {loadingState === 'loading' && (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-[#1e1e26] rounded-2xl p-5 animate-pulse">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="h-4 w-24 bg-zinc-800 rounded" />
                    <div className="h-5 w-48 bg-zinc-800 rounded" />
                    <div className="h-4 w-32 bg-zinc-800 rounded" />
                  </div>
                  <div className="h-6 w-20 bg-zinc-800 rounded" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {loadingState === 'error' && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
            <p className="text-red-400 mb-2">Gagal memuat pesanan</p>
            <p className="text-zinc-500 text-sm">{error}</p>
          </div>
        )}

        {/* Success State - Orders List */}
        {loadingState === 'success' && (
          <>
            {orders.length > 0 ? (
              <>
                <p className="text-sm text-zinc-500 mb-4">
                  Menampilkan <span className="text-zinc-300">{orders.length}</span> pesanan untuk{' '}
                  <span className="text-emerald-400">{searchEmail}</span>
                </p>
                <div className="space-y-4">
                  {orders.map((order) => (
                    <OrderCard key={order.id} order={order} />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12 bg-[#1e1e26] rounded-2xl border border-white/5">
                <div className="w-16 h-16 rounded-full bg-zinc-800/50 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-white mb-2">Tidak Ada Pesanan</h3>
                <p className="text-zinc-400 text-sm mb-4">
                  Tidak ditemukan pesanan untuk email <span className="text-emerald-400">{searchEmail}</span>
                </p>
                <Link to="/shop">
                  <Button variant="secondary" size="sm">Jelajahi Toko</Button>
                </Link>
              </div>
            )}
          </>
        )}

        {/* Idle State */}
        {loadingState === 'idle' && (
          <EmptyState />
        )}
      </div>
    </main>
  );
}

function OrderCard({ order }: { order: Order }) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Generate WhatsApp message for follow-up
  const whatsappMessage = encodeURIComponent(
    `Halo, saya ingin follow-up pesanan:\n\n` +
    `Order ID: ${order.id}\n` +
    `Produk: ${order.productTitle}\n` +
    `Nama: ${order.customerName}\n\n` +
    `Mohon info status pesanan saya. Terima kasih!`
  );
  const whatsappLink = `https://wa.me/6281234567890?text=${whatsappMessage}`;

  return (
    <div className="bg-[#1e1e26] rounded-2xl border border-white/5 overflow-hidden">
      {/* Main Row */}
      <div 
        className="p-5 cursor-pointer hover:bg-white/[0.02] transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          {/* Order Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs font-mono text-zinc-500">{order.id}</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                {getStatusLabel(order.status)}
              </span>
            </div>
            <h3 className="text-white font-medium truncate">{order.productTitle}</h3>
            <p className="text-sm text-zinc-500">{formatDate(order.createdAt)}</p>
          </div>

          {/* Price & Expand */}
          <div className="flex items-center gap-4">
            <span className="text-lg font-bold text-emerald-400">
              {formatPrice(order.productPrice)}
            </span>
            <svg 
              className={`w-5 h-5 text-zinc-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="px-5 pb-5 pt-0 border-t border-white/5">
          <div className="pt-4 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-zinc-500">Nama</span>
              <span className="text-zinc-300">{order.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Email</span>
              <span className="text-zinc-300">{order.customerEmail}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">WhatsApp</span>
              <span className="text-zinc-300">{order.customerWhatsapp}</span>
            </div>
            {order.notes && (
              <div className="flex justify-between">
                <span className="text-zinc-500">Catatan</span>
                <span className="text-zinc-300 text-right max-w-[60%]">{order.notes}</span>
              </div>
            )}
          </div>

          {/* Actions */}
          {order.status === 'pending' && (
            <div className="mt-4 pt-4 border-t border-white/5">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Konfirmasi Pembayaran via WhatsApp
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-16">
      <div className="w-20 h-20 rounded-full bg-zinc-800/50 flex items-center justify-center mx-auto mb-6">
        <svg className="w-10 h-10 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-white mb-2">Cari Pesanan Anda</h2>
      <p className="text-zinc-400 mb-8 max-w-sm mx-auto">
        Masukkan email yang Anda gunakan saat membuat pesanan untuk melihat status pesanan Anda.
      </p>
      <Link to="/shop">
        <Button variant="secondary">Jelajahi Toko</Button>
      </Link>
    </div>
  );
}
