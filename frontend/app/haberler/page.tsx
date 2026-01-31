import Link from 'next/link';
import { NewsCard } from '../../components/NewsCard';
import { PageHero } from '../../components/PageHero';
import { PageLayoutWithFooter } from '../../components/PageLayout';
import { newsItems } from '../../lib/dummyData';

export default function NewsPage() {
  return (
    <PageLayoutWithFooter>
      <PageHero title="Haberler" subtitle="Derneğimizden ve sektörden güncel haberler." />

      <section className="mt-8">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-slate-900">Güncel Haberler</h2>
          <Link href="/" className="text-sm font-semibold text-burgundy hover:text-burgundy-dark">
            Ana sayfaya dön →
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {newsItems.map((item) => (
            <NewsCard key={item.id} item={item} />
          ))}
        </div>
      </section>
    </PageLayoutWithFooter>
  );
}

