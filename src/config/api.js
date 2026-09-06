// Base URL configuration for FX Brain API
// If VITE_API_URL is provided, use it (e.g. for external backend hosting on Hugging Face / Render / VPS)
// If VITE_API_URL is not set:
// - In local dev (localhost), fallback to http://localhost:8000
// - In production on same domain (e.g. Vercel), fallback to '' (relative path /api)
const rawApiUrl = import.meta.env.VITE_API_URL !== undefined
  ? import.meta.env.VITE_API_URL
  : (typeof window !== 'undefined' && window.location.hostname === 'localhost' ? 'http://localhost:8000' : '');

export const API_BASE_URL = rawApiUrl.replace(/\/+$/, '');

export default API_BASE_URL;
