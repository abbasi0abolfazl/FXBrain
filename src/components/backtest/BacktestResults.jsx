import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Target, AlertTriangle, Award, BarChart3 } from 'lucide-react';

export default function BacktestResults({ result }) {
  if (!result) return null;

  const profitPercent = ((result.final_balance - result.initial_balance) / result.initial_balance * 100).toFixed(2);
  const isProfit = result.final_balance > result.initial_balance;

  // Generate equity curve data
  const equityCurve = [];
  let balance = result.initial_balance;
  result.trades?.forEach((trade, i) => {
    balance += trade.profit;
    equityCurve.push({
      trade: i + 1,
      balance: parseFloat(balance.toFixed(2)),
      profit: trade.profit,
    });
  });

  const stats = [
    { label: 'سرمایه اولیه', value: `$${result.initial_balance?.toLocaleString()}`, icon: BarChart3, color: 'blue' },
    { label: 'سرمایه نهایی', value: `$${result.final_balance?.toLocaleString()}`, icon: isProfit ? TrendingUp : TrendingDown, color: isProfit ? 'green' : 'red' },
    { label: 'کل معاملات', value: result.total_trades, icon: Target, color: 'purple' },
    { label: 'نرخ برد', value: `${result.win_rate?.toFixed(1)}%`, icon: Award, color: 'amber' },
    { label: 'فاکتور سود', value: result.profit_factor?.toFixed(2), icon: TrendingUp, color: 'emerald' },
    { label: 'بیشترین افت', value: `${result.max_drawdown?.toFixed(1)}%`, icon: AlertTriangle, color: 'red' },
  ];

  const colorClasses = {
    blue: 'from-blue-500/20 to-blue-600/10 border-blue-500/30 text-blue-400',
    green: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/30 text-emerald-400',
    red: 'from-red-500/20 to-red-600/10 border-red-500/30 text-red-400',
    purple: 'from-purple-500/20 to-purple-600/10 border-purple-500/30 text-purple-400',
    amber: 'from-amber-500/20 to-amber-600/10 border-amber-500/30 text-amber-400',
    emerald: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/30 text-emerald-400',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-slate-800/50 border border-slate-700/50 p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-white">{result.strategy_name}</h3>
            <p className="text-slate-400">{result.currency_pair} | {result.start_date} تا {result.end_date}</p>
          </div>
          <Badge className={`text-lg px-4 py-2 ${isProfit ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
            {isProfit ? '+' : ''}{profitPercent}%
          </Badge>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {stats.map((stat, i) => (
            <div
              key={i}
              className={`rounded-xl bg-gradient-to-br ${colorClasses[stat.color]} border p-4`}
            >
              <stat.icon className="w-5 h-5 mb-2" />
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-slate-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Equity Curve */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl bg-slate-800/50 border border-slate-700/50 p-6"
      >
        <h4 className="text-lg font-semibold text-white mb-4">منحنی سرمایه</h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={equityCurve}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="trade" stroke="#64748b" tick={{ fill: '#64748b', fontSize: 10 }} />
              <YAxis stroke="#64748b" tick={{ fill: '#64748b', fontSize: 10 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                labelStyle={{ color: '#94a3b8' }}
              />
              <Line
                type="monotone"
                dataKey="balance"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={false}
                name="سرمایه"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Profit Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl bg-slate-800/50 border border-slate-700/50 p-6"
      >
        <h4 className="text-lg font-semibold text-white mb-4">توزیع سود/زیان معاملات</h4>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={equityCurve}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="trade" stroke="#64748b" tick={{ fill: '#64748b', fontSize: 10 }} />
              <YAxis stroke="#64748b" tick={{ fill: '#64748b', fontSize: 10 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                labelStyle={{ color: '#94a3b8' }}
              />
              <Bar
                dataKey="profit"
                fill="#3b82f6"
                name="سود"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Trades Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl bg-slate-800/50 border border-slate-700/50 overflow-hidden"
      >
        <div className="p-4 border-b border-slate-700">
          <h4 className="text-lg font-semibold text-white">تاریخچه معاملات</h4>
        </div>
        <div className="overflow-x-auto max-h-64">
          <table className="w-full">
            <thead className="bg-slate-800/50 sticky top-0">
              <tr>
                <th className="py-3 px-4 text-right text-sm font-medium text-slate-400">#</th>
                <th className="py-3 px-4 text-right text-sm font-medium text-slate-400">تاریخ</th>
                <th className="py-3 px-4 text-right text-sm font-medium text-slate-400">نوع</th>
                <th className="py-3 px-4 text-right text-sm font-medium text-slate-400">ورود</th>
                <th className="py-3 px-4 text-right text-sm font-medium text-slate-400">خروج</th>
                <th className="py-3 px-4 text-right text-sm font-medium text-slate-400">سود/زیان</th>
              </tr>
            </thead>
            <tbody>
              {result.trades?.slice(0, 20).map((trade, i) => (
                <tr key={i} className="border-b border-slate-700/50 hover:bg-slate-800/30">
                  <td className="py-3 px-4 text-slate-400">{i + 1}</td>
                  <td className="py-3 px-4 text-white font-mono text-sm">{trade.date}</td>
                  <td className="py-3 px-4">
                    <Badge className={trade.type === 'buy' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}>
                      {trade.type === 'buy' ? 'خرید' : 'فروش'}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-white font-mono">{trade.entry_price}</td>
                  <td className="py-3 px-4 text-white font-mono">{trade.exit_price}</td>
                  <td className={`py-3 px-4 font-mono font-semibold ${trade.profit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {trade.profit >= 0 ? '+' : ''}{trade.profit.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}