'use client';

import { useEffect, useMemo, useState } from 'react';
import { PageHero } from '../../components/PageHero';
import { PageLayoutWithFooter } from '../../components/PageLayout';
import { getPagePublic, type PageContent } from '../../lib/api';

export default function ContactPage() {
  const fallback = useMemo(
    () => ({
      heroTitle: 'İletişim',
      heroSubtitle: 'Bize ulaşın. Mesajınızı iletin, en kısa sürede dönüş yapalım.',
      contactAddress: 'Antalya / Türkiye',
      contactEmail: 'info@ornek-dernek.org',
      contactPhone: '+90 (000) 000 00 00',
      mapEmbedUrl: '',
    }),
    []
  );

  const [page, setPage] = useState<PageContent | null>(null);
  const heroTitle = page?.heroTitle || fallback.heroTitle;
  const heroSubtitle = page?.heroSubtitle || fallback.heroSubtitle;
  const contactAddress = page?.contactAddress || fallback.contactAddress;
  const contactEmail = page?.contactEmail || fallback.contactEmail;
  const contactPhone = page?.contactPhone || fallback.contactPhone;
  const mapEmbedUrl = page?.mapEmbedUrl || fallback.mapEmbedUrl;

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await getPagePublic('iletisim');
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

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  return (
    <PageLayoutWithFooter>
      <PageHero title={heroTitle} subtitle={heroSubtitle} />

      <section className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_420px]">
        <div className="rounded-3xl bg-white p-6 shadow-card">
          <h2 className="text-lg font-bold text-slate-900">İletişim Bilgileri</h2>
          <div className="mt-4 space-y-2 text-sm text-slate-600">
            <p>Adres: {contactAddress}</p>
            <p>E-posta: {contactEmail}</p>
            <p>Telefon: {contactPhone}</p>
          </div>

          {mapEmbedUrl ? (
            <div className="mt-6 overflow-hidden rounded-3xl border border-black/5 bg-soft-gray">
              <div className="relative aspect-[16/10] w-full sm:aspect-[16/9]">
                <iframe
                  title="Google Maps"
                  src={mapEmbedUrl}
                  className="absolute inset-0 h-full w-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          ) : (
            <div className="mt-6 rounded-3xl bg-soft-gray p-6 text-sm text-slate-700">
              Harita henüz eklenmedi. Platform Admin &gt; İletişim bölümünden Google Maps embed URL ekleyebilirsiniz.
            </div>
          )}
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-card">
          <h2 className="text-lg font-bold text-slate-900">Mesaj Gönder</h2>
          <p className="mt-1 text-sm text-slate-600">Form demo amaçlıdır.</p>

          <form
            className="mt-6 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
              setTimeout(() => setSent(false), 2500);
              setName('');
              setEmail('');
              setMessage('');
            }}
          >
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-burgundy"
              placeholder="Ad Soyad"
              required
            />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-burgundy"
              placeholder="E-posta"
              type="email"
              required
            />
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[140px] w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-burgundy"
              placeholder="Mesajınız…"
              required
            />
            <button
              type="submit"
              className="w-full rounded-full bg-burgundy px-5 py-3 text-sm font-semibold text-white shadow-card transition-colors hover:bg-burgundy-dark"
            >
              Gönder
            </button>

            {sent ? <p className="text-center text-sm font-semibold text-emerald-700">Mesaj gönderildi (demo).</p> : null}
          </form>
        </div>
      </section>
    </PageLayoutWithFooter>
  );
}

