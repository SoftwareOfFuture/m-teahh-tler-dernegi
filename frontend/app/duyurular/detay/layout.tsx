import type { Metadata } from 'next';
import { SEO, buildTitle, buildDescription, absoluteUrl } from '../../../lib/seo';

export const metadata: Metadata = {
  title: buildTitle('Duyuru Detayı', '%s | ' + SEO.siteName),
  description: buildDescription('ANTMUTDER duyuru detayı. Güncel duyurular ve haberler.'),
  alternates: { canonical: absoluteUrl('/duyurular/detay/') },
};

export default function DuyuruDetayLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
