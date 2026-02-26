import { useState, useEffect } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import { Badge, Button, OrderRequestForm, OrderSuccessView } from '../components/shared';
import { 
  fetchProduct, 
  createOrder, 
  apiProductToProduct, 
  fetchCurrentUser,
  type ApiProduct,
  type UserResponse
} from '../lib/api';
import { formatPrice } from '../utils/orders';
import type { Order, OrderFormData } from '../types/order';
import type { Product } from '../types/product';

type ViewState = 'detail' | 'order' | 'success';
type LoadingState = 'loading' | 'success' | 'error';

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [viewState, setViewState] = useState<ViewState>('detail');
  const [loadingState, setLoadingState] = useState<LoadingState>('loading');
  const [product, setProduct] = useState<Product | null>(null);
  const [apiProduct, setApiProduct] = useState<ApiProduct | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedOrder, setSubmittedOrder] = useState<Order | null>(null);
  const [currentUser, setCurrentUser] = useState<UserResponse | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      fetchCurrentUser(token)
        .then(setCurrentUser)
        .catch(() => {
          // Treat as guest if token invalid
        });
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const routeState = location.state as { openOrder?: boolean } | null;

    if (routeState?.openOrder === true && token) {
      setViewState('order');
      navigate(location.pathname + location.search, { replace: true, state: null });
    }
  }, [location.pathname, location.search, location.state, navigate]);

  useEffect(() => {
    if (!id) return;

    setLoadingState('loading');
    setError(null);

    fetchProduct(id)
      .then((data) => {
        setApiProduct(data);
        setProduct(apiProductToProduct(data));
        setLoadingState('success');
      })
      .catch((err) => {
        console.error('Failed to fetch product:', err);
        setError(err.message || 'Gagal memuat produk');
        setLoadingState('error');
      });
  }, [id]);

  const handleOrderClick = () => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      navigate('/login', {
        state: {
          from: location.pathname + location.search,
          openOrder: true,
        },
      });
      return;
    }

    setViewState('order');
  };

  const handleOrderSubmit = async (formData: OrderFormData) => {
    if (!apiProduct) return;

    setIsSubmitting(true);

    try {
      const orderResponse = await createOrder({
        product_id: apiProduct.id,
        name: formData.customerName,
        email: formData.customerEmail,
        whatsapp: formData.customerWhatsapp,
        notes: formData.notes,
      });

      // Convert to frontend Order type for display
      const order: Order = {
        id: orderResponse.order_code,
        productId: apiProduct.id.toString(),
        productTitle: apiProduct.title,
        productPrice: apiProduct.price_idr,
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerWhatsapp: formData.customerWhatsapp,
        notes: formData.notes,
        status: orderResponse.status,
        createdAt: orderResponse.created_at,
      };

      setSubmittedOrder(order);
      setViewState('success');
    } catch (err) {
      console.error('Failed to create order:', err);
      alert('Gagal membuat pesanan. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading State
  if (loadingState === 'loading') {
    return (
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-4 w-20 bg-zinc-800 rounded mb-8" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              <div className="aspect-square rounded-2xl bg-zinc-800" />
              <div className="space-y-4">
                <div className="h-10 w-3/4 bg-zinc-800 rounded" />
                <div className="h-4 w-full bg-zinc-800 rounded" />
                <div className="h-4 w-2/3 bg-zinc-800 rounded" />
                <div className="h-12 w-40 bg-zinc-800 rounded mt-8" />
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Error State
  if (loadingState === 'error' || !product) {
    return (
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Produk Tidak Ditemukan</h1>
          <p className="text-zinc-400 mb-8">
            {error || 'Produk yang Anda cari tidak tersedia atau sudah dihapus.'}
          </p>
          <Button href="/shop">Kembali ke Toko</Button>
        </div>
      </main>
    );
  }

  // Success View
  if (viewState === 'success' && submittedOrder) {
    return (
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-xl mx-auto">
          <OrderSuccessView order={submittedOrder} />
        </div>
      </main>
    );
  }

  // Order Form View
  if (viewState === 'order') {
    return (
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => setViewState('detail')}
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-8 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali ke Detail Produk
          </button>

          {/* Form Header */}
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Form Pemesanan
          </h1>
          <p className="text-zinc-400 mb-8">
            Isi data Anda untuk memesan produk ini.
          </p>

          {/* Order Form */}
          <div className="bg-[#1e1e26] rounded-2xl p-6 md:p-8 border border-white/5">
            <OrderRequestForm
              product={product}
              onSubmit={handleOrderSubmit}
              isLoading={isSubmitting}
              user={currentUser}
            />
          </div>
        </div>
      </main>
    );
  }

  // Product Detail View (default)
  return (
    <main className="pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center gap-2 text-sm">
            <li>
              <Link to="/shop" className="text-zinc-500 hover:text-white transition-colors">
                Toko
              </Link>
            </li>
            <li className="text-zinc-600">/</li>
            <li className="text-zinc-300">{product.title}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Image */}
          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden bg-[#14141a] border border-white/5">
              <img
                src={product.imageUrl}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              <Badge variant="category" category={product.category} />
              {product.badge && <Badge variant="status" status={product.badge} />}
              {product.isSoldOut && <Badge variant="status" status="soldout" />}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
              {product.title}
            </h1>

            <p className="text-zinc-400 leading-relaxed mb-6">
              {product.descriptionFull || product.description}
            </p>

            {/* Price */}
            <div className="mb-8">
              <span className="text-3xl md:text-4xl font-bold text-emerald-400">
                {formatPrice(product.price)}
              </span>
            </div>

            {/* Features Placeholder */}
            <div className="bg-[#14141a] rounded-xl p-5 border border-white/5 mb-8">
              <h3 className="text-white font-semibold mb-3">Termasuk:</h3>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Akses seumur hidup (lifetime)
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Update gratis untuk versi selanjutnya
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Panduan instalasi & penggunaan
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Support via WhatsApp
                </li>
              </ul>
            </div>

            {/* CTA Buttons */}
            {product.isSoldOut ? (
              <div className="bg-zinc-800/50 rounded-xl p-4 text-center">
                <p className="text-zinc-400">Produk ini sedang tidak tersedia</p>
              </div>
            ) : (
              <div className="space-y-3">
                <Button
                  size="lg"
                  className="w-full"
                  onClick={handleOrderClick}
                >
                  Pesan Sekarang
                </Button>
                <p className="text-xs text-zinc-500 text-center">
                  Pembayaran manual via transfer bank. Konfirmasi via WhatsApp.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-12 p-4 bg-slate-400/10 border border-slate-400/20 rounded-xl">
          <p className="text-sm text-slate-100/80">
            <strong>Disclaimer:</strong> Trading mengandung risiko tinggi. Tidak ada jaminan profit 
            dari penggunaan produk ini. Pastikan Anda memahami risiko sebelum membeli.
          </p>
        </div>
      </div>
    </main>
  );
}
