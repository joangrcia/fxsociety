import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AdminLayout } from '../components/admin/AdminLayout';
import { fetchCustomers, ApiError, type CustomerSummary } from '../lib/api';
import { formatPrice, formatDate } from '../utils/orders';

export function AdminCustomersPage() {
  const [customers, setCustomers] = useState<CustomerSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    loadCustomers();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const loadCustomers = async () => {
    setIsLoading(true);
    const token = localStorage.getItem('admin_token');
    if (!token) return;

    try {
      const response = await fetchCustomers(token, { search: debouncedSearch });
      setCustomers(response);
    } catch (err) {
      console.error('Failed to load customers:', err);
      if (err instanceof ApiError && err.status === 401) {
        localStorage.removeItem('admin_token');
        navigate('/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const actions = (
    <input
      type="text"
      placeholder="Cari customer..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="bg-[#1e1e26] text-zinc-300 text-sm rounded-lg border border-white/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-64"
    />
  );

  return (
    <AdminLayout title="Customers" actions={actions}>
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-[#1e1e26] rounded-xl p-4 animate-pulse h-16" />
          ))}
        </div>
      ) : customers.length > 0 ? (
        <div className="bg-[#1e1e26] rounded-xl border border-white/5 overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-white/5 text-zinc-400">
              <tr>
                <th className="px-6 py-3 font-medium">Customer</th>
                <th className="px-6 py-3 font-medium">Total Order</th>
                <th className="px-6 py-3 font-medium">Total Spend</th>
                <th className="px-6 py-3 font-medium">Last Activity</th>
                <th className="px-6 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-white">{customer.full_name || 'No Name'}</div>
                      <div className="text-zinc-500">{customer.email}</div>
                      <div className="flex gap-1 mt-1">
                        {customer.tags.map(tag => (
                          <span key={tag} className="text-[10px] bg-emerald-500/10 text-emerald-400 px-1.5 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-zinc-300">{customer.total_orders}</td>
                  <td className="px-6 py-4 text-emerald-400 font-medium">{formatPrice(customer.total_spend)}</td>
                  <td className="px-6 py-4 text-zinc-500">
                    {customer.last_activity ? formatDate(customer.last_activity) : '-'}
                  </td>
                  <td className="px-6 py-4">
                    <Link 
                      to={`/customers/${customer.id}`}
                      className="text-emerald-400 hover:text-emerald-300 font-medium"
                    >
                      View Profile
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-16 bg-[#1e1e26] rounded-2xl border border-white/5">
          <p className="text-zinc-400">Tidak ada customer ditemukan.</p>
        </div>
      )}
    </AdminLayout>
  );
}
