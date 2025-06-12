'use client'

import { useState } from 'react'
import { FileText, Image, XCircle, Download, ExternalLink } from 'lucide-react'

interface ReceiptViewerProps {
  receiptUrl: string
  customerName?: string
  amount?: number
}

export default function ReceiptViewer({ receiptUrl, customerName, amount }: ReceiptViewerProps) {
  const [imageError, setImageError] = useState(false)
  const [loading, setLoading] = useState(true)

  if (!receiptUrl) {
    return (
      <div className="p-4 text-center bg-gray-50 rounded-lg">
        <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-600 text-sm">لا يوجد إيصال</p>
      </div>
    )
  }

  // تنظيف الرابط وإصلاحه
  const getValidUrl = (url: string) => {
    if (!url) return ''
    
    // إذا كان رابط كامل وصحيح
    if (url.startsWith('http')) {
      return url
    }
    
    // إذا كان مسار نسبي، نبني الرابط الصحيح
    const cleanPath = url.startsWith('/') ? url.slice(1) : url
    const finalPath = cleanPath.startsWith('receipts/') ? cleanPath : `receipts/${cleanPath}`
    
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${finalPath}`
  }

  const validUrl = getValidUrl(receiptUrl)
  
  // التحقق من نوع الملف
  const isImage = validUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i)
  const isPDF = validUrl.match(/\.pdf$/i)

  const handleDownload = async () => {
    try {
      const response = await fetch(validUrl)
      if (!response.ok) {
        window.open(validUrl, '_blank')
        return
      }
      
      const blob = await response.blob()
      const downloadUrl = URL.createObjectURL(blob)
      
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = `receipt_${customerName || 'unknown'}_${Date.now()}.${isImage ? 'png' : 'pdf'}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      URL.revokeObjectURL(downloadUrl)
    } catch (error) {
      console.error('Error downloading receipt:', error)
      window.open(validUrl, '_blank')
    }
  }

  if (imageError) {
    return (
      <div className="p-4 text-center bg-red-50 rounded-lg border border-red-200">
        <XCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
        <p className="text-red-600 text-sm mb-2">خطأ في تحميل الإيصال</p>
        <div className="space-y-2">
          <button
            onClick={() => window.open(validUrl, '_blank')}
            className="inline-flex items-center px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
          >
            <ExternalLink className="w-3 h-3 ml-1" />
            فتح في نافذة جديدة
          </button>
          <button
            onClick={handleDownload}
            className="inline-flex items-center px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 mr-2"
          >
            <Download className="w-3 h-3 ml-1" />
            تحميل
          </button>
        </div>
      </div>
    )
  }

  if (isImage) {
    return (
      <div className="relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
            <div className="text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-xs text-gray-600">جاري التحميل...</p>
            </div>
          </div>
        )}
        <div className="group relative">
          <img
            src={validUrl}
            alt={`إيصال ${customerName || ''}`}
            className="max-w-full h-auto max-h-64 object-contain border rounded-lg shadow-sm"
            onLoad={() => setLoading(false)}
            onError={() => {
              setLoading(false)
              setImageError(true)
            }}
            style={{ display: loading ? 'none' : 'block' }}
          />
          <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex space-x-1">
              <button
                onClick={() => window.open(validUrl, '_blank')}
                className="p-1 bg-black bg-opacity-50 text-white rounded hover:bg-opacity-70"
                title="عرض بالحجم الكامل"
              >
                <ExternalLink className="w-3 h-3" />
              </button>
              <button
                onClick={handleDownload}
                className="p-1 bg-black bg-opacity-50 text-white rounded hover:bg-opacity-70"
                title="تحميل"
              >
                <Download className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (isPDF) {
    return (
      <div className="p-4 text-center bg-red-50 rounded-lg border border-red-200">
        <FileText className="w-8 h-8 text-red-500 mx-auto mb-2" />
        <p className="text-gray-700 text-sm mb-2">ملف PDF</p>
        <div className="space-y-2">
          <button
            onClick={() => window.open(validUrl, '_blank')}
            className="inline-flex items-center px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
          >
            <ExternalLink className="w-3 h-3 ml-1" />
            فتح PDF
          </button>
          <button
            onClick={handleDownload}
            className="inline-flex items-center px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 mr-2"
          >
            <Download className="w-3 h-3 ml-1" />
            تحميل
          </button>
        </div>
      </div>
    )
  }

  // نوع ملف غير معروف
  return (
    <div className="p-4 text-center bg-gray-50 rounded-lg border border-gray-200">
      <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
      <p className="text-gray-600 text-sm mb-2">ملف الإيصال</p>
      <p className="text-xs text-gray-500 mb-2">
        نوع الملف: {validUrl.split('.').pop()?.toUpperCase() || 'غير معروف'}
      </p>
      <div className="space-y-2">
        <button
          onClick={() => window.open(validUrl, '_blank')}
          className="inline-flex items-center px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
        >
          <ExternalLink className="w-3 h-3 ml-1" />
          فتح الملف
        </button>
        <button
          onClick={handleDownload}
          className="inline-flex items-center px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 mr-2"
        >
          <Download className="w-3 h-3 ml-1" />
          تحميل
        </button>
      </div>
    </div>
  )
}
