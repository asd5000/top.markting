'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import {
  ArrowLeft,
  Check,
  Star,
  Package,
  DollarSign,
  Clock,
  Users,
  Phone,
  Mail,
  MessageCircle,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

interface Plan {
  id: string
  name: string
  description: string
  price: number
  image_url?: string
  package_description: string
  is_active: boolean
  features: string[]
  
  // تفاصيل الخدمات
  designs_count: number
  includes_videos: boolean
  videos_count: number
  video_types: string[]
  includes_ads: boolean
  ads_count: number
  includes_page_management: boolean
  includes_auto_replies: boolean
  includes_whatsapp_campaigns: boolean
  includes_google_campaigns: boolean
}

interface PlanItem {
  id: string
  service_type: string
  quantity: number
  unit_price: number
  total_price: number
}

interface SubscriptionForm {
  customer_name: string
  customer_phone: string
  customer_email: string
  notes: string
}

export default function PlansPage() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [planItems, setPlanItems] = useState<{ [key: string]: PlanItem[] }>({})
  const [loading, setLoading] = useState(true)
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)
  const [showSubscriptionForm, setShowSubscriptionForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  
  const [form, setForm] = useState<SubscriptionForm>({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    notes: ''
  })

  useEffect(() => {
    loadPlans()
  }, [])

  const loadPlans = async () => {
    try {
      setLoading(true)
      
      // تحميل الباقات النشطة
      const { data: plansData, error: plansError } = await supabase
        .from('packages')
        .select('*')
        .eq('is_active', true)
        .order('price', { ascending: true })

      if (plansError) {
        console.error('Error loading plans:', plansError)
        return
      }

      setPlans(plansData || [])

      // تحميل عناصر الخدمات لكل باقة
      if (plansData && plansData.length > 0) {
        const { data: itemsData, error: itemsError } = await supabase
          .from('plan_items')
          .select('*')
          .in('plan_id', plansData.map(p => p.id))

        if (!itemsError && itemsData) {
          const itemsByPlan = itemsData.reduce((acc, item) => {
            if (!acc[item.plan_id]) {
              acc[item.plan_id] = []
            }
            acc[item.plan_id].push(item)
            return acc
          }, {} as { [key: string]: PlanItem[] })
          
          setPlanItems(itemsByPlan)
        }
      }
    } catch (error) {
      console.error('Error loading plans:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubscribe = (plan: Plan) => {
    setSelectedPlan(plan)
    setShowSubscriptionForm(true)
  }

  const submitSubscription = async () => {
    if (!selectedPlan || !form.customer_name || !form.customer_phone) {
      setMessage({
        type: 'error',
        text: 'يرجى ملء الاسم ورقم الهاتف على الأقل'
      })
      return
    }

    try {
      setSubmitting(true)

      const subscriptionData = {
        plan_id: selectedPlan.id,
        customer_name: form.customer_name.trim(),
        customer_phone: form.customer_phone.trim(),
        customer_email: form.customer_email.trim() || null,
        status: 'pending',
        total_amount: selectedPlan.price,
        notes: form.notes.trim() || null
      }

      const { error } = await supabase
        .from('plan_subscriptions')
        .insert([subscriptionData])

      if (error) {
        console.error('Error creating subscription:', error)
        setMessage({
          type: 'error',
          text: `خطأ في إرسال طلب الاشتراك: ${error.message}`
        })
        return
      }

      setMessage({
        type: 'success',
        text: 'تم إرسال طلب الاشتراك بنجاح! سيتم التواصل معك قريباً.'
      })

      // مسح النموذج وإغلاقه
      setForm({
        customer_name: '',
        customer_phone: '',
        customer_email: '',
        notes: ''
      })
      setShowSubscriptionForm(false)
      setSelectedPlan(null)

    } catch (error) {
      console.error('Error submitting subscription:', error)
      setMessage({
        type: 'error',
        text: 'حدث خطأ أثناء إرسال طلب الاشتراك'
      })
    } finally {
      setSubmitting(false)
    }
  }

  const getServicesList = (plan: Plan) => {
    const services = []
    
    if (plan.designs_count > 0) {
      services.push(`${plan.designs_count} تصميم شهرياً`)
    }
    
    if (plan.includes_videos && plan.videos_count > 0) {
      const videoTypes = plan.video_types?.join(', ') || 'فيديوهات'
      services.push(`${plan.videos_count} ${videoTypes}`)
    }
    
    if (plan.includes_ads && plan.ads_count > 0) {
      services.push(`${plan.ads_count} إعلان ممول`)
    }
    
    if (plan.includes_page_management) {
      services.push('إدارة صفحات السوشيال ميديا')
    }
    
    if (plan.includes_auto_replies) {
      services.push('ردود تلقائية')
    }
    
    if (plan.includes_whatsapp_campaigns) {
      services.push('حملات واتساب')
    }
    
    if (plan.includes_google_campaigns) {
      services.push('حملات Google')
    }

    return services
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل الباقات...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="text-gray-600 hover:text-blue-600 flex items-center"
            >
              <ArrowLeft className="w-5 h-5 ml-2" />
              العودة للصفحة الرئيسية
            </Link>
            
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Package className="w-6 h-6 ml-2" />
              باقات إدارة الصفحات
            </h1>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-6">
            باقات احترافية لإدارة صفحاتك
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            اختر الباقة المناسبة لك واحصل على خدمات متكاملة لإدارة صفحاتك على وسائل التواصل الاجتماعي
          </p>
        </div>
      </section>

      {/* Message */}
      {message && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <div className={`p-4 rounded-lg flex items-center ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5 ml-2" />
            ) : (
              <AlertCircle className="w-5 h-5 ml-2" />
            )}
            {message.text}
          </div>
        </div>
      )}

      {/* Plans Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {plans.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">لا توجد باقات متاحة</h3>
              <p className="text-gray-600">سيتم إضافة الباقات قريباً</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {plans.map((plan) => {
                const services = getServicesList(plan)
                const items = planItems[plan.id] || []
                
                return (
                  <div key={plan.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow border border-gray-200">
                    {plan.image_url && (
                      <img
                        src={plan.image_url}
                        alt={plan.name}
                        className="w-full h-48 object-cover"
                      />
                    )}
                    
                    <div className="p-8">
                      <div className="text-center mb-6">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                        <p className="text-gray-600 mb-4">{plan.package_description}</p>
                        <div className="flex items-center justify-center mb-4">
                          <DollarSign className="w-6 h-6 text-green-600 ml-1" />
                          <span className="text-3xl font-bold text-green-600">{plan.price}</span>
                          <span className="text-gray-600 mr-2">ج.م / شهر</span>
                        </div>
                      </div>

                      {/* خدمات الباقة */}
                      <div className="space-y-3 mb-6">
                        <h4 className="font-semibold text-gray-900 mb-3">ما تشمله الباقة:</h4>
                        
                        {/* عرض الخدمات من الجدول إذا كانت موجودة */}
                        {items.length > 0 ? (
                          items.map((item) => (
                            <div key={item.id} className="flex items-center text-sm text-gray-700">
                              <Check className="w-4 h-4 text-green-500 ml-2 flex-shrink-0" />
                              <span>{item.quantity} {item.service_type}</span>
                            </div>
                          ))
                        ) : (
                          // عرض الخدمات التقليدية
                          services.map((service, index) => (
                            <div key={index} className="flex items-center text-sm text-gray-700">
                              <Check className="w-4 h-4 text-green-500 ml-2 flex-shrink-0" />
                              <span>{service}</span>
                            </div>
                          ))
                        )}
                        
                        {/* المميزات الإضافية */}
                        {plan.features && plan.features.length > 0 && (
                          plan.features.map((feature, index) => (
                            <div key={index} className="flex items-center text-sm text-gray-700">
                              <Star className="w-4 h-4 text-yellow-500 ml-2 flex-shrink-0" />
                              <span>{feature}</span>
                            </div>
                          ))
                        )}
                      </div>

                      <button
                        onClick={() => handleSubscribe(plan)}
                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors font-medium flex items-center justify-center"
                      >
                        <Package className="w-5 h-5 ml-2" />
                        اشترك الآن
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* Subscription Form Modal */}
      {showSubscriptionForm && selectedPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  اشتراك في باقة {selectedPlan.name}
                </h2>
                <button
                  onClick={() => {
                    setShowSubscriptionForm(false)
                    setSelectedPlan(null)
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="mb-6 p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">السعر الشهري:</span>
                  <span className="text-2xl font-bold text-purple-600">{selectedPlan.price} ج.م</span>
                </div>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); submitSubscription(); }} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الاسم الكامل *
                  </label>
                  <input
                    type="text"
                    value={form.customer_name}
                    onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="أدخل اسمك الكامل"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    رقم الهاتف / واتساب *
                  </label>
                  <input
                    type="tel"
                    value={form.customer_phone}
                    onChange={(e) => setForm({ ...form, customer_phone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="01xxxxxxxxx"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    البريد الإلكتروني (اختياري)
                  </label>
                  <input
                    type="email"
                    value={form.customer_email}
                    onChange={(e) => setForm({ ...form, customer_email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="example@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ملاحظات إضافية (اختياري)
                  </label>
                  <textarea
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="أي ملاحظات أو متطلبات خاصة..."
                  />
                </div>

                <div className="flex items-center space-x-4 pt-6">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center justify-center disabled:opacity-50"
                  >
                    {submitting ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5 ml-2" />
                        تأكيد الاشتراك
                      </>
                    )}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => {
                      setShowSubscriptionForm(false)
                      setSelectedPlan(null)
                    }}
                    className="flex-1 bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors font-medium"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
