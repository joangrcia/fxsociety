import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AdminLayout } from '../components/admin/AdminLayout';
import { 
  fetchDashboardStats, 
  fetchAllOrdersAdmin, 
  fetchCustomers, 
  type DashboardStats, 
  type Order, 
  type CustomerSummary,
  apiOrderToOrder 
} from '../lib/api';
import { formatPrice, formatDate } from '../utils/orders';

export function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [pendingOrders, setPendingOrders] = useState<Order[]>([]);
  const [newCustomers, setNewCustomers] = useState<CustomerSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    const token = localStorage.getItem('admin_token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const [statsRes, ordersRes, customersRes] = await Promise.all([
        fetchDashboardStats(token),
        fetchAllOrdersAdmin(token, 'pending'),
        fetchCustomers(token, { sort: 'newest', page: 1 })
      ]);
      
      setStats(statsRes);
      setPendingOrders(ordersRes.items.slice(0, 5).map(apiOrderToOrder));
      setNewCustomers(customersRes.slice(0, 5));
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const StatCard = ({ label, value, color, icon }: any) => (
    <div className="bg-[#1e1e26] p-6 rounded-xl border border-white/5">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-zinc-400 text-sm">{label}</p>
          <p className={`text-3xl font-bold mt-2 ${color}`}>{value}</p>
        </div>
        <div className="p-3 bg-white/5 rounded-lg text-zinc-400">
          {icon}
        </div>
      </div>
    </div>
  );

  return (
    <AdminLayout title="CRM Overview">
      {isLoading ? (
        <div className="animate-pulse space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-32 bg-[#1e1e26] rounded-xl" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-64 bg-[#1e1e26] rounded-xl" />
        </div>
      ) : (
        <div className="space-y-8">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard 
              label="Pesanan Pending" 
              value={stats?.pending_orders || 0} 
              color="text-amber-400"
              icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} 
            />
            <StatCard 
              label="Ticket Terbuka" 
              value={stats?.open_tickets || 0} 
              color="text-red-400"
              icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>} 
            />
            <StatCard 
              label="Customer Baru (7 Hari)" 
              value={stats?.new_customers_7d || 0} 
              color="text-orange-400"
              icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>} 
            />
            <StatCard 
              label="Perlu Follow-up" 
              value={stats?.follow_up_needed || 0} 
              color="text-blue-400"
              icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3" /></svg>} 
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Pending Orders */}
            <div className="bg-[#1e1e26] rounded-xl border border-white/5 overflow-hidden">
              <div className="p-4 border-b border-white/5 flex justify-between items-center">
                <h3 className="font-bold text-white">Pesanan Pending Terbaru</h3>
                <Link to="/orders" className="text-sm text-orange-400 hover:text-orange-300">Lihat Semua</Link>
              </div>
              <div className="divide-y divide-white/5">
                {pendingOrders.length > 0 ? (
                  pendingOrders.map(order => (
                    <div key={order.id} className="p-4 hover:bg-white/5 transition-colors">
                      <div className="flex justify-between mb-1">
                        <span className="text-white font-medium">{order.productTitle}</span>
                        <span className="text-orange-400 text-sm font-bold">{formatPrice(order.productPrice)}</span>
                      </div>
                      <div className="flex justify-between text-xs text-zinc-500">
                        <span>{order.customerName}</span>
                        <span>{formatDate(order.createdAt)}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-zinc-500">Tidak ada pesanan pending.</div>
                )}
              </div>
            </div>

            {/* Recent Customers */}
            <div className="bg-[#1e1e26] rounded-xl border border-white/5 overflow-hidden">
              <div className="p-4 border-b border-white/5 flex justify-between items-center">
                <h3 className="font-bold text-white">Customer Terbaru</h3>
                <Link to="/customers" className="text-sm text-orange-400 hover:text-orange-300">Lihat Semua</Link>
              </div>
              <div className="divide-y divide-white/5">
                {newCustomers.length > 0 ? (
                  newCustomers.map(customer => (
                    <div key={customer.id} className="p-4 hover:bg-white/5 transition-colors">
                      <div className="flex justify-between mb-1">
                        <span className="text-white font-medium">{customer.full_name || customer.email}</span>
                        <span className="text-zinc-400 text-xs bg-white/10 px-2 py-0.5 rounded">
                          {customer.total_orders} Pesanan
                        </span>
                      </div>
                      <div className="text-xs text-zinc-500">
                        {customer.email} • Bergabung {formatDate(customer.last_activity || '')}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-zinc-500">Belum ada customer baru.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
