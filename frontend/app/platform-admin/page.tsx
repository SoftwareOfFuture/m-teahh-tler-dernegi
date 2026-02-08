'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { PageHero } from '../../components/PageHero';
import { PageLayoutWithFooter } from '../../components/PageLayout';
import { ImageUrlInput } from '../../components/ImageUrlInput';
import {
  approveMember,
  clearToken,
  createAnnouncement,
  createBanner,
  createNews,
  createPublication,
  createSlide,
  createVideo,
  deleteAnnouncement,
  deleteBanner,
  deleteMember,
  deleteNews,
  deletePublication,
  deleteSlide,
  deleteVideo,
  getPageAdmin,
  getToken,
  listMemberDocumentsAdmin,
  createEvent,
  createPartner,
  createProperty,
  listAnnouncementsAdminAll,
  listBannersAdminAll,
  listEventsAdminAll,
  listMembersAdminAll,
  listNewsAdminAll,
  listPartnersAdminAll,
  listPropertiesAdminAll,
  listPublicationsAdminAll,
  listSlidesAdminAll,
  listVideosAdminAll,
  me,
  deleteEvent,
  deletePartner,
  deleteProperty,
  getMemberDocumentBlob,
  rejectMember,
  requestMemberResubmission,
  reviewMemberDocumentAdmin,
  updateBanner,
  updateEvent,
  updatePartner,
  updateProperty,
  upsertPageAdmin,
  updateAnnouncement,
  updateNews,
  updatePublication,
  updateSlide,
  updateVideo,
  type Announcement,
  type Event,
  type HeroSlide,
  type HomeBanner,
  type News,
  type PageContent,
  type MemberDocument,
  type Partner,
  type Property,
  type Publication,
  type Video,
} from '../../lib/api';
import {
  ANIMATION_OPTIONS,
  getStoredSectionAnimations,
  SECTION_IDS,
  SECTION_LABELS,
  setStoredSectionAnimations,
  type SectionId,
  type AnimationId,
} from '../../lib/sectionAnimations';

export default function PlatformAdminPage() {
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  type TabId =
    | 'members'
    | 'slides'
    | 'banners'
    | 'news'
    | 'announcements'
    | 'videos'
    | 'publications'
    | 'events'
    | 'partners'
    | 'properties'
    | 'kurumsal'
    | 'iletisim'
    | 'animations'
    | 'seo';
  const [tab, setTab] = useState<TabId>('members');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const adminTabs: { id: TabId; label: string }[] = [
    { id: 'members', label: 'Üyeler' },
    { id: 'slides', label: 'Slider' },
    { id: 'banners', label: 'Banner' },
    { id: 'news', label: 'Haberler' },
    { id: 'announcements', label: 'Duyurular' },
    { id: 'videos', label: 'Videolar' },
    { id: 'publications', label: 'Yayınlar' },
    { id: 'events', label: 'Etkinlikler' },
    { id: 'partners', label: 'Partnerler' },
    { id: 'properties', label: 'Emlak İlanları' },
    { id: 'kurumsal', label: 'Kurumsal' },
    { id: 'iletisim', label: 'İletişim' },
    { id: 'animations', label: 'Animasyonlar' },
    { id: 'seo', label: 'SEO' },
  ];

  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const token = useMemo(() => getToken(), []);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      try {
        if (!token) {
          setAuthorized(false);
          return;
        }
        const res = await me(token);
        if (cancelled) return;
        setAuthorized(res.user.role === 'platform_admin');
      } catch (e: any) {
        if (cancelled) return;
        clearToken();
        setAuthorized(false);
      } finally {
        if (cancelled) return;
        setChecking(false);
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const refreshMembers = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await listMembersAdminAll(token, { page: 1, limit: 200 });
      const unapproved = (res.items || []).filter((m: any) => m.isApproved === false);
      const approved = (res.items || []).filter((m: any) => m.isApproved !== false);
      setItems([...unapproved, ...approved]);
    } catch (e: any) {
      setError(e?.message ?? 'Üyeler yüklenemedi.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!authorized) return;
    refreshMembers();
  }, [authorized, refreshMembers]);

  return (
    <PageLayoutWithFooter>
      <PageHero
        title="Platform Admin"
        subtitle="Bu sayfa sadece site yöneticisi (platform_admin) içindir. Üye onaylarını buradan yapabilirsiniz."
      />

      {checking ? (
        <div className="mt-8 rounded-2xl bg-white p-6 shadow-soft">Kontrol ediliyor…</div>
      ) : !authorized ? (
        <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
          Bu sayfaya erişim yok. Lütfen platform admin hesabıyla giriş yapın.
        </div>
      ) : (
        <div className="mt-6 flex w-full min-w-0 flex-col gap-4 lg:mt-8 lg:flex-row lg:gap-6">
          {/* Sol panel: mobilde yatay sekme, lg+ daraltılabilir sidebar */}
          <aside
            className={`flex shrink-0 flex-col border border-slate-200 bg-white shadow-soft transition-[width] duration-300 ease-out rounded-2xl overflow-hidden ${
              sidebarCollapsed ? 'lg:w-14' : 'lg:w-56'
            } w-full lg:w-auto`}
          >
            <div className={`flex items-center border-b border-slate-100 p-2 ${sidebarCollapsed ? 'lg:justify-center' : 'justify-between lg:justify-between'}`}>
              {/* Mobil: yatay kaydırılabilir sekmeler */}
              <nav className="flex flex-1 overflow-x-auto py-2 lg:hidden" aria-label="Admin menüsü (mobil)">
                <div className="flex min-w-0 gap-1 px-1">
                  {adminTabs.map(({ id, label }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setTab(id)}
                      className={`flex shrink-0 items-center rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors whitespace-nowrap min-h-[44px] ${
                        tab === id ? 'bg-burgundy text-white' : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </nav>
              {!sidebarCollapsed && <span className="hidden px-2 text-xs font-bold uppercase text-slate-500 lg:inline">Kontrol Menüsü</span>}
              <button
                type="button"
                onClick={() => setSidebarCollapsed((c) => !c)}
                className="hidden size-9 shrink-0 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-burgundy/10 hover:text-burgundy lg:flex"
                aria-label={sidebarCollapsed ? 'Menüyü genişlet' : 'Menüyü daralt'}
                title={sidebarCollapsed ? 'Menüyü genişlet' : 'Menüyü daralt'}
              >
                {sidebarCollapsed ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                )}
              </button>
            </div>
            <nav className="hidden flex-col gap-0.5 p-2 lg:flex lg:flex-col" aria-label="Admin menüsü (masaüstü)">
              {adminTabs.map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setTab(id)}
                  className={`flex min-h-[44px] w-full items-center gap-2 rounded-lg px-2 py-2.5 text-left text-sm font-medium transition-colors ${
                    tab === id
                      ? 'bg-burgundy text-white'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                  title={sidebarCollapsed ? label : undefined}
                >
                  <span className="flex size-7 shrink-0 items-center justify-center rounded bg-black/10 text-xs font-bold">
                    {label.charAt(0)}
                  </span>
                  {!sidebarCollapsed && <span className="truncate">{label}</span>}
                </button>
              ))}
            </nav>
          </aside>

          {/* İçerik alanı */}
          <section className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-white p-4 shadow-soft sm:p-6">
            <div>
            {tab === 'members' ? (
              <MembersPanel
                token={token}
                items={items}
                loading={loading}
                error={error}
                setError={setError}
                refresh={refreshMembers}
                approve={approveMember}
              />
            ) : tab === 'slides' ? (
              <SlidesPanel token={token} />
            ) : tab === 'banners' ? (
              <BannersPanel token={token} />
            ) : tab === 'news' ? (
              <NewsPanel token={token} />
            ) : tab === 'announcements' ? (
              <AnnouncementsPanel token={token} />
            ) : tab === 'videos' ? (
              <VideosPanel token={token} />
            ) : tab === 'publications' ? (
              <PublicationsPanel token={token} />
            ) : tab === 'events' ? (
              <EventsPanel token={token} />
            ) : tab === 'partners' ? (
              <PartnersPanel token={token} />
            ) : tab === 'properties' ? (
              <PropertiesPanel token={token} />
            ) : tab === 'iletisim' ? (
              <IletisimPanel token={token} />
            ) : tab === 'animations' ? (
              <AnimationsPanel />
            ) : tab === 'seo' ? (
              <SeoPanel token={token} />
            ) : (
              <KurumsalPanel token={token} />
            )}
            </div>
          </section>
        </div>
      )}
    </PageLayoutWithFooter>
  );
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
        active ? 'bg-burgundy text-white' : 'border border-black/10 bg-white text-slate-700 hover:bg-soft-gray'
      }`}
    >
      {children}
    </button>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</label>
      <div className="mt-1">{children}</div>
    </div>
  );
}

function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-2xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-burgundy ${
        props.className ?? ''
      }`}
    />
  );
}

