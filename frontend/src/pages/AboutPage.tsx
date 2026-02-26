import { type ReactNode } from 'react';
import { Button } from '../components/shared';

// --- Components ---

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-6">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-300 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-400"></span>
      </span>
      <span className="text-xs font-medium text-slate-100 tracking-wide uppercase">{children}</span>
    </div>
  );
}

function ValueCard({ icon, title, description, delay = 0 }: { icon: ReactNode; title: string; description: string; delay?: number }) {
  return (
    <div 
      className="group relative p-8 rounded-3xl bg-zinc-900/40 border border-white/5 hover:border-slate-400/20 hover:bg-zinc-900/60 transition-all duration-500 hover:-translate-y-1 overflow-hidden"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-slate-400/0 via-slate-400/0 to-slate-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10">
        <div className="w-14 h-14 rounded-2xl bg-zinc-800/50 border border-white/5 flex items-center justify-center text-slate-300 mb-6 group-hover:scale-110 group-hover:bg-slate-400/10 group-hover:border-slate-400/20 transition-all duration-300">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-slate-50 transition-colors">{title}</h3>
        <p className="text-zinc-400 leading-relaxed text-sm">{description}</p>
      </div>
    </div>
  );
}

function QuoteBlock({ children, author, role }: { children: ReactNode; author: string; role: string }) {
  return (
    <div className="relative p-8 md:p-12 rounded-3xl bg-gradient-to-br from-zinc-900/80 to-zinc-900/40 border border-white/5 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-slate-400/50 via-slate-400/10 to-transparent" />
      <svg className="absolute top-8 left-8 w-12 h-12 text-white/5 -z-0 transform -translate-x-2 -translate-y-2" fill="currentColor" viewBox="0 0 24 24">
        <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V11C14.017 11.5523 13.5693 12 13.017 12H12.017V5H22.017V15C22.017 18.3137 19.3307 21 16.017 21H14.017ZM5.0166 21L5.0166 18C5.0166 16.8954 5.91203 16 7.0166 16H10.0166C10.5689 16 11.0166 15.5523 11.0166 15V9C11.0166 8.44772 10.5689 8 10.0166 8H6.0166C5.46432 8 5.0166 8.44772 5.0166 9V11C5.0166 11.5523 4.56889 12 4.0166 12H3.0166V5H13.0166V15C13.0166 18.3137 10.3303 21 7.0166 21H5.0166Z" />
      </svg>
      <div className="relative z-10">
        <div className="text-xl md:text-2xl font-medium text-zinc-200 leading-relaxed italic font-serif opacity-90">
          "{children}"
        </div>
        <div className="mt-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-400/20 flex items-center justify-center text-slate-300 font-bold text-sm border border-slate-400/20">
            F
          </div>
          <div>
            <div className="text-white font-semibold">{author}</div>
            <div className="text-xs text-zinc-500 uppercase tracking-wider">{role}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Main Page ---

export function AboutPage() {
  return (
    <main className="bg-[#0a0a0f] min-h-screen relative overflow-x-hidden selection:bg-slate-400/30 selection:text-slate-100">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[1000px] h-[600px] bg-slate-400/5 rounded-full blur-[120px] mix-blend-screen opacity-40 animate-float" />
        <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-slate-400/5 rounded-full blur-[120px] mix-blend-screen opacity-20" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] brightness-100 contrast-150" />
      </div>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-4">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="animate-slide-up">
            <SectionLabel>Tentang fxsociety</SectionLabel>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-8 leading-[1.1] animate-slide-up [animation-delay:200ms]">
            Trading yang lebih <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400">
              Manusiawi
            </span>
            <span className="text-zinc-600">.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed animate-slide-up [animation-delay:400ms]">
            Kami membangun tempat di mana pemula bisa belajar tanpa rasa takut. 
            Tanpa janji palsu. Hanya alat bantu yang jujur dan support yang peduli.
          </p>
        </div>
      </section>

      {/* --- VALUES GRID --- */}
      <section className="relative px-4 pb-24 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <ValueCard 
              delay={100}
              icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3l7 4v5c0 5-3 9-7 9s-7-4-7-9V7l7-4z" /></svg>}
              title="Kejujuran"
              description="Kami anti klaim 'pasti profit'. Kami bicara risiko apa adanya, karena itu satu-satunya cara trading yang benar."
            />
            <ValueCard 
              delay={200}
              icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
              title="Simpel"
              description="Dunia trading sudah rumit. Kami membuatnya sederhana agar Anda bisa fokus belajar, bukan bingung istilah."
            />
            <ValueCard 
              delay={300}
              icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>}
              title="Edukasi"
              description="Produk kami adalah materi belajar. Tujuannya agar Anda paham 'kenapa' dan 'bagaimana', bukan cuma 'ikut-ikutan'."
            />
            <ValueCard 
              delay={400}
              icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-2.121 2.121m-9.9 9.9l-2.121 2.121m0-16.97l2.121 2.121m11.314 11.314l2.121 2.121M12 8v4l2 2" /></svg>}
              title="Support"
              description="Bingung install? Error? Kami ada di sini. Support kami manusia asli yang siap diajak ngobrol."
            />
          </div>
        </div>
      </section>

      {/* --- FOUNDER LETTER --- */}
      <section className="relative px-4 py-24 z-10 bg-zinc-900/30 border-y border-white/5 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            <div className="space-y-8 order-2 lg:order-1">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Kenapa fxsociety ada?</h2>
                <div className="space-y-6 text-zinc-400 text-lg leading-relaxed">
                  <p>
                    Halo,
                  </p>
                  <p>
                    fxsociety lahir dari pengalaman yang sederhana: banyak pemula ingin belajar trading, tapi 
                    justru "tersesat" karena kebanyakan informasi, setting yang rumit, dan narasi yang terlalu 
                    menjanjikan.
                  </p>
                  <p>
                    Kami ingin membuat tempat yang lebih tenang. Tempat Anda bisa memilih produk dengan 
                    deskripsi yang jelas, belajar langkah demi langkah, dan bertanya saat bingung—tanpa merasa 
                    dihakimi.
                  </p>
                  <p>
                    Kami tidak menjual mimpi. Kami menjual produk dan panduan yang bertujuan membantu proses 
                    belajar Anda. Keputusan trading tetap milik Anda, dan risikonya tetap ada.
                  </p>
                </div>
              </div>
              
              <div className="pt-8 border-t border-white/10 flex items-center justify-between">
                <div>
                  <p className="text-white font-semibold text-lg">Tim fxsociety</p>
                  <p className="text-zinc-500 text-sm">Indonesia</p>
                </div>
                {/* Signature-like aesthetic element */}
                <div className="h-12 w-32 bg-white/5 rounded-lg skew-x-[-10deg] opacity-20" />
              </div>
            </div>

            <div className="order-1 lg:order-2">
               <QuoteBlock author="Founder fxsociety" role="Surat Terbuka">
                  Kalau Anda baru mulai, semoga Anda merasa "punya teman" di sini.
               </QuoteBlock>
            </div>

          </div>
        </div>
      </section>

      {/* --- CREDIBILITY & MANIFESTO --- */}
      <section className="relative px-4 py-24 z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Standar Sederhana Kami</h2>
            <p className="text-zinc-400">Hal-hal kecil yang kami jaga agar Anda tetap aman dan nyaman.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Copy Jujur',
                desc: 'Kami menulis dengan bahasa realistis. Jika ada risiko, kami tulis risiko. Tidak ada yang disembunyikan di fine print.',
                color: 'bg-slate-400'
              },
              {
                title: 'Panduan Rapi',
                desc: 'Setiap produk dilengkapi cara pakai. Kami tidak membiarkan Anda menebak-nebak setelah membeli.',
                color: 'bg-emerald-500'
              },
              {
                title: 'Support Responsif',
                desc: 'Ada masalah teknis? Hubungi kami. Kami membalas pesan Anda, bukan bot otomatis.',
                color: 'bg-purple-500'
              }
            ].map((item, i) => (
              <div key={i} className="group p-6 rounded-2xl bg-zinc-900/50 border border-white/5 hover:border-slate-400/20 transition-all">
                <div className={`w-2 h-2 rounded-full ${item.color} mb-4 shadow-[0_0_10px_currentColor]`} />
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Warning Box */}
          <div className="mt-12 p-6 rounded-xl bg-orange-950/20 border border-orange-500/10 flex gap-4 max-w-3xl mx-auto">
            <div className="shrink-0 text-orange-500 mt-1">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-orange-200 font-medium mb-1">Pengingat Risiko</p>
              <p className="text-sm text-orange-200/70 leading-relaxed">
                Trading mengandung risiko dan tidak ada produk yang bisa menjamin profit.
                Produk fxsociety adalah alat bantu dan materi belajar—bukan janji hasil.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- CTA --- */}
      <section className="relative px-4 pb-24 z-10">
        <div className="max-w-5xl mx-auto">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-b from-zinc-800 to-zinc-900 border border-white/10 p-10 md:p-20 text-center shadow-2xl">
             
             {/* Decorative glows */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-slate-400/20 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />
             
             <div className="relative z-10">
               <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Siap belajar dengan tenang?</h2>
               <p className="text-zinc-400 max-w-xl mx-auto mb-10 text-lg">
                 Jelajahi tool trading kami yang didesain untuk membantu Anda tumbuh pelan-pelan.
               </p>
               
                 <div className="flex flex-col sm:flex-row gap-4 justify-center">
                   <Button href="/shop" size="lg" className="h-12 px-8 text-base shadow-[0_0_20px_rgba(203,213,225,0.3)] hover:shadow-[0_0_30px_rgba(203,213,225,0.5)] transition-shadow">
                     Lihat Produk
                   </Button>
                 <Button href="/shop" size="lg" className="h-12 px-8 text-base shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_30px_rgba(249,115,22,0.5)] transition-shadow">
                   Lihat Produk
                 </Button>
                 <Button href="/support" variant="secondary" size="lg" className="h-12 px-8 text-base bg-white/5 border-white/10 hover:bg-white/10">
                   Hubungi Support
                 </Button>
               </div>
             </div>
          </div>
        </div>
      </section>

    </main>
  );
}
