import { API_BASE_URL } from '@/config/api';

export const MARKET_MODES = Object.freeze({
  LIVE: 'live', DELAYED: 'delayed', CACHED: 'cached', DEMO: 'demo',
  SIMULATED: 'simulated', STALE: 'stale', UNKNOWN: 'unknown'
});

export function normalizeMarketQuote(value) {
  if (!value || typeof value.symbol !== 'string' || !Number.isFinite(Number(value.price))) {
    throw new Error('Malformed market quote');
  }
  return {
    symbol: value.symbol,
    price: Number(value.price),
    change: Number(value.change || 0),
    changePct: Number(value.changePct || 0),
    timestamp: value.timestamp || null,
    fetchedAt: value.fetchedAt || new Date().toISOString(),
    source: value.source || 'unknown',
    mode: value.mode || MARKET_MODES.UNKNOWN,
    stale: Boolean(value.stale),
    delaySeconds: value.delaySeconds ?? null,
  };
}

export async function getMarketQuote(symbol = 'EUR/USD', signal) {
  const response = await fetch(`${API_BASE_URL}/api/market/quote?symbol=${encodeURIComponent(symbol)}`, { signal });
  const payload = await response.json().catch(() => null);
  if (!response.ok || !payload?.quote) throw new Error(payload?.error || 'Market data unavailable');
  return normalizeMarketQuote(payload.quote);
}

export function quoteAgeSeconds(quote, now = Date.now()) {
  const value = Date.parse(quote?.fetchedAt || quote?.timestamp || '');
  return Number.isFinite(value) ? Math.max(0, Math.floor((now - value) / 1000)) : null;
}
