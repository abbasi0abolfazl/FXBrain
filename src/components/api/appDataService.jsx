// API Service with static data for all pages
// This simulates API responses with fixed values



export const AppAPI = {
  // ========== HOME PAGE ==========
  home: {
    getFeatures: async () => {
      return [
        { icon: 'Newspaper', title: 'تحلیل هوشمند اخبار', description: 'تحلیل لحظه‌ای اخبار فارکس با هوش مصنوعی و پیش‌بینی جهت بازار', color: 'blue' },
        { icon: 'Calendar', title: 'تقویم اقتصادی پیشرفته', description: 'رویدادهای اقتصادی مهم با پیش‌بینی تأثیر و نوسان‌پذیری', color: 'green' },
        { icon: 'Bell', title: 'هشدارهای هوشمند', description: 'تنظیم هشدار بر اساس قیمت، اندیکاتورها و اخبار مهم', color: 'orange' },
      ];
    },
    getPlans: async () => {
      return [
        { name: 'رایگان', price: '۰', features: ['۳ هشدار فعال', 'اخبار روزانه', 'تقویم اقتصادی پایه'], highlighted: false },
        { name: 'پریمیوم', price: '۹۹,۰۰۰', features: ['هشدار نامحدود', 'تحلیل AI پیشرفته', 'اعلان تلگرام', 'API دسترسی'], highlighted: true },
      ];
    },
    getStats: async () => {
      return [
        { key: 'news', title: 'اخبار امروز', value: '۲۴', icon: 'Newspaper', color: 'blue', trend: 12 },
        { key: 'events', title: 'رویداد این هفته', value: '۱۸', icon: 'Calendar', color: 'green' },
        { key: 'alerts', title: 'هشدار فعال', value: '۱۵۶', icon: 'Bell', color: 'orange' },
        { key: 'users', title: 'کاربر فعال', value: '۲,۵۰۰+', icon: 'TrendingUp', color: 'purple' },
      ];
    },
    getHeroContent: async () => {
      return {
        badge: 'قدرت‌گرفته از هوش مصنوعی',
        title: 'جعبه ابزار',
        titleHighlight: 'تریدرها',
        description: 'تحلیل هوشمند اخبار، تقویم اقتصادی پیشرفته و هشدارهای قیمتی در یک پلتفرم یکپارچه',
        primaryButton: 'شروع رایگان',
        secondaryButton: 'مشاهده دمو',
      };
    },
  },

  // ========== DASHBOARD PAGE ==========
  dashboard: {
    getConfig: async () => {
      return {
        pageTitle: 'داشبورد من',
        pageSubtitle: 'ویجت‌های خود را شخصی‌سازی کنید',
        editButton: 'ویرایش داشبورد',
        saveButton: 'ذخیره',
        cancelButton: 'انصراف',
        emptyTitle: 'داشبورد خالی است',
        emptySubtitle: 'ویجت‌های مورد نظر خود را اضافه کنید',
        addWidgetButton: 'افزودن ویجت',
        widgetSelectorLabel: 'ویجت‌های موجود:',
      };
    },
    getAvailableWidgets: async () => {
      return [
        { id: 'signals', type: 'signals', title: 'سیگنال‌های AI', icon: 'Zap' },
        { id: 'news', type: 'news', title: 'اخبار', icon: 'Newspaper' },
        { id: 'calendar', type: 'calendar', title: 'تقویم اقتصادی', icon: 'Calendar' },
        { id: 'alerts', type: 'alerts', title: 'هشدارها', icon: 'Bell' },
        { id: 'chart_eurusd', type: 'chart', title: 'نمودار EURUSD', icon: 'LineChart', pair: 'EURUSD' },
        { id: 'chart_gbpusd', type: 'chart', title: 'نمودار GBPUSD', icon: 'LineChart', pair: 'GBPUSD' },
        { id: 'chart_xauusd', type: 'chart', title: 'نمودار XAUUSD', icon: 'LineChart', pair: 'XAUUSD' },
        { id: 'chart_btcusd', type: 'chart', title: 'نمودار BTCUSD', icon: 'LineChart', pair: 'BTCUSD' },
      ];
    },
    getDefaultWidgets: async () => {
      return ['signals', 'news', 'calendar', 'chart_eurusd'];
    },
  },

  // ========== NEWS PAGE ==========
  news: {
    getConfig: async () => {
      return {
        pageTitle: 'اخبار و تحلیل بازار',
        pageSubtitle: 'تحلیل هوشمند اخبار فارکس با هوش مصنوعی',
        searchPlaceholder: 'جستجو در اخبار...',
        refreshButton: 'بروزرسانی',
        emptyTitle: 'خبری یافت نشد',
        emptySubtitle: 'فیلترهای جستجو را تغییر دهید',
      };
    },
    getFilters: async () => {
      return {
        impact: [
          { value: 'all', label: 'همه' },
          { value: 'high', label: 'تأثیر بالا' },
          { value: 'medium', label: 'تأثیر متوسط' },
          { value: 'low', label: 'تأثیر کم' },
        ],
        sentiment: [
          { value: 'all', label: 'همه' },
          { value: 'positive', label: '😊 مثبت' },
          { value: 'neutral', label: '😐 خنثی' },
          { value: 'negative', label: '😟 منفی' },
        ],
      };
    },
  },

  // ========== CALENDAR PAGE ==========
  calendar: {
    getConfig: async () => {
      return {
        pageTitle: 'تقویم اقتصادی',
        pageSubtitle: 'رویدادهای مهم اقتصادی و پیش‌بینی نوسانات',
        refreshButton: 'بروزرسانی',
        emptyTitle: 'رویدادی یافت نشد',
        emptySubtitle: 'فیلترهای جستجو را تغییر دهید',
        upcomingAlertTitle: 'رویدادهای پراهمیت پیش رو',
        tableHeaders: {
          time: 'زمان',
          country: 'کشور',
          event: 'رویداد',
          importance: 'اهمیت',
          forecast: 'پیش‌بینی',
          previous: 'قبلی',
          actual: 'واقعی',
        },
      };
    },
    getFilters: async () => {
      return {
        time: [
          { value: 'today', label: 'امروز' },
          { value: 'week', label: 'این هفته' },
          { value: 'all', label: 'همه' },
        ],
        importance: [
          { value: 'all', label: 'همه' },
          { value: 'high', label: 'زیاد' },
          { value: 'medium', label: 'متوسط' },
          { value: 'low', label: 'کم' },
        ],
        countries: ['همه', 'USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD'],
      };
    },
  },

  // ========== CHARTS PAGE ==========
  charts: {
    getConfig: async () => {
      return {
        pageTitle: 'نمودارهای تحلیلی',
        pageSubtitle: 'نمودارهای تعاملی با اندیکاتورها',
        compareSectionTitle: 'مقایسه جفت ارزها',
      };
    },
    getCurrencyPairs: async () => {
      return [
        { value: 'EURUSD', label: 'EUR/USD', flag: '🇪🇺' },
        { value: 'GBPUSD', label: 'GBP/USD', flag: '🇬🇧' },
        { value: 'USDJPY', label: 'USD/JPY', flag: '🇯🇵' },
        { value: 'XAUUSD', label: 'XAU/USD (طلا)', flag: '🥇' },
        { value: 'BTCUSD', label: 'BTC/USD', flag: '₿' },
      ];
    },
  },

  // ========== SIGNALS PAGE ==========
  signals: {
    getConfig: async () => {
      return {
        pageTitle: 'سیگنال‌های معاملاتی AI',
        pageSubtitle: 'سیگنال‌های هوشمند بر اساس تحلیل اخبار، تقویم و تکنیکال',
        proBadge: 'ویژه پلن حرفه‌ای',
        emptyTitle: 'سیگنالی یافت نشد',
        emptySubtitle: 'فیلترها را تغییر دهید',
        stats: {
          activeLabel: 'سیگنال فعال',
          successLabel: 'نرخ موفقیت',
          buyLabel: 'سیگنال خرید',
          sellLabel: 'سیگنال فروش',
        },
      };
    },
    getFilters: async () => {
      return {
        status: [
          { value: 'all', label: 'همه' },
          { value: 'active', label: 'فعال' },
          { value: 'hit_tp', label: 'سود' },
          { value: 'hit_sl', label: 'ضرر' },
        ],
        type: [
          { value: 'all', label: 'همه' },
          { value: 'buy', label: 'خرید' },
          { value: 'sell', label: 'فروش' },
        ],
      };
    },
  },

  // ========== PAPER TRADING PAGE ==========
  paperTrading: {
    getConfig: async () => {
      return {
        pageTitle: 'معاملات مجازی',
        pageSubtitle: 'تمرین معامله با پول مجازی و داده‌های زنده',
        resetButton: 'ریست پرتفوی',
        positionsTab: 'پوزیشن‌های باز',
        historyTab: 'تاریخچه',
        noHistoryMessage: 'هنوز معامله‌ای بسته نشده',
        chartLabel: 'نمودار',
        tableHeaders: {
          pair: 'جفت ارز',
          type: 'نوع',
          entry: 'ورود',
          exit: 'خروج',
          pnl: 'سود/زیان',
        },
        tradeTypes: {
          buy: 'خرید',
          sell: 'فروش',
        },
        initialBalance: 10000,
      };
    },
  },

  // ========== BACKTEST PAGE ==========
  backtest: {
    getConfig: async () => {
      return {
        pageTitle: 'بک‌تست استراتژی',
        pageSubtitle: 'تست استراتژی‌های معاملاتی روی داده‌های تاریخی',
        newTestTab: 'تست جدید',
        historyTab: 'تاریخچه',
        emptyTitle: 'آماده تست',
        emptySubtitle: 'تنظیمات استراتژی را پیکربندی کنید و دکمه اجرا را بزنید',
        runningTitle: 'در حال اجرای بک‌تست',
        runningSubtitle: 'لطفاً صبر کنید...',
        emptyHistoryTitle: 'تاریخچه خالی',
        emptyHistorySubtitle: 'هنوز بک‌تستی اجرا نشده است',
        tradesLabel: 'معامله',
      };
    },
    getStrategies: async () => {
      return {
        ma_crossover: 'تقاطع میانگین متحرک',
        rsi_oversold: 'RSI اشباع فروش',
        breakout: 'شکست سطوح',
        mean_reversion: 'بازگشت به میانگین',
      };
    },
  },

  // ========== ALERTS PAGE ==========
  alerts: {
    getConfig: async () => {
      return {
        pageTitle: 'هشدارهای من',
        pageSubtitle: 'مدیریت هشدارهای قیمتی و خبری',
        newAlertButton: 'هشدار جدید',
        emptyTitle: 'هشداری ندارید',
        emptySubtitle: 'با ایجاد هشدار، از تغییرات مهم بازار باخبر شوید',
        createFirstButton: 'اولین هشدار خود را بسازید',
        activeAlertsTitle: 'هشدارهای فعال',
        inactiveAlertsTitle: 'هشدارهای غیرفعال',
        stats: {
          total: 'کل هشدارها',
          active: 'فعال',
          inactive: 'غیرفعال',
          triggered: 'فعال شده',
        },
      };
    },
  },

  // ========== ACCOUNT PAGE ==========
  account: {
    getConfig: async () => {
      return {
        pageTitle: 'حساب کاربری',
        tabs: {
          profile: 'پروفایل',
          subscription: 'اشتراک',
          notifications: 'اعلان‌ها',
        },
        profile: {
          title: 'اطلاعات پروفایل',
          emailLabel: 'ایمیل',
          nameLabel: 'نام کامل',
          namePlaceholder: 'نام خود را وارد کنید',
          telegramLabel: 'شناسه تلگرام (برای دریافت اعلان)',
          telegramPlaceholder: '@username یا Chat ID',
          saveButton: 'ذخیره تغییرات',
          savedButton: 'ذخیره شد',
        },
        subscription: {
          currentPlanTitle: 'پلن فعلی',
          currentPlanButton: 'پلن فعلی',
          upgradeButton: 'ارتقا',
          selectButton: 'انتخاب',
          freeExpiry: 'بدون محدودیت زمانی',
          paidExpiry: 'تا ۳۰ روز دیگر فعال',
          popularBadge: 'محبوب‌ترین',
        },
        notifications: {
          title: 'تنظیمات اعلان‌ها',
          channelsTitle: 'کانال‌های دریافت',
          typesTitle: 'نوع هشدارها',
          saveButton: 'ذخیره تنظیمات',
          channels: [
            { id: 'web', icon: 'Globe', label: 'اعلان وب (Push Notification)' },
            { id: 'telegram', icon: 'MessageCircle', label: 'تلگرام' },
            { id: 'email', icon: 'Mail', label: 'ایمیل' },
          ],
          alertTypes: [
            { id: 'news_alerts', label: 'اخبار با تأثیر بالا' },
            { id: 'price_alerts', label: 'هشدارهای قیمتی' },
            { id: 'calendar_alerts', label: 'رویدادهای تقویم اقتصادی' },
          ],
        },
      };
    },
    getPlans: async () => {
      return [
        {
          id: 'free',
          name: 'رایگان',
          price: 0,
          features: ['۳ هشدار فعال', 'اخبار روزانه', 'تقویم اقتصادی پایه', 'نمودارهای پایه'],
        },
        {
          id: 'premium',
          name: 'پریمیوم',
          price: 99000,
          features: ['هشدار نامحدود', 'تحلیل AI پیشرفته', 'اعلان تلگرام و ایمیل', 'بک‌تست نامحدود', 'API دسترسی', 'پشتیبانی اختصاصی'],
          popular: true,
        },
        {
          id: 'pro',
          name: 'حرفه‌ای',
          price: 199000,
          features: ['همه امکانات پریمیوم', 'سیگنال‌های معاملاتی', 'وبینار اختصاصی', 'مشاوره شخصی', 'دسترسی زودهنگام'],
        },
      ];
    },
  },

  // ========== LAYOUT ==========
  layout: {
    getNavItems: async () => {
      return [
        { name: 'Dashboard', label: 'داشبورد', icon: 'LayoutGrid' },
        { name: 'News', label: 'اخبار', icon: 'Newspaper' },
        { name: 'Calendar', label: 'تقویم', icon: 'Calendar' },
        { name: 'Charts', label: 'نمودارها', icon: 'LineChart' },
        { name: 'Signals', label: 'سیگنال‌ها', icon: 'Zap' },
        { name: 'PaperTrading', label: 'معاملات مجازی', icon: 'Wallet' },
        { name: 'Backtest', label: 'بک‌تست', icon: 'FlaskConical' },
        { name: 'Alerts', label: 'هشدارها', icon: 'Bell' },
      ];
    },
    getAppInfo: async () => {
      return {
        name: 'FX Brain',
        loginButton: 'ورود',
        logoutButton: 'خروج',
      };
    },
  },

  // ========== MARKET TICKER ==========
  marketTicker: {
    getData: async () => {
      return [
        { pair: 'EUR/USD', price: 1.0852, change: 0.15 },
        { pair: 'GBP/USD', price: 1.2648, change: -0.22 },
        { pair: 'USD/JPY', price: 149.85, change: 0.08 },
        { pair: 'XAU/USD', price: 2045.50, change: 0.45 },
        { pair: 'USD/CHF', price: 0.8725, change: -0.12 },
        { pair: 'AUD/USD', price: 0.6542, change: 0.18 },
        { pair: 'BTC/USD', price: 43250, change: 1.25 },
      ];
    },
  },
};