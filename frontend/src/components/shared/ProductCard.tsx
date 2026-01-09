import { Link } from 'react-router-dom';
import { Badge } from './Badge';
import type { Product } from '../../types/product';

interface ProductCardProps {
  product: Product;
  variant?: 'default' | 'featured';
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function ProductCard({ product, variant = 'default' }: ProductCardProps) {
  const { id, title, description, price, category, imageUrl, badge, isSoldOut } = product;

  const cardStyles = `
    group relative
    bg-[#1e1e26] 
    rounded-2xl 
    border border-white/5
    overflow-hidden
    transition-all duration-300
    hover:-translate-y-1
    hover:border-emerald-500/30
    hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)]
    ${isSoldOut ? 'opacity-70' : ''}
    ${variant === 'featured' ? 'ring-1 ring-emerald-500/20' : ''}
  `;

  return (
    <Link to={`/product/${id}`} className={cardStyles}>
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[#14141a]">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <Badge variant="category" category={category} />
          {badge && <Badge variant="status" status={badge} />}
          {isSoldOut && <Badge variant="status" status="soldout" />}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-semibold text-white mb-2 line-clamp-1 group-hover:text-emerald-400 transition-colors">
          {title}
        </h3>
        
        <p className="text-sm text-zinc-400 mb-4 line-clamp-2">
          {description}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-emerald-400">
            {formatPrice(price)}
          </span>
          
          <span className="text-sm text-zinc-500 group-hover:text-emerald-400 transition-colors">
            Lihat Detail →
          </span>
        </div>
      </div>
    </Link>
  );
}
