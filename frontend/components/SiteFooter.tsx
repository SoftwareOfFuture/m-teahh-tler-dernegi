import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="mt-16 w-full max-w-full overflow-hidden rounded-2xl bg-slate-premium shadow-premium-lg sm:mt-20 sm:rounded-3xl safe-area-inset-bottom">
      <div className="relative px-6 py-12 sm:px-10 sm:py-14 lg:px-14 lg:py-16">
        <div className="absolute inset-0 bg-gradient-to-b from-burgundy/10 via-transparent to-transparent" />
        <div className="relative flex flex-col items-start justify-between gap-10 md:flex-row md:items-center md:gap-16">
          <div>
            <p className="text-lg font-semibold tracking-tight text-white">Antalya İnşaat Müteahhitleri Derneği</p>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-400">
              Paylaşım, dayanışma ve sektörel sorunların çözümü için birlikte çalışıyoruz.
            </p>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500">
              <Link href="/kvkk" className="transition-colors duration-300 hover:text-white">
                KVKK
              </Link>
              <Link href="/kullanim-sartlari" className="transition-colors duration-300 hover:text-white">
                Kullanım Şartları
              </Link>
              <Link href="/uyelik-sartlari" className="transition-colors duration-300 hover:text-white">
                Üyelik Şartları
              </Link>
              <Link href="/sms-geri-bildirim" className="transition-colors duration-300 hover:text-white">
                SMS ile Geri Bildirim
              </Link>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/iletisim"
              className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-slate-500/50 px-6 py-2.5 text-sm font-medium text-white transition-all duration-300 active:scale-[0.98] hover:border-slate-400 hover:bg-white/8 sm:px-7"
            >
              İletişim
            </Link>
            <Link
              href="/uyelerimiz"
              className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl bg-burgundy px-6 py-2.5 text-sm font-semibold text-white shadow-premium transition-all duration-300 active:scale-[0.98] hover:bg-burgundy-dark hover:shadow-glow-burgundy sm:px-7"
            >
              Üyelerimiz
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

