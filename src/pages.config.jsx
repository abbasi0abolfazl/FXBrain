// src/pages.config.jsx
import React from 'react';
import Dashboard from '@/pages/Dashboard';
import News from '@/pages/News';
import Calendar from '@/pages/Calendar';
import Signals from '@/pages/Signals';
import Alerts from '@/pages/Alerts';
import Account from '@/pages/Account';
import Charts from '@/pages/Charts';
import PaperTrading from '@/pages/PaperTrading';
import Backtest from '@/pages/Backtest';
import Home from '@/pages/Home';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

// تابع کمکی برای ایجاد کامپوننت‌های محافظت‌شده
const createProtectedRoute = (Component) => {
  return () => React.createElement(
    ProtectedRoute,
    null,
    React.createElement(Component, null)
  );
};

export const pagesConfig = {
  Pages: {
    Home: createProtectedRoute(Home),
    Dashboard: createProtectedRoute(Dashboard),
    News: createProtectedRoute(News),
    Calendar: createProtectedRoute(Calendar),
    Signals: createProtectedRoute(Signals),
    Alerts: createProtectedRoute(Alerts),
    Account: createProtectedRoute(Account),
    Charts: createProtectedRoute(Charts),
    PaperTrading: createProtectedRoute(PaperTrading),
    Backtest: createProtectedRoute(Backtest),
  },
  mainPage: 'Dashboard'
};

export default pagesConfig;