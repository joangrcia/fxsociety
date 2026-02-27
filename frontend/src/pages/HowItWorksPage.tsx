import { type ReactNode } from 'react';
import { Accordion, Button } from '../components/shared';

interface FlowStep {
  title: string;
  description: string;
  points?: string[];
}

const steps: FlowStep[] = [
  {
    title: 'Pilih Produk',
    description:
      'Buka halaman Shop, lalu pilih produk yang paling sesuai dengan kebutuhan Anda. Semua produk punya ringkasan yang jelas agar mudah dibandingkan.',
    points: ['Lihat detail & manfaat utama', 'Periksa apa yang Anda dapatkan', 'Kalau ragu, tanyakan ke Support'],
  },
  {
    title: 'Isi Form Pemesanan',
    description:
      'Klik tombol pesan di halaman produk, lalu isi data yang diperlukan. Prosesnya singkat—kami hanya minta info yang penting untuk mengirim produk.',
    points: ['Nama lengkap', 'Email aktif', 'Nomor WhatsApp untuk konfirmasi'],
  },
  {
    title: 'Lakukan Pembayaran',
    description:
      'Ikuti instruksi pembayaran yang muncul setelah pesanan dibuat. Setelah transfer, cukup konfirmasi agar tim kami bisa memproses lebih cepat.',
    points: ['Gunakan nominal yang sesuai', 'Simpan bukti transfer', 'Konfirmasi lewat Support'],
  },
  {
    title: 'Terima Produk',
    description:
      'Setelah pembayaran dikonfirmasi, Anda akan menerima produk sesuai jenis pembelian (digital/ fisik). Kami kirim dengan rapi dan jelas agar mudah digunakan.',
    points: ['Produk digital: dikirim via email', 'Produk fisik: update pengiriman via WhatsApp'],
  },
];

const faqItems = [
  {
    question: 'Kalau saya bingung pilih produk, bisa tanya dulu?',
    answer:
      'Bisa. Anda bisa chat Support kapan saja untuk tanya rekomendasi produk yang paling cocok dengan kebutuhan dan gaya belajar Anda.',
  },
  {
    question: 'Setelah bayar, berapa lama prosesnya?',
    answer:
      'Kami proses secepat mungkin setelah konfirmasi pembayaran diterima. Untuk produk digital biasanya lebih cepat, sedangkan produk fisik mengikuti jadwal pengiriman.',
  },
  {
    question: 'Apakah saya akan dapat panduan penggunaan?',
    answer:
      'Ya. Untuk produk digital biasanya disertakan file panduan atau petunjuk singkat. Jika masih ada yang kurang jelas, Support siap bantu.',
  },
  {
    question: 'Kalau ada kendala teknis, bagaimana?',
    answer:
      'Silakan hubungi Support dan jelaskan kendalanya. Tim kami akan membantu langkah demi langkah sampai masalahnya selesai.',
  },
];

// --- Local Components ---

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-blue-500/20 backdrop-blur-md mb-6 shadow-[0_0_15px_rgba(59,130,246,0.08)]">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
      </span>
      <span className="text-xs font-medium text-slate-100 tracking-wide uppercase">{children}</span>
    </div>
  );
}

