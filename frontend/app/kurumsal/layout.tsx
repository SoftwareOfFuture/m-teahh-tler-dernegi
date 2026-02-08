import type { Metadata } from 'next';
import { getPagePublic } from '../../lib/api';
import { SEO, buildTitle, buildDescription, absoluteUrl } from '../../lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  try {
    const page = await getPagePublic('kurumsal');
    const title = buildTitle(page.heroTitle || 'Kurumsal', '%s | ' + SEO.siteName);
    const description = buildDescription(page.heroSubtitle || page.aboutParagraph1 || SEO.defaultDescription);
    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: absoluteUrl('/kurumsal/'),
      },
      twitter: { title, description },
      alternates: { canonical: absoluteUrl('/kurumsal/') },
    };
  } catch {
    return {
      title: buildTitle('Kurumsal', '%s | ' + SEO.siteName),
      description: buildDescription(SEO.defaultDescription),
      alternates: { canonical: absoluteUrl('/kurumsal/') },
    };
  }
}

export default function KurumsalLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
