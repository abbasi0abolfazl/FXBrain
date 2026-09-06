import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Calendar, Clock } from 'lucide-react';
import { API_BASE_URL } from '@/config/api';


// API service for calendar
const calendarService = {
  async getEvents(filters = {}) {
    const params = new URLSearchParams();
    params.append('time_filter', 'today');
    params.append('limit', '10');
    
    const response = await fetch(`${API_BASE_URL}/api/calendar/events?${params}`);
    return response.json();
  }
};

const countryFlags = {
  USD: '🇺🇸', EUR: '🇪🇺', GBP: '🇬🇧', JPY: '🇯🇵', CHF: '🇨🇭', 
  AUD: '🇦🇺', CAD: '🇨🇦', NZD: '🇳🇿', CNY: '🇨🇳',
};

const importanceColors = {
  high: 'bg-red-500',
  medium: 'bg-amber-500',
  low: 'bg-emerald-500',
};

const importanceLabels = {
  high: 'زیاد',
  medium: 'متوسط',
  low: 'کم',
};

export default function CalendarWidget({ config = {} }) {
  const maxEvents = config.max_events || 4;
  const showHighImpactOnly = config.show_high_impact_only || false;

  const { data: events = [], isLoading } = useQuery({
    queryKey: ['calendar-widget', showHighImpactOnly],
    queryFn: () => calendarService.getEvents(),
    refetchInterval: 30000,
  });

  let displayEvents = events;
  
  if (showHighImpactOnly) {
    displayEvents = events.filter(e => e.importance === 'high');
  }
  
  displayEvents = displayEvents.slice(0, maxEvents);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-2">
            <Skeleton className="w-12 h-8 rounded bg-slate-700/50" />
            <Skeleton className="w-8 h-8 rounded-full bg-slate-700/50" />
            <Skeleton className="flex-1 h-4 bg-slate-700/50" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {displayEvents.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-slate-800/50 flex items-center justify-center">
            <Calendar className="w-6 h-6 text-slate-600" />
          </div>
          <p className="text-slate-400 text-sm">رویدادی برای امروز نیست</p>
        </div>
      ) : (
        <>
          {displayEvents.map((event, i) => {
            const isPast = moment(event.event_time).isBefore(moment());
            const isNow = moment(event.event_time).isSame(moment(), 'hour');
            
            return (
              <div 
                key={event.id} 
                className={`group flex items-center gap-3 p-2 rounded-lg transition-all duration-300 ${
                  isNow 
                    ? 'bg-blue-500/10 border border-blue-500/30' 
                    : 'hover:bg-slate-900/50'
                }`}
              >
                {/* Time */}
                <div className="flex flex-col items-center min-w-[48px]">
                  <span className={`text-xs font-mono font-medium ${
                    isNow ? 'text-blue-400' : isPast ? 'text-slate-600' : 'text-emerald-400'
                  }`}>
                    {moment(event.event_time).format('HH:mm')}
                  </span>
                  <span className="text-[10px] text-slate-600">
                    {moment(event.event_time).format('MM/DD')}
                  </span>
                </div>
                
                {/* Importance indicator */}
                <div className={`w-1.5 h-1.5 rounded-full ${importanceColors[event.importance]}`} />
                
                {/* Flag */}
                <span className="text-lg">{countryFlags[event.country] || '🌍'}</span>
                
                {/* Event name */}
                <span className="text-sm text-white truncate flex-1">{event.event_name}</span>
                
                {/* Impact badge (for high impact) */}
                {event.importance === 'high' && (
                  <Badge className="bg-red-500/10 text-red-400 text-[10px] border-red-500/20">
                    {importanceLabels[event.importance]}
                  </Badge>
                )}
                
                {/* Live indicator */}
                {isNow && (
                  <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                )}
              </div>
            );
          })}
          
          <Link 
            to={createPageUrl('Calendar')}
            className="block text-center text-sm text-blue-400 hover:text-blue-300 py-2 transition-colors group"
          >
            <span className="border-b border-blue-400/0 group-hover:border-blue-400/50">
              مشاهده تقویم کامل ←
            </span>
          </Link>
        </>
      )}
    </div>
  );
}