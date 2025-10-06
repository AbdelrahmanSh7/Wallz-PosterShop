# إعداد نظام الإيميلات - EmailJS

## الخطوة 1: إنشاء حساب EmailJS

1. اذهب إلى [https://www.emailjs.com/](https://www.emailjs.com/)
2. أنشئ حساب مجاني
3. سجل دخول إلى لوحة التحكم

## الخطوة 2: إعداد خدمة الإيميل

1. في لوحة التحكم، اذهب إلى **"Email Services"**
2. اضغط **"Add New Service"**
3. اختر **Gmail** (أو أي خدمة إيميل أخرى)
4. اتبع التعليمات لإعداد Gmail
5. احفظ **Service ID** (مثل: `service_xxxxxxx`)

## الخطوة 3: إنشاء قوالب الإيميل

### قالب "طلب جديد" (NEW_ORDER):

**Subject:** 🛒 New Order Received - Order #{{order_id}}

**Body:**
```
Dear Admin,

A new order has been received:

Order Details:
==============
Order ID: {{order_id}}
Customer Name: {{customer_name}}
Phone: {{customer_phone}}
Governorate: {{customer_governorate}}
Address: {{customer_address}}
Order Date: {{order_date}}
Status: {{order_status}}
Total Amount: {{order_total}} EGP
Subtotal: {{order_subtotal}} EGP
Shipping: {{order_shipping}} EGP

Items ({{items_count}}):
=======================
{{items_details}}

Please check your admin panel to process this order.

Best regards,
Wallz Poster Shop
{{site_url}}
```

### قالب "تحديث حالة الطلب" (STATUS_UPDATE):

**Subject:** 🔄 Order Status Updated - Order #{{order_id}}

**Body:**
```
Dear Admin,

Order status has been updated:

Order ID: {{order_id}}
Customer: {{customer_name}}
Status Changed From: {{old_status}}
Status Changed To: {{new_status}}
Date: {{order_date}}

Please check your admin panel for more details.

Best regards,
Wallz Poster Shop
{{site_url}}
```

### قالب "ملخص يومي" (DAILY_SUMMARY):

**Subject:** 📊 Daily Orders Summary - {{date}}

**Body:**
```
Dear Admin,

Daily Orders Summary for {{date}}:

Total Orders: {{total_orders}}
Total Revenue: {{total_revenue}} EGP
Pending Orders: {{pending_orders}}
Confirmed Orders: {{confirmed_orders}}

Please check your admin panel for more details.

Best regards,
Wallz Poster Shop
{{site_url}}
```

## الخطوة 4: الحصول على المفاتيح

1. اذهب إلى **"Account"** في لوحة التحكم
2. انسخ **Public Key** (مثل: `xxxxxxxxxxxxxxxx`)
3. احفظ **Template IDs** لكل قالب

## الخطوة 5: تحديث الإعدادات

افتح ملف `src/config/emailConfig.js` وحدث القيم:

```javascript
export const EMAILJS_CONFIG = {
  SERVICE_ID: 'service_xxxxxxx', // ضع Service ID هنا
  PUBLIC_KEY: 'xxxxxxxxxxxxxxxx', // ضع Public Key هنا
  TEMPLATES: {
    NEW_ORDER: 'template_xxxxxxx', // ضع Template ID للطلب الجديد
    STATUS_UPDATE: 'template_xxxxxxx', // ضع Template ID لتحديث الحالة
    DAILY_SUMMARY: 'template_xxxxxxx' // ضع Template ID للملخص اليومي
  },
  ADMIN_EMAIL: 'wallz.egy@gmail.com'
};
```

## الخطوة 6: اختبار النظام

1. افتح Developer Tools (F12)
2. اذهب إلى Console
3. جرب عمل طلب جديد
4. ستظهر رسائل مفصلة في Console
5. إذا كان EmailJS مُعد بشكل صحيح، ستصل الإيميلات

## ملاحظات مهمة:

- **النسخة المجانية**: تسمح بـ 200 إيميل شهرياً
- **التحديث التلقائي**: النظام يعمل حالياً مع Console fallback
- **التشخيص**: جميع العمليات مسجلة في Console
- **النسخ الاحتياطي**: localStorage يحفظ الطلبات كنسخة احتياطية

## استكشاف الأخطاء:

إذا لم تصل الإيميلات:
1. تحقق من Console للأخطاء
2. تأكد من صحة Service ID و Public Key
3. تحقق من إعدادات Gmail
4. تأكد من أن Template IDs صحيحة

## الدعم:

إذا واجهت مشاكل، تحقق من:
- [EmailJS Documentation](https://www.emailjs.com/docs/)
- [Gmail Setup Guide](https://www.emailjs.com/docs/setup/gmail/)
- Console logs للتشخيص