function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`w-full rounded-2xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-burgundy ${
        props.className ?? ''
      }`}
    />
  );
}

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold ${
        value ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
      }`}
    >
      {value ? 'Yayında' : 'Kapalı'}
    </button>
  );
}

function getPublishedValue(obj: any): boolean {
  if (!obj) return false;
  if (typeof obj.isPublished === 'boolean') return obj.isPublished;
  if (typeof obj.is_published === 'boolean') return obj.is_published;
  return Boolean(obj.isPublished ?? obj.is_published);
}

function IletisimPanel({ token }: { token: string | null }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedMsg, setSavedMsg] = useState<string | null>(null);

  const [form, setForm] = useState<Partial<PageContent>>({
    heroTitle: 'İletişim',
    heroSubtitle: 'Bize ulaşın. Mesajınızı iletin, en kısa sürede dönüş yapalım.',
    contactAddress: 'Antalya / Türkiye',
    contactEmail: 'info@ornek-dernek.org',
    contactPhone: '+90 (000) 000 00 00',
    mapEmbedUrl: '',
    isPublished: true,
  });

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    setSavedMsg(null);
    try {
      const res = await getPageAdmin(token, 'iletisim');
      if (res) setForm(res);
    } catch (e: any) {
      setError(e?.message ?? 'İletişim içeriği yüklenemedi.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">İletişim Sayfası</h2>
          <p className="mt-1 text-sm text-slate-600">`/iletisim` sayfasındaki iletişim bilgileri ve Google Maps alanını buradan yönetebilirsiniz.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={load}
            disabled={!token || loading}
            className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-slate-700 disabled:opacity-50"
          >
            Yenile
          </button>
          <button
            type="button"
            onClick={async () => {
              if (!token) return;
              setLoading(true);
              setError(null);
              setSavedMsg(null);
              try {
                await upsertPageAdmin(token, 'iletisim', {
                  heroTitle: (form.heroTitle ?? '').toString().trim() || null,
                  heroSubtitle: (form.heroSubtitle ?? '').toString().trim() || null,
                  contactAddress: (form.contactAddress ?? '').toString().trim() || null,
                  contactEmail: (form.contactEmail ?? '').toString().trim() || null,
                  contactPhone: (form.contactPhone ?? '').toString().trim() || null,
                  mapEmbedUrl: (form.mapEmbedUrl ?? '').toString().trim() || null,
                  isPublished: !!form.isPublished,
                });
                setSavedMsg('Kaydedildi.');
              } catch (e: any) {
                setError(e?.message ?? 'Kaydetme başarısız.');
              } finally {
                setLoading(false);
              }
            }}
            disabled={!token || loading}
            className="rounded-full bg-burgundy px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            Kaydet
          </button>
        </div>
      </div>

      {error ? <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}
      {savedMsg ? <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{savedMsg}</div> : null}

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="Hero Başlık">
          <TextInput value={String(form.heroTitle ?? '')} onChange={(e) => setForm((s) => ({ ...s, heroTitle: e.target.value }))} />
        </Field>
        <Field label="Hero Alt Başlık">
          <TextInput value={String(form.heroSubtitle ?? '')} onChange={(e) => setForm((s) => ({ ...s, heroSubtitle: e.target.value }))} />
        </Field>

        <Field label="Adres">
          <TextInput
            value={String(form.contactAddress ?? '')}
            onChange={(e) => setForm((s) => ({ ...s, contactAddress: e.target.value }))}
            placeholder="Antalya / Türkiye"
          />
        </Field>
        <Field label="Telefon">
          <TextInput
            value={String(form.contactPhone ?? '')}
            onChange={(e) => setForm((s) => ({ ...s, contactPhone: e.target.value }))}
            placeholder="+90 ..."
          />
        </Field>

        <Field label="E-posta">
          <TextInput
            value={String(form.contactEmail ?? '')}
            onChange={(e) => setForm((s) => ({ ...s, contactEmail: e.target.value }))}
            placeholder="info@..."
          />
        </Field>

        <Field label="Durum">
          <Toggle value={!!form.isPublished} onChange={(v) => setForm((s) => ({ ...s, isPublished: v }))} />
        </Field>

        <div className="md:col-span-2">
          <Field label="Google Maps Linki (normal link veya embed)">
            <TextArea
              rows={3}
              value={String(form.mapEmbedUrl ?? '')}
              onChange={(e) => setForm((s) => ({ ...s, mapEmbedUrl: e.target.value }))}
              placeholder='Google Maps linki yapıştırın (ör: https://www.google.com/maps?... veya https://www.google.com/maps/embed?pb=...)'
            />
          </Field>
          <p className="mt-2 text-xs text-slate-500">
            Not: Embed ile uğraşmak istemezseniz normal Google Maps linki de olur. Eğer link embedlenemezse, sayfada adres üzerinden harita gösterilir ve link “Haritada aç” olarak çalışır.
          </p>
        </div>
      </div>
    </div>
  );
}

function AnimationsPanel() {
  const [animations, setAnimations] = useState(() => getStoredSectionAnimations());
  const [savedMsg, setSavedMsg] = useState<string | null>(null);

  const handleChange = (sectionId: SectionId, value: AnimationId) => {
    const next = { ...animations, [sectionId]: value };
    setAnimations(next);
    setStoredSectionAnimations(next);
    setSavedMsg('Kaydedildi. Ana sayfayı yenileyerek görebilirsiniz.');
    setTimeout(() => setSavedMsg(null), 3000);
  };

  const handleReset = () => {
    setAnimations({});
    setStoredSectionAnimations({});
    setSavedMsg('Varsayılana döndürüldü.');
    setTimeout(() => setSavedMsg(null), 3000);
  };

  return (
    <div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Sayfa Animasyonları</h2>
          <p className="mt-1 text-sm text-slate-600">
            Ana sayfadaki her bölüm için giriş animasyonu seçin. Değişiklikler anında kaydedilir; ana sayfayı yenileyerek görebilirsiniz.
          </p>
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="shrink-0 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
        >
          Varsayılana Döndür
        </button>
      </div>

      {savedMsg ? (
        <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {savedMsg}
        </div>
      ) : null}

      <div className="mt-6 space-y-4">
        {SECTION_IDS.map((sectionId) => (
          <div
            key={sectionId}
            className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-slate-50/50 p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <span className="font-medium text-slate-800">{SECTION_LABELS[sectionId]}</span>
              <span className="ml-2 text-xs text-slate-500">({sectionId})</span>
            </div>
            <select
              value={animations[sectionId] ?? 'none'}
              onChange={(e) => handleChange(sectionId, e.target.value as AnimationId)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 sm:w-48"
              aria-label={`${SECTION_LABELS[sectionId]} animasyonu`}
            >
              {ANIMATION_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      <p className="mt-6 text-xs text-slate-500">
        Animasyonlar tarayıcıda (localStorage) saklanır. Farklı cihazlarda aynı ayarlar için her cihazda tekrar seçmeniz gerekir.
      </p>
    </div>
  );
}

function SeoPanel({ token }: { token: string | null }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedMsg, setSavedMsg] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<PageContent>>({
    heroTitle: 'ANTMUTDER – Antalya Müteahhitler Derneği',
    heroSubtitle:
      'Antalya Müteahhitler Derneği (ANTMUTDER). Sektörel birliktelik, paylaşım ve dayanışma. Haberler, yayınlar, video arşivi ve iletişim.',
    quickInfo: 'ANTMUTDER, Antalya müteahhitler derneği, inşaat sektörü, müteahhit derneği, Antalya dernek, sektörel birliktelik',
  });

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await getPageAdmin(token, 'seo');
      if (res) setForm(res);
    } catch (e: any) {
      setError(e?.message ?? 'SEO ayarları yüklenemedi.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">SEO Ayarları</h2>
          <p className="mt-1 text-sm text-slate-600">
            Site genelinde kullanılan varsayılan meta başlık, açıklama ve anahtar kelimeler. Kurumsal / İletişim sayfaları kendi içeriklerinden türetilir; diğer sayfalar bu varsayılanları kullanır.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={load}
            disabled={!token || loading}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 disabled:opacity-50"
          >
            Yenile
          </button>
          <button
            type="button"
            disabled={!token || loading}
            onClick={async () => {
              if (!token) return;
              setLoading(true);
              setError(null);
              setSavedMsg(null);
              try {
                await upsertPageAdmin(token, 'seo', {
                  heroTitle: (form.heroTitle ?? '').toString().trim() || null,
                  heroSubtitle: (form.heroSubtitle ?? '').toString().trim() || null,
                  quickInfo: (form.quickInfo ?? '').toString().trim() || null,
                  isPublished: true,
                });
                setSavedMsg('Kaydedildi. Bir sonraki build veya yenilemede meta bilgiler güncellenir.');
              } catch (e: any) {
                setError(e?.message ?? 'Kaydetme başarısız.');
              } finally {
                setLoading(false);
              }
            }}
            className="rounded-lg bg-burgundy px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            Kaydet
          </button>
        </div>
      </div>

      {error ? <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}
      {savedMsg ? <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{savedMsg}</div> : null}

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="Site / Varsayılan meta başlık">
          <TextInput
            value={String(form.heroTitle ?? '')}
            onChange={(e) => setForm((s) => ({ ...s, heroTitle: e.target.value }))}
            placeholder="ANTMUTDER – Antalya Müteahhitler Derneği"
          />
        </Field>
        <Field label="Varsayılan meta açıklama (max ~160 karakter)">
          <TextArea
            rows={3}
            value={String(form.heroSubtitle ?? '')}
            onChange={(e) => setForm((s) => ({ ...s, heroSubtitle: e.target.value }))}
            placeholder="Kısa site açıklaması..."
          />
        </Field>
        <div className="md:col-span-2">
          <Field label="Meta anahtar kelimeler (virgülle ayırın)">
            <TextArea
              rows={2}
              value={String(form.quickInfo ?? '')}
              onChange={(e) => setForm((s) => ({ ...s, quickInfo: e.target.value }))}
              placeholder="ANTMUTDER, Antalya dernek, inşaat sektörü, ..."
            />
          </Field>
        </div>
      </div>

      <p className="mt-6 text-xs text-slate-500">
        Bu ayarlar &quot;seo&quot; sayfası olarak kaydedilir. Kurumsal ve İletişim sayfalarının meta bilgileri kendi sayfa içeriklerinden (hero başlık / alt başlık) türetilir. Sitemap ve robots.txt otomatik üretilir.
      </p>
    </div>
  );
}

function KurumsalPanel({ token }: { token: string | null }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedMsg, setSavedMsg] = useState<string | null>(null);

  const [form, setForm] = useState<Partial<PageContent>>({
    heroTitle: 'Kurumsal',
    heroSubtitle: 'Derneğimizin vizyonu, misyonu ve kurumsal yapısına dair genel bilgiler.',
    aboutTitle: 'Hakkımızda',
    aboutParagraph1: '',
    aboutParagraph2: '',
    aboutPdfTitle: 'Dernek Tanıtım Dosyası',
    aboutPdfUrl: '',
    quickInfo: 'Kuruluş: 20XX\nMerkez: Antalya\nÇalışma Alanı: İnşaat ve müteahhitlik\nÜyelik: Başvuru + Onay',
    mission: '',
    vision: '',
    isPublished: true,
  });

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    setSavedMsg(null);
    try {
      const res = await getPageAdmin(token, 'kurumsal');
      if (res) setForm(res);
    } catch (e: any) {
      setError(e?.message ?? 'Kurumsal içerik yüklenemedi.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Kurumsal Sayfası</h2>
          <p className="mt-1 text-sm text-slate-600">`/kurumsal` sayfasındaki metin alanlarını buradan yönetebilirsiniz.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={load}
            disabled={!token || loading}
            className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-slate-700 disabled:opacity-50"
          >
            Yenile
          </button>
          <button
            type="button"
            onClick={async () => {
              if (!token) return;
              setLoading(true);
              setError(null);
              setSavedMsg(null);
              try {
                await upsertPageAdmin(token, 'kurumsal', {
                  heroTitle: (form.heroTitle ?? '').toString().trim() || null,
                  heroSubtitle: (form.heroSubtitle ?? '').toString().trim() || null,
                  aboutTitle: (form.aboutTitle ?? '').toString().trim() || null,
                  aboutParagraph1: (form.aboutParagraph1 ?? '').toString().trim() || null,
                  aboutParagraph2: (form.aboutParagraph2 ?? '').toString().trim() || null,
                  aboutPdfTitle: (form.aboutPdfTitle ?? '').toString().trim() || null,
                  aboutPdfUrl: (form.aboutPdfUrl ?? '').toString().trim() || null,
                  quickInfo: (form.quickInfo ?? '').toString().trim() || null,
                  mission: (form.mission ?? '').toString().trim() || null,
                  vision: (form.vision ?? '').toString().trim() || null,
                  isPublished: !!form.isPublished,
                });
                setSavedMsg('Kaydedildi.');
              } catch (e: any) {
                setError(e?.message ?? 'Kaydetme başarısız.');
              } finally {
                setLoading(false);
              }
            }}
            disabled={!token || loading}
            className="rounded-full bg-burgundy px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            Kaydet
          </button>
        </div>
      </div>

      {error ? <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}
      {savedMsg ? <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{savedMsg}</div> : null}

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="Hero Başlık">
          <TextInput value={String(form.heroTitle ?? '')} onChange={(e) => setForm((s) => ({ ...s, heroTitle: e.target.value }))} />
        </Field>
        <Field label="Hero Alt Başlık">
          <TextInput value={String(form.heroSubtitle ?? '')} onChange={(e) => setForm((s) => ({ ...s, heroSubtitle: e.target.value }))} />
        </Field>

        <Field label="Hakkımızda Başlık">
          <TextInput value={String(form.aboutTitle ?? '')} onChange={(e) => setForm((s) => ({ ...s, aboutTitle: e.target.value }))} />
        </Field>
        <Field label="Durum">
          <Toggle value={!!form.isPublished} onChange={(v) => setForm((s) => ({ ...s, isPublished: v }))} />
        </Field>

        <div className="md:col-span-2">
          <Field label="Hakkımızda Paragraf 1">
            <TextArea rows={4} value={String(form.aboutParagraph1 ?? '')} onChange={(e) => setForm((s) => ({ ...s, aboutParagraph1: e.target.value }))} />
          </Field>
        </div>

        <div className="md:col-span-2">
          <Field label="Hakkımızda Paragraf 2">
            <TextArea rows={4} value={String(form.aboutParagraph2 ?? '')} onChange={(e) => setForm((s) => ({ ...s, aboutParagraph2: e.target.value }))} />
          </Field>
        </div>

        <Field label="Hakkımızda PDF Başlık">
          <TextInput
            value={String(form.aboutPdfTitle ?? '')}
            onChange={(e) => setForm((s) => ({ ...s, aboutPdfTitle: e.target.value }))}
            placeholder="Örn: Dernek Tanıtım Dosyası"
          />
        </Field>
        <Field label="Hakkımızda PDF URL">
          <TextInput
            value={String(form.aboutPdfUrl ?? '')}
            onChange={(e) => setForm((s) => ({ ...s, aboutPdfUrl: e.target.value }))}
            placeholder="https://.../dosya.pdf"
          />
        </Field>

        <div className="md:col-span-2">
          <Field label="Hızlı Bilgiler (her satır bir madde)">
            <TextArea rows={4} value={String(form.quickInfo ?? '')} onChange={(e) => setForm((s) => ({ ...s, quickInfo: e.target.value }))} />
          </Field>
        </div>

        <div className="md:col-span-1">
          <Field label="Misyon">
            <TextArea rows={4} value={String(form.mission ?? '')} onChange={(e) => setForm((s) => ({ ...s, mission: e.target.value }))} />
          </Field>
        </div>

        <div className="md:col-span-1">
          <Field label="Vizyon">
            <TextArea rows={4} value={String(form.vision ?? '')} onChange={(e) => setForm((s) => ({ ...s, vision: e.target.value }))} />
          </Field>
        </div>
      </div>
    </div>
  );
}

function MembersPanel({
  token,
  items,
  loading,
  error,
  setError,
  refresh,
  approve,
}: {
  token: string | null;
  items: any[];
  loading: boolean;
  error: string | null;
  setError: (s: string | null) => void;
  refresh: () => Promise<void>;
  approve: (token: string, memberId: number) => Promise<any>;
}) {
  const [docsOpen, setDocsOpen] = useState(false);
  const [docsLoading, setDocsLoading] = useState(false);
  const [docsData, setDocsData] = useState<null | { member: any; requiredKinds: string[]; items: MemberDocument[] }>(null);
  const [memberActionNote, setMemberActionNote] = useState('');
  const [docsActionError, setDocsActionError] = useState<string | null>(null);
  const [docsActionLoadingId, setDocsActionLoadingId] = useState<number | null>(null);

  async function openDocs(memberId: number) {
    if (!token) return;
    setDocsOpen(true);
    setDocsLoading(true);
    setMemberActionNote('');
    setDocsActionError(null);
    try {
      const res = await listMemberDocumentsAdmin(token, memberId);
      setDocsData({ member: res.member, requiredKinds: res.requiredKinds, items: res.items });
    } catch (e: any) {
      setDocsData(null);
      setError(e?.message ?? 'Belgeler yüklenemedi.');
    } finally {
      setDocsLoading(false);
    }
  }

  async function previewDocument(docId: number) {
    if (!token) return;
    setDocsActionError(null);
    setDocsActionLoadingId(docId);
    try {
      const { blob } = await getMemberDocumentBlob(token, docId);
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank', 'noopener,noreferrer');
      setTimeout(() => URL.revokeObjectURL(url), 5 * 60 * 1000);
    } catch (e: any) {
      setDocsActionError(e?.message ?? 'Önizleme açılamadı.');
    } finally {
      setDocsActionLoadingId(null);
    }
  }

  async function downloadDocument(docId: number) {
    if (!token) return;
    setDocsActionError(null);
    setDocsActionLoadingId(docId);
    try {
      const { blob, filename } = await getMemberDocumentBlob(token, docId);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename || 'document';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 30 * 1000);
    } catch (e: any) {
      setDocsActionError(e?.message ?? 'İndirme başarısız.');
    } finally {
      setDocsActionLoadingId(null);
    }
  }

  function formatBytes(bytes: number) {
    if (!bytes || bytes <= 0) return '0 B';
    const units = ['B', 'KB', 'MB', 'GB'];
    const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
    const v = bytes / Math.pow(1024, i);
    return `${v >= 10 ? Math.round(v) : Math.round(v * 10) / 10} ${units[i]}`;
  }

  function canApproveMember(d: typeof docsData) {
    if (!d) return false;
    const byKind = new Map<string, MemberDocument>();
    for (const it of d.items) byKind.set(it.kind, it);
    for (const kind of d.requiredKinds) {
      const doc = byKind.get(kind);
      if (!doc) return false;
      if (doc.status !== 'approved') return false;
    }
    return true;
  }

  function canDeleteMemberRow(m: any) {
    const st = String(m?.verificationStatus || '');
    // "sil" butonu ancak red / belge tekrarı / onay sonrası aktif
    return st === 'approved' || st === 'rejected' || st === 'resubmit_required';
  }

  return (
    <>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Üye Onayları</h2>
          <p className="mt-1 text-sm text-slate-600">Onaysız üyeler en üstte listelenir.</p>
        </div>

        <button
          type="button"
          onClick={refresh}
          disabled={loading}
          className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-slate-700 disabled:opacity-50"
        >
          {loading ? 'Yükleniyor…' : 'Yenile'}
        </button>
      </div>

      {error ? <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

      <div className="mt-6 overflow-hidden rounded-3xl border border-black/5">
        <div className="grid grid-cols-1 gap-2 bg-soft-gray px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-600 sm:grid-cols-[1fr_260px] sm:gap-0">
          <div>Üye</div>
          <div className="hidden text-right sm:block">İşlem</div>
        </div>

        <div className="divide-y divide-black/5">
          {items.map((m) => {
            const isApproved = m.isApproved !== false;
            const status = String(m.verificationStatus || (isApproved ? 'approved' : 'pending_docs'));
            return (
              <div key={m.id} className="grid grid-cols-1 gap-3 px-4 py-4 sm:grid-cols-[1fr_260px] sm:items-center sm:gap-0">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate text-sm font-bold text-slate-900">{m.name}</p>
                    <span
                      className={`rounded-full px-2 py-1 text-[11px] font-semibold ${
                        isApproved ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
                      }`}
                    >
                      {isApproved ? 'Onaylı' : 'Onaysız'}
                    </span>
                    <span className="rounded-full bg-soft-gray px-2 py-1 text-[11px] font-semibold text-slate-700">
                      {status}
                    </span>
                  </div>
                  <p className="mt-1 truncate text-xs text-slate-500">{m.company || '—'}</p>
                  <p className="mt-1 truncate text-xs text-slate-400">{m.email}</p>
                </div>

                <div className="sm:text-right">
                  <div className="flex flex-wrap justify-start gap-2 sm:justify-end">
                    <button
                      type="button"
                      className="rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-soft-gray disabled:opacity-50"
                      disabled={loading}
                      onClick={() => openDocs(m.id)}
                    >
                      Belgeler
                    </button>

                    {!isApproved ? (
                      <button
                        type="button"
                        className="rounded-full bg-burgundy px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-burgundy-dark disabled:opacity-50"
                        disabled={loading}
                        onClick={async () => {
                          if (!token) return;
                          setError(null);
                          try {
                            await approve(token, m.id);
                            await refresh();
                          } catch (e: any) {
                            setError(e?.message ?? 'Onay başarısız.');
                          }
                        }}
                      >
                        Onayla
                      </button>
                    ) : null}

                    <button
                      type="button"
                      className="rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100 disabled:opacity-50"
                      disabled={loading || !canDeleteMemberRow(m)}
                      onClick={async () => {
                        if (!token) return;
                        if (!confirm('Bu üyeyi silmek istediğinize emin misiniz?')) return;
                        setError(null);
                        try {
                          await deleteMember(token, m.id);
                          await refresh();
                        } catch (e: any) {
                          setError(e?.message ?? 'Silme başarısız.');
                        }
                      }}
                    >
                      Sil
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {!loading && items.length === 0 ? <div className="px-4 py-6 text-sm text-slate-600">Kayıt bulunamadı.</div> : null}
        </div>
      </div>

      {docsOpen ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="docs-modal-title"
            aria-describedby="docs-modal-description"
            className="w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-card"
          >
            <div className="flex items-center justify-between border-b border-black/5 px-5 py-4">
              <div>
                <h2 id="docs-modal-title" className="text-sm font-bold text-slate-900">
                  Belge İnceleme
                </h2>
                <p id="docs-modal-description" className="mt-0.5 text-xs text-slate-500">
                  {docsData?.member?.name ? `${docsData.member.name} • ${docsData.member.email}` : '—'}
                </p>
              </div>
              <button
                type="button"
                className="rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700"
                onClick={() => {
                  setDocsOpen(false);
                  setDocsData(null);
                }}
              >
                Kapat
              </button>
            </div>

            <div className="max-h-[70vh] overflow-auto p-5">
              {docsActionError ? (
                <div className="mb-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{docsActionError}</div>
              ) : null}
              {docsLoading ? (
                <div className="text-sm text-slate-600">Yükleniyor…</div>
              ) : !docsData ? (
                <div className="text-sm text-slate-600">Belge bulunamadı.</div>
              ) : (
                <>
                  <div className="space-y-3">
                    {(docsData.requiredKinds || []).map((kind) => {
                      const doc = docsData.items.find((d) => d.kind === kind) || null;
                      return (
                        <div key={kind} className="rounded-3xl border border-black/5 bg-soft-gray p-4">
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <div className="min-w-0">
                              <div className="text-sm font-bold text-slate-900">{kind}</div>
                              <div className="mt-1 text-xs text-slate-600">
                                Durum: <span className="font-semibold">{doc?.status || 'Eksik'}</span>
                              </div>
                              <div className="mt-1 text-xs text-slate-600">
                                Dosya: <span className="font-semibold">{doc?.filename || '—'}</span>
                              </div>
                              <div className="mt-1 text-xs text-slate-600">
                                Tür: <span className="font-semibold">{doc?.mimeType || '—'}</span>
                                {doc?.sizeBytes ? <span className="text-slate-500"> • {formatBytes(doc.sizeBytes)}</span> : null}
                              </div>
                              {doc?.reviewerNote ? <div className="mt-1 text-xs text-slate-600">Not: {doc.reviewerNote}</div> : null}
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                              {doc ? (
                                <>
                                  <button
                                    type="button"
                                    className="rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                                    disabled={docsActionLoadingId === doc.id}
                                    onClick={() => previewDocument(doc.id)}
                                  >
                                    Önizle
                                  </button>
                                  <button
                                    type="button"
                                    className="rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                                    disabled={docsActionLoadingId === doc.id}
                                    onClick={() => downloadDocument(doc.id)}
                                  >
                                    İndir
                                  </button>
                                </>
                              ) : null}
                              {doc ? (
                                <>
                                  <button
                                    type="button"
                                    className="rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
                                    onClick={async () => {
                                      if (!token) return;
                                      await reviewMemberDocumentAdmin(token, docsData.member.id, doc.id, { status: 'approved' });
                                      await openDocs(docsData.member.id);
                                    }}
                                  >
                                    Onayla
                                  </button>
                                  <button
                                    type="button"
                                    className="rounded-full bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-700"
                                    onClick={async () => {
                                      if (!token) return;
                                      await reviewMemberDocumentAdmin(token, docsData.member.id, doc.id, { status: 'resubmit_required' });
                                      await openDocs(docsData.member.id);
                                    }}
                                  >
                                    Belge Tekrarı
                                  </button>
                                  <button
                                    type="button"
                                    className="rounded-full bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700"
                                    onClick={async () => {
                                      if (!token) return;
                                      await reviewMemberDocumentAdmin(token, docsData.member.id, doc.id, { status: 'rejected' });
                                      await openDocs(docsData.member.id);
                                    }}
                                  >
                                    Red
                                  </button>
                                </>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-6 rounded-3xl border border-black/5 bg-white p-4">
                    <label className="text-xs font-bold uppercase tracking-wide text-slate-500">Üye Notu (opsiyonel)</label>
                    <textarea
                      value={memberActionNote}
                      onChange={(e) => setMemberActionNote(e.target.value)}
                      className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none focus:border-burgundy"
                      rows={3}
                      placeholder="Eksik/yanlış belge açıklaması…"
                    />

                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        type="button"
                        className="rounded-full bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700"
                        onClick={async () => {
                          if (!token) return;
                          await requestMemberResubmission(token, docsData.member.id, memberActionNote.trim() || undefined);
                          await refresh();
                          await openDocs(docsData.member.id);
                        }}
                      >
                        Belge Tekrarı İste
                      </button>
                      <button
                        type="button"
                        className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                        onClick={async () => {
                          if (!token) return;
                          await rejectMember(token, docsData.member.id, memberActionNote.trim() || undefined);
                          await refresh();
                          await openDocs(docsData.member.id);
                        }}
                      >
                        Üyeliği Reddet
                      </button>
                      <button
                        type="button"
                        className="rounded-full bg-burgundy px-4 py-2 text-sm font-semibold text-white hover:bg-burgundy-dark disabled:opacity-50"
                        disabled={!canApproveMember(docsData)}
                        onClick={async () => {
                          if (!token) return;
                          await approve(token, docsData.member.id);
                          await refresh();
                          await openDocs(docsData.member.id);
                        }}
                      >
                        Üyeyi Onayla
                      </button>
                    </div>
                    {!canApproveMember(docsData) ? (
                      <div className="mt-2 text-xs text-slate-500">Not: Üye onayı için tüm zorunlu belgeler “approved” olmalı.</div>
                    ) : null}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

function SlidesPanel({ token }: { token: string | null }) {
  const [items, setItems] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [href, setHref] = useState('');
  const [dateText, setDateText] = useState('');
  const [sortOrder, setSortOrder] = useState(1);
  const [isPublished, setIsPublished] = useState(true);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [edit, setEdit] = useState<Partial<HeroSlide>>({});

  const refresh = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await listSlidesAdminAll(token, { page: 1, limit: 200 });
      setItems(res.items || []);
    } catch (e: any) {
      setError(e?.message ?? 'Slider yüklenemedi.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Slider Yönetimi</h2>
          <p className="mt-1 text-sm text-slate-600">Ana sayfa hero slider içeriklerini buradan ekleyin/düzenleyin.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={!token || loading}
            onClick={refresh}
            className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-slate-700 disabled:opacity-50"
          >
            Yenile
          </button>
          <button
            type="button"
            disabled={!token || loading || items.length === 0}
            onClick={async () => {
              if (!token) return;
              if (!confirm('Tüm slaytlar silinsin mi? (Geri alınamaz)')) return;
              setLoading(true);
              setError(null);
              try {
                for (const it of items) {
                  await deleteSlide(token, it.id);
                }
                await refresh();
              } catch (e: any) {
                setError(e?.message ?? 'Slaytlar silinemedi.');
              } finally {
                setLoading(false);
              }
            }}
            className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100 disabled:opacity-50"
          >
            Tümünü Sil
          </button>
        </div>
      </div>

      <div className="mt-6 rounded-3xl bg-soft-gray p-5">
        <h3 className="text-sm font-bold text-slate-900">Yeni Slayt Ekle</h3>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field label="Başlık">
            <TextInput value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Slayt başlığı" />
          </Field>
          <Field label="Tarih Yazısı (opsiyonel)">
            <TextInput value={dateText} onChange={(e) => setDateText(e.target.value)} placeholder="27 Ocak 2026" />
          </Field>
          <Field label="Görsel URL (opsiyonel)">
            <ImageUrlInput value={imageUrl} onChange={setImageUrl} placeholder="URL veya dosya seçin" />
          </Field>
          <Field label="Link (opsiyonel)">
            <TextInput value={href} onChange={(e) => setHref(e.target.value)} placeholder="/haberler/1 veya https://..." />
          </Field>
          <Field label="Sıralama">
            <TextInput
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(Number(e.target.value || 0))}
              placeholder="1"
            />
          </Field>
          <Field label="Durum">
            <div className="flex items-center gap-2">
              <Toggle value={isPublished} onChange={setIsPublished} />
              <span className="text-xs text-slate-500">Yayına al / kapat</span>
            </div>
          </Field>
          <div className="md:col-span-2">
            <Field label="Açıklama (opsiyonel)">
              <TextArea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="Kısa açıklama" />
            </Field>
          </div>
        </div>

        <div className="mt-4">
          <button
            type="button"
            disabled={!token || loading || !title.trim()}
            onClick={async () => {
              if (!token) return;
              setLoading(true);
              setError(null);
              try {
                await createSlide(token, {
                  title: title.trim(),
                  description: description.trim() || null,
                  imageUrl: imageUrl.trim() || null,
                  href: href.trim() || null,
                  dateText: dateText.trim() || null,
                  sortOrder,
                  isPublished,
                });
                setTitle('');
                setDescription('');
                setImageUrl('');
                setHref('');
                setDateText('');
                setSortOrder(1);
                setIsPublished(true);
                await refresh();
              } catch (e: any) {
                setError(e?.message ?? 'Slayt eklenemedi.');
              } finally {
                setLoading(false);
              }
            }}
            className="rounded-full bg-burgundy px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
          >
            Ekle
          </button>
        </div>
      </div>

      {error ? <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

      <div className="mt-6 space-y-3">
        {items.map((it) => {
          const published = getPublishedValue(it as any);
          const isEditing = editingId === it.id;
          return (
            <div key={it.id} className="rounded-3xl border border-black/5 bg-white p-4 shadow-card">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="truncate text-sm font-bold text-slate-900">{it.title}</div>
                    <Toggle
                      value={published}
                      onChange={async (v) => {
                        if (!token) return;
                        await updateSlide(token, it.id, { isPublished: v });
                        await refresh();
                      }}
                    />
                  </div>
                  <div className="mt-1 text-xs text-slate-500">Sıra: {it.sortOrder} {it.dateText ? `• ${it.dateText}` : ''}</div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-soft-gray"
                    onClick={() => {
                      setEditingId(isEditing ? null : it.id);
                      setEdit({
                        title: it.title,
                        description: it.description,
                        imageUrl: it.imageUrl,
                        href: it.href,
                        dateText: it.dateText,
                        sortOrder: it.sortOrder,
                        isPublished: it.isPublished,
                      });
                    }}
                  >
                    {isEditing ? 'Kapat' : 'Düzenle'}
                  </button>
                  <button
                    type="button"
                    className="rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100"
                    onClick={async () => {
                      if (!token) return;
                      if (!confirm('Bu slayt silinsin mi?')) return;
                      await deleteSlide(token, it.id);
                      await refresh();
                    }}
                  >
                    Sil
                  </button>
                </div>
              </div>

              {isEditing ? (
                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Field label="Başlık">
                    <TextInput
                      value={String(edit.title ?? '')}
                      onChange={(e) => setEdit((s) => ({ ...s, title: e.target.value }))}
                    />
                  </Field>
                  <Field label="Tarih Yazısı">
                    <TextInput
                      value={String(edit.dateText ?? '')}
                      onChange={(e) => setEdit((s) => ({ ...s, dateText: e.target.value }))}
                    />
                  </Field>
                  <Field label="Görsel URL">
                    <ImageUrlInput
                      value={String(edit.imageUrl ?? '')}
                      onChange={(v) => setEdit((s) => ({ ...s, imageUrl: v }))}
                      placeholder="URL veya dosya seçin"
                    />
                  </Field>
                  <Field label="Link">
                    <TextInput value={String(edit.href ?? '')} onChange={(e) => setEdit((s) => ({ ...s, href: e.target.value }))} />
                  </Field>
                  <Field label="Sıralama">
                    <TextInput
                      type="number"
                      value={Number(edit.sortOrder ?? 0)}
                      onChange={(e) => setEdit((s) => ({ ...s, sortOrder: Number(e.target.value || 0) }))}
                    />
                  </Field>
                  <Field label="Durum">
                    <Toggle value={!!edit.isPublished} onChange={(v) => setEdit((s) => ({ ...s, isPublished: v }))} />
                  </Field>
                  <div className="md:col-span-2">
                    <Field label="Açıklama">
                      <TextArea
                        rows={3}
                        value={String(edit.description ?? '')}
                        onChange={(e) => setEdit((s) => ({ ...s, description: e.target.value }))}
                      />
                    </Field>
                  </div>
                  <div className="md:col-span-2">
                    <button
                      type="button"
                      className="rounded-full bg-burgundy px-5 py-2.5 text-sm font-semibold text-white"
                      onClick={async () => {
                        if (!token) return;
                        await updateSlide(token, it.id, {
                          title: String(edit.title ?? '').trim(),
                          description: (String(edit.description ?? '').trim() || null) as any,
                          imageUrl: (String(edit.imageUrl ?? '').trim() || null) as any,
                          href: (String(edit.href ?? '').trim() || null) as any,
                          dateText: (String(edit.dateText ?? '').trim() || null) as any,
                          sortOrder: Number(edit.sortOrder ?? 0),
                          isPublished: !!edit.isPublished,
                        });
                        setEditingId(null);
                        await refresh();
                      }}
                    >
                      Kaydet
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}

        {!loading && items.length === 0 ? <div className="text-sm text-slate-600">Slayt bulunamadı.</div> : null}
      </div>
    </div>
  );
}

function BannersPanel({ token }: { token: string | null }) {
  return (
    <GenericContentPanel<HomeBanner>
      token={token}
      title="Banner Yönetimi"
      subtitle="Ana sayfada slider’ın hemen altındaki yatay tıklanabilir banner alanı buradan yönetilir. Yayında olan ilk kayıt (sıralamaya göre) gösterilir."
      list={(t) => listBannersAdminAll(t, { page: 1, limit: 200 })}
      create={(t, p) => createBanner(t, p as any)}
      update={(t, id, p) => updateBanner(t, id, p as any)}
      remove={(t, id) => deleteBanner(t, id)}
      fields={[
        { key: 'title', label: 'Başlık (Alt yazı)', type: 'text', required: true },
        { key: 'imageUrl', label: 'Banner Görsel URL', type: 'imageUrl', required: true },
        { key: 'href', label: 'Tıklayınca gideceği link', type: 'text', required: true },
        { key: 'sortOrder', label: 'Sıralama', type: 'text' },
      ]}
    />
  );
}

function NewsPanel({ token }: { token: string | null }) {
  return <GenericContentPanel<News>
    token={token}
    title="Haber Yönetimi"
    subtitle="Ana sayfa ve Haberler sayfasındaki içerikler buradan yönetilir."
    list={(t) => listNewsAdminAll(t, { page: 1, limit: 200 })}
    create={(t, p) => createNews(t, p as any)}
    update={(t, id, p) => updateNews(t, id, p as any)}
    remove={(t, id) => deleteNews(t, id)}
    fields={[
      { key: 'title', label: 'Başlık', type: 'text', required: true },
      { key: 'publishDate', label: 'Tarih (YYYY-MM-DD)', type: 'text' },
      { key: 'imageUrl', label: 'Görsel URL', type: 'imageUrl' },
      { key: 'excerpt', label: 'Özet', type: 'textarea' },
      { key: 'content', label: 'İçerik', type: 'textarea', required: true },
    ]}
  />;
}

function AnnouncementsPanel({ token }: { token: string | null }) {
  return <GenericContentPanel<Announcement>
    token={token}
    title="Duyuru Yönetimi"
    subtitle="Ana sayfa ve Duyurular sayfasındaki duyurular buradan yönetilir."
    list={(t) => listAnnouncementsAdminAll(t, { page: 1, limit: 200 })}
    create={(t, p) => createAnnouncement(t, p as any)}
    update={(t, id, p) => updateAnnouncement(t, id, p as any)}
    remove={(t, id) => deleteAnnouncement(t, id)}
    fields={[
      { key: 'code', label: 'Kod (AMD-...)', type: 'text' },
      { key: 'title', label: 'Başlık', type: 'text', required: true },
      { key: 'publishDate', label: 'Tarih (YYYY-MM-DD)', type: 'text' },
      { key: 'eventDate', label: 'Etkinlik Tarihi (opsiyonel)', type: 'text' },
      { key: 'imageUrl', label: 'Görsel URL', type: 'imageUrl' },
      { key: 'excerpt', label: 'Özet', type: 'textarea' },
      { key: 'content', label: 'İçerik', type: 'textarea', required: true },
    ]}
  />;
}

function VideosPanel({ token }: { token: string | null }) {
  return <GenericContentPanel<Video>
    token={token}
    title="Video Yönetimi"
    subtitle="Ana sayfa ve Video Arşiv sayfasındaki videolar buradan yönetilir."
    list={(t) => listVideosAdminAll(t, { page: 1, limit: 200 })}
    create={(t, p) => createVideo(t, p as any)}
    update={(t, id, p) => updateVideo(t, id, p as any)}
    remove={(t, id) => deleteVideo(t, id)}
    fields={[
      { key: 'title', label: 'Başlık', type: 'text', required: true },
      { key: 'publishDate', label: 'Tarih (YYYY-MM-DD)', type: 'text' },
      { key: 'thumbnailUrl', label: 'Thumbnail URL', type: 'text' },
      { key: 'href', label: 'Video Link', type: 'text' },
      { key: 'excerpt', label: 'Özet', type: 'textarea' },
    ]}
  />;
}

function PublicationsPanel({ token }: { token: string | null }) {
  return <GenericContentPanel<Publication>
    token={token}
    title="Yayın Yönetimi"
    subtitle="Yayınlar sayfasındaki rapor/bültenleri buradan yönetilir."
    list={(t) => listPublicationsAdminAll(t, { page: 1, limit: 200 })}
    create={(t, p) => createPublication(t, p as any)}
    update={(t, id, p) => updatePublication(t, id, p as any)}
    remove={(t, id) => deletePublication(t, id)}
    fields={[
      { key: 'title', label: 'Başlık', type: 'text', required: true },
      { key: 'publishDate', label: 'Tarih (YYYY-MM-DD)', type: 'text' },
      { key: 'coverImageUrl', label: 'Kapak Görsel URL', type: 'imageUrl' },
      { key: 'fileUrl', label: 'Dosya URL (PDF)', type: 'text' },
      { key: 'excerpt', label: 'Özet', type: 'textarea' },
    ]}
  />;
}

function EventsPanel({ token }: { token: string | null }) {
  return (
    <GenericContentPanel<Event>
      token={token}
      title="Etkinlik Yönetimi"
      subtitle="Ana sayfadaki Etkinlikler (sidebar) listesi buradan yönetilir."
      list={(t) => listEventsAdminAll(t, { page: 1, limit: 200 })}
      create={(t, p) => createEvent(t, p as any)}
      update={(t, id, p) => updateEvent(t, id, p as any)}
      remove={(t, id) => deleteEvent(t, id)}
      fields={[
        { key: 'title', label: 'Başlık', type: 'text', required: true },
        { key: 'dateText', label: 'Tarih Yazısı (örn: 02 Şubat 2026)', type: 'text' },
        { key: 'eventDate', label: 'Tarih (YYYY-MM-DD) (opsiyonel)', type: 'text' },
        { key: 'location', label: 'Konum', type: 'text' },
        { key: 'color', label: 'Renk (burgundy/green/blue)', type: 'text' },
        { key: 'sortOrder', label: 'Sıralama', type: 'text' },
      ]}
    />
  );
}

function PartnersPanel({ token }: { token: string | null }) {
  return (
    <GenericContentPanel<Partner>
      token={token}
      title="Partner Yönetimi"
      subtitle="Ana sayfadaki Üyelikler / Partnerler logo alanı buradan yönetilir."
      list={(t) => listPartnersAdminAll(t, { page: 1, limit: 200 })}
      create={(t, p) => createPartner(t, p as any)}
      update={(t, id, p) => updatePartner(t, id, p as any)}
      remove={(t, id) => deletePartner(t, id)}
      fields={[
        { key: 'title', label: 'Partner Adı', type: 'text', required: true },
        { key: 'logoText', label: 'Logo Yazısı (UI)', type: 'text' },
        { key: 'logoUrl', label: 'Logo URL (opsiyonel)', type: 'imageUrl' },
        { key: 'websiteUrl', label: 'Web Sitesi URL (opsiyonel)', type: 'text' },
        { key: 'sortOrder', label: 'Sıralama', type: 'text' },
      ]}
    />
  );
}

function PropertiesPanel({ token }: { token: string | null }) {
  return (
    <GenericContentPanel<Property>
      token={token}
      title="Emlak İlanları Yönetimi"
      subtitle="Emlak İlanları sayfasındaki konut/daire/villa ilanları buradan yönetilir."
      list={(t) => listPropertiesAdminAll(t, { page: 1, limit: 200 })}
      create={(t, p) => createProperty(t, p as any)}
      update={(t, id, p) => updateProperty(t, id, p as any)}
      remove={(t, id) => deleteProperty(t, id)}
      fields={[
        { key: 'title', label: 'Başlık', type: 'text', required: true },
        { key: 'address', label: 'Adres', type: 'text' },
        { key: 'price', label: 'Fiyat', type: 'text' },
        { key: 'propertyType', label: 'Tip (Konut/Daire/Villa)', type: 'text' },
        { key: 'rooms', label: 'Oda Sayısı', type: 'text' },
        { key: 'area', label: 'm²', type: 'text' },
        { key: 'imageUrl', label: 'Görsel URL', type: 'imageUrl' },
        { key: 'description', label: 'Açıklama', type: 'textarea' },
        { key: 'sortOrder', label: 'Sıralama', type: 'text' },
      ]}
    />
  );
}

type GenericField = { key: string; label: string; type: 'text' | 'textarea' | 'imageUrl'; required?: boolean };

function GenericContentPanel<T extends { id: number; title: string; isPublished: boolean }>({
  token,
  title,
  subtitle,
  list,
  create,
  update,
  remove,
  fields,
}: {
  token: string | null;
  title: string;
  subtitle: string;
  list: (token: string) => Promise<{ items: T[] }>;
  create: (token: string, payload: Partial<T>) => Promise<any>;
  update: (token: string, id: number, payload: Partial<T>) => Promise<any>;
  remove: (token: string, id: number) => Promise<any>;
  fields: GenericField[];
}) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [bulkProgress, setBulkProgress] = useState<null | { done: number; total: number }>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [edit, setEdit] = useState<Record<string, any>>({});
  const [createForm, setCreateForm] = useState<Record<string, any>>({ isPublished: true });

  const refresh = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await list(token);
      setItems(res.items || []);
    } catch (e: any) {
      setError(e?.message ?? 'Liste yüklenemedi.');
    } finally {
      setLoading(false);
    }
  }, [token, list]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <div>
      <h2 className="text-lg font-bold text-slate-900">{title}</h2>
      <p className="mt-1 text-sm text-slate-600">{subtitle}</p>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <button
          type="button"
          onClick={refresh}
          disabled={!token || loading || bulkDeleting}
          className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-slate-700 disabled:opacity-50"
        >
          Yenile
        </button>
        <button
          type="button"
          disabled={!token || loading || bulkDeleting || items.length === 0}
          className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100 disabled:opacity-50"
          onClick={async () => {
            if (!token) return;
            if (!confirm('Bu listedeki TÜM kayıtları silmek istediğinize emin misiniz? Bu işlem geri alınamaz.')) return;
            setBulkDeleting(true);
            setBulkProgress(null);
            setError(null);
            try {
              const res = await list(token);
              const all = res.items || [];
              if (!all.length) {
                await refresh();
                return;
              }
              setBulkProgress({ done: 0, total: all.length });
              let done = 0;
              for (const it of all) {
                await remove(token, it.id);
                done += 1;
                setBulkProgress({ done, total: all.length });
              }
              await refresh();
            } catch (e: any) {
              setError(e?.message ?? 'Toplu silme başarısız.');
            } finally {
              setBulkDeleting(false);
              setBulkProgress(null);
            }
          }}
        >
          {bulkDeleting && bulkProgress ? `Siliniyor… ${bulkProgress.done}/${bulkProgress.total}` : 'Tümünü Sil'}
        </button>
      </div>

      <div className="mt-6 rounded-3xl bg-soft-gray p-5">
        <h3 className="text-sm font-bold text-slate-900">Yeni Kayıt Ekle</h3>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          {fields.map((f) => (
            <div key={f.key} className={f.type === 'textarea' || f.type === 'imageUrl' ? 'md:col-span-2' : ''}>
              <Field label={f.label}>
                {f.type === 'textarea' ? (
                  <TextArea
                    rows={3}
                    value={String(createForm[f.key] ?? '')}
                    onChange={(e) => setCreateForm((s) => ({ ...s, [f.key]: e.target.value }))}
                  />
                ) : f.type === 'imageUrl' ? (
                  <ImageUrlInput
                    value={String(createForm[f.key] ?? '')}
                    onChange={(v) => setCreateForm((s) => ({ ...s, [f.key]: v }))}
                    placeholder="URL veya dosya seçin"
                  />
                ) : (
                  <TextInput
                    value={String(createForm[f.key] ?? '')}
                    onChange={(e) => setCreateForm((s) => ({ ...s, [f.key]: e.target.value }))}
                  />
                )}
              </Field>
            </div>
          ))}
          <Field label="Durum">
            <Toggle value={!!createForm.isPublished} onChange={(v) => setCreateForm((s) => ({ ...s, isPublished: v }))} />
          </Field>
        </div>

        <div className="mt-4">
          <button
            type="button"
            disabled={!token || loading || fields.some((f) => f.required && !String(createForm[f.key] ?? '').trim())}
            onClick={async () => {
              if (!token) return;
              setLoading(true);
              setError(null);
              try {
                const payload: Record<string, any> = { isPublished: !!createForm.isPublished };
                for (const f of fields) {
                  const raw = createForm[f.key];
                  let v = typeof raw === 'string' ? raw.trim() : raw;
                  
                  // Handle sortOrder as integer
                  if (f.key === 'sortOrder') {
                    if (v === undefined || v === null || v === '') {
                      v = 0;
                    } else {
                      const parsed = parseInt(String(v), 10);
                      v = isNaN(parsed) ? 0 : parsed;
                    }
                  }
                  
                  if (f.required) {
                    if (v === undefined || v === null || (typeof v === 'string' && v.length === 0)) {
                      setError(`${f.label} alanı zorunludur.`);
                      setLoading(false);
                      return;
                    }
                    payload[f.key] = v;
                    continue;
                  }
                  if (v === undefined || v === null) continue;
                  if (typeof v === 'string' && v.length === 0) continue;
                  payload[f.key] = v;
                }
                await create(token, payload as any);
                setCreateForm({ isPublished: true });
                await refresh();
              } catch (e: any) {
                setError(e?.message ?? 'Kayıt eklenemedi.');
              } finally {
                setLoading(false);
              }
            }}
            className="rounded-full bg-burgundy px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
          >
            Ekle
          </button>
        </div>
      </div>

      {error ? <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

      <div className="mt-6 space-y-3">
        {items.map((it) => {
          const isEditing = editingId === it.id;
          return (
            <div key={it.id} className="rounded-3xl border border-black/5 bg-white p-4 shadow-card">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="truncate text-sm font-bold text-slate-900">{(it as any).title}</div>
                    <Toggle
                      value={getPublishedValue(it as any)}
                      onChange={async (v) => {
                        if (!token) return;
                        await update(token, it.id, { isPublished: v } as any);
                        await refresh();
                      }}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-soft-gray"
                    onClick={() => {
                      setEditingId(isEditing ? null : it.id);
                      setEdit({ ...(it as any) });
                    }}
                  >
                    {isEditing ? 'Kapat' : 'Düzenle'}
                  </button>
                  <button
                    type="button"
                    className="rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100"
                    onClick={async () => {
                      if (!token) return;
                      if (!confirm('Bu kayıt silinsin mi?')) return;
                      await remove(token, it.id);
                      await refresh();
                    }}
                  >
                    Sil
                  </button>
                </div>
              </div>

              {isEditing ? (
                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                  {fields.map((f) => (
                    <div key={f.key} className={f.type === 'textarea' || f.type === 'imageUrl' ? 'md:col-span-2' : ''}>
                      <Field label={f.label}>
                        {f.type === 'textarea' ? (
                          <TextArea
                            rows={4}
                            value={String(edit[f.key] ?? '')}
                            onChange={(e) => setEdit((s) => ({ ...s, [f.key]: e.target.value }))}
                          />
                        ) : f.type === 'imageUrl' ? (
                          <ImageUrlInput
                            value={String(edit[f.key] ?? '')}
                            onChange={(v) => setEdit((s) => ({ ...s, [f.key]: v }))}
                            placeholder="URL veya dosya seçin"
                          />
                        ) : (
                          <TextInput value={String(edit[f.key] ?? '')} onChange={(e) => setEdit((s) => ({ ...s, [f.key]: e.target.value }))} />
                        )}
                      </Field>
                    </div>
                  ))}
                  <Field label="Durum">
                    <Toggle value={!!edit.isPublished} onChange={(v) => setEdit((s) => ({ ...s, isPublished: v }))} />
                  </Field>
                  <div className="md:col-span-2">
                    <button
                      type="button"
                      className="rounded-full bg-burgundy px-5 py-2.5 text-sm font-semibold text-white"
                      onClick={async () => {
                        if (!token) return;
                        const payload: Record<string, any> = { isPublished: !!edit.isPublished };
                        for (const f of fields) {
                          const raw = edit[f.key];
                          let v = typeof raw === 'string' ? raw.trim() : raw;
                          
                          // Handle sortOrder as integer
                          if (f.key === 'sortOrder') {
                            if (v === undefined || v === null || v === '') {
                              v = 0;
                            } else {
                              const parsed = parseInt(String(v), 10);
                              v = isNaN(parsed) ? 0 : parsed;
                            }
                          }
                          
                          if (f.required) {
                            if (v === undefined || v === null || (typeof v === 'string' && v.length === 0)) {
                              setError(`${f.label} alanı zorunludur.`);
                              return;
                            }
                            payload[f.key] = v;
                            continue;
                          }
                          if (v === undefined || v === null) continue;
                          if (typeof v === 'string' && v.length === 0) continue;
                          payload[f.key] = v;
                        }
                        await update(token, it.id, payload as any);
                        setEditingId(null);
                        await refresh();
                      }}
                    >
                      Kaydet
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}

        {!loading && items.length === 0 ? <div className="text-sm text-slate-600">Kayıt bulunamadı.</div> : null}
      </div>
    </div>
  );
}

