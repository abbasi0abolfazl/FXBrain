// src/Layout.jsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, Newspaper, Calendar, Bell, 
  Menu, X, User, LogOut, LayoutGrid, LineChart, FlaskConical, Zap, Wallet
} from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';

const navItems = [
  { name: 'Dashboard', label: 'داشبورد', icon: LayoutGrid },
  { name: 'News', label: 'اخبار', icon: Newspaper },
  { name: 'Calendar', label: 'تقویم', icon: Calendar },
  { name: 'Charts', label: 'نمودارها', icon: LineChart },
  { name: 'Signals', label: 'سیگنال‌ها', icon: Zap },
  { name: 'PaperTrading', label: 'معاملات مجازی', icon: Wallet },
  { name: 'Backtest', label: 'بک‌تست', icon: FlaskConical },
  { name: 'Alerts', label: 'هشدارها', icon: Bell },
];

export default function Layout({ children = null, currentPageName = '' }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();

  const isActive = (pageName) => {
    const path = createPageUrl(pageName);
    return location.pathname === path || location.pathname === path + '/';
  };

  const handleLogout = async () => {
    await logout();
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-950" dir="rtl">
      <style>{`
        :root {
          --font-sans: 'Vazirmatn', system-ui, -apple-system, sans-serif;
        }
        * {
          font-family: var(--font-sans);
        }
        .font-mono {
          font-family: 'Roboto Mono', monospace;
        }
      `}</style>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to={createPageUrl('Home')} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white hidden sm:block">FX Brain</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map(item => (
                <Link key={item.name} to={createPageUrl(item.name)}>
                  <Button
                    variant="ghost"
                    className={`rounded-xl px-4 transition-all ${
                      isActive(item.name)
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <item.icon className="w-4 h-4 ml-2" />
                    {item.label}
                  </Button>
                </Link>
              ))}
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-3">
              {isAuthenticated && user ? (
                <div className="hidden md:flex items-center gap-3">
                  <Link to={createPageUrl('Account')}>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:bg-slate-700/50 transition-colors cursor-pointer">
                      <User className="w-4 h-4 text-slate-400" />
                      <span className="text-sm text-slate-300">{user.name || user.email}</span>
                    </div>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleLogout}
                    className="text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl"
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <Link to="/login">
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
                  >
                    ورود
                  </Button>
                </Link>
              )}

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-slate-400"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-800/50 bg-slate-950/95 backdrop-blur-xl">
            <div className="px-4 py-4 space-y-2">
              {navItems.map(item => (
                <Link
                  key={item.name}
                  to={createPageUrl(item.name)}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button
                    variant="ghost"
                    className={`w-full justify-start rounded-xl ${
                      isActive(item.name)
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'text-slate-400'
                    }`}
                  >
                    <item.icon className="w-4 h-4 ml-3" />
                    {item.label}
                  </Button>
                </Link>
              ))}
              
              {isAuthenticated && user && (
                <div className="pt-4 border-t border-slate-800 mt-4">
                  <div className="flex items-center justify-between px-3 mb-3">
                    <span className="text-sm text-slate-400">{user.email}</span>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={handleLogout}
                    className="w-full justify-start text-slate-400 hover:text-red-400 hover:bg-red-500/10"
                  >
                    <LogOut className="w-4 h-4 ml-3" />
                    خروج
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content - با چک کردن وجود children */}
      <main className="min-h-[calc(100vh-64px)]">
        {children}
      </main>
    </div>
  );
}