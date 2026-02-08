'use client';

import { useEffect, useMemo, useState } from 'react';
import { PageHero } from '../../components/PageHero';
import { PageLayoutWithFooter } from '../../components/PageLayout';
import { getPagePublic, type PageContent } from '../../lib/api';

function toMapsEmbedSrc(input: string | null | undefined, addressFallback: string | null | undefined): string | null {
  const raw = String(input ?? '').trim();
  const addr = String(addressFallback ?? '').trim();

  // If user didn't provide any link, embed from address as a convenience
  if (!raw) {
    if (!addr) return null;
    return `https://www.google.com/maps?q=${encodeURIComponent(addr)}&output=embed`;
  }

  // If user provided plain address text
  if (!raw.startsWith('http://') && !raw.startsWith('https://')) {
    return `https://www.google.com/maps?q=${encodeURIComponent(raw)}&output=embed`;
  }

  // If already an embed URL
  if (raw.includes('/maps/embed') || raw.includes('output=embed')) return raw;

  // Try to convert common Google Maps URLs into embeddable form
  try {
    const u = new URL(raw);
    if (u.hostname.includes('google.') && u.pathname.startsWith('/maps')) {
      u.searchParams.set('output', 'embed');
      return u.toString();
    }
  } catch {
    // ignore
  }

  // Fallback: embed from address if we have it; still show the raw link as "Haritada aç"
  if (addr) return `https://www.google.com/maps?q=${encodeURIComponent(addr)}&output=embed`;
  return null;
}

function toMapsOpenHref(input: string | null | undefined, addressFallback: string | null | undefined): string | null {
  const raw = String(input ?? '').trim();
  const addr = String(addressFallback ?? '').trim();
  if (!raw) {
    if (!addr) return null;
    return `https://www.google.com/maps?q=${encodeURIComponent(addr)}`;
  }
  if (!raw.startsWith('http://') && !raw.startsWith('https://')) {
    return `https://www.google.com/maps?q=${encodeURIComponent(raw)}`;
  }
  // If it's an embed link, keep it as open href too (still works in new tab)
  return raw;
}

export default function ContactPage() {
  const fallback = useMemo(
    () => ({
      heroTitle: 'İletişim',
      heroSubtitle: 'ANTMUTDER ile iletişime geçin. Sorularınız ve talepleriniz için bize ulaşın.',
      contactAddress: 'Antalya / Türkiye',
      contactEmail: 'info@antmutder.org',
      contactPhone: '+90 (242) 000 00 00',
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
  const embedSrc = useMemo(() => toMapsEmbedSrc(mapEmbedUrl, contactAddress), [mapEmbedUrl, contactAddress]);
  const openHref = useMemo(() => toMapsOpenHref(mapEmbedUrl, contactAddress), [mapEmbedUrl, contactAddress]);

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

      <section className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="border-2 border-navy bg-white p-6">
          <h2 className="font-heading text-xl font-bold text-navy">İletişim Bilgileri</h2>
          <div className="mt-4 space-y-2 text-sm text-navy/80">
            <p>Adres: {contactAddress}</p>
            <p>E-posta: {contactEmail}</p>
            <p>Telefon: {contactPhone}</p>
          </div>

          {embedSrc ? (
            <div className="mt-6 overflow-hidden border-2 border-navy bg-cream-dark">
              <div className="relative aspect-[16/10] w-full sm:aspect-[16/9]">
                <iframe
                  title="Google Maps"
                  src={embedSrc}
                  className="absolute inset-0 h-full w-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              {openHref ? (
                <div className="flex flex-wrap items-center justify-between gap-2 border-t-2 border-navy bg-white px-4 py-3">
                  <div className="text-xs text-navy/60">Harita linki:</div>
                  <a
                    href={openHref}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-semibold text-teal hover:text-teal-dark"
                  >
                    Haritada aç →
                  </a>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="mt-6 border-2 border-navy bg-cream-dark p-6 text-sm text-navy/80">
              Harita henüz eklenmedi. Platform Admin &gt; İletişim bölümünden Google Maps linki veya adres ekleyebilirsiniz.
            </div>
          )}
        </div>

        <div className="border-2 border-navy bg-white p-6">
          <h2 className="font-heading text-xl font-bold text-navy">Mesaj Gönder</h2>
          <p className="mt-1 text-sm text-navy/70">Form demo amaçlıdır.</p>

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
              className="w-full border-2 border-navy bg-white px-4 py-3 text-sm outline-none focus:border-teal"
              placeholder="Ad Soyad"
              required
            />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-2 border-navy bg-white px-4 py-3 text-sm outline-none focus:border-teal"
              placeholder="E-posta"
              type="email"
              required
            />
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[140px] w-full border-2 border-navy bg-white px-4 py-3 text-sm outline-none focus:border-teal"
              placeholder="Mesajınız…"
              required
            />
            <button
              type="submit"
              className="w-full border-2 border-teal bg-teal px-5 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-teal-dark"
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

