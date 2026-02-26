import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  fetchMyOrders, 
  fetchMyTickets, 
  createTicket, 
  ApiError, 
  apiOrderToOrder,
  type ApiTicket
} from '../lib/api';
import { formatPrice, formatDate, getStatusLabel, getStatusColor } from '../utils/orders';
import type { Order } from '../types/order';
import { Button } from '../components/shared';

type Tab = 'overview' | 'orders' | 'products' | 'tickets' | 'profile';

export function UserDashboardPage() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [orders, setOrders] = useState<Order[]>([]);
  const [tickets, setTickets] = useState<ApiTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const userEmail = localStorage.getItem('user_email');

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      navigate('/login');
      return;
    }
    loadData(token);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadData = async (token: string) => {
    try {
      const [ordersRes, ticketsRes] = await Promise.all([
        fetchMyOrders(token),
        fetchMyTickets(token)
      ]);
      setOrders(ordersRes.items.map(apiOrderToOrder));
      setTickets(ticketsRes.items);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      if (err instanceof ApiError && err.status === 401) {
        localStorage.removeItem('auth_token');
        navigate('/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_email');
    navigate('/');
    window.location.reload();
  };

  const SidebarItem = ({ tab, label, icon }: { tab: Tab, label: string, icon: React.ReactNode }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
        activeTab === tab 
          ? 'bg-emerald-500/10 text-emerald-400 border-r-2 border-emerald-400' 
          : 'text-zinc-400 hover:text-white hover:bg-white/5'
      }`}
    >
      {icon}
      {label}
    </button>
  );

  return (
    <div className="min-h-screen pt-16 bg-[#0a0a0f]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#14141a] border-r border-white/5 fixed h-[calc(100vh-4rem)] hidden md:block overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4">Menu</h2>
          <div className="space-y-1">
            <SidebarItem 
              tab="overview" 
              label="Ringkasan" 
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>}
            />
            <SidebarItem 
              tab="orders" 
              label="Pesanan Saya" 
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>}
            />
            <SidebarItem 
              tab="products" 
              label="Produk Saya" 
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>}
            />
            <SidebarItem 
              tab="tickets" 
              label="Bantuan" 
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
            />
            <SidebarItem 
              tab="profile" 
              label="Akun" 
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
            />
          </div>
        </div>
      </aside>

      {/* Mobile Nav Tabs */}
      <div className="md:hidden fixed top-16 left-0 right-0 bg-[#14141a] border-b border-white/5 z-40 overflow-x-auto">
        <div className="flex px-4">
          <button onClick={() => setActiveTab('overview')} className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${activeTab === 'overview' ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-zinc-400'}`}>Ringkasan</button>
          <button onClick={() => setActiveTab('orders')} className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${activeTab === 'orders' ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-zinc-400'}`}>Pesanan</button>
          <button onClick={() => setActiveTab('products')} className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${activeTab === 'products' ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-zinc-400'}`}>Produk</button>
          <button onClick={() => setActiveTab('tickets')} className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${activeTab === 'tickets' ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-zinc-400'}`}>Bantuan</button>
          <button onClick={() => setActiveTab('profile')} className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${activeTab === 'profile' ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-zinc-400'}`}>Akun</button>
        </div>
      </div>

      {/* Main Content */}
      <main className="md:ml-64 p-4 md:p-8 mt-12 md:mt-0">
        <div className="max-w-5xl mx-auto">
          {activeTab === 'overview' && <OverviewTab orders={orders} tickets={tickets} userEmail={userEmail} />}
          {activeTab === 'orders' && <OrdersTab orders={orders} isLoading={isLoading} />}
          {activeTab === 'products' && <ProductsTab orders={orders} />}
          {activeTab === 'tickets' && <TicketsTab tickets={tickets} refresh={() => loadData(localStorage.getItem('auth_token') || '')} />}
          {activeTab === 'profile' && <ProfileTab userEmail={userEmail} onLogout={handleLogout} />}
        </div>
      </main>
    </div>
  );
}

// --- Sub-components ---

function OverviewTab({ orders, tickets, userEmail }: { orders: Order[], tickets: ApiTicket[], userEmail: string | null }) {
  const activeProducts = orders.filter(o => o.status === 'confirmed' || o.status === 'completed').length;
  const openTickets = tickets.filter(t => t.status === 'open').length;


  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Selamat Datang, Trader</h2>
          <p className="text-zinc-400 text-sm">{userEmail}</p>
        </div>
        <Link to="/shop">
          <Button>Belanja Lagi</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SummaryCard label="Total Pesanan" value={orders.length} icon="🛍️" />
        <SummaryCard label="Produk Dimiliki" value={activeProducts} icon="📦" />
        <SummaryCard label="Tiket Terbuka" value={openTickets} icon="🎫" color={openTickets > 0 ? 'text-slate-300' : undefined} />
      </div>

      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Aktivitas Terbaru</h3>
        {orders.length > 0 ? (
          <div className="space-y-4">
            {orders.slice(0, 3).map(order => (
              <OrderCard key={order.id} order={order} simple />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-[#1e1e26] rounded-xl border border-white/5">
            <p className="text-zinc-500">Belum ada aktivitas.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function SummaryCard({ label, value, icon, color = 'text-white' }: { label: string; value: string | number; icon: React.ReactNode; color?: string }) {
  return (
    <div className="bg-[#1e1e26] p-6 rounded-xl border border-white/5 flex items-center justify-between">
      <div>
        <p className="text-zinc-400 text-sm">{label}</p>
        <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
      </div>
      <div className="text-2xl opacity-50">{icon}</div>
    </div>
  );
}

function OrdersTab({ orders, isLoading }: { orders: Order[], isLoading: boolean }) {
  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-6">Riwayat Pesanan</h2>
      {isLoading ? (
        <div className="space-y-4 animate-pulse">
          <div className="bg-[#1e1e26] h-24 rounded-xl" />
          <div className="bg-[#1e1e26] h-24 rounded-xl" />
        </div>
      ) : orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map(order => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-[#1e1e26] rounded-xl border border-white/5">
          <p className="text-zinc-400 mb-4">Belum ada pesanan.</p>
          <Link to="/shop"><Button>Mulai Belanja</Button></Link>
        </div>
      )}
    </div>
  );
}

function ProductsTab({ orders }: { orders: Order[] }) {
  const ownedProducts = orders.filter(o => o.status === 'confirmed' || o.status === 'completed');

  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-6">Produk Saya</h2>
      {ownedProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ownedProducts.map(order => (
            <div key={order.id} className="bg-[#1e1e26] p-5 rounded-xl border border-white/5 flex gap-4">
              <div className="w-20 h-20 bg-zinc-800 rounded-lg overflow-hidden shrink-0">
                {order.productImage ? (
                  <img src={order.productImage} alt={order.productTitle} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-zinc-700" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-white font-medium">{order.productTitle}</h3>
                <p className="text-xs text-zinc-500 mt-1 uppercase">{order.productCategory || 'Produk'}</p>
                <div className="mt-3 flex items-center gap-2">
                  <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 text-xs rounded">
                    {order.status === 'completed' ? 'Aktif' : 'Menunggu Akses'}
                  </span>
                  {order.status === 'completed' && (
                    <button className="text-xs text-zinc-300 hover:text-white border border-white/10 px-3 py-1 rounded transition-colors">
                      Akses
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-[#1e1e26] rounded-xl border border-white/5">
          <p className="text-zinc-400 mb-4">Anda belum memiliki produk.</p>
          <Link to="/shop"><Button>Lihat Katalog</Button></Link>
        </div>
      )}
    </div>
  );
}

function TicketsTab({ tickets, refresh }: { tickets: ApiTicket[], refresh: () => void }) {
  const [isCreating, setIsCreating] = useState(false);
  const [newTicket, setNewTicket] = useState({ title: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const token = localStorage.getItem('auth_token');
    if (!token) return;

    try {
      await createTicket(token, newTicket);
      setNewTicket({ title: '', message: '' });
      setIsCreating(false);
      refresh();
    } catch {
      // silently ignore ticket creation errors
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white">Bantuan / Tiket</h2>
        <Button size="sm" onClick={() => setIsCreating(!isCreating)}>
          {isCreating ? 'Batal' : '+ Buat Tiket'}
        </Button>
      </div>

      {isCreating && (
        <div className="bg-[#1e1e26] p-6 rounded-xl border border-white/5 mb-8 animate-fade-in">
          <h3 className="text-lg font-medium text-white mb-4">Tiket Baru</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Judul</label>
              <input 
                className="w-full bg-[#14141a] text-white rounded p-2 border border-white/10"
                value={newTicket.title}
                onChange={e => setNewTicket({...newTicket, title: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Pesan</label>
              <textarea 
                className="w-full bg-[#14141a] text-white rounded p-2 border border-white/10"
                value={newTicket.message}
                onChange={e => setNewTicket({...newTicket, message: e.target.value})}
                rows={3}
                required
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit" isLoading={isSubmitting}>Kirim Tiket</Button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {tickets.length > 0 ? (
          tickets.map(ticket => (
            <div key={ticket.id} className="bg-[#1e1e26] p-5 rounded-xl border border-white/5">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-white font-medium">{ticket.title}</h3>
                  <p className="text-zinc-400 text-sm mt-1">{ticket.message}</p>
                  <p className="text-zinc-600 text-xs mt-3">
                    {new Date(ticket.created_at).toLocaleDateString('id-ID')}
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs rounded capitalize ${
                  ticket.status === 'open' ? 'bg-emerald-500/10 text-emerald-400' : 
                  ticket.status === 'closed' ? 'bg-zinc-500/10 text-zinc-400' : 
                  'bg-slate-400/10 text-slate-300'
                }`}>
                  {ticket.status}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-zinc-500 text-center py-8">Belum ada tiket bantuan.</p>
        )}
      </div>
    </div>
  );
}

function ProfileTab({ userEmail, onLogout }: { userEmail: string | null, onLogout: () => void }) {
  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-6">Pengaturan Akun</h2>
      <div className="bg-[#1e1e26] p-6 rounded-xl border border-white/5 max-w-xl">
        <div className="mb-6">
          <label className="block text-sm text-zinc-500 mb-1">Email Terdaftar</label>
          <p className="text-white font-mono">{userEmail}</p>
        </div>
        <div className="border-t border-white/5 pt-6">
          <Button variant="secondary" onClick={onLogout}>
            Logout dari Perangkat Ini
          </Button>
        </div>
      </div>
    </div>
  );
}

function OrderCard({ order, simple }: { order: Order, simple?: boolean }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-[#1e1e26] rounded-xl border border-white/5 overflow-hidden transition-all hover:border-white/10">
      <div 
        className="p-5 cursor-pointer"
        onClick={() => !simple && setIsExpanded(!isExpanded)}
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1">
              <span className="text-xs font-mono text-zinc-500">{order.id}</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${getStatusColor(order.status)}`}>
                {getStatusLabel(order.status)}
              </span>
            </div>
            <h3 className="text-white font-medium truncate">{order.productTitle}</h3>
            {!simple && <p className="text-sm text-zinc-500">{formatDate(order.createdAt)}</p>}
          </div>
          <div className="flex items-center gap-4">
            <span className="text-emerald-400 font-bold text-sm">
              {formatPrice(order.productPrice)}
            </span>
            {!simple && (
              <svg className={`w-5 h-5 text-zinc-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            )}
          </div>
        </div>
      </div>
      {isExpanded && !simple && (
        <div className="px-5 pb-5 pt-0 border-t border-white/5 bg-[#14141a]/50">
          <div className="pt-4 space-y-2 text-sm text-zinc-400">
            <p>Whatsapp: <span className="text-zinc-300">{order.customerWhatsapp}</span></p>
            {order.notes && <p>Catatan: <span className="text-zinc-300">{order.notes}</span></p>}
          </div>
        </div>
      )}
    </div>
  );
}
