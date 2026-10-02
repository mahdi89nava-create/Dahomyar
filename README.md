# دهم‌یار ۷.۰ — PWA / Offline First

## اجرا
این پروژه را روی HTTPS یا localhost اجرا کنید. باز کردن مستقیم `index.html` با `file://` برای Service Worker مناسب نیست.

## نصب Android
Chrome/Edge را باز کنید → منوی مرورگر → Install app / Add to Home screen.

## نصب Windows
Chrome یا Edge → آیکون Install در نوار آدرس یا منوی مرورگر → Install.

## قابلیت‌ها
- Offline-first و کش فایل‌های اصلی
- تشخیص آنلاین/آفلاین
- صف IndexedDB برای داده‌های قابل‌صف و هوک همگام‌سازی
- پنل کنترل وضعیت اتصال، کش، صف و آپدیت
- manifest + service worker
- آیکون 192/512 و splash screen داخلی
- آپدیت Service Worker و بررسی نسخه
- حفظ رابط و ابزارهای موجود دهم‌یار ۶.۰

## نکته فنی
Google Login، دیتابیس ابری، Mahdi AI و آمار آنلاین هنوز به backend واقعی نیاز دارند. این نسخه زیرساخت PWA و offline queue را آماده می‌کند و برای درخواست‌های واقعی باید endpoint امن سرور به `DehomYarOffline.queue()` متصل شود.