function StepCard({ step, index }: { step: FlowStep; index: number }) {
  const isEven = index % 2 === 0;
  const stepNumber = index + 1;

  return (
    <div className="relative md:grid md:grid-cols-2 md:gap-20 items-center">
      
      {/* Mobile Step Number (Hidden on desktop) */}
      <div className="md:hidden flex items-center gap-4 mb-4 pl-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-400/30 bg-slate-400/10 text-slate-200 font-bold shadow-[0_0_10px_rgba(203,213,225,0.2)]">
          {stepNumber}
        </div>
        <div className="h-px flex-1 bg-gradient-to-r from-slate-400/30 to-transparent"></div>
      </div>

      {/* Content Side */}
      <div className={`${isEven ? 'md:text-right' : 'md:col-start-2 md:text-left'} relative z-10`}>
        <div 
          className="group relative rounded-2xl border border-white/10 bg-[#14141a]/60 p-6 md:p-8 shadow-2xl backdrop-blur-md transition-all duration-500 hover:-translate-y-1 hover:border-slate-400/30 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
        >
          {/* Subtle gradient overlay on hover */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          
          <h3 className="text-xl md:text-2xl font-bold text-white group-hover:text-slate-50 transition-colors">
            {step.title}
          </h3>
          <p className="mt-3 text-zinc-400 leading-relaxed text-base">
            {step.description}
          </p>

          {step.points && step.points.length > 0 && (
            <ul className={`mt-6 space-y-3 ${isEven ? 'md:items-end' : 'md:items-start'} flex flex-col`}>
              {step.points.map((point) => (
                <li key={point} className={`flex items-start gap-3 text-sm text-zinc-500 group-hover:text-zinc-400 transition-colors ${isEven ? 'md:flex-row-reverse md:text-right' : ''}`}>
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400/80 shadow-[0_0_8px_rgba(203,213,225,0.6)]" />
                  <span className="leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Desktop Center Marker */}
      <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 items-center justify-center z-20">
        <div className="relative group/marker">
          {/* Pulse effect */}
          <div className="absolute inset-0 rounded-full bg-blue-500/15 blur-xl group-hover/marker:bg-blue-500/30 transition-all duration-500" />
          
          <div className="relative h-14 w-14 rounded-full border border-blue-500/40 bg-[#0a0a0f] text-slate-100 flex items-center justify-center font-bold text-lg shadow-[0_0_0_4px_rgba(20,20,26,1),0_0_20px_rgba(59,130,246,0.15)] group-hover/marker:scale-110 group-hover/marker:border-blue-400/70 group-hover/marker:shadow-[0_0_0_4px_rgba(20,20,26,1),0_0_30px_rgba(59,130,246,0.3)] transition-all duration-300">
            {stepNumber}
          </div>
        </div>
      </div>

    </div>
  );
}

export function HowItWorksPage() {
  return (
    <main className="bg-[#0a0a0f] min-h-screen relative overflow-x-hidden selection:bg-slate-400/30 selection:text-slate-100">
      
      {/* --- Background Ambience --- */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[800px] h-[600px] bg-slate-400/5 rounded-full blur-[120px] mix-blend-screen opacity-30" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[500px] bg-blue-500/6 rounded-full blur-[120px] mix-blend-screen opacity-40" />
        <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-blue-400/5 rounded-full blur-[100px] mix-blend-screen opacity-30" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] brightness-100 contrast-150" />
      </div>

      <div className="relative z-10">
        
        {/* --- Hero Section --- */}
        <section className="pt-32 pb-20 md:pt-48 md:pb-24 px-4 text-center max-w-4xl mx-auto">
          <div className="flex justify-center">
            <SectionLabel>Panduan Pemesanan</SectionLabel>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-8 leading-[1.1]">
            Cara kerja yang terasa <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400">
              Ringan & Simpel
            </span>
          </h1>

          <p className="mt-6 mx-auto max-w-2xl text-lg md:text-xl text-zinc-400 leading-relaxed">
            Dari pilih produk sampai produk diterima, semuanya berjalan dalam 4 langkah.
            Tanpa tampilan rumit—cocok untuk pemula.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="/shop" size="lg" className="px-8 h-12 text-base">Lihat Produk</Button>
            <Button variant="secondary" href="/support" size="lg" className="px-8 h-12 text-base bg-white/5 border-white/10 hover:bg-white/10">
              Tanya Support
            </Button>
          </div>
        </section>

        {/* --- Process Section --- */}
        <section className="relative px-4 pb-32">
          <div className="max-w-6xl mx-auto">
            
            {/* Timeline Container */}
            <div className="relative">
              
              {/* Central Line (Desktop) */}
              <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-slate-400/20 to-transparent" />
              <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[1px] -translate-x-1/2 bg-gradient-to-b from-transparent via-slate-400/40 to-transparent blur-[2px]" />

              {/* Mobile Line (Left side) */}
              <div className="md:hidden absolute left-7 top-6 bottom-6 w-px bg-zinc-800" />

              <div className="space-y-12 md:space-y-24">
                {steps.map((step, index) => (
                  <StepCard key={step.title} step={step} index={index} />
                ))}
              </div>

            </div>
          </div>
        </section>

        {/* --- FAQ Section --- */}
        <section className="relative px-4 pb-32">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Pertanyaan Populer</h2>
              <p className="text-zinc-400">Jawaban singkat untuk membantu Anda cepat mulai.</p>
            </div>

            <div className="bg-zinc-900/30 rounded-3xl border border-white/5 p-6 md:p-8 backdrop-blur-sm">
              <Accordion items={faqItems} defaultOpenIndex={0} />
            </div>
          </div>
        </section>

        {/* --- CTA Section --- */}
        <section className="relative px-4 pb-24">
          <div className="max-w-5xl mx-auto">
            <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-zinc-900 to-[#14141a] border border-white/10 p-10 md:p-16 text-center shadow-2xl">
               
               {/* Decorative glows */}
               <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/8 rounded-full blur-[80px] pointer-events-none" />
               <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-400/5 rounded-full blur-[80px] pointer-events-none" />
               
               <div className="relative z-10">
                 <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                   Siap mulai perjalanan trading Anda?
                 </h2>
                 <p className="text-zinc-400 max-w-xl mx-auto mb-10 text-lg leading-relaxed">
                   Lihat produk di Shop, atau hubungi Support jika Anda ingin arahan yang lebih personal sebelum membeli.
                 </p>
                 
                 <div className="flex flex-col sm:flex-row gap-4 justify-center">
                   <Button href="/shop" size="lg" className="h-12 px-8 text-base shadow-[0_0_20px_rgba(203,213,225,0.3)] hover:shadow-[0_0_30px_rgba(203,213,225,0.5)] transition-shadow">
                     Ke Shop
                   </Button>
                   <Button variant="secondary" href="/support" size="lg" className="h-12 px-8 text-base bg-white/5 border-white/10 hover:bg-white/10">
                     Ke Support
                   </Button>
                 </div>
               </div>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}
