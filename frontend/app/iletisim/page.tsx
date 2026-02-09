'use client';

import { useEffect, useMemo, useState } from 'react';
import { PageHero } from '../../components/PageHero';
import { PageLayoutWithFooter } from '../../components/PageLayout';
import { getPagePublic, createContactMessage, createSmsFeedback, type PageContent } from '../../lib/api';

const COUNTRY_CODES: Array<{ code: string; label: string }> = [
  { code: '+90', label: 'TR (+90)' },
  { code: '+49', label: 'DE (+49)' },
  { code: '+31', label: 'NL (+31)' },
  { code: '+7', label: 'RU/KZ (+7)' },
  { code: '+1', label: 'US/CA (+1)' },
  { code: '+44', label: 'UK (+44)' },
];

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
  const [msgLoading, setMsgLoading] = useState(false);
  const [msgError, setMsgError] = useState<string | null>(null);

  const [smsName, setSmsName] = useState('');
  const [smsEmail, setSmsEmail] = useState('');
  const [smsPhoneCode, setSmsPhoneCode] = useState(COUNTRY_CODES[0]?.code || '+90');
  const [smsPhone, setSmsPhone] = useState('');
  const [smsMessage, setSmsMessage] = useState('');
  const [smsLoading, setSmsLoading] = useState(false);
  const [smsError, setSmsError] = useState<string | null>(null);
  const [smsSent, setSmsSent] = useState(false);

  return (
    <PageLayoutWithFooter>
      <PageHero title={heroTitle} subtitle={heroSubtitle} />

      <section className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="rounded-2xl bg-white p-6 shadow-soft">
          <h2 className="text-xl font-bold text-slate-800">İletişim Bilgileri</h2>
          <div className="mt-4 space-y-2 text-sm text-slate-600">
            <p>Adres: {contactAddress}</p>
            <p>E-posta: {contactEmail}</p>
            <p>Telefon: {contactPhone}</p>
          </div>

          {embedSrc ? (
            <div className="mt-6 overflow-hidden rounded-2xl bg-slate-100">
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
                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 bg-white px-4 py-3">
                  <div className="text-xs text-slate-500">Harita linki:</div>
                  <a
                    href={openHref}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-semibold text-burgundy hover:text-burgundy-dark"
                  >
                    Haritada aç →
                  </a>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="mt-6 rounded-2xl bg-slate-100 p-6 text-sm text-slate-600">
              Harita henüz eklenmedi. Platform Admin &gt; İletişim bölümünden Google Maps linki veya adres ekleyebilirsiniz.
            </div>
          )}
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-soft">
          <h2 className="text-xl font-bold text-slate-800">Mesaj Gönder</h2>

          <form
            className="mt-6 space-y-4"
            onSubmit={async (e) => {
              e.preventDefault();
              setMsgError(null);
              setMsgLoading(true);
              try {
                await createContactMessage({ name: name.trim(), email: email.trim(), message: message.trim() });
                setSent(true);
                setTimeout(() => setSent(false), 3000);
                setName('');
                setEmail('');
                setMessage('');
              } catch (err: unknown) {
                setMsgError((err as Error)?.message ?? 'Mesaj gönderilemedi.');
              } finally {
                setMsgLoading(false);
              }
            }}
          >
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-burgundy focus:ring-2 focus:ring-burgundy/20"
              placeholder="Ad Soyad"
              required
            />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-burgundy focus:ring-2 focus:ring-burgundy/20"
              placeholder="E-posta"
              type="email"
              required
            />
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[140px] w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-burgundy focus:ring-2 focus:ring-burgundy/20"
              placeholder="Mesajınız…"
              required
            />
            {msgError ? (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{msgError}</div>
            ) : null}
            <button
              type="submit"
              disabled={msgLoading}
              className="w-full rounded-xl bg-burgundy px-5 py-3.5 text-sm font-semibold text-white shadow-soft transition-all hover:bg-burgundy-dark hover:shadow-glow active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {msgLoading ? 'Gönderiliyor…' : 'Gönder'}
            </button>
            {sent ? <p className="text-center text-sm font-semibold text-emerald-700">Mesaj gönderildi.</p> : null}
          </form>
        </div>
      </section>

      <section className="mt-10">
        <div className="rounded-2xl bg-white p-6 shadow-soft">
          <h2 className="text-xl font-bold text-slate-800">SMS ile Geri Bildirim</h2>
          <p className="mt-1 text-sm text-slate-600">
            İsterseniz dönüş için iletişim bilgilerinizi bırakabilirsiniz. Kayıtlar incelenip size dönüş yapılacaktır.
          </p>

          <form
            className="mt-6 max-w-xl space-y-4"
            onSubmit={async (e) => {
              e.preventDefault();
              setSmsError(null);
              const pn = smsPhone.replace(/\D/g, '');
              if (!smsPhoneCode || !/^\+\d{1,4}$/.test(smsPhoneCode)) {
                setSmsError('Lütfen geçerli bir ülke kodu seçin.');
                return;
              }
              if (!pn || pn.length < 4 || pn.length > 15) {
                setSmsError('Lütfen geçerli bir telefon numarası girin.');
                return;
              }
              if (!smsMessage.trim() || smsMessage.trim().length < 5) {
                setSmsError('Lütfen mesajınızı yazın (en az 5 karakter).');
                return;
              }

              setSmsLoading(true);
              try {
                await createSmsFeedback({
                  phoneE164: `${smsPhoneCode}${pn}`,
                  message: smsMessage.trim(),
                  name: smsName.trim() || undefined,
                  email: smsEmail.trim() || undefined,
                  source: 'iletisim',
                });
                setSmsSent(true);
                setTimeout(() => setSmsSent(false), 3000);
                setSmsName('');
                setSmsEmail('');
                setSmsPhone('');
                setSmsMessage('');
              } catch (err: unknown) {
                setSmsError((err as Error)?.message ?? 'Geri bildirim gönderilemedi.');
              } finally {
                setSmsLoading(false);
              }
            }}
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="sms_name" className="text-sm font-semibold text-slate-700">
                  Ad Soyad (opsiyonel)
                </label>
                <input
                  id="sms_name"
                  value={smsName}
                  onChange={(e) => setSmsName(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-burgundy focus:ring-2 focus:ring-burgundy/20"
                />
              </div>
              <div>
                <label htmlFor="sms_email" className="text-sm font-semibold text-slate-700">
                  E-posta (opsiyonel)
                </label>
                <input
                  id="sms_email"
                  value={smsEmail}
                  onChange={(e) => setSmsEmail(e.target.value)}
                  type="email"
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-burgundy focus:ring-2 focus:ring-burgundy/20"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700">Telefon</label>
              <div className="mt-2 flex flex-wrap gap-3">
                <select
                  value={smsPhoneCode}
                  onChange={(e) => setSmsPhoneCode(e.target.value)}
                  aria-label="Ülke kodu"
                  className="w-[140px] rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-burgundy focus:ring-2 focus:ring-burgundy/20"
                >
                  {COUNTRY_CODES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.label}
                    </option>
                  ))}
                </select>
                <input
                  value={smsPhone}
                  onChange={(e) => setSmsPhone(e.target.value)}
                  inputMode="numeric"
                  required
                  className="flex-1 min-w-[160px] rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-burgundy focus:ring-2 focus:ring-burgundy/20"
                  placeholder="Telefon numarası"
                />
              </div>
            </div>
            <div>
              <label htmlFor="sms_message" className="text-sm font-semibold text-slate-700">
                Mesaj
              </label>
              <textarea
                id="sms_message"
                value={smsMessage}
                onChange={(e) => setSmsMessage(e.target.value)}
                required
                rows={4}
                className="mt-2 w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-burgundy focus:ring-2 focus:ring-burgundy/20"
                placeholder="Geri bildiriminizi yazın…"
              />
            </div>
            {smsError ? (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{smsError}</div>
            ) : null}
            <button
              type="submit"
              disabled={smsLoading}
              className="w-full max-w-xs rounded-xl bg-burgundy px-5 py-3.5 text-sm font-semibold text-white shadow-soft transition-all hover:bg-burgundy-dark hover:shadow-glow active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {smsLoading ? 'Gönderiliyor…' : 'Geri Bildirim Gönder'}
            </button>
            {smsSent ? (
              <p className="text-sm font-semibold text-emerald-700">Geri bildiriminiz alındı. En kısa sürede dönüş yapacağız.</p>
            ) : null}
          </form>
        </div>
      </section>
    </PageLayoutWithFooter>
  );
}

