'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import Image from 'next/image';
import { normalizeImageSrc } from '../lib/normalizeImageSrc';
import { getMemberPublic, listMemberDocumentsPublic, type Partner } from '../lib/api';

type CombinedItem = {
  id: string;
  type: 'partner' | 'member';
  name: string;
  company: string;
  person?: string;
  logoUrl: string | null;
  websiteUrl: string | null;
};

type MemberDetails = {
  id: number;
  name: string;
  email: string;
  company: string | null;
  role: string | null;
  profileImageUrl: string | null;
  websiteUrl: string | null;
  joinDate: string;
  phoneCountryCode: string | null;
  phoneNumber: string | null;
  phoneE164: string | null;
};

type MemberDocument = {
  id: number;
  kind: string;
  filename: string | null;
  mimeType: string | null;
  sizeBytes: number;
};

type Props = {
  item: CombinedItem | null;
  partner?: Partner | null;
  onClose: () => void;
};

function normalizeWebsiteUrl(raw: string | null | undefined): string | null {
  const v = String(raw || '').trim();
  if (!v) return null;
  const lower = v.toLowerCase();
  if (lower.startsWith('javascript:') || lower.startsWith('data:') || lower.startsWith('file:')) return null;
  if (lower.startsWith('http://') || lower.startsWith('https://')) return v;
  return `https://${v.replace(/^\/+/, '')}`;
}

function formatPhone(cc: string | null, num: string | null): string | null {
  if (!cc && !num) return null;
  if (cc && num) return `${cc} ${num}`;
  return cc || num || null;
}

function getDocumentLabel(kind: string): string {
  const labels: Record<string, string> = {
    contractor_license: 'Müteahhitlik Belgesi',
    tax_certificate: 'Vergi Levhası',
    trade_registry: 'Ticaret Sicil Belgesi',
  };
  return labels[kind] || kind;
}

function initialsFrom(name: string) {
  const s = (name || '').trim();
  if (!s) return 'AMD';
  const parts = s.split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] || '';
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] || '' : '';
  const out = (first + last).toUpperCase();
  return out || 'AMD';
}

