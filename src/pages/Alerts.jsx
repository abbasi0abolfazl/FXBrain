import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Bell, Plus, BellOff, Clock, Filter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import AlertCard from '@/components/alerts/AlertCard';
import CreateAlertModal from '@/components/alerts/CreateAlertModal';
import MarketTicker from '@/components/dashboard/MarketTicker';
import moment from 'moment';

// API base URL
const API_BASE_URL = 'http://localhost:8000';

// API service for alerts
const alertsService = {
  async getConfig() {
    const response = await fetch(`${API_BASE_URL}/api/alerts/config`);
    return response.json();
  },

  async getAlerts(filters = {}) {
    const params = new URLSearchParams();
    if (filters.is_active !== undefined) params.append('is_active', filters.is_active);
    if (filters.currency_pair && filters.currency_pair !== 'all') params.append('currency_pair', filters.currency_pair);
    params.append('limit', '50');
    
    const response = await fetch(`${API_BASE_URL}/api/alerts?${params}`);
    return response.json();
  },

  async getStats() {
    const response = await fetch(`${API_BASE_URL}/api/alerts/stats`);
    return response.json();
  },

  async getConditions() {
    const response = await fetch(`${API_BASE_URL}/api/alerts/conditions`);
    return response.json();
  },

  async createAlert(data) {
    const response = await fetch(`${API_BASE_URL}/api/alerts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  },

  async updateAlert(id, data) {
    const response = await fetch(`${API_BASE_URL}/api/alerts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  },

  async deleteAlert(id) {
    const response = await fetch(`${API_BASE_URL}/api/alerts/${id}`, {
      method: 'DELETE'
    });
    return response.json();
  }
};

// فیلترهای وضعیت
const statusFilters = [
  { value: 'all', label: 'همه' },
  { value: 'active', label: 'فعال' },
  { value: 'inactive', label: 'غیرفعال' },
];

export default function Alerts() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const queryClient = useQueryClient();

  // دریافت کانفیگ
  const { data: pageConfig = {} } = useQuery({
    queryKey: ['alerts-config'],
    queryFn: () => alertsService.getConfig(),
  });

  // دریافت شرایط (برای مقادیر پیش‌فرض)
  const { data: conditions } = useQuery({
    queryKey: ['alerts-conditions'],
    queryFn: () => alertsService.getConditions(),
  });

  // دریافت هشدارها با رفرش خودکار هر 30 ثانیه
  const { 
    data: alerts = [], 
    isLoading,
    refetch 
  } = useQuery({
    queryKey: ['alerts', statusFilter],
    queryFn: () => alertsService.getAlerts({
      is_active: statusFilter === 'all' ? undefined : statusFilter === 'active'
    }),
    refetchInterval: 30000, // هر 30 ثانیه
  });

  // دریافت آمار
  const { data: stats } = useQuery({
    queryKey: ['alerts-stats'],
    queryFn: () => alertsService.getStats(),
    refetchInterval: 30000,
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: (data) => alertsService.createAlert(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
      queryClient.invalidateQueries({ queryKey: ['alerts-stats'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => alertsService.updateAlert(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
      queryClient.invalidateQueries({ queryKey: ['alerts-stats'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => alertsService.deleteAlert(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
      queryClient.invalidateQueries({ queryKey: ['alerts-stats'] });
    },
  });

  const handleToggle = (alert) => {
    updateMutation.mutate({
      id: alert.id,
      data: { is_active: !alert.is_active }
    });
  };

  const handleDelete = (alert) => {
    deleteMutation.mutate(alert.id);
  };

  // جدا کردن هشدارهای فعال و غیرفعال
  const activeAlerts = alerts.filter(a => a.is_active);
  const inactiveAlerts = alerts.filter(a => !a.is_active);

  // ویندوز باکس برای نمایش فیلترهای فعال
  const FilterWindow = () => (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-xl bg-slate-800/70 border border-slate-700/70 backdrop-blur-sm mb-6"
    >
      <div className="flex items-center gap-3 mb-3">
        <Filter className="w-5 h-5 text-blue-400" />
        <span className="text-sm font-medium text-slate-300">فیلترهای فعال</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {statusFilter !== 'all' && (
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/40 px-3 py-1">
            وضعیت: {statusFilters.find(f => f.value === statusFilter)?.label}
          </Badge>
        )}
        {statusFilter === 'all' && (
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
              <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/30">
                <Bell className="w-7 h-7 text-blue-400" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">
                  {pageConfig.pageTitle || 'هشدارهای هوشمند'}
                </h1>
                <p className="text-slate-400 text-sm">
                  {pageConfig.pageSubtitle || 'دریافت اعلان برای رویدادهای مهم بازار'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              
              <Button
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl px-6 shadow-lg shadow-blue-500/20"
              >
                <Plus className="w-5 h-5 ml-2" />
                {pageConfig.newAlertButton || 'هشدار جدید'}
              </Button>
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
            <p className="text-3xl font-bold text-white">{stats?.total || alerts.length}</p>
            <p className="text-sm text-slate-400">{pageConfig.stats?.total || 'مجموع هشدارها'}</p>
          </div>
          <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/30 p-4 text-center">
            <p className="text-3xl font-bold text-emerald-400">{stats?.active || activeAlerts.length}</p>
            <p className="text-sm text-slate-400">{pageConfig.stats?.active || 'فعال'}</p>
          </div>
          <div className="rounded-2xl bg-slate-800/50 border border-slate-700/50 p-4 text-center">
            <p className="text-3xl font-bold text-slate-400">{stats?.inactive || inactiveAlerts.length}</p>
            <p className="text-sm text-slate-400">{pageConfig.stats?.inactive || 'غیرفعال'}</p>
          </div>
          <div className="rounded-2xl bg-blue-500/10 border border-blue-500/30 p-4 text-center">
            <p className="text-3xl font-bold text-blue-400">{stats?.triggered || 0}</p>
            <p className="text-sm text-slate-400">{pageConfig.stats?.triggered || 'شلیک شده'}</p>
          </div>
        </motion.div>

        {/* Status Filter */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-6"
        >
          <div className="text-slate-300 text-sm mb-2 block">فیلتر وضعیت</div>
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
                      ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-lg shadow-emerald-500/20'
                      : filter.value === 'inactive'
                      ? 'bg-gradient-to-r from-slate-600 to-slate-700 text-white shadow-lg shadow-slate-500/20'
                      : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/20'
                    : 'border-slate-700 bg-slate-800/40 text-slate-300 hover:bg-slate-700/60 hover:text-white hover:border-slate-600'
                }`}
              >
                {filter.label}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Window Box برای فیلترهای فعال */}
        <FilterWindow />

        {/* Alerts Count */}
        {!isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-between mb-6"
          >
            <div className="text-slate-400 text-sm">
              نمایش <span className="text-white font-medium">{alerts.length}</span> هشدار
            </div>
            {alerts.length > 0 && (
              <div className="text-xs text-slate-500">
                آخرین بروزرسانی: {moment().format('HH:mm:ss')}
              </div>
            )}
          </motion.div>
        )}

        {/* Alerts Content */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="rounded-2xl bg-slate-800/50 border border-slate-700/50 p-5">
                <Skeleton className="h-6 w-32 bg-slate-700 mb-4" />
                <Skeleton className="h-12 w-full bg-slate-700 mb-4" />
                <Skeleton className="h-6 w-24 bg-slate-700" />
              </div>
            ))}
          </div>
        ) : alerts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 sm:py-20"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 flex items-center justify-center">
              <BellOff className="w-8 h-8 sm:w-10 sm:h-10 text-slate-600" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {pageConfig.emptyTitle || 'هشداری وجود ندارد'}
            </h3>
            <p className="text-slate-400 mb-6">
              {pageConfig.emptySubtitle || 'با ایجاد هشدار، از نوسانات مهم بازار مطلع شوید'}
            </p>
            <Button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl shadow-lg shadow-blue-500/20"
            >
              <Plus className="w-5 h-5 ml-2" />
              {pageConfig.createFirstButton || 'ایجاد اولین هشدار'}
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-8">
            {/* Active Alerts */}
            {activeAlerts.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-emerald-400" />
                  {pageConfig.activeAlertsTitle || 'هشدارهای فعال'} ({activeAlerts.length})
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <AnimatePresence>
                    {activeAlerts.map((alert, i) => (
                      <AlertCard
                        key={alert.id}
                        alert={alert}
                        onToggle={handleToggle}
                        onDelete={handleDelete}
                        index={i}
                        conditions={conditions}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}

            {/* Inactive Alerts */}
            {inactiveAlerts.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-slate-400 mb-4 flex items-center gap-2">
                  <BellOff className="w-5 h-5" />
                  {pageConfig.inactiveAlertsTitle || 'هشدارهای غیرفعال'} ({inactiveAlerts.length})
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <AnimatePresence>
                    {inactiveAlerts.map((alert, i) => (
                      <AlertCard
                        key={alert.id}
                        alert={alert}
                        onToggle={handleToggle}
                        onDelete={handleDelete}
                        index={i}
                        conditions={conditions}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <CreateAlertModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={createMutation.mutateAsync}
        conditions={conditions}
      />
    </div>
  );
}