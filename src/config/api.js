// FX Brain API Configuration
// If VITE_API_URL is provided, the app connects to the external backend.
// If VITE_API_URL is not set (default), it runs in standalone mode using the in-browser mock engine.
const externalApiUrl = import.meta.env.VITE_API_URL;

export const USE_MOCK_API = !externalApiUrl;
export const API_BASE_URL = externalApiUrl ? externalApiUrl.replace(/\/+$/, '') : '';

export default API_BASE_URL;
