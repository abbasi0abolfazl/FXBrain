import React from 'react';
import { motion } from 'framer-motion';
import { Wallet, TrendingUp, TrendingDown, Target, Award, BarChart3 } from 'lucide-react';

export default function PortfolioStats({ portfolio, trades }) {
  const openTrades = trades?.filter(t => t.status === 'open') || [];
  const closedTrades = trades?.filter(t => t.status === 'closed') || [];
  const winningTrades = closedTrades.filter(t => t.profit_loss > 0).length;
  const winRate = closedTrades.length > 0 ? (winningTrades / closedTrades.length * 100).toFixed(1) : 0;
  const totalPnL = portfolio?.total_profit || 0;
  const pnlPercent = portfolio?.initial_balance ? ((totalPnL / portfolio.initial_balance) * 100).toFixed(2) : 0;

  const stats = [
    { 
      label: 'موجودی', 
      value: `$${(portfolio?.balance || 10000).toLocaleString()}`, 
      icon: Wallet, 
      color: 'blue' 
    },
    { 
      label: 'سود/زیان کل', 
      value: `${totalPnL >= 0 ? '+' : ''}$${totalPnL.toLocaleString()}`, 
      subtext: `${pnlPercent}%`,
      icon: totalPnL >= 0 ? TrendingUp : TrendingDown, 
      color: totalPnL >= 0 ? 'green' : 'red' 
    },
    { 
      label: 'معاملات باز', 
      value: openTrades.length, 
      icon: Target, 
      color: 'purple' 
    },
    { 
      label: 'نرخ برد', 
      value: `${winRate}%`, 
      subtext: `${winningTrades}/${closedTrades.length}`,
      icon: Award, 
      color: 'amber' 
    },
  ];

  const colorClasses = {
    blue: 'from-blue-500/20 to-blue-600/10 border-blue-500/30 text-blue-400',
    green: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/30 text-emerald-400',
    red: 'from-red-500/20 to-red-600/10 border-red-500/30 text-red-400',
    purple: 'from-purple-500/20 to-purple-600/10 border-purple-500/30 text-purple-400',
    amber: 'from-amber-500/20 to-amber-600/10 border-amber-500/30 text-amber-400',
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className={`rounded-2xl bg-gradient-to-br ${colorClasses[stat.color]} border p-4`}
        >
          <stat.icon className="w-5 h-5 mb-2" />
          <p className="text-2xl font-bold text-white">{stat.value}</p>
          {stat.subtext && <p className="text-xs opacity-70">{stat.subtext}</p>}
          <p className="text-xs text-slate-400 mt-1">{stat.label}</p>
        </motion.div>
      ))}
    </div>
  );
}