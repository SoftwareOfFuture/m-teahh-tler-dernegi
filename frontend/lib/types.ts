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
  logoUrl?: string | null;
  websiteUrl?: string | null;
};

export type EventItem = {
  id: string;
  title: string;
  date: string;
  location: string;
  color: 'burgundy' | 'green' | 'blue';
};

