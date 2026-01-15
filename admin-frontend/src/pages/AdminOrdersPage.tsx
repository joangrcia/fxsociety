import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../components/admin/AdminLayout';
import { fetchAllOrdersAdmin, updateOrderStatus, ApiError, apiOrderToOrder } from '../lib/api';
import { formatPrice, formatDate, getStatusLabel, getStatusColor } from '../utils/orders';
import type { Order, OrderStatus } from '../types/order';

export function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const navigate = useNavigate();

  useEffect(() => {
    loadOrders();
  }, [filterStatus]);

  const loadOrders = async () => {
    setIsLoading(true);
    const token = localStorage.getItem('admin_token');
    if (!token) return;

    try {
      const response = await fetchAllOrdersAdmin(token, filterStatus);
      setOrders(response.items.map(apiOrderToOrder));
    } catch (err) {
      console.error('Failed to load orders:', err);
      if (err instanceof ApiError && err.status === 401) {
        localStorage.removeItem('admin_token');
        navigate('/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (order: Order, newStatus: OrderStatus) => {
    if (!order.numericId) return;
    if (!confirm(`Ubah status pesanan ${order.id} menjadi ${getStatusLabel(newStatus)}?`)) return;

    const token = localStorage.getItem('admin_token');
    if (!token) return;

    try {
      await updateOrderStatus(token, order.numericId, newStatus);
      loadOrders(); 
    } catch (err) {
      alert('Gagal update status');
    }
  };

  const actions = (
    <select
      value={filterStatus}
      onChange={(e) => setFilterStatus(e.target.value)}
      className="bg-[#1e1e26] text-zinc-300 text-sm rounded-lg border border-white/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
    >
      <option value="all">Semua Status</option>
      <option value="pending">Menunggu Konfirmasi</option>
      <option value="confirmed">Dikonfirmasi</option>
      <option value="completed">Selesai</option>
      <option value="cancelled">Dibatalkan</option>
    </select>
  );

  return (
    <AdminLayout title="Orders Management" actions={actions}>
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-[#1e1e26] rounded-2xl p-5 animate-pulse h-32" />
          ))}
        </div>
      ) : orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <AdminOrderCard 
              key={order.id} 
              order={order} 
              onUpdateStatus={handleStatusUpdate} 
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-[#1e1e26] rounded-2xl border border-white/5">
          <p className="text-zinc-400">Tidak ada pesanan ditemukan.</p>
        </div>
      )}
    </AdminLayout>
  );
}

function AdminOrderCard({ order, onUpdateStatus }: { order: Order; onUpdateStatus: (o: Order, s: OrderStatus) => void }) {
  return (
    <div className="bg-[#1e1e26] rounded-xl border border-white/5 p-5">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Info Column */}
        <div className="flex-1 space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-zinc-500 bg-white/5 px-2 py-1 rounded">
                {order.id}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                {getStatusLabel(order.status)}
              </span>
            </div>
            <span className="text-sm text-zinc-500">
              {formatDate(order.createdAt)}
            </span>
          </div>

          <div>
            <h3 className="text-white font-medium text-lg">{order.productTitle}</h3>
            <p className="text-emerald-400 font-bold">{formatPrice(order.productPrice)}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1">Customer</p>
              <p className="text-zinc-300 font-medium">{order.customerName}</p>
              <p className="text-zinc-400">{order.customerEmail}</p>
              <p className="text-zinc-400">{order.customerWhatsapp}</p>
            </div>
            {order.notes && (
              <div>
                <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1">Catatan</p>
                <p className="text-zinc-300 italic">"{order.notes}"</p>
              </div>
            )}
          </div>
        </div>

        {/* Actions Column */}
        <div className="lg:w-48 flex flex-col gap-2 justify-center border-t lg:border-t-0 lg:border-l border-white/5 pt-4 lg:pt-0 lg:pl-6">
          <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1 text-center lg:text-left">
            Update Status
          </p>
          
          {order.status === 'pending' && (
            <>
              <button
                onClick={() => onUpdateStatus(order, 'confirmed')}
                className="w-full px-3 py-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded-lg text-sm font-medium transition-colors"
              >
                Konfirmasi
              </button>
              <button
                onClick={() => onUpdateStatus(order, 'cancelled')}
                className="w-full px-3 py-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg text-sm font-medium transition-colors"
              >
                Batalkan
              </button>
            </>
          )}

          {order.status === 'confirmed' && (
            <button
              onClick={() => onUpdateStatus(order, 'completed')}
              className="w-full px-3 py-2 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 rounded-lg text-sm font-medium transition-colors"
            >
              Selesaikan
            </button>
          )}

          {order.status === 'completed' && (
            <span className="text-center text-xs text-emerald-500 font-medium py-2">
              Order Selesai
            </span>
          )}

          {order.status === 'cancelled' && (
            <button
              onClick={() => onUpdateStatus(order, 'pending')}
              className="w-full px-3 py-2 bg-zinc-700/30 text-zinc-400 hover:bg-zinc-700/50 rounded-lg text-sm font-medium transition-colors"
            >
              Reset ke Pending
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
