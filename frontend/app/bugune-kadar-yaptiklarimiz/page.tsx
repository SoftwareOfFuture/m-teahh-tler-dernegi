'use client';

import { PageHero } from '../../components/PageHero';
import { PageLayoutWithFooter } from '../../components/PageLayout';
import { useEffect, useMemo, useState } from 'react';
import { getPagePublic, type PageContent } from '../../lib/api';

export default function BuguneKadarYaptiklarimizPage() {
  const fallback = useMemo(
    () => ({
      heroTitle: 'Bugüne Kadar Yaptıklarımız',
      heroSubtitle: 'Derneğimizin gerçekleştirdiği etkinlikler, projeler ve başarılar.',
      aboutTitle: 'Çalışmalarımız',
      aboutParagraph1:
        'Derneğimiz kurulduğundan bu yana inşaat sektörüne yönelik çeşitli etkinlikler, eğitimler ve iş birlikleri gerçekleştirmiştir. Bu sayfada derneğimizin bugüne kadar yaptığı çalışmaları bulabilirsiniz.',
      aboutParagraph2: '',
      quickInfo: [] as string[],
    }),
    []
  );

  const [page, setPage] = useState<PageContent | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await getPagePublic('bugune-kadar-yaptiklarimiz');
        if (cancelled) return;
        setPage(res);
      } catch {
        // keep fallback
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const quickInfoLines = useMemo(() => {
    const raw = page?.quickInfo;
    if (raw && raw.trim().length) return raw.split('\n').map((s) => s.trim()).filter(Boolean);
    return fallback.quickInfo;
  }, [fallback.quickInfo, page?.quickInfo]);

  const heroTitle = page?.heroTitle || fallback.heroTitle;
  const heroSubtitle = page?.heroSubtitle || fallback.heroSubtitle;
  const aboutTitle = page?.aboutTitle || fallback.aboutTitle;
  const aboutP1 = page?.aboutParagraph1 || fallback.aboutParagraph1;
  const aboutP2 = page?.aboutParagraph2 || fallback.aboutParagraph2;

  return (
    <PageLayoutWithFooter>
      <PageHero title={heroTitle} subtitle={heroSubtitle} />

      <section className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-2xl bg-white p-6 shadow-soft lg:col-span-2">
          <h2 className="text-xl font-bold text-slate-800">{aboutTitle}</h2>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-600">{aboutP1}</p>
          {aboutP2 ? <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-600">{aboutP2}</p> : null}
        </div>

        {quickInfoLines.length > 0 ? (
          <div className="rounded-2xl bg-slate-100 p-6">
            <h3 className="text-base font-bold text-slate-800">Özet</h3>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              {quickInfoLines.map((line, idx) => (
                <li key={idx}>• {line}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </section>
    </PageLayoutWithFooter>
  );
}
