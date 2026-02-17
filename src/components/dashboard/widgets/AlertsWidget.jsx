import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Bell, BellOff, Globe, MessageCircle, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import moment from 'moment';

// API base URL
const API_BASE_URL = 'http://localhost:8000';

// API service for alerts
const alertsService = {
  async getAlerts(filters = {}) {
    const params = new URLSearchParams();
    if (filters.is_active !== undefined) params.append('is_active', filters.is_active);
    params.append('limit', '5');
    
    const response = await fetch(`${API_BASE_URL}/api/alerts?${params}`);
    return response.json();
  }
};

const conditionLabels = {
  price_above: 'قیمت >',
  price_below: 'قیمت <',
  rsi_above: 'RSI >',
  rsi_below: 'RSI <',
  news_high_impact: 'خبر مهم',
};

const channelIcons = {
  web: Globe,
  telegram: MessageCircle,
  email: Mail,
};

export default function AlertsWidget({ config = {} }) {
  const maxAlerts = config.max_alerts || 3;
  const showTriggered = config.show_triggered || false;

  const { data: alerts = [], isLoading } = useQuery({
    queryKey: ['alerts-widget', maxAlerts],
    queryFn: () => alertsService.getAlerts({ is_active: true }),
    refetchInterval: 30000, // هر 30 ثانیه
  });

  const activeAlerts = alerts.slice(0, maxAlerts);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-2">
            <Skeleton className="w-8 h-8 rounded-lg bg-slate-700/50" />
            <div className="flex-1">
              <Skeleton className="h-4 w-32 bg-slate-700/50 mb-2" />
              <Skeleton className="h-3 w-24 bg-slate-700/50" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {activeAlerts.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-slate-800/50 flex items-center justify-center">
            <BellOff className="w-6 h-6 text-slate-600" />
          </div>
          <p className="text-slate-400 text-sm">هشدار فعالی ندارید</p>
          <Link 
            to={createPageUrl('Alerts')}
            className="inline-block mt-2 text-xs text-blue-400 hover:text-blue-300"
          >
            ایجاد هشدار جدید
          </Link>
        </div>
      ) : (
        <>
          {activeAlerts.map((alert, i) => (
            <div 
              key={alert.id} 
              className="group relative flex items-center gap-3 p-3 rounded-xl bg-slate-900/50 border border-slate-700/30 hover:border-blue-500/30 transition-all duration-300"
            >
              {/* Status indicator */}
              <div className={`absolute top-2 right-2 w-1.5 h-1.5 rounded-full ${
                alert.is_active ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'
              }`} />
              
              {/* Icon */}
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                <Bell className="w-4 h-4" />
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-medium text-white truncate">{alert.name}</p>
                  <Badge className="bg-blue-500/10 text-blue-400 text-[10px] border-blue-500/20">
                    {alert.currency_pair}
                  </Badge>
                </div>
                
                <p className="text-xs text-slate-500">
                  <span className="text-slate-400">{conditionLabels[alert.condition_type]}</span>
                  {alert.condition_value && (
                    <span className="text-white font-mono mr-1">{alert.condition_value}</span>
                  )}
                </p>
                
                {/* Notification channels */}
                {alert.notification_channels && alert.notification_channels.length > 0 && (
                  <div className="flex items-center gap-1 mt-2">
                    {alert.notification_channels.map((channel, i) => {
                      const Icon = channelIcons[channel];
                      return Icon ? (
                        <div key={i} className="p-1 rounded bg-slate-800/50 text-slate-500">
                          <Icon className="w-3 h-3" />
                        </div>
                      ) : null;
                    })}
                  </div>
                )}
              </div>
              
              {/* Triggered badge */}
              {alert.triggered_at && showTriggered && (
                <Badge className="absolute bottom-2 left-2 bg-emerald-500/10 text-emerald-400 text-[10px] border-emerald-500/20">
                  {moment(alert.triggered_at).fromNow()}
                </Badge>
              )}
            </div>
          ))}
          
          <Link 
            to={createPageUrl('Alerts')}
            className="block text-center text-sm text-blue-400 hover:text-blue-300 py-2 transition-colors group"
          >
            <span className="border-b border-blue-400/0 group-hover:border-blue-400/50">
              مدیریت هشدارها ←
            </span>
          </Link>
        </>
      )}
    </div>
  );
}