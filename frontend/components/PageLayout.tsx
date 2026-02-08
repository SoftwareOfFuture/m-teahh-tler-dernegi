import { Header } from './Header';
import { SiteFooter } from './SiteFooter';

type Props = {
  children: React.ReactNode;
};

export function PageLayout({ children }: Props) {
  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-surface">
      <Header />
      <main className="mx-auto w-full max-w-7xl overflow-x-hidden px-4 pb-20 pt-8 sm:px-6 sm:pt-10 lg:px-12">{children}</main>
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

