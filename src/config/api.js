// Base URL configuration for FX Brain API
// In production, set VITE_API_URL in your hosting platform (Cloudflare Pages, Vercel, Netlify, etc.)
// e.g. VITE_API_URL=https://fxbrain-backend.onrender.com
const rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const API_BASE_URL = rawApiUrl.replace(/\/+$/, '');

export default API_BASE_URL;
