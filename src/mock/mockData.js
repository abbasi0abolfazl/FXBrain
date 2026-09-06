// Embedded sample data for Standalone Cloudflare Pages deployment
const now = new Date();

export const initialUsers = [
  {
    id: 1,
    email: "demo@fxbrain.com",
    name: "کاربر دمو (FX Brain)",
    role: "pro",
    is_active: true,
    created_at: now.toISOString(),
  },
  {
    id: 2,
    email: "admin@fxbrain.com",
    name: "مدیر سیستم",
    role: "admin",
    is_active: true,
    created_at: now.toISOString(),
  }
];

export const initialNews = [
  {
    id: 1,
    title: "بانک مرکزی اروپا نرخ بهره را در ۴٪ ثابت نگه داشت",
    summary: "بانک مرکزی اروپا در آخرین جلسه خود نرخ بهره را بدون تغییر در ۴٪ نگه داشت. این تصمیم مطابق انتظارات بازار بود.",
    source: "بلومبرگ",
    published_at: new Date(now.getTime() - 3600000 * 2).toISOString(),
    category: "اقتصادی",
    impact_level: "high",
    sentiment: "neutral",
    prediction: "bullish EUR",
    affected_currencies: ["EUR/USD", "EUR/GBP", "EUR/JPY"]
  },
  {
    id: 2,
    title: "ادامه رشد شاخص S&P 500 به بالاترین سطح سه ماهه",
    summary: "شاخص S&P 500 برای سومین روز متوالی رشد کرده و به بالاترین سطح سه ماهه رسید. این رشد نشان‌دهنده بهبود ریسک‌پذیری بازار است.",
    source: "رویترز",
    published_at: new Date(now.getTime() - 3600000 * 3).toISOString(),
    category: "بازارهای مالی",
    impact_level: "medium",
    sentiment: "positive",
    prediction: "bearish JPY",
    affected_currencies: ["USD/JPY", "AUD/JPY", "EUR/JPY"]
  },
  {
    id: 3,
    title: "افزایش ۲٪ بهای نفت به دلیل تنش‌های خاورمیانه",
    summary: "بهای نفت خام برنت با افزایش ۲ درصدی به ۸۵ دلار در هر بشکه رسید. این افزایش ناشی از نگرانی‌ها درباره اختلال در عرضه نفت است.",
    source: "CNBC",
    published_at: new Date(now.getTime() - 3600000 * 5).toISOString(),
    category: "کالاها",
    impact_level: "high",
    sentiment: "negative",
    prediction: "bullish CAD",
    affected_currencies: ["USD/CAD", "CAD/JPY", "EUR/CAD"]
  },
  {
    id: 4,
    title: "تورم انگلیس کمتر از پیش‌بینی به ۳.۹٪ کاهش یافت",
    summary: "نرخ تورم انگلیس در ماه گذشته به ۳.۹٪ کاهش یافت که کمتر از پیش‌بینی ۴.۲٪ بود و نشانه‌ای از کاهش فشارهای قیمتی است.",
    source: "فایننشال تایمز",
    published_at: new Date(now.getTime() - 3600000 * 7).toISOString(),
    category: "اقتصادی",
    impact_level: "high",
    sentiment: "positive",
    prediction: "bullish GBP",
    affected_currencies: ["GBP/USD", "EUR/GBP", "GBP/JPY"]
  },
  {
    id: 5,
    title: "تاکید بانک مرکزی ژاپن بر ادامه سیاست پولی انبساطی",
    summary: "بانک ژاپن بر ادامه سیاست پولی انبساطی خود تأکید کرد و احتمال تغییر در نرخ بهره منفی را در کوتاه‌مدت رد کرد.",
    source: "Nikkei",
    published_at: new Date(now.getTime() - 3600000 * 9).toISOString(),
    category: "اقتصادی",
    impact_level: "medium",
    sentiment: "negative",
    prediction: "bearish JPY",
    affected_currencies: ["USD/JPY", "EUR/JPY", "GBP/JPY"]
  },
  {
    id: 6,
    title: "تولید صنعتی آلمان فراتر از انتظار رشد کرد",
    summary: "تولید صنعتی آلمان در دسامبر ۰.۸٪ رشد کرد که بهتر از پیش‌بینی ۰.۳٪ بود و نشانه‌ای از پایداری بزرگترین اقتصاد اروپا است.",
    source: "دویچه‌وله",
    published_at: new Date(now.getTime() - 3600000 * 12).toISOString(),
    category: "اقتصادی",
    impact_level: "medium",
    sentiment: "positive",
    prediction: "bullish EUR",
    affected_currencies: ["EUR/USD", "EUR/CHF"]
  },
  {
    id: 7,
    title: "فروش خرده‌فروشی آمریکا مطابق انتظار ۰.۶٪ رشد کرد",
    summary: "فروش خرده‌فروشی آمریکا در ماه گذشته ۰.۶٪ رشد کرد که کاملاً مطابق با انتظارات و نشان‌دهنده قدرت مصرف‌کنندگان بود.",
    source: "وال استریت ژورنال",
    published_at: new Date(now.getTime() - 3600000 * 15).toISOString(),
    category: "اقتصادی",
    impact_level: "low",
    sentiment: "neutral",
    prediction: "neutral USD",
    affected_currencies: ["USD/Index", "EUR/USD"]
  },
  {
    id: 8,
    title: "شکست رکورد قیمت طلا در پی تقاضای دارایی امن",
    summary: "انس جهانی طلا در معاملات امروز به بالاتر از ۲۰۵۰ دلار رسید و رکورد چند هفته‌ای خود را شکست.",
    source: "بلومبرگ",
    published_at: new Date(now.getTime() - 3600000 * 18).toISOString(),
    category: "کالاها",
    impact_level: "high",
    sentiment: "positive",
    prediction: "bullish XAU",
    affected_currencies: ["XAU/USD", "USD/CHF"]
  }
];

