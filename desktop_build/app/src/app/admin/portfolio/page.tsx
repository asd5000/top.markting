'use client'

import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import {
  Image,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Star,
  Play,
  User,
  Heart,
  Upload,
  X,
  ExternalLink
} from 'lucide-react'

interface PortfolioItem {
  id: string
  title: string
  description?: string
  category: string
  type: 'image' | 'video'
  image_url?: string
  video_url?: string
  thumbnail_url?: string
  drive_url?: string
  client_name?: string
  project_date?: string
  tags?: string[]
  is_featured: boolean
  is_active: boolean
  views_count: number
  likes_count: number
  created_at: string
  updated_at: string
}

const categories = [
  'هوية بصرية',
  'تصميم مواقع',
  'فيديو إعلاني',
  'موشن جرافيك',
  'تصميم طباعة',
  'تصميم تطبيقات',
  'تصوير فوتوغرافي',
  'أخرى'
]

export default function PortfolioPage() {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [filterType, setFilterType] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null)
  const [uploading, setUploading] = useState(false)

  const [newItem, setNewItem] = useState<Partial<PortfolioItem>>({
    title: '',
    description: '',
    category: categories[0],
    type: 'image',
    image_url: '',
    video_url: '',
    thumbnail_url: '',
    drive_url: '',
    client_name: '',
    project_date: '',
    tags: [],
    is_featured: false,
    is_active: true
  })

  useEffect(() => {
    loadPortfolioItems()
  }, [])

  const loadPortfolioItems = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('portfolio')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error loading portfolio items:', error)
        return
      }

      setPortfolioItems(data || [])
    } catch (error) {
      console.error('Error loading portfolio items:', error)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setNewItem({
      title: '',
      description: '',
      category: categories[0],
      type: 'image',
      image_url: '',
      video_url: '',
      thumbnail_url: '',
      drive_url: '',
      client_name: '',
      project_date: '',
      tags: [],
      is_featured: false,
      is_active: true
    })
    setSelectedItem(null)
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('حجم الملف كبير جداً. الحد الأقصى 5 ميجابايت')
      return
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      alert('يرجى اختيار ملف صورة صحيح')
      return
    }

    try {
      setUploading(true)

      const fileExt = file.name.split('.').pop()
      const fileName = `portfolio_${Date.now()}.${fileExt}`

      console.log('Uploading file:', fileName)

      const { data, error: uploadError } = await supabase.storage
        .from('images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) {
        console.error('Upload error:', uploadError)
        alert(`خطأ في رفع الصورة: ${uploadError.message}`)
        return
      }

      console.log('Upload successful:', data)

      const { data: urlData } = supabase.storage
        .from('images')
        .getPublicUrl(fileName)

      console.log('Public URL:', urlData.publicUrl)
      setNewItem({ ...newItem, image_url: urlData.publicUrl })
      alert('تم رفع الصورة بنجاح!')
    } catch (error) {
      console.error('Error uploading image:', error)
      alert(`خطأ في رفع الصورة: ${error}`)
    } finally {
      setUploading(false)
    }
  }

  const handleThumbnailUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('حجم الملف كبير جداً. الحد الأقصى 5 ميجابايت')
      return
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      alert('يرجى اختيار ملف صورة صحيح')
      return
    }

    try {
      setUploading(true)

      const fileExt = file.name.split('.').pop()
      const fileName = `thumbnail_${Date.now()}.${fileExt}`

      console.log('Uploading thumbnail:', fileName)

      const { data, error: uploadError } = await supabase.storage
        .from('images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) {
        console.error('Thumbnail upload error:', uploadError)
        alert(`خطأ في رفع الصورة المصغرة: ${uploadError.message}`)
        return
      }

      console.log('Thumbnail upload successful:', data)

      const { data: urlData } = supabase.storage
        .from('images')
        .getPublicUrl(fileName)

      console.log('Thumbnail public URL:', urlData.publicUrl)
      setNewItem({ ...newItem, thumbnail_url: urlData.publicUrl })
      alert('تم رفع الصورة المصغرة بنجاح!')
    } catch (error) {
      console.error('Error uploading thumbnail:', error)
      alert(`خطأ في رفع الصورة المصغرة: ${error}`)
    } finally {
      setUploading(false)
    }
  }

  const saveItem = async () => {
    if (!newItem.title || !newItem.category) {
      alert('يرجى ملء الحقول المطلوبة')
      return
    }

    if (newItem.type === 'image' && !newItem.image_url) {
      alert('يرجى رفع صورة للعمل')
      return
    }

    if (newItem.type === 'video' && !newItem.video_url) {
      alert('يرجى إدخال رابط الفيديو')
      return
    }

    try {
      setUploading(true)

      const itemData = {
        ...newItem,
        views_count: selectedItem?.views_count || 0,
        likes_count: selectedItem?.likes_count || 0,
        updated_at: new Date().toISOString()
      }

      if (selectedItem) {
        // تحديث عمل موجود
        const { error } = await supabase
          .from('portfolio')
          .update(itemData)
          .eq('id', selectedItem.id)

        if (error) {
          console.error('Error updating portfolio item:', error)
          alert('خطأ في تحديث العمل')
          return
        }
      } else {
        // إضافة عمل جديد
        const { error } = await supabase
          .from('portfolio')
          .insert([{
            ...itemData,
            created_at: new Date().toISOString()
          }])

        if (error) {
          console.error('Error creating portfolio item:', error)
          alert('خطأ في إضافة العمل')
          return
        }
      }

      setShowModal(false)
      resetForm()
      loadPortfolioItems()
      alert(selectedItem ? 'تم تحديث العمل بنجاح' : 'تم إضافة العمل بنجاح')
    } catch (error) {
      console.error('Error saving portfolio item:', error)
      alert('خطأ في حفظ العمل')
    } finally {
      setUploading(false)
    }
  }

  const deleteItem = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا العمل؟')) return

    try {
      const { error } = await supabase
        .from('portfolio')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting portfolio item:', error)
        return
      }

      loadPortfolioItems()
    } catch (error) {
      console.error('Error deleting portfolio item:', error)
    }
  }

  const editItem = (item: PortfolioItem) => {
    setSelectedItem(item)
    setNewItem(item)
    setShowModal(true)
  }

  const filteredItems = portfolioItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.client_name?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !filterCategory || item.category === filterCategory
    const matchesType = !filterType || item.type === filterType
    return matchesSearch && matchesCategory && matchesType
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل سابقة الأعمال...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Image className="w-6 h-6 ml-2 text-blue-600" />
            سابقات الأعمال
          </h1>
          <p className="text-gray-600 mt-1">إدارة معرض الأعمال والمشاريع</p>
        </div>
        
        <button
          onClick={() => {
            resetForm()
            setShowModal(true)
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <Plus className="w-5 h-5 ml-2" />
          إضافة عمل جديد
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="البحث في الأعمال..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">جميع التصنيفات</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">جميع الأنواع</option>
            <option value="image">صور</option>
            <option value="video">فيديوهات</option>
          </select>

          <div className="text-sm text-gray-600 flex items-center">
            <Filter className="w-4 h-4 ml-2" />
            {filteredItems.length} من {portfolioItems.length} عمل
          </div>
        </div>
      </div>

      {/* Portfolio Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredItems.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            {/* Media Preview */}
            <div className="relative h-48 bg-gray-100">
              {item.type === 'image' && item.image_url ? (
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              ) : item.type === 'video' ? (
                <div className="w-full h-full flex items-center justify-center bg-gray-900">
                  {item.thumbnail_url ? (
                    <img
                      src={item.thumbnail_url}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Play className="w-12 h-12 text-white" />
                  )}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-black bg-opacity-50 rounded-full p-3">
                      <Play className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Image className="w-12 h-12 text-gray-400" />
                </div>
              )}

              {/* Featured Badge */}
              {item.is_featured && (
                <div className="absolute top-2 right-2">
                  <Star className="w-5 h-5 text-yellow-500 fill-current" />
                </div>
              )}

              {/* Status Badge */}
              <div className={`absolute top-2 left-2 px-2 py-1 rounded text-xs font-medium ${
                item.is_active 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {item.is_active ? 'نشط' : 'غير نشط'}
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-900 text-sm line-clamp-2">
                  {item.title}
                </h3>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {item.category}
                </span>
              </div>

              {item.description && (
                <p className="text-gray-600 text-xs mb-3 line-clamp-2">
                  {item.description}
                </p>
              )}

              {/* Stats */}
              <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                <div className="flex items-center space-x-3">
                  <span className="flex items-center">
                    <Eye className="w-3 h-3 ml-1" />
                    {item.views_count}
                  </span>
                  <span className="flex items-center">
                    <Heart className="w-3 h-3 ml-1" />
                    {item.likes_count}
                  </span>
                </div>
                {item.client_name && (
                  <span className="flex items-center">
                    <User className="w-3 h-3 ml-1" />
                    {item.client_name}
                  </span>
                )}
              </div>

              {/* Drive Link */}
              {item.drive_url && (
                <div className="mb-3">
                  <a
                    href={item.drive_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-xs text-blue-600 hover:text-blue-700 bg-blue-50 px-2 py-1 rounded"
                  >
                    <ExternalLink className="w-3 h-3 ml-1" />
                    Google Drive
                  </a>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  <button
                    onClick={() => alert('سيتم إضافة هذه الميزة قريباً')}
                    className="text-blue-600 hover:text-blue-700 p-1"
                    title="عرض"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => editItem(item)}
                    className="text-green-600 hover:text-green-700 p-1"
                    title="تعديل"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="text-red-600 hover:text-red-700 p-1"
                    title="حذف"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <span className="text-xs text-gray-400">
                  {new Date(item.created_at).toLocaleDateString('ar-EG')}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <Image className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد أعمال</h3>
          <p className="text-gray-600">ابدأ بإضافة أول عمل في معرض أعمالك</p>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {selectedItem ? 'تعديل العمل' : 'إضافة عمل جديد'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    عنوان العمل *
                  </label>
                  <input
                    type="text"
                    value={newItem.title || ''}
                    onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="أدخل عنوان العمل"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    وصف العمل
                  </label>
                  <textarea
                    value={newItem.description || ''}
                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="أدخل وصف العمل"
                  />
                </div>

                {/* Category and Type */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      التصنيف *
                    </label>
                    <select
                      value={newItem.category || ''}
                      onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      نوع العمل *
                    </label>
                    <select
                      value={newItem.type || 'image'}
                      onChange={(e) => setNewItem({ ...newItem, type: e.target.value as 'image' | 'video' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="image">صورة</option>
                      <option value="video">فيديو</option>
                    </select>
                  </div>
                </div>

                {/* Client Name and Project Date */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      اسم العميل
                    </label>
                    <input
                      type="text"
                      value={newItem.client_name || ''}
                      onChange={(e) => setNewItem({ ...newItem, client_name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="أدخل اسم العميل"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      تاريخ المشروع
                    </label>
                    <input
                      type="date"
                      value={newItem.project_date || ''}
                      onChange={(e) => setNewItem({ ...newItem, project_date: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Google Drive Link */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    رابط Google Drive (اختياري)
                  </label>
                  <input
                    type="url"
                    value={newItem.drive_url || ''}
                    onChange={(e) => setNewItem({ ...newItem, drive_url: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://drive.google.com/..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    يمكنك إضافة رابط مجلد أو ملف من Google Drive لمشاركة الملفات الأصلية
                  </p>
                </div>

                {/* Media Upload */}
                {newItem.type === 'image' ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      صورة العمل *
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {newItem.image_url && (
                      <div className="mt-2">
                        <img
                          src={newItem.image_url}
                          alt="معاينة"
                          className="w-32 h-32 object-cover rounded-lg"
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        رابط الفيديو *
                      </label>
                      <input
                        type="url"
                        value={newItem.video_url || ''}
                        onChange={(e) => setNewItem({ ...newItem, video_url: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://youtube.com/watch?v=..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        صورة مصغرة للفيديو
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleThumbnailUpload}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      {newItem.thumbnail_url && (
                        <div className="mt-2">
                          <img
                            src={newItem.thumbnail_url}
                            alt="معاينة الصورة المصغرة"
                            className="w-32 h-32 object-cover rounded-lg"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Options */}
                <div className="flex items-center space-x-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newItem.is_featured || false}
                      onChange={(e) => setNewItem({ ...newItem, is_featured: e.target.checked })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="mr-2 text-sm text-gray-700">عمل مميز</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newItem.is_active !== false}
                      onChange={(e) => setNewItem({ ...newItem, is_active: e.target.checked })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="mr-2 text-sm text-gray-700">نشط</span>
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  onClick={saveItem}
                  disabled={uploading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {uploading ? 'جاري الحفظ...' : (selectedItem ? 'تحديث' : 'إضافة')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
