import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AdminLayout } from '../components/admin/AdminLayout';
import { 
  fetchCustomer, 
  fetchCustomerOrders, 
  fetchCustomerTickets,
  fetchCustomerTags,
  fetchCustomerNotes,
  fetchCustomerActivity,
  addCustomerTag,
  removeCustomerTag,
  addCustomerNote,
  ApiError,
  apiOrderToOrder,
  type CustomerSummary,
  type ApiTicket,
  type CustomerTagResponse,
  type CustomerNoteResponse,
  type ActivityLogResponse
} from '../lib/api';
import { formatPrice, formatDate, getStatusLabel, getStatusColor } from '../utils/orders';
import { Button } from '../components/shared';
import type { Order } from '../types/order';

type Tab = 'overview' | 'orders' | 'tickets' | 'notes' | 'activity';

export function AdminCustomerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [customer, setCustomer] = useState<CustomerSummary | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [tickets, setTickets] = useState<ApiTicket[]>([]);
  const [tags, setTags] = useState<CustomerTagResponse[]>([]);
  const [notes, setNotes] = useState<CustomerNoteResponse[]>([]);
  const [activity, setActivity] = useState<ActivityLogResponse[]>([]);
  
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [newTag, setNewTag] = useState('');
  const [newNote, setNewNote] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    if (id) loadData(parseInt(id));
  }, [id]);

  const loadData = async (customerId: number) => {
    setIsLoading(true);
    const token = localStorage.getItem('admin_token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const [custRes, ordRes, ticRes, tagRes, notRes, actRes] = await Promise.all([
        fetchCustomer(token, customerId),
        fetchCustomerOrders(token, customerId),
        fetchCustomerTickets(token, customerId),
        fetchCustomerTags(token, customerId),
        fetchCustomerNotes(token, customerId),
        fetchCustomerActivity(token, customerId)
      ]);
      
      setCustomer(custRes);
      setOrders(ordRes.items.map(apiOrderToOrder));
      setTickets(ticRes.items);
      setTags(tagRes);
      setNotes(notRes);
      setActivity(actRes);
    } catch (err) {
      console.error('Failed to load customer data:', err);
      if (err instanceof ApiError && err.status === 401) {
        localStorage.removeItem('admin_token');
        navigate('/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer || !newTag.trim()) return;
    const token = localStorage.getItem('admin_token');
    if (!token) return;

    try {
      const tag = await addCustomerTag(token, customer.id, newTag.trim());
      setTags([...tags, tag]);
      setNewTag('');
    } catch (err) {
      alert('Failed to add tag');
    }
  };

  const handleRemoveTag = async (tag: string) => {
    if (!customer) return;
    const token = localStorage.getItem('admin_token');
    if (!token) return;

    try {
      await removeCustomerTag(token, customer.id, tag);
      setTags(tags.filter(t => t.tag !== tag));
    } catch (err) {
      alert('Failed to remove tag');
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer || !newNote.trim()) return;
    const token = localStorage.getItem('admin_token');
    if (!token) return;

    try {
      const note = await addCustomerNote(token, customer.id, newNote.trim());
      setNotes([note, ...notes]);
      setNewNote('');
    } catch (err) {
      alert('Failed to add note');
    }
  };

  if (isLoading || !customer) {
    return (
      <AdminLayout title="Loading...">
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-[#1e1e26] rounded-xl" />
          <div className="h-64 bg-[#1e1e26] rounded-xl" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* Header */}
      <div className="bg-[#1e1e26] p-6 rounded-xl border border-white/5 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">{customer.full_name || 'No Name'}</h1>
            <div className="flex items-center gap-2 text-zinc-400 text-sm">
              <span>{customer.email}</span>
              {customer.tags.length > 0 && <span className="text-zinc-600">•</span>}
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <span key={tag.id} className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded text-xs">
                    {tag.tag}
                    <button onClick={() => handleRemoveTag(tag.tag)} className="hover:text-white">×</button>
                  </span>
                ))}
              </div>
            </div>
            
            {/* Add Tag */}
            <form onSubmit={handleAddTag} className="mt-3 flex gap-2">
              <input 
                value={newTag}
                onChange={e => setNewTag(e.target.value)}
                placeholder="+ Add tag"
                className="bg-[#14141a] text-xs text-white rounded px-2 py-1 border border-white/10 w-32"
              />
            </form>
          </div>
          
          <div className="flex gap-4 text-right">
            <div>
              <p className="text-zinc-500 text-xs uppercase">Total Spend</p>
              <p className="text-emerald-400 font-bold text-lg">{formatPrice(customer.total_spend)}</p>
            </div>
            <div>
              <p className="text-zinc-500 text-xs uppercase">Orders</p>
              <p className="text-white font-bold text-lg">{customer.total_orders}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/5 mb-6 overflow-x-auto">
        {(['overview', 'orders', 'tickets', 'notes', 'activity'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 text-sm font-medium whitespace-nowrap capitalize transition-colors ${
              activeTab === tab 
                ? 'text-emerald-400 border-b-2 border-emerald-400' 
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#1e1e26] p-6 rounded-xl border border-white/5">
              <h3 className="font-bold text-white mb-4">Quick Stats</h3>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-zinc-400">First Seen</dt>
                  <dd className="text-white">{formatDate(customer.last_activity || '')}</dd> 
                </div>
                <div className="flex justify-between">
                  <dt className="text-zinc-400">Last Activity</dt>
                  <dd className="text-white">{customer.last_activity ? formatDate(customer.last_activity) : '-'}</dd>
                </div>
              </dl>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order.id} className="bg-[#1e1e26] p-4 rounded-xl border border-white/5 flex justify-between items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium">{order.productTitle}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] ${getStatusColor(order.status)}`}>
                      {getStatusLabel(order.status)}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500">{order.id} • {formatDate(order.createdAt)}</p>
                </div>
                <p className="text-emerald-400 font-bold text-sm">{formatPrice(order.productPrice)}</p>
              </div>
            ))}
            {orders.length === 0 && <p className="text-zinc-500 text-center py-8">No orders.</p>}
          </div>
        )}

        {activeTab === 'tickets' && (
          <div className="space-y-4">
            {tickets.map(ticket => (
              <div key={ticket.id} className="bg-[#1e1e26] p-4 rounded-xl border border-white/5">
                <div className="flex justify-between">
                  <h4 className="text-white font-medium">{ticket.title}</h4>
                  <span className="text-xs bg-white/10 px-2 py-1 rounded">{ticket.status}</span>
                </div>
                <p className="text-zinc-400 text-sm mt-1">{ticket.message}</p>
                <p className="text-zinc-600 text-xs mt-2">{formatDate(ticket.created_at)}</p>
              </div>
            ))}
            {tickets.length === 0 && <p className="text-zinc-500 text-center py-8">No tickets.</p>}
          </div>
        )}

        {activeTab === 'notes' && (
          <div>
            <form onSubmit={handleAddNote} className="mb-6">
              <textarea
                value={newNote}
                onChange={e => setNewNote(e.target.value)}
                placeholder="Add internal note..."
                className="w-full bg-[#14141a] text-white rounded-lg border border-white/10 p-3 text-sm focus:ring-emerald-500"
                rows={3}
              />
              <div className="flex justify-end mt-2">
                <Button size="sm" type="submit">Add Note</Button>
              </div>
            </form>
            <div className="space-y-4">
              {notes.map(note => (
                <div key={note.id} className="bg-[#1e1e26] p-4 rounded-xl border border-white/5">
                  <p className="text-zinc-300 text-sm whitespace-pre-wrap">{note.note}</p>
                  <p className="text-zinc-600 text-xs mt-2">
                    {note.created_by_admin} • {formatDate(note.created_at)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="space-y-4">
            {activity.map(log => (
              <div key={log.id} className="flex gap-4 items-start">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 shrink-0" />
                <div>
                  <p className="text-white text-sm font-medium">
                    {log.type.replace('_', ' ').toUpperCase()} 
                    {log.reference_id && <span className="text-zinc-500 ml-1">#{log.reference_id}</span>}
                  </p>
                  <p className="text-zinc-500 text-xs">{formatDate(log.created_at)}</p>
                  {log.metadata_json && (
                    <pre className="text-xs text-zinc-600 mt-1 font-mono">
                      {JSON.stringify(log.metadata_json, null, 2)}
                    </pre>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
