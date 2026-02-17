import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, BellOff, Trash2, MessageCircle, Mail, Globe, Clock } from 'lucide-react';
import moment from 'moment';
import * as SwitchPrimitive from '@radix-ui/react-switch';

const channelIcons = {
  web: Globe,
  telegram: MessageCircle,
  email: Mail,
};

const channelLabels = {
  web: 'وب',
  telegram: 'تلگرام',
  email: 'ایمیل',
};

const getConditionLabel = (conditionType, conditions) => {
  if (conditions?.condition_types) {
    const found = conditions.condition_types.find(c => c.value === conditionType);
    return found?.label || conditionType;
  }
  
  // مقادیر پیش‌فرض
  const defaultLabels = {
    price_above: 'قیمت بالاتر از',
    price_below: 'قیمت پایین‌تر از',
    rsi_above: 'RSI بالاتر از',
    rsi_below: 'RSI پایین‌تر از',
    news_high_impact: 'خبر با تأثیر بالا',
  };
  return defaultLabels[conditionType] || conditionType;
};

// کامپوننت سفارشی Switch
const CustomSwitch = ({ checked, onCheckedChange }) => {
  return (
    <SwitchPrimitive.Root
      checked={checked}
      onCheckedChange={onCheckedChange}
      className={`
        relative inline-flex h-6 w-11 items-center rounded-full 
        transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900
        ${checked ? 'bg-blue-600' : 'bg-slate-600'}
      `}
    >
      <SwitchPrimitive.Thumb
        className={`
          inline-block h-5 w-5 transform rounded-full bg-white transition-transform
          ${checked ? 'translate-x-1' : 'translate-x-0.5'}
        `}
      />
    </SwitchPrimitive.Root>
  );
};

export default function AlertCard({ alert, onToggle, onDelete, index, conditions }) {
  const isActive = alert.is_active;
  const conditionLabel = getConditionLabel(alert.condition_type, conditions);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -2 }}
      className={`relative overflow-hidden rounded-2xl border p-5 transition-all duration-300 ${
        isActive
          ? 'bg-gradient-to-br from-slate-800/50 to-slate-800/30 border-slate-700/50 hover:border-blue-500/30'
          : 'bg-slate-900/50 border-slate-800/50 opacity-60'
      }`}
    >
      {/* Background glow for active alerts */}
      {isActive && (
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/5 to-transparent rounded-full blur-3xl" />
      )}

      <div className="relative">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${
              isActive 
                ? 'bg-gradient-to-br from-blue-500/20 to-blue-600/10 text-blue-400 border border-blue-500/30' 
                : 'bg-slate-700/50 text-slate-500'
            }`}>
              {isActive ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
            </div>
            <div>
              <h4 className="text-white font-semibold">{alert.name}</h4>
              <p className="text-sm text-slate-400">{alert.currency_pair}</p>
            </div>
          </div>
          
          {/* استفاده از کامپوننت سفارشی Switch */}
          <CustomSwitch
            checked={isActive}
            onCheckedChange={() => onToggle(alert)}
          />
        </div>

        {/* Condition */}
        <div className="bg-slate-900/50 rounded-xl p-3 mb-4 border border-slate-700/30">
          <p className="text-slate-300 text-sm">
            <span className="text-slate-500">شرط: </span>
            {conditionLabel} 
            {alert.condition_value && (
              <span className="text-white font-mono mr-1">{alert.condition_value}</span>
            )}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          {/* Notification Channels */}
          <div className="flex items-center gap-2">
            {alert.notification_channels?.map((channel, i) => {
              const Icon = channelIcons[channel];
              return Icon ? (
                <div
                  key={i}
                  className="p-1.5 rounded-lg bg-slate-700/50 text-slate-400 border border-slate-600/30"
                  title={channelLabels[channel]}
                >
                  <Icon className="w-4 h-4" />
                </div>
              ) : null;
            })}
          </div>

          {/* Actions and Status */}
          <div className="flex items-center gap-2">
            {alert.triggered_at && (
              <Badge variant="outline" className="text-xs border-emerald-500/30 text-emerald-400 bg-emerald-500/5">
                <Clock className="w-3 h-3 ml-1" />
                {moment(alert.triggered_at).fromNow()}
              </Badge>
            )}
            
            <Button
              variant="ghost"
              size="icon"
              className="text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
              onClick={() => onDelete(alert)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Created time */}
        <div className="mt-3 pt-3 border-t border-slate-700/30 text-xs text-slate-500">
          ایجاد: {moment(alert.created_at).format('YYYY/MM/DD')}
        </div>
      </div>
    </motion.div>
  );
}