'use client';

import { useEffect, useMemo, useState } from 'react';
import { PageHero } from '../../components/PageHero';
import { PageLayoutWithFooter } from '../../components/PageLayout';
import { approveMember, clearToken, getToken, listMembersAdminAll, me } from '../../lib/api';

export default function PlatformAdminPage() {
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  async function refresh() {
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
    refresh();
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
                            setLoading(true);
                            setError(null);
                            try {
                              await approveMember(token, m.id);
                              await refresh();
                            } catch (e: any) {
                              setError(e?.message ?? 'Onay başarısız.');
                            } finally {
                              setLoading(false);
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

              {!loading && items.length === 0 ? (
                <div className="px-4 py-6 text-sm text-slate-600">Kayıt bulunamadı.</div>
              ) : null}
            </div>
          </div>
        </section>
      )}
    </PageLayoutWithFooter>
  );
}

