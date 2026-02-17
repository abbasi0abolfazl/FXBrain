// src/theme/colors.js
export const impactColors = {
  // رنگ‌های اصلی برای تأثیر
  high: {
    light: 'from-red-500/30 to-red-600/20',
    dark: 'from-red-600/40 to-red-700/30',
    text: 'text-red-400',
    border: 'border-red-500/50',
    bg: 'bg-red-500/30',
    icon: '🔥',
    label: 'تأثیر بالا',
    gradient: 'bg-gradient-to-r from-red-500/30 via-red-600/20 to-red-700/10',
    button: 'from-red-600 to-red-700',
    hover: 'from-red-700 to-red-800'
  },
  medium: {
    light: 'from-orange-500/30 to-orange-600/20', // نارنجی پررنگ‌تر
    dark: 'from-orange-600/40 to-orange-700/30',
    text: 'text-orange-400',
    border: 'border-orange-500/50',
    bg: 'bg-orange-500/30',
    icon: '⚡',
    label: 'تأثیر متوسط',
    gradient: 'bg-gradient-to-r from-orange-500/30 via-orange-600/20 to-orange-700/10',
    button: 'from-orange-600 to-orange-700',
    hover: 'from-orange-700 to-orange-800'
  },
  low: {
    light: 'from-yellow-500/30 to-yellow-600/20',
    dark: 'from-yellow-600/40 to-yellow-700/30',
    text: 'text-yellow-400',
    border: 'border-yellow-500/50',
    bg: 'bg-yellow-500/30',
    icon: '💧',
    label: 'تأثیر کم',
    gradient: 'bg-gradient-to-r from-yellow-500/30 via-yellow-600/20 to-yellow-700/10',
    button: 'from-yellow-600 to-yellow-700',
    hover: 'from-yellow-700 to-yellow-800'
  }
};

export const sentimentColors = {
  positive: {
    light: 'from-emerald-500/30 to-emerald-600/20',
    text: 'text-emerald-400',
    border: 'border-emerald-500/50',
    icon: '😊',
    label: 'مثبت',
    gradient: 'bg-gradient-to-r from-emerald-500/30 via-emerald-600/20 to-emerald-700/10'
  },
  negative: {
    light: 'from-rose-500/30 to-rose-600/20',
    text: 'text-rose-400',
    border: 'border-rose-500/50',
    icon: '😟',
    label: 'منفی',
    gradient: 'bg-gradient-to-r from-rose-500/30 via-rose-600/20 to-rose-700/10'
  },
  neutral: {
    light: 'from-slate-500/30 to-slate-600/20',
    text: 'text-slate-400',
    border: 'border-slate-500/50',
    icon: '😐',
    label: 'خنثی',
    gradient: 'bg-gradient-to-r from-slate-500/30 via-slate-600/20 to-slate-700/10'
  }
};

export const predictionColors = {
  bullish: {
    light: 'from-emerald-500/30 to-emerald-600/20',
    text: 'text-emerald-400',
    border: 'border-emerald-500/50',
    icon: '🐂',
    label: 'صعودی',
    gradient: 'bg-gradient-to-r from-emerald-500/30 via-emerald-600/20 to-emerald-700/10'
  },
  bearish: {
    light: 'from-rose-500/30 to-rose-600/20',
    text: 'text-rose-400',
    border: 'border-rose-500/50',
    icon: '🐻',
    label: 'نزولی',
    gradient: 'bg-gradient-to-r from-rose-500/30 via-rose-600/20 to-rose-700/10'
  },
  neutral: {
    light: 'from-slate-500/30 to-slate-600/20',
    text: 'text-slate-400',
    border: 'border-slate-500/50',
    icon: '⚖️',
    label: 'خنثی',
    gradient: 'bg-gradient-to-r from-slate-500/30 via-slate-600/20 to-slate-700/10'
  }
};

// Helper functions
export const getImpactColor = (impact) => {
  return impactColors[impact] || impactColors.medium;
};

export const getSentimentColor = (sentiment) => {
  return sentimentColors[sentiment] || sentimentColors.neutral;
};

export const getPredictionColor = (prediction) => {
  if (prediction?.includes('bullish')) return predictionColors.bullish;
  if (prediction?.includes('bearish')) return predictionColors.bearish;
  return predictionColors.neutral;
};

// تابع برای فیلتر دکمه‌ها
export const getFilterButtonStyle = (type, value, isActive) => {
  if (!isActive) {
    return 'border-slate-700 bg-slate-800/40 text-slate-300 hover:bg-slate-700/60 hover:text-white hover:border-slate-600';
  }
  
  switch(type) {
    case 'impact':
      const impactColor = getImpactColor(value);
      return `bg-gradient-to-r ${impactColor.button} text-white shadow-lg shadow-${value === 'high' ? 'red' : value === 'medium' ? 'orange' : 'yellow'}-500/20 hover:${impactColor.hover}`;
    
    case 'sentiment':
      const sentimentColor = getSentimentColor(value);
      const sentimentShadow = value === 'positive' ? 'emerald' : value === 'negative' ? 'rose' : 'slate';
      return `bg-gradient-to-r from-${sentimentShadow}-600 to-${sentimentShadow}-700 text-white shadow-lg shadow-${sentimentShadow}-500/20 hover:from-${sentimentShadow}-700 hover:to-${sentimentShadow}-800`;
    
    case 'prediction':
      const predictionColor = getPredictionColor(value);
      const predictionShadow = value === 'bullish' ? 'emerald' : value === 'bearish' ? 'rose' : 'slate';
      return `bg-gradient-to-r from-${predictionShadow}-600 to-${predictionShadow}-700 text-white shadow-lg shadow-${predictionShadow}-500/20 hover:from-${predictionShadow}-700 hover:to-${predictionShadow}-800`;
    
    default:
      return 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/20 hover:from-blue-700 hover:to-blue-800';
  }
};