export function MemberPartnerModal({ item, partner, onClose }: Props) {
  const [memberDetails, setMemberDetails] = useState<MemberDetails | null>(null);
  const [documents, setDocuments] = useState<MemberDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!item) return;

    if (item.type === 'member') {
      const memberId = parseInt(item.id.replace('member-', ''), 10);
      if (isNaN(memberId)) return;

      setLoading(true);
      setError(null);
      Promise.all([getMemberPublic(memberId), listMemberDocumentsPublic(memberId)])
        .then(([member, docsRes]) => {
          setMemberDetails(member);
          setDocuments(docsRes.items || []);
        })
        .catch((err: any) => {
          setError(err?.message ?? 'Bilgiler yüklenemedi.');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setMemberDetails(null);
      setDocuments([]);
    }
  }, [item]);

  useEffect(() => {
    if (!item) return;

    const modal = modalRef.current;
    const overlay = overlayRef.current;
    const content = contentRef.current;
    if (!modal || !overlay || !content) return;

    // Animate in
    gsap.set([overlay, content], { opacity: 0 });
    gsap.set(content, { scale: 0.9, y: 20 });

    const tl = gsap.timeline();
    tl.to(overlay, { opacity: 1, duration: 0.2, ease: 'power2.out' });
    tl.to(content, { opacity: 1, scale: 1, y: 0, duration: 0.3, ease: 'back.out(1.2)' }, '-=0.1');

    return () => {
      tl.kill();
    };
  }, [item]);

  function handleClose() {
    const modal = modalRef.current;
    const overlay = overlayRef.current;
    const content = contentRef.current;
    if (!modal || !overlay || !content) {
      onClose();
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        onClose();
      },
    });
    tl.to(content, { opacity: 0, scale: 0.9, y: 20, duration: 0.2, ease: 'power2.in' });
    tl.to(overlay, { opacity: 0, duration: 0.2, ease: 'power2.in' }, '-=0.1');
  }

  if (!item) return null;

  const isPartner = item.type === 'partner';
  const company = item.company || item.name;
  const logoSrc = normalizeImageSrc(item.logoUrl || (isPartner ? partner?.logoUrl : null) || (memberDetails?.profileImageUrl || null));
  const websiteUrl = normalizeWebsiteUrl(item.websiteUrl || (isPartner ? partner?.websiteUrl : null) || (memberDetails?.websiteUrl || null));
  const phone = isPartner ? null : formatPhone(memberDetails?.phoneCountryCode || null, memberDetails?.phoneNumber || null);
  const email = isPartner ? null : memberDetails?.email || null;

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      onClick={(e) => {
        if (e.target === modalRef.current || e.target === overlayRef.current) {
          handleClose();
        }
      }}
    >
      {/* Overlay */}
      <div ref={overlayRef} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Content */}
      <div
        ref={contentRef}
        className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 z-20 grid size-10 place-items-center rounded-full bg-white/90 shadow-lg transition-colors hover:bg-white"
          aria-label="Kapat"
        >
          <svg className="size-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="relative border-b border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6 sm:p-8">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
            {/* Logo */}
            <div className="shrink-0">
              {logoSrc ? (
                <div className="relative size-24 overflow-hidden rounded-2xl bg-white shadow-lg ring-2 ring-slate-100 sm:size-32">
                  <Image src={logoSrc} alt={company} fill className="object-contain p-2" />
                </div>
              ) : (
                <div className="grid size-24 place-items-center rounded-2xl bg-gradient-to-br from-burgundy to-red-900 text-3xl font-extrabold text-white shadow-lg sm:size-32">
                  {initialsFrom(company)}
                </div>
              )}
            </div>

            {/* Company Info */}
            <div className="flex-1 text-center sm:text-left">
              <h2 id="modal-title" className="text-2xl font-bold text-slate-900 sm:text-3xl">
                {company}
              </h2>
              {!isPartner && memberDetails && (
                <>
                  {memberDetails.name && memberDetails.name !== company && (
                    <p className="mt-1 text-lg font-semibold text-slate-600">{memberDetails.name}</p>
                  )}
                  {memberDetails.role && (
                    <p className="mt-1 text-sm text-slate-500">{memberDetails.role}</p>
                  )}
                </>
              )}
              {websiteUrl && (
                <a
                  href={websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex items-center gap-2 rounded-full bg-burgundy px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-900"
                >
                  <span>Web Sitesi</span>
                  <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Body */}
        <div id="modal-description" className="p-6 sm:p-8">
          {loading ? (
            <div className="py-12 text-center">
              <div className="inline-block size-8 animate-spin rounded-full border-4 border-burgundy border-t-transparent" />
              <p className="mt-4 text-sm text-slate-600">Yükleniyor...</p>
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
          ) : (
            <div className="space-y-6">
              {/* Contact Info */}
              {(email || phone) && (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-700">İletişim Bilgileri</h3>
                  <div className="space-y-2">
                    {email && (
                      <div className="flex items-center gap-3">
                        <svg className="size-5 shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <a href={`mailto:${email}`} className="text-sm font-medium text-slate-700 hover:text-burgundy">
                          {email}
                        </a>
                      </div>
                    )}
                    {phone && (
                      <div className="flex items-center gap-3">
                        <svg className="size-5 shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <a href={`tel:${phone.replace(/\s/g, '')}`} className="text-sm font-medium text-slate-700 hover:text-burgundy">
                          {phone}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Documents */}
              {!isPartner && documents.length > 0 && (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-700">Belgeler</h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {documents.map((doc) => (
                      <div key={doc.id} className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm">
                        <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-burgundy/10">
                          <svg className="size-5 text-burgundy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-semibold text-slate-900">{getDocumentLabel(doc.kind)}</div>
                          {doc.filename && (
                            <div className="truncate text-xs text-slate-500">{doc.filename}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* QR Code Placeholder (Yapı Pasaportu) */}
              {!isPartner && documents.some((d) => d.kind === 'contractor_license') && (
                <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6 text-center">
                  <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-700">Yapı Pasaportu</h3>
                  <div className="mx-auto grid size-32 place-items-center rounded-xl bg-white shadow-lg ring-2 ring-slate-100">
                    <svg className="size-24 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                    </svg>
                  </div>
                  <p className="mt-4 text-xs text-slate-500">QR Kod yakında eklenecek</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
