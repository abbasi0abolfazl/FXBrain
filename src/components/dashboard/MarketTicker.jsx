import React, { useState, useEffect, useMemo } from 'react';

// لیست جامع و متنوع بازارهای مالی (بدون ایموجی و بدون آیکون)
export const marketData = [
  // جفت‌ارزهای اصلی فارکس
  { pair: 'EUR/USD', name: 'یورو / دلار', price: 1.0852, change: 0.15, precision: 4 },
  { pair: 'GBP/USD', name: 'پوند / دلار', price: 1.2648, change: -0.22, precision: 4 },
  { pair: 'USD/JPY', name: 'دلار / ین ژاپن', price: 151.42, change: 0.35, precision: 2 },
  { pair: 'USD/CHF', name: 'دلار / فرانک', price: 0.8845, change: -0.12, precision: 4 },
  { pair: 'AUD/USD', name: 'دلار استرالیا / دلار', price: 0.6585, change: 0.28, precision: 4 },
  { pair: 'USD/CAD', name: 'دلار / دلار کانادا', price: 1.3520, change: -0.18, precision: 4 },
  { pair: 'NZD/USD', name: 'دلار نیوزیلند / دلار', price: 0.6120, change: 0.14, precision: 4 },

  // جفت‌ارزهای کراس
  { pair: 'EUR/GBP', name: 'یورو / پوند', price: 0.8580, change: 0.32, precision: 4 },
  { pair: 'EUR/JPY', name: 'یورو / ین ژاپن', price: 164.35, change: 0.48, precision: 2 },
  { pair: 'GBP/JPY', name: 'پوند / ین ژاپن', price: 191.50, change: 0.12, precision: 2 },

  // کالاها و فلزات گرانبها
  { pair: 'XAU/USD', name: 'طلای جهانی', price: 2165.40, change: 0.65, precision: 2 },
  { pair: 'XAG/USD', name: 'نقره جهانی', price: 24.85, change: 1.12, precision: 2 },
  { pair: 'BRENT', name: 'نفت برنت', price: 83.45, change: -0.75, precision: 2 },
  { pair: 'WTI', name: 'نفت تگزاس', price: 79.20, change: -0.62, precision: 2 },

  // ارزهای دیجیتال
  { pair: 'BTC/USD', name: 'بیت‌کوین', price: 67420, change: 2.85, precision: 2 },
  { pair: 'ETH/USD', name: 'اتریوم', price: 3580.50, change: 3.42, precision: 2 },
  { pair: 'SOL/USD', name: 'سولانا', price: 148.60, change: 5.18, precision: 2 },

  // شاخص‌های مالی
  { pair: 'DXY', name: 'شاخص دلار', price: 103.85, change: 0.08, precision: 2 },
  { pair: 'US500', name: 'اس‌اندپی ۵۰۰', price: 5120.30, change: 0.45, precision: 2 },
  { pair: 'NAS100', name: 'نزدک ۱۰۰', price: 18150.80, change: 0.72, precision: 2 },
];

