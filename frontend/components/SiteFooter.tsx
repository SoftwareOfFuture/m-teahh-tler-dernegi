import Link from 'next/link';

export function SiteFooter() {
  return (
    <div className="mt-10 w-full max-w-full overflow-hidden rounded-2xl bg-slate-900 px-4 py-8 text-white sm:mt-14 sm:rounded-3xl sm:px-6 sm:py-10 safe-area-inset-bottom">
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div>
          <p className="text-sm font-semibold text-white/90">Antalya İnşaat Müteahhitleri Derneği</p>
          <p className="mt-1 text-xs text-white/70">Antalya&apos;nın Geleceğini Güvenle İnşa Ediyoruz</p>
          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-white/70">
            <Link href="/kvkk" className="hover:text-white">
              KVKK
            </Link>
            <Link href="/kullanim-sartlari" className="hover:text-white">
              Kullanım Şartları
            </Link>
            <Link href="/uyelik-sartlari" className="hover:text-white">
              Üyelik Şartları
            </Link>
            <Link href="/sms-geri-bildirim" className="hover:text-white">
              SMS ile Geri Bildirim
            </Link>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 sm:gap-3">
          <Link
            href="/iletisim"
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-white/30 px-4 py-2.5 text-xs font-semibold text-white transition-colors active:scale-[0.98] hover:border-white/60 hover:bg-white/10 sm:px-5 sm:text-sm"
          >
            İletişim
          </Link>
          <Link
            href="/uyelerimiz"
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-burgundy px-4 py-2.5 text-xs font-semibold text-white transition-colors active:scale-[0.98] hover:bg-burgundy-dark sm:px-5 sm:text-sm"
          >
            Üyelerimiz
          </Link>
        </div>
      </div>
    </div>
  );
}

