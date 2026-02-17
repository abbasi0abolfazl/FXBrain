import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, X } from 'lucide-react';
import moment from 'moment';

const mockPrices = {
  EURUSD: 1.0852,
  GBPUSD: 1.2648,
  USDJPY: 149.85,
  XAUUSD: 2045.50,
  BTCUSD: 43250,
};

export default function OpenPositions({ trades, onCloseTrade }) {
  const openTrades = trades?.filter(t => t.status === 'open') || [];

  const calculatePnL = (trade) => {
    const currentPrice = mockPrices[trade.currency_pair] || trade.entry_price;
    const diff = trade.trade_type === 'buy' 
      ? currentPrice - trade.entry_price 
      : trade.entry_price - currentPrice;
    return diff * trade.quantity * 100000; // Standard lot
  };

  if (openTrades.length === 0) {
    return (
      <div className="rounded-2xl bg-slate-800/50 border border-slate-700/50 p-8 text-center">
        <p className="text-slate-500">معامله باز فعالی ندارید</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-slate-800/50 border border-slate-700/50 overflow-hidden">
      <div className="p-4 border-b border-slate-700/50">
        <h3 className="font-semibold text-white">معاملات باز ({openTrades.length})</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-800/50">
            <tr>
              <th className="py-3 px-4 text-right text-sm font-medium text-slate-400">جفت ارز</th>
              <th className="py-3 px-4 text-right text-sm font-medium text-slate-400">نوع</th>
              <th className="py-3 px-4 text-right text-sm font-medium text-slate-400">حجم</th>
              <th className="py-3 px-4 text-right text-sm font-medium text-slate-400">ورود</th>
              <th className="py-3 px-4 text-right text-sm font-medium text-slate-400">فعلی</th>
              <th className="py-3 px-4 text-right text-sm font-medium text-slate-400">سود/زیان</th>
              <th className="py-3 px-4 text-right text-sm font-medium text-slate-400"></th>
            </tr>
          </thead>
          <tbody>
            {openTrades.map((trade, i) => {
              const pnl = calculatePnL(trade);
              const currentPrice = mockPrices[trade.currency_pair];
              return (
                <motion.tr
                  key={trade.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="border-b border-slate-700/50 hover:bg-slate-800/30"
                >
                  <td className="py-3 px-4 font-semibold text-white">{trade.currency_pair}</td>
                  <td className="py-3 px-4">
                    <Badge className={trade.trade_type === 'buy' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}>
                      {trade.trade_type === 'buy' ? <TrendingUp className="w-3 h-3 ml-1" /> : <TrendingDown className="w-3 h-3 ml-1" />}
                      {trade.trade_type === 'buy' ? 'خرید' : 'فروش'}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-white font-mono">{trade.quantity}</td>
                  <td className="py-3 px-4 text-white font-mono">{trade.entry_price}</td>
                  <td className="py-3 px-4 text-white font-mono">{currentPrice}</td>
                  <td className={`py-3 px-4 font-mono font-semibold ${pnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {pnl >= 0 ? '+' : ''}{pnl.toFixed(2)}
                  </td>
                  <td className="py-3 px-4">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onCloseTrade(trade, currentPrice, pnl)}
                      className="text-slate-400 hover:text-red-400 hover:bg-red-500/10"
                    >
                      <X className="w-4 h-4" />
                      بستن
                    </Button>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}