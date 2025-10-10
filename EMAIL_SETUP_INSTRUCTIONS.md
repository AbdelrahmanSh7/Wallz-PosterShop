# إعداد الإيميل لـ WallZ - تعليمات مفصلة

## المشكلة الحالية
```
412 Gmail_API: Request had insufficient authentication scopes
```

هذا الخطأ يحدث لأن Gmail يحتاج صلاحيات إضافية لإرسال الإيميلات.

## الحلول المتاحة

### الحل الأول: إعداد Gmail App Password (الأسهل)

1. **اذهب إلى Google Account Settings:**
   - https://myaccount.google.com/
   - أو https://accounts.google.com/

2. **تفعيل 2-Step Verification:**
   - Security → 2-Step Verification
   - فعّل التحقق بخطوتين

3. **إنشاء App Password:**
   - Security → App passwords
   - اختر "Mail" كتطبيق
   - اختر "Other" واكتب "WallZ Email Service"
   - انسخ كلمة المرور التي تظهر (16 حرف)

4. **تحديث إعدادات EmailJS:**
   - استخدم كلمة المرور الجديدة في EmailJS
   - تأكد من أن Service ID صحيح: `service_z7sjam`

### الحل الثاني: استخدام Outlook بدلاً من Gmail

1. **إنشاء حساب Outlook جديد:**
   - اذهب إلى https://outlook.live.com/
   - أنشئ حساب جديد أو استخدم موجود

2. **إعداد EmailJS مع Outlook:**
   - في EmailJS، اختر "Outlook" بدلاً من "Gmail"
   - أدخل بيانات حساب Outlook

### الحل الثالث: إعداد Gmail مع OAuth (متقدم)

1. **إنشاء Google Cloud Project:**
   - https://console.cloud.google.com/
   - أنشئ مشروع جديد

2. **تفعيل Gmail API:**
   - APIs & Services → Library
   - ابحث عن "Gmail API" وفعّله

3. **إنشاء OAuth 2.0 Credentials:**
   - APIs & Services → Credentials
   - Create Credentials → OAuth 2.0 Client ID
   - Web application

4. **إعداد Authorized Redirect URIs:**
   ```
   https://service.emailjs.com/admin/oauth/callback
   ```

## الخطوات العملية لإصلاح المشكلة الآن

### الخطوة 1: إنشاء App Password
```
1. اذهب إلى: https://myaccount.google.com/security
2. فعّل 2-Step Verification إذا لم تكن مفعلة
3. انتقل إلى: https://myaccount.google.com/apppasswords
4. اختر "Mail" و "Other (Custom name)"
5. اكتب "WallZ Email Service"
6. انسخ كلمة المرور المكونة من 16 حرف
```

### الخطوة 2: تحديث EmailJS
```
1. في EmailJS، اختر "Disconnect" ثم "Connect" مرة أخرى
2. استخدم كلمة المرور الجديدة (App Password)
3. تأكد من أن Service ID: service_z7sjam
4. جرب "Send test email"
```

### الخطوة 3: تحديث الكود (إذا لزم الأمر)
```javascript
// في src/config/emailConfig.js
export const emailConfig = {
  serviceId: 'service_z7sjam', // Service ID الصحيح
  publicKey: 'YOUR_PUBLIC_KEY', // Public Key من EmailJS
  templates: {
    newOrder: 'template_new_order',
    statusUpdate: 'template_status_update'
  },
  adminEmail: 'wallz.egy@gmail.com',
  settings: {
    autoSend: true,
    retryAttempts: 3,
    retryDelay: 2000
  }
};
```

## اختبار الإيميل

### بعد إصلاح المشكلة:
1. **اختبار مباشر:**
   - اذهب إلى الموقع
   - ضع طلب تجريبي
   - تحقق من وصول الإيميل

2. **اختبار EmailJS:**
   - في EmailJS، استخدم "Send test email"
   - تأكد من وصول الإيميل التجريبي

## ملاحظات مهمة

### حدود Gmail:
- **Free Account:** 500 إيميل يومياً
- **Google Workspace:** 2000 إيميل يومياً

### بدائل أخرى:
1. **SendGrid:** مجاني حتى 100 إيميل يومياً
2. **Mailgun:** مجاني حتى 5000 إيميل شهرياً
3. **Outlook:** مثل Gmail مع حدود مماثلة

## استكشاف الأخطاء

### إذا استمر الخطأ:
```
1. تأكد من تفعيل 2-Step Verification
2. تأكد من استخدام App Password وليس كلمة المرور العادية
3. تأكد من أن Service ID صحيح
4. جرب إعادة الاتصال في EmailJS
```

### إذا لم تصل الإيميلات:
```
1. تحقق من Spam/Junk folder
2. تأكد من عنوان الإيميل الصحيح
3. تحقق من إعدادات Firewall/Antivirus
4. جرب إيميل آخر للاختبار
```

## الكود المحدث للإيميل

```javascript
// إضافة في src/services/emailService.js
export const sendTestEmail = async () => {
  try {
    const templateParams = {
      to_email: 'wallz.egy@gmail.com',
      subject: 'Test Email from WallZ',
      message: 'This is a test email to verify email configuration.',
      from_name: 'WallZ System'
    };

    const response = await emailjs.send(
      emailConfig.serviceId,
      emailConfig.templates.newOrder,
      templateParams
    );

    console.log('✅ Test email sent successfully:', response);
    return { success: true, response };
  } catch (error) {
    console.error('❌ Test email failed:', error);
    return { success: false, error };
  }
};
```

## الخطوات التالية

1. **فوراً:** أنشئ App Password وحدث EmailJS
2. **اختبار:** جرب إرسال إيميل تجريبي
3. **مراقبة:** راقب وصول إيميلات الطلبات الجديدة
4. **تحسين:** إذا احتجت، فكر في استخدام خدمة إيميل احترافية

---

**ملاحظة:** إذا استمرت المشكلة، يمكنني مساعدتك في إعداد خدمة إيميل بديلة مثل SendGrid أو Mailgun.