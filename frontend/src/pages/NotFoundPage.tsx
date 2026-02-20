import { Link } from 'react-router-dom';
import { Home, ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from '../components/shared/Button';
import { Navbar } from '../components/shared/Navbar';
import { Footer } from '../components/shared/Footer';

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-hidden flex flex-col font-sans selection:bg-orange-500/30">
      <Navbar />

      <main className="flex-grow flex items-center justify-center relative z-10 p-6 pt-24 lg:pt-32">
        {/* Ambient Background Effects */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-indigo-900/20 rounded-full blur-[100px] pointer-events-none" />

        {/* Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,black,transparent)] pointer-events-none" />

        <div className="container max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column: Text Content */}
          <div className="order-2 lg:order-1 flex flex-col items-center lg:items-start text-center lg:text-left space-y-8 z-20">
            <div className="space-y-2">
              <h1 className="text-6xl lg:text-8xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-white/40">
                404
              </h1>
              <h2 className="text-2xl lg:text-3xl font-medium text-white/90">
                Tersesat di Market?
              </h2>
              <p className="text-gray-400 max-w-md mx-auto lg:mx-0 text-lg leading-relaxed">
                Halaman yang Anda cari sepertinya sudah likuidasi atau pindah server. Jangan panik, saldo aman.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link to="/">
                <Button 
                  variant="primary" 
                  className="w-full sm:w-auto gap-2 group shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_30px_rgba(249,115,22,0.5)] transition-all duration-300"
                >
                  <Home className="w-4 h-4" />
                  Kembali ke Home
                </Button>
              </Link>
              <Link to="/shop">
                <Button 
                  variant="secondary" 
                  className="w-full sm:w-auto gap-2 border-white/10 hover:bg-white/5 backdrop-blur-sm"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Lihat Produk
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Column: 3D CSS Element */}
          <div className="order-1 lg:order-2 flex justify-center items-center h-[400px] perspective-[1000px] relative">
            
            {/* The 3D Cube */}
            <div className="cube-scene relative w-64 h-64 transform-style-3d animate-float-spin">
              
              {/* Inner Glowing Core */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-orange-500/20 rounded-full blur-[40px] animate-pulse-fast" />

              {/* Cube Faces */}
              <div className="cube-face front  absolute w-full h-full border border-orange-500/30 bg-orange-900/5 backdrop-blur-[2px] flex items-center justify-center translate-z-32">
                <span className="text-8xl font-black text-white/10 select-none">4</span>
              </div>
              <div className="cube-face back   absolute w-full h-full border border-white/10 bg-white/5 backdrop-blur-[2px] flex items-center justify-center -translate-z-32 rotate-y-180">
                 <span className="text-8xl font-black text-white/10 select-none">4</span>
              </div>
              <div className="cube-face right  absolute w-full h-full border border-orange-500/30 bg-orange-900/5 backdrop-blur-[2px] flex items-center justify-center rotate-y-90 translate-z-32">
                 <span className="text-8xl font-black text-white/10 select-none">0</span>
              </div>
              <div className="cube-face left   absolute w-full h-full border border-white/10 bg-white/5 backdrop-blur-[2px] flex items-center justify-center -rotate-y-90 translate-z-32">
                 <span className="text-8xl font-black text-white/10 select-none">0</span>
              </div>
              <div className="cube-face top    absolute w-full h-full border border-orange-500/20 bg-gradient-to-br from-orange-500/10 to-transparent flex items-center justify-center rotate-x-90 translate-z-32">
                <div className="w-16 h-16 border border-orange-500/40 rounded-full" />
              </div>
              <div className="cube-face bottom absolute w-full h-full border border-white/5 bg-black/40 flex items-center justify-center -rotate-x-90 translate-z-32 shadow-[0_0_50px_rgba(0,0,0,0.8)]">
                <div className="w-full h-full bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.1),transparent)]" />
              </div>

              {/* Floating Particles around cube */}
              <div className="absolute -top-10 -right-10 w-4 h-4 bg-orange-500 rounded-sm animate-bounce-custom opacity-80 shadow-[0_0_10px_orange]" />
              <div className="absolute top-1/2 -left-12 w-2 h-2 bg-white rounded-full animate-ping opacity-50" />
              <div className="absolute -bottom-8 left-1/4 w-3 h-3 border border-orange-400 animate-spin-slow" />

            </div>
          </div>

        </div>
      </main>

      <Footer />

      {/* Embedded CSS for 3D Animations */}
      <style>{`
        .perspective-[1000px] {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .translate-z-32 {
          transform: rotateY(0deg) translateZ(8rem);
        }
        .-translate-z-32 {
          transform: rotateY(180deg) translateZ(8rem);
        }
        .rotate-y-90.translate-z-32 {
          transform: rotateY(90deg) translateZ(8rem);
        }
        .-rotate-y-90.translate-z-32 {
          transform: rotateY(-90deg) translateZ(8rem);
        }
        .rotate-x-90.translate-z-32 {
          transform: rotateX(90deg) translateZ(8rem);
        }
        .-rotate-x-90.translate-z-32 {
          transform: rotateX(-90deg) translateZ(8rem);
        }

        @keyframes float-spin {
          0% { transform: rotateX(-15deg) rotateY(0deg) translateY(0px); }
          50% { transform: rotateX(-5deg) rotateY(180deg) translateY(-20px); }
          100% { transform: rotateX(-15deg) rotateY(360deg) translateY(0px); }
        }
        
        .animate-float-spin {
          animation: float-spin 20s infinite linear;
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.15; transform: scale(1.1); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 8s infinite ease-in-out;
        }

        @keyframes bounce-custom {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        .animate-bounce-custom {
          animation: bounce-custom 3s infinite ease-in-out;
        }

        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 10s infinite linear;
        }
      `}</style>
    </div>
  );
};


