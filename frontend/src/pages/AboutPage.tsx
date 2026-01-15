import { type ReactNode } from 'react';
import { Button } from '../components/shared';

interface ValueCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

function ValueCard({ icon, title, description }: ValueCardProps) {
  return (
    <div className="group glass-panel rounded-2xl p-6 shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-1 hover:border-orange-500/30">
      <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-300 mb-4 group-hover:bg-orange-500/15 group-hover:border-orange-500/35 transition-colors">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-zinc-300/90 leading-relaxed">{description}</p>
    </div>
  );
}

export function AboutPage() {
  return (
    <main className="relative overflow-hidden">
      {/* Hero */}
      <section className="relative px-4 pt-24 pb-14">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(249,115,22,0.12),transparent_55%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.06),transparent_45%)] pointer-events-none" />

        {/* Soft abstract orbs */}
        <div className="absolute -top-32 -left-32 w-[520px] h-[520px] rounded-full bg-orange-500/15 blur-3xl animate-float pointer-events-none" />
        <div className="absolute top-24 -right-40 w-[620px] h-[620px] rounded-full bg-orange-400/10 blur-3xl animate-float [animation-delay:900ms] pointer-events-none" />
        <div className="absolute -bottom-48 left-1/2 -translate-x-1/2 w-[760px] h-[760px] rounded-full bg-orange-500/10 blur-3xl animate-float [animation-delay:1400ms] pointer-events-none" />

        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="glass-panel rounded-3xl p-8 md:p-12 shadow-[var(--shadow-card)]">
            <p className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs text-zinc-300 bg-white/5 border border-white/10">
              <span className="w-2 h-2 rounded-full bg-orange-400 shadow-[0_0_18px_rgba(249,115,22,0.55)]" />
              Tentang fxsociety
            </p>

            <div className="mt-6">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white">
                Membantu Trader Pemula{' '}
                <span className="text-orange-300 text-shadow-glow">Tumbuh</span>
                <span className="text-zinc-500">.</span>
              </h1>
              <p className="mt-5 text-base sm:text-lg text-zinc-300/90 max-w-2xl leading-relaxed">
                Kami membuat marketplace produk trading yang terasa lebih manusiawi: jelas, rapi, dan ramah untuk
                pemula. Di sini Anda tidak akan menemukan janji “pasti profit”—yang ada adalah alat bantu,
                panduan, dan support yang bisa diandalkan.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:items-center">
                <Button size="lg" href="/shop">
                  Lihat Produk
                </Button>
                <Button size="lg" variant="secondary" href="/support">
                  Tanya Support
                </Button>
                <p className="text-xs text-zinc-500 sm:ml-2">
                  Catatan: trading punya risiko, hasil tiap orang berbeda.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-16">
        <div className="max-w-6xl mx-auto space-y-16">
          {/* Founder letter */}
          <section className="grid lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7">
              <div className="glass-panel rounded-3xl p-8 md:p-10 shadow-[var(--shadow-card)]">
                <p className="text-xs uppercase tracking-widest text-zinc-500">Surat singkat</p>
                <h2 className="mt-3 text-2xl md:text-3xl font-bold text-white">
                  Kenapa fxsociety ada?
                </h2>

                <div className="mt-6 space-y-4 text-zinc-300/90 leading-relaxed">
                  <p>Halo,</p>
                  <p>
                    fxsociety lahir dari pengalaman yang sederhana: banyak pemula ingin belajar trading, tapi
                    justru “tersesat” karena kebanyakan informasi, setting yang rumit, dan narasi yang terlalu
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
                  <p>
                    Kalau Anda baru mulai, semoga Anda merasa “punya teman” di sini.
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-white/10">
                  <p className="text-sm text-white font-semibold">— Tim fxsociety</p>
                  <p className="text-xs text-zinc-500">Dibangun dengan fokus pemula, dan tetap jujur.</p>
                </div>
              </div>
            </div>

            <aside className="lg:col-span-5 space-y-6">
              <div className="glass-panel rounded-3xl p-7 shadow-[var(--shadow-card)]">
                <p className="text-xs uppercase tracking-widest text-zinc-500">Yang kami jaga</p>
                <h3 className="mt-3 text-lg font-semibold text-white">Standar yang sederhana</h3>
                <ul className="mt-5 space-y-4">
                  {[
                    {
                      title: 'Deskripsi produk dibuat jelas',
                      detail: 'Anda tahu apa yang Anda beli, untuk siapa, dan cara pakainya.',
                    },
                    {
                      title: 'Tidak ada klaim profit pasti',
                      detail: 'Kami menghindari janji berlebihan dan bahasa yang menyesatkan.',
                    },
                    {
                      title: 'Support yang bisa diajak ngobrol',
                      detail: 'Kalau bingung, Anda bisa tanya—kami bantu pelan-pelan.',
                    },
                  ].map((item) => (
                    <li key={item.title} className="flex gap-3">
                      <div className="mt-1 w-6 h-6 rounded-full bg-orange-500/15 border border-orange-500/25 flex items-center justify-center shrink-0">
                        <svg
                          className="w-3.5 h-3.5 text-orange-300"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-white font-medium">{item.title}</p>
                        <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{item.detail}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="glass-panel rounded-3xl p-7 shadow-[var(--shadow-card)]">
                <p className="text-xs uppercase tracking-widest text-zinc-500">Prinsip kecil</p>
                <p className="mt-3 text-sm text-zinc-300/90 leading-relaxed">
                  Kami lebih suka Anda paham prosesnya, daripada hanya mengejar hasil.
                  Jika ada bagian yang kurang jelas, beri tahu kami—kami akan perbaiki.
                </p>
              </div>
            </aside>
          </section>

          {/* Values */}
          <section>
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-white">Nilai yang terasa di setiap halaman</h2>
              <p className="mt-4 text-zinc-400 leading-relaxed">
                Bukan sekadar kata-kata. Ini cara kami merancang produk, copy, dan support.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-6">
                <ValueCard
                  icon={
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 3l7 4v5c0 5-3 9-7 9s-7-4-7-9V7l7-4z"
                      />
                    </svg>
                  }
                  title="Kejujuran"
                  description="Kami menghindari klaim berlebihan. Trading punya risiko, dan hasil bisa berbeda untuk setiap orang."
                />
              </div>
              <div className="md:col-span-6">
                <ValueCard
                  icon={
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  }
                  title="Kesederhanaan"
                  description="Produk dan panduan dibuat agar bisa dipahami cepat. Kalau perlu, kami jelaskan ulang dengan bahasa yang lebih mudah."
                />
              </div>
              <div className="md:col-span-7">
                <ValueCard
                  icon={
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                  }
                  title="Edukasi"
                  description="Kami ingin Anda paham cara pakai dan cara berpikirnya. Setiap produk diarahkan untuk membantu proses belajar, bukan menggantikan keputusan Anda."
                />
              </div>
              <div className="md:col-span-5">
                <ValueCard
                  icon={
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M18.364 5.636l-2.121 2.121m-9.9 9.9l-2.121 2.121m0-16.97l2.121 2.121m11.314 11.314l2.121 2.121M12 8v4l2 2"
                      />
                    </svg>
                  }
                  title="Support"
                  description="Kalau Anda mentok, Anda tidak sendirian. Kami siap bantu troubleshooting dan menjawab pertanyaan dengan tenang."
                />
              </div>
            </div>
          </section>

          {/* Community / credibility */}
          <section className="grid lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7">
              <div className="glass-panel rounded-3xl p-8 md:p-10 shadow-[var(--shadow-card)]">
                <p className="text-xs uppercase tracking-widest text-zinc-500">Komunitas & kepercayaan</p>
                <h2 className="mt-3 text-2xl md:text-3xl font-bold text-white">Dibangun pelan-pelan, tapi serius</h2>
                <p className="mt-5 text-zinc-300/90 leading-relaxed">
                  Kami tidak mengejar “ramai” dengan janji manis. fxsociety dibangun dengan fokus: membuat pengalaman
                  membeli dan memakai produk trading jadi lebih jelas untuk pemula.
                </p>

                <div className="mt-8 grid sm:grid-cols-2 gap-4">
                  {[
                    {
                      title: 'Copy yang jujur',
                      detail: 'Kami menulis dengan bahasa yang realistis, termasuk bagian risikonya.',
                    },
                    {
                      title: 'Panduan yang rapi',
                      detail: 'Kami menyiapkan langkah instalasi dan penggunaan agar Anda tidak bingung.',
                    },
                    {
                      title: 'Support yang mudah dihubungi',
                      detail: 'Kalau ada kendala teknis, Anda bisa hubungi tim support.',
                    },
                    {
                      title: 'Produk bertahap, bukan asal banyak',
                      detail: 'Kami lebih memilih kualitas dan kejelasan dibanding menumpuk katalog.',
                    },
                  ].map((item) => (
                    <div key={item.title} className="rounded-2xl bg-white/5 border border-white/10 p-5">
                      <p className="text-sm font-semibold text-white">{item.title}</p>
                      <p className="mt-2 text-xs text-zinc-400 leading-relaxed">{item.detail}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-8 rounded-2xl bg-orange-500/10 border border-orange-500/20 p-5">
                  <p className="text-sm text-white font-semibold">Pengingat penting</p>
                  <p className="mt-2 text-xs text-zinc-200/90 leading-relaxed">
                    Trading mengandung risiko dan tidak ada produk yang bisa menjamin profit.
                    Produk fxsociety adalah alat bantu dan materi belajar—bukan janji hasil.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="glass-panel rounded-3xl p-8 shadow-[var(--shadow-card)]">
                <h3 className="text-lg font-semibold text-white">Mulai dari langkah yang kecil</h3>
                <p className="mt-3 text-sm text-zinc-300/90 leading-relaxed">
                  Jika Anda baru mulai, kami sarankan pilih satu produk yang paling sesuai kebutuhan Anda, lalu
                  ikuti panduannya pelan-pelan.
                </p>

                <div className="mt-6 space-y-3">
                  <div className="flex items-center justify-between rounded-2xl bg-white/5 border border-white/10 px-4 py-3">
                    <span className="text-sm text-zinc-300">Cari produk</span>
                    <span className="text-xs text-orange-300">/shop</span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl bg-white/5 border border-white/10 px-4 py-3">
                    <span className="text-sm text-zinc-300">Tanya support</span>
                    <span className="text-xs text-orange-300">/support</span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl bg-white/5 border border-white/10 px-4 py-3">
                    <span className="text-sm text-zinc-300">Baca cara kerja</span>
                    <span className="text-xs text-orange-300">/how-it-works</span>
                  </div>
                </div>

                <div className="mt-7 flex flex-col sm:flex-row gap-3">
                  <Button href="/shop" size="lg" className="w-full sm:w-auto">
                    Ke Shop
                  </Button>
                  <Button href="/support" size="lg" variant="secondary" className="w-full sm:w-auto">
                    Ke Support
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section>
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-bg-surface-1 px-8 py-10 md:px-12 md:py-12 shadow-[var(--shadow-card)]">
              <div className="absolute -top-32 -right-32 w-[520px] h-[520px] rounded-full bg-orange-500/15 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-44 -left-40 w-[720px] h-[720px] rounded-full bg-orange-400/10 blur-3xl pointer-events-none" />

              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
                <div className="max-w-2xl">
                  <h2 className="text-2xl md:text-3xl font-bold text-white">Siap mulai dengan cara yang lebih tenang?</h2>
                  <p className="mt-4 text-zinc-300/90 leading-relaxed">
                    Lihat produk yang tersedia, atau hubungi support kalau Anda ingin dibantu memilih.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button href="/shop" size="lg">
                    Jelajahi Shop
                  </Button>
                  <Button href="/support" size="lg" variant="secondary">
                    Hubungi Support
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
