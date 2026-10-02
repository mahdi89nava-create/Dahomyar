# دهم‌یار ۸.۰ — نسخه نهایی آماده استقرار

## اجرای محلی

1. Node.js 18+ نصب باشد.
2. `npm install`
3. متغیرهای محیطی `ADMIN_USER` و `ADMIN_PASSWORD` را تنظیم کن.
4. `npm start`

## استقرار روی Render

این پروژه برای Web Service ساخته شده است. `render.yaml` تنظیمات سرویس، دیسک دائمی و Secrets را مشخص می‌کند.

Build: `npm install`
Start: `npm start`
Health: `/api/update`

برای تکالیف، خبرها، تنظیمات و فایل‌های آپلودی، `DATA_DIR` روی `/var/data` قرار گرفته و دیسک دائمی به آن متصل می‌شود.

رمز مدیر را در Environment Variables/Secrets وارد کن و داخل کد یا GitHub قرار نده.

## پنل

`/admin`

## آپدیت

آپدیت‌های رابط کاربری در `data/current` نگهداری می‌شوند تا با restart/redeploy از بین نروند.

## نکته

PWA و Service Worker فقط روی HTTPS یا localhost فعال می‌شوند.
