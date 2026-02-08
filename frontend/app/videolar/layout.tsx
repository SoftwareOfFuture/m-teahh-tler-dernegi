import type { Metadata } from 'next';
import { SEO, buildTitle, buildDescription, absoluteUrl } from '../../lib/seo';

export const metadata: Metadata = {
  title: buildTitle('Video Arşivi', '%s | ' + SEO.siteName),
  description: buildDescription('ANTMUTDER video arşivi. Toplantılar, röportajlar ve etkinlik videoları.'),
  openGraph: { url: absoluteUrl('/videolar/') },
  alternates: { canonical: absoluteUrl('/videolar/') },
};

export default function VideolarLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
