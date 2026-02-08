import type { Metadata } from 'next';
import { SEO, buildTitle, buildDescription, absoluteUrl } from '../../lib/seo';

export const metadata: Metadata = {
  title: buildTitle('Haberler', '%s | ' + SEO.siteName),
  description: buildDescription('ANTMUTDER ve Antalya inşaat sektöründen güncel haberler. Dernek duyuruları ve etkinlikler.'),
  openGraph: { url: absoluteUrl('/haberler/') },
  alternates: { canonical: absoluteUrl('/haberler/') },
};

export default function HaberlerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
