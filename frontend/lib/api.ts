export type AuthUser = { id: number; email: string; role: string };

export type AuthMeResponse = {
  user: AuthUser;
  member: null | {
    id: number;
    name: string;
    email: string;
    company: string | null;
    role: string | null;
    profileImageUrl: string | null;
    joinDate: string;
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
}) {
  return await apiFetch<{ token: string; user: AuthUser; member: any }>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
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

export async function updateMyMember(
  token: string,
  updates: { name?: string; company?: string | null; role?: string | null; profileImageUrl?: string | null }
) {
  return await apiFetch('/api/members/me', {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(updates),
  });
}

// --- Content (public) ---

export async function listSlidesPublic(params?: { limit?: number }) {
  const qs = new URLSearchParams();
  if (params?.limit) qs.set('limit', String(params.limit));
  return await apiFetch<HeroSlide[]>(`/api/slides${qs.toString() ? `?${qs.toString()}` : ''}`, { method: 'GET' });
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

export async function listVideosPublic(params?: { page?: number; limit?: number }) {
  const qs = new URLSearchParams();
  if (params?.page) qs.set('page', String(params.page));
  if (params?.limit) qs.set('limit', String(params.limit));
  return await apiFetch<PagedResponse<Video>>(`/api/videos${qs.toString() ? `?${qs.toString()}` : ''}`, { method: 'GET' });
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

