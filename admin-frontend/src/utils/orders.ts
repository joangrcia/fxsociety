import type { Order } from '../types/order';

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatDate(isoString: string): string {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(isoString));
}

export function getStatusLabel(status: Order['status']): string {
  const labels: Record<Order['status'], string> = {
    pending: 'Menunggu Konfirmasi',
    confirmed: 'Dikonfirmasi',
    completed: 'Selesai',
    cancelled: 'Dibatalkan',
  };
  return labels[status];
}

export function getStatusColor(status: Order['status']): string {
  const colors: Record<Order['status'], string> = {
    pending: 'bg-slate-400/20 text-slate-300 border-slate-400/30',
    confirmed: 'bg-slate-400/20 text-slate-300 border-slate-400/30',
    completed: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    cancelled: 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30',
  };
  return colors[status];
}
