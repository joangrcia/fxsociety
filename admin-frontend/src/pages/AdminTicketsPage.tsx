import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../components/admin/AdminLayout';
import { fetchAllTicketsAdmin, ApiError, type ApiTicket } from '../lib/api';
import { formatDate } from '../utils/orders';

export function AdminTicketsPage() {
  const [tickets, setTickets] = useState<ApiTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const navigate = useNavigate();

  useEffect(() => {
    loadTickets();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterStatus]);

  const loadTickets = async () => {
    setIsLoading(true);
    const token = localStorage.getItem('admin_token');
    if (!token) return;

    try {
      const response = await fetchAllTicketsAdmin(token, filterStatus);
      setTickets(response.items);
    } catch (err) {
      console.error('Failed to load tickets:', err);
      if (err instanceof ApiError && err.status === 401) {
        localStorage.removeItem('admin_token');
        navigate('/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const actions = (
    <select
      value={filterStatus}
      onChange={(e) => setFilterStatus(e.target.value)}
      className="bg-[#1e1e26] text-zinc-300 text-sm rounded-lg border border-white/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
    >
      <option value="all">Semua Status</option>
      <option value="open">Open</option>
      <option value="answered">Answered</option>
      <option value="closed">Closed</option>
    </select>
  );

  return (
    <AdminLayout title="Inbox Ticket" actions={actions}>
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-[#1e1e26] rounded-2xl p-5 animate-pulse h-24" />
          ))}
        </div>
      ) : tickets.length > 0 ? (
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <div key={ticket.id} className="bg-[#1e1e26] p-5 rounded-xl border border-white/5">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-white font-medium">{ticket.title}</h3>
                  <p className="text-zinc-400 text-sm mt-1">{ticket.message}</p>
                  <p className="text-zinc-600 text-xs mt-3">
                    ID: {ticket.id} • User ID: {ticket.user_id} • {formatDate(ticket.created_at)}
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs rounded capitalize ${
                  ticket.status === 'open' ? 'bg-emerald-500/10 text-emerald-400' : 
                  ticket.status === 'closed' ? 'bg-zinc-500/10 text-zinc-400' : 
                  'bg-blue-500/10 text-blue-400'
                }`}>
                  {ticket.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-[#1e1e26] rounded-2xl border border-white/5">
          <p className="text-zinc-400">Tidak ada tiket.</p>
        </div>
      )}
    </AdminLayout>
  );
}
