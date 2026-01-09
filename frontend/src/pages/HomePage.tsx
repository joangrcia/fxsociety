import { useState, useEffect } from 'react';
import { Button, ProductCard } from '../components/shared';
import { fetchProducts, apiProductToProduct } from '../lib/api';
import type { Product } from '../types/product';

// Feature Card Component (Home-specific)
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="group bg-[#1e1e26] rounded-2xl p-6 border border-white/5 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/20">
      <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-4 group-hover:bg-emerald-500/20 transition-colors">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-zinc-400 leading-relaxed">{description}</p>
    </div>
  );
}

// Step Card Component (Home-specific)
interface StepCardProps {
  number: number;
  title: string;
}

function StepCard({ number, title }: StepCardProps) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-xl mb-3">
        {number}
      </div>
      <span className="text-sm text-zinc-300 font-medium">{title}</span>
    </div>
  );
}

// Testimonial Card Component (Home-specific)
interface TestimonialCardProps {
  quote: string;
  name: string;
  role: string;
}

function TestimonialCard({ quote, name, role }: TestimonialCardProps) {
  return (
    <div className="bg-[#1e1e26] rounded-2xl p-6 border border-white/5">
      <p className="text-zinc-300 mb-4 leading-relaxed italic">"{quote}"</p>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-semibold">
          {name.charAt(0)}
        </div>
        <div>
          <p className="text-white font-medium text-sm">{name}</p>
          <p className="text-zinc-500 text-xs">{role}</p>
        </div>
      </div>
    </div>
  );
}

// Product Skeleton for loading state
function ProductSkeleton() {
  return (
    <div className="bg-[#1e1e26] rounded-2xl overflow-hidden animate-pulse">
      <div className="aspect-[4/3] bg-zinc-800" />
      <div className="p-5 space-y-3">
        <div className="h-5 w-3/4 bg-zinc-800 rounded" />
        <div className="h-4 w-full bg-zinc-800 rounded" />
        <div className="h-4 w-1/2 bg-zinc-800 rounded" />
        <div className="h-6 w-24 bg-zinc-800 rounded" />
      </div>
    </div>
  );
}

export function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProducts({ page_size: 4, sort: 'newest' })
      .then((response) => {
        setFeaturedProducts(response.items.map(apiProductToProduct));
      })
      .catch((err) => {
        console.error('Failed to fetch featured products:', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <main>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 pt-20">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Mulai Trading dengan Lebih{' '}
            <span className="text-emerald-400">Percaya Diri</span>
          </h1>
          <p className="text-lg md:text-xl text-zinc-400 mb-8 max-w-2xl mx-auto leading-relaxed">
            Tools dan panduan yang dirancang khusus untuk pemula. 
            Tanpa jargon rumit. Tanpa janji profit pasti.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" href="/shop">
              Lihat Produk
            </Button>
            <Button variant="secondary" size="lg" href="/how-it-works">
              Pelajari Cara Kerja
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Kenapa Memilih Kami?
            </h2>
            <p className="text-zinc-400 max-w-xl mx-auto">
              Kami fokus membantu pemula memahami trading dengan cara yang sederhana dan jujur.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              }
              title="Dibuat untuk Pemula"
              description="Tidak perlu pengalaman coding atau pengetahuan teknikal. Semua produk kami mudah digunakan."
            />
            <FeatureCard
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              }
              title="Panduan Lengkap"
              description="Setiap produk dilengkapi tutorial langkah demi langkah. Tidak akan ada yang bingung."
            />
            <FeatureCard
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
              }
              title="Komunitas Supportif"
              description="Tanya jawab dan bantuan kapan saja. Kami siap membantu Anda berkembang."
            />
          </div>
        </div>
      </section>

      {/* Popular Products Section */}
      <section className="py-20 px-4 bg-[#14141a]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Produk <span className="text-emerald-400">Populer</span>
            </h2>
            <p className="text-zinc-400 max-w-xl mx-auto">
              Pilihan terbaik dari pengguna kami untuk memulai perjalanan trading.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoading ? (
              <>
                <ProductSkeleton />
                <ProductSkeleton />
                <ProductSkeleton />
                <ProductSkeleton />
              </>
            ) : (
              featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>

          <div className="text-center mt-10">
            <Button variant="secondary" href="/shop">
              Lihat Semua Produk →
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works Preview Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Cara Kerja
            </h2>
            <p className="text-zinc-400 max-w-xl mx-auto">
              Proses pembelian yang simpel dan transparan.
            </p>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8">
            <StepCard number={1} title="Pilih Produk" />
            <span className="hidden md:block text-zinc-600">→</span>
            <StepCard number={2} title="Isi Form" />
            <span className="hidden md:block text-zinc-600">→</span>
            <StepCard number={3} title="Bayar" />
            <span className="hidden md:block text-zinc-600">→</span>
            <StepCard number={4} title="Terima Akses" />
          </div>

          <div className="text-center mt-10">
            <Button variant="ghost" href="/how-it-works">
              Pelajari Selengkapnya
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-[#14141a]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Apa Kata Mereka?
            </h2>
            <p className="text-zinc-400 max-w-xl mx-auto">
              Cerita dari pengguna yang sudah mencoba produk kami.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TestimonialCard
              quote="Akhirnya ada produk trading yang tidak ribet! Indikatornya mudah dipahami dan tutorialnya sangat membantu."
              name="Andi Pratama"
              role="Pemula Trader"
            />
            <TestimonialCard
              quote="Saya suka karena mereka jujur - tidak ada janji profit pasti. Supportnya juga responsif banget."
              name="Siti Rahayu"
              role="Pemula Trader"
            />
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-gradient-to-br from-[#1e1e26] to-[#14141a] rounded-3xl p-8 md:p-12 border border-white/5 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Siap memulai perjalanan trading Anda?
            </h2>
            <p className="text-zinc-400 mb-8">
              Temukan tools yang tepat untuk level Anda.
            </p>
            <Button size="lg" href="/shop">
              Mulai Sekarang
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
