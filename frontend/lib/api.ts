export type AuthUser = { id: number; email: string; role: string; seoAccess?: boolean; canResetMemberPasswords?: boolean };

export type AuthMeResponse = {
  user: AuthUser;
  member: null | {
    id: number;
    name: string;
    email: string;
    company: string | null;
    role: string | null;
    profileImageUrl: string | null;
    websiteUrl?: string | null;
    joinDate: string;
    isApproved?: boolean;
  };
};

export type MembersListResponse = {
  items: Array<{
    id: number;
    name: string;
    email: string;
    company: string | null;
    role: string | null;
    profileImageUrl: string | null;
    websiteUrl?: string | null;
    joinDate: string;
    isApproved?: boolean;
    createdAt?: string;
  }>;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type PagedResponse<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type News = {
  id: number;
  title: string;
  excerpt: string | null;
  content: string;
  imageUrl: string | null;
  publishDate: string; // YYYY-MM-DD
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type Announcement = {
  id: number;
  code: string | null;
  title: string;
  excerpt: string | null;
  content: string;
  imageUrl: string | null;
  publishDate: string; // YYYY-MM-DD
  eventDate: string | null;
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type HeroSlide = {
  id: number;
  title: string;
  description: string | null;
  imageUrl: string | null;
  href: string | null;
  dateText: string | null;
  sortOrder: number;
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type HomeBanner = {
  id: number;
  title: string;
  imageUrl: string;
  href: string;
  sortOrder: number;
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type Video = {
  id: number;
  title: string;
  excerpt: string | null;
  thumbnailUrl: string | null;
  href: string | null;
  publishDate: string; // YYYY-MM-DD
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type Publication = {
  id: number;
  title: string;
  excerpt: string | null;
  coverImageUrl: string | null;
  fileUrl: string | null;
  publishDate: string; // YYYY-MM-DD
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type PageContent = {
  id: number;
  slug: string;
  heroTitle: string | null;
  heroSubtitle: string | null;
  aboutTitle: string | null;
  aboutParagraph1: string | null;
  aboutParagraph2: string | null;
  aboutPdfTitle?: string | null;
  aboutPdfUrl?: string | null;
  contactAddress?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  mapEmbedUrl?: string | null;
  quickInfo: string | null; // newline separated
  mission: string | null;
  vision: string | null;
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type Event = {
  id: number;
  title: string;
  dateText: string | null;
  eventDate: string | null; // YYYY-MM-DD
  location: string | null;
  color: string | null;
  sortOrder: number;
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type Partner = {
  id: number;
  title: string; // partner name
  logoText: string | null;
  logoUrl: string | null;
  websiteUrl: string | null;
  sortOrder: number;
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type Property = {
  id: number;
  title: string;
  address: string | null;
  price: string | null;
  description: string | null;
  imageUrl: string | null;
  propertyType: string | null;
  rooms: string | null;
  area: string | null;
  sortOrder: number;
  isPublished: boolean;
  memberId?: number | null;
  createdAt?: string;
  updatedAt?: string;
};

export type MemberDocument = {
  id: number;
  kind: string;
  filename: string | null;
  mimeType: string | null;
  sizeBytes: number;
  status: 'uploaded' | 'approved' | 'rejected' | 'resubmit_required';
  reviewerNote: string | null;
  createdAt?: string;
  updatedAt?: string;
};

function isBrowser() {
  return typeof window !== 'undefined';
}

export function getToken() {
  return isBrowser() ? window.localStorage.getItem('amd_token') : null;
}

export function setToken(token: string) {
  if (!isBrowser()) return;
  window.localStorage.setItem('amd_token', token);
}

export function clearToken() {
  if (!isBrowser()) return;
  window.localStorage.removeItem('amd_token');
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const firstValidationMsg =
      data && Array.isArray(data.errors) && data.errors.length ? String(data.errors[0]?.msg ?? '') : '';
    const msg =
      (data && (data.error || data.message)) ||
      (firstValidationMsg ? firstValidationMsg : null) ||
      `Request failed: ${res.status}`;
    throw new Error(msg);
  }
  return data as T;
}

export async function login(email: string, password: string) {
  return await apiFetch<{ token: string; user: AuthUser; member: any }>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function register(payload: {
  email: string;
  password: string;
  name: string;
  company?: string;
  role?: string;
  websiteUrl?: string;
  phoneCountryCode: string;
  phoneNumber: string;
  kvkkAccepted: boolean;
  termsAccepted: boolean;
}) {
  return await apiFetch<{ token: string; user: AuthUser; member: any }>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// --- Site Settings (sosyal medya) ---

export type SiteSettings = {
  facebookUrl: string | null;
  instagramUrl: string | null;
  twitterUrl: string | null;
  youtubeUrl: string | null;
  linkedinUrl: string | null;
  promoVideoUrl: string | null;
  promoVideoCoverUrl: string | null;
  maintenanceMode?: boolean;
};

export async function getSiteSettingsPublic() {
  return await apiFetch<SiteSettings>('/api/site-settings', { method: 'GET' });
}

export async function getSiteSettingsAdmin(token: string) {
  return await apiFetch<SiteSettings & { id: number | null }>('/api/site-settings/admin', {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function updateSiteSettingsAdmin(token: string, payload: Partial<SiteSettings>) {
  return await apiFetch<SiteSettings>('/api/site-settings/admin', {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

// --- Contact Message (public) ---

export async function createContactMessage(payload: { name: string; email: string; message: string }) {
  return await apiFetch<{ success: true; id: number }>('/api/contact-messages', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export type ContactMessage = {
  id: number;
  name: string;
  email: string;
  message: string;
  source: string | null;
  status: string | null;
  createdAt: string;
};

export async function listContactMessagesAdminAll(
  token: string,
  params?: { page?: number; limit?: number }
) {
  const qs = new URLSearchParams();
  if (params?.page) qs.set('page', String(params.page));
  if (params?.limit) qs.set('limit', String(params.limit));
  const url = `/api/contact-messages/admin/all${qs.toString() ? `?${qs.toString()}` : ''}`;
  return await apiFetch<{ items: ContactMessage[]; total: number; page: number; limit: number; totalPages: number }>(
    url,
    { method: 'GET', headers: { Authorization: `Bearer ${token}` } }
  );
}

// --- SMS Feedback (public) ---

export type SmsFeedback = {
  id: number;
  phoneE164: string;
  name: string | null;
  email: string | null;
  message: string;
  source: string | null;
  status: string | null;
  createdAt: string;
};

export async function listSmsFeedbackAdminAll(
  token: string,
  params?: { page?: number; limit?: number }
) {
  const qs = new URLSearchParams();
  if (params?.page) qs.set('page', String(params.page));
  if (params?.limit) qs.set('limit', String(params.limit));
  const url = `/api/sms-feedback/admin/all${qs.toString() ? `?${qs.toString()}` : ''}`;
  return await apiFetch<{ items: SmsFeedback[]; total: number; page: number; limit: number; totalPages: number }>(
    url,
    { method: 'GET', headers: { Authorization: `Bearer ${token}` } }
  );
}

export async function createSmsFeedback(payload: {
  phoneE164: string;
  message: string;
  name?: string;
  email?: string;
  source?: string;
}) {
  return await apiFetch<{ success: true; id: number }>('/api/sms-feedback', {
    method: 'POST',
    body: JSON.stringify({ ...payload, source: payload.source || 'web' }),
  });
}

export async function me(token: string) {
  return await apiFetch<AuthMeResponse>('/api/auth/me', {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function listMembersPublic(params?: { page?: number; limit?: number; search?: string; company?: string }) {
  const qs = new URLSearchParams();
  if (params?.page) qs.set('page', String(params.page));
  if (params?.limit) qs.set('limit', String(params.limit));
  if (params?.search) qs.set('search', params.search);
  if (params?.company) qs.set('company', params.company);
  const url = `/api/members${qs.toString() ? `?${qs.toString()}` : ''}`;
  return await apiFetch<MembersListResponse>(url, { method: 'GET' });
}

export async function listMembersAdminAll(token: string, params?: { page?: number; limit?: number }) {
  const qs = new URLSearchParams();
  if (params?.page) qs.set('page', String(params.page));
  if (params?.limit) qs.set('limit', String(params.limit));
  const url = `/api/members/admin/all${qs.toString() ? `?${qs.toString()}` : ''}`;
  return await apiFetch<MembersListResponse>(url, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function approveMember(token: string, memberId: number) {
  return await apiFetch(`/api/members/${memberId}/approve`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function setMemberPassword(token: string, memberId: number, newPassword: string) {
  return await apiFetch(`/api/members/${memberId}/set-password`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ newPassword: newPassword.trim() }),
  });
}

export async function updateMyMember(
  token: string,
  updates: { name?: string; company?: string | null; role?: string | null; profileImageUrl?: string | null; websiteUrl?: string | null }
) {
  return await apiFetch('/api/members/me', {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(updates),
  });
}

// --- Member Documents ---

export async function listMyDocuments(token: string) {
  return await apiFetch<{
    requiredKinds: string[];
    verificationStatus: string;
    verificationNote: string | null;
    items: MemberDocument[];
  }>('/api/members/me/documents', {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function uploadMyDocument(token: string, payload: { kind: string; filename: string; mimeType: string; base64: string }) {
  return await apiFetch<{ id: number; kind: string; status: string }>('/api/members/me/documents', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

function parseFilenameFromContentDisposition(cd: string | null): string | null {
  if (!cd) return null;
  const mStar = cd.match(/filename\*\s*=\s*UTF-8''([^;]+)/i);
  if (mStar && mStar[1]) {
    try {
      return decodeURIComponent(mStar[1].trim().replace(/^"(.*)"$/, '$1'));
    } catch {
      return mStar[1].trim().replace(/^"(.*)"$/, '$1');
    }
  }
  const m = cd.match(/filename\s*=\s*("?)([^"]+)\1/i);
  if (m && m[2]) return m[2].trim();
  return null;
}

async function apiFetchBlob(path: string, token: string): Promise<{ blob: Blob; filename: string; mimeType: string }> {
  const res = await fetch(path, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({} as any));
    const firstValidationMsg =
      data && Array.isArray(data.errors) && data.errors.length ? String(data.errors[0]?.msg ?? '') : '';
    const msg =
      (data && (data.error || data.message)) ||
      (firstValidationMsg ? firstValidationMsg : null) ||
      `Request failed: ${res.status}`;
    throw new Error(msg);
  }

  const blob = await res.blob();
  const mimeType = res.headers.get('content-type') || blob.type || 'application/octet-stream';
  const filename = parseFilenameFromContentDisposition(res.headers.get('content-disposition')) || 'document';
  return { blob, filename, mimeType };
}

export async function getMemberDocumentBlob(token: string, docId: number) {
  return await apiFetchBlob(`/api/members/documents/${docId}/download`, token);
}

export async function getMemberPublic(memberId: number) {
  return await apiFetch<{
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
  }>(`/api/members/${memberId}`);
}

export async function listMemberDocumentsPublic(memberId: number) {
  return await apiFetch<{
    items: Array<{
      id: number;
      kind: string;
      filename: string | null;
      mimeType: string | null;
      sizeBytes: number;
      createdAt?: string;
      updatedAt?: string;
    }>;
  }>(`/api/members/${memberId}/documents/public`);
}

export async function listMemberDocumentsAdmin(token: string, memberId: number) {
  return await apiFetch<{
    member: { id: number; name: string; email: string; isApproved: boolean; verificationStatus: string; verificationNote: string | null };
    requiredKinds: string[];
    items: MemberDocument[];
  }>(`/api/members/${memberId}/documents`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function reviewMemberDocumentAdmin(
  token: string,
  memberId: number,
  docId: number,
  payload: { status: 'approved' | 'rejected' | 'resubmit_required'; reviewerNote?: string }
) {
  return await apiFetch<{ success: true }>(`/api/members/${memberId}/documents/${docId}/review`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

export async function requestMemberResubmission(token: string, memberId: number, verificationNote?: string) {
  return await apiFetch(`/api/members/${memberId}/request-resubmission`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ verificationNote }),
  });
}

export async function rejectMember(token: string, memberId: number, verificationNote?: string) {
  return await apiFetch(`/api/members/${memberId}/reject`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ verificationNote }),
  });
}

export async function deleteMember(token: string, memberId: number) {
  return await apiFetch(`/api/members/${memberId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
}

// --- Content (public) ---

export async function listSlidesPublic(params?: { limit?: number }) {
  const qs = new URLSearchParams();
  if (params?.limit) qs.set('limit', String(params.limit));
  return await apiFetch<HeroSlide[]>(`/api/slides${qs.toString() ? `?${qs.toString()}` : ''}`, { method: 'GET' });
}

export async function listBannersPublic(params?: { limit?: number }) {
  const qs = new URLSearchParams();
  if (params?.limit) qs.set('limit', String(params.limit));
  return await apiFetch<HomeBanner[]>(`/api/banners${qs.toString() ? `?${qs.toString()}` : ''}`, { method: 'GET' });
}

export async function listNewsPublic(params?: { page?: number; limit?: number }) {
  const qs = new URLSearchParams();
  if (params?.page) qs.set('page', String(params.page));
  if (params?.limit) qs.set('limit', String(params.limit));
  return await apiFetch<PagedResponse<News>>(`/api/news${qs.toString() ? `?${qs.toString()}` : ''}`, { method: 'GET' });
}

export async function listNewsSlider() {
  return await apiFetch<News[]>('/api/news/slider', { method: 'GET' });
}

export async function listAnnouncementsPublic(params?: { page?: number; limit?: number }) {
  const qs = new URLSearchParams();
  if (params?.page) qs.set('page', String(params.page));
  if (params?.limit) qs.set('limit', String(params.limit));
  return await apiFetch<PagedResponse<Announcement>>(
    `/api/announcements${qs.toString() ? `?${qs.toString()}` : ''}`,
    { method: 'GET' }
  );
}

export async function listAnnouncementsRecent() {
  return await apiFetch<Announcement[]>('/api/announcements/recent', { method: 'GET' });
}

export async function getAnnouncementPublic(id: number) {
  return await apiFetch<Announcement>(`/api/announcements/${id}`, { method: 'GET' });
}

export async function listVideosPublic(params?: { page?: number; limit?: number }) {
  const qs = new URLSearchParams();
  if (params?.page) qs.set('page', String(params.page));
  if (params?.limit) qs.set('limit', String(params.limit));
  return await apiFetch<PagedResponse<Video>>(`/api/videos${qs.toString() ? `?${qs.toString()}` : ''}`, { method: 'GET' });
}

export async function getVideoPublic(id: number) {
  return await apiFetch<Video>(`/api/videos/${id}`, { method: 'GET' });
}

export async function listVideosRecent(params?: { limit?: number }) {
  const qs = new URLSearchParams();
  if (params?.limit) qs.set('limit', String(params.limit));
  return await apiFetch<Video[]>(`/api/videos/recent${qs.toString() ? `?${qs.toString()}` : ''}`, { method: 'GET' });
}

export async function listPublicationsPublic(params?: { page?: number; limit?: number }) {
  const qs = new URLSearchParams();
  if (params?.page) qs.set('page', String(params.page));
  if (params?.limit) qs.set('limit', String(params.limit));
  return await apiFetch<PagedResponse<Publication>>(
    `/api/publications${qs.toString() ? `?${qs.toString()}` : ''}`,
    { method: 'GET' }
  );
}

export async function listPublicationsRecent(params?: { limit?: number }) {
  const qs = new URLSearchParams();
  if (params?.limit) qs.set('limit', String(params.limit));
  return await apiFetch<Publication[]>(
    `/api/publications/recent${qs.toString() ? `?${qs.toString()}` : ''}`,
    { method: 'GET' }
  );
}

// --- Board Roles (Yönetim Kurulu kategorileri) ---

export type BoardRole = {
  id: number;
  label: string;
  sortOrder: number;
  dutyPattern?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export async function listBoardRolesPublic() {
  return await apiFetch<BoardRole[]>('/api/board-roles', { method: 'GET' });
}

export async function listBoardRolesAdminAll(token: string) {
  const res = await apiFetch<{ items: BoardRole[] }>('/api/board-roles/admin/all', {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.items || [];
}

export async function createBoardRole(token: string, payload: { label: string; sortOrder?: number; dutyPattern?: string | null }) {
  return await apiFetch<BoardRole>('/api/board-roles', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

export async function updateBoardRole(token: string, id: number, payload: Partial<BoardRole>) {
  return await apiFetch<BoardRole>(`/api/board-roles/${id}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

export async function deleteBoardRole(token: string, id: number) {
  return await apiFetch<{ success: true }>(`/api/board-roles/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
}

// --- Board Members (Yönetim Kurulu piramit) ---

export type BoardMember = {
  id: number;
  name: string;
  unit: string | null;
  profession: string | null;
  duty: string | null;
  residenceAddress: string | null;
  imageUrl: string | null;
  role?: string | null;
  boardRoleId?: number | null;
  roleLabel?: string;
  roleSortOrder?: number;
  sortOrder: number;
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export async function listBoardMembersPublic() {
  return await apiFetch<BoardMember[]>('/api/board-members', { method: 'GET' });
}

export async function listBoardMembersAdminAll(token: string, params?: { page?: number; limit?: number }) {
  const qs = new URLSearchParams();
  if (params?.page) qs.set('page', String(params.page));
  if (params?.limit) qs.set('limit', String(params.limit));
  const url = `/api/board-members/admin/all${qs.toString() ? `?${qs.toString()}` : ''}`;
  return await apiFetch<{ items: BoardMember[]; total: number; page: number; limit: number; totalPages: number }>(url, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function createBoardMember(token: string, payload: Partial<BoardMember> & { name: string }) {
  return await apiFetch<BoardMember>('/api/board-members', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

export async function updateBoardMember(token: string, id: number, payload: Partial<BoardMember>) {
  return await apiFetch<BoardMember>(`/api/board-members/${id}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

export async function deleteBoardMember(token: string, id: number) {
  return await apiFetch<{ success: true }>(`/api/board-members/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function listPropertiesPublic(params?: { page?: number; limit?: number }) {
  const qs = new URLSearchParams();
  if (params?.page) qs.set('page', String(params.page));
  if (params?.limit) qs.set('limit', String(params.limit));
  return await apiFetch<PagedResponse<Property>>(
    `/api/properties${qs.toString() ? `?${qs.toString()}` : ''}`,
    { method: 'GET' }
  );
}

export async function getPropertyPublic(id: number) {
  return await apiFetch<Property>(`/api/properties/${id}`, { method: 'GET' });
}

export async function listMyProperties(token: string) {
  return await apiFetch<{ items: Property[] }>('/api/properties/member/mine', {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function createMyProperty(token: string, payload: Partial<Property> & { title: string }) {
  return await apiFetch<Property>('/api/properties/member', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

export async function updateMyProperty(token: string, id: number, payload: Partial<Property>) {
  return await apiFetch<Property>(`/api/properties/member/${id}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

export async function deleteMyProperty(token: string, id: number) {
  return await apiFetch<{ success: true }>(`/api/properties/member/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
}

// --- Content (admin) ---

export async function listSlidesAdminAll(token: string, params?: { page?: number; limit?: number }) {
  const qs = new URLSearchParams();
  if (params?.page) qs.set('page', String(params.page));
  if (params?.limit) qs.set('limit', String(params.limit));
  return await apiFetch<PagedResponse<HeroSlide>>(`/api/slides/admin/all${qs.toString() ? `?${qs.toString()}` : ''}`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function listBannersAdminAll(token: string, params?: { page?: number; limit?: number }) {
  const qs = new URLSearchParams();
  if (params?.page) qs.set('page', String(params.page));
  if (params?.limit) qs.set('limit', String(params.limit));
  return await apiFetch<PagedResponse<HomeBanner>>(`/api/banners/admin/all${qs.toString() ? `?${qs.toString()}` : ''}`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function createBanner(token: string, payload: Partial<HomeBanner> & { title: string; imageUrl: string; href: string }) {
  return await apiFetch<HomeBanner>('/api/banners', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

export async function updateBanner(token: string, id: number, payload: Partial<HomeBanner>) {
  return await apiFetch<HomeBanner>(`/api/banners/${id}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

export async function deleteBanner(token: string, id: number) {
  return await apiFetch<{ success: true }>(`/api/banners/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function createSlide(token: string, payload: Partial<HeroSlide> & { title: string }) {
  return await apiFetch<HeroSlide>('/api/slides', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

export async function updateSlide(token: string, id: number, payload: Partial<HeroSlide>) {
  return await apiFetch<HeroSlide>(`/api/slides/${id}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

export async function deleteSlide(token: string, id: number) {
  return await apiFetch<{ success: true }>(`/api/slides/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function listNewsAdminAll(token: string, params?: { page?: number; limit?: number }) {
  const qs = new URLSearchParams();
  if (params?.page) qs.set('page', String(params.page));
  if (params?.limit) qs.set('limit', String(params.limit));
  return await apiFetch<PagedResponse<News>>(`/api/news/admin/all${qs.toString() ? `?${qs.toString()}` : ''}`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function createNews(token: string, payload: Partial<News> & { title: string; content: string }) {
  return await apiFetch<News>('/api/news', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

export async function updateNews(token: string, id: number, payload: Partial<News>) {
  return await apiFetch<News>(`/api/news/${id}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

export async function deleteNews(token: string, id: number) {
  return await apiFetch<{ success: true }>(`/api/news/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function listAnnouncementsAdminAll(token: string, params?: { page?: number; limit?: number }) {
  const qs = new URLSearchParams();
  if (params?.page) qs.set('page', String(params.page));
  if (params?.limit) qs.set('limit', String(params.limit));
  return await apiFetch<PagedResponse<Announcement>>(
    `/api/announcements/admin/all${qs.toString() ? `?${qs.toString()}` : ''}`,
    {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    }
  );
}

export async function createAnnouncement(token: string, payload: Partial<Announcement> & { title: string; content: string }) {
  return await apiFetch<Announcement>('/api/announcements', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

export async function updateAnnouncement(token: string, id: number, payload: Partial<Announcement>) {
  return await apiFetch<Announcement>(`/api/announcements/${id}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

export async function deleteAnnouncement(token: string, id: number) {
  return await apiFetch<{ success: true }>(`/api/announcements/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function listVideosAdminAll(token: string, params?: { page?: number; limit?: number }) {
  const qs = new URLSearchParams();
  if (params?.page) qs.set('page', String(params.page));
  if (params?.limit) qs.set('limit', String(params.limit));
  return await apiFetch<PagedResponse<Video>>(`/api/videos/admin/all${qs.toString() ? `?${qs.toString()}` : ''}`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function createVideo(token: string, payload: Partial<Video> & { title: string }) {
  return await apiFetch<Video>('/api/videos', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

export async function updateVideo(token: string, id: number, payload: Partial<Video>) {
  return await apiFetch<Video>(`/api/videos/${id}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

export async function deleteVideo(token: string, id: number) {
  return await apiFetch<{ success: true }>(`/api/videos/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function listPublicationsAdminAll(token: string, params?: { page?: number; limit?: number }) {
  const qs = new URLSearchParams();
  if (params?.page) qs.set('page', String(params.page));
  if (params?.limit) qs.set('limit', String(params.limit));
  return await apiFetch<PagedResponse<Publication>>(
    `/api/publications/admin/all${qs.toString() ? `?${qs.toString()}` : ''}`,
    {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    }
  );
}

export async function createPublication(token: string, payload: Partial<Publication> & { title: string }) {
  return await apiFetch<Publication>('/api/publications', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

export async function updatePublication(token: string, id: number, payload: Partial<Publication>) {
  return await apiFetch<Publication>(`/api/publications/${id}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

export async function deletePublication(token: string, id: number) {
  return await apiFetch<{ success: true }>(`/api/publications/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function listPropertiesAdminAll(token: string, params?: { page?: number; limit?: number }) {
  const qs = new URLSearchParams();
  if (params?.page) qs.set('page', String(params.page));
  if (params?.limit) qs.set('limit', String(params.limit));
  return await apiFetch<PagedResponse<Property>>(
    `/api/properties/admin/all${qs.toString() ? `?${qs.toString()}` : ''}`,
    { method: 'GET', headers: { Authorization: `Bearer ${token}` } }
  );
}

export async function createProperty(token: string, payload: Partial<Property> & { title: string }) {
  return await apiFetch<Property>('/api/properties', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

export async function updateProperty(token: string, id: number, payload: Partial<Property>) {
  return await apiFetch<Property>(`/api/properties/${id}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

export async function deleteProperty(token: string, id: number) {
  return await apiFetch<{ success: true }>(`/api/properties/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
}

// --- Pages (Kurumsal etc.) ---

export async function getPagePublic(slug: string) {
  return await apiFetch<PageContent>(`/api/pages/${encodeURIComponent(slug)}`, { method: 'GET' });
}

export async function getPageAdmin(token: string, slug: string) {
  return await apiFetch<PageContent | null>(`/api/pages/admin/${encodeURIComponent(slug)}`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function upsertPageAdmin(token: string, slug: string, payload: Partial<PageContent>) {
  return await apiFetch<PageContent>(`/api/pages/admin/${encodeURIComponent(slug)}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

export async function listEventsUpcoming(params?: { limit?: number }) {
  const qs = new URLSearchParams();
  if (params?.limit) qs.set('limit', String(params.limit));
  return await apiFetch<Event[]>(`/api/events/upcoming${qs.toString() ? `?${qs.toString()}` : ''}`, { method: 'GET' });
}

export async function listEventsPublic(params?: { page?: number; limit?: number }) {
  const qs = new URLSearchParams();
  if (params?.page) qs.set('page', String(params.page));
  if (params?.limit) qs.set('limit', String(params.limit));
  return await apiFetch<PagedResponse<Event>>(`/api/events${qs.toString() ? `?${qs.toString()}` : ''}`, { method: 'GET' });
}

export async function listEventsAdminAll(token: string, params?: { page?: number; limit?: number }) {
  const qs = new URLSearchParams();
  if (params?.page) qs.set('page', String(params.page));
  if (params?.limit) qs.set('limit', String(params.limit));
  return await apiFetch<PagedResponse<Event>>(`/api/events/admin/all${qs.toString() ? `?${qs.toString()}` : ''}`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function createEvent(token: string, payload: Partial<Event> & { title: string }) {
  return await apiFetch<Event>('/api/events', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

export async function updateEvent(token: string, id: number, payload: Partial<Event>) {
  return await apiFetch<Event>(`/api/events/${id}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

export async function deleteEvent(token: string, id: number) {
  return await apiFetch<{ success: true }>(`/api/events/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function listPartnersPublic(params?: { limit?: number }) {
  const qs = new URLSearchParams();
  if (params?.limit) qs.set('limit', String(params.limit));
  return await apiFetch<Partner[]>(`/api/partners${qs.toString() ? `?${qs.toString()}` : ''}`, { method: 'GET' });
}

export async function listPartnersAdminAll(token: string, params?: { page?: number; limit?: number }) {
  const qs = new URLSearchParams();
  if (params?.page) qs.set('page', String(params.page));
  if (params?.limit) qs.set('limit', String(params.limit));
  return await apiFetch<PagedResponse<Partner>>(`/api/partners/admin/all${qs.toString() ? `?${qs.toString()}` : ''}`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function createPartner(token: string, payload: Partial<Partner> & { title: string }) {
  return await apiFetch<Partner>('/api/partners', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

export async function updatePartner(token: string, id: number, payload: Partial<Partner>) {
  return await apiFetch<Partner>(`/api/partners/${id}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

export async function deletePartner(token: string, id: number) {
  return await apiFetch<{ success: true }>(`/api/partners/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
}

