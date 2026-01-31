'use client';

import { useEffect, useMemo, useState } from 'react';
import { PageHero } from '../../components/PageHero';
import { PageLayoutWithFooter } from '../../components/PageLayout';
import {
  approveMember,
  clearToken,
  createAnnouncement,
  createNews,
  createPublication,
  createSlide,
  createVideo,
  deleteAnnouncement,
  deleteNews,
  deletePublication,
  deleteSlide,
  deleteVideo,
  getToken,
  listAnnouncementsAdminAll,
  listMembersAdminAll,
  listNewsAdminAll,
  listPublicationsAdminAll,
  listSlidesAdminAll,
  listVideosAdminAll,
  me,
  updateAnnouncement,
  updateNews,
  updatePublication,
  updateSlide,
  updateVideo,
  type Announcement,
  type HeroSlide,
  type News,
  type Publication,
  type Video,
} from '../../lib/api';

export default function PlatformAdminPage() {
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [tab, setTab] = useState<'members' | 'slides' | 'news' | 'announcements' | 'videos' | 'publications'>('members');

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

  async function refreshMembers() {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await listMembersAdminAll(token, { page: 1, limit: 200 });
      // Unapproved first
      const unapproved = (res.items || []).filter((m: any) => m.isApproved === false);
      const approved = (res.items || []).filter((m: any) => m.isApproved !== false);
      setItems([...unapproved, ...approved]);
    } catch (e: any) {
      setError(e?.message ?? 'Üyeler yüklenemedi.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!authorized) return;
    refreshMembers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authorized]);

  return (
    <PageLayoutWithFooter>
      <PageHero
        title="Platform Admin"
        subtitle="Bu sayfa sadece site yöneticisi (platform_admin) içindir. Üye onaylarını buradan yapabilirsiniz."
      />

      {checking ? (
        <div className="mt-8 rounded-3xl bg-white p-6 shadow-card">Kontrol ediliyor…</div>
      ) : !authorized ? (
        <div className="mt-8 rounded-3xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
          Bu sayfaya erişim yok. Lütfen platform admin hesabıyla giriş yapın.
        </div>
      ) : (
        <section className="mt-8 rounded-3xl bg-white p-6 shadow-card">
          <div className="flex flex-wrap gap-2">
            <TabButton active={tab === 'members'} onClick={() => setTab('members')}>Üyeler</TabButton>
            <TabButton active={tab === 'slides'} onClick={() => setTab('slides')}>Slider</TabButton>
            <TabButton active={tab === 'news'} onClick={() => setTab('news')}>Haberler</TabButton>
            <TabButton active={tab === 'announcements'} onClick={() => setTab('announcements')}>Duyurular</TabButton>
            <TabButton active={tab === 'videos'} onClick={() => setTab('videos')}>Videolar</TabButton>
            <TabButton active={tab === 'publications'} onClick={() => setTab('publications')}>Yayınlar</TabButton>
          </div>

          <div className="mt-6">
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
            ) : tab === 'news' ? (
              <NewsPanel token={token} />
            ) : tab === 'announcements' ? (
              <AnnouncementsPanel token={token} />
            ) : tab === 'videos' ? (
              <VideosPanel token={token} />
            ) : (
              <PublicationsPanel token={token} />
            )}
          </div>
        </section>
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
        <div className="grid grid-cols-[1fr_120px] bg-soft-gray px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-600">
          <div>Üye</div>
          <div className="text-right">İşlem</div>
        </div>

        <div className="divide-y divide-black/5">
          {items.map((m) => {
            const isApproved = m.isApproved !== false;
            return (
              <div key={m.id} className="grid grid-cols-[1fr_120px] items-center px-4 py-4">
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
                  </div>
                  <p className="mt-1 truncate text-xs text-slate-500">{m.company || '—'}</p>
                  <p className="mt-1 truncate text-xs text-slate-400">{m.email}</p>
                </div>

                <div className="text-right">
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
                  ) : (
                    <span className="text-xs font-semibold text-slate-500">—</span>
                  )}
                </div>
              </div>
            );
          })}

          {!loading && items.length === 0 ? <div className="px-4 py-6 text-sm text-slate-600">Kayıt bulunamadı.</div> : null}
        </div>
      </div>
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

  async function refresh() {
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
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

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
                // delete sequentially to keep it simple
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
            <TextInput value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." />
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
                    <TextInput
                      value={String(edit.imageUrl ?? '')}
                      onChange={(e) => setEdit((s) => ({ ...s, imageUrl: e.target.value }))}
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
      { key: 'imageUrl', label: 'Görsel URL', type: 'text' },
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
      { key: 'imageUrl', label: 'Görsel URL', type: 'text' },
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
      { key: 'coverImageUrl', label: 'Kapak Görsel URL', type: 'text' },
      { key: 'fileUrl', label: 'Dosya URL (PDF)', type: 'text' },
      { key: 'excerpt', label: 'Özet', type: 'textarea' },
    ]}
  />;
}

type GenericField = { key: string; label: string; type: 'text' | 'textarea'; required?: boolean };

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
  const [editingId, setEditingId] = useState<number | null>(null);
  const [edit, setEdit] = useState<Record<string, any>>({});
  const [createForm, setCreateForm] = useState<Record<string, any>>({ isPublished: true });

  async function refresh() {
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
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <div>
      <h2 className="text-lg font-bold text-slate-900">{title}</h2>
      <p className="mt-1 text-sm text-slate-600">{subtitle}</p>

      <div className="mt-6 rounded-3xl bg-soft-gray p-5">
        <h3 className="text-sm font-bold text-slate-900">Yeni Kayıt Ekle</h3>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          {fields.map((f) => (
            <div key={f.key} className={f.type === 'textarea' ? 'md:col-span-2' : ''}>
              <Field label={f.label}>
                {f.type === 'textarea' ? (
                  <TextArea
                    rows={3}
                    value={String(createForm[f.key] ?? '')}
                    onChange={(e) => setCreateForm((s) => ({ ...s, [f.key]: e.target.value }))}
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
                  const v = typeof raw === 'string' ? raw.trim() : raw;
                  if (f.required) {
                    payload[f.key] = typeof v === 'string' ? v : v;
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
                    <div key={f.key} className={f.type === 'textarea' ? 'md:col-span-2' : ''}>
                      <Field label={f.label}>
                        {f.type === 'textarea' ? (
                          <TextArea
                            rows={4}
                            value={String(edit[f.key] ?? '')}
                            onChange={(e) => setEdit((s) => ({ ...s, [f.key]: e.target.value }))}
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
                          const v = typeof raw === 'string' ? raw.trim() : raw;
                          if (f.required) {
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

