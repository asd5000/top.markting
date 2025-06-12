'use client'

import { useState, useEffect } from 'react'
import { Phone, Mail, MapPin, MessageCircle, Clock, Building } from 'lucide-react'
import { useSiteSettings } from '@/hooks/useSiteSettings'
import { formatWhatsAppNumber } from '@/lib/site-settings'

interface ContactSectionProps {
  variant?: 'default' | 'compact' | 'card' | 'footer'
  className?: string
  showTitle?: boolean
  title?: string
}

export default function ContactSection({ 
  variant = 'default', 
  className = '',
  showTitle = true,
  title = 'تواصل معنا'
}: ContactSectionProps) {
  const { settings, loading } = useSiteSettings()
  const [contactLinks, setContactLinks] = useState<any>(null)

  useEffect(() => {
    if (settings) {
      loadContactLinks()
    }
  }, [settings])

  const loadContactLinks = async () => {
    if (!settings) return

    const whatsappNumber = formatWhatsAppNumber(settings.whatsapp_number)
    
    setContactLinks({
      whatsapp: `https://wa.me/${whatsappNumber}`,
      phone: `tel:${settings.phone_number}`,
      email: `mailto:${settings.email}`
    })
  }

  if (loading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    )
  }

  // Compact variant - للاستخدام في الهيدر أو الأماكن الضيقة
  if (variant === 'compact') {
    return (
      <div className={`flex items-center space-x-4 space-x-reverse ${className}`}>
        <a
          href={contactLinks?.phone}
          className="flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors"
        >
          <Phone className="w-4 h-4 ml-1" />
          {settings?.phone_number}
        </a>
        <a
          href={contactLinks?.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center text-sm text-green-600 hover:text-green-700 transition-colors"
        >
          <MessageCircle className="w-4 h-4 ml-1" />
          واتساب
        </a>
      </div>
    )
  }

  // Card variant - للاستخدام في البطاقات
  if (variant === 'card') {
    return (
      <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
        {showTitle && (
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <Phone className="w-5 h-5 ml-2" />
            {title}
          </h3>
        )}
        
        <div className="space-y-3">
          <a
            href={contactLinks?.email}
            className="flex items-center text-gray-600 hover:text-blue-600 transition-colors group"
          >
            <Mail className="w-4 h-4 ml-2 flex-shrink-0 group-hover:text-blue-600" />
            <span className="break-all">{settings?.email}</span>
          </a>

          <a
            href={contactLinks?.phone}
            className="flex items-center text-gray-600 hover:text-blue-600 transition-colors group"
          >
            <Phone className="w-4 h-4 ml-2 flex-shrink-0 group-hover:text-blue-600" />
            <span>{settings?.phone_number}</span>
          </a>

          <a
            href={contactLinks?.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-gray-600 hover:text-green-600 transition-colors group"
          >
            <MessageCircle className="w-4 h-4 ml-2 flex-shrink-0 group-hover:text-green-600" />
            <span>واتساب: {settings?.whatsapp_number}</span>
          </a>

          <div className="flex items-center text-gray-600">
            <MapPin className="w-4 h-4 ml-2 flex-shrink-0" />
            <span>{settings?.city}, {settings?.country}</span>
          </div>

          {settings?.working_hours && (
            <div className="flex items-center text-gray-600">
              <Clock className="w-4 h-4 ml-2 flex-shrink-0" />
              <span className="text-sm">{settings.working_hours}</span>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Footer variant - للاستخدام في الفوتر
  if (variant === 'footer') {
    return (
      <div className={className}>
        {showTitle && (
          <h3 className="text-lg font-bold mb-4">{title}</h3>
        )}
        
        <div className="space-y-3 text-gray-400">
          <a
            href={contactLinks?.email}
            className="flex items-center hover:text-white transition-colors"
          >
            <Mail className="w-4 h-4 ml-2 flex-shrink-0" />
            <span className="break-all">{settings?.email}</span>
          </a>

          <a
            href={contactLinks?.phone}
            className="flex items-center hover:text-white transition-colors"
          >
            <Phone className="w-4 h-4 ml-2 flex-shrink-0" />
            <span>{settings?.phone_number}</span>
          </a>

          <a
            href={contactLinks?.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center hover:text-white transition-colors"
          >
            <MessageCircle className="w-4 h-4 ml-2 flex-shrink-0" />
            <span>واتساب: {settings?.whatsapp_number}</span>
          </a>

          <div className="flex items-center">
            <MapPin className="w-4 h-4 ml-2 flex-shrink-0" />
            <span>{settings?.city}, {settings?.country}</span>
          </div>
        </div>
      </div>
    )
  }

  // Default variant - للاستخدام العام
  return (
    <div className={className}>
      {showTitle && (
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">{title}</h2>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* معلومات الاتصال الأساسية */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">معلومات الاتصال</h3>
          
          <a
            href={contactLinks?.email}
            className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors group"
          >
            <Mail className="w-5 h-5 text-blue-600 ml-3 group-hover:text-blue-700" />
            <div>
              <p className="font-medium text-gray-900">البريد الإلكتروني</p>
              <p className="text-sm text-gray-600 break-all">{settings?.email}</p>
            </div>
          </a>

          <a
            href={contactLinks?.phone}
            className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors group"
          >
            <Phone className="w-5 h-5 text-blue-600 ml-3 group-hover:text-blue-700" />
            <div>
              <p className="font-medium text-gray-900">رقم الهاتف</p>
              <p className="text-sm text-gray-600">{settings?.phone_number}</p>
            </div>
          </a>

          <a
            href={contactLinks?.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-green-50 transition-colors group"
          >
            <MessageCircle className="w-5 h-5 text-green-600 ml-3 group-hover:text-green-700" />
            <div>
              <p className="font-medium text-gray-900">واتساب</p>
              <p className="text-sm text-gray-600">{settings?.whatsapp_number}</p>
            </div>
          </a>
        </div>

        {/* معلومات إضافية */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">معلومات إضافية</h3>
          
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <MapPin className="w-5 h-5 text-gray-600 ml-3" />
            <div>
              <p className="font-medium text-gray-900">الموقع</p>
              <p className="text-sm text-gray-600">
                {settings?.address && `${settings.address}, `}
                {settings?.city}, {settings?.country}
              </p>
              {settings?.postal_code && (
                <p className="text-xs text-gray-500">الرمز البريدي: {settings.postal_code}</p>
              )}
            </div>
          </div>

          {settings?.working_hours && (
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <Clock className="w-5 h-5 text-gray-600 ml-3" />
              <div>
                <p className="font-medium text-gray-900">ساعات العمل</p>
                <p className="text-sm text-gray-600">{settings.working_hours}</p>
              </div>
            </div>
          )}

          {settings?.support_hours && (
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <Building className="w-5 h-5 text-gray-600 ml-3" />
              <div>
                <p className="font-medium text-gray-900">الدعم الفني</p>
                <p className="text-sm text-gray-600">{settings.support_hours}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* أزرار التواصل السريع */}
      <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
        <a
          href={contactLinks?.phone}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
        >
          <Phone className="w-5 h-5 ml-2" />
          اتصل بنا الآن
        </a>
        
        <a
          href={contactLinks?.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
        >
          <MessageCircle className="w-5 h-5 ml-2" />
          تواصل عبر الواتساب
        </a>
      </div>
    </div>
  )
}
