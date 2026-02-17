import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Newspaper, Calendar, Bell, TrendingUp, 
  Zap, Shield, Smartphone, ArrowLeft,
  CheckCircle2, Star
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import MarketTicker from '@/components/dashboard/MarketTicker';
import StatsCard from '@/components/dashboard/StatsCard';
import { AppAPI } from '@/components/api/appDataService';

const iconMap = {
  Newspaper,
  Calendar,
  Bell,
  TrendingUp,
};

export default function Home() {
  const navigate = useNavigate();
  const [isLoading] = useState(false);
  
  const { data: homeData, isLoading: dataLoading } = useQuery({
    queryKey: ['homePageData'],
    queryFn: async () => {
      try {
        const [hero, features, plans, stats] = await Promise.all([
          AppAPI.home.getHeroContent(),
          AppAPI.home.getFeatures(),
          AppAPI.home.getPlans(),
          AppAPI.home.getStats()
        ]);
        return { hero, features, plans, stats };
      } catch (error) {
        console.error('Error loading home data:', error);
        // Return fallback data
        return {
          hero: {
            badge: 'قدرت‌گرفته از هوش مصنوعی',
            title: 'جعبه ابزار',
            titleHighlight: 'تریدرها',
            description: 'تحلیل هوشمند اخبار، تقویم اقتصادی پیشرفته و هشدارهای قیمتی در یک پلتفرم یکپارچه',
            primaryButton: 'شروع رایگان',
            secondaryButton: 'مشاهده دمو',
          },
          features: [
            { icon: 'Newspaper', title: 'تحلیل هوشمند اخبار', description: 'تحلیل لحظه‌ای اخبار فارکس با هوش مصنوعی و پیش‌بینی جهت بازار', color: 'blue' },
            { icon: 'Calendar', title: 'تقویم اقتصادی پیشرفته', description: 'رویدادهای اقتصادی مهم با پیش‌بینی تأثیر و نوسان‌پذیری', color: 'green' },
            { icon: 'Bell', title: 'هشدارهای هوشمند', description: 'تنظیم هشدار بر اساس قیمت، اندیکاتورها و اخبار مهم', color: 'orange' },
          ],
          plans: [
            { name: 'رایگان', price: '۰', features: ['۳ هشدار فعال', 'اخبار روزانه', 'تقویم اقتصادی پایه'], highlighted: false },
            { name: 'پریمیوم', price: '۹۹,۰۰۰', features: ['هشدار نامحدود', 'تحلیل AI پیشرفته', 'اعلان تلگرام', 'API دسترسی'], highlighted: true },
          ],
          stats: [
            { key: 'news', title: 'اخبار امروز', value: '۲۴', icon: 'Newspaper', color: 'blue', trend: 12 },
            { key: 'events', title: 'رویداد این هفته', value: '۱۸', icon: 'Calendar', color: 'green' },
            { key: 'alerts', title: 'هشدار فعال', value: '۱۵۶', icon: 'Bell', color: 'orange' },
            { key: 'users', title: 'کاربر فعال', value: '۲,۵۰۰+', icon: 'TrendingUp', color: 'purple' },
          ]
        };
      }
    },
  });

  const loading = isLoading || dataLoading;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const { features, plans, stats, hero } = homeData || { features: [], plans: [], stats: [], hero: {} };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent" />
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute top-40 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        
        <div className="max-w-7xl mx-auto px-6 pt-20 pb-12 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <Badge className="mb-6 bg-blue-500/20 text-blue-400 border-blue-500/30 px-4 py-1">
              <Zap className="w-3 h-3 ml-1" />
              {hero.badge}
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
              {hero.title}
              <span className="text-transparent bg-clip-text bg-gradient-to-l from-blue-400 to-purple-400"> {hero.titleHighlight}</span>
            </h1>
            
            <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              {hero.description}
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to={createPageUrl('News')}>
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg rounded-xl">
                  {hero.primaryButton}
                  <ArrowLeft className="w-5 h-5 mr-2" />
                </Button>
              </Link>
              <Link to={createPageUrl('Calendar')}>
                <Button size="lg" variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800 px-8 py-6 text-lg rounded-xl">
                  {hero.secondaryButton}
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Market Ticker */}
      <MarketTicker />

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const IconComponent = iconMap[stat.icon];
            return (
              <StatsCard 
                key={stat.key}
                title={stat.title} 
                value={stat.value} 
                icon={IconComponent} 
                color={stat.color} 
                trend={stat.trend} 
              />
            );
          })}
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-white mb-4">امکانات پلتفرم</h2>
          <p className="text-slate-400 text-lg">ابزارهای حرفه‌ای برای تریدرهای موفق</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, i) => {
            const FeatureIcon = iconMap[feature.icon];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative overflow-hidden rounded-3xl bg-slate-800/50 border border-slate-700/50 p-8 hover:border-slate-600/50 transition-all duration-500"
              >
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${
                  feature.color === 'blue' ? 'from-blue-500/20 to-blue-600/10' :
                  feature.color === 'green' ? 'from-emerald-500/20 to-emerald-600/10' :
                  'from-amber-500/20 to-amber-600/10'
                } mb-6`}>
                  {FeatureIcon && <FeatureIcon className={`w-8 h-8 ${
                    feature.color === 'blue' ? 'text-blue-400' :
                    feature.color === 'green' ? 'text-emerald-400' :
                    'text-amber-400'
                  }`} />}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed">{feature.description}</p>
                <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-white mb-4">پلن‌های اشتراک</h2>
          <p className="text-slate-400 text-lg">شروع رایگان، ارتقا در هر زمان</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative overflow-hidden rounded-3xl p-8 ${
                plan.highlighted
                  ? 'bg-gradient-to-br from-blue-600/20 to-purple-600/20 border-2 border-blue-500/50'
                  : 'bg-slate-800/50 border border-slate-700/50'
              }`}
            >
              {plan.highlighted && (
                <Badge className="absolute top-4 left-4 bg-blue-500 text-white">
                  <Star className="w-3 h-3 ml-1" />
                  محبوب‌ترین
                </Badge>
              )}
              <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-black text-white">{plan.price}</span>
                <span className="text-slate-400">تومان/ماه</span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-center gap-3 text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                className={`w-full py-6 rounded-xl ${
                  plan.highlighted
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-slate-700 hover:bg-slate-600 text-white'
                }`}
                onClick={() => navigate(plan.highlighted ? '/account' : '/news')}
              >
                {plan.highlighted ? 'شروع کنید' : 'شروع رایگان'}
              </Button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">FX Brain</span>
            </div>
            <div className="flex items-center gap-6 text-slate-400">
              <Link to={createPageUrl('News')} className="hover:text-white transition-colors">اخبار</Link>
              <Link to={createPageUrl('Calendar')} className="hover:text-white transition-colors">تقویم</Link>
              <Link to={createPageUrl('Alerts')} className="hover:text-white transition-colors">هشدارها</Link>
            </div>
            <p className="text-slate-500 text-sm">© ۲۰۲۶ تمامی حقوق محفوظ است</p>
          </div>
        </div>
      </footer>
    </div>
  );
}