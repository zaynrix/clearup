# دليل نشر Functions مع Secrets

## المشكلة الحالية

الخطأ: `SMTP connection failed` أو `400 Bad Request`

السبب: الـ Secrets غير متاحة للـ Function بعد النشر.

## الحل

### الخطوة 1: تأكد من إعداد Secrets

```bash
# تحقق من وجود Secrets
firebase functions:secrets:access SMTP_USER
firebase functions:secrets:access SMTP_PASSWORD
```

إذا لم تكن موجودة، أعد إعدادها:

```bash
firebase functions:secrets:set SMTP_USER
# اكتب: meetings@clearupagency.com

firebase functions:secrets:set SMTP_PASSWORD
# اكتب: كلمة السر
```

### الخطوة 2: أعد بناء Functions

```bash
cd functions
npm run build
cd ..
```

### الخطوة 3: انشر Functions مع منح الصلاحيات

```bash
firebase deploy --only functions
```

**مهم:** عندما يسألك Firebase عن منح الصلاحيات للـ Secrets، اضغط `y` لكل secret:

```
? Grant access to secret SMTP_USER to function sendBookingConfirmationEmail? (y/N)
```

اضغط `y` ثم:

```
? Grant access to secret SMTP_PASSWORD to function sendBookingConfirmationEmail? (y/N)
```

اضغط `y` مرة أخرى.

### الخطوة 4: تحقق من النشر

```bash
# تحقق من الـ Functions المنشورة
firebase functions:list

# تحقق من الـ Logs
firebase functions:log --only sendBookingConfirmationEmail
```

## استكشاف الأخطاء

### خطأ: "Secret not found"

```bash
# أعد إعداد الـ Secret
firebase functions:secrets:set SMTP_USER
firebase functions:secrets:set SMTP_PASSWORD

# أعد النشر
firebase deploy --only functions
```

### خطأ: "Permission denied"

عند النشر، تأكد من الضغط `y` عندما يسألك عن منح الصلاحيات.

### خطأ: "SMTP connection failed"

1. تحقق من كلمة السر:
   ```bash
   firebase functions:secrets:access SMTP_PASSWORD
   ```

2. تحقق من إعدادات Hostinger:
   - SMTP Host: `smtp.hostinger.com`
   - Port: `465`
   - SSL: `true`

3. تحقق من الـ Logs:
   ```bash
   firebase functions:log --only sendBookingConfirmationEmail
   ```

## ملاحظات

- بعد إضافة أو تحديث Secrets، يجب إعادة نشر Functions
- Secrets متاحة فقط للـ Functions التي تم منحها الصلاحيات
- تأكد من منح الصلاحيات عند النشر الأول

