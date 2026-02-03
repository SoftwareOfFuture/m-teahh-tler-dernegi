import Image from 'next/image';
import { PageLayoutWithFooter } from '../../components/PageLayout';
type KentselCardItem = {
  title: string;
  description: string;
  cta: string;
  href: string;
  size: 'sm' | 'lg';
};

const BG =
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2400&q=70';

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
      className={`group relative overflow-hidden rounded-2xl border border-white/15 bg-black/25 p-6 shadow-[0_10px_40px_rgba(0,0,0,0.25)] backdrop-blur-sm transition-colors hover:bg-black/35 ${
        item.size === 'lg' ? 'min-h-[170px] sm:min-h-[190px]' : 'min-h-[140px]'
      }`}
    >
      <h3 className="text-center text-base font-extrabold text-white sm:text-lg">{item.title}</h3>
      <p className="mt-3 text-center text-xs leading-relaxed text-white/75 sm:text-sm">{item.description}</p>

      <div className="mt-5 flex justify-center">
        <span className="inline-flex items-center justify-center rounded-md bg-orange-600 px-5 py-2 text-xs font-extrabold text-white shadow transition-colors group-hover:bg-orange-700">
          {item.cta}
        </span>
      </div>
    </a>
  );
}

export default function KentselDonusumPage() {
  return (
    <PageLayoutWithFooter>
      <section className="relative mt-8 overflow-hidden rounded-3xl">
        <div className="absolute inset-0">
          <Image
            src={BG}
            alt=""
            fill
            unoptimized
            priority
            sizes="100vw"
            className="object-cover object-center grayscale"
          />
          <div className="absolute inset-0 bg-black/55" />
        </div>

        <div className="relative px-5 py-10 sm:px-8 sm:py-12 lg:px-12 lg:py-16">
          <h1 className="text-center text-3xl font-extrabold tracking-wide text-white sm:text-4xl">
            Kentsel Dönüşüm
          </h1>

          <div className="mt-8 w-full">
            <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-6">
              {CARDS.map((c, idx) => (
                <div
                  key={`${c.title}-${idx}`}
                  className={c.size === 'lg' ? 'lg:col-span-3' : 'lg:col-span-2'}
                >
                  <KentselCard item={c} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </PageLayoutWithFooter>
  );
}

