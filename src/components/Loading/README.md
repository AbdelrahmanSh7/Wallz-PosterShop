# 🔄 Loading System

نظام تحميل بسيط وجميل للموقع مع دعم كامل للعمليات المختلفة.

## 🚀 المكونات المتاحة

### 1. مكون Loading الأساسي
```jsx
import Loading from './components/Loading/Loading';

// استخدام بسيط
<Loading />

// مع خيارات مخصصة
<Loading 
  size="large"           // small, medium, large
  color="primary"        // primary, secondary, success, warning, danger, dark, light
  text="Loading..."     // نص التحميل
  showText={true}        // إظهار النص
  overlay={false}        // وضع overlay
/>
```

### 2. LoadingProvider (إدارة التحميل على مستوى التطبيق)
```jsx
import { LoadingProvider } from './components/Loading/LoadingProvider';

// في App.js
<LoadingProvider>
  <App />
</LoadingProvider>
```

### 3. Hooks للتحميل
```jsx
import { useLoading, useMultipleLoading, useAsyncLoading } from './hooks/useLoading';

// Hook بسيط
const { isLoading, startLoading, stopLoading } = useLoading();

// Hook متعدد الحالات
const { startComponentLoading, stopComponentLoading, isComponentLoading } = useLoadingContext();

// Hook للعمليات غير المتزامنة
const { isLoading, error, executeAsync } = useAsyncLoading();
```

## 🎯 الاستخدامات المطبقة

### 1. في صفحة السلة (Cart)
- تحميل عند إرسال الطلب
- منع النقر المتعدد على زر الإرسال

### 2. في صفحة المنتج (Product)
- تحميل عند إضافة المنتج للسلة
- تحسين تجربة المستخدم

### 3. في صفحة الإدارة (AdminOrders)
- تحميل عند جلب الطلبات من Firebase
- overlay للتحميل الشامل

### 4. في الصفحة الرئيسية (Home)
- تحميل المنتجات المميزة
- تحسين الأداء

## 🎨 الألوان والأحجام المتاحة

### الأحجام:
- `small`: 30px
- `medium`: 50px (افتراضي)
- `large`: 80px

### الألوان:
- `primary`: أزرق (#007bff)
- `secondary`: رمادي (#6c757d)
- `success`: أخضر (#28a745)
- `warning`: أصفر (#ffc107)
- `danger`: أحمر (#dc3545)
- `dark`: داكن (#343a40)
- `light`: فاتح (#f8f9fa)

## 🔧 الميزات

- ✅ **تحميل بسيط وجميل** مع رسوم متحركة سلسة
- ✅ **دعم Overlay** للتحميل الشامل
- ✅ **ألوان متعددة** لتناسب التصميم
- ✅ **أحجام مختلفة** للاستخدامات المختلفة
- ✅ **دعم الوضع المظلم** تلقائياً
- ✅ **إمكانية الوصول** مع دعم `prefers-reduced-motion`
- ✅ **استجابة** لجميع أحجام الشاشات
- ✅ **إدارة الحالة** على مستوى التطبيق
- ✅ **Hooks مخصصة** للاستخدام السهل

## 📱 الاستجابة

النظام يدعم جميع أحجام الشاشات:
- **Desktop**: تحميل كامل مع نص
- **Tablet**: تحميل متوسط
- **Mobile**: تحميل صغير مع نص مختصر

## ♿ إمكانية الوصول

- دعم `prefers-reduced-motion` لإيقاف الرسوم المتحركة
- ألوان متباينة للرؤية الواضحة
- نصوص واضحة ومفهومة

## 🚀 الأداء

- رسوم متحركة محسنة للأداء
- تحميل سريع بدون تأخير
- ذاكرة محسنة للاستخدام الطويل

النظام جاهز للاستخدام! 🎉
