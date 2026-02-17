'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { PageHero } from '../../components/PageHero';
import { PageLayoutWithFooter } from '../../components/PageLayout';
import { ImageUrlInput } from '../../components/ImageUrlInput';
import { getToken, clearToken, me, listMyProperties, createMyProperty, updateMyProperty, deleteMyProperty, type Property } from '../../lib/api';
import { normalizeImageSrc } from '../../lib/normalizeImageSrc';

const PLACEHOLDER_IMG = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80';

const emptyForm = {
  title: '',
  address: '',
  price: '',
  description: '',
  imageUrl: '',
  propertyType: '',
  rooms: '',
  area: '',
};

export default function IlanlarimPage() {
  const [token, setTokenState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [approved, setApproved] = useState(false);
  const [items, setItems] = useState<Property[]>([]);
  const [listLoading, setListLoading] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState(emptyForm);

  const refresh = useCallback(async () => {
    const t = getToken();
    if (!t) return;
    setListLoading(true);
    try {
      const res = await listMyProperties(t);
      setItems(res.items || []);
    } catch {
      setItems([]);
    } finally {
      setListLoading(false);
    }
  }, []);

  useEffect(() => {
    const t = getToken();
    setTokenState(t);
    if (!t) {
      setLoading(false);
      return;
    }
    setLoading(true);
    me(t)
      .then((res) => {
        setApproved(!!res.member?.isApproved);
        if (res.member?.isApproved) refresh();
      })
      .catch(() => {
        clearToken();
        setTokenState(null);
        setApproved(false);
      })
      .finally(() => setLoading(false));
  }, [refresh]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!token || !form.title.trim()) return;
    setSaving(true);
    setError(null);
    try {
      await createMyProperty(token, {
        title: form.title.trim(),
        address: form.address.trim() || null,
        price: form.price.trim() || null,
        description: form.description.trim() || null,
        imageUrl: form.imageUrl.trim() || null,
        propertyType: form.propertyType.trim() || null,
        rooms: form.rooms.trim() || null,
        area: form.area.trim() || null,
      });
      setForm(emptyForm);
      await refresh();
    } catch (err: any) {
      setError(err?.message ?? 'İlan eklenemedi.');
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdate(id: number) {
    if (!token) return;
    setSaving(true);
    setError(null);
    try {
      await updateMyProperty(token, id, {
        title: editForm.title.trim(),
        address: editForm.address.trim() || null,
        price: editForm.price.trim() || null,
        description: editForm.description.trim() || null,
        imageUrl: editForm.imageUrl.trim() || null,
        propertyType: editForm.propertyType.trim() || null,
        rooms: editForm.rooms.trim() || null,
        area: editForm.area.trim() || null,
      } as Partial<Property>);
      setEditingId(null);
      await refresh();
    } catch (err: any) {
      setError(err?.message ?? 'Güncelleme başarısız.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!token || !confirm('Bu ilanı silmek istediğinize emin misiniz?')) return;
    setSaving(true);
    setError(null);
    try {
      await deleteMyProperty(token, id);
      setEditingId(null);
      await refresh();
    } catch (err: any) {
      setError(err?.message ?? 'Silme başarısız.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <PageLayoutWithFooter>
      <PageHero title="İlanlarım" subtitle="Onaylı üyeler kendi emlak ilanlarını buradan yönetebilir." />

      <section className="mt-8 min-w-0">
        {!token ? (
          <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900">
            Emlak ilanı eklemek için giriş yapmanız gerekiyor.{' '}
            <Link href="/login" className="font-semibold underline">Üye Girişi →</Link>
          </div>
        ) : loading ? (
          <div className="rounded-3xl bg-soft-gray p-6 text-sm text-slate-600">Yükleniyor…</div>
        ) : !approved ? (
          <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900">
            Sadece <strong>onaylı üyeler</strong> emlak ilanı ekleyebilir. Üyeliğiniz onaylandıktan sonra bu sayfadan kendi ilanlarınızı girebilirsiniz.
            <br />
            <Link href="/profilim" className="mt-3 inline-block font-semibold text-burgundy underline">Profilim →</Link>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-bold text-slate-900">Emlak İlanlarım</h2>
              <Link href="/emlak-ilanlari" className="text-sm font-semibold text-burgundy hover:text-burgundy-dark">
                Tüm ilanlar →
              </Link>
            </div>

            {error && (
              <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Yeni ilan formu */}
            <div className="mt-6 rounded-3xl bg-soft-gray p-6">
              <h3 className="text-base font-bold text-slate-900">Yeni İlan Ekle</h3>
              <form onSubmit={handleCreate} className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="text-sm font-semibold text-slate-700">Başlık *</label>
                  <input
                    value={form.title}
                    onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))}
                    required
                    className="mt-1 w-full rounded-2xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none focus:border-burgundy"
                    placeholder="Örn: Deniz manzaralı 3+1 daire"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700">Adres</label>
                  <input
                    value={form.address}
                    onChange={(e) => setForm((s) => ({ ...s, address: e.target.value }))}
                    className="mt-1 w-full rounded-2xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none focus:border-burgundy"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700">Fiyat</label>
                  <input
                    value={form.price}
                    onChange={(e) => setForm((s) => ({ ...s, price: e.target.value }))}
                    className="mt-1 w-full rounded-2xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none focus:border-burgundy"
                    placeholder="Örn: 5.000.000 TL"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700">Konut tipi</label>
                  <input
                    value={form.propertyType}
                    onChange={(e) => setForm((s) => ({ ...s, propertyType: e.target.value }))}
                    className="mt-1 w-full rounded-2xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none focus:border-burgundy"
                    placeholder="Daire, Villa, vb."
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700">Oda</label>
                  <input
                    value={form.rooms}
                    onChange={(e) => setForm((s) => ({ ...s, rooms: e.target.value }))}
                    className="mt-1 w-full rounded-2xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none focus:border-burgundy"
                    placeholder="3+1"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700">m²</label>
                  <input
                    value={form.area}
                    onChange={(e) => setForm((s) => ({ ...s, area: e.target.value }))}
                    className="mt-1 w-full rounded-2xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none focus:border-burgundy"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm font-semibold text-slate-700">Görsel URL</label>
                  <ImageUrlInput
                    value={form.imageUrl}
                    onChange={(v) => setForm((s) => ({ ...s, imageUrl: v }))}
                    className="mt-1"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm font-semibold text-slate-700">Açıklama</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))}
                    rows={4}
                    className="mt-1 w-full rounded-2xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none focus:border-burgundy"
                  />
                </div>
                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    disabled={saving || !form.title.trim()}
                    className="rounded-full bg-burgundy px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
                  >
                    {saving ? 'Kaydediliyor…' : 'İlan Ekle'}
                  </button>
                </div>
              </form>
            </div>

            {/* Listem */}
            <div className="mt-8">
              <h3 className="text-base font-bold text-slate-900">Eklediğim İlanlar</h3>
              {listLoading ? (
                <p className="mt-4 text-sm text-slate-500">Yükleniyor…</p>
              ) : items.length === 0 ? (
                <p className="mt-4 rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-600">Henüz ilan eklemediniz.</p>
              ) : (
                <ul className="mt-4 space-y-4">
                  {items.map((p) => (
                    <li key={p.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">
                      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-start">
                        <div className="relative h-32 w-full shrink-0 overflow-hidden rounded-xl bg-slate-100 sm:h-24 sm:w-32">
                          <Image
                            src={normalizeImageSrc(p.imageUrl) || PLACEHOLDER_IMG}
                            alt={p.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          {editingId === p.id ? (
                            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                              <input
                                value={editForm.title}
                                onChange={(e) => setEditForm((s) => ({ ...s, title: e.target.value }))}
                                className="rounded-xl border border-black/10 px-3 py-1.5 text-sm sm:col-span-2"
                                placeholder="Başlık"
                              />
                              <input
                                value={editForm.price}
                                onChange={(e) => setEditForm((s) => ({ ...s, price: e.target.value }))}
                                className="rounded-xl border border-black/10 px-3 py-1.5 text-sm"
                                placeholder="Fiyat"
                              />
                              <input
                                value={editForm.address}
                                onChange={(e) => setEditForm((s) => ({ ...s, address: e.target.value }))}
                                className="rounded-xl border border-black/10 px-3 py-1.5 text-sm sm:col-span-2"
                                placeholder="Adres"
                              />
                              <input
                                value={editForm.propertyType}
                                onChange={(e) => setEditForm((s) => ({ ...s, propertyType: e.target.value }))}
                                className="rounded-xl border border-black/10 px-3 py-1.5 text-sm"
                                placeholder="Konut tipi"
                              />
                              <input
                                value={editForm.rooms}
                                onChange={(e) => setEditForm((s) => ({ ...s, rooms: e.target.value }))}
                                className="rounded-xl border border-black/10 px-3 py-1.5 text-sm"
                                placeholder="Oda"
                              />
                              <input
                                value={editForm.area}
                                onChange={(e) => setEditForm((s) => ({ ...s, area: e.target.value }))}
                                className="rounded-xl border border-black/10 px-3 py-1.5 text-sm"
                                placeholder="m²"
                              />
                              <div className="sm:col-span-2">
                                <ImageUrlInput
                                  value={editForm.imageUrl}
                                  onChange={(v) => setEditForm((s) => ({ ...s, imageUrl: v }))}
                                  placeholder="Görsel URL"
                                />
                              </div>
                              <textarea
                                value={editForm.description}
                                onChange={(e) => setEditForm((s) => ({ ...s, description: e.target.value }))}
                                rows={2}
                                className="sm:col-span-2 rounded-xl border border-black/10 px-3 py-1.5 text-sm"
                                placeholder="Açıklama"
                              />
                              <div className="sm:col-span-2 flex gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleUpdate(p.id)}
                                  disabled={saving}
                                  className="rounded-full bg-burgundy px-4 py-1.5 text-sm font-semibold text-white disabled:opacity-50"
                                >
                                  Kaydet
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setEditingId(null)}
                                  className="rounded-full border border-slate-300 px-4 py-1.5 text-sm font-semibold text-slate-700"
                                >
                                  İptal
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <h4 className="font-bold text-slate-800">{p.title}</h4>
                              {p.price && <p className="text-sm text-burgundy font-semibold">{p.price}</p>}
                              {p.address && <p className="text-sm text-slate-600">{p.address}</p>}
                              <div className="mt-2 flex gap-2">
                                <Link
                                  href={`/emlak-ilanlari/detay?id=${p.id}`}
                                  className="text-xs font-semibold text-burgundy hover:underline"
                                >
                                  Görüntüle
                                </Link>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingId(p.id);
                                    setEditForm({
                                      title: p.title,
                                      address: p.address || '',
                                      price: p.price || '',
                                      description: p.description || '',
                                      imageUrl: p.imageUrl || '',
                                      propertyType: p.propertyType || '',
                                      rooms: p.rooms || '',
                                      area: p.area || '',
                                    });
                                  }}
                                  className="text-xs font-semibold text-slate-600 hover:underline"
                                >
                                  Düzenle
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDelete(p.id)}
                                  disabled={saving}
                                  className="text-xs font-semibold text-red-600 hover:underline disabled:opacity-50"
                                >
                                  Sil
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}
      </section>
    </PageLayoutWithFooter>
  );
}
