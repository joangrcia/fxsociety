import { Button } from '../components/shared';

interface ValueCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function ValueCard({ icon, title, description }: ValueCardProps) {
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

const commitments = [
  'Tidak ada klaim profit pasti atau persentase kemenangan',
  'Produk diuji sebelum dirilis ke publik',
  'Support responsif via WhatsApp',
  'Update berkala untuk produk digital',
  'Refund policy yang jelas dan transparan',
];

export function AboutPage() {
  return (
    <main className="pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Tentang Kami
          </h1>
          <p className="text-zinc-400 max-w-xl mx-auto">
            Kenali lebih dekat siapa di balik <span className="text-emerald-400">fxsociety</span>.
          </p>
        </div>

        {/* Story Section */}
        <section className="mb-20">
          <div className="bg-[#1e1e26] rounded-3xl p-8 md:p-12 border border-white/5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* Illustration placeholder */}
              <div className="order-2 md:order-1">
                <div className="aspect-square rounded-2xl bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="text-6xl mb-4">📈</div>
                    <p className="text-emerald-400 font-medium">fxsociety</p>
                    <p className="text-zinc-500 text-sm">Est. 2024</p>
                  </div>
                </div>
              </div>

              {/* Story text */}
              <div className="order-1 md:order-2">
                <h2 className="text-2xl font-bold text-white mb-4">Cerita Kami</h2>
                <p className="text-zinc-400 leading-relaxed mb-4">
                  fxsociety lahir dari satu pertanyaan sederhana:
                </p>
                <blockquote className="text-xl md:text-2xl font-medium text-emerald-400 mb-6 italic">
                  "Kenapa belajar trading harus serumit ini?"
                </blockquote>
                <p className="text-zinc-400 leading-relaxed mb-4">
                  Kami adalah tim trader dan developer yang percaya bahwa tools trading 
                  yang baik harus mudah digunakan oleh siapa saja — tidak peduli latar 
                  belakang teknis Anda.
                </p>
                <p className="text-zinc-400 leading-relaxed">
                  Dari pengalaman kami sendiri sebagai pemula, kami tahu betapa 
                  frustrasinya menghadapi tools yang rumit dan klaim-klaim profit 
                  yang menyesatkan. Itulah mengapa kami membangun fxsociety.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="mb-20">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center">
            Nilai-Nilai Kami
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ValueCard
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              }
              title="Kejujuran"
              description="Kami tidak menjanjikan profit pasti. Trading ada risikonya, dan kami selalu transparan tentang itu."
            />
            <ValueCard
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              }
              title="Kesederhanaan"
              description="Produk kami dirancang untuk dipahami dalam hitungan menit. Tidak ada jargon rumit."
            />
            <ValueCard
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              }
              title="Edukasi"
              description="Kami ingin Anda paham, bukan hanya ikut-ikutan. Setiap produk dilengkapi panduan lengkap."
            />
          </div>
        </section>

        {/* Commitments Section */}
        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center">
            Komitmen Kami
          </h2>
          <div className="bg-[#1e1e26] rounded-2xl p-6 md:p-8 border border-white/5">
            <ul className="space-y-4">
              {commitments.map((commitment, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-zinc-300">{commitment}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* CTA Section */}
        <section>
          <div className="bg-gradient-to-br from-[#1e1e26] to-[#14141a] rounded-3xl p-8 md:p-12 border border-white/5 text-center">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-3">
              Ingin tahu lebih lanjut?
            </h2>
            <p className="text-zinc-400 mb-6">
              Mari ngobrol. Kami senang mendengar dari Anda.
            </p>
            <Button href="/support">
              Hubungi Kami
            </Button>
          </div>
        </section>
      </div>
    </main>
  );
}
