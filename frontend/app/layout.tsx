import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ChunkErrorAutoReload } from '../components/ChunkErrorAutoReload';
import './globals.css';

const fontSans = Inter({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Antalya İnşaat Müteahhitleri Derneği',
  description: 'ANTMUTDER - İnşaat sektöründe paylaşım, dayanışma ve sektörel sorunların çözümü için birlikte çalışıyoruz.',
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
    <html lang="tr" className={fontSans.variable}>
      <body className="font-sans antialiased">
        <ChunkErrorAutoReload />
        {children}
      </body>
    </html>
  );
}
