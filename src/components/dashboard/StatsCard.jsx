import React from 'react';
import { motion } from 'framer-motion';

export default function StatsCard({ title, value, icon: Icon, color = 'blue', trend }) {
  const iconColor = color === 'green' ? 'text-emerald-400' : color === 'orange' ? 'text-amber-400' : 'text-slate-400';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="border-b border-slate-800 py-3"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-400 text-sm font-medium mb-1">{title}</p>
          <h3 className="text-2xl font-semibold tabular-nums text-white">{value}</h3>
        </div>
        
        <div className="pt-1">
          <Icon className={`w-4 h-4 ${iconColor}`} />
        </div>
      </div>
      
    </motion.div>
  );
}
