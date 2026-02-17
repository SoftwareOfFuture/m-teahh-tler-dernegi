import type { Metadata } from 'next';
import { SEO, buildTitle, buildDescription, absoluteUrl } from '../../lib/seo';

export const metadata: Metadata = {
  title: buildTitle('İlanlarım', '%s | ' + SEO.siteName),
  description: buildDescription('Emlak ilanlarınızı yönetin. Onaylı üyeler kendi ilanlarını ekleyebilir.'),
  alternates: { canonical: absoluteUrl('/ilanlarim/') },
};

export default function IlanlarimLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