export const initialEvents = [
  {
    id: 1,
    event_time: new Date(now.getTime() + 3600000 * 2).toISOString(),
    country: "USD",
    event_name: "تصمیم نرخ بهره فدرال رزرو (FOMC)",
    importance: "high",
    forecast: "۵.۵۰٪",
    previous: "۵.۵۰٪",
    actual: null,
    forecast_value: "۵.۵۰٪",
    previous_value: "۵.۵۰٪",
    actual_value: null
  },
  {
    id: 2,
    event_time: new Date(now.getTime() + 3600000 * 4).toISOString(),
    country: "EUR",
    event_name: "شاخص هماهنگ قیمت مصرف‌کننده آلمان (HICP)",
    importance: "medium",
    forecast: "۲.۸٪",
    previous: "۲.۹٪",
    actual: null,
    forecast_value: "۲.۸٪",
    previous_value: "۲.۹٪",
    actual_value: null
  },
  {
    id: 3,
    event_time: new Date(now.getTime() + 3600000 * 24).toISOString(),
    country: "GBP",
    event_name: "تولید ناخالص داخلی (GDP) ماهانه",
    importance: "high",
    forecast: "۰.۳٪",
    previous: "۰.۲٪",
    actual: null,
    forecast_value: "۰.۳٪",
    previous_value: "۰.۲٪",
    actual_value: null
  },
  {
    id: 4,
    event_time: new Date(now.getTime() + 3600000 * 30).toISOString(),
    country: "JPY",
    event_name: "تراز تجاری کالاها و خدمات ژاپن",
    importance: "low",
    forecast: "۰.۵T ین",
    previous: "۰.۳T ین",
    actual: null,
    forecast_value: "۰.۵T ین",
    previous_value: "۰.۳T ین",
    actual_value: null
  },
  {
    id: 5,
    event_time: new Date(now.getTime() + 3600000 * 48).toISOString(),
    country: "USD",
    event_name: "شاخص اشتغال بخش غیرکشاورزی (NFP)",
    importance: "high",
    forecast: "۱۸۵K",
    previous: "۲۱۶K",
    actual: null,
    forecast_value: "۱۸۵K",
    previous_value: "۲۱۶K",
    actual_value: null
  }
];

