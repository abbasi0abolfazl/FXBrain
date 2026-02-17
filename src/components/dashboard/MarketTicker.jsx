import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';

const marketData = [
  { pair: 'EUR/USD', price: 1.0852, change: 0.15 },
  { pair: 'GBP/USD', price: 1.2648, change: -0.22 },
  { pair: 'USD/JPY', price: 149.85, change: 0.08 },
  { pair: 'XAU/USD', price: 2045.50, change: 0.45 },
  { pair: 'USD/CHF', price: 0.8725, change: -0.12 },
  { pair: 'AUD/USD', price: 0.6542, change: 0.18 },
  { pair: 'BTC/USD', price: 43250, change: 1.25 },
];

export default function MarketTicker() {
  const [data, setData] = useState(marketData);

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => prev.map(item => ({
        ...item,
        price: item.price * (1 + (Math.random() - 0.5) * 0.001),
        change: item.change + (Math.random() - 0.5) * 0.1
      })));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative overflow-hidden bg-slate-900/50 backdrop-blur-sm border-y border-slate-700/50">
      <motion.div
        className="flex items-center gap-8 py-3 px-4"
        animate={{ x: [0, -1000] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      >
        {[...data, ...data].map((item, idx) => (
          <div key={idx} className="flex items-center gap-3 whitespace-nowrap">
            <span className="text-slate-400 font-medium">{item.pair}</span>
            <span className="text-white font-mono font-semibold">
              {item.price.toFixed(item.pair.includes('JPY') || item.pair.includes('BTC') ? 2 : 4)}
            </span>
            <span className={`flex items-center gap-1 text-sm font-medium ${
              item.change >= 0 ? 'text-emerald-400' : 'text-red-400'
            }`}>
              {item.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {item.change >= 0 ? '+' : ''}{item.change.toFixed(2)}%
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}