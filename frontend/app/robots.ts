import type { MetadataRoute } from 'next';
import { SEO } from '../lib/seo';

export default function robots(): MetadataRoute.Robots {
  const base = SEO.baseUrl.replace(/\/$/, '');
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/platform-admin/', '/profilim/', '/login/'] },
    sitemap: `${base}/sitemap.xml`,
  };
}
