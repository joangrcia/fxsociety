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

function StepCard({ step, index }: { step: FlowStep; index: number }) {
  const isLeft = index % 2 === 0;
  const stepNumber = index + 1;

  return (
    <div className="relative md:grid md:grid-cols-2 md:gap-12">
      <div
        className={
          isLeft
            ? 'md:col-start-1 md:pr-10'
            : 'md:col-start-2 md:pl-10'
        }
      >
        <div className="group relative rounded-2xl border border-white/10 bg-white/5 p-6 md:p-7 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-orange-500/40">
          <div className="flex items-start gap-4">
            <div className="md:hidden flex h-10 w-10 items-center justify-center rounded-xl border border-orange-500/30 bg-orange-500/10 text-orange-300 font-semibold">
              {stepNumber}
            </div>
            <div className="min-w-0">
              <h3 className="text-xl md:text-2xl font-semibold text-white">
                {step.title}
              </h3>
              <p className="mt-3 text-zinc-400 leading-relaxed">
                {step.description}
              </p>

              {step.points && step.points.length > 0 && (
                <ul className="mt-5 space-y-2">
                  {step.points.map((point) => (
                    <li key={point} className="flex items-start gap-3 text-sm text-zinc-400">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-400/80" />
                      <span className="leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="hidden md:flex absolute left-1/2 top-8 -translate-x-1/2 items-center justify-center">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-orange-500/25 blur-lg" />
          <div className="relative h-12 w-12 rounded-full border border-orange-500/40 bg-[#14141a]/70 text-orange-200 flex items-center justify-center font-semibold shadow-[0_0_0_1px_rgba(255,255,255,0.06)]">
            {stepNumber}
          </div>
        </div>
      </div>
    </div>
  );
}

export function HowItWorksPage() {
  return (
    <main className="relative pt-24 pb-20 px-4 overflow-hidden">
      {/* Soft orbs background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-orange-500/10 blur-3xl" />
        <div className="absolute top-24 -left-24 h-[360px] w-[360px] rounded-full bg-orange-400/5 blur-3xl" />
        <div className="absolute -bottom-32 right-0 h-[520px] w-[520px] rounded-full bg-white/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        {/* Hero */}
        <section className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/25 bg-orange-500/10 px-4 py-2 text-sm text-orange-200">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
            Alur pembelian yang rapi dan jelas
          </div>

          <h1 className="mt-6 text-4xl md:text-5xl font-bold tracking-tight text-white">
            Cara kerja yang terasa{' '}
            <span className="text-orange-300">ringan</span>
          </h1>

          <p className="mt-4 mx-auto max-w-2xl text-lg text-zinc-400 leading-relaxed">
            Dari pilih produk sampai produk diterima, semuanya berjalan dalam 4 langkah.
            Tanpa tampilan rumit—cocok untuk pemula.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="/shop">Lihat Produk</Button>
            <Button variant="secondary" href="/support">
              Tanya Support
            </Button>
          </div>
        </section>

        {/* Process */}
        <section className="mt-16 md:mt-20">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Effortless Flow, langkah demi langkah
            </h2>
            <p className="mt-3 text-zinc-400">
              Setiap langkah dibuat singkat, jelas, dan mudah diikuti.
            </p>
          </div>

          <div className="relative mt-10 md:mt-14">
            {/* Glowing vertical path (desktop) */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-orange-500/35 to-transparent" />
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[2px] -translate-x-1/2 bg-orange-500/10 blur-sm" />

            <div className="space-y-8 md:space-y-12">
              {steps.map((step, index) => (
                <StepCard key={step.title} step={step} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-16 md:mt-20">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Pertanyaan yang sering muncul
            </h2>
            <p className="mt-3 text-zinc-400">
              Jawaban singkat untuk membantu Anda cepat mulai.
            </p>
          </div>

          <div className="mt-8 mx-auto max-w-3xl">
            <Accordion items={faqItems} defaultOpenIndex={0} />
          </div>
        </section>

        {/* CTA */}
        <section className="mt-16 md:mt-20">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 md:p-12 shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl">
            <div className="pointer-events-none absolute -top-24 right-6 h-72 w-72 rounded-full bg-orange-500/10 blur-3xl" />

            <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              <div className="max-w-xl">
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                  Siap mulai? Pilih produk, kami bantu prosesnya.
                </h2>
                <p className="mt-3 text-zinc-400 leading-relaxed">
                  Lihat produk di Shop, atau hubungi Support jika Anda ingin arahan yang lebih personal.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button href="/shop">Ke Shop</Button>
                <Button variant="secondary" href="/support">
                  Ke Support
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