export const initialSignals = [
  {
    id: 1,
    signal_type: "buy",
    pair: "EUR/USD",
    entry_price: 1.0875,
    stop_loss: 1.0825,
    take_profit: 1.0950,
    confidence: 85,
    status: "active",
    created_at: new Date(now.getTime() - 3600000).toISOString(),
    analysis: "تضعیف دلار آمریکا پس از داده‌های ضعیف شاخص اطمینان مصرف‌کننده",
    reasons: [
      "تایید الگوی کف دوقلو در تایم فریم ۱ ساعته",
      "شکست میانگین متحرک ۵۰ روزه به سمت بالا",
      "حمایت قوی خریداران در ۱.۰۸۵۰"
    ]
  },
  {
    id: 2,
    signal_type: "sell",
    pair: "GBP/USD",
    entry_price: 1.2650,
    stop_loss: 1.2710,
    take_profit: 1.2550,
    confidence: 78,
    status: "active",
    created_at: new Date(now.getTime() - 3600000 * 3).toISOString(),
    analysis: "فشار نزولی به دلیل واگرایی منفی در RSI و مقاومت کلیدی",
    reasons: [
      "داده‌های ضعیف بخش خدمات انگلستان",
      "واگرایی منفی در اسیلاتور RSI",
      "عدم توانایی تثبیت بالای ۱.۲۶۸۰"
    ]
  },
  {
    id: 3,
    signal_type: "buy",
    pair: "XAU/USD",
    entry_price: 2042.00,
    stop_loss: 2028.00,
    take_profit: 2065.00,
    confidence: 90,
    status: "active",
    created_at: new Date(now.getTime() - 3600000 * 5).toISOString(),
    analysis: "افزایش تقاضای طلا به عنوان دارایی امن و کاهش بازده اوراق قرضه آمریکا",
    reasons: [
      "شکست کانال نزولی ۴ ساعته",
      "حجم معاملات بالای خریداران نهادی",
      "افزایش تنش‌های ژئوپلیتیکی"
    ]
  },
  {
    id: 4,
    signal_type: "buy",
    pair: "USD/JPY",
    entry_price: 148.90,
    stop_loss: 148.40,
    take_profit: 149.80,
    confidence: 82,
    status: "hit_tp",
    created_at: new Date(now.getTime() - 86400000).toISOString(),
    analysis: "تداوم سیاست‌های نرخ بهره منفی بانک مرکزی ژاپن",
    reasons: [
      "تارگت سود اول با موفقیت تاچ شد (+۹۰ پیپ)",
      "روند صعودی قوی در تمام تایم‌فریم‌ها"
    ]
  },
  {
    id: 5,
    signal_type: "sell",
    pair: "AUD/USD",
    entry_price: 0.6590,
    stop_loss: 0.6630,
    take_profit: 0.6520,
    confidence: 72,
    status: "hit_tp",
    created_at: new Date(now.getTime() - 86400000 * 2).toISOString(),
    analysis: "کاهش تقاضای مواد خام در بازارهای آسیایی",
    reasons: [
      "تارگت اول و دوم به دقت لمس شدند (+۷۰ پیپ)",
      "تایید کندل پوشای نزولی"
    ]
  }
];

export const initialAlerts = [
  {
    id: 1,
    name: "شکست مقاومت یورو",
    currency_pair: "EUR/USD",
    condition_type: "price_above",
    condition_value: 1.0950,
    notification_channels: ["web", "telegram"],
    is_active: true,
    triggered_at: null,
    created_at: now.toISOString(),
    user_id: 1
  },
  {
    id: 2,
    name: "حمایت طلا در انس ۲۰۰۰",
    currency_pair: "XAU/USD",
    condition_type: "price_below",
    condition_value: 2020.0,
    notification_channels: ["web", "email"],
    is_active: true,
    triggered_at: null,
    created_at: now.toISOString(),
    user_id: 1
  },
  {
    id: 3,
    name: "اشباع خرید RSI پوند",
    currency_pair: "GBP/USD",
    condition_type: "rsi_above",
    condition_value: 70.0,
    notification_channels: ["web"],
    is_active: false,
    triggered_at: null,
    created_at: new Date(now.getTime() - 86400000 * 2).toISOString(),
    user_id: 1
  }
];

export const initialWidgets = [
  {
    id: "signals",
    type: "signals",
    title: "سیگنال‌های لحظه‌ای",
    icon: "Zap",
    default_order: 0,
    min_height: 350,
    config: { max_signals: 3, show_confidence: true }
  },
  {
    id: "news",
    type: "news",
    title: "اخبار مهم فارکس",
    icon: "Newspaper",
    default_order: 1,
    min_height: 300,
    config: { max_news: 5, show_impact: true }
  },
  {
    id: "calendar",
    type: "calendar",
    title: "رویدادهای اقتصادی",
    icon: "Calendar",
    default_order: 2,
    min_height: 300,
    config: { max_events: 4, show_high_impact_only: false }
  },
  {
    id: "alerts",
    type: "alerts",
    title: "هشدارهای فعال",
    icon: "Bell",
    default_order: 3,
    min_height: 280,
    config: { max_alerts: 3, show_triggered: false }
  },
  {
    id: "chart_eurusd",
    type: "chart",
    title: "نمودار EUR/USD",
    icon: "LineChart",
    default_order: 4,
    min_height: 350,
    config: { pair: "EUR/USD", interval: "1h" }
  },
  {
    id: "chart_gbpusd",
    type: "chart",
    title: "نمودار GBP/USD",
    icon: "LineChart",
    default_order: 5,
    min_height: 350,
    config: { pair: "GBP/USD", interval: "1h" }
  }
];

export function generateSampleChart(pair) {
  const basePriceMap = {
    'EUR/USD': 1.0850,
    'GBP/USD': 1.2640,
    'USD/JPY': 149.20,
    'XAU/USD': 2040.00,
    'BTC/USD': 43500.00,
  };
  const base = basePriceMap[pair] || 1.0;
  const points = [];
  let current = base;

  for (let i = 24; i >= 0; i--) {
    const time = new Date(Date.now() - i * 3600000);
    const fluctuation = (Math.random() - 0.48) * (base * 0.003);
    current += fluctuation;
    points.push({
      time: time.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
      price: parseFloat(current.toFixed(pair.includes('JPY') || pair.includes('XAU') ? 2 : 4)),
    });
  }
  return points;
}
