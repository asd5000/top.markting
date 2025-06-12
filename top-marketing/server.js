const http = require('http')
const fs = require('fs')
const path = require('path')
const url = require('url')

const port = 3000

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true)
  let pathname = parsedUrl.pathname

  // إذا كان المسار "/" أو فارغ، اعرض index.html
  if (pathname === '/' || pathname === '') {
    pathname = '/index.html'
  }

  // إزالة الشرطة المائلة في البداية
  if (pathname.startsWith('/')) {
    pathname = pathname.substring(1)
  }

  const filePath = path.join(__dirname, pathname)

  // التحقق من وجود الملف
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      // الملف غير موجود
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' })
      res.end(`
        <!DOCTYPE html>
        <html lang="ar" dir="rtl">
        <head>
          <meta charset="UTF-8">
          <title>الصفحة غير موجودة</title>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
            h1 { color: #e74c3c; }
            a { color: #3498db; text-decoration: none; }
          </style>
        </head>
        <body>
          <h1>404 - الصفحة غير موجودة</h1>
          <p>الملف المطلوب غير موجود</p>
          <a href="/">العودة للصفحة الرئيسية</a>
        </body>
        </html>
      `)
      return
    }

    // قراءة الملف
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' })
        res.end('خطأ في الخادم')
        return
      }

      // تحديد نوع المحتوى
      let contentType = 'text/html; charset=utf-8'
      const ext = path.extname(filePath).toLowerCase()

      switch (ext) {
        case '.html':
          contentType = 'text/html; charset=utf-8'
          break
        case '.css':
          contentType = 'text/css'
          break
        case '.js':
          contentType = 'application/javascript'
          break
        case '.json':
          contentType = 'application/json'
          break
        case '.png':
          contentType = 'image/png'
          break
        case '.jpg':
        case '.jpeg':
          contentType = 'image/jpeg'
          break
        case '.gif':
          contentType = 'image/gif'
          break
        case '.svg':
          contentType = 'image/svg+xml'
          break
        case '.ico':
          contentType = 'image/x-icon'
          break
      }

      res.writeHead(200, { 'Content-Type': contentType })
      res.end(data)
    })
  })
})

server.listen(port, () => {
  console.log(`🚀 السيرفر يعمل على: http://localhost:${port}`)
  console.log(`📱 الصفحة الرئيسية: http://localhost:${port}/`)
  console.log(`🎯 صفحة الخدمات: http://localhost:${port}/services-demo.html`)
  console.log(`📋 لإيقاف السيرفر: اضغط Ctrl+C`)
})
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Top Marketing - الخدمات</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@200;300;400;500;600;700;800;900&display=swap');
        body { font-family: 'Cairo', sans-serif; }
        .service-option {
            transition: all 0.3s ease;
            cursor: pointer;
        }
        .service-option:hover {
            background-color: #dbeafe;
            border-color: #3b82f6;
        }
        .service-option.selected {
            background-color: #dbeafe;
            border-color: #3b82f6;
        }
        .radio-circle {
            width: 16px;
            height: 16px;
            border: 2px solid #d1d5db;
            border-radius: 50%;
            transition: all 0.3s ease;
        }
        .radio-circle.selected {
            border-color: #3b82f6;
            background-color: #3b82f6;
        }
    </style>
