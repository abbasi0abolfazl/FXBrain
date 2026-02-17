import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Clock, Newspaper } from 'lucide-react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

// API base URL
const API_BASE_URL = 'http://localhost:8000';

// API service for news
const newsService = {
  async getNews(filters = {}) {
    const params = new URLSearchParams();
    if (filters.impact && filters.impact !== 'all') params.append('impact', filters.impact);
    params.append('limit', '10');
    
    const response = await fetch(`${API_BASE_URL}/api/news?${params}`);
    return response.json();
  }
};

const impactColors = {
  high: 'bg-red-500/20 text-red-400 border-red-500/30',
  medium: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  low: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
};

const impactLabels = {
  high: 'تأثیر بالا',
  medium: 'تأثیر متوسط',
  low: 'تأثیر کم',
};

const sentimentIcons = {
  positive: '😊',
  neutral: '😐',
  negative: '😟',
};

export default function NewsWidget({ config = {} }) {
  const maxNews = config.max_news || 5;
  const showImpact = config.show_impact !== false;

  const { data: news = [], isLoading } = useQuery({
    queryKey: ['news-widget', maxNews],
    queryFn: () => newsService.getNews({ impact: 'all' }),
    refetchInterval: 30000,
  });

  const displayNews = news.slice(0, maxNews);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="p-3">
            <div className="flex items-center gap-2 mb-2">
              <Skeleton className="h-5 w-16 bg-slate-700/50" />
              <Skeleton className="h-4 w-20 bg-slate-700/50" />
            </div>
            <Skeleton className="h-4 w-full bg-slate-700/50 mb-2" />
            <Skeleton className="h-3 w-3/4 bg-slate-700/50" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {displayNews.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-slate-800/50 flex items-center justify-center">
            <Newspaper className="w-6 h-6 text-slate-600" />
          </div>
          <p className="text-slate-400 text-sm">اخباری برای نمایش وجود ندارد</p>
        </div>
      ) : (
        <>
          {displayNews.map((item, i) => (
            <div 
              key={item.id} 
              className="group p-3 rounded-xl bg-slate-900/50 border border-slate-700/30 hover:border-blue-500/30 transition-all duration-300"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-2 mb-2">
                {showImpact && (
                  <Badge className={`${impactColors[item.impact_level]} text-[10px]`}>
                    {impactLabels[item.impact_level]}
                  </Badge>
                )}
                
                <div className="flex items-center gap-2">
                  {item.sentiment && (
                    <span className="text-xs" title={`احساسات: ${item.sentiment}`}>
                      {sentimentIcons[item.sentiment]}
                    </span>
                  )}
                  
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {moment(item.published_at).fromNow()}
                  </span>
                </div>
              </div>
              
              {/* Title */}
              <p className="text-sm text-white line-clamp-2 mb-2 group-hover:text-blue-400 transition-colors">
                {item.title}
              </p>
              
              {/* Summary (optional) */}
              {item.summary && (
                <p className="text-xs text-slate-500 line-clamp-2">
                  {item.summary}
                </p>
              )}
              
              {/* Prediction */}
              {item.prediction && (
                <div className="mt-2 flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px] border-purple-500/30 text-purple-400">
                    پیش‌بینی: {item.prediction}
                  </Badge>
                </div>
              )}
              
              {/* Source */}
              <div className="mt-2 text-[10px] text-slate-600">
                {item.source}
              </div>
            </div>
          ))}
          
          <Link 
            to={createPageUrl('News')}
            className="block text-center text-sm text-blue-400 hover:text-blue-300 py-2 transition-colors group"
          >
            <span className="border-b border-blue-400/0 group-hover:border-blue-400/50">
              مشاهده همه اخبار ←
            </span>
          </Link>
        </>
      )}
    </div>
  );
}