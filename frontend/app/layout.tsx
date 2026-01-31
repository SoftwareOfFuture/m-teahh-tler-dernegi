import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Antalya Müteahhitler Derneği',
  description: 'Kurumsal web sitesi',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.ico',
    apple: '/favicon.svg',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className="w-full overflow-x-hidden" style={{ maxWidth: '100vw', overflowX: 'hidden' }}>
      <body className={`${inter.className} w-full overflow-x-hidden`} style={{ maxWidth: '100vw', overflowX: 'hidden' }}>
        {children}
      </body>
    </html>
  );
}

