'use client';

import { PageHero } from '../../components/PageHero';
import { PageLayoutWithFooter } from '../../components/PageLayout';
import { useEffect, useMemo, useState } from 'react';
import { getPagePublic, type PageContent } from '../../lib/api';
import { PdfPreviewModal } from '../../components/PdfPreviewModal';

export default function CorporatePage() {
  const fallback = useMemo(
    () => ({
      heroTitle: 'Kurumsal',
      heroSubtitle: 'Antalya İnşaat Müteahhitleri Derneği (ANTMUTDER) vizyonu, misyonu ve kurumsal yapısı.',
      aboutTitle: 'Hakkımızda',
      aboutParagraph1:
        'Antalya İnşaat Müteahhitleri Derneği (ANTMUTDER), inşaat sektöründe faaliyet gösteren müteahhitleri bir araya getiren bir sivil toplum kuruluşudur. Derneğimizin temel amaçları; sektördeki sorunların çözümü, müteahhitler arasında birlik ve beraberliğin sağlanması, paylaşım ve dayanışmanın güçlendirilmesi, sektörün beklentilerine hızlı çözüm üretilmesi ve demokratik ve şeffaf bir yönetim anlayışının benimsenmesidir. Derneğimizin kapısı sektör mensuplarına her zaman açıktır.',
      aboutParagraph2:
        'Derneğimiz; konferans, seminer ve atölye çalışmaları düzenlemekte, networking etkinlikleri ile iş ağlarını geliştirmekte, üyelerine sürekli eğitim sunmakta, sektördeki önemli fuarlarda temsil sağlamaktadır. Kaçak müteahhitlik ile mücadele ve profesyonel müteahhitliği teşvik etme faaliyetleri yürütmekte, yapı müteahhitlerinin sınıflandırılması konusunda bilgilendirme toplantıları düzenlemektedir. İnşaat sektörü ile ilgili önemli konularda söz sahibi olmayı, danışılan bir kuruluş olmayı hedeflemektedir.',
      quickInfo: ['Merkez: Antalya', 'Çalışma Alanı: İnşaat ve müteahhitlik', 'Üyelik: Başvuru + Onay', 'Yönetim: Demokratik ve şeffaf'],
      mission:
        'Paylaşım, dayanışma ve çözüm aranan konularda fikir ve tecrübelerin paylaşılacağı bir platform olmak. Sektörümüzün sorunları ve beklentilerini hızlı ve çabuk çözebilmek için çalışmak.',
      vision:
        'Antalya inşaat sektöründe daha aktif, daha çok söz sahibi, daha çok danışılan ve bilgi istenen, dikkat çeken bir sivil toplum kuruluşu olmak.',
    }),
    []
  );

  const [page, setPage] = useState<PageContent | null>(null);
  const [preview, setPreview] = useState<{ url: string; title: string } | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await getPagePublic('kurumsal');
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
  const mission = page?.mission || fallback.mission;
  const vision = page?.vision || fallback.vision;
  const aboutPdfTitle = page?.aboutPdfTitle || null;
  const aboutPdfUrl = page?.aboutPdfUrl || null;

  return (
    <PageLayoutWithFooter>
      <PageHero title={heroTitle} subtitle={heroSubtitle} />

      <section className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-3xl bg-white p-6 shadow-card lg:col-span-2">
          <h2 className="text-lg font-bold text-slate-900">{aboutTitle}</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">{aboutP1}</p>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">{aboutP2}</p>

          {aboutPdfUrl ? (
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <a
                href={aboutPdfUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-soft-gray"
              >
                PDF İndir
              </a>
              <button
                type="button"
                onClick={() => setPreview({ url: aboutPdfUrl, title: aboutPdfTitle || 'Hakkımızda (PDF)' })}
                className="inline-flex rounded-full bg-burgundy px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-burgundy-dark"
              >
                ÖNİZLEME
              </button>
            </div>
          ) : null}
        </div>

        <div className="rounded-3xl bg-soft-gray p-6">
          <h3 className="text-sm font-bold text-slate-900">Hızlı Bilgiler</h3>
          <ul className="mt-4 space-y-2 text-sm text-slate-700">
            {quickInfoLines.map((line, idx) => (
              <li key={idx}>• {line}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-3xl bg-white p-6 shadow-card">
          <h3 className="text-sm font-bold text-slate-900">Misyon</h3>
          <p className="mt-2 text-sm text-slate-600">{mission}</p>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-card">
          <h3 className="text-sm font-bold text-slate-900">Vizyon</h3>
          <p className="mt-2 text-sm text-slate-600">{vision}</p>
        </div>
      </section>

      <PdfPreviewModal
        open={!!preview}
        url={preview?.url ?? null}
        title={preview?.title}
        onClose={() => setPreview(null)}
      />
    </PageLayoutWithFooter>
  );
}

