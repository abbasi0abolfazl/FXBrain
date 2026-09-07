# راهنمای پابلیش پروژه FX Brain روی Cloudflare Pages (رایگان و سریع)

پروژه به شکلی بهینه‌سازی شده است که به صورت **۱۰۰٪ مستقل (Standalone)** با داده‌های نمونه و API توکار در مرورگر کار می‌کند.

### مزایا:
1. بدون نیاز به سرور پایتون یا هاست مجزا
2. بدون نیاز به ویزاکارت یا هزینه
3. پابلیش مستقیم و آسان بر روی برنچ اصلی `main`
4. سرعت فوق‌العاده روی شبکه CDN کلودفلر

---

## مراحل پابلیش روی Cloudflare Pages:

1. وارد پنل **[Cloudflare Dashboard](https://dash.cloudflare.com)** شوید.
2. از منوی سمت چپ به مسیر **Compute (Workers) > Workers & Pages** بروید.
3. روی دکمه **Create application** کلیک کرده و تب **Pages** را انتخاب کنید.
4. روی **Connect to Git** بزنید و ریپازیتوری `abbasi0abolfazl/FXBrain` را انتخاب کنید.
5. تنظیمات بیلد را به شکل زیر قرار دهید:
   * **Project name**: یک نام دلخواه (مانند `fxbrain`)
   * **Production branch**: همان پیش‌فرض `main`
   * **Framework preset**: گزینه `Vite`
   * **Build command**: `npm run build`
   * **Build output directory**: `dist`
   * *(تیک Automatic deployments for non-production branches هم اختیاری است و تاثیری در برنچ اصلی ندارد)*
6. روی دکمه **Save and Deploy** کلیک کنید.

سایت شما در کمتر از ۳۰ ثانیه در یک آدرس اختصاصی (مانند `https://fxbrain.pages.dev`) لایو و آماده استفاده خواهد بود.
