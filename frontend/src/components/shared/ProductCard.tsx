import { Link } from 'react-router-dom';
import { Badge } from './Badge';
import type { Product } from '../../types/product';
import type { BadgeStatus, ProductCategory } from './Badge';

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

const getGuidanceCue = (category: ProductCategory): string => {
  switch (category) {
    case 'indikator': return 'Cocok untuk Pemula';
    case 'robot': return 'Otomatisasi Penuh';
    case 'ebook': return 'Panduan Lengkap';
    case 'merchandise': return 'Official Gear';
    default: return 'Pilihan Tepat';
  }
};

export function ProductCard({ product }: ProductCardProps) {
  const { id, title, description, price, category, imageUrl, badge, isSoldOut } = product;

  // Determine which single badge to display (Strict Rule: Max 1)
  const renderBadge = () => {
    if (isSoldOut) {
      return <Badge variant="status" status="soldout" className="backdrop-blur-md bg-black/50" />;
    }
    if (badge) {
      return <Badge variant="status" status={badge as BadgeStatus} className="backdrop-blur-md bg-black/50" />;
    }
    return <Badge variant="category" category={category as ProductCategory} className="backdrop-blur-md bg-black/50" />;
  };

  return (
    <Link 
      to={`/product/${id}`} 
      className={`
        group relative flex flex-col
        h-full w-full
        bg-[#0f0f12] 
        rounded-2xl 
        border border-white/5
        overflow-hidden
        transition-all duration-500 ease-out
        hover:-translate-y-2
        hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)]
        hover:border-white/10
        ${isSoldOut ? 'opacity-75 grayscale-[0.5]' : ''}
      `}
    >
      {/* Image Container - 4:3 Aspect Ratio */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#14141a]">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
          loading="lazy"
        />
        
        {/* Dark Gradient Overlay at bottom of image for text readability transition */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0f0f12] to-transparent opacity-60" />

        {/* Single Badge Position */}
        <div className="absolute top-4 left-4 z-10">
          {renderBadge()}
        </div>
      </div>

      {/* Content Container */}
      <div className="flex flex-col flex-grow p-6 pt-4">
        
        {/* Guidance Cue - The "Why this?" element */}
        <div className="mb-3 flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-wider font-medium text-white/40 bg-white/5 px-2 py-1 rounded-md border border-white/5 group-hover:border-white/10 transition-colors">
            {getGuidanceCue(category as ProductCategory)}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-medium text-white mb-2 line-clamp-1 group-hover:text-orange-200 transition-colors duration-300">
          {title}
        </h3>
        
        {/* Description */}
        <p className="text-sm text-zinc-500 mb-6 line-clamp-2 leading-relaxed">
          {description}
        </p>

        {/* Footer: Price & Quiet CTA */}
        <div className="mt-auto flex items-end justify-between border-t border-white/5 pt-4">
          <div className="flex flex-col">
            <span className="text-[10px] text-zinc-600 mb-0.5 font-medium uppercase tracking-wide">Harga</span>
            <span className="text-lg font-semibold text-zinc-200 group-hover:text-orange-400 transition-colors">
              {formatPrice(price)}
            </span>
          </div>
          
          <div className="flex items-center gap-1 text-xs font-medium text-zinc-500 group-hover:text-white transition-colors">
            <span>Lihat Detail</span>
            <svg 
              className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}
