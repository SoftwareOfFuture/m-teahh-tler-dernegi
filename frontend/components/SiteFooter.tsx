import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="mt-20 w-full overflow-hidden rounded-3xl bg-slate-900 shadow-soft-lg safe-area-inset-bottom">
      <div className="px-6 py-14 sm:px-10 lg:px-14 lg:py-16">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between md:gap-16">
          <div>
            <p className="text-lg font-semibold text-white">Antalya İnşaat Müteahhitleri Derneği</p>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-400">
              Paylaşım, dayanışma ve sektörel sorunların çözümü için birlikte çalışıyoruz.
            </p>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500">
              <Link href="/kvkk" className="transition-colors hover:text-white">KVKK</Link>
              <Link href="/kullanim-sartlari" className="transition-colors hover:text-white">Kullanım Şartları</Link>
              <Link href="/uyelik-sartlari" className="transition-colors hover:text-white">Üyelik Şartları</Link>
              <Link href="/sms-geri-bildirim" className="transition-colors hover:text-white">SMS ile Geri Bildirim</Link>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/iletisim"
              className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-slate-600 px-6 py-2.5 text-sm font-medium text-white transition-all duration-300 hover:border-burgundy hover:bg-burgundy/20"
            >
              İletişim
            </Link>
            <Link
              href="/uyelerimiz"
              className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-burgundy px-6 py-2.5 text-sm font-semibold text-white shadow-soft transition-all duration-300 hover:bg-burgundy-dark hover:shadow-glow active:scale-[0.98]"
            >
              Üyelerimiz
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
