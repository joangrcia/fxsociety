export type OrderStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface Order {
  id: string; // Display ID (order_code)
  numericId?: number; // Internal ID for admin operations
  productId: string;
  productTitle: string;
  productPrice: number;
  productCategory?: string;
  productSlug?: string;
  productImage?: string;
  customerName: string;
  customerEmail: string;
  customerWhatsapp: string;
  notes?: string;
  status: OrderStatus;
  createdAt: string;
}

export interface OrderFormData {
  customerName: string;
  customerEmail: string;
  customerWhatsapp: string;
  notes?: string;
}
