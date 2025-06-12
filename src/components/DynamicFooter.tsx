'use client'

import { useState, useEffect } from 'react'
import { Phone, Mail, MapPin, MessageCircle, Facebook, Instagram, Youtube, ExternalLink } from 'lucide-react'
import { useSiteSettings } from '@/hooks/useSiteSettings'
import { formatWhatsAppNumber } from '@/lib/site-settings'

export default function DynamicFooter() {
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
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            <span className="mr-3 text-gray-400">جاري تحميل معلومات الاتصال...</span>
          </div>
        </div>
      </footer>
    )
  }

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* معلومات الشركة */}
          <div>
            <div className="flex items-center mb-4">
              {settings?.logo_url ? (
                <img 
                  src={settings.logo_url} 
                  alt={settings.site_name}
                  className="w-10 h-10 object-contain"
                />
              ) : (
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">TM</span>
                </div>
              )}
              <span className="mr-3 text-xl font-bold">
                {settings?.site_name || 'Top Marketing'}
              </span>
            </div>
            <p className="text-gray-400">
              {settings?.site_description || 'نحن نقدم خدمات تسويقية وتصميمية متكاملة لمساعدة أعمالك على النمو والتطور.'}
            </p>
          </div>

          {/* الخدمات */}
          <div>
            <h3 className="text-lg font-bold mb-4">خدماتنا</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/services" className="hover:text-white transition-colors">التصميم</a></li>
              <li><a href="/services" className="hover:text-white transition-colors">التسويق</a></li>
              <li><a href="/services" className="hover:text-white transition-colors">المونتاج</a></li>
              <li><a href="/services" className="hover:text-white transition-colors">سحب البيانات</a></li>
              <li><a href="/services" className="hover:text-white transition-colors">مواقع الويب</a></li>
            </ul>
          </div>

          {/* روابط مهمة */}
          <div>
            <h3 className="text-lg font-bold mb-4">روابط مهمة</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/" className="hover:text-white transition-colors">الرئيسية</a></li>
              <li><a href="/services" className="hover:text-white transition-colors">الخدمات</a></li>
              <li><a href="/packages" className="hover:text-white transition-colors">الباقات</a></li>
              <li><a href="/portfolio" className="hover:text-white transition-colors">سابقة الأعمال</a></li>
              <li><a href="/real-estate" className="hover:text-white transition-colors">العقارات</a></li>
            </ul>
          </div>
          
          {/* معلومات الاتصال */}
          <div>
            <h3 className="text-lg font-bold mb-4">تواصل معنا</h3>
            <div className="space-y-3 text-gray-400">
              {/* البريد الإلكتروني */}
              <div className="flex items-center">
                <Mail className="w-4 h-4 ml-2 flex-shrink-0" />
                <a 
                  href={contactLinks?.email || `mailto:${settings?.email}`}
                  className="hover:text-white transition-colors break-all"
                >
                  {settings?.email || 'info@topmarketing.com'}
                </a>
              </div>

              {/* رقم الهاتف */}
              <div className="flex items-center">
                <Phone className="w-4 h-4 ml-2 flex-shrink-0" />
                <a 
                  href={contactLinks?.phone || `tel:${settings?.phone_number}`}
                  className="hover:text-white transition-colors"
                >
                  {settings?.phone_number || '01068275557'}
                </a>
              </div>

              {/* واتساب */}
              <div className="flex items-center">
                <MessageCircle className="w-4 h-4 ml-2 flex-shrink-0" />
                <a 
                  href={contactLinks?.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  واتساب: {settings?.whatsapp_number || '01068275557'}
                </a>
              </div>

              {/* الموقع */}
              <div className="flex items-center">
                <MapPin className="w-4 h-4 ml-2 flex-shrink-0" />
                <span>القاهرة، مصر</span>
              </div>
            </div>

            {/* روابط التواصل الاجتماعي */}
            <div className="mt-6">
              <h4 className="text-sm font-medium mb-3">تابعنا على</h4>
              <div className="flex space-x-3 space-x-reverse">
                {settings?.facebook_url && (
                  <a
                    href={settings.facebook_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-blue-500 transition-colors"
                    title="فيسبوك"
                  >
                    <Facebook className="w-5 h-5" />
                  </a>
                )}
                
                {settings?.instagram_url && (
                  <a
                    href={settings.instagram_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-pink-500 transition-colors"
                    title="إنستاجرام"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                )}
                
                {settings?.youtube_url && (
                  <a
                    href={settings.youtube_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-red-500 transition-colors"
                    title="يوتيوب"
                  >
                    <Youtube className="w-5 h-5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* حقوق النشر */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 {settings?.site_name || 'Top Marketing'}. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  )
}
