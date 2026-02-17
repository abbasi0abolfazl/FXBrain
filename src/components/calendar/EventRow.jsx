import React from 'react';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import moment from 'moment';
import { getImpactColor } from '@/theme/colors';

const countryFlags = {
  USD: '🇺🇸',
  EUR: '🇪🇺',
  GBP: '🇬🇧',
  JPY: '🇯🇵',
  CHF: '🇨🇭',
  AUD: '🇦🇺',
  CAD: '🇨🇦',
  NZD: '🇳🇿',
  CNY: '🇨🇳',
};

export default function EventRow({ event, index }) {
  const impactColor = getImpactColor(event.importance);
  const isPast = moment(event.event_time).isBefore(moment());
  const isNow = moment(event.event_time).isSame(moment(), 'hour');
  const isUpcoming = moment(event.event_time).isAfter(moment()) && !isNow;

  const timeColor = isNow 
    ? 'text-blue-400 font-semibold' 
    : isPast 
      ? 'text-slate-500' 
      : 'text-emerald-400';

  return (
    <>
      <td className="py-4 px-4">
        <motion.div 
          className="flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          <div className={`flex flex-col items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br ${
            isNow ? 'from-blue-500/30 to-blue-600/20 border border-blue-500/40' :
            isPast ? 'from-slate-700/50 to-slate-800/30 border border-slate-600/40' :
            'from-emerald-500/30 to-emerald-600/20 border border-emerald-500/40'
          }`}>
            <span className={`text-xs ${timeColor}`}>
              {moment(event.event_time).format('HH:mm')}
            </span>
            <span className="text-[10px] text-slate-500">
              {moment(event.event_time).format('MM/DD')}
            </span>
          </div>
        </motion.div>
      </td>
      
      <td className="py-4 px-4">
        <motion.div 
          className="flex items-center gap-2"
          whileHover={{ x: 5 }}
          transition={{ duration: 0.2 }}
        >
          <span className="text-2xl">{countryFlags[event.country] || '🌍'}</span>
          <span className={`font-medium ${isPast ? 'text-slate-400' : 'text-white'}`}>
            {event.country}
          </span>
        </motion.div>
      </td>
      
      <td className="py-4 px-4">
        <div className={`${isPast ? 'text-slate-400' : 'text-white'} font-medium`}>
          {event.event_name}
        </div>
      </td>
      
      <td className="py-4 px-4">
        <motion.div
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.2 }}
        >
          <Badge className={`bg-gradient-to-r ${impactColor.light} ${impactColor.border} px-3 py-1`}>
            <span className="ml-1">{impactColor.icon}</span>
            <span className="mr-1">{impactColor.label}</span>
          </Badge>
        </motion.div>
      </td>
      
      <td className="py-4 px-4">
        <div className={`font-mono text-sm ${isPast ? 'text-slate-500' : 'text-slate-300'}`}>
          {event.forecast || event.forecast_value || '-'}
        </div>
      </td>
      
      <td className="py-4 px-4">
        <div className="font-mono text-sm text-slate-500">
          {event.previous || event.previous_value || '-'}
        </div>
      </td>
      
      <td className="py-4 px-4">
        {event.actual || event.actual_value ? (
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center gap-1"
          >
            <div className={`w-2 h-2 rounded-full ${impactColor.text.replace('text-', 'bg-')} animate-pulse`} />
            <span className={`font-mono text-sm font-semibold ${impactColor.text}`}>
              {event.actual || event.actual_value}
            </span>
          </motion.div>
        ) : (
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <Badge variant="outline" className="text-xs border-slate-600/50 text-slate-500 bg-slate-800/30">
              در انتظار
            </Badge>
          </motion.div>
        )}
      </td>
    </>
  );
}