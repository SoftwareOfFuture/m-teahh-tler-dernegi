'use client';

import Link from 'next/link';
import { PageHero } from '../../components/PageHero';
import { PageLayoutWithFooter } from '../../components/PageLayout';

type KentselCardItem = {
  title: string;
  description: string;
  cta: string;
  href: string;
  size: 'sm' | 'lg';
};

const CARDS: KentselCardItem[] = [
  {
    title: 'Riskli Yapı Süreci',
    description: 'Riskli yapıların süreçleri hakkında bilgi almak için inceleyiniz.',
    cta: 'Bakanlık Sayfasına Git',
    href: 'https://altyapi.csb.gov.tr/riskli-yapi-sureci-i-104285',
    size: 'sm',
  },
  {
    title: 'Faiz Desteği',
    description: 'Kentsel dönüşümde faiz desteği hakkında bilgi almak için inceleyiniz.',
    cta: 'İncele',
    href: 'https://altyapi.csb.gov.tr/finansal-destekler-i-4708',
    size: 'sm',
  },
  {
    title: 'Kira Yardımı Kılavuzu',
    description: 'Kentsel dönüşümde kira yardımı hakkında bilgi almak için inceleyiniz.',
    cta: 'İncele',
    href: 'https://webdosya.csb.gov.tr/db/altyapi/icerikler/kira-yardim-kilavuzu-2024-20240506155234.pdf',
    size: 'sm',
  },
  {
    title: '6306 Sayılı Kanun Kapsamında Protokol Yapılmış Bankalar',
    description: 'Kanun kapsamında anlaşma yapılmış olan bankaların listesini inceleyiniz.',
    cta: 'Bankalar Listesi',
    href: 'https://altyapi.csb.gov.tr/6306-sayili-kanun-kapsaminda-protokol-yapilmis-bankalar-i-2906',
    size: 'lg',
  },
  {
    title: '6306 Sayılı Kanun Kapsamında Riskli Yapıların Tespiti için Yetki Verilen Kurum ve Kuruluşlar',
    description: 'Yetki verilen kurum ve kuruluşlar listesini incelemek için ilgili bakanlık sayfasına gidiniz.',
    cta: 'Bakanlık Sayfasına Git',
    href: 'https://altyapi.csb.gov.tr/riskli-yapi-tespiti-ile-ilgili-kuruluslar',
    size: 'lg',
  },
];

function KentselCard({ item }: { item: KentselCardItem }) {
  return (
    <a
      href={item.href}
      target="_blank"
      rel="noreferrer"
      className="group block min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-burgundy/20 hover:shadow-soft-lg sm:p-6"
    >
      <h3 className="text-base font-bold text-slate-800 transition-colors group-hover:text-burgundy sm:text-lg">
        {item.title}
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-slate-600">{item.description}</p>
      <div className="mt-5 flex flex-wrap items-center gap-2">
        <span className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl bg-burgundy px-5 py-2.5 text-sm font-semibold text-white transition-colors group-hover:bg-burgundy-dark">
          {item.cta}
        </span>
      </div>
    </a>
  );
}

export default function KentselDonusumPage() {
  return (
    <PageLayoutWithFooter>
      <PageHero
        title="Kentsel Dönüşüm"
        subtitle="Antalya İnşaat Müteahhitleri Derneği olarak kentsel dönüşüm süreçleri hakkında üyelerimizi ve sektörü bilgilendirmek amacıyla hazırlanan kaynaklara aşağıdan ulaşabilirsiniz."
      />

      <section className="mt-8 min-w-0">
        <div className="flex min-w-0 flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-slate-900 sm:text-xl">Kaynaklar ve Bağlantılar</h2>
          <Link
            href="/"
            className="text-sm font-semibold text-burgundy transition-colors hover:text-burgundy-dark"
          >
            Ana sayfaya dön →
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 min-w-0 sm:gap-5 lg:grid-cols-6">
          {CARDS.map((c, idx) => (
            <div
              key={`${c.title}-${idx}`}
              className={c.size === 'lg' ? 'min-w-0 lg:col-span-3' : 'min-w-0 lg:col-span-2'}
            >
              <KentselCard item={c} />
            </div>
          ))}
        </div>
      </section>
    </PageLayoutWithFooter>
  );
}
