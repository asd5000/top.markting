'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Trash2,
  Plus,
  Minus,
  ShoppingCart,
  CreditCard,
  Phone,
  MessageCircle
} from 'lucide-react'

interface CartItem {
  id: string
  name: string
  price: number
  service_name: string
  quantity: number
  image_url?: string
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCart()
  }, [])

  const loadCart = () => {
    try {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]')
      setCartItems(cart)
    } catch (error) {
      console.error('Error loading cart:', error)
      setCartItems([])
    } finally {
      setLoading(false)
    }
  }

  const updateCart = (newCart: CartItem[]) => {
    setCartItems(newCart)
    localStorage.setItem('cart', JSON.stringify(newCart))
  }

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id)
      return
    }

    const updatedCart = cartItems.map(item =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    )
    updateCart(updatedCart)
  }

  const removeItem = (id: string) => {
    const updatedCart = cartItems.filter(item => item.id !== id)
    updateCart(updatedCart)
  }

  const clearCart = () => {
    updateCart([])
  }

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }

  const generateWhatsAppMessage = () => {
    const itemsList = cartItems.map(item => 
      `• ${item.name} (${item.service_name}) - ${item.quantity}x - ${item.price * item.quantity} ج.م`
    ).join('\n')
    
    return `مرحباً، أريد طلب الخدمات التالية:\n\n${itemsList}\n\nالإجمالي: ${getTotalPrice()} ج.م\n\nشكراً لكم`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل السلة...</p>
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
              <ShoppingCart className="w-6 h-6 ml-2" />
              سلة التسوق
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">السلة فارغة</h3>
            <p className="text-gray-600 mb-6">لم تقم بإضافة أي خدمات إلى السلة بعد</p>
            <Link
              href="/services"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
            >
              تصفح الخدمات
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">
                      الخدمات المطلوبة ({getTotalItems()})
                    </h2>
                    <button
                      onClick={clearCart}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      إفراغ السلة
                    </button>
                  </div>
                </div>

                <div className="divide-y divide-gray-200">
                  {cartItems.map((item) => (
                    <div key={item.id} className="p-6">
                      <div className="flex items-center space-x-4">
                        {item.image_url && (
                          <img
                            src={item.image_url}
                            alt={item.name}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                        )}
                        
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                          <p className="text-sm text-gray-600">{item.service_name}</p>
                          <p className="text-lg font-bold text-green-600 mt-1">
                            {item.price} ج.م
                          </p>
                        </div>

                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 text-gray-600 hover:text-gray-800"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          
                          <span className="w-8 text-center font-medium">
                            {item.quantity}
                          </span>
                          
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 text-gray-600 hover:text-gray-800"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">
                            {item.price * item.quantity} ج.م
                          </p>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-red-600 hover:text-red-800 mt-2"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 sticky top-6">
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">ملخص الطلب</h3>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600">عدد الخدمات:</span>
                      <span className="font-medium">{getTotalItems()}</span>
                    </div>
                    
                    <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-3">
                      <span>الإجمالي:</span>
                      <span className="text-green-600">{getTotalPrice()} ج.م</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Link
                      href="/checkout"
                      className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center"
                    >
                      <CreditCard className="w-5 h-5 ml-2" />
                      إتمام الطلب
                    </Link>

                    <a
                      href={`https://wa.me/201068275557?text=${encodeURIComponent(generateWhatsAppMessage())}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center"
                    >
                      <MessageCircle className="w-5 h-5 ml-2" />
                      طلب عبر واتساب
                    </a>
                  </div>

                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">معلومات مهمة:</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• سيتم التواصل معك لتأكيد الطلب</li>
                      <li>• الدفع عند التسليم أو مقدماً</li>
                      <li>• ضمان الجودة والمراجعات المجانية</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
