import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../components/admin/AdminLayout';
import { Button } from '../components/shared';
import { 
  fetchAllProductsAdmin, 
  createProductAdmin, 
  updateProductAdmin, 
  toggleProductActiveAdmin,
  ApiError, 
  apiProductToProduct,
  type ApiProductCreate
} from '../lib/api';
import { formatPrice } from '../utils/orders';
import type { Product } from '../types/product';

type ViewMode = 'list' | 'create' | 'edit';

export function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadProducts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadProducts = async () => {
    setIsLoading(true);
    const token = localStorage.getItem('admin_token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetchAllProductsAdmin(token, 1);
      setProducts(response.items.map(apiProductToProduct));
    } catch (err) {
      console.error('Failed to load products:', err);
      if (err instanceof ApiError && err.status === 401) {
        localStorage.removeItem('admin_token');
        navigate('/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleActive = async (product: Product) => {
    const token = localStorage.getItem('admin_token');
    if (!token) return;

    try {
      await toggleProductActiveAdmin(token, parseInt(product.id));
      loadProducts();
    } catch {
      alert('Gagal update status produk');
    }
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setViewMode('edit');
  };

  const handleCreate = () => {
    setSelectedProduct(null);
    setViewMode('create');
  };

  const handleFormSubmit = async () => {
    setViewMode('list');
    loadProducts();
  };

  const actions = (
    viewMode === 'list' && (
      <Button size="sm" onClick={handleCreate}>
        + Tambah Produk
      </Button>
    )
  );

  return (
    <AdminLayout title="Products" actions={actions}>
      {viewMode === 'list' ? (
        <ProductList 
          products={products} 
          isLoading={isLoading} 
          onEdit={handleEdit} 
          onToggleActive={handleToggleActive} 
        />
      ) : (
        <ProductForm 
          product={selectedProduct || undefined} 
          onSubmit={handleFormSubmit} 
          onCancel={() => setViewMode('list')} 
        />
      )}
    </AdminLayout>
  );
}

function ProductList({ products, isLoading, onEdit, onToggleActive }: { products: Product[]; isLoading: boolean; onEdit: (p: Product) => void; onToggleActive: (p: Product) => void }) {
  if (isLoading) {
    return <div className="space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="bg-[#1e1e26] h-24 rounded-xl animate-pulse" />)}</div>;
  }

  return (
    <div className="space-y-4">
      {products.map((product: Product) => (
        <div key={product.id} className={`bg-[#1e1e26] rounded-xl border p-4 flex gap-4 items-center ${product.isSoldOut ? 'border-red-500/20' : 'border-white/5'}`}>
          <div className="w-16 h-16 bg-zinc-800 rounded-lg overflow-hidden shrink-0">
            <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-white font-medium truncate">{product.title}</h3>
              {!product.isSoldOut ? (
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded">Active</span>
              ) : (
                <span className="text-[10px] bg-zinc-500/20 text-zinc-400 px-2 py-0.5 rounded">Inactive</span>
              )}
              {product.badge && <span className="text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded uppercase">{product.badge}</span>}
            </div>
            <p className="text-sm text-zinc-400">{formatPrice(product.price)} • {product.category}</p>
          </div>

          <div className="flex gap-2">
            <button 
              onClick={() => onEdit(product)}
              className="px-3 py-1.5 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded-lg text-sm"
            >
              Edit
            </button>
            <button 
              onClick={() => onToggleActive(product)}
              className={`px-3 py-1.5 rounded-lg text-sm ${
                !product.isSoldOut 
                  ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' 
                  : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
              }`}
            >
              {!product.isSoldOut ? 'Deactivate' : 'Activate'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function ProductForm({ product, onSubmit, onCancel }: { product?: Product, onSubmit: () => void, onCancel: () => void }) {
  const [formData, setFormData] = useState<ApiProductCreate>({
    title: product?.title || '',
    slug: product?.slug || '',
    description_short: product?.description || '',
    description_full: product?.descriptionFull || '',
    price_idr: product?.price || 0,
    category: product?.category || 'indikator',
    images: product?.images || [product?.imageUrl || ''],
    badges: product?.badge ? [product.badge] : [],
    is_active: !product?.isSoldOut
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const token = localStorage.getItem('admin_token');
    if (!token) return;

    try {
      if (product) {
        await updateProductAdmin(token, parseInt(product.id), formData);
      } else {
        await createProductAdmin(token, formData);
      }
      onSubmit();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      alert('Error: ' + message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof ApiProductCreate, value: string | number | boolean | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-[#1e1e26] rounded-2xl p-6 border border-white/5">
      <h2 className="text-xl font-bold text-white mb-6">
        {product ? 'Edit Produk' : 'Tambah Produk Baru'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Form content (same as before) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-zinc-400 mb-1">Nama Produk</label>
            <input 
              className="w-full bg-[#14141a] text-white rounded p-2 border border-white/10"
              value={formData.title}
              onChange={e => handleChange('title', e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm text-zinc-400 mb-1">Slug (URL)</label>
            <input 
              className="w-full bg-[#14141a] text-white rounded p-2 border border-white/10"
              value={formData.slug}
              onChange={e => handleChange('slug', e.target.value)}
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-zinc-400 mb-1">Deskripsi Singkat</label>
          <textarea 
            className="w-full bg-[#14141a] text-white rounded p-2 border border-white/10"
            value={formData.description_short}
            onChange={e => handleChange('description_short', e.target.value)}
            required
            rows={2}
          />
        </div>

        <div>
          <label className="block text-sm text-zinc-400 mb-1">Deskripsi Lengkap</label>
          <textarea 
            className="w-full bg-[#14141a] text-white rounded p-2 border border-white/10"
            value={formData.description_full}
            onChange={e => handleChange('description_full', e.target.value)}
            rows={4}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-zinc-400 mb-1">Harga (IDR)</label>
            <input 
              type="number"
              className="w-full bg-[#14141a] text-white rounded p-2 border border-white/10"
              value={formData.price_idr}
              onChange={e => handleChange('price_idr', parseInt(e.target.value))}
              required
            />
          </div>
          <div>
            <label className="block text-sm text-zinc-400 mb-1">Kategori</label>
            <select 
              className="w-full bg-[#14141a] text-white rounded p-2 border border-white/10"
              value={formData.category}
              onChange={e => handleChange('category', e.target.value)}
            >
              <option value="indikator">Indikator</option>
              <option value="robot">Robot EA</option>
              <option value="ebook">Ebook</option>
              <option value="merchandise">Merchandise</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-zinc-400 mb-1">Badge (Optional)</label>
            <select 
              className="w-full bg-[#14141a] text-white rounded p-2 border border-white/10"
              value={formData.badges?.[0] || ''}
              onChange={e => handleChange('badges', e.target.value ? [e.target.value] : [])}
            >
              <option value="">None</option>
              <option value="new">New</option>
              <option value="popular">Popular</option>
              <option value="bestseller">Bestseller</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm text-zinc-400 mb-1">Image URL</label>
          <input 
            className="w-full bg-[#14141a] text-white rounded p-2 border border-white/10"
            value={formData.images?.[0] || ''}
            onChange={e => handleChange('images', [e.target.value])}
            placeholder="https://..."
            required
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="submit" isLoading={isSubmitting}>
            {product ? 'Simpan Perubahan' : 'Buat Produk'}
          </Button>
          <Button variant="ghost" type="button" onClick={onCancel}>
            Batal
          </Button>
        </div>
      </form>
    </div>
  );
}
