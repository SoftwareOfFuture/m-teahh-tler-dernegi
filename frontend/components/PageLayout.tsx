import { Header } from './Header';
import { SiteFooter } from './SiteFooter';

type Props = {
  children: React.ReactNode;
};

export function PageLayout({ children }: Props) {
  return (
    <div className="min-h-screen w-full bg-white">
      <Header />
      <main className="w-full px-4 pb-16 pt-6 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}

export function PageLayoutWithFooter({ children }: Props) {
  return (
    <PageLayout>
      {children}
      <SiteFooter />
    </PageLayout>
  );
}

