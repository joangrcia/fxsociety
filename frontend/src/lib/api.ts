// API client for fxsociety backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// ============================================================================
// Types matching backend schemas
// ============================================================================

export type ProductCategory = 'indikator' | 'robot' | 'ebook' | 'merchandise';
export type BadgeStatus = 'new' | 'popular' | 'bestseller';
export type OrderStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface ApiProduct {
  id: number;
  slug: string;
  title: string;
  description_short: string;
  description_full: string | null;
  price_idr: number;
  category: ProductCategory;
  badges: BadgeStatus[] | null;
  images: string[] | null;
  is_active: boolean;
  created_at: string;
}

export interface ApiProductCreate {
  title: string;
  slug: string;
  description_short: string;
  description_full?: string;
  price_idr: number;
  category: string;
  badges?: string[];
  images?: string[];
  is_active?: boolean;
}

export interface ApiProductUpdate extends Partial<ApiProductCreate> {}

export interface ApiProductListResponse {
  items: ApiProduct[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface ApiOrderCreate {
  product_id: number;
  name: string;
  email: string;
  whatsapp: string;
  notes?: string;
}

export interface ApiOrder {
  id: number;
  order_code: string;
  product_id: number;
  name: string;
  email: string;
  whatsapp: string;
  notes: string | null;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
}

export interface ApiOrderWithProduct extends ApiOrder {
  product_title: string;
  product_price: number;
  product_category?: string;
  product_slug?: string;
  product_image?: string | null;
}

// Minimal order status response (no PII) for public lookup
export interface ApiOrderStatusPublic {
  order_code: string;
  status: OrderStatus;
  product_title: string;
  product_price: number;
  product_category?: string;
  created_at: string;
}

export interface ApiOrderListResponse {
  items: ApiOrderWithProduct[];
  total: number;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface UserCreate {
  email: string;
  password: string;
  full_name?: string;
}

export interface UserResponse {
  id: number;
  email: string;
  full_name?: string;
  is_active: boolean;
  created_at: string;
}

export interface ApiTicketCreate {
  title: string;
  message: string;
}

export interface ApiTicket {
  id: number;
  user_id: number;
  title: string;
  message: string;
  status: 'open' | 'answered' | 'closed';
  created_at: string;
  updated_at: string;
}

export interface ApiTicketListResponse {
  items: ApiTicket[];
  total: number;
}

// CRM Types
export interface DashboardStats {
  pending_orders: number;
  open_tickets: number;
  new_customers_7d: number;
  follow_up_needed: number;
}

export interface CustomerSummary {
  id: number;
  email: string;
  full_name?: string;
  total_orders: number;
  total_spend: number;
  last_activity?: string;
  tags: string[];
}

export interface CustomerTagResponse {
  id: number;
  customer_id: number;
  tag: string;
  created_at: string;
}

export interface CustomerNoteResponse {
  id: number;
  customer_id: number;
  note: string;
  created_by_admin: string;
  created_at: string;
}

export interface ActivityLogResponse {
  id: number;
  customer_id: number;
  type: string;
  reference_id?: string;
  metadata_json?: any;
  created_at: string;
}

// ============================================================================
// API Error handling
// ============================================================================

export class ApiError extends Error {
  status: number;
  statusText: string;
  detail?: string | { msg: string }[];

  constructor(
    status: number,
    statusText: string,
    detail?: string | { msg: string }[]
  ) {
    super(detail ? (typeof detail === 'string' ? detail : detail.map(d => d.msg).join(', ')) : statusText);
    this.name = 'ApiError';
    this.status = status;
    this.statusText = statusText;
    this.detail = detail;
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let detail;
    try {
      const data = await response.json();
      detail = data.detail;
    } catch {
      // Response is not JSON
    }
    throw new ApiError(response.status, response.statusText, detail);
  }
  return response.json();
}

// ============================================================================
// Auth Event System (for centralized 401 handling)
// ============================================================================

type AuthEventListener = () => void;
const authEventListeners: Set<AuthEventListener> = new Set();

/**
 * Subscribe to auth events (e.g., 401 unauthorized).
 * Used by AuthContext to trigger logout on token expiry.
 */
export function onAuthError(listener: AuthEventListener): () => void {
  authEventListeners.add(listener);
  return () => authEventListeners.delete(listener);
}

function emitAuthError() {
  authEventListeners.forEach(listener => listener());
}

// ============================================================================
// Authenticated Fetch Wrapper
// ============================================================================

interface FetchWithAuthOptions extends Omit<RequestInit, 'headers'> {
  headers?: Record<string, string>;
}

/**
 * Wrapper for fetch that:
 * 1. Automatically injects auth token from localStorage
 * 2. Handles 401 responses by emitting auth error event
 * 3. Centralizes error handling
 */
export async function fetchWithAuth<T>(
  endpoint: string,
  options: FetchWithAuthOptions = {}
): Promise<T> {
  const token = localStorage.getItem('auth_token');
  
  if (!token) {
    emitAuthError();
    throw new ApiError(401, 'Unauthorized', 'No token available');
  }

  const headers: Record<string, string> = {
    'Authorization': `Bearer ${token}`,
    ...options.headers,
  };

  // Add Content-Type for JSON bodies
  if (options.body && typeof options.body === 'string') {
    headers['Content-Type'] = headers['Content-Type'] || 'application/json';
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Handle 401 - token expired or invalid
  if (response.status === 401) {
    emitAuthError();
    throw new ApiError(401, 'Unauthorized', 'Session expired');
  }

  return handleResponse<T>(response);
}

// ============================================================================
// Auth API
// ============================================================================

export async function login(username: string, password: string): Promise<TokenResponse> {
  const formData = new URLSearchParams();
  formData.append('username', username);
  formData.append('password', password);

  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: formData,
  });
  
  return handleResponse<TokenResponse>(response);
}

export async function registerUser(data: UserCreate): Promise<UserResponse> {
  const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse<UserResponse>(response);
}

export async function fetchCurrentUser(token: string): Promise<UserResponse> {
  const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return handleResponse<UserResponse>(response);
}

// ============================================================================
// Products API
// ============================================================================

export interface ProductsQuery {
  category?: ProductCategory;
  search?: string;
  sort?: 'newest' | 'price_asc' | 'price_desc' | 'name';
  page?: number;
  page_size?: number;
}

export async function fetchProducts(query: ProductsQuery = {}): Promise<ApiProductListResponse> {
  const params = new URLSearchParams();
  
  if (query.category) params.append('category', query.category);
  if (query.search) params.append('search', query.search);
  if (query.sort) params.append('sort', query.sort);
  if (query.page) params.append('page', query.page.toString());
  if (query.page_size) params.append('page_size', query.page_size.toString());

  const url = `${API_BASE_URL}/api/products${params.toString() ? `?${params}` : ''}`;
  const response = await fetch(url);
  return handleResponse<ApiProductListResponse>(response);
}

export async function fetchProduct(idOrSlug: string | number): Promise<ApiProduct> {
  const url = `${API_BASE_URL}/api/products/${idOrSlug}`;
  const response = await fetch(url);
  return handleResponse<ApiProduct>(response);
}

// ============================================================================
// Orders API
// ============================================================================

export async function createOrder(data: ApiOrderCreate): Promise<ApiOrder> {
  const url = `${API_BASE_URL}/api/orders`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse<ApiOrder>(response);
}

export async function fetchOrderStatus(orderCode: string): Promise<ApiOrderStatusPublic> {
  const url = `${API_BASE_URL}/api/orders/${orderCode}`;
  const response = await fetch(url);
  return handleResponse<ApiOrderStatusPublic>(response);
}

// The public email-based lookup has been removed for security (PII exposure)
// Re-added as stub to satisfy build requirements for OrdersPage
export async function fetchOrdersByEmail(email: string): Promise<ApiOrderListResponse> {
  console.warn(`fetchOrdersByEmail(${email}) is deprecated and removed from backend. Please use login.`);
  // Return empty result
  return { items: [], total: 0 };
}

export async function fetchMyOrders(token: string): Promise<ApiOrderListResponse> {
  const response = await fetch(`${API_BASE_URL}/api/orders/me`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return handleResponse<ApiOrderListResponse>(response);
}

// ============================================================================
// Tickets API
// ============================================================================

export async function fetchMyTickets(token: string): Promise<ApiTicketListResponse> {
  const response = await fetch(`${API_BASE_URL}/api/tickets`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return handleResponse<ApiTicketListResponse>(response);
}

export async function createTicket(token: string, data: ApiTicketCreate): Promise<ApiTicket> {
  const response = await fetch(`${API_BASE_URL}/api/tickets`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return handleResponse<ApiTicket>(response);
}

export async function fetchAllTicketsAdmin(token: string, status?: string): Promise<ApiTicketListResponse> {
  const url = `${API_BASE_URL}/api/tickets/admin/all${status && status !== 'all' ? `?status=${status}` : ''}`;
  const response = await fetch(url, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return handleResponse<ApiTicketListResponse>(response);
}

// ============================================================================
// Admin Orders API
// ============================================================================

export async function fetchAllOrdersAdmin(token: string, status?: string): Promise<ApiOrderListResponse> {
  const url = `${API_BASE_URL}/api/orders/admin/all${status && status !== 'all' ? `?status=${status}` : ''}`;
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return handleResponse<ApiOrderListResponse>(response);
}

export async function updateOrderStatus(token: string, orderId: number, status: OrderStatus): Promise<ApiOrder> {
  const response = await fetch(`${API_BASE_URL}/api/orders/admin/${orderId}/status`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  });
  return handleResponse<ApiOrder>(response);
}

// ============================================================================
// Admin Products API
// ============================================================================

export async function fetchAllProductsAdmin(token: string, page: number = 1, search?: string): Promise<ApiProductListResponse> {
  const params = new URLSearchParams();
  params.append('page', page.toString());
  if (search) params.append('search', search);
  
  const url = `${API_BASE_URL}/api/products/admin/all?${params}`;
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return handleResponse<ApiProductListResponse>(response);
}

export async function createProductAdmin(token: string, data: ApiProductCreate): Promise<ApiProduct> {
  const response = await fetch(`${API_BASE_URL}/api/products/admin`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return handleResponse<ApiProduct>(response);
}

export async function updateProductAdmin(token: string, productId: number, data: ApiProductUpdate): Promise<ApiProduct> {
  const response = await fetch(`${API_BASE_URL}/api/products/admin/${productId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return handleResponse<ApiProduct>(response);
}

export async function toggleProductActiveAdmin(token: string, productId: number): Promise<ApiProduct> {
  const response = await fetch(`${API_BASE_URL}/api/products/admin/${productId}/toggle-active`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return handleResponse<ApiProduct>(response);
}

// ============================================================================
// Admin CRM API
// ============================================================================

export async function fetchDashboardStats(token: string): Promise<DashboardStats> {
  const response = await fetch(`${API_BASE_URL}/api/admin/stats`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return handleResponse<DashboardStats>(response);
}

export async function fetchCustomers(token: string, params: { page?: number, search?: string, tag?: string, sort?: string } = {}): Promise<CustomerSummary[]> {
  const query = new URLSearchParams();
  if (params.page) query.append('page', params.page.toString());
  if (params.search) query.append('search', params.search);
  if (params.tag) query.append('tag', params.tag);
  if (params.sort) query.append('sort', params.sort);
  
  const response = await fetch(`${API_BASE_URL}/api/admin/customers?${query}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return handleResponse<CustomerSummary[]>(response);
}

export async function fetchCustomer(token: string, id: number): Promise<CustomerSummary> {
  const response = await fetch(`${API_BASE_URL}/api/admin/customers/${id}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return handleResponse<CustomerSummary>(response);
}

export async function fetchCustomerOrders(token: string, customerId: number): Promise<ApiOrderListResponse> {
  const response = await fetch(`${API_BASE_URL}/api/admin/customers/${customerId}/orders`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  // Adjust response since backend returns list, not pagination object
  const items = await handleResponse<ApiOrderWithProduct[]>(response);
  return { items, total: items.length };
}

export async function fetchCustomerTickets(token: string, customerId: number): Promise<ApiTicketListResponse> {
  const response = await fetch(`${API_BASE_URL}/api/admin/customers/${customerId}/tickets`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const items = await handleResponse<ApiTicket[]>(response);
  return { items, total: items.length };
}

export async function fetchCustomerTags(token: string, customerId: number): Promise<CustomerTagResponse[]> {
  const response = await fetch(`${API_BASE_URL}/api/admin/customers/${customerId}/tags`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return handleResponse<CustomerTagResponse[]>(response);
}

export async function addCustomerTag(token: string, customerId: number, tag: string): Promise<CustomerTagResponse> {
  const response = await fetch(`${API_BASE_URL}/api/admin/customers/${customerId}/tags`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ tag }),
  });
  return handleResponse<CustomerTagResponse>(response);
}

export async function removeCustomerTag(token: string, customerId: number, tag: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/admin/customers/${customerId}/tags/${tag}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!response.ok) throw new ApiError(response.status, response.statusText);
}

export async function fetchCustomerNotes(token: string, customerId: number): Promise<CustomerNoteResponse[]> {
  const response = await fetch(`${API_BASE_URL}/api/admin/customers/${customerId}/notes`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return handleResponse<CustomerNoteResponse[]>(response);
}

export async function addCustomerNote(token: string, customerId: number, note: string): Promise<CustomerNoteResponse> {
  const response = await fetch(`${API_BASE_URL}/api/admin/customers/${customerId}/notes`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ note }),
  });
  return handleResponse<CustomerNoteResponse>(response);
}

export async function fetchCustomerActivity(token: string, customerId: number): Promise<ActivityLogResponse[]> {
  const response = await fetch(`${API_BASE_URL}/api/admin/customers/${customerId}/activity`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return handleResponse<ActivityLogResponse[]>(response);
}

// ============================================================================
// Adapters: Convert API types to frontend types
// ============================================================================

import type { Product } from '../types/product';
import type { Order } from '../types/order';

export function apiProductToProduct(p: ApiProduct): Product {
  return {
    id: p.id.toString(),
    slug: p.slug,
    title: p.title,
    description: p.description_short,
    descriptionFull: p.description_full,
    price: p.price_idr,
    category: p.category,
    imageUrl: p.images?.[0] || '',
    images: p.images || [],
    badge: p.badges?.[0] || undefined,
    isSoldOut: !p.is_active,
  };
}

export function apiOrderToOrder(o: ApiOrderWithProduct): Order {
  return {
    id: o.order_code,
    numericId: o.id, // Map internal ID
    productId: o.product_id.toString(),
    productTitle: o.product_title,
    productPrice: o.product_price,
    productCategory: o.product_category,
    productSlug: o.product_slug,
    productImage: o.product_image || undefined,
    customerName: o.name,
    customerEmail: o.email,
    customerWhatsapp: o.whatsapp,
    notes: o.notes ?? undefined,
    status: o.status,
    createdAt: o.created_at,
  };
}
