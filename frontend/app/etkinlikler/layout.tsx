import type { Metadata } from 'next';
import { SEO, buildTitle, buildDescription, absoluteUrl } from '../../lib/seo';

export const metadata: Metadata = {
  title: buildTitle('Etkinlikler', '%s | ' + SEO.siteName),
  description: buildDescription('ANTMUTDER etkinlikleri. Konferans, seminer ve networking etkinlikleri.'),
  openGraph: { url: absoluteUrl('/etkinlikler/') },
  alternates: { canonical: absoluteUrl('/etkinlikler/') },
};

export default function EtkinliklerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
