// src/App.jsx
import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import NavigationTracker from '@/lib/NavigationTracker'
import { pagesConfig } from './pages.config'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import Login from '@/pages/Login';
import { useState, useEffect, lazy, Suspense } from 'react';

// لود تنبل Layout
const Layout = lazy(() => import('@/Layout'));

const { Pages, mainPage } = pagesConfig;
const mainPageKey = mainPage ?? Object.keys(Pages)[0];
const MainPage = mainPageKey ? Pages[mainPageKey] : <></>;

// کامپوننت داخلی که به Router دسترسی دارد
const AppRoutes = () => {
  const { isLoading, isAuthenticated, authError } = useAuth();

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  if (authError?.type === 'user_not_registered') {
    return <UserNotRegisteredError />;
  }

  // رندر صفحات محافظت شده با Layout
  return (
    <Suspense fallback={
      <div className="fixed inset-0 flex items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400">در حال بارگذاری...</p>
        </div>
      </div>
    }>
      <Routes>
        <Route path="/login" element={<Navigate to="/" replace />} />
        <Route 
          path="/" 
          element={
            <Layout currentPageName={mainPageKey}>
              <MainPage />
            </Layout>
          } 
        />
        {Object.entries(Pages).map(([path, Page]) => {
          if (!Page || path === 'Login') return null;
          return (
            <Route
              key={path}
              path={`/${path}`}
              element={
                <Layout currentPageName={path}>
                  <Page />
                </Layout>
              }
            />
          );
        })}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Suspense>
  );
};

function App() {
  return (
    <Router>
      <QueryClientProvider client={queryClientInstance}>
        <AuthProvider>
          <NavigationTracker />
          <AppRoutes />
          <Toaster />
        </AuthProvider>
      </QueryClientProvider>
    </Router>
  );
}

export default App;