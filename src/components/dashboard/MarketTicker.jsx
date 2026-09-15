import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { RefreshCw } from 'lucide-react';
import { getMarketQuote, isQuoteStale, quoteAgeSeconds } from '@/services/market/marketDataService';

export default function MarketTicker() {
  const { data: quote, isLoading, isError, refetch, isFetching } = useQuery({ queryKey: ['market-quote', 'EUR/USD'], queryFn: ({ signal }) => getMarketQuote('EUR/USD', signal), refetchInterval: 60000, staleTime: 30000 });
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => { const interval = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(interval); }, []);
  const age = quoteAgeSeconds(quote, now);
  const stale = isQuoteStale(quote, now);
  const positive = (quote?.changePct || 0) >= 0;
  return <section dir="ltr" aria-label="Market data" className="border-y border-slate-800 bg-slate-950 px-4 py-2 text-xs text-slate-300">
    <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-5 gap-y-2 font-mono">
      <span className="font-semibold tracking-wide text-slate-100">EUR/USD</span>
      {isLoading ? <span className="text-slate-500">Loading market data…</span> : isError ? <span className="text-amber-400">Market data unavailable</span> : <>
        <span className="text-base font-semibold tabular-nums text-white">{quote.price.toFixed(5)}</span>
        <span className={positive ? 'text-emerald-400' : 'text-rose-400'}>{positive ? '+' : ''}{quote.changePct.toFixed(2)}%</span>
        <span className={`rounded px-1.5 py-0.5 text-[10px] uppercase ${stale ? 'bg-amber-500/15 text-amber-300' : quote.mode === 'live' ? 'bg-emerald-500/15 text-emerald-300' : 'bg-slate-700 text-slate-300'}`}>{stale ? 'STALE' : quote.mode}</span>
        <span className="text-slate-500">Source: {quote.source} · {stale ? 'Last quote' : 'Updated'}: {age == null ? 'unknown' : age < 60 ? `${age}s ago` : `${Math.floor(age / 60)}m ago`}</span>
      </>}
      <button type="button" onClick={() => refetch()} disabled={isFetching} aria-label="Refresh market data" className="ml-auto rounded p-1 text-slate-500 hover:bg-slate-800 hover:text-slate-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-400"><RefreshCw className={`h-3.5 w-3.5 ${isFetching ? 'animate-spin' : ''}`} /></button>
    </div>
  </section>;
}
