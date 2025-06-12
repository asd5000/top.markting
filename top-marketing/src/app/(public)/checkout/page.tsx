'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  ShoppingCart, 
  CreditCard, 
  User, 
  Phone, 
  Mail,
  MapPin,
  Check,
  ArrowRight
} from 'lucide-react'

export default function CheckoutPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    paymentMethod: 'cash'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)

  // بيانات السلة الوهمية (في التطبيق الحقيقي ستأتي من localStorage أو state management)
  const cartItems = [
    { id: 1, name: 'تصميم لوجو', service: 'تصميم', price: 500, quantity: 1 },
    { id: 2, name: 'فيديو تعريفي', service: 'مونتاج', price: 1000, quantity: 1 }
  ]

  const totalPrice = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // محاكاة إرسال الطلب
    setTimeout(() => {
      setIsSubmitting(false)
      setOrderComplete(true)
    }, 2000)
  }

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">تم إرسال طلبك بنجاح!</h2>
          <p className="text-gray-600 mb-6">
            شكراً لك! سيتم التواصل معك خلال 24 ساعة لتأكيد الطلب وبدء العمل.
          </p>
          <div className="space-y-3">
            <Link href="/services" className="btn btn-primary w-full">
              متابعة التسوق
            </Link>
            <Link href="/" className="btn border border-gray-300 w-full">
              العودة للرئيسية
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">TM</span>
              </div>
              <span className="mr-3 text-xl font-bold text-gray-900">Top Marketing</span>
            </Link>
            
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-700 hover:text-blue-600">الرئيسية</Link>
              <Link href="/services" className="text-gray-700 hover:text-blue-600">الخدمات</Link>
              <Link href="/packages" className="text-gray-700 hover:text-blue-600">إدارة الصفحات</Link>
              <Link href="/real-estate" className="text-gray-700 hover:text-blue-600">العقارات</Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">إتمام الطلب</h1>
          <p className="text-gray-600">املأ بياناتك لإتمام عملية الشراء</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* نموذج البيانات */}
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <User className="w-6 h-6 ml-2" />
              بيانات العميل
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="form-label">الاسم الكامل *</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="form-input" 
                  required 
                />
              </div>

              <div>
                <label className="form-label">البريد الإلكتروني *</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="form-input" 
                  required 
                />
              </div>

              <div>
                <label className="form-label">رقم الهاتف *</label>
                <input 
                  type="tel" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="form-input" 
                  required 
                />
              </div>

              <div>
                <label className="form-label">العنوان</label>
                <input 
                  type="text" 
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="form-input" 
                />
              </div>

              <div>
                <label className="form-label">المدينة</label>
                <input 
                  type="text" 
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="form-input" 
                />
              </div>

              <div>
                <label className="form-label">طريقة الدفع *</label>
                <select 
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleInputChange}
                  className="form-input" 
                  required
                >
                  <option value="cash">دفع نقدي عند التسليم</option>
                  <option value="bank">تحويل بنكي</option>
                  <option value="vodafone">فودافون كاش</option>
                </select>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="btn btn-primary w-full py-3 text-lg disabled:opacity-50"
              >
                {isSubmitting ? 'جاري الإرسال...' : 'تأكيد الطلب'}
              </button>
            </form>
          </div>

          {/* ملخص الطلب */}
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <ShoppingCart className="w-6 h-6 ml-2" />
              ملخص الطلب
            </h2>

            <div className="space-y-4 mb-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center border-b pb-4">
                  <div>
                    <h3 className="font-medium text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-600">{item.service}</p>
                    <p className="text-sm text-gray-600">الكمية: {item.quantity}</p>
                  </div>
                  <span className="font-bold text-blue-600">{item.price * item.quantity} ج.م</span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center text-lg font-bold">
                <span>الإجمالي:</span>
                <span className="text-blue-600">{totalPrice} ج.م</span>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">ملاحظة مهمة:</h3>
              <p className="text-sm text-blue-800">
                سيتم التواصل معك خلال 24 ساعة لتأكيد التفاصيل وبدء العمل على مشروعك.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
