import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar as CalendarIcon, Filter, Clock, AlertCircle } from 'lucide-react';
import EventRow from '@/components/calendar/EventRow';
import MarketTicker from '@/components/dashboard/MarketTicker';
import moment from 'moment';
import { getImpactColor } from '@/theme/colors';

// API base URL
const API_BASE_URL = 'http://localhost:8000';

// API service for calendar
const calendarService = {
  async getCalendarConfig() {
    const response = await fetch(`${API_BASE_URL}/api/calendar/config`);
    return response.json();
  },

  async getCalendarFilters() {
    const response = await fetch(`${API_BASE_URL}/api/calendar/filters`);
    return response.json();
  },

  async getEvents(filters = {}) {
    const params = new URLSearchParams();
    if (filters.time) params.append('time_filter', filters.time);
    if (filters.importance && filters.importance !== 'all') params.append('importance', filters.importance);
    if (filters.country && filters.country !== 'همه') params.append('country', filters.country);
    params.append('limit', '100');
    
    const response = await fetch(`${API_BASE_URL}/api/calendar/events?${params}`);
    return response.json();
  }
};

const timeFilters = [
  { value: 'today', label: 'امروز' },
  { value: 'week', label: 'این هفته' },
  { value: 'all', label: 'همه' },
];

const importanceFilters = [
  { value: 'all', label: 'همه' },
  { value: 'high', label: 'زیاد' },
  { value: 'medium', label: 'متوسط' },
  { value: 'low', label: 'کم' },
];

const countryFilters = ['همه', 'USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD'];

