import type { MetadataRoute } from 'next';
import { SEO } from '../lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SEO.baseUrl.replace(/\/$/, '');
  const now = new Date().toISOString();
  const routes = [
    '',
    '/kurumsal',
    '/iletisim',
    '/haberler',
    '/videolar',
    '/yayinlar',
    '/kentsel-donusum',
    '/emlak-ilanlari',
    '/uyelerimiz',
    '/duyurular',
    '/etkinlikler',
    '/uye-ol',
    '/login',
    '/kvkk',
    '/kullanim-sartlari',
    '/uyelik-sartlari',
    '/sms-geri-bildirim',
  ];
  return routes.map((path) => ({
    url: path ? `${base}${path}/` : `${base}/`,
    lastModified: now,
    changeFrequency: path === '' ? 'weekly' as const : 'monthly' as const,
    priority: path === '' ? 1 : 0.8,
  }));
}
