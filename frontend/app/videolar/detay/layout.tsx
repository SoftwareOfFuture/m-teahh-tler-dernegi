import type { Metadata } from 'next';
import { SEO, buildTitle, buildDescription, absoluteUrl } from '../../../lib/seo';

export const metadata: Metadata = {
  title: buildTitle('Arşiv Detayı', '%s | ' + SEO.siteName),
  description: buildDescription('ANTMUTDER arşiv detayı. Duyurular ve videolar.'),
  alternates: { canonical: absoluteUrl('/videolar/detay/') },
};

export default function VideoDetayLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
