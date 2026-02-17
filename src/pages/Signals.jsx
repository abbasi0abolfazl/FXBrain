import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Zap, Filter, Crown, TrendingUp, TrendingDown, Clock } from 'lucide-react';
import SignalCard from '@/components/signals/SignalCard';
import MarketTicker from '@/components/dashboard/MarketTicker';
import moment from 'moment';

// API base URL
const API_BASE_URL = 'http://localhost:8000';

// API service for signals
const signalsService = {
  async getSignalsConfig() {
    const response = await fetch(`${API_BASE_URL}/api/signals/config`);
    return response.json();
  },

  async getSignals(filters = {}) {
    const params = new URLSearchParams();
    if (filters.status && filters.status !== 'all') params.append('status', filters.status);
    if (filters.signal_type && filters.signal_type !== 'all') params.append('signal_type', filters.signal_type);
    if (filters.pair && filters.pair !== 'all') params.append('pair', filters.pair);
    params.append('limit', '50');
    
    const response = await fetch(`${API_BASE_URL}/api/signals?${params}`);
    return response.json();
  },

  async getSignalsStats() {
    const response = await fetch(`${API_BASE_URL}/api/signals/stats`);
    return response.json();
  }
};

const statusFilters = [
  { value: 'all', label: 'همه' },
  { value: 'active', label: 'فعال' },
  { value: 'hit_tp', label: 'سود' },
  { value: 'hit_sl', label: 'ضرر' },
];

const typeFilters = [
  { value: 'all', label: 'همه' },
  { value: 'buy', label: 'خرید' },
  { value: 'sell', label: 'فروش' },
];

