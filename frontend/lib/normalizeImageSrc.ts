export function normalizeImageSrc(src: string | null | undefined): string {
  const s = String(src ?? '').trim();
  if (!s) return '';
  if (typeof window !== 'undefined' && s.startsWith('/') && !s.startsWith('//')) {
    return window.location.origin + s;
  }
  if (s.startsWith('data:') || s.startsWith('http://') || s.startsWith('https://') || s.startsWith('/')) return s;
  const looksBase64 = s.length >= 128 && /^[A-Za-z0-9+/]+=*$/.test(s);
  if (!looksBase64) return s;
  const mime =
    s.startsWith('iVBOR') ? 'image/png' : s.startsWith('/9j/') || s.startsWith('2wCE') ? 'image/jpeg' : 'image/jpeg';

  return `data:${mime};base64,${s}`;
}

