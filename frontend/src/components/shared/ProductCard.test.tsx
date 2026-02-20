/// <reference types="vitest/globals" />
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ProductCard } from './ProductCard';
import type { Product } from '../../types/product';

const mockProduct: Product = {
  id: '1',
  title: 'Test Indicator',
  description: 'A test indicator for trading',
  price: 499000,
  category: 'indikator',
  imageUrl: '/test-image.jpg',
};

function renderWithRouter(ui: React.ReactElement) {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
}

describe('ProductCard', () => {
  it('renders product title', () => {
    renderWithRouter(<ProductCard product={mockProduct} />);
    expect(screen.getByText('Test Indicator')).toBeInTheDocument();
  });

  it('renders product description', () => {
    renderWithRouter(<ProductCard product={mockProduct} />);
    expect(screen.getByText('A test indicator for trading')).toBeInTheDocument();
  });

  it('formats price in Indonesian Rupiah', () => {
    renderWithRouter(<ProductCard product={mockProduct} />);
    // IDR 499000 should be formatted as "Rp 499.000" or similar
    expect(screen.getByText(/Rp\s*499/)).toBeInTheDocument();
  });

  it('displays guidance cue for indicator category', () => {
    renderWithRouter(<ProductCard product={mockProduct} />);
    expect(screen.getByText('Cocok untuk Pemula')).toBeInTheDocument();
  });

  it('displays guidance cue for robot category', () => {
    const robotProduct: Product = { ...mockProduct, category: 'robot' };
    renderWithRouter(<ProductCard product={robotProduct} />);
    expect(screen.getByText('Otomatisasi Penuh')).toBeInTheDocument();
  });

  it('displays guidance cue for ebook category', () => {
    const ebookProduct: Product = { ...mockProduct, category: 'ebook' };
    renderWithRouter(<ProductCard product={ebookProduct} />);
    expect(screen.getByText('Panduan Lengkap')).toBeInTheDocument();
  });

  it('links to product detail page', () => {
    renderWithRouter(<ProductCard product={mockProduct} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/product/1');
  });

  it('displays sold out badge when product is sold out', () => {
    const soldOutProduct: Product = { ...mockProduct, isSoldOut: true };
    renderWithRouter(<ProductCard product={soldOutProduct} />);
    // Check for sold out styling (reduced opacity class)
    const link = screen.getByRole('link');
    expect(link.className).toContain('opacity-75');
  });

  it('renders "Lihat Detail" call-to-action', () => {
    renderWithRouter(<ProductCard product={mockProduct} />);
    expect(screen.getByText('Lihat Detail')).toBeInTheDocument();
  });
});
