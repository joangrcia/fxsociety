import { Button, Accordion } from '../components/shared';

interface StepProps {
  number: number;
  title: string;
  description: string;
  details?: string[];
}

function StepSection({ number, title, description, details }: StepProps) {
  return (
    <div className="relative flex gap-6 md:gap-8">
      {/* Step number and line */}
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-lg md:text-xl shrink-0">
          {number}
        </div>
        <div className="w-0.5 flex-1 bg-gradient-to-b from-emerald-500/30 to-transparent mt-4" />
      </div>

      {/* Content */}
      <div className="pb-12 md:pb-16">
        <h3 className="text-xl md:text-2xl font-semibold text-white mb-3">{title}</h3>
        <p className="text-zinc-400 leading-relaxed mb-4">{description}</p>
        {details && details.length > 0 && (
          <ul className="space-y-2">
            {details.map((detail, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-zinc-500">
                <svg className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>{detail}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

const steps: StepProps[] = [
  {
    number: 1,
    title: 'Pilih Produk',
    description: 'Jelajahi toko kami dan temukan produk yang sesuai dengan kebutuhan trading Anda. Setiap produk dilengkapi deskripsi lengkap dan preview.',
    details: [
      'Lihat kategori: Indikator, Robot EA, Ebook, Merchandise',
      'Baca deskripsi dan fitur produk',
      'Cek review dan rating dari pengguna lain',
    ],
  },
  {
    number: 2,
    title: 'Isi Form Pemesanan',
    description: 'Klik "Pesan" dan isi data Anda. Kami hanya meminta informasi yang diperlukan untuk memproses pesanan.',
    details: [
      'Nama lengkap',
      'Alamat email aktif',
      'Nomor WhatsApp',
    ],
  },
  {
    number: 3,
    title: 'Lakukan Pembayaran',
    description: 'Transfer ke rekening yang tertera sesuai total pesanan Anda. Setelah transfer, konfirmasi pembayaran via WhatsApp.',
    details: [
      'Bank BCA',
      'Bank Mandiri',
      'GoPay',
      'Dana',
    ],
  },
  {
    number: 4,
    title: 'Terima Produk',
    description: 'Setelah pembayaran dikonfirmasi oleh tim kami, Anda akan menerima akses produk sesuai dengan jenis pembelian.',
    details: [
      'Produk digital: Link download via email dalam 1x24 jam',
      'Produk fisik: Info pengiriman via WhatsApp, estimasi 2-5 hari kerja',
    ],
  },
];

const faqItems = [
  {
    question: 'Apakah ada garansi untuk produk digital?',
    answer: 'Ya, kami memberikan garansi 7 hari untuk semua produk digital. Jika ada kendala teknis yang tidak bisa diselesaikan, kami akan membantu atau memberikan refund sesuai kebijakan.',
  },
  {
    question: 'Bagaimana jika saya butuh bantuan setelah pembelian?',
    answer: 'Kami menyediakan support via WhatsApp untuk semua pelanggan. Tim kami siap membantu instalasi, konfigurasi, dan menjawab pertanyaan Anda.',
  },
  {
    question: 'Apakah bisa refund jika tidak puas?',
    answer: 'Untuk produk digital, refund dapat diajukan dalam 7 hari setelah pembelian dengan alasan teknis yang valid. Untuk merchandise, refund berlaku jika produk rusak atau salah kirim.',
  },
  {
    question: 'Berapa lama akses produk digital berlaku?',
    answer: 'Akses produk digital berlaku selamanya (lifetime). Anda juga akan mendapatkan update gratis untuk versi-versi selanjutnya.',
  },
];

export function HowItWorksPage() {
  return (
    <main className="pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Cara Kerja
          </h1>
          <p className="text-zinc-400 max-w-xl mx-auto">
            Proses pembelian yang <span className="text-emerald-400">simpel</span> dan transparan.
            Dari memilih produk sampai menerima akses, semuanya mudah.
          </p>
        </div>

        {/* Steps Section */}
        <section className="mb-20">
          <div className="space-y-0">
            {steps.map((step, index) => (
              <StepSection key={index} {...step} />
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center">
            Yang Sering Ditanyakan
          </h2>
          <Accordion items={faqItems} defaultOpenIndex={0} />
        </section>

        {/* CTA Section */}
        <section>
          <div className="bg-gradient-to-br from-[#1e1e26] to-[#14141a] rounded-3xl p-8 md:p-12 border border-white/5 text-center">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-3">
              Ada pertanyaan lain?
            </h2>
            <p className="text-zinc-400 mb-6">
              Tim kami siap membantu Anda.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button href="/support">
                Hubungi Support
              </Button>
              <Button variant="secondary" href="/shop">
                Lihat Produk
              </Button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
