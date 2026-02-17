// src/pages/Account.jsx
import React, { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  User, 
  Mail, 
  Shield, 
  Calendar, 
  Key, 
  Bell, 
  Globe, 
  Smartphone,
  LogOut,
  Save,
  Edit,
  Award,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';

const API_BASE_URL = 'http://localhost:8000';

// سرویس حساب کاربری
const accountService = {
  async getProfile() {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/api/auth/me?token=${token}`);
    return response.json();
  },

  async updateProfile(data) {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    return response.json();
  },

  async getSettings() {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/api/user/settings?token=${token}`);
    return response.json();
  },

  async updateSettings(data) {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/api/user/settings`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    return response.json();
  }
};

export default function Account() {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    language: 'fa',
    timezone: 'Asia/Tehran'
  });

  // دریافت پروفایل
  const { data: profile, refetch: refetchProfile } = useQuery({
    queryKey: ['user-profile'],
    queryFn: () => accountService.getProfile(),
    enabled: !!user
  });

  // دریافت تنظیمات
  const { data: settings } = useQuery({
    queryKey: ['user-settings'],
    queryFn: () => accountService.getSettings(),
    enabled: !!user
  });

  // آپدیت پروفایل
  const updateMutation = useMutation({
    mutationFn: (data) => accountService.updateProfile(data),
    onSuccess: () => {
      refetchProfile();
      setIsEditing(false);
    }
  });

  const handleSave = () => {
    updateMutation.mutate(formData);
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getRoleBadge = (role) => {
    const roles = {
      admin: { label: 'مدیر سیستم', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
      pro: { label: 'حرفه‌ای', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
      demo: { label: 'آزمایشی', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' }
    };
    return roles[role] || roles.demo;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30">
                <User className="w-7 h-7 text-blue-400" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">حساب کاربری</h1>
                <p className="text-slate-400 text-sm">مدیریت اطلاعات و تنظیمات حساب کاربری</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Profile Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl" />
            
            <CardContent className="p-6 relative">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                {/* Avatar */}
                <div className="relative">
                  <Avatar className="w-24 h-24 border-4 border-slate-700">
                    <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white text-2xl">
                      {getInitials(user?.name || profile?.name)}
                    </AvatarFallback>
                  </Avatar>
                  <Badge className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 ${getRoleBadge(user?.role || profile?.role).color}`}>
                    {getRoleBadge(user?.role || profile?.role).label}
                  </Badge>
                </div>

                {/* Info */}
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {user?.name || profile?.name || 'کاربر'}
                  </h2>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Mail className="w-4 h-4" />
                      {user?.email || profile?.email}
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <Calendar className="w-4 h-4" />
                      عضویت از {new Date(profile?.created_at || Date.now()).toLocaleDateString('fa-IR')}
                    </div>
                  </div>
                </div>

                {/* Logout Button */}
                <Button
                  onClick={logout}
                  variant="outline"
                  className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                >
                  <LogOut className="w-4 h-4 ml-2" />
                  خروج از حساب
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs */}
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="bg-slate-800/50 border border-slate-700/50 p-1">
            <TabsTrigger value="profile" className="data-[state=active]:bg-blue-600">
              <User className="w-4 h-4 ml-2" />
              اطلاعات شخصی
            </TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-blue-600">
              <Shield className="w-4 h-4 ml-2" />
              امنیت
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-blue-600">
              <Bell className="w-4 h-4 ml-2" />
              اعلان‌ها
            </TabsTrigger>
            <TabsTrigger value="api" className="data-[state=active]:bg-blue-600">
              <Key className="w-4 h-4 ml-2" />
              API
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white">اطلاعات شخصی</CardTitle>
                    <CardDescription className="text-slate-400">
                      اطلاعات حساب کاربری خود را مدیریت کنید
                    </CardDescription>
                  </div>
                  {!isEditing ? (
                    <Button
                      onClick={() => setIsEditing(true)}
                      variant="outline"
                      className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
                    >
                      <Edit className="w-4 h-4 ml-2" />
                      ویرایش
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        onClick={() => setIsEditing(false)}
                        variant="outline"
                        className="border-slate-600 text-slate-400 hover:bg-slate-700"
                      >
                        انصراف
                      </Button>
                      <Button
                        onClick={handleSave}
                        disabled={updateMutation.isPending}
                        className="bg-emerald-600 hover:bg-emerald-700"
                      >
                        {updateMutation.isPending ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin ml-2" />
                            ذخیره...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4 ml-2" />
                            ذخیره
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-slate-400">نام و نام خانوادگی</Label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      disabled={!isEditing}
                      className="bg-slate-900/50 border-slate-700 text-white"
                      placeholder="نام خود را وارد کنید"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-400">ایمیل</Label>
                    <Input
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      disabled={!isEditing}
                      type="email"
                      className="bg-slate-900/50 border-slate-700 text-white"
                      placeholder="ایمیل خود را وارد کنید"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-400">شماره تلفن</Label>
                    <Input
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      disabled={!isEditing}
                      className="bg-slate-900/50 border-slate-700 text-white"
                      placeholder="شماره تلفن"
                      dir="ltr"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-400">زبان</Label>
                    <select
                      value={formData.language}
                      onChange={(e) => setFormData(prev => ({ ...prev, language: e.target.value }))}
                      disabled={!isEditing}
                      className="w-full h-10 px-3 rounded-lg bg-slate-900/50 border border-slate-700 text-white disabled:opacity-50"
                    >
                      <option value="fa">فارسی</option>
                      <option value="en">English</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white">امنیت حساب</CardTitle>
                <CardDescription className="text-slate-400">
                  تنظیمات امنیتی و تغییر رمز عبور
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-700/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                        <CheckCircle className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-white font-medium">وضعیت امنیت</p>
                        <p className="text-sm text-slate-400">حساب شما در امنیت کامل است</p>
                      </div>
                    </div>
                    <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                      فعال
                    </Badge>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">تغییر رمز عبور</h3>
                  <div className="space-y-3">
                    <Input
                      type="password"
                      placeholder="رمز عبور فعلی"
                      className="bg-slate-900/50 border-slate-700 text-white"
                      dir="ltr"
                    />
                    <Input
                      type="password"
                      placeholder="رمز عبور جدید"
                      className="bg-slate-900/50 border-slate-700 text-white"
                      dir="ltr"
                    />
                    <Input
                      type="password"
                      placeholder="تکرار رمز عبور جدید"
                      className="bg-slate-900/50 border-slate-700 text-white"
                      dir="ltr"
                    />
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      تغییر رمز عبور
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">ورودهای اخیر</h3>
                  <div className="space-y-2">
                    {[1, 2, 3].map((_, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-slate-900/30">
                        <div className="flex items-center gap-3">
                          <Smartphone className="w-4 h-4 text-slate-500" />
                          <div>
                            <p className="text-sm text-white">Chrome / Windows</p>
                            <p className="text-xs text-slate-500">IP: 192.168.1.{100 + i}</p>
                          </div>
                        </div>
                        <div className="text-xs text-slate-500">
                          {i === 0 ? 'اکنون' : `${i} ساعت پیش`}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white">تنظیمات اعلان‌ها</CardTitle>
                <CardDescription className="text-slate-400">
                  نحوه دریافت اعلان‌ها را تنظیم کنید
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-slate-900/50">
                    <div className="flex items-center gap-3">
                      <Bell className="w-5 h-5 text-blue-400" />
                      <div>
                        <p className="text-white font-medium">اعلان‌های ایمیل</p>
                        <p className="text-sm text-slate-400">دریافت هشدارها از طریق ایمیل</p>
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-slate-900/50">
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-purple-400" />
                      <div>
                        <p className="text-white font-medium">اعلان‌های وب</p>
                        <p className="text-sm text-slate-400">دریافت نوتیفیکیشن در مرورگر</p>
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-slate-900/50">
                    <div className="flex items-center gap-3">
                      <Smartphone className="w-5 h-5 text-emerald-400" />
                      <div>
                        <p className="text-white font-medium">اعلان‌های موبایل</p>
                        <p className="text-sm text-slate-400">دریافت هشدار در اپلیکیشن موبایل</p>
                      </div>
                    </div>
                    <Switch />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">اعلان‌های دریافتی اخیر</h3>
                  <div className="space-y-2">
                    {[1, 2, 3].map((_, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-slate-900/30">
                        <Bell className="w-4 h-4 text-blue-400" />
                        <div className="flex-1">
                          <p className="text-sm text-white">سیگنال خرید EUR/USD</p>
                          <p className="text-xs text-slate-500">۲ ساعت پیش</p>
                        </div>
                        <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                          جدید
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* API Tab */}
          <TabsContent value="api">
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white">کلیدهای API</CardTitle>
                <CardDescription className="text-slate-400">
                  مدیریت کلیدهای API برای اتصال به سرویس‌های خارجی
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert className="bg-blue-500/10 border-blue-500/30">
                  <Key className="h-4 w-4 text-blue-400" />
                  <AlertDescription className="text-blue-400">
                    کلیدهای API خود را با احتیاط نگهداری کنید. هرگز آنها را در اختیار دیگران قرار ندهید.
                  </AlertDescription>
                </Alert>

                <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-700/50">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-white font-medium">کلید اصلی API</h4>
                    <Button size="sm" variant="outline" className="border-blue-500/30 text-blue-400">
                      تولید کلید جدید
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 p-2 rounded bg-slate-950 text-sm font-mono text-slate-400">
                      tk_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
                    </code>
                    <Button size="sm" variant="ghost" className="text-slate-400">
                      کپی
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-white font-medium mb-3">درخواست‌های اخیر API</h4>
                  {[1, 2, 3].map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-slate-900/30">
                      <div>
                        <p className="text-sm text-white">GET /api/signals</p>
                        <p className="text-xs text-slate-500">IP: 192.168.1.{100 + i}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-emerald-400">200 OK</span>
                        <span className="text-xs text-slate-500">{i + 1} ساعت پیش</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}