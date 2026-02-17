import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatsCard({ title, value, icon: Icon, color = 'blue', trend }) {
  const colors = {
    blue: {
      bg: 'from-blue-500/20 to-blue-600/10',
      border: 'border-blue-500/30',
      text: 'text-blue-400',
      icon: 'text-blue-400'
    },
    green: {
      bg: 'from-emerald-500/20 to-emerald-600/10',
      border: 'border-emerald-500/30',
      text: 'text-emerald-400',
      icon: 'text-emerald-400'
    },
    orange: {
      bg: 'from-amber-500/20 to-amber-600/10',
      border: 'border-amber-500/30',
      text: 'text-amber-400',
      icon: 'text-amber-400'
    },
    purple: {
      bg: 'from-purple-500/20 to-purple-600/10',
      border: 'border-purple-500/30',
      text: 'text-purple-400',
      icon: 'text-purple-400'
    },
  };

  const colorStyle = colors[color] || colors.blue;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${colorStyle.bg} border ${colorStyle.border} p-5 backdrop-blur-sm`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-400 text-sm font-medium mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-white">{value}</h3>
          
          {trend !== undefined && (
            <div className={`flex items-center gap-1 mt-2 text-sm ${
              trend > 0 ? 'text-emerald-400' : 'text-red-400'
            }`}>
              {trend > 0 ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              <span>{trend > 0 ? '+' : ''}{trend}%</span>
            </div>
          )}
        </div>
        
        <div className={`p-3 rounded-xl bg-gradient-to-br ${colorStyle.bg} ${colorStyle.border}`}>
          <Icon className={`w-5 h-5 ${colorStyle.icon}`} />
        </div>
      </div>
      
      {/* Background decoration */}
      <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl" />
    </motion.div>
  );
}