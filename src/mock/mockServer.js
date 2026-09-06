// Standalone In-Browser Mock API Server for FX Brain
// Intercepts /api/* requests so the application runs 100% serverless on Cloudflare Pages
import {
  initialUsers,
  initialNews,
  initialEvents,
  initialSignals,
  initialAlerts,
  initialWidgets,
  generateSampleChart,
} from './mockData';

const STORAGE_KEYS = {
  ALERTS: 'fxbrain_mock_alerts',
  DASHBOARD: 'fxbrain_mock_dashboard',
  USER: 'fxbrain_mock_user',
  SETTINGS: 'fxbrain_mock_settings',
};

function getStored(key, fallback) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch (e) {
    return fallback;
  }
}

function setStored(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
}

export function initMockApi() {
  if (typeof window === 'undefined') return;

  // Initialize storage defaults if empty
  if (!localStorage.getItem(STORAGE_KEYS.ALERTS)) {
    setStored(STORAGE_KEYS.ALERTS, initialAlerts);
  }
  if (!localStorage.getItem(STORAGE_KEYS.USER)) {
    setStored(STORAGE_KEYS.USER, initialUsers[0]);
  }

  const originalFetch = window.fetch.bind(window);

  window.fetch = async function (input, init = {}) {
    const url = typeof input === 'string' ? input : input?.url || '';
    const method = (init?.method || 'GET').toUpperCase();

    // Check if the URL is an FX Brain API call
    if (!url.includes('/api/')) {
      return originalFetch(input, init);
    }

    try {
      // Parse endpoint and query parameters
      const urlObj = new URL(url, window.location.origin);
      const pathname = urlObj.pathname;
      const searchParams = urlObj.searchParams;

      // ================= AUTH =================
      if (pathname.includes('/api/auth/login')) {
        let body = {};
        if (init.body) {
          try { body = JSON.parse(init.body); } catch (e) {}
        }
        const user = initialUsers.find(u => u.email === body.email) || {
          id: 1,
          email: body.email || 'demo@fxbrain.com',
          name: 'کاربر دمو (FX Brain)',
          role: 'pro',
          is_active: true
        };
        setStored(STORAGE_KEYS.USER, user);
        return jsonResponse({
          token: 'mock-jwt-token-' + Date.now(),
          user,
          message: 'ورود موفقیت‌آمیز بود'
        });
      }

      if (pathname.includes('/api/auth/me')) {
        const user = getStored(STORAGE_KEYS.USER, initialUsers[0]);
        return jsonResponse(user);
      }

      if (pathname.includes('/api/auth/logout')) {
        return jsonResponse({ message: 'با موفقیت خارج شدید' });
      }

      if (pathname.includes('/api/auth/register')) {
        let body = {};
        if (init.body) {
          try { body = JSON.parse(init.body); } catch (e) {}
        }
        const newUser = {
          id: Date.now(),
          email: body.email || 'user@example.com',
          name: body.name || 'کاربر جدید',
          role: 'pro',
          is_active: true,
          created_at: new Date().toISOString()
        };
        setStored(STORAGE_KEYS.USER, newUser);
        return jsonResponse({
          token: 'mock-jwt-token-' + Date.now(),
          user: newUser,
          message: 'ثبت‌نام موفقیت‌آمیز بود'
        });
      }

      if (pathname.includes('/api/auth/profile')) {
        let body = {};
        if (init.body) {
          try { body = JSON.parse(init.body); } catch (e) {}
        }
        const currentUser = getStored(STORAGE_KEYS.USER, initialUsers[0]);
        const updated = { ...currentUser, ...body };
        setStored(STORAGE_KEYS.USER, updated);
        return jsonResponse(updated);
      }

      // ================= NEWS =================
      if (pathname.endsWith('/api/news/config')) {
        return jsonResponse({
          pageTitle: 'اخبار و تحلیل هوشمند بازار',
          pageSubtitle: 'تحلیل لحظه‌ای اخبار فارکس با هوش مصنوعی',
          searchPlaceholder: 'جستجو در اخبار...',
          refreshButton: 'بروزرسانی',
          emptyTitle: 'خبری یافت نشد',
          emptySubtitle: 'فیلترهای جستجو را تغییر دهید'
        });
      }

      if (pathname.endsWith('/api/news/filters')) {
        return jsonResponse({
          impact: [
            { value: 'all', label: 'همه' },
            { value: 'high', label: 'تأثیر بالا' },
            { value: 'medium', label: 'تأثیر متوسط' },
            { value: 'low', label: 'تأثیر کم' }
          ],
          sentiment: [
            { value: 'all', label: 'همه' },
            { value: 'positive', label: '😊 مثبت' },
            { value: 'neutral', label: '😐 خنثی' },
            { value: 'negative', label: '😟 منفی' }
          ]
        });
      }

      if (pathname.endsWith('/api/news/stats')) {
        return jsonResponse({
          total: initialNews.length,
          bullish: 5,
          bearish: 2,
          neutral: 1,
          avgConfidence: 82,
          byImpact: { high: 4, medium: 3, low: 1 }
        });
      }

      if (pathname === '/api/news' || pathname.endsWith('/api/news')) {
        let news = [...initialNews];
        const search = searchParams.get('search');
        const impact = searchParams.get('impact');
        const sentiment = searchParams.get('sentiment');
        const prediction = searchParams.get('prediction');

        if (search) {
          const s = search.toLowerCase();
          news = news.filter(n => n.title.toLowerCase().includes(s) || n.summary.toLowerCase().includes(s));
        }
        if (impact && impact !== 'all') {
          news = news.filter(n => n.impact_level === impact);
        }
        if (sentiment && sentiment !== 'all') {
          news = news.filter(n => n.sentiment === sentiment);
        }
        if (prediction && prediction !== 'all') {
          news = news.filter(n => n.prediction && n.prediction.toLowerCase().includes(prediction.toLowerCase()));
        }
        return jsonResponse(news);
      }

      // ================= CALENDAR =================
      if (pathname.endsWith('/api/calendar/config')) {
        return jsonResponse({
          pageTitle: 'تقویم اقتصادی فارکس',
          pageSubtitle: 'رویدادهای مهم اقتصادی و پیش‌بینی نوسانات بازار',
          refreshButton: 'بروزرسانی',
          emptyTitle: 'رویدادی یافت نشد',
          emptySubtitle: 'فیلترهای جستجو را تغییر دهید'
        });
      }

      if (pathname.endsWith('/api/calendar/filters')) {
        return jsonResponse({
          time: [
            { value: 'today', label: 'امروز' },
            { value: 'week', label: 'این هفته' },
            { value: 'all', label: 'همه' }
          ],
          importance: [
            { value: 'all', label: 'همه' },
            { value: 'high', label: 'زیاد' },
            { value: 'medium', label: 'متوسط' },
            { value: 'low', label: 'کم' }
          ],
          countries: ['همه', 'USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD']
        });
      }

      if (pathname.endsWith('/api/calendar/events')) {
        let events = [...initialEvents];
        const importance = searchParams.get('importance');
        const country = searchParams.get('country');
        if (importance && importance !== 'all') {
          events = events.filter(e => e.importance === importance);
        }
        if (country && country !== 'all' && country !== 'همه') {
          events = events.filter(e => e.country === country);
        }
        return jsonResponse(events);
      }

      // ================= SIGNALS =================
      if (pathname.endsWith('/api/signals/config')) {
        return jsonResponse({
          pageTitle: 'سیگنال‌های معاملاتی هوشمند',
          pageSubtitle: 'سیگنال‌های تولید شده توسط الگوریتم‌های AI',
          refreshButton: 'بروزرسانی',
          emptyTitle: 'سیگنالی یافت نشد',
          emptySubtitle: 'فیلترهای انتخابی را تغییر دهید'
        });
      }

      if (pathname.endsWith('/api/signals/stats')) {
        return jsonResponse({
          total: initialSignals.length,
          active: initialSignals.filter(s => s.status === 'active').length,
          hit_tp: initialSignals.filter(s => s.status === 'hit_tp').length,
          hit_sl: initialSignals.filter(s => s.status === 'hit_sl').length,
          win_rate: '۸۳٪'
        });
      }

      if (pathname === '/api/signals' || pathname.endsWith('/api/signals')) {
        let signals = [...initialSignals];
        const status = searchParams.get('status');
        const pair = searchParams.get('pair');
        const type = searchParams.get('signal_type');

        if (status && status !== 'all') {
          signals = signals.filter(s => s.status === status);
        }
        if (pair && pair !== 'all') {
          signals = signals.filter(s => s.pair === pair);
        }
        if (type && type !== 'all') {
          signals = signals.filter(s => s.signal_type === type);
        }
        return jsonResponse(signals);
      }

      // ================= ALERTS =================
      if (pathname.endsWith('/api/alerts/config')) {
        return jsonResponse({
          pageTitle: 'هشدارهای من',
          pageSubtitle: 'مدیریت هشدارهای قیمتی، خبری و تکنیکال',
          newAlertButton: 'هشدار جدید'
        });
      }

      if (pathname.endsWith('/api/alerts/stats')) {
        const alerts = getStored(STORAGE_KEYS.ALERTS, initialAlerts);
        return jsonResponse({
          total: alerts.length,
          active: alerts.filter(a => a.is_active).length,
          inactive: alerts.filter(a => !a.is_active).length,
          triggered: alerts.filter(a => a.triggered_at).length
        });
      }

      if (pathname.endsWith('/api/alerts/conditions')) {
        return jsonResponse([
          { id: 'price_above', label: 'قیمت بالاتر از', input_type: 'number' },
          { id: 'price_below', label: 'قیمت پایین‌تر از', input_type: 'number' },
          { id: 'rsi_above', label: 'RSI بالاتر از', input_type: 'number' },
          { id: 'rsi_below', label: 'RSI پایین‌تر از', input_type: 'number' },
          { id: 'news_high_impact', label: 'اخبار با تأثیر بالا', input_type: 'none' }
        ]);
      }

      if (pathname.endsWith('/api/alerts')) {
        const alerts = getStored(STORAGE_KEYS.ALERTS, initialAlerts);
        if (method === 'POST') {
          let body = {};
          if (init.body) {
            try { body = JSON.parse(init.body); } catch (e) {}
          }
          const newAlert = {
            id: Date.now(),
            name: body.name || 'هشدار جدید',
            currency_pair: body.currency_pair || 'EUR/USD',
            condition_type: body.condition_type || 'price_above',
            condition_value: body.condition_value || null,
            notification_channels: body.notification_channels || ['web'],
            is_active: true,
            triggered_at: null,
            created_at: new Date().toISOString(),
            user_id: 1
          };
          const updated = [newAlert, ...alerts];
          setStored(STORAGE_KEYS.ALERTS, updated);
          return jsonResponse(newAlert, 201);
        }
        return jsonResponse(alerts);
      }

      // Match /api/alerts/:id
      const alertIdMatch = pathname.match(/\/api\/alerts\/(\d+)/);
      if (alertIdMatch) {
        const alertId = parseInt(alertIdMatch[1], 10);
        let alerts = getStored(STORAGE_KEYS.ALERTS, initialAlerts);

        if (method === 'DELETE') {
          alerts = alerts.filter(a => a.id !== alertId);
          setStored(STORAGE_KEYS.ALERTS, alerts);
          return jsonResponse({ message: 'هشدار حذف شد' });
        }

        if (method === 'PATCH' || method === 'PUT') {
          let body = {};
          if (init.body) {
            try { body = JSON.parse(init.body); } catch (e) {}
          }
          alerts = alerts.map(a => a.id === alertId ? { ...a, ...body } : a);
          setStored(STORAGE_KEYS.ALERTS, alerts);
          const updatedAlert = alerts.find(a => a.id === alertId);
          return jsonResponse(updatedAlert);
        }
      }

      // ================= DASHBOARD =================
      if (pathname.endsWith('/api/dashboard/config')) {
        return jsonResponse({
          pageTitle: 'داشبورد من',
          pageSubtitle: 'ویجت‌های خود را شخصی‌سازی و جابجا کنید',
          editButton: 'ویرایش داشبورد',
          saveButton: 'ذخیره چیدمان',
          cancelButton: 'انصراف'
        });
      }

      if (pathname.endsWith('/api/dashboard/widgets')) {
        return jsonResponse(initialWidgets);
      }

      if (pathname.endsWith('/api/dashboard/defaults')) {
        return jsonResponse(['signals', 'news', 'calendar', 'chart_eurusd']);
      }

      if (pathname.endsWith('/api/dashboard/stats')) {
        const alerts = getStored(STORAGE_KEYS.ALERTS, initialAlerts);
        return jsonResponse({
          active_signals: initialSignals.filter(s => s.status === 'active').length,
          today_events: initialEvents.length,
          active_alerts: alerts.filter(a => a.is_active).length,
          important_news: initialNews.filter(n => n.impact_level === 'high').length
        });
      }

      if (pathname.includes('/api/dashboard/user/')) {
        const stored = getStored(STORAGE_KEYS.DASHBOARD, null);
        if (method === 'POST' || method === 'PUT') {
          let body = {};
          if (init.body) {
            try { body = JSON.parse(init.body); } catch (e) {}
          }
          setStored(STORAGE_KEYS.DASHBOARD, body);
          return jsonResponse(body);
        }
        return jsonResponse(stored || {
          user_id: 1,
          widgets: [
            { id: "signals", order: 0, config: { max_signals: 4 } },
            { id: "news", order: 1, config: {} },
            { id: "alerts", order: 2, config: {} },
            { id: "chart_eurusd", order: 3, config: { interval: "1h" } }
          ]
        });
      }

      if (pathname.includes('/api/dashboard/widgets/chart_')) {
        let pair = 'EUR/USD';
        if (pathname.includes('chart_gbpusd')) pair = 'GBP/USD';
        if (pathname.includes('chart_xauusd')) pair = 'XAU/USD';
        if (pathname.includes('chart_btcusd')) pair = 'BTC/USD';
        return jsonResponse(generateSampleChart(pair));
      }

      // ================= USER SETTINGS =================
      if (pathname.includes('/api/user/settings')) {
        const settings = getStored(STORAGE_KEYS.SETTINGS, {
          notifications: {
            channels: { web: true, telegram: false, email: true },
            types: { news_alerts: true, price_alerts: true, calendar_alerts: false }
          },
          theme: 'dark'
        });
        if (method === 'POST' || method === 'PUT') {
          let body = {};
          if (init.body) {
            try { body = JSON.parse(init.body); } catch (e) {}
          }
          const updated = { ...settings, ...body };
          setStored(STORAGE_KEYS.SETTINGS, updated);
          return jsonResponse(updated);
        }
        return jsonResponse(settings);
      }

      // Fallback for health check
      if (pathname.includes('/health') || pathname === '/') {
        return jsonResponse({ status: 'healthy', mode: 'standalone-browser', timestamp: new Date().toISOString() });
      }

      // Default empty list or object
      return jsonResponse({});
    } catch (err) {
      console.error('Mock API Error:', err);
      return jsonResponse({ error: err.message }, 500);
    }
  };
}

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    statusText: status === 200 ? 'OK' : 'Error',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  });
}
