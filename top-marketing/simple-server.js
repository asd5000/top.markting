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
