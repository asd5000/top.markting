'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import {
  Plus,
  Edit,
  Trash2,
  Upload,
  Save,
  X,
  Package,
  DollarSign,
  Image,
  AlertCircle,
  CheckCircle
} from 'lucide-react'

interface Product {
  id: string
  name: string
  description: string
  price: number
  image_url?: string
  category: string
  is_active: boolean
  stock_quantity: number
  created_at: string
  updated_at: string
}

interface ProductForm {
  name: string
  description: string
  price: number
  category: string
  stock_quantity: number
  is_active: boolean
}

export default function StoreManagementPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  
  const [form, setForm] = useState<ProductForm>({
    name: '',
    description: '',
    price: 0,
    category: '',
    stock_quantity: 0,
    is_active: true
  })

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imageUrl, setImageUrl] = useState<string>('')

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error loading products:', error)
        setMessage({ type: 'error', text: `خطأ في تحميل المنتجات: ${error.message}` })
        return
      }

      setProducts(data || [])
    } catch (error) {
      console.error('Error loading products:', error)
      setMessage({ type: 'error', text: 'حدث خطأ أثناء تحميل المنتجات' })
    } finally {
      setLoading(false)
    }
  }

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      setUploading(true)
      const fileExt = file.name.split('.').pop()
      const fileName = `product-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `products/${fileName}`

      const { data, error } = await supabase.storage
        .from('store-images')
        .upload(filePath, file)

      if (error) {
        console.error('Error uploading image:', error)
        setMessage({ type: 'error', text: `خطأ في رفع الصورة: ${error.message}` })
        return null
      }

      const { data: { publicUrl } } = supabase.storage
        .from('store-images')
        .getPublicUrl(filePath)

      return publicUrl
    } catch (error) {
      console.error('Error uploading image:', error)
      setMessage({ type: 'error', text: 'حدث خطأ أثناء رفع الصورة' })
      return null
    } finally {
      setUploading(false)
    }
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setImageFile(file)
    const url = await uploadImage(file)
    if (url) {
      setImageUrl(url)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!form.name || !form.description || form.price <= 0) {
      setMessage({ type: 'error', text: 'يرجى ملء جميع الحقول المطلوبة' })
      return
    }

    try {
      const productData = {
        ...form,
        image_url: imageUrl || null,
        updated_at: new Date().toISOString()
      }

      if (editingProduct) {
        // تحديث منتج موجود
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProduct.id)

        if (error) {
          console.error('Error updating product:', error)
          setMessage({ type: 'error', text: `خطأ في تحديث المنتج: ${error.message}` })
          return
        }

        setMessage({ type: 'success', text: 'تم تحديث المنتج بنجاح!' })
      } else {
        // إضافة منتج جديد
        const { error } = await supabase
          .from('products')
          .insert([{
            ...productData,
            created_at: new Date().toISOString()
          }])

        if (error) {
          console.error('Error adding product:', error)
          setMessage({ type: 'error', text: `خطأ في إضافة المنتج: ${error.message}` })
          return
        }

        setMessage({ type: 'success', text: 'تم إضافة المنتج بنجاح!' })
      }

      // إعادة تحميل المنتجات وإغلاق النموذج
      await loadProducts()
      resetForm()
    } catch (error) {
      console.error('Error submitting product:', error)
      setMessage({ type: 'error', text: 'حدث خطأ أثناء حفظ المنتج' })
    }
  }

  const resetForm = () => {
    setForm({
      name: '',
      description: '',
      price: 0,
      category: '',
      stock_quantity: 0,
      is_active: true
    })
    setImageFile(null)
    setImageUrl('')
    setEditingProduct(null)
    setShowForm(false)
  }

  const handleEdit = (product: Product) => {
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stock_quantity: product.stock_quantity,
      is_active: product.is_active
    })
    setImageUrl(product.image_url || '')
    setEditingProduct(product)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المنتج؟')) return

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting product:', error)
        setMessage({ type: 'error', text: `خطأ في حذف المنتج: ${error.message}` })
        return
      }

      setMessage({ type: 'success', text: 'تم حذف المنتج بنجاح!' })
      await loadProducts()
    } catch (error) {
      console.error('Error deleting product:', error)
      setMessage({ type: 'error', text: 'حدث خطأ أثناء حذف المنتج' })
    }
  }

  const toggleProductStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ 
          is_active: !currentStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)

      if (error) {
        console.error('Error updating product status:', error)
        setMessage({ type: 'error', text: `خطأ في تحديث حالة المنتج: ${error.message}` })
        return
      }

      setMessage({ type: 'success', text: 'تم تحديث حالة المنتج بنجاح!' })
      await loadProducts()
    } catch (error) {
      console.error('Error updating product status:', error)
      setMessage({ type: 'error', text: 'حدث خطأ أثناء تحديث حالة المنتج' })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل المنتجات...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Package className="w-8 h-8 ml-3 text-blue-600" />
              إدارة المتجر
            </h1>
            <p className="text-gray-600 mt-2">إدارة المنتجات والمخزون</p>
          </div>
          
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <Plus className="w-5 h-5 ml-2" />
            إضافة منتج جديد
          </button>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg flex items-center ${
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
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {product.image_url && (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
              )}
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    product.is_active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {product.is_active ? 'نشط' : 'غير نشط'}
                  </span>
                </div>
                
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center text-green-600">
                    <DollarSign className="w-4 h-4 ml-1" />
                    <span className="font-bold">{product.price} ج.م</span>
                  </div>
                  <span className="text-sm text-gray-500">المخزون: {product.stock_quantity}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center justify-center"
                  >
                    <Edit className="w-4 h-4 ml-1" />
                    تعديل
                  </button>
                  
                  <button
                    onClick={() => toggleProductStatus(product.id, product.is_active)}
                    className={`flex-1 py-2 px-3 rounded-lg transition-colors text-sm ${
                      product.is_active
                        ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {product.is_active ? 'إيقاف' : 'تفعيل'}
                  </button>
                  
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="bg-red-600 text-white py-2 px-3 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">لا توجد منتجات</h3>
            <p className="text-gray-600 mb-6">ابدأ بإضافة منتجات جديدة للمتجر</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              إضافة منتج جديد
            </button>
          </div>
        )}
      </div>

      {/* Product Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingProduct ? 'تعديل المنتج' : 'إضافة منتج جديد'}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    اسم المنتج *
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="أدخل اسم المنتج"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الوصف *
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="أدخل وصف المنتج"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      السعر (ج.م) *
                    </label>
                    <input
                      type="number"
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الكمية المتاحة
                    </label>
                    <input
                      type="number"
                      value={form.stock_quantity}
                      onChange={(e) => setForm({ ...form, stock_quantity: Number(e.target.value) })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0"
                      min="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الفئة
                  </label>
                  <input
                    type="text"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="أدخل فئة المنتج"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    صورة المنتج
                  </label>
                  <div className="flex items-center space-x-4">
                    {imageUrl && (
                      <img
                        src={imageUrl}
                        alt="معاينة"
                        className="w-20 h-20 rounded-lg object-cover border border-gray-300"
                      />
                    )}
                    <div className="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="product-image"
                      />
                      <label
                        htmlFor="product-image"
                        className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors flex items-center justify-center cursor-pointer"
                      >
                        {uploading ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                        ) : (
                          <>
                            <Upload className="w-5 h-5 ml-2 text-gray-400" />
                            <span className="text-gray-600">
                              {imageUrl ? 'تغيير الصورة' : 'رفع صورة المنتج'}
                            </span>
                          </>
                        )}
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={form.is_active}
                    onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="is_active" className="mr-2 block text-sm text-gray-900">
                    منتج نشط (متاح للعملاء)
                  </label>
                </div>

                <div className="flex items-center space-x-4 pt-6">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center"
                  >
                    <Save className="w-5 h-5 ml-2" />
                    {editingProduct ? 'تحديث المنتج' : 'إضافة المنتج'}
                  </button>
                  
                  <button
                    type="button"
                    onClick={resetForm}
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
