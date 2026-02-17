import React from 'react';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Target, Shield, Zap, Clock } from 'lucide-react';
import moment from 'moment';

const statusConfig = {
  active: {
    color: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    label: 'فعال',
    icon: '⚡'
  },
  hit_tp: {
    color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    label: 'سود',
    icon: '✅'
  },
  hit_sl: {
    color: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
    label: 'ضرر',
    icon: '❌'
  }
};

const confidenceColor = (confidence) => {
  if (confidence >= 80) return 'text-emerald-400';
  if (confidence >= 60) return 'text-amber-400';
  return 'text-slate-400';
};

export default function SignalCard({ signal, index }) {
  const isActive = signal.status === 'active';
  const status = statusConfig[signal.status] || statusConfig.active;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ 
        y: -5,
        transition: { duration: 0.2 }
      }}
      className={`group relative rounded-2xl border ${
        isActive 
          ? 'border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-orange-500/5' 
          : 'border-slate-700/50 bg-slate-800/30'
      } backdrop-blur-sm overflow-hidden`}
    >
      {/* Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${
        isActive 
          ? 'from-amber-500/5 to-orange-500/5' 
          : 'from-slate-800/50 to-slate-900/50'
      } opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

      {/* Content */}
      <div className="relative p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-lg ${
              signal.signal_type === 'buy' 
                ? 'bg-emerald-500/20 text-emerald-400' 
                : 'bg-rose-500/20 text-rose-400'
            }`}>
              {signal.signal_type === 'buy' ? (
                <TrendingUp className="w-5 h-5" />
              ) : (
                <TrendingDown className="w-5 h-5" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{signal.pair}</h3>
              <p className="text-xs text-slate-500">
                {moment(signal.created_at).format('HH:mm - YYYY/MM/DD')}
              </p>
            </div>
          </div>
          <Badge className={`${status.color} px-2 py-1`}>
            <span className="ml-1">{status.icon}</span>
            {status.label}
          </Badge>
        </div>

        {/* Confidence Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-slate-400">اعتماد</span>
            <span className={confidenceColor(signal.confidence)}>
              {signal.confidence}%
            </span>
          </div>
          <div className="h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${signal.confidence}%` }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className={`h-full rounded-full ${
                signal.confidence >= 80 
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' 
                  : signal.confidence >= 60
                  ? 'bg-gradient-to-r from-amber-500 to-amber-400'
                  : 'bg-gradient-to-r from-slate-500 to-slate-400'
              }`}
            />
          </div>
        </div>

        {/* Prices */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="text-center p-2 rounded-lg bg-slate-800/50">
            <p className="text-xs text-slate-400 mb-1">ورود</p>
            <p className="text-sm font-bold text-white">{signal.entry_price.toFixed(4)}</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-slate-800/50">
            <p className="text-xs text-slate-400 mb-1 flex items-center justify-center gap-1">
              <Target className="w-3 h-3" /> هدف
            </p>
            <p className="text-sm font-bold text-emerald-400">{signal.take_profit.toFixed(4)}</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-slate-800/50">
            <p className="text-xs text-slate-400 mb-1 flex items-center justify-center gap-1">
              <Shield className="w-3 h-3" /> حد ضرر
            </p>
            <p className="text-sm font-bold text-rose-400">{signal.stop_loss.toFixed(4)}</p>
          </div>
        </div>

        {/* Analysis */}
        <div className="mb-4">
          <p className="text-sm text-slate-300">{signal.analysis}</p>
        </div>

        {/* Reasons */}
        <div>
          <p className="text-xs text-slate-400 mb-2">دلایل:</p>
          <div className="flex flex-wrap gap-1">
            {signal.reasons.map((reason, i) => (
              <Badge 
                key={i}
                variant="outline" 
                className="text-xs border-slate-600/50 text-slate-400 bg-slate-800/30"
              >
                {reason}
              </Badge>
            ))}
          </div>
        </div>

        {/* Time indicator for active signals */}
        {isActive && (
          <div className="mt-4 pt-3 border-t border-slate-700/50 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1 text-slate-500">
              <Clock className="w-3 h-3" />
              <span>منتظر تأیید</span>
            </div>
            <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20">
              <Zap className="w-3 h-3 ml-1" />
              لحظه‌ای
            </Badge>
          </div>
        )}
      </div>
    </motion.div>
  );
}