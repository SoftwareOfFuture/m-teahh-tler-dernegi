'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import type { BoardMember } from '../lib/api';
import { normalizeImageSrc } from '../lib/normalizeImageSrc';

type Props = {
  member: BoardMember | null;
  onClose: () => void;
};

export function BoardMemberModal({ member, onClose }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!member) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [member, onClose]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  if (!member) return null;

  const src = normalizeImageSrc(member.imageUrl);
  const roleLabel = member.roleLabel || (member.role === 'baskan' ? 'Yönetim Kurulu Başkanı' : 'Asil Üye');

  const items = [
    { label: 'Görev / Pozisyon', value: member.duty || roleLabel },
    { label: 'Meslek', value: member.profession },
    { label: 'Birim', value: member.unit },
    { label: 'Yerleşim Yeri Adresi', value: member.residenceAddress },
  ].filter((x) => x.value);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="board-member-modal-title"
    >
      <div
        className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          aria-label="Kapat"
        >
          <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-6 pt-8">
          <div className="flex flex-col items-center">
            <div className="relative size-24 overflow-hidden rounded-full border-2 border-burgundy/30 bg-slate-100 sm:size-28">
              {src ? (
                <Image
                  src={src}
                  alt={member.name}
                  fill
                  className="object-cover"
                  sizes="112px"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-3xl font-bold text-burgundy/60 sm:text-4xl">
                  {member.name.charAt(0)}
                </div>
              )}
            </div>
            <h2 id="board-member-modal-title" className="mt-4 text-center text-xl font-bold text-slate-900">
              {member.name}
            </h2>
          </div>

          <div className="mt-6 space-y-3 border-t border-slate-100 pt-4">
            {items.map(({ label, value }) => (
              <div key={label}>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</p>
                <p className="mt-0.5 text-sm text-slate-800">{value}</p>
              </div>
            ))}
          </div>

          {items.length === 0 && (
            <p className="mt-4 text-center text-sm text-slate-500">Ek bilgi bulunmuyor.</p>
          )}
        </div>
      </div>
    </div>
  );
}
