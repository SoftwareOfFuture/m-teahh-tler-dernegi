import Link from 'next/link';
import { PageHero } from '../../components/PageHero';
import { PageLayoutWithFooter } from '../../components/PageLayout';

const publications = [
  {
    id: 'p1',
    title: 'Sektör Değerlendirme Raporu',
    date: 'Ocak 2026',
    excerpt: 'Yurt içi ve yurt dışı müteahhitlik faaliyetleri için özet rapor.',
  },
  {
    id: 'p2',
    title: 'Mevzuat Bülteni',
    date: 'Aralık 2025',
    excerpt: 'Güncel düzenlemeler, duyurular ve uygulama notları.',
  },
  {
    id: 'p3',
    title: 'Etkinlik Sonuç Raporu',
    date: 'Kasım 2025',
    excerpt: 'Yapılan etkinliklerin çıktı ve önerilerinin derlendiği rapor.',
  },
];

export default function PublicationsPage() {
  return (
    <PageLayoutWithFooter>
      <PageHero title="Yayınlar" subtitle="Raporlar, bültenler ve yayın arşivi." />

      <section className="mt-8">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-slate-900">Yayın Arşivi</h2>
          <Link href="/" className="text-sm font-semibold text-burgundy hover:text-burgundy-dark">
            Ana sayfaya dön →
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {publications.map((p) => (
            <div key={p.id} className="rounded-3xl bg-white p-6 shadow-card">
              <p className="text-xs font-semibold text-slate-500">{p.date}</p>
              <h3 className="mt-2 text-sm font-bold text-slate-900">{p.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{p.excerpt}</p>
              <button
                type="button"
                className="mt-4 inline-flex rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-soft-gray"
              >
                PDF İndir
              </button>
            </div>
          ))}
        </div>
      </section>
    </PageLayoutWithFooter>
  );
}

