import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiProductToProduct, fetchProducts } from '../lib/api';
import type { Product } from '../types/product';
import { ProductCard } from '../components/shared/ProductCard';

// --- CSS-only 3D & Animations ---
const customStyles = `
  @keyframes float-slow {
    0%, 100% { transform: translateY(0px) rotateX(0deg); }
    50% { transform: translateY(-20px) rotateX(2deg); }
  }
  @keyframes float-medium {
    0%, 100% { transform: translateY(0px) translateX(0px); }
    50% { transform: translateY(-15px) translateX(5px); }
  }
  @keyframes float-fast {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
  @keyframes pulse-glow {
    0%, 100% { opacity: 0.5; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.2); }
  }
  @keyframes scanline {
    0% { transform: translateY(-100%); }
    100% { transform: translateY(100%); }
  }
  @keyframes shine {
    0% { left: -100%; }
    100% { left: 100%; }
  }
  
  .perspective-2000 {
    perspective: 2000px;
  }
  .transform-style-3d {
    transform-style: preserve-3d;
  }
  .backface-hidden {
    backface-visibility: hidden;
  }
  .rotate-y-12 {
    transform: rotateY(12deg);
  }
  .rotate-x-12 {
    transform: rotateX(12deg);
  }
  
  .glass-card {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.05);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
  }

  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;

// --- Components ---

function Hero3D() {
  return (
    <div className="relative h-[85vh] w-full overflow-hidden flex items-center justify-center bg-[#050505] perspective-2000">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(249,115,22,0.08),transparent_60%)] pointer-events-none" />
      <div className="absolute top-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      <div className="relative z-10 w-full max-w-7xl px-6 grid lg:grid-cols-2 gap-12 items-center">
        {/* Text Content */}
        <div className="space-y-8 order-2 lg:order-1 text-center lg:text-left z-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-orange-500/20 bg-orange-500/5 text-orange-400 text-xs tracking-widest uppercase font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-[pulse-glow_2s_ease-in-out_infinite]" />
            Beginner Friendly
          </div>
          
          <h1 className="text-5xl sm:text-7xl font-bold tracking-tighter text-white leading-[0.9]">
            Tempat Belajar <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
              Trading
            </span>
          </h1>
          
          <p className="text-lg text-zinc-400 max-w-lg mx-auto lg:mx-0 leading-relaxed">
            Mulai perjalanan trading Anda dengan aman. <br className="hidden sm:block" />
            Panduan langkah demi langkah, dari pemula hingga paham.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <Link 
              to="/shop?category=ebook" 
              className="px-8 py-4 rounded-xl bg-white text-black font-bold hover:bg-zinc-200 transition-colors flex items-center gap-2"
            >
              Mulai Belajar
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </Link>
            <Link 
              to="/how-it-works"
              className="px-8 py-4 rounded-xl border border-white/10 bg-white/5 text-white hover:bg-white/10 transition-colors backdrop-blur-sm"
            >
              Cara Kerja
            </Link>
          </div>
        </div>

        {/* 3D Composition */}
        <div className="relative order-1 lg:order-2 h-[500px] w-full flex items-center justify-center transform-style-3d perspective-2000 lg:scale-110">
          <div className="relative w-[300px] h-[400px] transform-style-3d animate-[float-slow_6s_ease-in-out_infinite] rotate-y-12 rotate-x-12">
            
            {/* Main Interface Card */}
            <div className="absolute inset-0 glass-card rounded-2xl p-4 flex flex-col gap-4 transform translate-z-[0px]">
              {/* Header */}
              <div className="h-8 flex items-center justify-between border-b border-white/5 pb-2">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                </div>
                <div className="text-[10px] font-mono text-zinc-500">FXS.LEARN</div>
              </div>
              {/* Chart Area */}
              <div className="flex-1 bg-black/40 rounded-lg border border-white/5 relative overflow-hidden flex items-center justify-center p-4">
                <div className="text-center space-y-2">
                   <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto text-orange-500">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
                   </div>
                   <div className="h-2 w-20 bg-white/10 rounded-full mx-auto" />
                   <div className="h-2 w-16 bg-white/10 rounded-full mx-auto" />
                </div>
                {/* Floating Price Tag */}
                <div className="absolute top-4 right-4 bg-orange-500 text-black text-[10px] font-bold px-2 py-1 rounded">
                  Chapter 1
                </div>
              </div>
              {/* Data Rows */}
              <div className="space-y-2">
                <div className="h-2 w-2/3 bg-white/10 rounded-full" />
                <div className="h-2 w-1/2 bg-white/10 rounded-full" />
              </div>
            </div>

            {/* Floating Element: Buy Signal */}
            <div className="absolute -right-16 top-20 w-32 h-16 glass-card rounded-xl flex items-center justify-center gap-3 transform translate-z-[60px] animate-[float-medium_5s_ease-in-out_infinite_1s]">
              <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/30">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-green-500"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>
              </div>
              <div>
                <div className="text-[10px] text-zinc-400">STATUS</div>
                <div className="text-xs font-bold text-white">READY</div>
              </div>
            </div>

            {/* Floating Element: Code Snippet */}
            <div className="absolute -left-12 bottom-20 w-40 h-24 glass-card rounded-xl p-3 transform translate-z-[40px] animate-[float-medium_7s_ease-in-out_infinite_0.5s]">
               <div className="space-y-1.5 font-mono text-[8px] text-zinc-500">
                  <div className="text-orange-400">Step 1: Learn</div>
                  <div className="pl-2 border-l border-white/10">Understand Basics</div>
                  <div className="pl-2 border-l border-white/10">Risk Management</div>
                  <div className="text-green-400">Step 2: Practice</div>
               </div>
            </div>

            {/* Glow Effect behind */}
            <div className="absolute inset-0 bg-orange-500/20 blur-[60px] -z-10 rounded-full transform translate-z-[-50px]" />
          </div>
        </div>
      </div>
    </div>
  );
}

function GuidedEntry() {
  return (
    <section className="py-24 px-4 bg-[#08080a] relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Bingung mulai dari mana?</h2>
          <p className="text-zinc-400 max-w-xl">
            Ikuti alur simpel ini untuk memulai perjalanan trading Anda dengan fondasi yang kuat.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Main Card: Education / Start Here */}
          <div className="md:col-span-2 group relative rounded-3xl overflow-hidden border border-white/5 bg-[#0f0f12] h-[400px] md:h-[500px]">
             <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
             
             {/* Decorative Path/Map Visual */}
             <div className="absolute inset-0 opacity-20 pointer-events-none">
                <svg className="w-full h-full" viewBox="0 0 400 300" preserveAspectRatio="none">
                   <path d="M50 250 C 150 250, 150 50, 350 50" stroke="url(#gradient-path)" strokeWidth="2" fill="none" strokeDasharray="10 10" />
                   <defs>
                      <linearGradient id="gradient-path" x1="0%" y1="0%" x2="100%" y2="0%">
                         <stop offset="0%" stopColor="#f97316" stopOpacity="0" />
                         <stop offset="100%" stopColor="#f97316" stopOpacity="1" />
                      </linearGradient>
                   </defs>
                </svg>
             </div>
             
             <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-between z-10">
               <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold uppercase tracking-wider mb-6">
                    Langkah 1
                  </div>
                  <h3 className="text-3xl md:text-5xl font-bold text-white mb-4">Pahami Dasarnya</h3>
                  <p className="text-zinc-400 text-base md:text-lg max-w-md leading-relaxed">
                    Jangan pertaruhkan uang Anda tanpa ilmu. Pelajari fundamental trading, manajemen resiko, dan strategi dasar sebelum terjun ke pasar.
                  </p>
               </div>
               
               <div className="flex items-center gap-4">
                 <Link 
                   to="/shop?category=ebook" 
                   className="px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-zinc-200 transition-all flex items-center gap-2"
                 >
                   Mulai Belajar
                   <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                 </Link>
               </div>
             </div>
          </div>

          {/* Right Column: Tools & Support */}
          <div className="flex flex-col gap-6 h-[500px]">
            
            {/* Top: Tools (Indicators & Robots) */}
            <div className="flex-1 group relative rounded-3xl overflow-hidden border border-white/5 bg-[#0f0f12]">
               <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent" />
               <div className="absolute inset-0 p-8 flex flex-col justify-center z-10">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4 text-blue-400 border border-blue-500/20">
                     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Alat Bantu Trading</h3>
                  <p className="text-zinc-500 text-sm mb-4">Indikator & Robot untuk membantu analisa Anda (opsional).</p>
                  <Link to="/shop" className="text-blue-400 font-medium hover:text-blue-300 flex items-center gap-1 text-sm after:absolute after:inset-0">
                    Lihat Tools <span className="text-lg">→</span>
                  </Link>
               </div>
            </div>

            {/* Bottom: Support */}
            <div className="flex-1 group relative rounded-3xl overflow-hidden border border-white/5 bg-[#0f0f12]">
               <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent" />
               <div className="absolute inset-0 p-8 flex flex-col justify-center z-10">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-4 text-emerald-400 border border-emerald-500/20">
                     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Bantuan & Support</h3>
                  <p className="text-zinc-500 text-sm mb-4">Tim kami siap membantu kendala teknis Anda.</p>
                  <Link to="/support" className="text-emerald-400 font-medium hover:text-emerald-300 flex items-center gap-1 text-sm after:absolute after:inset-0">
                    Hubungi Kami <span className="text-lg">→</span>
                  </Link>
               </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

function CuratedSteps() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProducts({ page_size: 3, sort: 'newest' })
      .then(res => setProducts(res.items.map(apiProductToProduct)))
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <div className="h-64 flex items-center justify-center text-zinc-500">Loading recommendations...</div>;

  return (
    <section className="py-32 bg-[#050505] border-t border-white/5 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-full bg-orange-500/5 blur-[100px] -z-10 rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-orange-500/20 bg-orange-500/5 text-orange-400 text-xs tracking-widest uppercase font-medium mb-4">
             Rekomendasi Pilihan
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Mulai Perjalanan Anda</h2>
          <p className="text-zinc-400 text-lg leading-relaxed">
            Tidak perlu beli semua. Pilih satu yang paling sesuai dengan gaya belajar Anda saat ini.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FooterCTA() {
  return (
    <section className="relative py-40 overflow-hidden flex items-center justify-center bg-[#020202]">
      {/* --- Cinematic Background --- */}
      
      {/* 1. Deep Space Texture */}
      <div className="absolute inset-0 opacity-20" 
           style={{ 
             backgroundImage: 'radial-gradient(circle at center, #333 1px, transparent 1px)', 
             backgroundSize: '40px 40px' 
           }} 
      />
      
      {/* 2. The Horizon Glow (Sunrise Effect) */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[150%] h-[500px] bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-orange-600/20 via-orange-900/5 to-transparent blur-[80px] pointer-events-none" />
      
      {/* 3. The Horizon Line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent opacity-50" />
      
      {/* 4. Top Spotlight */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[300px] bg-gradient-to-b from-white/5 to-transparent blur-[100px] pointer-events-none" />

      {/* --- Content --- */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        
        {/* Floating Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/5 bg-white/5 backdrop-blur-md text-zinc-400 text-xs tracking-[0.2em] uppercase font-medium mb-12 animate-[float-slow_4s_ease-in-out_infinite]">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
          Join The Elite
        </div>

        {/* Massive Headline */}
        <h2 className="text-5xl sm:text-7xl md:text-8xl font-bold tracking-tighter mb-8 leading-[0.9]">
          <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-white/90 to-white/40">
            Mulai Perjalanan
          </span>
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-b from-white/60 via-white/20 to-transparent">
            Anda Sekarang
          </span>
        </h2>
        
        {/* Subtext */}
        <p className="text-lg md:text-xl text-zinc-500 max-w-2xl mx-auto mb-16 font-light tracking-wide">
          Akses tools premium yang dirancang untuk 
          <span className="text-zinc-300 font-medium"> kesuksesan jangka panjang</span>.
        </p>
        
        {/* The "Jewel" Button */}
        <div className="flex flex-col items-center">
          <Link 
            to="/shop" 
            className="group relative inline-flex items-center gap-3 px-10 py-5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full overflow-hidden transition-all duration-500 hover:bg-white/10 hover:border-white/20 hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.1)]"
          >
            {/* Shine Animation */}
            <div className="absolute inset-0 -translate-x-full group-hover:animate-[shine_1.5s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent z-10" />
            
            {/* Button Content */}
            <span className="relative z-20 text-white font-semibold tracking-wide text-lg">
              Akses Member Area
            </span>
            <svg 
              className="relative z-20 w-5 h-5 text-orange-400 transition-transform duration-300 group-hover:translate-x-1" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
          
          <div className="mt-8 text-xs text-zinc-600 font-mono tracking-widest uppercase opacity-60">
            Secure • Private • Premium
          </div>
        </div>
      </div>
    </section>
  );
}

export function HomePage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-orange-500/30 overflow-x-hidden">
      <style>{customStyles}</style>
      
      <Hero3D />
      <GuidedEntry />
      <CuratedSteps />
      
      <FooterCTA />
    </main>
  );
}
