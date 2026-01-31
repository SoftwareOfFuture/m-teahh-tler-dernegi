'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { PageHero } from '../../components/PageHero';
import { PageLayoutWithFooter } from '../../components/PageLayout';
import { clearToken, getToken, me, updateMyMember } from '../../lib/api';

export default function MyProfilePage() {
  const [token, setTokenState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const [isPlatformAdmin, setIsPlatformAdmin] = useState(false);

  useEffect(() => {
    const t = getToken();
    setTokenState(t);
    if (!t) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);
    me(t)
      .then((res) => {
        if (cancelled) return;
        setIsPlatformAdmin(res.user.role === 'platform_admin');
        if (res.member) {
          setName(res.member.name || '');
          setCompany(res.member.company || '');
          setRole(res.member.role || '');
          setProfileImageUrl(res.member.profileImageUrl || '');
        }
      })
      .catch((e: any) => {
        if (cancelled) return;
        clearToken();
        setTokenState(null);
        setError(e?.message ?? 'Oturum doğrulanamadı.');
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <PageLayoutWithFooter>
      <PageHero title="Profilim" subtitle="Kişisel bilgilerinizi güncelleyebilirsiniz." />

      {!token ? (
        <div className="mt-8 rounded-3xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900">
          Profilinizi görüntülemek için giriş yapmanız gerekiyor.{' '}
          <Link href="/login" className="font-semibold underline">
            Üye Girişi →
          </Link>
        </div>
      ) : loading ? (
        <div className="mt-8 rounded-3xl bg-white p-6 shadow-card">Yükleniyor…</div>
      ) : (
        <section className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
          <div className="rounded-3xl bg-white p-6 shadow-card">
            <h2 className="text-lg font-bold text-slate-900">Bilgilerim</h2>
            <p className="mt-1 text-sm text-slate-600">Bu bilgiler sadece sizin profiliniz içindir.</p>

            <form
              className="mt-6 space-y-4"
              onSubmit={async (e) => {
                e.preventDefault();
                if (!token) return;
                setSaving(true);
                setOk(false);
                setError(null);
                try {
                  await updateMyMember(token, {
                    name: name.trim(),
                    company: company.trim() || null,
                    role: role.trim() || null,
                    profileImageUrl: profileImageUrl.trim() || null,
                  });
                  setOk(true);
                  setTimeout(() => setOk(false), 2200);
                } catch (err: any) {
                  setError(err?.message ?? 'Güncelleme başarısız.');
                } finally {
                  setSaving(false);
                }
              }}
            >
              <div>
                <label htmlFor="profile_name" className="text-sm font-semibold text-slate-700">
                  Ad Soyad
                </label>
                <input
                  id="profile_name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-burgundy"
                />
              </div>

              <div>
                <label htmlFor="profile_company" className="text-sm font-semibold text-slate-700">
                  Firma
                </label>
                <input
                  id="profile_company"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-burgundy"
                />
              </div>

              <div>
                <label htmlFor="profile_role" className="text-sm font-semibold text-slate-700">
                  Üyelik / Rol
                </label>
                <input
                  id="profile_role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-burgundy"
                />
              </div>

              <div>
                <label htmlFor="profile_image_url" className="text-sm font-semibold text-slate-700">
                  Profil Fotoğraf URL
                </label>
                <input
                  id="profile_image_url"
                  value={profileImageUrl}
                  onChange={(e) => setProfileImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-burgundy"
                />
              </div>

              {error ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
              ) : null}
              {ok ? (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                  Güncellendi.
                </div>
              ) : null}

              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-full bg-burgundy px-5 py-3 text-sm font-semibold text-white shadow-card transition-colors hover:bg-burgundy-dark disabled:opacity-60"
              >
                {saving ? 'Kaydediliyor…' : 'Kaydet'}
              </button>
            </form>
          </div>

          <div className="rounded-3xl bg-soft-gray p-6">
            <h3 className="text-sm font-bold text-slate-900">Kısayollar</h3>
            <div className="mt-4 space-y-2 text-sm">
              <Link href="/uyelerimiz" className="block font-semibold text-burgundy hover:text-burgundy-dark">
                Üye Dizini →
              </Link>
              {isPlatformAdmin ? (
                <Link href="/platform-admin" className="block font-semibold text-burgundy hover:text-burgundy-dark">
                  Platform Admin →
                </Link>
              ) : null}
            </div>
            <button
              type="button"
              className="mt-6 w-full rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-soft-gray"
              onClick={() => {
                clearToken();
                setTokenState(null);
              }}
            >
              Çıkış Yap
            </button>
          </div>
        </section>
      )}
    </PageLayoutWithFooter>
  );
}

