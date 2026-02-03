# دليل إعداد البريد الإلكتروني - Email Setup Guide

## الإعدادات من Hostinger

```
SMTP Host: smtp.hostinger.com
SMTP Port: 465
SSL: نعم (true)
Username: meetings@clearupagency.com
Password: [كلمة السر الخاصة بالإيميل]
```

## الخطوات

### 1. إعداد Secrets في Firebase

```bash
# إعداد اسم المستخدم (الإيميل)
firebase functions:secrets:set SMTP_USER
# عندما يطلب منك، اكتب: meetings@clearupagency.com

# إعداد كلمة السر
firebase functions:secrets:set SMTP_PASSWORD
# عندما يطلب منك، اكتب: كلمة السر الخاصة بإيميل Hostinger
```

### 2. منح الصلاحيات للـ Secrets

عندما تقوم بنشر الـ Functions لأول مرة، Firebase سيسألك عن منح الصلاحيات للـ Secrets:

```bash
firebase deploy --only functions
```

ستظهر رسالة مثل:
```
? Grant access to secret SMTP_USER to function sendBookingConfirmationEmail? (y/N)
```

اضغط `y` لكل secret.

### 3. البناء والنشر

```bash
cd functions
npm run build
cd ..
firebase deploy --only functions
```

## اختبار الإيميل

بعد النشر، يمكنك اختبار الإيميل من خلال:

1. إنشاء حجز جديد كضيف
2. التحقق من وصول إيميل التأكيد
3. التحقق من أن الإيميل يأتي من `meetings@clearupagency.com`
4. التحقق من أن الرد يذهب إلى `info@clearupagency.com`

## استكشاف الأخطاء

### خطأ: "Secret not found"

```bash
# تحقق من أن الـ Secrets موجودة
firebase functions:secrets:access SMTP_USER
firebase functions:secrets:access SMTP_PASSWORD
```

### خطأ: "SMTP connection failed"

1. تحقق من كلمة السر
2. تأكد من أن الإيميل مفعل في Hostinger
3. تحقق من أن SMTP مفعل في Hostinger

### خطأ: "Permission denied"

```bash
# أعد منح الصلاحيات
firebase deploy --only functions
# اضغط y عندما يسألك عن الصلاحيات
```

## ملاحظات مهمة

- ✅ الإيميل يرسل من: **meetings@clearupagency.com**
- ✅ الرد يذهب إلى: **info@clearupagency.com**
- ✅ الإيميل ثنائي اللغة (عربي/إنجليزي)
- ✅ يتضمن رابط Google Meet
- ✅ تصميم احترافي مع ألوان ClearUP

## تحديث Secrets

إذا احتجت تحديث كلمة السر:

```bash
firebase functions:secrets:set SMTP_PASSWORD
# اكتب الكلمة السرية الجديدة
firebase deploy --only functions
```

