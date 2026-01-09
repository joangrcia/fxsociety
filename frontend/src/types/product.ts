export type ProductCategory = 'indikator' | 'robot' | 'ebook' | 'merchandise';
export type BadgeStatus = 'new' | 'popular' | 'bestseller' | 'soldout';

export interface Product {
  id: string;
  slug?: string;
  title: string;
  description: string;
  descriptionFull?: string | null;
  price: number;
  category: ProductCategory;
  imageUrl: string;
  images?: string[];
  badge?: BadgeStatus;
  isSoldOut?: boolean;
}