</head>
<body class="bg-gray-50">
    <div class="min-h-screen">
        <!-- Header -->
        <header class="bg-white shadow-sm">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center h-16">
                    <div class="flex items-center">
                        <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                            <span class="text-white font-bold">TM</span>
                        </div>
                        <span class="mr-3 text-xl font-bold text-gray-900">Top Marketing</span>
                    </div>
                    <nav class="hidden md:flex space-x-8">
                        <a href="#" class="text-gray-700 hover:text-blue-600">الرئيسية</a>
                        <a href="#" class="text-blue-600 font-medium">الخدمات</a>
                        <a href="#" class="text-gray-700 hover:text-blue-600">إدارة الصفحات</a>
                        <a href="#" class="text-gray-700 hover:text-blue-600">العقارات</a>
                    </nav>
                </div>
            </div>
        </header>

        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div class="text-center mb-12">
                <h1 class="text-4xl font-bold text-gray-900 mb-4">خدماتنا</h1>
                <p class="text-xl text-gray-600">اختر من مجموعة واسعة من الخدمات المتخصصة</p>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <!-- Services Sidebar -->
                <div class="lg:col-span-1">
                    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h3 class="text-lg font-bold text-gray-900 mb-4">الخدمات</h3>
                        <div class="space-y-2">
                            <button onclick="showService('design')" class="service-btn w-full text-right p-3 rounded-lg transition-colors bg-blue-50 text-blue-600 border border-blue-200">
                                <div class="flex items-center">
                                    <span class="w-5 h-5 ml-3">🎨</span>
                                    <span class="font-medium">تصميم</span>
                                </div>
                            </button>
                            <button onclick="showService('marketing')" class="service-btn w-full text-right p-3 rounded-lg transition-colors text-gray-700 hover:bg-gray-50">
                                <div class="flex items-center">
                                    <span class="w-5 h-5 ml-3">📢</span>
                                    <span class="font-medium">تسويق</span>
                                </div>
                            </button>
                            <button onclick="showService('video')" class="service-btn w-full text-right p-3 rounded-lg transition-colors text-gray-700 hover:bg-gray-50">
                                <div class="flex items-center">
                                    <span class="w-5 h-5 ml-3">🎬</span>
                                    <span class="font-medium">مونتاج</span>
                                </div>
                            </button>
                            <button onclick="showService('data')" class="service-btn w-full text-right p-3 rounded-lg transition-colors text-gray-700 hover:bg-gray-50">
                                <div class="flex items-center">
                                    <span class="w-5 h-5 ml-3">📊</span>
                                    <span class="font-medium">سحب داتا</span>
                                </div>
                            </button>
                            <button onclick="showService('web')" class="service-btn w-full text-right p-3 rounded-lg transition-colors text-gray-700 hover:bg-gray-50">
                                <div class="flex items-center">
                                    <span class="w-5 h-5 ml-3">🌐</span>
                                    <span class="font-medium">موقع ويب</span>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Services Content -->
                <div class="lg:col-span-3">
                    <div id="service-content">
                        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div class="mb-6">
                                <h3 class="text-xl font-bold text-gray-900 mb-2">
                                    أهلاً وسهلاً بيك! 😊😊
                                </h3>
                                <p class="text-gray-600">
                                    اختار واحد من الخيارات اللي تحت عشان أقدر أوجهك بشكل أفضل:
                                </p>
                            </div>

                            <div id="design-services" class="space-y-3">
                                <div class="service-option flex items-center justify-between p-4 border border-gray-200 rounded-lg" onclick="selectService(this, 'تصميم لوجو', 500)">
                                    <div class="flex items-center flex-1">
                                        <div class="radio-circle ml-3"></div>
                                        <div class="flex-1">
                                            <h4 class="font-medium text-gray-900">تصميم لوجو</h4>
                                            <p class="text-sm text-gray-600 mt-1">تصميم شعار احترافي للعلامة التجارية</p>
                                            <div class="flex items-center justify-between mt-2">
                                                <span class="text-lg font-bold text-blue-600">500 <span class="text-sm text-gray-600">ج.م</span></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="service-option flex items-center justify-between p-4 border border-gray-200 rounded-lg" onclick="selectService(this, 'تصميم بنر إعلاني', 200)">
                                    <div class="flex items-center flex-1">
                                        <div class="radio-circle ml-3"></div>
                                        <div class="flex-1">
                                            <h4 class="font-medium text-gray-900">تصميم بنر إعلاني</h4>
                                            <p class="text-sm text-gray-600 mt-1">تصميم بنرات إعلانية جذابة ومؤثرة</p>
                                            <div class="flex items-center justify-between mt-2">
                                                <span class="text-lg font-bold text-blue-600">200 <span class="text-sm text-gray-600">ج.م</span></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="service-option flex items-center justify-between p-4 border border-gray-200 rounded-lg" onclick="selectService(this, 'تصميم غلاف فيسبوك', 150)">
                                    <div class="flex items-center flex-1">
                                        <div class="radio-circle ml-3"></div>
                                        <div class="flex-1">
                                            <h4 class="font-medium text-gray-900">تصميم غلاف فيسبوك</h4>
                                            <p class="text-sm text-gray-600 mt-1">تصميم أغلفة احترافية للصفحات</p>
                                            <div class="flex items-center justify-between mt-2">
                                                <span class="text-lg font-bold text-blue-600">150 <span class="text-sm text-gray-600">ج.م</span></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="service-option flex items-center justify-between p-4 border border-gray-200 rounded-lg" onclick="selectService(this, 'تصميم بوست سوشيال ميديا', 100)">
                                    <div class="flex items-center flex-1">
                                        <div class="radio-circle ml-3"></div>
                                        <div class="flex-1">
                                            <h4 class="font-medium text-gray-900">تصميم بوست سوشيال ميديا</h4>
                                            <p class="text-sm text-gray-600 mt-1">تصميم منشورات وسائل التواصل الاجتماعي</p>
                                            <div class="flex items-center justify-between mt-2">
                                                <span class="text-lg font-bold text-blue-600">100 <span class="text-sm text-gray-600">ج.م</span></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div id="selected-summary" class="mt-6 pt-6 border-t border-gray-200 hidden">
                                <div class="flex items-center justify-between">
                                    <div class="flex items-center">
                                        <div class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                            <span class="text-white text-sm">✓</span>
                                        </div>
                                        <span class="mr-2 text-green-700 font-medium">
                                            تواصل مع الدعم التقني ✅
                                        </span>
                                    </div>
                                    <div class="text-right">
                                        <p class="text-sm text-gray-600">إجمالي المختار</p>
                                        <p id="total-price" class="text-xl font-bold text-green-600">0 ج.م</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        let selectedServices = [];
        let totalPrice = 0;

        function selectService(element, serviceName, price) {
            // Toggle selection
            const radioCircle = element.querySelector('.radio-circle');
            const isSelected = element.classList.contains('selected');
            
            if (isSelected) {
                // Deselect
                element.classList.remove('selected');
                radioCircle.classList.remove('selected');
                selectedServices = selectedServices.filter(s => s.name !== serviceName);
                totalPrice -= price;
            } else {
                // Select
                element.classList.add('selected');
                radioCircle.classList.add('selected');
                selectedServices.push({ name: serviceName, price: price });
                totalPrice += price;
            }
            
            updateSummary();
        }

        function updateSummary() {
            const summaryDiv = document.getElementById('selected-summary');
            const totalPriceElement = document.getElementById('total-price');
            
            if (selectedServices.length > 0) {
                summaryDiv.classList.remove('hidden');
                totalPriceElement.textContent = totalPrice + ' ج.م';
            } else {
                summaryDiv.classList.add('hidden');
            }
        }

        function showService(serviceType) {
            // Update active button
            document.querySelectorAll('.service-btn').forEach(btn => {
                btn.classList.remove('bg-blue-50', 'text-blue-600', 'border-blue-200');
                btn.classList.add('text-gray-700', 'hover:bg-gray-50');
            });
            
            event.target.closest('.service-btn').classList.add('bg-blue-50', 'text-blue-600', 'border-blue-200');
            event.target.closest('.service-btn').classList.remove('text-gray-700', 'hover:bg-gray-50');
            
            // Here you would load different services based on serviceType
            // For demo, we're showing design services
        }
    </script>
</body>
</html>
`

// Write the demo file
fs.writeFileSync(servicesPagePath, demoHTML)

// Routes
app.get('/', (req, res) => {
    res.redirect('/services')
})

app.get('/services', (req, res) => {
    res.sendFile(servicesPagePath)
})

app.listen(port, () => {
    console.log(\`🚀 Server running at http://localhost:\${port}\`)
    console.log(\`📱 Services page: http://localhost:\${port}/services\`)
})
