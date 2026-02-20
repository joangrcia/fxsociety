import { Link } from 'react-router-dom';
import { Button } from './Button';
import type { Order } from '../../types/order';
import { formatPrice, formatDate, getStatusLabel, getStatusColor } from '../../utils/orders';

interface OrderSuccessViewProps {
  order: Order;
}

export function OrderSuccessView({ order }: OrderSuccessViewProps) {
  // Generate WhatsApp message
  const whatsappMessage = encodeURIComponent(
    `Halo, saya ingin konfirmasi pembayaran untuk pesanan:\n\n` +
    `Order ID: ${order.id}\n` +
    `Produk: ${order.productTitle}\n` +
    `Total: ${formatPrice(order.productPrice)}\n` +
    `Nama: ${order.customerName}\n\n` +
    `Mohon konfirmasi pesanan saya. Terima kasih!`
  );
  const whatsappLink = `https://wa.me/6281234567890?text=${whatsappMessage}`;

  return (
    <div className="text-center">
      {/* Success Icon */}
      <div className="w-20 h-20 rounded-full bg-orange-500/20 flex items-center justify-center mx-auto mb-6">
        <svg className="w-10 h-10 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>

      {/* Success Message */}
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
        Pesanan Berhasil Dibuat!
      </h2>
      <p className="text-zinc-400 mb-8">
        Silakan lakukan pembayaran dan konfirmasi via WhatsApp.
      </p>

      {/* Order Details Card */}
      <div className="bg-[#14141a] rounded-2xl p-6 border border-white/5 text-left mb-8">
        <div className="space-y-4">
          {/* Order ID */}
          <div className="flex justify-between items-start">
            <span className="text-zinc-500 text-sm">Order ID</span>
            <span className="text-white font-mono font-medium">{order.id}</span>
          </div>

          {/* Status */}
          <div className="flex justify-between items-center">
            <span className="text-zinc-500 text-sm">Status</span>
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
              {getStatusLabel(order.status)}
            </span>
          </div>

          {/* Product */}
          <div className="flex justify-between items-start">
            <span className="text-zinc-500 text-sm">Produk</span>
            <span className="text-white text-right">{order.productTitle}</span>
          </div>

          {/* Total */}
          <div className="flex justify-between items-center pt-4 border-t border-white/5">
            <span className="text-zinc-300 font-medium">Total</span>
            <span className="text-orange-400 text-xl font-bold">{formatPrice(order.productPrice)}</span>
          </div>

          {/* Date */}
          <div className="flex justify-between items-start">
            <span className="text-zinc-500 text-sm">Tanggal</span>
            <span className="text-zinc-400 text-sm">{formatDate(order.createdAt)}</span>
          </div>
        </div>
      </div>

      {/* Payment Instructions */}
      <div className="bg-[#1e1e26] rounded-2xl p-6 border border-white/5 text-left mb-8">
        <h3 className="text-white font-semibold mb-4">Instruksi Pembayaran</h3>
        <ol className="space-y-3 text-sm text-zinc-400">
          <li className="flex gap-3">
            <span className="w-6 h-6 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0 text-xs font-medium">1</span>
            <span>Transfer ke rekening BCA <strong className="text-white">1234567890</strong> a.n. <strong className="text-white">FXSociety</strong></span>
          </li>
          <li className="flex gap-3">
            <span className="w-6 h-6 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0 text-xs font-medium">2</span>
            <span>Transfer sesuai total: <strong className="text-orange-400">{formatPrice(order.productPrice)}</strong></span>
          </li>
          <li className="flex gap-3">
            <span className="w-6 h-6 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0 text-xs font-medium">3</span>
            <span>Kirim bukti transfer via WhatsApp untuk konfirmasi</span>
          </li>
          <li className="flex gap-3">
            <span className="w-6 h-6 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0 text-xs font-medium">4</span>
            <span>Produk akan dikirim setelah pembayaran dikonfirmasi (maks. 1x24 jam)</span>
          </li>
        </ol>
      </div>

      {/* CTA Buttons */}
      <div className="space-y-3">
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 w-full px-6 py-4 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-500 transition-colors"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Hubungi WhatsApp untuk Konfirmasi
        </a>

        <div className="flex gap-3">
          <Link to="/orders" className="flex-1">
            <Button variant="secondary" className="w-full">
              Lihat Pesanan Saya
            </Button>
          </Link>
          <Link to="/shop" className="flex-1">
            <Button variant="ghost" className="w-full">
              Kembali ke Toko
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