export default function Signals() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  // دریافت سیگنال‌ها با رفرش خودکار هر 30 ثانیه
  const { 
    data: signals = [], 
    isLoading,
    refetch 
  } = useQuery({
    queryKey: ['signals', statusFilter, typeFilter],
    queryFn: () => signalsService.getSignals({
      status: statusFilter,
      signal_type: typeFilter
    }),
    refetchInterval: 30000, // هر 30 ثانیه
  });

  // دریافت آمار
  const { data: stats } = useQuery({
    queryKey: ['signals-stats'],
    queryFn: () => signalsService.getSignalsStats(),
    refetchInterval: 30000,
  });

  // محاسبات آماری (اگر stats از API نیامد)
  const activeSignals = signals.filter(s => s.status === 'active');
  const successRate = stats?.success_rate || (
    signals.length > 0 
      ? ((signals.filter(s => s.status === 'hit_tp').length / 
         Math.max(signals.filter(s => s.status !== 'active').length, 1)) * 100).toFixed(0)
      : 0
  );

  // ویندوز باکس برای نمایش فیلترهای فعال
  const FilterWindow = () => (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-xl bg-slate-800/70 border border-slate-700/70 backdrop-blur-sm mb-6"
    >
      <div className="flex items-center gap-3 mb-3">
        <Filter className="w-5 h-5 text-amber-400" />
        <span className="text-sm font-medium text-slate-300">فیلترهای فعال</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {statusFilter !== 'all' && (
          <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/40 px-3 py-1">
            وضعیت: {statusFilters.find(f => f.value === statusFilter)?.label}
          </Badge>
        )}
        {typeFilter !== 'all' && (
          <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/40 px-3 py-1">
            نوع: {typeFilters.find(f => f.value === typeFilter)?.label}
          </Badge>
        )}
        {statusFilter === 'all' && typeFilter === 'all' && (
          <span className="text-slate-400 text-sm">بدون فیلتر (نمایش همه)</span>
        )}
      </div>
    </motion.div>
  );

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
              <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30">
                <Zap className="w-7 h-7 text-amber-400" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">سیگنال‌های معاملاتی AI</h1>
                <p className="text-slate-400 text-sm">سیگنال‌های هوشمند بر اساس تحلیل اخبار، تقویم و تکنیکال</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 px-3 py-1">
                <Crown className="w-3 h-3 ml-1" />
                ویژه پلن حرفه‌ای
              </Badge>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <div className="rounded-2xl bg-slate-800/50 border border-slate-700/50 p-4 text-center">
            <p className="text-3xl font-bold text-white">{stats?.active || activeSignals.length}</p>
            <p className="text-sm text-slate-400">سیگنال فعال</p>
          </div>
          <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/30 p-4 text-center">
            <p className="text-3xl font-bold text-emerald-400">{stats?.success_rate || successRate}%</p>
            <p className="text-sm text-slate-400">نرخ موفقیت</p>
          </div>
          <div className="rounded-2xl bg-blue-500/10 border border-blue-500/30 p-4 text-center">
            <p className="text-3xl font-bold text-blue-400">{stats?.buy || signals.filter(s => s.signal_type === 'buy').length}</p>
            <p className="text-sm text-slate-400">سیگنال خرید</p>
          </div>
          <div className="rounded-2xl bg-red-500/10 border border-red-500/30 p-4 text-center">
            <p className="text-3xl font-bold text-red-400">{stats?.sell || signals.filter(s => s.signal_type === 'sell').length}</p>
            <p className="text-sm text-slate-400">سیگنال فروش</p>
          </div>
        </motion.div>

        {/* Window Box برای فیلترهای فعال */}
        <FilterWindow />

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Status Filter */}
            <div>
              <div className="text-slate-300 text-sm mb-2 block">وضعیت</div>
              <div className="flex flex-wrap gap-2">
                {statusFilters.map(filter => (
                  <Button
                    key={filter.value}
                    variant={statusFilter === filter.value ? 'default' : 'outline'}
                    onClick={() => setStatusFilter(filter.value)}
                    size="sm"
                    className={`rounded-lg transition-all duration-200 ${
                      statusFilter === filter.value
                        ? filter.value === 'active'
                          ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-lg shadow-amber-500/20 hover:from-amber-700 hover:to-amber-800'
                          : filter.value === 'hit_tp'
                          ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-lg shadow-emerald-500/20 hover:from-emerald-700 hover:to-emerald-800'
                          : 'bg-gradient-to-r from-rose-600 to-rose-700 text-white shadow-lg shadow-rose-500/20 hover:from-rose-700 hover:to-rose-800'
                        : 'border-slate-700 bg-slate-800/40 text-slate-300 hover:bg-slate-700/60 hover:text-white hover:border-slate-600'
                    }`}
                  >
                    {filter.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Type Filter */}
            <div>
              <div className="text-slate-300 text-sm mb-2 block">نوع سیگنال</div>
              <div className="flex flex-wrap gap-2">
                {typeFilters.map(filter => (
                  <Button
                    key={filter.value}
                    variant={typeFilter === filter.value ? 'default' : 'outline'}
                    onClick={() => setTypeFilter(filter.value)}
                    size="sm"
                    className={`rounded-lg transition-all duration-200 ${
                      typeFilter === filter.value
                        ? filter.value === 'buy'
                          ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-lg shadow-emerald-500/20 hover:from-emerald-700 hover:to-emerald-800'
                          : 'bg-gradient-to-r from-rose-600 to-rose-700 text-white shadow-lg shadow-rose-500/20 hover:from-rose-700 hover:to-rose-800'
                        : 'border-slate-700 bg-slate-800/40 text-slate-300 hover:bg-slate-700/60 hover:text-white hover:border-slate-600'
                    }`}
                  >
                    {filter.value === 'buy' && <TrendingUp className="w-3 h-3 ml-1" />}
                    {filter.value === 'sell' && <TrendingDown className="w-3 h-3 ml-1" />}
                    {filter.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Signals Count */}
        {!isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-between mb-6"
          >
            <div className="text-slate-400 text-sm">
              نمایش <span className="text-white font-medium">{signals.length}</span> سیگنال
            </div>
            {signals.length > 0 && (
              <div className="text-xs text-slate-500">
                آخرین بروزرسانی: {moment().format('HH:mm:ss')}
              </div>
            )}
          </motion.div>
        )}

        {/* Signals Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-64 bg-slate-800/50 rounded-2xl" />
            ))}
          </div>
        ) : signals.length === 0 ? (
          <div className="text-center py-16 sm:py-20">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 flex items-center justify-center">
              <Zap className="w-8 h-8 sm:w-10 sm:h-10 text-slate-600" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">سیگنالی یافت نشد</h3>
            <p className="text-slate-400">
              با فیلترهای اعمال شده سیگنالی وجود ندارد.
            </p>
            <div className="mt-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setStatusFilter('all');
                  setTypeFilter('all');
                }}
                className="border-slate-600 text-slate-400 hover:bg-slate-800"
              >
                حذف همه فیلترها
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {signals.map((signal, i) => (
              <SignalCard key={signal.id} signal={signal} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}