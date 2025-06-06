'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  ShoppingCart,
  Plus,
  Minus,
  Star,
  Clock,
  CheckCircle,
  Filter,
  Search,
  Grid,
  List,
  ArrowLeft,
  FileText,
  Building,
  Home,
  Upload,
  Camera,
  X
} from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useAuth } from '@/lib/auth/auth-context'
import { servicesData, ServiceItem, ServiceCategory, paymentMethods } from '@/data/services/services-data'
import { orderOperations, serviceOperations } from '@/lib/supabase/client'
import { toast } from 'react-hot-toast'
import PropertyFormModal from '@/components/PropertyFormModal'
import RealEstateModal from '@/components/RealEstateModal'
import SubscriptionModal from '@/components/SubscriptionModal'
import { storageManager } from '@/lib/storage/local-storage'

interface CartItem extends ServiceItem {
  quantity: number
}

export default function ServicesShopPage() {
  const { user, isAuthenticated } = useAuth()
  const searchParams = useSearchParams()
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [cart, setCart] = useState<CartItem[]>([])
  const [showCart, setShowCart] = useState(false)
  const [showPropertyForm, setShowPropertyForm] = useState(false)
  const [propertyFormType, setPropertyFormType] = useState<'sell-property' | 'buy-property'>('sell-property')
  const [showRealEstateModal, setShowRealEstateModal] = useState(false)
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState<any>(null)
  const [showCheckout, setShowCheckout] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('')
  const [paymentReceipt, setPaymentReceipt] = useState<File | null>(null)
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false)
  const [isLoadingServices, setIsLoadingServices] = useState(false)
  const [currentServices, setCurrentServices] = useState<ServiceCategory[]>(servicesData)

  // Load services from localStorage and listen for changes
  useEffect(() => {
    if (typeof window === 'undefined') return

    // دائماً استخدم البيانات الافتراضية المحدثة
    setCurrentServices(servicesData)
    storageManager.saveServices(servicesData)

    // Listen for storage changes
    const unsubscribe = storageManager.onStorageChange((key, newValue) => {
      if (key === 'topmarketing_services' && newValue) {
        setCurrentServices(newValue)
      }
    })

    return unsubscribe
  }, [])

  // Handle URL parameters for direct navigation
  useEffect(() => {
    const category = searchParams.get('category')
    if (category === 'real-estate') {
      setSelectedCategory('real-estate')
      // Scroll to real estate section after a short delay
      setTimeout(() => {
        const realEstateSection = document.getElementById('real-estate-section')
        if (realEstateSection) {
          realEstateSection.scrollIntoView({ behavior: 'smooth' })
        }
      }, 500)
    }
  }, [searchParams])

  // Get all services from current data (localStorage or default)
  const getAllServices = () => {
    return currentServices.flatMap(category =>
      category.services.map(service => ({
        ...service,
        categoryName: category.name
      }))
    )
  }

  // Filter services based on category and search
  const filteredServices = getAllServices().filter(service => {
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch && service.isActive
  })

  const addToCart = (service: ServiceItem) => {
    if (!isAuthenticated) {
      toast.error('يجب تسجيل الدخول أولاً')
      return
    }

    // إذا كانت خدمة عقارية تحتاج نموذج
    if (service.isForm && service.formType) {
      setPropertyFormType(service.formType)
      setShowPropertyForm(true)
      return
    }

    // إذا كانت خدمة التسويق العقاري المباشرة
    if (service.isDirectForm) {
      setShowRealEstateModal(true)
      return
    }

    // إذا كانت باقة اشتراك
    if (service.isSubscription) {
      setSelectedPackage(service)
      setShowSubscriptionModal(true)
      return
    }

    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === service.id)
      if (existingItem) {
        return prevCart.map(item =>
          item.id === service.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      } else {
        return [...prevCart, { ...service, quantity: 1 }]
      }
    })
    toast.success('تم إضافة الخدمة للسلة')
  }

  const updateQuantity = (serviceId: string, newQuantity: number) => {
    if (newQuantity === 0) {
      removeFromCart(serviceId)
      return
    }

    setCart(prevCart =>
      prevCart.map(item =>
        item.id === serviceId
          ? { ...item, quantity: newQuantity }
          : item
      )
    )
  }

  const removeFromCart = (serviceId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== serviceId))
    toast.success('تم حذف الخدمة من السلة')
  }

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error('السلة فارغة')
      return
    }

    setShowCheckout(true)
  }

  const handlePropertyFormSubmit = async (formData: any) => {
    try {
      // Create order for real estate service
      const orderData = {
        customer_id: user?.id || '',
        service_id: propertyFormType,
        service_name: propertyFormType === 'sell-property' ? 'بيع عقار' : 'شراء عقار',
        quantity: 1,
        price: 0,
        total_amount: 0,
        status: 'pending' as const,
        payment_status: 'paid' as const, // Real estate services are free
        form_data: formData,
        requirements: formData.description || ''
      }

      await orderOperations.createOrder(orderData)
      toast.success('تم إرسال طلبك بنجاح! سنتواصل معك قريباً')
      setShowPropertyForm(false)
    } catch (error) {
      console.error('Error submitting property form:', error)
      toast.error('حدث خطأ في إرسال الطلب')
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('حجم الملف كبير جداً (الحد الأقصى 5 ميجابايت)')
        return
      }
      if (!file.type.startsWith('image/')) {
        toast.error('يجب أن يكون الملف صورة')
        return
      }
      setPaymentReceipt(file)
      toast.success('تم رفع الإيصال بنجاح')
    }
  }

  const submitOrder = async () => {
    if (!selectedPaymentMethod) {
      toast.error('يرجى اختيار طريقة الدفع')
      return
    }

    if (getTotalPrice() > 0 && !paymentReceipt) {
      toast.error('يرجى رفع إيصال الدفع')
      return
    }

    setIsSubmittingOrder(true)

    try {
      // Create orders for each cart item
      for (const item of cart) {
        const orderData = {
          customer_id: user?.id || '',
          service_id: item.id,
          service_name: item.name,
          quantity: item.quantity,
          price: item.price,
          total_amount: item.price * item.quantity,
          status: 'pending' as const,
          payment_status: getTotalPrice() > 0 ? 'pending' as const : 'paid' as const,
          payment_method: selectedPaymentMethod,
          requirements: `طلب خدمة: ${item.name}`
        }

        await orderOperations.createOrder(orderData)
      }

      toast.success('تم إرسال طلبك بنجاح! سنتواصل معك قريباً لتأكيد الدفع')
      setCart([])
      setShowCheckout(false)
      setSelectedPaymentMethod('')
      setPaymentReceipt(null)
    } catch (error) {
      console.error('Error submitting order:', error)
      toast.error('حدث خطأ في إرسال الطلب')
    } finally {
      setIsSubmittingOrder(false)
    }
  }



  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-gradient-primary">
                توب ماركتنج
              </Link>
            </div>
            <div className="flex items-center space-x-4 space-x-reverse">
              {isAuthenticated ? (
                <>
                  <Link
                    href="/dashboard"
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    لوحة التحكم
                  </Link>
                  <button
                    onClick={() => setShowCart(!showCart)}
                    className="relative bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                  >
                    <ShoppingCart className="w-5 h-5 ml-2" />
                    السلة
                    {getTotalItems() > 0 && (
                      <span className="absolute -top-2 -left-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {getTotalItems()}
                      </span>
                    )}
                  </button>
                </>
              ) : (
                <Link
                  href="/auth/login"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  تسجيل الدخول
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            متجر الخدمات
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            اختر من مجموعة واسعة من الخدمات الرقمية والتسويقية المتميزة
          </p>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="ابحث عن خدمة..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                جميع الخدمات
              </button>
              {currentServices.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>

            {/* View Mode */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Services Grid/List */}
        <div
          id="real-estate-section"
          className={`grid gap-6 ${
            viewMode === 'grid'
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
              : 'grid-cols-1'
          }`}
        >
          {filteredServices.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow ${
                viewMode === 'list' ? 'flex' : ''
              }`}
            >
              {/* Service Image/Icon */}
              <div className={`bg-gradient-to-br from-blue-500 to-purple-600 ${
                viewMode === 'list' ? 'w-48 flex-shrink-0' : 'h-48'
              } flex items-center justify-center`}>
                <div className="text-white text-center">
                  <div className="text-4xl mb-2">🎨</div>
                  <span className="text-sm opacity-90">{service.categoryName}</span>
                </div>
              </div>

              <div className="p-6 flex-1">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold text-gray-900">
                    {service.name}
                  </h3>
                  <div className="text-left">
                    <div className="text-2xl font-bold text-blue-600">
                      {service.price} جنيه
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 mb-4 leading-relaxed">
                  {service.description}
                </p>

                <div className="flex items-center mb-4">
                  <Clock className="w-4 h-4 text-gray-400 ml-2" />
                  <span className="text-sm text-gray-600">{service.duration}</span>
                </div>

                <div className="space-y-2 mb-6">
                  {service.features.slice(0, 3).map((feature, idx) => (
                    <div key={idx} className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 ml-2 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{feature}</span>
                    </div>
                  ))}
                  {service.features.length > 3 && (
                    <div className="text-sm text-gray-500">
                      +{service.features.length - 3} مميزات أخرى
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 mr-2">(4.9)</span>
                  </div>

                  <button
                    onClick={() => addToCart(service)}
                    disabled={!isAuthenticated}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {service.isForm ? (
                      <>
                        <FileText className="w-4 h-4 ml-2" />
                        {service.formType === 'sell-property' ? 'بيع عقار' : 'شراء عقار'}
                      </>
                    ) : service.isDirectForm ? (
                      <>
                        <Plus className="w-4 h-4 ml-2" />
                        إضافة عقار
                      </>
                    ) : service.isSubscription ? (
                      <>
                        <Plus className="w-4 h-4 ml-2" />
                        تفعيل اشتراك
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 ml-2" />
                        إضافة للسلة
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredServices.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              لم نجد خدمات مطابقة
            </h3>
            <p className="text-gray-600">
              جرب البحث بكلمات مختلفة أو اختر فئة أخرى
            </p>
          </motion.div>
        )}
      </div>

      {/* Shopping Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowCart(false)} />
          <div className="absolute left-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
            <div className="flex flex-col h-full">
              <div className="px-6 py-4 border-b">
                <h2 className="text-xl font-semibold">سلة التسوق</h2>
              </div>
              
              <div className="flex-1 overflow-y-auto px-6 py-4">
                {cart.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">السلة فارغة</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div key={item.id} className="border rounded-lg p-4">
                        <h3 className="font-semibold text-gray-900 mb-2">
                          {item.name}
                        </h3>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="text-left">
                            <div className="font-semibold">
                              {item.price * item.quantity} جنيه
                            </div>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-red-600 text-sm hover:text-red-800"
                            >
                              حذف
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {cart.length > 0 && (
                <div className="border-t px-6 py-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold">الإجمالي:</span>
                    <span className="text-2xl font-bold text-blue-600">
                      {getTotalPrice()} جنيه
                    </span>
                  </div>
                  <button
                    onClick={handleCheckout}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    إتمام الطلب
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Property Form Modal */}
      {showPropertyForm && (
        <PropertyFormModal
          type={propertyFormType}
          onSubmit={handlePropertyFormSubmit}
          onClose={() => setShowPropertyForm(false)}
        />
      )}

      {/* Real Estate Modal */}
      {showRealEstateModal && (
        <RealEstateModal
          onClose={() => setShowRealEstateModal(false)}
        />
      )}

      {/* Subscription Modal */}
      {showSubscriptionModal && selectedPackage && (
        <SubscriptionModal
          package={selectedPackage}
          onClose={() => {
            setShowSubscriptionModal(false)
            setSelectedPackage(null)
          }}
        />
      )}

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setShowCheckout(false)} />

            <div className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-right align-middle transition-all transform bg-white shadow-xl rounded-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  إتمام الطلب
                </h3>
                <button
                  onClick={() => setShowCheckout(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              {/* Order Summary */}
              <div className="mb-8">
                <h4 className="text-lg font-semibold mb-4">ملخص الطلب</h4>
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between items-center py-2 border-b">
                      <div>
                        <span className="font-medium">{item.name}</span>
                        <span className="text-gray-500 mr-2">x{item.quantity}</span>
                      </div>
                      <span className="font-semibold">{item.price * item.quantity} جنيه</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center py-3 text-lg font-bold border-t-2">
                    <span>الإجمالي:</span>
                    <span className="text-blue-600">{getTotalPrice()} جنيه</span>
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="mb-8">
                <h4 className="text-lg font-semibold mb-4">طرق الدفع</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {paymentMethods.map((method) => (
                    <label
                      key={method.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        selectedPaymentMethod === method.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.id}
                        checked={selectedPaymentMethod === method.id}
                        onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                        className="sr-only"
                      />
                      <div className="flex items-center mb-2">
                        <span className="text-2xl ml-3">{method.icon}</span>
                        <span className="font-semibold">{method.name}</span>
                        {selectedPaymentMethod === method.id && (
                          <CheckCircle className="w-5 h-5 text-blue-600 mr-auto" />
                        )}
                      </div>
                      {method.number && (
                        <div className="text-sm text-gray-600 mb-2">
                          الرقم: {method.number}
                        </div>
                      )}
                      <div className="text-xs text-gray-500">
                        {method.instructions}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Payment Receipt Upload */}
              {getTotalPrice() > 0 && selectedPaymentMethod && (
                <div className="mb-8">
                  <h4 className="text-lg font-semibold mb-4">رفع إيصال الدفع</h4>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    {paymentReceipt ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-center">
                          <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                        <div>
                          <p className="text-green-600 font-semibold">تم رفع الإيصال بنجاح</p>
                          <p className="text-sm text-gray-500">{paymentReceipt.name}</p>
                        </div>
                        <button
                          onClick={() => setPaymentReceipt(null)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          إزالة الإيصال
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <Camera className="w-12 h-12 text-gray-400 mx-auto" />
                        <div>
                          <p className="text-lg font-medium text-gray-900 mb-2">
                            ارفع صورة إيصال الدفع
                          </p>
                          <p className="text-sm text-gray-500 mb-4">
                            صورة واضحة للإيصال (حد أقصى 5 ميجابايت)
                          </p>
                          <label className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer inline-flex items-center">
                            <Upload className="w-4 h-4 ml-2" />
                            اختيار الصورة
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleFileUpload}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={() => setShowCheckout(false)}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  onClick={submitOrder}
                  disabled={isSubmittingOrder || !selectedPaymentMethod || (getTotalPrice() > 0 && !paymentReceipt)}
                  className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isSubmittingOrder ? (
                    <>
                      <div className="spinner ml-2" />
                      جاري الإرسال...
                    </>
                  ) : (
                    'تأكيد الطلب'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
