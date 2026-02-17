import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, TrendingUp, Layers } from 'lucide-react';
import TradingViewChart from '@/components/charts/TradingViewChart';
import MarketTicker from '@/components/dashboard/MarketTicker';

const currencyPairs = [
  { value: 'EURUSD', label: 'EUR/USD', flag: '🇪🇺' },
  { value: 'GBPUSD', label: 'GBP/USD', flag: '🇬🇧' },
  { value: 'USDJPY', label: 'USD/JPY', flag: '🇯🇵' },
  { value: 'XAUUSD', label: 'XAU/USD (طلا)', flag: '🥇' },
  { value: 'BTCUSD', label: 'BTC/USD', flag: '₿' },
];

export default function Charts() {
  const [selectedPair, setSelectedPair] = useState('EURUSD');
  const [comparePairs, setComparePairs] = useState([]);

  const toggleCompare = (pair) => {
    if (pair === selectedPair) return;
    setComparePairs(prev => 
      prev.includes(pair) ? prev.filter(p => p !== pair) : [...prev, pair]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <MarketTicker />
      
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-blue-500/20 text-blue-400">
              <LineChart className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">نمودارهای تحلیلی</h1>
              <p className="text-slate-400">نمودارهای تعاملی با اندیکاتورها</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Select value={selectedPair} onValueChange={setSelectedPair}>
              <SelectTrigger className="w-48 bg-slate-800 border-slate-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                {currencyPairs.map(pair => (
                  <SelectItem key={pair.value} value={pair.value} className="text-white hover:bg-slate-700">
                    <span className="flex items-center gap-2">
                      <span>{pair.flag}</span>
                      <span>{pair.label}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {/* Quick Pair Selection */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-2 mb-6"
        >
          {currencyPairs.map(pair => (
            <Button
              key={pair.value}
              variant={selectedPair === pair.value ? 'default' : 'outline'}
              onClick={() => setSelectedPair(pair.value)}
              className={`rounded-xl ${
                selectedPair === pair.value
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'border-slate-700 text-slate-400 hover:bg-slate-800'
              }`}
            >
              {pair.flag} {pair.label}
            </Button>
          ))}
        </motion.div>

        {/* Main Chart - TradingView */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <TradingViewChart symbol={selectedPair} height={550} />
        </motion.div>

        {/* Compare Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <Layers className="w-5 h-5 text-slate-400" />
            <h3 className="text-lg font-semibold text-white">مقایسه جفت ارزها</h3>
          </div>
          <div className="flex flex-wrap gap-2 mb-6">
            {currencyPairs.filter(p => p.value !== selectedPair).map(pair => (
              <Button
                key={pair.value}
                variant={comparePairs.includes(pair.value) ? 'default' : 'outline'}
                onClick={() => toggleCompare(pair.value)}
                size="sm"
                className={`rounded-lg ${
                  comparePairs.includes(pair.value)
                    ? 'bg-purple-600 hover:bg-purple-700'
                    : 'border-slate-700 text-slate-400 hover:bg-slate-800'
                }`}
              >
                {pair.flag} {pair.label}
              </Button>
            ))}
          </div>

          {comparePairs.length > 0 && (
            <div className="grid md:grid-cols-2 gap-6">
              {comparePairs.map(pair => (
                <TradingViewChart key={pair} symbol={pair} height={300} />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}