export default function MarketTicker() {
  const [data, setData] = useState(marketData);

  // شبیه‌سازی تیک زنده قیمت‌ها به سبک تیکر اخبار وال‌استریت و بلومبرگ
  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => {
        const countToUpdate = Math.floor(Math.random() * 2) + 2;
        const indicesToUpdate = new Set();
        while (indicesToUpdate.size < Math.min(countToUpdate, prev.length)) {
          indicesToUpdate.add(Math.floor(Math.random() * prev.length));
        }

        const now = Date.now();
        return prev.map((item, idx) => {
          if (!indicesToUpdate.has(idx)) return item;

          const isUp = Math.random() > 0.48;
          const deltaSign = isUp ? 1 : -1;
          const volatility = item.pair.includes('BTC') || item.pair.includes('ETH') || item.pair.includes('SOL')
            ? 0.0008
            : item.pair.includes('XAU') || item.pair.includes('BRENT') || item.pair.includes('WTI')
            ? 0.0005
            : 0.0002;

          const priceDelta = item.price * volatility * (Math.random() * 0.7 + 0.3) * deltaSign;
          const newPrice = Math.max(0.0001, item.price + priceDelta);
          const newChange = Number((item.change + deltaSign * (Math.random() * 0.04)).toFixed(2));

          return {
            ...item,
            price: newPrice,
            change: newChange,
            lastTick: isUp ? 'up' : 'down',
            lastTickTime: now,
          };
        });
      });
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  // آماده‌سازی اقلام با بافر کافی برای ایجاد لوپ بی‌نهایت در هر اندازه صفحه
  const repeatedItems = useMemo(() => {
    return [...data, ...data];
  }, [data]);

  return (
    <div
      dir="ltr"
      className="relative overflow-hidden w-full bg-slate-950 border-y border-slate-800/80 py-1.5 select-none font-mono text-xs flex items-center"
    >
      <style>{`
        @keyframes ticker-infinite {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .ticker-continuous-track {
          display: flex;
          width: max-content;
          will-change: transform;
          animation: ticker-infinite 65s linear infinite;
        }
      `}</style>

      {/* ماسک‌های گرادینت دو طرف جهت محو شدن پیوسته و ملایم ورودی و خروجی */}
      <div className="absolute left-0 top-0 bottom-0 w-10 sm:w-16 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent pointer-events-none z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-10 sm:w-16 bg-gradient-to-l from-slate-950 via-slate-950/80 to-transparent pointer-events-none z-10" />

      {/* نوار پیوسته شبیه زیرنویس اخبار بازارهای مالی (Never-ending Marquee) */}
      <div className="ticker-continuous-track">
        {/* ست اول */}
        <div className="flex items-center shrink-0">
          {repeatedItems.map((item, idx) => (
            <TickerItem key={`s1-${item.pair}-${idx}`} item={item} />
          ))}
        </div>

        {/* ست دوم (کپی یکسان برای ایجاد حلقه بی‌نهایت و بدون حتی ۱ پیکسل پرش) */}
        <div className="flex items-center shrink-0" aria-hidden="true">
          {repeatedItems.map((item, idx) => (
            <TickerItem key={`s2-${item.pair}-${idx}`} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}

function TickerItem({ item }) {
  const isPositive = item.change >= 0;
  const isRecentTick = item.lastTickTime && Date.now() - item.lastTickTime < 1200;

  return (
    <div className="flex items-center whitespace-nowrap px-4 hover:bg-slate-900/60 transition-colors py-0.5 rounded cursor-default">
      {/* نماد جفت‌ارز / کالا */}
      <span className="font-bold text-slate-200 tracking-wider text-xs">
        {item.pair}
      </span>

      {/* نام فارسی کوچک */}
      <span className="text-[10px] text-slate-400 font-sans font-normal ml-1.5 mr-2">
        {item.name}
      </span>

      {/* نرخ زنده */}
      <span
        className={`font-semibold transition-colors duration-300 text-xs mr-2 ${
          isRecentTick
            ? item.lastTick === 'up'
              ? 'text-emerald-300 font-bold'
              : 'text-rose-300 font-bold'
            : 'text-slate-100'
        }`}
      >
        {item.price.toLocaleString('en-US', {
          minimumFractionDigits: item.precision,
          maximumFractionDigits: item.precision,
        })}
      </span>

      {/* درصد تغییرات ۲۴ ساعته */}
      <span
        className={`text-[11px] font-bold ${
          isPositive ? 'text-emerald-400' : 'text-rose-400'
        }`}
      >
        {isPositive ? '+' : ''}{item.change.toFixed(2)}%
      </span>

      {/* جداکننده بین اقلام به سبک اخبار بورس */}
      <span className="text-slate-700 ml-4 font-normal">•</span>
    </div>
  );
}