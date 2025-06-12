#!/bin/bash

# إعداد الربط مع GitHub
echo "جاري إعداد الربط مع GitHub..."

# التأكد من تثبيت Git
if ! command -v git &> /dev/null; then
    echo "تثبيت Git..."
    sudo apt-get update
    sudo apt-get install -y git
fi

# تكوين معلومات Git الأساسية
git config --global user.name "اسم المستخدم الخاص بك"
git config --global user.email "بريدك الإلكتروني"

# إنشاء مستودع محلي إذا لم يكن موجود<|im_start|>
if [ ! -d ".git" ]; then
    git init
    echo "تم إنشاء مستودع Git محلي"
fi

# إضافة الملفات للمستودع
git add .

# عمل commit أولي
git commit -m "الإصدار الأولي"

# إضافة المستودع البعيد (استبدل URL_REPOSITORY بعنوان مستودعك على GitHub)
git remote add origin URL_REPOSITORY

# رفع المشروع إلى GitHub
git push -u origin master

echo "تم إعداد الربط التلقائي مع GitHub بنجاح!"