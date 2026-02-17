import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, TrendingUp, TrendingDown, Minus, 
  ExternalLink, Target
} from 'lucide-react';
import moment from 'moment';
import { 
  getImpactColor, 
  getSentimentColor, 
  getPredictionColor 
} from '@/theme/colors';

export default function NewsCard({ news, index }) {
  const impactColor = getImpactColor(news.impact_level);
  const sentimentColor = getSentimentColor(news.sentiment);
  const predictionColor = getPredictionColor(news.prediction);
  
  const prediction = news.prediction || '';
  
  const directionIcon = prediction.includes('bullish') 
    ? <TrendingUp className="w-4 h-4 text-emerald-400" />
    : prediction.includes('bearish')
    ? <TrendingDown className="w-4 h-4 text-rose-400" />
    : <Minus className="w-4 h-4 text-slate-400" />;

  const currencyPairs = news.affected_currencies || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/40 
                 border border-slate-700/50 p-5 transition-all duration-300
                 hover:border-blue-500/40 hover:shadow-2xl hover:shadow-blue-500/10
                 hover:bg-gradient-to-br hover:from-slate-800/60 hover:to-slate-900/50"
    >
      {/* Impact & Sentiment Badges */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex flex-wrap gap-2">
          <Badge className={`bg-gradient-to-r ${impactColor.light} ${impactColor.border} border px-3 py-1.5`}>
            <span className="ml-1">{impactColor.icon}</span>
            <span className="mr-1">{impactColor.label}</span>
          </Badge>
          {news.sentiment && (
            <Badge className={`bg-gradient-to-r ${sentimentColor.light} ${sentimentColor.border} border px-3 py-1.5`}>
              <span className="ml-1">{sentimentColor.icon}</span>
              <span className="mr-1">{sentimentColor.label}</span>
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2 text-slate-500 text-sm">
          <Clock className="w-4 h-4" />
          <span className="whitespace-nowrap">
            {moment(news.published_at).locale('fa').fromNow() || 'اخیراً'}
          </span>
        </div>
      </div>
      
      {/* Title */}
      <h3 className="text-lg font-semibold text-white mb-3 leading-relaxed 
                     group-hover:text-blue-300 transition-colors duration-200">
        {news.title}
      </h3>
      
      {/* Summary */}
      <p className="text-slate-400 text-sm leading-relaxed mb-4 line-clamp-3">
        {news.summary}
      </p>
      
      {/* Prediction & Currency Pairs */}
      <div className="space-y-3 pt-4 border-t border-slate-700/50">
        {/* پیش‌بینی جهت */}
        {prediction && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {directionIcon}
              <Badge className={`${predictionColor.text} bg-gradient-to-r ${predictionColor.light} ${predictionColor.border} px-3 py-1`}>
                <span className="ml-1">{predictionColor.icon}</span>
                <span className="mr-1">{prediction}</span>
              </Badge>
            </div>
          </div>
        )}
        
        {/* ارزهای تأثیرپذیر */}
        {currencyPairs.length > 0 && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <Target className="w-3 h-3" />
              <span>ارزهای تأثیرپذیر:</span>
            </div>
            <div className="flex flex-wrap gap-1 justify-end">
              {currencyPairs.slice(0, 3).map((pair, i) => (
                <Badge 
                  key={i} 
                  variant="outline" 
                  className="text-xs border-slate-600/50 bg-slate-800/30 text-slate-300
                             group-hover:border-slate-500/50 group-hover:bg-slate-700/40 transition-colors"
                >
                  {pair}
                </Badge>
              ))}
              {currencyPairs.length > 3 && (
                <Badge variant="outline" className="text-xs border-slate-600/50 text-slate-500">
                  +{currencyPairs.length - 3}
                </Badge>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Source & Category */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-700/30">
        <div className="text-xs text-slate-500">
          منبع: {news.source}
        </div>
        
        {/* دسته‌بندی */}
        {news.category && (
          <Badge className="text-xs bg-slate-800/50 text-slate-400 border-slate-700/50">
            {news.category}
          </Badge>
        )}
      </div>
      
      {/* Hover Effects */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-blue-500/10 to-blue-600/5 
                      rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-br from-purple-500/5 to-purple-600/3 
                      rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100" />
    </motion.div>
  );
}