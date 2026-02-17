import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, ComposedChart, Bar } from 'recharts';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown } from 'lucide-react';

// Generate mock price data
const generatePriceData = (pair, days = 30) => {
  const basePrice = {
    'EURUSD': 1.085,
    'GBPUSD': 1.265,
    'USDJPY': 149.5,
    'XAUUSD': 2045,
    'BTCUSD': 43000,
  }[pair] || 1.0;

  const data = [];
  let price = basePrice;
  const now = new Date();

  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    const change = (Math.random() - 0.5) * (basePrice * 0.02);
    price = price + change;
    
    const high = price + Math.random() * (basePrice * 0.005);
    const low = price - Math.random() * (basePrice * 0.005);
    const volume = Math.floor(Math.random() * 10000) + 5000;
    
    // Calculate RSI (simplified)
    const rsi = 30 + Math.random() * 40;
    
    // Calculate MACD (simplified)
    const macd = (Math.random() - 0.5) * 0.01;
    const signal = macd + (Math.random() - 0.5) * 0.005;
    
    data.push({
      date: date.toISOString().split('T')[0],
      price: parseFloat(price.toFixed(pair === 'XAUUSD' || pair === 'BTCUSD' ? 2 : 5)),
      high: parseFloat(high.toFixed(5)),
      low: parseFloat(low.toFixed(5)),
      volume,
      rsi: parseFloat(rsi.toFixed(2)),
      macd: parseFloat(macd.toFixed(5)),
      signal: parseFloat(signal.toFixed(5)),
      sma20: parseFloat((price * (1 + (Math.random() - 0.5) * 0.01)).toFixed(5)),
      sma50: parseFloat((price * (1 + (Math.random() - 0.5) * 0.02)).toFixed(5)),
    });
  }
  return data;
};

const timeframes = [
  { value: '1D', label: '۱ روز', days: 1 },
  { value: '1W', label: '۱ هفته', days: 7 },
  { value: '1M', label: '۱ ماه', days: 30 },
  { value: '3M', label: '۳ ماه', days: 90 },
];

const indicators = [
  { value: 'sma', label: 'میانگین متحرک (SMA)' },
  { value: 'rsi', label: 'RSI' },
  { value: 'macd', label: 'MACD' },
];

export default function PriceChart({ pair = 'EURUSD', compact = false }) {
  const [timeframe, setTimeframe] = useState('1M');
  const [activeIndicators, setActiveIndicators] = useState(['sma']);

  const days = timeframes.find(t => t.value === timeframe)?.days || 30;
  const data = useMemo(() => generatePriceData(pair, days), [pair, days]);

  const currentPrice = data[data.length - 1]?.price;
  const previousPrice = data[data.length - 2]?.price;
  const priceChange = currentPrice - previousPrice;
  const priceChangePercent = ((priceChange / previousPrice) * 100).toFixed(2);

  const toggleIndicator = (ind) => {
    setActiveIndicators(prev => 
      prev.includes(ind) ? prev.filter(i => i !== ind) : [...prev, ind]
    );
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 shadow-xl">
          <p className="text-slate-400 text-xs mb-2">{label}</p>
          {payload.map((p, i) => (
            <p key={i} className="text-sm" style={{ color: p.color }}>
              {p.name}: {p.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`rounded-2xl bg-slate-800/50 border border-slate-700/50 ${compact ? 'p-4' : 'p-6'}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <h3 className="text-xl font-bold text-white">{pair}</h3>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-mono font-bold text-white">{currentPrice}</span>
            <Badge className={`${priceChange >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
              {priceChange >= 0 ? <TrendingUp className="w-3 h-3 ml-1" /> : <TrendingDown className="w-3 h-3 ml-1" />}
              {priceChange >= 0 ? '+' : ''}{priceChangePercent}%
            </Badge>
          </div>
        </div>

        {!compact && (
          <div className="flex flex-wrap items-center gap-2">
            {timeframes.map(tf => (
              <Button
                key={tf.value}
                size="sm"
                variant={timeframe === tf.value ? 'default' : 'outline'}
                onClick={() => setTimeframe(tf.value)}
                className={`rounded-lg ${
                  timeframe === tf.value 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : 'border-slate-700 text-slate-400 hover:bg-slate-800'
                }`}
              >
                {tf.label}
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* Indicators Toggle */}
      {!compact && (
        <div className="flex flex-wrap gap-2 mb-4">
          {indicators.map(ind => (
            <Button
              key={ind.value}
              size="sm"
              variant={activeIndicators.includes(ind.value) ? 'default' : 'outline'}
              onClick={() => toggleIndicator(ind.value)}
              className={`rounded-lg text-xs ${
                activeIndicators.includes(ind.value)
                  ? 'bg-purple-600 hover:bg-purple-700'
                  : 'border-slate-700 text-slate-400 hover:bg-slate-800'
              }`}
            >
              {ind.label}
            </Button>
          ))}
        </div>
      )}

      {/* Main Price Chart */}
      <div className={compact ? 'h-48' : 'h-80'}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis 
              dataKey="date" 
              stroke="#64748b" 
              tick={{ fill: '#64748b', fontSize: 10 }}
              tickFormatter={(val) => val.slice(5)}
            />
            <YAxis 
              stroke="#64748b" 
              tick={{ fill: '#64748b', fontSize: 10 }}
              domain={['auto', 'auto']}
              tickFormatter={(val) => val.toFixed(pair === 'XAUUSD' || pair === 'BTCUSD' ? 0 : 4)}
            />
            <Tooltip content={<CustomTooltip />} />
            
            <Area
              type="monotone"
              dataKey="price"
              stroke="#3b82f6"
              fill="url(#priceGradient)"
              strokeWidth={2}
              name="قیمت"
            />
            
            {activeIndicators.includes('sma') && (
              <>
                <Line type="monotone" dataKey="sma20" stroke="#f59e0b" strokeWidth={1} dot={false} name="SMA 20" />
                <Line type="monotone" dataKey="sma50" stroke="#8b5cf6" strokeWidth={1} dot={false} name="SMA 50" />
              </>
            )}
            
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* RSI Chart */}
      {!compact && activeIndicators.includes('rsi') && (
        <div className="mt-4 h-24 border-t border-slate-700 pt-4">
          <p className="text-xs text-slate-500 mb-2">RSI (14)</p>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="date" hide />
              <YAxis domain={[0, 100]} stroke="#64748b" tick={{ fill: '#64748b', fontSize: 10 }} />
              <Line type="monotone" dataKey="rsi" stroke="#10b981" strokeWidth={1} dot={false} />
              {/* Overbought/Oversold lines */}
              <Line type="monotone" dataKey={() => 70} stroke="#ef4444" strokeDasharray="3 3" dot={false} />
              <Line type="monotone" dataKey={() => 30} stroke="#22c55e" strokeDasharray="3 3" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* MACD Chart */}
      {!compact && activeIndicators.includes('macd') && (
        <div className="mt-4 h-24 border-t border-slate-700 pt-4">
          <p className="text-xs text-slate-500 mb-2">MACD</p>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="date" hide />
              <YAxis stroke="#64748b" tick={{ fill: '#64748b', fontSize: 10 }} />
              <Bar dataKey="macd" fill="#3b82f6" />
              <Line type="monotone" dataKey="signal" stroke="#f59e0b" strokeWidth={1} dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}