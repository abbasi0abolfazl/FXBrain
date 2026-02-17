import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp, TrendingDown, Target, Shield, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

// API base URL
const API_BASE_URL = 'http://localhost:8000';

// API service for signals
const signalsService = {
  async getSignals(filters = {}) {
    const params = new URLSearchParams();
    params.append('status', 'active');
    params.append('limit', '10');
    
    const response = await fetch(`${API_BASE_URL}/api/signals?${params}`);
    return response.json();
  }
};

const signalIcons = {
  buy: TrendingUp,
  sell: TrendingDown,
};

const signalColors = {
  buy: {
    bg: 'bg-emerald-500/20',
    text: 'text-emerald-400',
    border: 'border-emerald-500/30',
    label: 'خرید'
  },
  sell: {
    bg: 'bg-red-500/20',
    text: 'text-red-400',
    border: 'border-red-500/30',
    label: 'فروش'
  },
};

const confidenceColor = (confidence) => {
  if (confidence >= 80) return 'text-emerald-400';
  if (confidence >= 60) return 'text-amber-400';
  return 'text-slate-400';
};

export default function SignalsWidget({ config = {} }) {
  const maxSignals = config.max_signals || 3;
  const showConfidence = config.show_confidence !== false;

  const { data: signals = [], isLoading } = useQuery({
    queryKey: ['signals-widget', maxSignals],
    queryFn: () => signalsService.getSignals(),
    refetchInterval: 30000,
  });

  const displaySignals = signals.slice(0, maxSignals);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="p-3">
            <div className="flex items-center gap-2 mb-3">
              <Skeleton className="w-8 h-8 rounded-lg bg-slate-700/50" />
              <Skeleton className="h-5 w-24 bg-slate-700/50" />
            </div>
            <div className="grid grid-cols-3 gap-2 mb-2">
              <Skeleton className="h-10 bg-slate-700/50" />
              <Skeleton className="h-10 bg-slate-700/50" />
              <Skeleton className="h-10 bg-slate-700/50" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {displaySignals.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-slate-800/50 flex items-center justify-center">
            <Zap className="w-6 h-6 text-slate-600" />
          </div>
          <p className="text-slate-400 text-sm">سیگنال فعالی وجود ندارد</p>
        </div>
      ) : (
        <>
          {displaySignals.map((signal) => {
            const Icon = signalIcons[signal.signal_type] || TrendingUp;
            const colors = signalColors[signal.signal_type] || signalColors.buy;
            
            return (
              <div 
                key={signal.id} 
                className="group p-3 rounded-xl bg-slate-900/50 border border-slate-700/30 hover:border-blue-500/30 transition-all duration-300"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg ${colors.bg}`}>
                      <Icon className={`w-4 h-4 ${colors.text}`} />
                    </div>
                    <span className="font-semibold text-white">{signal.pair}</span>
                  </div>
                  
                  <Badge className={`${colors.bg} ${colors.text} border ${colors.border}`}>
                    {colors.label}
                  </Badge>
                </div>
                
                {/* Confidence bar */}
                {showConfidence && signal.confidence && (
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-500">اعتماد</span>
                      <span className={confidenceColor(signal.confidence)}>
                        {signal.confidence}%
                      </span>
                    </div>
                    <div className="h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          signal.confidence >= 80 
                            ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' 
                            : signal.confidence >= 60
                            ? 'bg-gradient-to-r from-amber-500 to-amber-400'
                            : 'bg-gradient-to-r from-slate-500 to-slate-400'
                        }`}
                        style={{ width: `${signal.confidence}%` }}
                      />
                    </div>
                  </div>
                )}
                
                {/* Prices */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 rounded-lg bg-slate-800/50">
                    <p className="text-[10px] text-slate-500 mb-1">ورود</p>
                    <p className="text-xs font-bold text-white font-mono">
                      {signal.entry_price?.toFixed(4)}
                    </p>
                  </div>
                  <div className="p-2 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                    <p className="text-[10px] text-slate-500 mb-1 flex items-center justify-center gap-1">
                      <Target className="w-3 h-3 text-emerald-400" /> TP
                    </p>
                    <p className="text-xs font-bold text-emerald-400 font-mono">
                      {signal.take_profit?.toFixed(4)}
                    </p>
                  </div>
                  <div className="p-2 rounded-lg bg-red-500/5 border border-red-500/20">
                    <p className="text-[10px] text-slate-500 mb-1 flex items-center justify-center gap-1">
                      <Shield className="w-3 h-3 text-red-400" /> SL
                    </p>
                    <p className="text-xs font-bold text-red-400 font-mono">
                      {signal.stop_loss?.toFixed(4)}
                    </p>
                  </div>
                </div>
                
                {/* Analysis (optional) */}
                {signal.analysis && (
                  <p className="text-xs text-slate-400 mt-2 line-clamp-2">
                    {signal.analysis}
                  </p>
                )}
              </div>
            );
          })}
          
          <Link 
            to={createPageUrl('Signals')}
            className="block text-center text-sm text-blue-400 hover:text-blue-300 py-2 transition-colors group"
          >
            <span className="border-b border-blue-400/0 group-hover:border-blue-400/50">
              مشاهده همه سیگنال‌ها ←
            </span>
          </Link>
        </>
      )}
    </div>
  );
}