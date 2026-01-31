export type Language = 'TR' | 'EN';

export type SliderItem = {
  id: string;
  date: string;
  title: string;
  description: string;
  imageUrl: string;
  href: string;
};

export type NewsItem = {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  imageUrl: string;
};

export type AnnouncementItem = {
  id: string;
  code: string;
  date: string;
  title: string;
};

export type VideoItem = {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  thumbnailUrl: string;
  href: string;
};

export type PartnerLogo = {
  id: string;
  name: string;
  logoText: string;
};

export type EventItem = {
  id: string;
  title: string;
  date: string;
  location: string;
  color: 'burgundy' | 'green' | 'blue';
};

export const sliderItems: SliderItem[] = [
  {
    id: 's1',
    date: '27 Ocak 2026',
    title: 'Yurt Dışı Müteahhitlik Hizmetleri Ödül Töreni',
    description:
      '“Dünyanın En Büyük 250 Uluslararası Müteahhidi” listesinde yer alan firmalar ödüllerini aldı.',
    imageUrl:
      'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1600&q=80',
    href: '#',
  },
  {
    id: 's2',
    date: '28 Ocak 2026',
    title: 'Ortadoğu ve Kuzey Afrika Bölgesi Bülteni Yayında',
    description:
      'Üyelerimizin bölgesel gelişmeleri takip edebilmesi amacıyla yeni bülten yayınlandı.',
    imageUrl:
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1600&q=80',
    href: '#',
  },
  {
    id: 's3',
    date: '05 Ocak 2026',
    title: 'Öne Çıkan Etkinlikler',
    description: 'Yüz yüze ve dijital platformlar üzerinden yürütülen etkinliklerden seçkiler.',
    imageUrl:
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&q=80',
    href: '#',
  },
];

export const newsItems: NewsItem[] = [
  {
    id: 'n1',
    title: 'Sektör Buluşması Antalya’da Gerçekleştirildi',
    excerpt: 'Üyelerimiz ile bir araya gelerek 2026 hedeflerini değerlendirdik.',
    date: '30.01.2026',
    imageUrl:
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80',
  },
  {
    id: 'n2',
    title: 'Yeni Dönem Eğitim Takvimi Yayında',
    excerpt: 'Sertifika programları ve mevzuat eğitimleri için başvurular açıldı.',
    date: '27.01.2026',
    imageUrl:
      'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&q=80',
  },
  {
    id: 'n3',
    title: 'Kentsel Dönüşümde Güncel Yaklaşımlar',
    excerpt: 'Uzman konuşmacılarla düzenlenen panelde yeni uygulamalar ele alındı.',
    date: '22.01.2026',
    imageUrl:
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200&q=80',
  },
  {
    id: 'n4',
    title: 'Teknik Gezi: Şantiye Ziyareti',
    excerpt: 'Örnek proje sahasında iş güvenliği ve kalite süreçlerini inceledik.',
    date: '15.01.2026',
    imageUrl:
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&q=80',
  },
  {
    id: 'n5',
    title: 'İhracat ve Yurt Dışı Projeler Çalıştayı',
    excerpt: 'Yeni pazar fırsatlarını değerlendirmek için çalışma grupları kuruldu.',
    date: '10.01.2026',
    imageUrl:
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=80',
  },
  {
    id: 'n6',
    title: 'Üyelerimize Özel Danışmanlık Hattı',
    excerpt: 'Mevzuat, sözleşme ve uygulama süreçleri için destek hizmeti başladı.',
    date: '05.01.2026',
    imageUrl:
      'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?w=1200&q=80',
  },
];

export const announcements: AnnouncementItem[] = [
  { id: 'a1', code: 'AMD-2026-68', date: '30.01.2026', title: 'İnşaat Sektörü Analizi - Ocak 2026' },
  { id: 'a2', code: 'AMD-2026-64', date: '30.01.2026', title: 'Ukrayna için Enerji Ekipmanları Destek Talebi' },
  { id: 'a3', code: 'AMD-2026-66', date: '29.01.2026', title: 'Uluslararası Sulama Teknolojileri Fuarı Duyurusu' },
  { id: 'a4', code: 'AMD-2026-60', date: '24.01.2026', title: 'Genel Kurul Toplantısı Bilgilendirmesi' },
];

export const videoItems: VideoItem[] = [
  {
    id: 'v1',
    title: 'Tanıtım Filmi',
    excerpt: 'Derneğimizin faaliyetlerini ve çalışmalarını anlatan kısa tanıtım videosu.',
    date: '18.09.2023',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&q=80',
    href: '#',
  },
  {
    id: 'v2',
    title: 'Etkinlikler Öne Çıkanlar',
    excerpt: 'Yılın öne çıkan etkinliklerinden kısa bir derleme.',
    date: '01.07.2025',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1200&q=80',
    href: '#',
  },
  {
    id: 'v3',
    title: 'Sektör Paneli',
    excerpt: 'Sektörün geleceği üzerine uzman görüşleri ve değerlendirmeler.',
    date: '27.01.2026',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1551836022-aadb801c60ae?w=1200&q=80',
    href: '#',
  },
];

export const partnerLogos: PartnerLogo[] = [
  { id: 'p1', name: 'CICA', logoText: 'CICA' },
  { id: 'p2', name: 'EIC', logoText: 'EIC' },
  { id: 'p3', name: 'GLOBAL ABC', logoText: 'GLOBAL ABC' },
  { id: 'p4', name: 'WORLD WATER COUNCIL', logoText: 'WWC' },
  { id: 'p5', name: 'DEİK', logoText: 'DEİK' },
  { id: 'p6', name: 'YTMK', logoText: 'YTMK' },
];

export const events: EventItem[] = [
  {
    id: 'e1',
    title: 'DEİK / Umman-Türkiye İş Forumu',
    date: '02 Şubat 2026',
    location: 'Muskat, Umman',
    color: 'burgundy',
  },
  {
    id: 'e2',
    title: '3 Ülke İşbirliği Toplantısı',
    date: '04 Şubat 2026',
    location: 'Dernek Binası',
    color: 'green',
  },
  {
    id: 'e3',
    title: 'Sektörel Değerlendirme Toplantısı',
    date: '12 Şubat 2026',
    location: 'Antalya',
    color: 'blue',
  },
];

