import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Search, Filter, Newspaper, Zap,
  AlertTriangle, TrendingUp, TrendingDown, Minus,
  BarChart3, Target, Clock, Globe,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import NewsCard from '@/components/news/NewsCard';
import MarketTicker from '@/components/dashboard/MarketTicker';
import { Label } from '@/components/ui/label';
import { 
  getImpactColor, 
  getSentimentColor, 
  getPredictionColor,
  getFilterButtonStyle 
} from '@/theme/colors';

// API base URL
const API_BASE_URL = 'http://localhost:8000';

// API service functions
const apiService = {
  async getNewsConfig() {
    const response = await fetch(`${API_BASE_URL}/api/news/config`);
    return response.json();
  },

  async getNewsFilters() {
    const response = await fetch(`${API_BASE_URL}/api/news/filters`);
    return response.json();
  },

  async getNews(filters = {}) {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.impact && filters.impact !== 'all') params.append('impact', filters.impact);
    if (filters.sentiment && filters.sentiment !== 'all') params.append('sentiment', filters.sentiment);
    if (filters.prediction && filters.prediction !== 'all') params.append('prediction', filters.prediction);
    params.append('limit', '50');
    
    const response = await fetch(`${API_BASE_URL}/api/news?${params}`);
    return response.json();
  },

  async getNewsStats() {
    // آمار دمو
    return {
      total: 24,
      bullish: 14,
      bearish: 7,
      neutral: 3,
      avgConfidence: 72,
      byImpact: {
        high: 8,
        medium: 12,
        low: 4
      }
    };
  }
};

// فیلترهای پیش‌فرض
const impactFilters = [
  { value: 'all', label: 'همه' },
  { value: 'high', label: 'تأثیر بالا' },
  { value: 'medium', label: 'تأثیر متوسط' },
  { value: 'low', label: 'تأثیر کم' }
];

const sentimentFilters = [
  { value: 'all', label: 'همه' },
  { value: 'positive', label: '😊 مثبت' },
  { value: 'neutral', label: '😐 خنثی' },
  { value: 'negative', label: '😟 منفی' }
];

const predictionFilters = [
  { value: 'all', label: 'همه' },
  { value: 'bullish', label: '🐂 صعودی' },
  { value: 'bearish', label: '🐻 نزولی' },
  { value: 'neutral', label: '⚖️ خنثی' }
];

