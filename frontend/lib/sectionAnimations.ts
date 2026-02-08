/**
 * Sayfa bölümleri için animasyon seçenekleri.
 * Platform admin panelinden seçilen değerler localStorage'da tutulur.
 */

export const SECTION_IDS = [
  'hero',
  'banner',
  'dijitalPlatformlar',
  'news',
  'video',
  'publications',
  'partners',
] as const;

export type SectionId = (typeof SECTION_IDS)[number];

export const ANIMATION_OPTIONS: { value: string; label: string }[] = [
  { value: 'none', label: 'Yok' },
  { value: 'fade-in', label: 'Fade In' },
  { value: 'fade-in-up', label: 'Fade In Up' },
  { value: 'fade-in-down', label: 'Fade In Down' },
  { value: 'scale-in', label: 'Scale In' },
  { value: 'slide-in-left', label: 'Slide In (Sol)' },
  { value: 'slide-in-right', label: 'Slide In (Sağ)' },
  { value: 'zoom-in', label: 'Zoom In' },
];

export type AnimationId = (typeof ANIMATION_OPTIONS)[number]['value'];

export const SECTION_LABELS: Record<SectionId, string> = {
  hero: 'Hero / Slider',
  banner: 'Banner Şeridi',
  dijitalPlatformlar: 'Dijital Platformlar',
  news: 'Güncel Haberler',
  video: 'Video Arşivi',
  publications: 'Yayınlar',
  partners: 'Partnerler',
};

const STORAGE_KEY = 'amd_section_animations';

export type SectionAnimationsMap = Partial<Record<SectionId, AnimationId>>;

function isBrowser() {
  return typeof window !== 'undefined';
}

export function getStoredSectionAnimations(): SectionAnimationsMap {
  if (!isBrowser()) return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, string>;
    const result: SectionAnimationsMap = {};
    for (const id of SECTION_IDS) {
      if (parsed[id] && ANIMATION_OPTIONS.some((o) => o.value === parsed[id])) {
        result[id] = parsed[id] as AnimationId;
      }
    }
    return result;
  } catch {
    return {};
  }
}

export function setStoredSectionAnimations(map: SectionAnimationsMap): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {
    // ignore
  }
}

/** Bölüm için uygulanacak Tailwind/class ismi (opacity 0 başlangıç için gerekirse) */
export function getAnimationClass(animationId: AnimationId | undefined): string {
  if (!animationId || animationId === 'none') return '';
  return `animate-${animationId}`;
}
