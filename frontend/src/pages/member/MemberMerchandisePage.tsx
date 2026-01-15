import { Link } from 'react-router-dom';

interface MerchOrder {
  id: string;
  items: string[];
  total: number;
  status: 'processing' | 'shipped' | 'delivered';
  trackingNumber?: string;
  courier?: string;
  date: string;
}

const merchOrders: MerchOrder[] = [
  {
    id: 'INV-001',
    items: ['FXSociety Hoodie (L)', 'Trading Cap (Black)'],
    total: 450000,
    status: 'shipped',
    trackingNumber: 'JP1234567890',
    courier: 'J&T Express',
    date: '2023-11-20',
  }
];

export function MemberMerchandisePage() {
  return (
    <div className="space-y-8 animate-fade-in">
      <header>
        <h1 className="text-3xl font-bold text-white mb-2">Merchandise</h1>
        <p className="text-zinc-400">Status pesanan dan pengiriman merchandise Anda.</p>
      </header>

      <div className="space-y-4">
        {merchOrders.length > 0 ? merchOrders.map((order) => (
          <div key={order.id} className="bg-[#14141a] rounded-2xl border border-white/5 p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-white/5">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-mono text-lg text-white">#{order.id}</h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border
                    ${order.status === 'processing' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : ''}
                    ${order.status === 'shipped' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : ''}
                    ${order.status === 'delivered' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : ''}
                  `}>
                    {order.status === 'processing' ? 'Diproses' : order.status === 'shipped' ? 'Dikirim' : 'Diterima'}
                  </span>
                </div>
                <p className="text-sm text-zinc-500">Dipesan tanggal {order.date}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-zinc-500 mb-1">Total Pesanan</p>
                <p className="text-xl font-bold text-white">
                  {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(order.total)}
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-sm font-semibold text-zinc-400 mb-3 uppercase tracking-wider">Item Pesanan</h4>
                <ul className="space-y-2">
                  {order.items.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-white text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-zinc-400 mb-3 uppercase tracking-wider">Info Pengiriman</h4>
                {order.trackingNumber ? (
                  <div className="bg-[#0a0a0f] rounded-xl p-4 border border-white/5">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-zinc-400">{order.courier}</span>
                      <button className="text-xs text-orange-400 hover:text-orange-300 font-medium">Salin Resi</button>
                    </div>
                    <div className="font-mono text-lg text-white tracking-widest">{order.trackingNumber}</div>
                    <a 
                      href={`https://cekresi.com/?noresi=${order.trackingNumber}`} 
                      target="_blank" 
                      rel="noreferrer"
                      className="inline-block mt-3 text-sm text-blue-400 hover:text-blue-300"
                    >
                      Lacak Paket →
                    </a>
                  </div>
                ) : (
                  <p className="text-sm text-zinc-500 italic">Resi belum tersedia.</p>
                )}
              </div>
            </div>
          </div>
        )) : (
          <div className="text-center py-20 bg-[#14141a] rounded-2xl border border-dashed border-white/5">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-zinc-500 mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-white mb-2">Belum ada pesanan merchandise</h3>
            <p className="text-zinc-500 mb-6">Lihat koleksi kaos dan aksesoris kami.</p>
            <Link to="/shop?category=merchandise" className="px-6 py-2 bg-white text-black font-medium rounded-xl hover:bg-zinc-200 transition-colors">
              Lihat Katalog
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
