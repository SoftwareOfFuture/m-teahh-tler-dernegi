'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { getSiteSettingsPublic } from '../lib/api';

export function MaintenanceGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [maintenanceMode, setMaintenanceMode] = useState<boolean | null>(null);

  const isPlatformAdmin = pathname?.startsWith('/platform-admin');

  useEffect(() => {
    if (isPlatformAdmin) {
      setMaintenanceMode(false);
      return;
    }
    getSiteSettingsPublic()
      .then((s) => setMaintenanceMode(!!s.maintenanceMode))
      .catch(() => setMaintenanceMode(false));
  }, [isPlatformAdmin, pathname]);

  if (isPlatformAdmin) return <>{children}</>;
  if (maintenanceMode === null) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>
        <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Yükleniyor…</p>
      </div>
    );
  }
  if (maintenanceMode) {
    return (
      <div style={{ margin: 0, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>
        <div style={{ textAlign: 'center', padding: '2rem', maxWidth: '28rem' }}>
          <h1 style={{ color: '#8B1538', fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.75rem' }}>Site Bakımda</h1>
          <p style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.6 }}>Antalya İnşaat Müteahhitleri Derneği web sitesi kısa süreli bakım çalışması nedeniyle geçici olarak kapalıdır. Yakında tekrar hizmetinizdeyiz.</p>
        </div>
      </div>
    );
  }
  return <>{children}</>;
}
