import { useState, type FormEvent, useEffect } from 'react';
import { Button } from './Button';
import type { Product } from '../../types/product';
import type { OrderFormData } from '../../types/order';
import type { UserResponse } from '../../lib/api';
import { formatPrice } from '../../utils/orders';

interface OrderRequestFormProps {
  product: Product;
  onSubmit: (data: OrderFormData) => void;
  isLoading?: boolean;
  user?: UserResponse | null;
}

export function OrderRequestForm({ product, onSubmit, isLoading = false, user }: OrderRequestFormProps) {
  const [formData, setFormData] = useState<OrderFormData>({
    customerName: '',
    customerEmail: '',
    customerWhatsapp: '',
    notes: '',
  });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        customerName: user.full_name || '',
        customerEmail: user.email || '',
      }));
    }
  }, [user]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field: keyof OrderFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Product Info */}
      <div className="bg-[#14141a] rounded-xl p-4 border border-white/5">
        <p className="text-sm text-zinc-500 mb-1">Produk yang dipesan</p>
        <p className="text-white font-medium">{product.title}</p>
        <p className="text-emerald-400 font-bold mt-1">{formatPrice(product.price)}</p>
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        {/* Nama */}
        <div>
          <label htmlFor="customerName" className="block text-sm font-medium text-zinc-300 mb-2">
            Nama Lengkap <span className="text-red-400">*</span>
          </label>
          <input
            id="customerName"
            type="text"
            value={formData.customerName}
            onChange={(e) => handleChange('customerName', e.target.value)}
            placeholder="Masukkan nama lengkap"
            required
            className="w-full bg-[#14141a] text-white rounded-lg border border-white/10 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder:text-zinc-600 transition-all"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="customerEmail" className="block text-sm font-medium text-zinc-300 mb-2">
            Email <span className="text-red-400">*</span>
          </label>
          <input
            id="customerEmail"
            type="email"
            value={formData.customerEmail}
            onChange={(e) => handleChange('customerEmail', e.target.value)}
            placeholder="nama@email.com"
            required
            className="w-full bg-[#14141a] text-white rounded-lg border border-white/10 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder:text-zinc-600 transition-all"
          />
        </div>

        {/* WhatsApp */}
        <div>
          <label htmlFor="customerWhatsapp" className="block text-sm font-medium text-zinc-300 mb-2">
            Nomor WhatsApp <span className="text-red-400">*</span>
          </label>
          <input
            id="customerWhatsapp"
            type="tel"
            value={formData.customerWhatsapp}
            onChange={(e) => handleChange('customerWhatsapp', e.target.value)}
            placeholder="08123456789"
            required
            className="w-full bg-[#14141a] text-white rounded-lg border border-white/10 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder:text-zinc-600 transition-all"
          />
          <p className="text-xs text-zinc-500 mt-1">
            Kami akan menghubungi Anda via WhatsApp untuk konfirmasi
          </p>
        </div>

        {/* Catatan */}
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-zinc-300 mb-2">
            Catatan <span className="text-zinc-500">(opsional)</span>
          </label>
          <textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            placeholder="Tambahkan catatan jika diperlukan..."
            rows={3}
            className="w-full bg-[#14141a] text-white rounded-lg border border-white/10 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder:text-zinc-600 transition-all resize-none"
          />
        </div>
      </div>

      {/* Submit Button */}
      <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
        Buat Pesanan
      </Button>

      {/* Disclaimer */}
      <p className="text-xs text-zinc-500 text-center">
        Dengan membuat pesanan, Anda menyetujui bahwa trading mengandung risiko 
        dan tidak ada jaminan profit dari produk kami.
      </p>
    </form>
  );
}
