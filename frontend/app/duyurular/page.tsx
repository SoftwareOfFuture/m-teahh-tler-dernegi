import Link from 'next/link';
import { AnnouncementCard } from '../../components/AnnouncementCard';
import { PageHero } from '../../components/PageHero';
import { PageLayoutWithFooter } from '../../components/PageLayout';
import { announcements } from '../../lib/dummyData';

export default function AnnouncementsPage() {
  return (
    <PageLayoutWithFooter>
      <PageHero title="Duyurular" subtitle="Güncel duyurular ve bilgilendirmeler." />

      <section className="mt-8 rounded-3xl bg-soft-gray p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-slate-900">Güncel Duyurular</h2>
          <Link href="/" className="text-sm font-semibold text-burgundy hover:text-burgundy-dark">
            Ana sayfaya dön →
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2">
          {announcements.map((item) => (
            <AnnouncementCard key={item.id} item={item} />
          ))}
        </div>
      </section>
    </PageLayoutWithFooter>
  );
}

