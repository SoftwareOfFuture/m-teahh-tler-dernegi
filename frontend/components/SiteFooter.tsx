import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="mt-16 w-full border-t-4 border-navy bg-navy safe-area-inset-bottom">
      <div className="px-4 py-12 sm:px-6 lg:px-10 lg:py-14">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between md:gap-12">
          <div>
            <p className="font-heading text-xl font-semibold text-white">Antalya İnşaat Müteahhitleri Derneği</p>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-white/70">
              Paylaşım, dayanışma ve sektörel sorunların çözümü için birlikte çalışıyoruz.
            </p>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/60">
              <Link href="/kvkk" className="hover:text-teal">KVKK</Link>
              <Link href="/kullanim-sartlari" className="hover:text-teal">Kullanım Şartları</Link>
              <Link href="/uyelik-sartlari" className="hover:text-teal">Üyelik Şartları</Link>
              <Link href="/sms-geri-bildirim" className="hover:text-teal">SMS ile Geri Bildirim</Link>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/iletisim"
              className="inline-flex min-h-[44px] items-center justify-center border-2 border-white/40 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:border-teal hover:bg-teal/20"
            >
              İletişim
            </Link>
            <Link
              href="/uyelerimiz"
              className="inline-flex min-h-[44px] items-center justify-center border-2 border-teal bg-teal px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-dark hover:border-teal-dark"
            >
              Üyelerimiz
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
