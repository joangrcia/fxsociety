type BadgeVariant = 'category' | 'status';
type BadgeStatus = 'new' | 'popular' | 'bestseller' | 'soldout';
type ProductCategory = 'indikator' | 'robot' | 'ebook' | 'merchandise';

interface BadgeProps {
  variant: BadgeVariant;
  category?: ProductCategory;
  status?: BadgeStatus;
  className?: string;
}

const categoryLabels: Record<ProductCategory, string> = {
  indikator: 'Indikator',
  robot: 'Robot EA',
  ebook: 'Ebook',
  merchandise: 'Merchandise',
};

const statusLabels: Record<BadgeStatus, string> = {
  new: 'Baru',
  popular: 'Populer',
  bestseller: 'Best Seller',
  soldout: 'Habis',
};

const categoryStyles: Record<ProductCategory, string> = {
  indikator: 'bg-slate-400/20 text-slate-300 border-slate-400/30',
  robot: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  ebook: 'bg-slate-400/20 text-slate-300 border-slate-400/30',
  merchandise: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
};

const statusStyles: Record<BadgeStatus, string> = {
  new: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  popular: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  bestseller: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  soldout: 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30',
};

export function Badge({ variant, category, status, className = '' }: BadgeProps) {
  const baseStyles = `
    inline-flex items-center
    px-2.5 py-1
    text-xs font-medium
    rounded-full
    border
  `;

  let label = '';
  let variantStyles = '';

  if (variant === 'category' && category) {
    label = categoryLabels[category];
    variantStyles = categoryStyles[category];
  } else if (variant === 'status' && status) {
    label = statusLabels[status];
    variantStyles = statusStyles[status];
  }

  return (
    <span className={`${baseStyles} ${variantStyles} ${className}`.trim()}>
      {label}
    </span>
  );
}

export type { ProductCategory, BadgeStatus };
