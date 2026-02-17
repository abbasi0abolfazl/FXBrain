import React, { useEffect, useRef } from 'react';

export default function TradingViewChart({ symbol = 'EURUSD', theme = 'dark', height = 500 }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear previous widget
    containerRef.current.innerHTML = '';

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: `FX:${symbol}`,
      interval: 'D',
      timezone: 'Asia/Tehran',
      theme: theme,
      style: '1',
      locale: 'fa_IR',
      enable_publishing: false,
      allow_symbol_change: true,
      calendar: true,
      support_host: 'https://www.tradingview.com',
      hide_top_toolbar: false,
      hide_legend: false,
      save_image: true,
      studies: [
        'RSI@tv-basicstudies',
        'MASimple@tv-basicstudies',
        'MACD@tv-basicstudies'
      ],
    });

    containerRef.current.appendChild(script);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [symbol, theme]);

  return (
    <div className="tradingview-widget-container rounded-2xl overflow-hidden border border-slate-700/50" style={{ height }}>
      <div ref={containerRef} style={{ height: '100%', width: '100%' }} className="tradingview-widget-container__widget" />
    </div>
  );
}