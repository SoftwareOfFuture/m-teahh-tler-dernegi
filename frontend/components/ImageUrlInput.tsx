'use client';

import { useRef, useState } from 'react';

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  accept?: string;
  className?: string;
  maxWidth?: number;
  maxQuality?: number;
};

export function ImageUrlInput({
  value,
  onChange,
  placeholder = 'URL veya dosya seçin',
  accept = 'image/*',
  className = '',
  maxWidth = 1920,
  maxQuality = 0.85,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [compressing, setCompressing] = useState(false);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;

    if (file.size < 200 * 1024 && !file.type.includes('png')) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result;
        if (typeof result === 'string') onChange(result);
      };
      reader.readAsDataURL(file);
      e.target.value = '';
      return;
    }

    setCompressing(true);
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      let w = img.width;
      let h = img.height;
      if (w > maxWidth) {
        h = Math.round((h * maxWidth) / w);
        w = maxWidth;
      }
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setCompressing(false);
        e.target.value = '';
        return;
      }
      ctx.drawImage(img, 0, 0, w, h);
      const dataUrl = canvas.toDataURL('image/jpeg', maxQuality);
      onChange(dataUrl);
      setCompressing(false);
      e.target.value = '';
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result;
        if (typeof result === 'string') onChange(result);
      };
      reader.readAsDataURL(file);
      setCompressing(false);
      e.target.value = '';
    };
    img.src = objectUrl;
  }

  return (
    <div className={`flex flex-col gap-2 sm:flex-row sm:items-center ${className}`}>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-w-0 flex-1 rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-burgundy"
      />
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
        aria-label="Dosya seç"
        title="Dosya seç"
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={compressing}
        className="shrink-0 rounded-2xl border border-burgundy bg-white px-4 py-3 text-sm font-semibold text-burgundy transition-colors hover:bg-burgundy hover:text-white disabled:opacity-60"
      >
        {compressing ? 'Sıkıştırılıyor…' : 'Dosya Seç'}
      </button>
    </div>
  );
}