export default function News() {
  const [search, setSearch] = useState('');
  const [impactFilter, setImpactFilter] = useState('all');
  const [sentimentFilter, setSentimentFilter] = useState('all');
  const [predictionFilter, setPredictionFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // اتوماتیک رفرش هر 5 ثانیه
  const { data: news = [], isLoading } = useQuery({
    queryKey: ['news', search, impactFilter, sentimentFilter, predictionFilter],
    queryFn: () => apiService.getNews({
      search,
      impact: impactFilter,
      sentiment: sentimentFilter,
      prediction: predictionFilter
    }),
    refetchInterval: 5000,
  });

  const { data: stats } = useQuery({
    queryKey: ['news-stats'],
    queryFn: () => apiService.getNewsStats(),
  });

  // محاسبه صفحات
  const totalPages = Math.ceil(news.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentNews = news.slice(startIndex, endIndex);

  // Window box برای نمایش فیلترهای انتخاب شده
  const FilterWindow = () => (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-xl bg-gradient-to-br from-slate-800/70 to-slate-900/60 border border-slate-700/70 backdrop-blur-sm mb-6"
    >
      <div className="flex items-center gap-3 mb-3">
        <Filter className="w-5 h-5 text-blue-400" />
        <span className="text-sm font-medium text-slate-300">فیلترهای فعال</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {impactFilter !== 'all' && (
          <Badge className={`${getImpactColor(impactFilter).bg} ${getImpactColor(impactFilter).text} ${getImpactColor(impactFilter).border} border px-3 py-1`}>
            <AlertTriangle className="w-3 h-3 ml-1" />
            تأثیر: {impactFilters.find(f => f.value === impactFilter)?.label}
          </Badge>
        )}
        {sentimentFilter !== 'all' && (
          <Badge className={`${getSentimentColor(sentimentFilter).bg} ${getSentimentColor(sentimentFilter).text} ${getSentimentColor(sentimentFilter).border} border px-3 py-1`}>
            {getSentimentColor(sentimentFilter).icon}
            احساسات: {sentimentFilters.find(f => f.value === sentimentFilter)?.label}
          </Badge>
        )}
        {predictionFilter !== 'all' && (
          <Badge className={`${getPredictionColor(predictionFilter).bg} ${getPredictionColor(predictionFilter).text} ${getPredictionColor(predictionFilter).border} border px-3 py-1`}>
            {getPredictionColor(predictionFilter).icon}
            پیش‌بینی: {predictionFilters.find(f => f.value === predictionFilter)?.label}
          </Badge>
        )}
        {search && (
          <Badge className="bg-slate-700/50 text-slate-300 border-slate-600 px-3 py-1">
            <Search className="w-3 h-3 ml-1" />
            جستجو: "{search}"
          </Badge>
        )}
        {impactFilter === 'all' && sentimentFilter === 'all' && predictionFilter === 'all' && !search && (
          <span className="text-slate-400 text-sm">بدون فیلتر (نمایش همه)</span>
        )}
      </div>
      <div className="mt-3 pt-3 border-t border-slate-700/50 flex items-center justify-between">
        <span className="text-xs text-slate-500">
          {news.length} خبر یافت شد
        </span>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => {
            setImpactFilter('all');
            setSentimentFilter('all');
            setPredictionFilter('all');
            setSearch('');
            setCurrentPage(1);
          }}
          className="text-xs text-slate-400 hover:text-white"
        >
          حذف همه فیلترها
        </Button>
      </div>
    </motion.div>
  );

  // آمار تأثیر
  const ImpactStats = () => {
    if (!stats) return null;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
      >
        {Object.entries(stats.byImpact).map(([impact, count]) => {
          const color = getImpactColor(impact);
          return (
            <div 
              key={impact} 
              className={`p-4 rounded-xl border ${color.border} ${color.gradient}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${color.bg} ${color.text}`}>
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <span className="text-slate-300">{color.label}</span>
                </div>
                <span className={`text-2xl font-bold ${color.text}`}>{count}</span>
              </div>
              <div className="text-xs text-slate-400">
                {Math.round((count / stats.total) * 100)}% از کل اخبار
              </div>
            </div>
          );
        })}
      </motion.div>
    );
  };

  // آمار پیش‌بینی‌ها
  const PredictionStats = () => {
    if (!stats) return null;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
      >
        <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-gradient-to-r from-emerald-500/30 to-emerald-600/20 text-emerald-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-slate-300">پیش‌بینی‌های صعودی</span>
          </div>
          <div className="text-2xl font-bold text-white">{stats.bullish}</div>
          <div className="text-xs text-emerald-400 mt-1">
            {Math.round((stats.bullish / stats.total) * 100)}%
          </div>
        </div>
        
        <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-gradient-to-r from-rose-500/30 to-rose-600/20 text-rose-400">
              <TrendingDown className="w-5 h-5" />
            </div>
            <span className="text-slate-300">پیش‌بینی‌های نزولی</span>
          </div>
          <div className="text-2xl font-bold text-white">{stats.bearish}</div>
          <div className="text-xs text-rose-400 mt-1">
            {Math.round((stats.bearish / stats.total) * 100)}%
          </div>
        </div>
        
        <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-gradient-to-r from-slate-500/30 to-slate-600/20 text-slate-400">
              <Minus className="w-5 h-5" />
            </div>
            <span className="text-slate-300">پیش‌بینی‌های خنثی</span>
          </div>
          <div className="text-2xl font-bold text-white">{stats.neutral}</div>
          <div className="text-xs text-slate-400 mt-1">
            {Math.round((stats.neutral / stats.total) * 100)}%
          </div>
        </div>
        
        <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500/30 to-blue-600/20 text-blue-400">
              <BarChart3 className="w-5 h-5" />
            </div>
            <span className="text-slate-300">میانگین اطمینان</span>
          </div>
          <div className="text-2xl font-bold text-white">{stats.avgConfidence}%</div>
          <div className="text-xs text-blue-400 mt-1">بر اساس تحلیل AI</div>
        </div>
      </motion.div>
    );
  };

  // پاگی‌نیشن
  const Pagination = () => {
    if (totalPages <= 1) return null;
    
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center gap-2 mt-8"
      >
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
          className="border-slate-700 text-slate-400 hover:bg-slate-800"
        >
          <ChevronRight className="w-4 h-4" />
          قبلی
        </Button>
        
        <div className="flex items-center gap-1">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }
            
            return (
              <Button
                key={pageNum}
                variant={currentPage === pageNum ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCurrentPage(pageNum)}
                className={`min-w-[40px] ${
                  currentPage === pageNum
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
                    : 'border-slate-700 text-slate-400 hover:bg-slate-800'
                }`}
              >
                {pageNum}
              </Button>
            );
          })}
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
          disabled={currentPage === totalPages}
          className="border-slate-700 text-slate-400 hover:bg-slate-800"
        >
          بعدی
          <ChevronLeft className="w-4 h-4" />
        </Button>
      </motion.div>
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
              <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500/30 to-blue-600/20 border border-blue-500/40">
                <Newspaper className="w-7 h-7 text-blue-400" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">اخبار و تحلیل بازار</h1>
                <p className="text-slate-400 text-sm">آخرین اخبار و تحلیل‌های بازار فارکس - بروزرسانی خودکار</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Window Box برای فیلترهای فعال */}
        <FilterWindow />

        {/* آمار تأثیر */}
        <ImpactStats />

        {/* آمار پیش‌بینی‌ها */}
        <PredictionStats />

        {/* Filters Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6 mb-8"
        >
          {/* Search Box */}
          <div className="relative">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <Input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="جستجو در اخبار، تحلیل‌ها و پیش‌بینی‌ها..."
              className="bg-slate-800/60 border-slate-700/70 text-white placeholder:text-slate-500 
                         pr-12 py-6 rounded-xl hover:border-slate-600/70 focus:border-blue-500/50
                         focus:ring-1 focus:ring-blue-500/30 transition-all"
            />
          </div>
          
          {/* Filters Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Impact Filter */}
            <div>
              <Label className="text-slate-300 text-sm mb-2 block">میزان تأثیر</Label>
              <div className="flex flex-wrap gap-2">
                {impactFilters.map(filter => (
                  <Button
                    key={filter.value}
                    variant={impactFilter === filter.value ? 'default' : 'outline'}
                    onClick={() => {
                      setImpactFilter(filter.value);
                      setCurrentPage(1);
                    }}
                    size="sm"
                    className={`rounded-lg transition-all duration-200 ${
                      getFilterButtonStyle('impact', filter.value, impactFilter === filter.value)
                    }`}
                  >
                    {filter.value !== 'all' && (
                      <span className="ml-1">{getImpactColor(filter.value).icon}</span>
                    )}
                    {filter.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Sentiment Filter */}
            <div>
              <Label className="text-slate-300 text-sm mb-2 block">احساسات بازار</Label>
              <div className="flex flex-wrap gap-2">
                {sentimentFilters.map(filter => (
                  <Button
                    key={filter.value}
                    variant={sentimentFilter === filter.value ? 'default' : 'outline'}
                    onClick={() => {
                      setSentimentFilter(filter.value);
                      setCurrentPage(1);
                    }}
                    size="sm"
                    className={`rounded-lg transition-all duration-200 ${
                      getFilterButtonStyle('sentiment', filter.value, sentimentFilter === filter.value)
                    }`}
                  >
                    {filter.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Prediction Filter */}
            <div>
              <Label className="text-slate-300 text-sm mb-2 block">پیش‌بینی جهت</Label>
              <div className="flex flex-wrap gap-2">
                {predictionFilters.map(filter => (
                  <Button
                    key={filter.value}
                    variant={predictionFilter === filter.value ? 'default' : 'outline'}
                    onClick={() => {
                      setPredictionFilter(filter.value);
                      setCurrentPage(1);
                    }}
                    size="sm"
                    className={`rounded-lg transition-all duration-200 ${
                      getFilterButtonStyle('prediction', filter.value, predictionFilter === filter.value)
                    }`}
                  >
                    {filter.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* News Count */}
        {!isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-between mb-6"
          >
            <div className="text-slate-400 text-sm">
              نمایش <span className="text-white font-medium">{currentNews.length}</span> خبر از {news.length} خبر
              {search && ` برای "${search}"`}
              {totalPages > 1 && ` (صفحه ${currentPage} از ${totalPages})`}
            </div>
            {news.length > 0 && (
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Clock className="w-3 h-3" />
                <span>آخرین بروزرسانی: {new Date().toLocaleTimeString('fa-IR')}</span>
              </div>
            )}
          </motion.div>
        )}

        {/* News Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-2xl bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-slate-700/50 p-5"
              >
                <Skeleton className="h-6 w-24 bg-slate-700/50 mb-4" />
                <Skeleton className="h-6 w-full bg-slate-700/50 mb-3" />
                <Skeleton className="h-4 w-5/6 bg-slate-700/50 mb-2" />
                <Skeleton className="h-4 w-4/6 bg-slate-700/50 mb-4" />
                <div className="flex gap-2">
                  <Skeleton className="h-5 w-16 bg-slate-700/50 rounded" />
                  <Skeleton className="h-5 w-16 bg-slate-700/50 rounded" />
                </div>
              </motion.div>
            ))}
          </div>
        ) : news.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 sm:py-20"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 flex items-center justify-center">
              <Newspaper className="w-8 h-8 sm:w-10 sm:h-10 text-slate-600" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">خبری یافت نشد</h3>
            <p className="text-slate-400 max-w-md mx-auto mb-6">
              {search 
                ? `نتیجه‌ای برای "${search}" پیدا نشد. عبارت جستجو را تغییر دهید.`
                : 'فیلترهای جستجو را تغییر دهید یا منتظر دریافت اخبار جدید باشید.'}
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setImpactFilter('all');
                  setSentimentFilter('all');
                  setPredictionFilter('all');
                  setSearch('');
                }}
                className="border-slate-600 text-slate-400 hover:bg-slate-800"
              >
                حذف همه فیلترها
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setSearch('')}
                className="border-slate-600 text-slate-400 hover:bg-slate-800"
              >
                حذف جستجو
              </Button>
            </div>
          </motion.div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentNews.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ 
                    y: -4,
                    transition: { duration: 0.2 }
                  }}
                  className="group"
                >
                  <NewsCard news={item} index={i} />
                </motion.div>
              ))}
            </div>
            
            {/* Pagination */}
            <Pagination />
          </>
        )}

        {/* Footer Info */}
        {!isLoading && news.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-10 pt-6 border-t border-slate-800"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                <span>داده‌ها از منابع معتبر بین‌المللی جمع‌آوری می‌شوند</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/30 border border-red-500/50"></div>
                  <span>تأثیر بالا</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-orange-500/30 border border-orange-500/50"></div>
                  <span>تأثیر متوسط</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500/30 border border-yellow-500/50"></div>
                  <span>تأثیر کم</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}