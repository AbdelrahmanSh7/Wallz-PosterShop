# 🔥 دليل إعداد Firebase للمشروع

## 📋 خطوات الإعداد

### **الخطوة 1: إنشاء مشروع Firebase**

1. اذهب إلى [Firebase Console](https://console.firebase.google.com/)
2. اضغط "Create a project" أو "إضافة مشروع"
3. أدخل اسم المشروع: `wallsy-orders`
4. اضغط "Continue"
5. اختار "Enable Google Analytics" (اختياري)
6. اضغط "Create project"

### **الخطوة 2: إضافة تطبيق ويب**

1. في لوحة التحكم، اضغط على أيقونة الويب `</>`
2. أدخل اسم التطبيق: `wallsy-website`
3. اضغط "Register app"
4. **انسخ كود التكوين** الذي يظهر

### **الخطوة 3: تحديث ملف التكوين**

1. افتح `src/config/firebaseConfig.js`
2. استبدل القيم التالية بالقيم من Firebase:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-actual-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-actual-sender-id",
  appId: "your-actual-app-id"
};
```

### **الخطوة 4: إعداد Firestore Database**

1. في Firebase Console، اضغط "Firestore Database"
2. اضغط "Create database"
3. اختر "Start in test mode" (للاختبار)
4. اختر موقع قاعدة البيانات (الأقرب لمصر)
5. اضغط "Done"

### **الخطوة 5: إعداد قواعد الأمان**

1. في Firestore Database، اضغط "Rules"
2. استبدل القواعد الحالية بـ:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access to orders collection
    match /orders/{document} {
      allow read, write: if true;
    }
  }
}
```

3. اضغط "Publish"

### **الخطوة 6: اختبار الإعداد**

1. شغل المشروع: `npm start`
2. افتح وحدة التحكم (F12)
3. ابحث عن رسائل:
   - ✅ "Firebase initialized successfully"
   - ✅ "Orders loaded from Firebase"

## 🔧 إعداد متغيرات البيئة (اختياري)

### **للإنتاج على Vercel:**

1. في Vercel Dashboard، اذهب إلى Settings → Environment Variables
2. أضف المتغيرات التالية:

```
FIREBASE_API_KEY=your-api-key
FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your-sender-id
FIREBASE_APP_ID=your-app-id
```

3. حدث ملف `firebaseConfig.js`:

```javascript
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};
```

## 🧪 اختبار النظام

### **1. اختبار إضافة طلب:**
1. اذهب لأي منتج
2. اضغط "Add to Cart"
3. املأ البيانات واختر المحافظة
4. اضغط "Submit Order"
5. تحقق من وحدة التحكم:
   - ✅ "Order saved to Firebase successfully"

### **2. اختبار صفحة الإدارة:**
1. سجل الدخول كمدير
2. يجب أن تظهر الطلبات من Firebase
3. جرب تغيير حالة الطلب
4. جرب حذف طلب

### **3. اختبار التزامن:**
1. افتح الموقع على جهازين مختلفين
2. ضع طلب من الجهاز الأول
3. يجب أن يظهر فوراً على الجهاز الثاني

## 🔍 استكشاف الأخطاء

### **المشكلة: "Firebase not initialized"**
**الحل:**
1. تحقق من صحة المفاتيح في `firebaseConfig.js`
2. تأكد من أن المشروع موجود في Firebase Console
3. تحقق من اتصال الإنترنت

### **المشكلة: "Permission denied"**
**الحل:**
1. تحقق من قواعد Firestore
2. تأكد من أن القواعد تسمح بالقراءة والكتابة
3. جرب إعادة نشر القواعد

### **المشكلة: "Orders not syncing"**
**الحل:**
1. تحقق من وحدة التحكم للأخطاء
2. تأكد من أن Firebase يعمل
3. جرب زر التحديث اليدوي

## 📊 مراقبة النظام

### **في Firebase Console:**
1. اذهب إلى Firestore Database
2. اضغط على "orders" collection
3. يجب أن ترى الطلبات محفوظة
4. يمكنك مراقبة التحديثات في الوقت الفعلي

### **في وحدة التحكم:**
```javascript
// رسائل النجاح:
✅ "Order saved to Firebase successfully"
✅ "Orders loaded from Firebase: X orders"
✅ "Firebase orders updated: X orders"

// رسائل الخطأ:
❌ "Failed to save order to Firebase"
❌ "Failed to load orders from Firebase"
```

## 🚀 النتيجة النهائية

بعد الإعداد الصحيح:
- ✅ **الطلبات تُحفظ في Firebase** (يعمل على الإنترنت)
- ✅ **التزامن الفوري** بين جميع الأجهزة
- ✅ **الإشعارات تعمل** على جميع الأجهزة
- ✅ **النظام يعمل على Vercel** بدون مشاكل

## 📞 الدعم

إذا واجهت أي مشاكل:
1. تحقق من وحدة التحكم للأخطاء
2. تأكد من إعدادات Firebase
3. جرب إعادة تشغيل المشروع
4. تحقق من اتصال الإنترنت

النظام جاهز للعمل على الإنترنت! 🚀✨
