const IS_SERVER = typeof window === 'undefined';

export const API_URL = IS_SERVER ? 'http://localhost:3001' : '/api';

interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
}

export async function apiFetch<T = any>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const url = `${API_URL}${endpoint}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.message || `Erro HTTP: ${response.status}`);
  }

  const contentLength = response.headers.get('Content-Length');
  if (contentLength === '0') return {} as T;

  return response.json();
}