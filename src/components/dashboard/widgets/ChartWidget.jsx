import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp, TrendingDown } from 'lucide-react';

// API base URL
const API_BASE_URL = 'http://localhost:8000';

// Simple chart component (می‌توانید از کتابخانه‌های حرفه‌ای مانند recharts استفاده کنید)
const SimpleChart = ({ data, pair }) => {
  if (!data || data.length === 0) return null;
  
  const minPrice = Math.min(...data.map(d => d.price));
  const maxPrice = Math.max(...data.map(d => d.price));
  const range = maxPrice - minPrice;
  
  return (
    <div className="relative h-32 mt-2">
      <div className="flex items-end justify-between h-full gap-1">
        {data.map((point, i) => {
          const height = ((point.price - minPrice) / range) * 100;
          return (
            <div
              key={i}
              className="flex-1 bg-gradient-to-t from-blue-500/50 to-blue-400/30 rounded-t hover:bg-blue-400/50 transition-all group relative"
              style={{ height: `${height}%` }}
            >
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 hidden group-hover:block bg-slate-800 text-white text-xs rounded px-1 py-0.5 whitespace-nowrap">
                {point.time}: {point.price.toFixed(4)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default function ChartWidget({ pair = 'EUR/USD' }) {
  const { data: chartData, isLoading } = useQuery({
    queryKey: ['chart-widget', pair],
    queryFn: async () => {
      // در اینجا می‌توانید از API واقعی استفاده کنید
      // برای نمونه از داده‌های static استفاده می‌کنیم
      const response = await fetch(`${API_BASE_URL}/api/dashboard/widgets/chart_${pair.toLowerCase().replace('/', '')}/data`);
      return response.json();
    },
    refetchInterval: 10000,
  });

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-24 bg-slate-700/50" />
          <Skeleton className="h-6 w-16 bg-slate-700/50" />
        </div>
        <Skeleton className="h-32 w-full bg-slate-700/50" />
      </div>
    );
  }

  const isPositive = chartData?.change_24h > 0;

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-semibold text-white">{pair}</h4>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-lg font-bold text-white">
              {chartData?.current_price?.toFixed(4)}
            </span>
            <div className={`flex items-center gap-1 text-xs ${
              isPositive ? 'text-emerald-400' : 'text-red-400'
            }`}>
              {isPositive ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              <span>{isPositive ? '+' : ''}{chartData?.change_24h?.toFixed(2)}%</span>
            </div>
          </div>
        </div>
        
        {/* Timeframe selector (نمونه) */}
        <div className="flex gap-1">
          {['1H', '4H', '1D'].map(tf => (
            <button
              key={tf}
              className="px-2 py-1 text-xs rounded bg-slate-800/50 text-slate-400 hover:bg-slate-700/50 hover:text-white transition-colors"
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <SimpleChart data={chartData?.chart_data} pair={pair} />

      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-2 mt-2">
        <div className="text-center p-2 rounded-lg bg-slate-800/30">
          <p className="text-[10px] text-slate-500">بالاترین (۲۴h)</p>
          <p className="text-xs font-mono text-white">
            {chartData?.chart_data ? Math.max(...chartData.chart_data.map(d => d.price)).toFixed(4) : '-'}
          </p>
        </div>
        <div className="text-center p-2 rounded-lg bg-slate-800/30">
          <p className="text-[10px] text-slate-500">پایین‌ترین (۲۴h)</p>
          <p className="text-xs font-mono text-white">
            {chartData?.chart_data ? Math.min(...chartData.chart_data.map(d => d.price)).toFixed(4) : '-'}
          </p>
        </div>
      </div>
    </div>
  );
}