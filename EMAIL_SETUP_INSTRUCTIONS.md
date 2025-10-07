# 📧 Email Setup Instructions - تعليمات إعداد الإيميل

## ✅ تم إعداد نظام الإيميل التلقائي!

### **🎯 الميزة الجديدة:**
- **إرسال إيميل تلقائي** عند وصول طلب جديد
- **رسالة حماسية باللغة الإنجليزية** لـ wallz.egy@gmail.com
- **إرسال إيميل** عند تحديث حالة الطلب

### **🔧 الملفات المضافة:**

#### **1. `src/services/emailService.js`:**
- خدمة الإيميل الرئيسية
- إرسال إيميلات الطلبات الجديدة
- إرسال إيميلات تحديث الحالة
- آلية إعادة المحاولة

#### **2. `src/config/emailConfig.js`:**
- إعدادات EmailJS
- قوالب الإيميل
- إعدادات الإدارة

#### **3. `src/templates/emailTemplates.js`:**
- قوالب HTML للإيميلات
- تصميم احترافي وجذاب
- رسائل حماسية باللغة الإنجليزية

### **📧 خطوات الإعداد:**

#### **1. إنشاء حساب EmailJS:**
1. اذهب إلى [https://www.emailjs.com/](https://www.emailjs.com/)
2. أنشئ حساب مجاني
3. اربط حساب Gmail الخاص بك

#### **2. إنشاء خدمة الإيميل:**
1. في لوحة تحكم EmailJS
2. اضغط على "Add New Service"
3. اختر "Gmail"
4. اربط حساب wallz.egy@gmail.com
5. احفظ Service ID

#### **3. إنشاء قوالب الإيميل:**

##### **قالب الطلب الجديد (template_new_order):**
```html
Subject: 🎉 NEW ORDER ALERT! - WallZ Store

🎉 NEW ORDER ALERT!

A new order has just been placed on your WallZ store!

Order Details:
- Order ID: {{order_id}}
- Date: {{order_date}}
- Customer: {{customer_name}}
- Phone: {{customer_phone1}}
- Address: {{customer_address}}, {{customer_governorate}}
- Total: {{total_amount}} EGP
- Items: {{items_count}} items

Items List:
{{items_list}}

Action Required: Process this order as soon as possible!

© 2024 WallZ - Your Wall Art Store
```

##### **قالب تحديث الحالة (template_status_update):**
```html
Subject: 📊 Order Status Updated - WallZ Store

📊 Order Status Updated!

Order Information:
- Order ID: {{order_id}}
- Customer: {{customer_name}}
- Date: {{order_date}}
- Total: {{total_amount}} EGP

Status Change:
- Previous: {{old_status}}
- New: {{new_status}}

© 2024 WallZ - Your Wall Art Store
```

#### **4. تحديث الإعدادات:**
في ملف `src/config/emailConfig.js`:
```javascript
export const emailConfig = {
  serviceId: 'YOUR_ACTUAL_SERVICE_ID', // استبدل بالـ Service ID الحقيقي
  publicKey: 'YOUR_ACTUAL_PUBLIC_KEY', // استبدل بالـ Public Key الحقيقي
  // باقي الإعدادات...
};
```

### **🧪 كيفية الاختبار:**

#### **1. اختبار إرسال الإيميل:**
1. افتح Developer Console (F12)
2. اكتب: `emailService.testEmail()`
3. اضغط Enter
4. **يجب أن تصل رسالة تجريبية على wallz.egy@gmail.com**

#### **2. اختبار طلب جديد:**
1. اذهب إلى صفحة السلة
2. أضف منتجات للسلة
3. املأ بيانات العميل
4. اضغط "Place Order"
5. **يجب أن تصل رسالة على wallz.egy@gmail.com**

#### **3. اختبار تحديث الحالة:**
1. اذهب إلى لوحة الإدارة
2. غيّر حالة طلب
3. **يجب أن تصل رسالة تحديث على wallz.egy@gmail.com**

### **🎯 الميزات:**

#### **1. رسائل حماسية:**
- **🎉 NEW ORDER ALERT!** للطلبات الجديدة
- **📊 Order Status Updated** لتحديث الحالة
- **رسائل باللغة الإنجليزية** بشكل احترافي

#### **2. معلومات شاملة:**
- **تفاصيل الطلب** كاملة
- **بيانات العميل** كاملة
- **قائمة المنتجات** مع الأسعار
- **المبلغ الإجمالي** والتفاصيل

#### **3. آلية موثوقة:**
- **إعادة المحاولة** عند الفشل (3 مرات)
- **تأخير ذكي** بين المحاولات
- **تسجيل مفصل** للأخطاء

### **📧 مثال على الرسالة:**

```
🎉 NEW ORDER ALERT!

A new order has just been placed on your WallZ store!

Order Details:
- Order ID: 1703123456789
- Date: December 21, 2024 at 2:30 PM
- Customer: Ahmed Mohamed
- Phone: 01234567890
- Address: 123 Main Street, Cairo
- Total: 250 EGP
- Items: 2 items

Items List:
- Wall Art Poster 1 (Qty: 1) - 150 EGP
- Wall Art Poster 2 (Qty: 1) - 100 EGP

Action Required: Process this order as soon as possible!

© 2024 WallZ - Your Wall Art Store
```

### **🔧 استكشاف الأخطاء:**

#### **إذا لم تصل الرسائل:**
1. تأكد من صحة Service ID و Public Key
2. تأكد من ربط Gmail بشكل صحيح
3. تحقق من Console للأخطاء
4. تأكد من تفعيل الإيميلات في Gmail

#### **إذا فشل الإرسال:**
1. تحقق من اتصال الإنترنت
2. تأكد من صحة قوالب الإيميل
3. تحقق من حدود EmailJS (100 إيميل/شهر مجاناً)

## 🎉 النظام جاهز للاستخدام!

**بعد إعداد EmailJS، ستحصل على إيميلات تلقائية حماسية عند كل طلب جديد!** 📧✨