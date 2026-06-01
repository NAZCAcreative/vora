const API_BASE = process.env.NEXT_PUBLIC_BKEND_API_URL || 'https://api.bkend.ai/v1';
const PROJECT_ID = process.env.NEXT_PUBLIC_BKEND_PROJECT_ID!;
const ENVIRONMENT = process.env.NEXT_PUBLIC_BKEND_ENV || 'dev';

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('bkend_access_token') : null;

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'x-project-id': PROJECT_ID,
      'x-environment': ENVIRONMENT,
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || `HTTP ${res.status}`);
  }

  return res.json();
}

export const api = {
  auth: {
    signup:  (body: { email: string; password: string; name: string; nativeLanguage: string; koreanLevel: string }) =>
      apiFetch('/auth/email/signup', { method: 'POST', body: JSON.stringify(body) }),
    signin:  (body: { email: string; password: string }) =>
      apiFetch('/auth/email/signin', { method: 'POST', body: JSON.stringify(body) }),
    me:      () => apiFetch('/auth/me'),
    refresh: (refreshToken: string) =>
      apiFetch('/auth/refresh', { method: 'POST', body: JSON.stringify({ refreshToken }) }),
    signout: () => apiFetch('/auth/signout', { method: 'POST' }),
  },

  courses: {
    list:   (params?: Record<string, string>) =>
      apiFetch(`/data/courses?${new URLSearchParams(params)}`),
    get:    (id: string) => apiFetch(`/data/courses/${id}`),
    create: (body: unknown) =>
      apiFetch('/data/courses', { method: 'POST', body: JSON.stringify(body) }),
    update: (id: string, body: unknown) =>
      apiFetch(`/data/courses/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
    delete: (id: string) =>
      apiFetch(`/data/courses/${id}`, { method: 'DELETE' }),
  },

  lessons: {
    list:   (courseId: string) => apiFetch(`/data/lessons?courseId=${courseId}`),
    get:    (id: string) => apiFetch(`/data/lessons/${id}`),
    create: (body: unknown) =>
      apiFetch('/data/lessons', { method: 'POST', body: JSON.stringify(body) }),
    update: (id: string, body: unknown) =>
      apiFetch(`/data/lessons/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  },

  vocabulary: {
    list:   (params?: Record<string, string>) =>
      apiFetch(`/data/vocabulary?${new URLSearchParams(params)}`),
    get:    (id: string) => apiFetch(`/data/vocabulary/${id}`),
    create: (body: unknown) =>
      apiFetch('/data/vocabulary', { method: 'POST', body: JSON.stringify(body) }),
  },

  progress: {
    get:    (courseId: string) => apiFetch(`/data/progress?courseId=${courseId}`),
    upsert: (body: unknown) =>
      apiFetch('/data/progress', { method: 'POST', body: JSON.stringify(body) }),
  },

  community: {
    posts: {
      list:   (params?: Record<string, string>) =>
        apiFetch(`/data/posts?${new URLSearchParams(params)}`),
      get:    (id: string) => apiFetch(`/data/posts/${id}`),
      create: (body: unknown) =>
        apiFetch('/data/posts', { method: 'POST', body: JSON.stringify(body) }),
      update: (id: string, body: unknown) =>
        apiFetch(`/data/posts/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
      delete: (id: string) =>
        apiFetch(`/data/posts/${id}`, { method: 'DELETE' }),
    },
    comments: {
      list:   (postId: string) => apiFetch(`/data/comments?postId=${postId}`),
      create: (body: unknown) =>
        apiFetch('/data/comments', { method: 'POST', body: JSON.stringify(body) }),
      delete: (id: string) =>
        apiFetch(`/data/comments/${id}`, { method: 'DELETE' }),
    },
  },
};
