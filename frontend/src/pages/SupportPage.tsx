import { Accordion, ContactCard } from '../components/shared';

const faqItems = [
  {
    question: 'Bagaimana cara menginstal indikator?',
    answer: 'Setiap produk indikator dilengkapi panduan instalasi dalam format PDF dan video tutorial. Langkah-langkahnya:\n\n1. Download file indikator (.ex4 atau .ex5)\n2. Buka MetaTrader, klik File > Open Data Folder\n3. Masuk ke folder MQL4/Indicators (atau MQL5/Indicators)\n4. Copy file indikator ke folder tersebut\n5. Restart MetaTrader dan indikator akan muncul di Navigator\n\nJika masih kesulitan, hubungi kami via WhatsApp untuk bantuan langsung.',
  },
  {
    question: 'Apakah produk bisa digunakan di broker manapun?',
    answer: 'Ya, semua indikator dan Robot EA kami kompatibel dengan broker manapun yang menggunakan platform MetaTrader 4 atau MetaTrader 5. Pastikan broker Anda menyediakan platform MT4/MT5.',
  },
  {
    question: 'Bagaimana jika indikator tidak bekerja?',
    answer: 'Jika indikator tidak muncul atau error, coba langkah berikut:\n\n1. Pastikan file sudah di folder yang benar\n2. Restart MetaTrader\n3. Aktifkan "Allow DLL imports" di settings\n4. Cek apakah versi MT sesuai (MT4 atau MT5)\n\nJika masih bermasalah, hubungi support kami dengan screenshot error. Kami akan bantu selesaikan dalam 1x24 jam.',
  },
  {
    question: 'Apakah ada garansi uang kembali?',
    answer: 'Ya, kami memberikan garansi 7 hari untuk produk digital. Refund dapat diajukan jika:\n\n• Ada masalah teknis yang tidak bisa diselesaikan\n• Produk tidak sesuai dengan deskripsi\n\nUntuk merchandise, refund berlaku jika produk rusak atau salah kirim. Ajukan refund via WhatsApp dengan menyertakan bukti pembelian.',
  },
  {
    question: 'Berapa lama akses produk digital berlaku?',
    answer: 'Akses produk digital berlaku selamanya (lifetime). Anda juga akan mendapatkan update gratis untuk versi-versi selanjutnya. Link download tidak akan expire.',
  },
  {
    question: 'Bagaimana cara melacak pengiriman merchandise?',
    answer: 'Setelah pesanan dikirim, kami akan mengirimkan nomor resi via WhatsApp. Anda bisa melacak pengiriman melalui website ekspedisi yang digunakan (JNE, J&T, SiCepat, dll).',
  },
  {
    question: 'Apakah trading dengan indikator ini pasti profit?',
    answer: 'TIDAK. Tidak ada indikator atau robot yang bisa menjamin profit. Trading selalu mengandung risiko kehilangan modal.\n\nProduk kami adalah alat bantu analisis, bukan jaminan keuntungan. Hasil trading bergantung pada banyak faktor termasuk kondisi pasar, manajemen risiko, dan pengalaman trader.\n\nSelalu gunakan money management yang baik dan jangan trading dengan uang yang tidak siap Anda kehilangan.',
  },
];

export function SupportPage() {
  return (
    <main className="min-h-screen pt-24 pb-20 px-4 md:px-6 bg-[#0a0a0f]">
      <div className="max-w-5xl mx-auto">
        {/* Cinematic Header */}
        <div className="text-center mb-16 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-slate-400/10 blur-[80px] rounded-full -z-10" />
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-400/20 bg-slate-400/5 text-slate-300 text-xs tracking-widest uppercase font-medium mb-6 animate-fade-in">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse" />
            Customer Success
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 animate-slide-up">
            Pusat <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400">Bantuan</span>
          </h1>
          <p className="text-zinc-400 max-w-xl mx-auto text-lg leading-relaxed animate-slide-up" style={{ animationDelay: '100ms' }}>
            Kami siap membantu perjalanan trading Anda. <br/>
            Pilih metode kontak yang paling nyaman untuk Anda.
          </p>
        </div>

        {/* Contact Cards */}
        <section className="mb-20 animate-slide-up" style={{ animationDelay: '200ms' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ContactCard
              icon={
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              }
              title="WhatsApp Priority"
              value="+62 812-3456-7890"
              responseTime="< 5 menit"
              href="https://wa.me/6281234567890"
              ctaLabel="Chat Sekarang"
              external
            />
            <ContactCard
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              }
              title="Email Support"
              value="support@fxsociety.id"
              responseTime="1-2 jam kerja"
              href="mailto:support@fxsociety.id"
              ctaLabel="Kirim Email"
            />
          </div>
        </section>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* FAQ Section */}
          <section className="lg:col-span-2 animate-slide-up" style={{ animationDelay: '300ms' }}>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-slate-400 rounded-full" />
              Pertanyaan Umum
            </h2>
            <Accordion items={faqItems} defaultOpenIndex={0} />
          </section>

          {/* Operating Hours */}
          <section className="animate-slide-up" style={{ animationDelay: '400ms' }}>
            <h2 className="text-xl font-bold text-white mb-6">Jam Operasional</h2>
            <div className="bg-[#14141a] rounded-2xl p-6 border border-white/5 relative overflow-hidden group">
               {/* Decorative glow */}
               <div className="absolute top-0 right-0 w-32 h-32 bg-slate-400/5 blur-[50px] rounded-full group-hover:bg-slate-400/10 transition-colors" />

              <div className="relative z-10 space-y-4">
                <div className="flex flex-col gap-1 pb-4 border-b border-white/5">
                  <span className="text-zinc-400 text-sm">Senin - Jumat</span>
                  <span className="text-white font-semibold text-lg">09.00 - 17.00 WIB</span>
                  <span className="text-xs text-slate-300 font-medium bg-slate-400/10 self-start px-2 py-0.5 rounded">Fast Response</span>
                </div>
                
                <div className="flex flex-col gap-1 pb-4 border-b border-white/5">
                  <span className="text-zinc-400 text-sm">Sabtu</span>
                  <span className="text-white font-semibold text-lg">09.00 - 14.00 WIB</span>
                </div>
                
                <div className="flex flex-col gap-1">
                  <span className="text-zinc-400 text-sm">Minggu & Hari Libur</span>
                  <span className="text-zinc-500 font-medium">Tutup</span>
                  <p className="text-xs text-zinc-600 mt-1">
                    *Pesan Anda tetap kami terima dan akan dibalas pada hari kerja berikutnya.
                  </p>
                </div>
              </div>
            </div>

            {/* Additional Info Box */}
            <div className="mt-6 bg-[#14141a] rounded-2xl p-6 border border-white/5">
              <h3 className="text-white font-medium mb-2">Butuh Bantuan Teknis?</h3>
              <p className="text-sm text-zinc-400 leading-relaxed mb-4">
                Untuk kendala instalasi Robot EA atau Indikator, siapkan screenshot error atau video singkat agar kami bisa membantu lebih cepat.
              </p>
              <a href="https://wa.me/6281234567890" className="text-slate-300 hover:text-slate-200 text-sm font-medium flex items-center gap-1 transition-colors">
                Chat Tim Teknis <span className="text-lg">→</span>
              </a>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
