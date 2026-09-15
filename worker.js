export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/api/market/quote') {
      return marketQuote(request, env, url);
    }
    return env.ASSETS.fetch(request);
  },
};

const CACHE_TTL = 60;

async function marketQuote(request, env, url) {
  const symbol = url.searchParams.get('symbol') || 'EUR/USD';
  if (symbol.toUpperCase() !== 'EUR/USD') {
    return json({ error: 'Only EUR/USD is enabled in this vertical slice.' }, 400);
  }
  const cacheKey = new Request(`${url.origin}/api/market/quote?symbol=EUR%2FUSD`);
  const cache = caches.default;
  const cached = await cache.match(cacheKey);
  if (cached) return cached;
  if (!env.TWELVE_DATA_API_KEY) return json({ error: 'Market provider is not configured.' }, 503);

  try {
    const providerUrl = new URL('https://api.twelvedata.com/quote');
    providerUrl.searchParams.set('symbol', 'EUR/USD');
    providerUrl.searchParams.set('apikey', env.TWELVE_DATA_API_KEY);
    const response = await fetch(providerUrl, { signal: AbortSignal.timeout(8000) });
    if (!response.ok) throw new Error(`Provider HTTP ${response.status}`);
    const data = await response.json();
    if (data.status === 'error' || !Number.isFinite(Number(data.close))) throw new Error(data.message || 'Malformed provider response');
    const price = Number(data.close);
    const previous = Number(data.previous_close);
    const change = Number.isFinite(previous) ? price - previous : 0;
    const quote = { symbol: 'EUR/USD', price, change, changePct: Number.isFinite(previous) && previous ? (change / previous) * 100 : 0, timestamp: data.datetime ? new Date(data.datetime).toISOString() : new Date().toISOString(), fetchedAt: new Date().toISOString(), source: 'twelve-data', mode: 'live', stale: false, delaySeconds: null };
    const result = new Response(JSON.stringify({ quote }), { headers: { 'content-type': 'application/json', 'cache-control': `public, max-age=${CACHE_TTL}` } });
    await cache.put(cacheKey, result.clone());
    return result;
  } catch (error) {
    return json({ error: 'Market provider unavailable.', detail: error.message }, 503);
  }
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });
}