export default function Calendar() {
  const [timeFilter, setTimeFilter] = useState('all');
  const [importanceFilter, setImportanceFilter] = useState('all');
  const [countryFilter, setCountryFilter] = useState('همه');

  // اتوماتیک رفرش هر 10 ثانیه
  const { data: events = [], isLoading } = useQuery({
    queryKey: ['calendar-events', timeFilter, importanceFilter, countryFilter],
    queryFn: () => calendarService.getEvents({
      time: timeFilter,
      importance: importanceFilter,
      country: countryFilter
    }),
    refetchInterval: 10000, // هر 10 ثانیه
  });

  // فیلتر کردن رویدادها - نسخه اصلاح شده
  const filteredEvents = React.useMemo(() => {
    if (!events || events.length === 0) return [];
    
    return events.filter(event => {
      try {
        const eventDate = moment(event.event_time);
        const now = moment();
        
        // اعمال فیلتر زمان
        let matchesTime = true;
        if (timeFilter === 'today') {
          // فقط روز را چک می‌کنیم، نه سال
          matchesTime = eventDate.date() === now.date() && 
                       eventDate.month() === now.month();
        } else if (timeFilter === 'week') {
          // هفته جاری را چک می‌کنیم
          const startOfWeek = now.startOf('week');
          const endOfWeek = now.endOf('week');
          matchesTime = eventDate.isBetween(startOfWeek, endOfWeek, null, '[]');
        }
        
        const matchesImportance = importanceFilter === 'all' || event.importance === importanceFilter;
        const matchesCountry = countryFilter === 'همه' || event.country === countryFilter;
        
        return matchesTime && matchesImportance && matchesCountry;
      } catch (error) {
        console.error('Error filtering event:', error, event);
        return false;
      }
    });
  }, [events, timeFilter, importanceFilter, countryFilter]);

  const upcomingHighImpact = React.useMemo(() => {
    return filteredEvents.filter(
      e => e.importance === 'high' && moment(e.event_time).isAfter(moment())
    ).slice(0, 3);
  }, [filteredEvents]);

  // Window box برای نمایش فیلترهای انتخاب شده
  const FilterWindow = () => (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-xl bg-slate-800/70 border border-slate-700/70 backdrop-blur-sm mb-6"
    >
      <div className="flex items-center gap-3 mb-3">
        <Filter className="w-5 h-5 text-emerald-400" />
        <span className="text-sm font-medium text-slate-300">فیلترهای فعال</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {timeFilter !== 'all' && (
          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/40 px-3 py-1">
            <CalendarIcon className="w-3 h-3 ml-1" />
            زمان: {timeFilters.find(f => f.value === timeFilter)?.label}
          </Badge>
        )}
        {importanceFilter !== 'all' && (
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/40 px-3 py-1">
            اهمیت: {importanceFilters.find(f => f.value === importanceFilter)?.label}
          </Badge>
        )}
        {countryFilter !== 'همه' && (
          <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/40 px-3 py-1">
            کشور: {countryFilter}
          </Badge>
        )}
        {timeFilter === 'all' && importanceFilter === 'all' && countryFilter === 'همه' && (
          <span className="text-slate-400 text-sm">بدون فیلتر (نمایش همه)</span>
        )}
      </div>
    </motion.div>
  );

  // تابع برای نمایش تاریخ آزمایشی
  const renderDebugInfo = () => {
    if (!events || events.length === 0) return null;
    
    return (
      <div className="mb-4 p-3 bg-slate-800/50 rounded-lg text-xs text-slate-400">
        <div className="font-semibold mb-1">اطلاعات دیباگ:</div>
        <div>تعداد رویدادهای دریافتی: {events.length}</div>
        <div>تعداد رویدادهای فیلتر شده: {filteredEvents.length}</div>
        <div>فیلتر زمان: {timeFilter}</div>
        {events.slice(0, 2).map((event, i) => (
          <div key={i}>
            رویداد {i+1}: {event.event_name} - تاریخ: {event.event_time}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <MarketTicker />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-500/30">
                <CalendarIcon className="w-7 h-7 text-emerald-400" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">تقویم اقتصادی</h1>
                <p className="text-slate-400 text-sm">رویدادهای مهم اقتصادی و پیش‌بینی نوسانات - بروزرسانی خودکار</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Window Box برای فیلترهای فعال */}
        <FilterWindow />

        {/* نمایش اطلاعات دیباگ برای تست */}
        {/* {process.env.NODE_ENV === 'development' && renderDebugInfo()} */}

        {/* Upcoming High Impact Alert */}
        {upcomingHighImpact.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 rounded-2xl bg-gradient-to-r from-red-500/10 to-rose-500/10 border border-red-500/30"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-red-500/20 text-red-400">
                <AlertCircle className="w-5 h-5" />
              </div>
              <span className="text-red-400 font-semibold">رویدادهای پراهمیت پیش رو</span>
            </div>
            <div className="flex flex-wrap gap-3">
              {upcomingHighImpact.map((event, i) => {
                const impactColor = getImpactColor('high');
                return (
                  <Badge 
                    key={i} 
                    className={`bg-gradient-to-r ${impactColor.light} ${impactColor.text} ${impactColor.border} border px-3 py-1`}
                  >
                    <Clock className="w-3 h-3 ml-1" />
                    {event.country} - {event.event_name} ({moment(event.event_time).format('HH:mm')})
                  </Badge>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6 mb-8"
        >
          {/* Filters Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Time Filter */}
            <div>
              <div className="text-slate-300 text-sm mb-2 block">زمان</div>
              <div className="flex flex-wrap gap-2">
                {timeFilters.map(filter => (
                  <Button
                    key={filter.value}
                    variant={timeFilter === filter.value ? 'default' : 'outline'}
                    onClick={() => setTimeFilter(filter.value)}
                    size="sm"
                    className={`rounded-lg transition-all duration-200 ${
                      timeFilter === filter.value
                        ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-lg shadow-emerald-500/20 hover:from-emerald-700 hover:to-emerald-800'
                        : 'border-slate-700 bg-slate-800/40 text-slate-300 hover:bg-slate-700/60 hover:text-white hover:border-slate-600'
                    }`}
                  >
                    {filter.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Importance Filter */}
            <div>
              <div className="text-slate-300 text-sm mb-2 block">اهمیت</div>
              <div className="flex flex-wrap gap-2">
                {importanceFilters.map(filter => (
                  <Button
                    key={filter.value}
                    variant={importanceFilter === filter.value ? 'default' : 'outline'}
                    onClick={() => setImportanceFilter(filter.value)}
                    size="sm"
                    className={`rounded-lg transition-all duration-200 ${
                      importanceFilter === filter.value
                        ? filter.value === 'high'
                          ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-500/20 hover:from-red-700 hover:to-red-800'
                          : filter.value === 'medium'
                          ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-lg shadow-amber-500/20 hover:from-amber-700 hover:to-amber-800'
                          : 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-lg shadow-emerald-500/20 hover:from-emerald-700 hover:to-emerald-800'
                        : 'border-slate-700 bg-slate-800/40 text-slate-300 hover:bg-slate-700/60 hover:text-white hover:border-slate-600'
                    }`}
                  >
                    {filter.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Country Filter */}
            <div>
              <div className="text-slate-300 text-sm mb-2 block">کشور</div>
              <div className="flex flex-wrap gap-2">
                {countryFilters.map(country => (
                  <Button
                    key={country}
                    variant={countryFilter === country ? 'default' : 'outline'}
                    onClick={() => setCountryFilter(country)}
                    size="sm"
                    className={`rounded-lg transition-all duration-200 ${
                      countryFilter === country
                        ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg shadow-purple-500/20 hover:from-purple-700 hover:to-purple-800'
                        : 'border-slate-700 bg-slate-800/40 text-slate-300 hover:bg-slate-700/60 hover:text-white hover:border-slate-600'
                    }`}
                  >
                    {country}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Events Count */}
        {!isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-between mb-6"
          >
            <div className="text-slate-400 text-sm">
              نمایش <span className="text-white font-medium">{filteredEvents.length}</span> رویداد
            </div>
            {filteredEvents.length > 0 && (
              <div className="text-xs text-slate-500">
                آخرین بروزرسانی: {new Date().toLocaleTimeString('fa-IR')}
              </div>
            )}
          </motion.div>
        )}

        {/* Events Table */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl bg-slate-800/30 border border-slate-700/50 overflow-hidden"
        >
          {isLoading ? (
            <div className="p-6 space-y-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="flex gap-4">
                  <Skeleton className="h-6 w-16 bg-slate-700/50" />
                  <Skeleton className="h-6 w-20 bg-slate-700/50" />
                  <Skeleton className="h-6 flex-1 bg-slate-700/50" />
                  <Skeleton className="h-6 w-16 bg-slate-700/50" />
                </div>
              ))}
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-16 sm:py-20">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 flex items-center justify-center">
                <CalendarIcon className="w-8 h-8 sm:w-10 sm:h-10 text-slate-600" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">رویدادی یافت نشد</h3>
              <p className="text-slate-400">
                {events.length > 0 
                  ? `دریافت ${events.length} رویداد، اما با فیلترهای اعمال شده مطابقت ندارد.`
                  : 'در حال حاضر رویدادی در سیستم موجود نیست.'}
              </p>
              {/* پیشنهاد تغییر فیلتر */}
              <div className="mt-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setTimeFilter('all');
                    setImportanceFilter('all');
                    setCountryFilter('همه');
                  }}
                  className="border-slate-600 text-slate-400 hover:bg-slate-800"
                >
                  حذف همه فیلترها
                </Button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700/50 bg-slate-800/50">
                    <th className="py-4 px-4 text-right text-sm font-medium text-slate-400">زمان</th>
                    <th className="py-4 px-4 text-right text-sm font-medium text-slate-400">کشور</th>
                    <th className="py-4 px-4 text-right text-sm font-medium text-slate-400">رویداد</th>
                    <th className="py-4 px-4 text-right text-sm font-medium text-slate-400">اهمیت</th>
                    <th className="py-4 px-4 text-right text-sm font-medium text-slate-400">پیش‌بینی</th>
                    <th className="py-4 px-4 text-right text-sm font-medium text-slate-400">قبلی</th>
                    <th className="py-4 px-4 text-right text-sm font-medium text-slate-400">واقعی</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEvents.map((event, i) => (
                    <motion.tr
                      key={event.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      whileHover={{ 
                        backgroundColor: 'rgba(30, 41, 59, 0.4)',
                        transition: { duration: 0.2 }
                      }}
                    >
                      <EventRow event={event} index={i} />
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}