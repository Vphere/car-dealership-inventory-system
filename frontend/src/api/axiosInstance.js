import axios from 'axios';
import { tokenStore } from '../utils/tokenStore';

// Routes that must NOT receive an Authorization header — the backend
// permits these without a token, and sending a stale one is harmless but
// pointless. Kept explicit so it's obvious at a glance which routes are public.
const PUBLIC_ROUTES = ['/auth/register', '/auth/login'];

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

axiosInstance.interceptors.request.use((config) => {
  const isPublic = PUBLIC_ROUTES.some((route) => config.url?.includes(route));
  if (!isPublic) {
    const token = tokenStore.get();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // A 401 means the token is missing/expired/invalid — there's no
    // recovering from that client-side, so clear state and send the
    // person back to sign in rather than showing a broken dashboard.
    if (error.response?.status === 401) {
      tokenStore.clear();
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
