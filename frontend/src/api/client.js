import axios from 'axios';

// ── Backend health check ──────────────────────────────────────────────────────

let _backendOnline = null; // null = unknown, true/false = checked

export async function checkBackend() {
  if (_backendOnline !== null) return _backendOnline;
  try {
    const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
    await axios.get(`${base}/health`, { timeout: 3000 });
    _backendOnline = true;
  } catch {
    _backendOnline = false;
  }
  return _backendOnline;
}

export function isBackendOnline() {
  return _backendOnline;
}

export function setBackendOnline(val) {
  _backendOnline = val;
}

// ── Axios client ──────────────────────────────────────────────────────────────

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000',
  headers: { 'Content-Type': 'application/json' },
  timeout: 8000,
});

// Request interceptor: attach Bearer token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: handle 401
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
