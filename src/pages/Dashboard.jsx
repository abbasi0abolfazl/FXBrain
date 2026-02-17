import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, Plus, Check, X, Newspaper, Calendar, Bell, 
  LineChart, LayoutGrid, Grip, Zap, Clock
} from 'lucide-react';
import MarketTicker from '@/components/dashboard/MarketTicker';
import DashboardWidget from '@/components/dashboard/DashboardWidget';
import NewsWidget from '@/components/dashboard/widgets/NewsWidget';
import CalendarWidget from '@/components/dashboard/widgets/CalendarWidget';
import AlertsWidget from '@/components/dashboard/widgets/AlertsWidget';
import ChartWidget from '@/components/dashboard/widgets/ChartWidget';
import SignalsWidget from '@/components/dashboard/widgets/SignalsWidget';
import StatsCard from '@/components/dashboard/StatsCard';
import moment from 'moment';

// API base URL
const API_BASE_URL = 'http://localhost:8000';

// Map آیکون‌ها
const iconMap = {
  Zap: Zap,
  Newspaper: Newspaper,
  Calendar: Calendar,
  Bell: Bell,
  LineChart: LineChart,
  LayoutGrid: LayoutGrid
};

// API service for dashboard
const dashboardService = {
  async getConfig() {
    const response = await fetch(`${API_BASE_URL}/api/dashboard/config`);
    return response.json();
  },

  async getAvailableWidgets() {
    const response = await fetch(`${API_BASE_URL}/api/dashboard/widgets`);
    return response.json();
  },

  async getDefaultWidgets() {
    const response = await fetch(`${API_BASE_URL}/api/dashboard/defaults`);
    return response.json();
  },

  async getUserDashboard(userId = 1) {
    const response = await fetch(`${API_BASE_URL}/api/dashboard/user/${userId}`);
    return response.json();
  },

  async saveUserDashboard(userId, data) {
    const response = await fetch(`${API_BASE_URL}/api/dashboard/user/${userId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  },

  async getWidgetData(widgetId) {
    const response = await fetch(`${API_BASE_URL}/api/dashboard/widgets/${widgetId}/data`);
    return response.json();
  },

  async getStats() {
    const response = await fetch(`${API_BASE_URL}/api/dashboard/stats`);
    return response.json();
  }
};

export default function Dashboard() {
  const [isEditing, setIsEditing] = useState(false);
  const [activeWidgets, setActiveWidgets] = useState([]);
  const [widgetConfigs, setWidgetConfigs] = useState({});
  const queryClient = useQueryClient();

  // دریافت کانفیگ صفحه
  const { data: pageConfig = {} } = useQuery({
    queryKey: ['dashboard-config'],
    queryFn: () => dashboardService.getConfig(),
  });

  // دریافت ویجت‌های موجود
  const { data: availableWidgets = [] } = useQuery({
    queryKey: ['dashboard-widgets'],
    queryFn: async () => {
      const widgets = await dashboardService.getAvailableWidgets();
      return widgets.map(w => ({ ...w, icon: iconMap[w.icon] || LayoutGrid }));
    },
  });

  // دریافت ویجت‌های پیش‌فرض
  const { data: defaultWidgets = [] } = useQuery({
    queryKey: ['dashboard-defaults'],
    queryFn: () => dashboardService.getDefaultWidgets(),
  });

  // دریافت داشبورد کاربر (با userId پیش‌فرض ۱)
  const { data: userDashboard } = useQuery({
    queryKey: ['user-dashboard'],
    queryFn: () => dashboardService.getUserDashboard(1),
    refetchInterval: 30000, // هر ۳۰ ثانیه برای بروزرسانی
  });

  // دریافت آمار کلی
  const { data: stats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => dashboardService.getStats(),
    refetchInterval: 30000,
  });

  // مقداردهی اولیه ویجت‌ها
  useEffect(() => {
    if (userDashboard?.widgets) {
      // مرتب‌سازی بر اساس order
      const sortedWidgets = userDashboard.widgets
        .sort((a, b) => a.order - b.order)
        .map(w => w.id);
      setActiveWidgets(sortedWidgets);
      
      // ذخیره کانفیگ ویجت‌ها
      const configs = {};
      userDashboard.widgets.forEach(w => {
        configs[w.id] = w.config || {};
      });
      setWidgetConfigs(configs);
    } else if (defaultWidgets.length > 0 && activeWidgets.length === 0) {
      setActiveWidgets(defaultWidgets);
    }
  }, [userDashboard, defaultWidgets]);

  // ذخیره تغییرات
  const saveMutation = useMutation({
    mutationFn: (widgets) => {
      const widgetList = widgets.map((id, index) => ({
        id,
        order: index,
        config: widgetConfigs[id] || {}
      }));
      return dashboardService.saveUserDashboard(1, { widgets: widgetList });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
  });

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    
    const items = Array.from(activeWidgets);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setActiveWidgets(items);
  };

  const toggleWidget = (widgetId) => {
    setActiveWidgets(prev => 
      prev.includes(widgetId) 
        ? prev.filter(id => id !== widgetId)
        : [...prev, widgetId]
    );
  };

  const updateWidgetConfig = (widgetId, config) => {
    setWidgetConfigs(prev => ({
      ...prev,
      [widgetId]: { ...prev[widgetId], ...config }
    }));
  };

  const handleSave = () => {
    saveMutation.mutate(activeWidgets);
    setIsEditing(false);
  };

  const handleCancel = () => {
    // برگشت به حالت قبلی
    if (userDashboard?.widgets) {
      const sortedWidgets = userDashboard.widgets
        .sort((a, b) => a.order - b.order)
        .map(w => w.id);
      setActiveWidgets(sortedWidgets);
    }
    setIsEditing(false);
  };

  const renderWidgetContent = (widget) => {
    const config = widgetConfigs[widget.id] || {};
    
    switch (widget.type) {
      case 'signals':
        return <SignalsWidget config={config} />;
      case 'news':
        return <NewsWidget config={config} />;
      case 'calendar':
        return <CalendarWidget config={config} />;
      case 'alerts':
        return <AlertsWidget config={config} />;
      case 'chart':
        return <ChartWidget pair={config.pair || widget.config?.pair} />;
      default:
        return null;
    }
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
              <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/30">
                <LayoutGrid className="w-7 h-7 text-blue-400" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">
                  {pageConfig.pageTitle || 'داشبورد معاملاتی'}
                </h1>
                <p className="text-slate-400 text-sm">
                  {pageConfig.pageSubtitle || 'نمایش خلاصه‌ای از وضعیت بازار، سیگنال‌ها و هشدارها'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">

              {isEditing ? (
                <>
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    className="border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-white"
                  >
                    <X className="w-4 h-4 ml-2" />
                    {pageConfig.cancelButton || 'انصراف'}
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={saveMutation.isPending}
                    className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/20"
                  >
                    {saveMutation.isPending ? (
                      <>
                        <div className="w-4 h-4 ml-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        در حال ذخیره...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4 ml-2" />
                        {pageConfig.saveButton || 'ذخیره تغییرات'}
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => setIsEditing(true)}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg shadow-blue-500/20"
                >
                  <Settings className="w-4 h-4 ml-2" />
                  {pageConfig.editButton || 'ویرایش داشبورد'}
                </Button>
              )}
            </div>
          </div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            <StatsCard
              title="سیگنال‌های فعال"
              value={stats?.active_signals || 0}
              icon={Zap}
              color="orange"
              trend={12}
            />
            <StatsCard
              title="رویدادهای امروز"
              value={stats?.today_events || 0}
              icon={Calendar}
              color="blue"
              trend={-5}
            />
            <StatsCard
              title="هشدارهای فعال"
              value={stats?.active_alerts || 0}
              icon={Bell}
              color="purple"
              trend={8}
            />
            <StatsCard
              title="اخبار مهم"
              value={stats?.important_news || 0}
              icon={Newspaper}
              color="green"
              trend={15}
            />
          </motion.div>
        </motion.div>

        {/* Widget Selector (when editing) */}
        <AnimatePresence>
          {isEditing && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8 overflow-hidden"
            >
              <div className="p-4 rounded-xl bg-slate-800/70 border border-slate-700/70 backdrop-blur-sm">
                <p className="text-sm text-slate-400 mb-3">
                  {pageConfig.widgetSelectorLabel || 'ویجت‌های موجود'}
                </p>
                <div className="flex flex-wrap gap-2">
                  {availableWidgets.map(widget => {
                    const isActive = activeWidgets.includes(widget.id);
                    const Icon = widget.icon;
                    
                    return (
                      <Button
                        key={widget.id}
                        variant={isActive ? 'default' : 'outline'}
                        onClick={() => toggleWidget(widget.id)}
                        size="sm"
                        className={`rounded-lg transition-all duration-200 ${
                          isActive
                            ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/20 hover:from-blue-700 hover:to-blue-800'
                            : 'border-slate-700 bg-slate-800/40 text-slate-300 hover:bg-slate-700/60 hover:text-white hover:border-slate-600'
                        }`}
                      >
                        <Icon className="w-4 h-4 ml-2" />
                        {widget.title}
                        {isActive && <Check className="w-3 h-3 mr-2" />}
                      </Button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Widgets Grid */}
        {activeWidgets.length > 0 ? (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="dashboard" direction="vertical" isDropDisabled={!isEditing}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="grid md:grid-cols-2 gap-6"
                >
                  {activeWidgets.map((widgetId, index) => {
                    const widget = availableWidgets.find(w => w.id === widgetId);
                    if (!widget) return null;

                    return (
                      <Draggable 
                        key={widgetId} 
                        draggableId={widgetId} 
                        index={index} 
                        isDragDisabled={!isEditing}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`${snapshot.isDragging ? 'z-50' : ''}`}
                            style={{
                              ...provided.draggableProps.style,
                              minHeight: widget.min_height || 300
                            }}
                          >
                            <DashboardWidget
                              id={widget.id}
                              title={widget.title}
                              icon={widget.icon}
                              onRemove={() => toggleWidget(widgetId)}
                              dragHandleProps={provided.dragHandleProps}
                              isEditing={isEditing}
                              minHeight={widget.min_height}
                            >
                              {renderWidgetContent(widget)}
                            </DashboardWidget>
                          </div>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 flex items-center justify-center">
              <LayoutGrid className="w-8 h-8 sm:w-10 sm:h-10 text-slate-600" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {pageConfig.emptyTitle || 'داشبورد شما خالی است'}
            </h3>
            <p className="text-slate-400 mb-6">
              {pageConfig.emptySubtitle || 'با افزودن ویجت‌ها، داشبورد خود را شخصی‌سازی کنید'}
            </p>
            <Button
              onClick={() => setIsEditing(true)}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg shadow-blue-500/20"
            >
              <Plus className="w-4 h-4 ml-2" />
              {pageConfig.addWidgetButton || 'افزودن ویجت'}
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}