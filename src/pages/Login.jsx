// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';  // اضافه کردن Card و CardContent
import { Badge } from '@/components/ui/badge';
import { 
  LogIn, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  AlertCircle,
  TrendingUp,
  Zap,
  Shield,
  User,
  Sparkles
} from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await login(formData.email, formData.password, formData.rememberMe);
      navigate('/');
    } catch (err) {
      setError(err.message || 'خطا در ورود به سیستم');
    }
  };

  const handleDemoLogin = (type) => {
    if (type === 'demo') {
      setFormData({
        email: 'demo@example.com',
        password: 'demo123',
        rememberMe: false
      });
    } else if (type === 'pro') {
      setFormData({
        email: 'pro@example.com',
        password: 'pro123',
        rememberMe: false
      });
    } else if (type === 'admin') {
      setFormData({
        email: 'admin@example.com',
        password: 'admin123',
        rememberMe: false
      });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  const demoAccounts = [
    { 
      type: 'demo', 
      label: 'کاربر آزمایشی', 
      icon: User, 
      color: 'blue',
      email: 'demo@example.com',
      password: 'demo123',
      description: 'دسترسی محدود به امکانات پایه'
    },
    { 
      type: 'pro', 
      label: 'کاربر حرفه‌ای', 
      icon: Shield, 
      color: 'amber',
      email: 'pro@example.com',
      password: 'pro123',
      description: 'دسترسی کامل به تمام امکانات'
    },
    { 
      type: 'admin', 
      label: 'مدیر سیستم', 
      icon: Sparkles, 
      color: 'purple',
      email: 'admin@example.com',
      password: 'admin123',
      description: 'دسترسی مدیریت به سیستم'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: {
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/30',
        text: 'text-blue-400',
        hover: 'hover:bg-blue-500/20',
        gradient: 'from-blue-500/20 to-blue-600/10'
      },
      amber: {
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/30',
        text: 'text-amber-400',
        hover: 'hover:bg-amber-500/20',
        gradient: 'from-amber-500/20 to-amber-600/10'
      },
      purple: {
        bg: 'bg-purple-500/10',
        border: 'border-purple-500/30',
        text: 'text-purple-400',
        hover: 'hover:bg-purple-500/20',
        gradient: 'from-purple-500/20 to-purple-600/10'
      }
    };
    return colors[color] || colors.blue;
  };

  // SVG pattern به صورت متغیر جداگانه
  const patternSvg = "data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative w-full max-w-6xl bg-slate-900/40 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-2xl overflow-hidden"
      >
        <div className="flex flex-col lg:flex-row">
          {/* Right Side - Login Form */}
          <motion.div 
            variants={itemVariants}
            className="flex-1 p-8 lg:p-12"
          >
            {/* Logo and Header */}
            <div className="mb-8">
              <motion.div 
                variants={itemVariants}
                className="flex items-center gap-3 mb-6"
              >
                <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30">
                  <TrendingUp className="w-8 h-8 text-blue-400" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">FX Brain</h1>
                  <p className="text-slate-400 text-sm">پلتفرم حرفه‌ای تحلیل بازار</p>
                </div>
              </motion.div>

              <motion.h2 
                variants={itemVariants}
                className="text-3xl font-bold text-white mb-2"
              >
                ورود به حساب
              </motion.h2>
              <motion.p 
                variants={itemVariants}
                className="text-slate-400"
              >
                برای دسترسی به داشبورد و سیگنال‌های معاملاتی وارد شوید
              </motion.p>
            </div>

            {/* Error Alert */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
              >
                <Alert variant="destructive" className="bg-red-500/10 border-red-500/30 text-red-400">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </motion.div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div variants={itemVariants} className="space-y-2">
                <Label htmlFor="email" className="text-slate-300 text-sm">
                  ایمیل
                </Label>
                <div className="relative">
                  <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="example@email.com"
                    className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-600 pr-10 h-12 focus:border-blue-500/50 transition-colors"
                    required
                    dir="ltr"
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-2">
                <Label htmlFor="password" className="text-slate-300 text-sm">
                  رمز عبور
                </Label>
                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-600 pr-10 h-12 focus:border-blue-500/50 transition-colors"
                    required
                    dir="ltr"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-400 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </motion.div>

              <motion.div 
                variants={itemVariants}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="remember"
                    checked={formData.rememberMe}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, rememberMe: checked }))
                    }
                    className="border-slate-600 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                  />
                  <Label htmlFor="remember" className="text-sm text-slate-400 cursor-pointer">
                    مرا به خاطر بسپار
                  </Label>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/forgot-password')}
                  className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                >
                  رمز عبور را فراموش کرده‌اید؟
                </button>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white h-12 rounded-xl text-base font-medium shadow-lg shadow-blue-500/20 transition-all duration-300 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin ml-2" />
                      در حال ورود...
                    </>
                  ) : (
                    <>
                      <LogIn className="w-5 h-5 ml-2" />
                      ورود
                    </>
                  )}
                </Button>
              </motion.div>
            </form>

            {/* Demo Accounts - Improved */}
            <motion.div 
              variants={itemVariants}
              className="mt-8"
            >
              <div className="relative mb-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-700/50"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-slate-900/40 text-slate-400 rounded-lg">
                    حساب‌های آزمایشی
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {demoAccounts.map((account) => {
                  const Icon = account.icon;
                  const colors = getColorClasses(account.color);
                  
                  return (
                    <Card
                      key={account.type}
                      className={`relative overflow-hidden cursor-pointer transition-all duration-300 bg-slate-800/30 border-slate-700/50 hover:border-${account.color}-500/50 hover:shadow-lg hover:shadow-${account.color}-500/10 group`}
                      onClick={() => handleDemoLogin(account.type)}
                    >
                      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br ${colors.gradient}`} />
                      
                      <CardContent className="p-4 relative">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${colors.bg} ${colors.text}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="text-sm font-semibold text-white">
                                {account.label}
                              </h4>
                              <Badge variant="outline" className={`text-[10px] ${colors.text} ${colors.border}`}>
                                {account.type === 'demo' ? 'رایگان' : account.type === 'pro' ? 'حرفه‌ای' : 'مدیریت'}
                              </Badge>
                            </div>
                            
                            <p className="text-xs text-slate-500 mb-2 line-clamp-2">
                              {account.description}
                            </p>
                            
                            <div className="flex items-center gap-1 text-[10px] font-mono text-slate-600 bg-slate-900/50 rounded p-1">
                              <Mail className="w-3 h-3" />
                              <span className="truncate">{account.email}</span>
                            </div>
                          </div>
                        </div>

                        {/* Quick access button */}
                        <div className={`absolute left-2 bottom-2 opacity-0 group-hover:opacity-100 transition-opacity ${colors.text}`}>
                          <span className="text-[10px]">ورود سریع →</span>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              <p className="text-center text-xs text-slate-500 mt-3">
                حساب‌های آزمایشی برای آشنایی با محیط و امکانات پلتفرم
              </p>
            </motion.div>

            {/* Register Link */}
            <motion.p 
              variants={itemVariants}
              className="mt-6 text-center text-slate-400 text-sm"
            >
              حساب کاربری ندارید؟{' '}
              <button
                onClick={() => navigate('/register')}
                className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
              >
                ثبت نام کنید
              </button>
            </motion.p>
          </motion.div>

          {/* Left Side - Features */}
          <motion.div 
            variants={itemVariants}
            className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-blue-600/20 p-12 flex-col justify-between relative overflow-hidden"
          >
            <div 
              className="absolute inset-0 opacity-20"
              style={{ backgroundImage: `url('${patternSvg}')` }}
            />
            
            <div className="relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mb-8"
              >
                <Badge className="bg-white/10 text-white border-white/20 px-3 py-1 mb-4">
                  ✨ پلتفرم حرفه‌ای معاملاتی
                </Badge>
                
                <h3 className="text-3xl font-bold text-white mb-4">
                  به جمع معامله‌گران حرفه‌ای بپیوندید
                </h3>
                <p className="text-blue-100 mb-8">
                  با استفاده از سیگنال‌های هوشمند و تحلیل‌های لحظه‌ای، سودآوری خود را افزایش دهید
                </p>
              </motion.div>

              <div className="space-y-4">
                {[
                  { icon: Zap, text: 'سیگنال‌های لحظه‌ای با دقت بالا', color: 'text-yellow-400', desc: 'بیش از ۸۵٪ دقت در پیش‌بینی' },
                  { icon: TrendingUp, text: 'تحلیل تکنیکال پیشرفته', color: 'text-emerald-400', desc: 'بیش از ۲۰ اندیکاتور حرفه‌ای' },
                  { icon: Shield, text: 'مدیریت ریسک هوشمند', color: 'text-blue-400', desc: 'محافظت از سرمایه با الگوریتم‌های پیشرفته' }
                ].map((feature, i) => {
                  const Icon = feature.icon;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + i * 0.1 }}
                      className="flex items-start gap-3 p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10"
                    >
                      <div className={`p-2 rounded-lg bg-white/10 ${feature.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-white font-medium block">{feature.text}</span>
                        <span className="text-xs text-white/60">{feature.desc}</span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Statistics */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="grid grid-cols-3 gap-4 mt-8"
              >
                {[
                  { value: '۱۵۰۰+', label: 'کاربر فعال' },
                  { value: '۹۸٪', label: 'رضایت کاربران' },
                  { value: '۲۴/۷', label: 'پشتیبانی' }
                ].map((stat, i) => (
                  <div key={i} className="text-center">
                    <div className="text-xl font-bold text-white">{stat.value}</div>
                    <div className="text-xs text-blue-200/60">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;