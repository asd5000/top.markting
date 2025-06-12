'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import {
  Filter,
  Search,
  Eye,
  Heart,
  Play,
  ExternalLink,
  Calendar,
  Tag,
  Star,
  Image as ImageIcon,
  Video,
  X,
  ArrowLeft,
  ArrowRight
} from 'lucide-react'

interface PortfolioItem {
  id: string
  title: string
  description: string
  category: string
  type: 'image' | 'video'
  image_url?: string
  video_url?: string
  thumbnail_url?: string
  is_featured: boolean
  likes_count: number
  views_count: number
  tags: string[]
  client_name?: string
  project_date?: string
  created_at: string
}

const categories = [
  'تصميم جرافيك',
  'هوية بصرية',
  'تصميم مواقع',
  'UI/UX',
  'فيديو إعلاني',
  'موشن جرافيك',
  'حملة إعلانية',
  'سوشيال ميديا',
  'تصوير فوتوغرافي',
  'أخرى'
]

export default function PortfolioPage() {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([])
  const [featuredItems, setFeaturedItems] = useState<PortfolioItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [filterType, setFilterType] = useState('')
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    loadPortfolioItems()
  }, [])

  useEffect(() => {
    // Auto-slide for featured items
    if (featuredItems.length > 1) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % featuredItems.length)
      }, 5000)
      return () => clearInterval(timer)
    }
  }, [featuredItems.length])

  const loadPortfolioItems = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('portfolio')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error loading portfolio:', error)
        return
      }

      const items = data || []
      setPortfolioItems(items)
      setFeaturedItems(items.filter(item => item.is_featured))
    } catch (error) {
      console.error('Error loading portfolio:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateViews = async (id: string) => {
    try {
      await supabase
        .from('portfolio')
        .update({ views_count: (portfolioItems.find(item => item.id === id)?.views_count || 0) + 1 })
        .eq('id', id)
    } catch (error) {
      console.error('Error updating views:', error)
    }
  }

  const openModal = (item: PortfolioItem) => {
    setSelectedItem(item)
    setShowModal(true)
    updateViews(item.id)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedItem(null)
  }

  const getVideoEmbedUrl = (url: string) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.includes('youtu.be') 
        ? url.split('/').pop()?.split('?')[0]
        : url.split('v=')[1]?.split('&')[0]
      return `https://www.youtube.com/embed/${videoId}`
    }
    if (url.includes('vimeo.com')) {
      const videoId = url.split('/').pop()
      return `https://player.vimeo.com/video/${videoId}`
    }
    return url
  }

  const filteredItems = portfolioItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = !filterCategory || item.category === filterCategory
    const matchesType = !filterType || item.type === filterType
    
    return matchesSearch && matchesCategory && matchesType
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل معرض الأعمال...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">TM</span>
              </div>
              <span className="mr-3 text-xl font-bold text-gray-900">Top Marketing</span>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-700 hover:text-blue-600">الرئيسية</Link>
              <Link href="/services" className="text-gray-700 hover:text-blue-600">الخدمات</Link>
              <Link href="/packages" className="text-gray-700 hover:text-blue-600">الباقات</Link>
              <Link href="/portfolio" className="text-blue-600 font-medium">معرض الأعمال</Link>
              <Link href="/add-property" className="text-gray-700 hover:text-blue-600">العقارات</Link>
            </nav>

            <div className="flex items-center space-x-4">
              <Link
                href="/visitor-login"
                className="text-gray-700 hover:text-blue-600 text-sm font-medium"
              >
                تسجيل الدخول
              </Link>
              <Link
                href="/login"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                دخول الإدارة
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Featured Slider */}
      {featuredItems.length > 0 && (
        <section className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4">أعمالنا المميزة</h1>
              <p className="text-xl opacity-90">مجموعة مختارة من أفضل مشاريعنا</p>
            </div>

            <div className="relative">
              <div className="overflow-hidden rounded-2xl">
                <div 
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {featuredItems.map((item, index) => (
                    <div key={item.id} className="w-full flex-shrink-0">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                        <div className="order-2 lg:order-1">
                          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6">
                            <div className="flex items-center mb-4">
                              <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                                <Star className="w-4 h-4 ml-1" />
                                مميز
                              </span>
                              <span className="bg-white bg-opacity-20 text-white px-3 py-1 rounded-full text-sm mr-2">
                                {item.category}
                              </span>
                            </div>
                            <h2 className="text-3xl font-bold mb-4">{item.title}</h2>
                            <p className="text-lg opacity-90 mb-6">{item.description}</p>
                            <div className="flex items-center space-x-6 mb-6">
                              <div className="flex items-center">
                                <Eye className="w-5 h-5 ml-2" />
                                <span>{item.views_count} مشاهدة</span>
                              </div>
                              <div className="flex items-center">
                                <Heart className="w-5 h-5 ml-2" />
                                <span>{item.likes_count} إعجاب</span>
                              </div>
                              {item.client_name && (
                                <div className="flex items-center">
                                  <Tag className="w-5 h-5 ml-2" />
                                  <span>{item.client_name}</span>
                                </div>
                              )}
                            </div>
                            <button
                              onClick={() => openModal(item)}
                              className="bg-white text-blue-600 px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium flex items-center"
                            >
                              عرض التفاصيل
                              <ExternalLink className="w-5 h-5 mr-2" />
                            </button>
                          </div>
                        </div>
                        
                        <div className="order-1 lg:order-2">
                          <div className="relative rounded-xl overflow-hidden shadow-2xl">
                            {item.type === 'image' && item.image_url && (
                              <img
                                src={item.image_url}
                                alt={item.title}
                                className="w-full h-80 object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                                onClick={() => openModal(item)}
                              />
                            )}
                            
                            {item.type === 'video' && (
                              <div className="relative">
                                {item.thumbnail_url ? (
                                  <img
                                    src={item.thumbnail_url}
                                    alt={item.title}
                                    className="w-full h-80 object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-80 bg-gray-900 flex items-center justify-center">
                                    <Video className="w-16 h-16 text-gray-400" />
                                  </div>
                                )}
                                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                                  <button
                                    onClick={() => openModal(item)}
                                    className="bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-4 transition-all duration-300 transform hover:scale-110"
                                  >
                                    <Play className="w-8 h-8 text-blue-600" />
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Slider Controls */}
              {featuredItems.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentSlide((prev) => (prev - 1 + featuredItems.length) % featuredItems.length)}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-2 transition-all"
                  >
                    <ArrowLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() => setCurrentSlide((prev) => (prev + 1) % featuredItems.length)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-2 transition-all"
                  >
                    <ArrowRight className="w-6 h-6" />
                  </button>

                  {/* Dots */}
                  <div className="flex justify-center mt-6 space-x-2">
                    {featuredItems.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-3 h-3 rounded-full transition-all ${
                          index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Filters Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {filteredItems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
                    onClick={() => openModal(item)}
                  >
                    {/* Image/Video Preview */}
                    <div className="relative h-48 bg-gray-100 overflow-hidden">
                      {item.type === 'image' && item.image_url && (
                        <img
                          src={item.image_url}
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                        />
                      )}

                      {item.type === 'video' && (
                        <div className="relative w-full h-full">
                          {item.thumbnail_url ? (
                            <img
                              src={item.thumbnail_url}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                              <Video className="w-12 h-12 text-gray-400" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                            <Play className="w-8 h-8 text-white" />
                          </div>
                        </div>
                      )}

                      {/* Badges */}
                      <div className="absolute top-2 right-2 flex space-x-2">
                        {item.is_featured && (
                          <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                            <Star className="w-3 h-3 ml-1" />
                            مميز
                          </span>
                        )}
                        <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                          {item.type === 'image' ? (
                            <ImageIcon className="w-3 h-3 ml-1" />
                          ) : (
                            <Video className="w-3 h-3 ml-1" />
                          )}
                          {item.type === 'image' ? 'صورة' : 'فيديو'}
                        </span>
                      </div>

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="flex items-center justify-between text-white text-sm">
                            <div className="flex items-center space-x-4">
                              <span className="flex items-center">
                                <Eye className="w-4 h-4 ml-1" />
                                {item.views_count}
                              </span>
                              <span className="flex items-center">
                                <Heart className="w-4 h-4 ml-1" />
                                {item.likes_count}
                              </span>
                            </div>
                            <span className="bg-white bg-opacity-20 px-2 py-1 rounded text-xs">
                              عرض
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{item.title}</h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>

                      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                        <span className="bg-gray-100 px-2 py-1 rounded">{item.category}</span>
                        <span>{new Date(item.created_at).toLocaleDateString('ar-EG')}</span>
                      </div>

                      {item.client_name && (
                        <div className="text-xs text-blue-600 font-medium">
                          العميل: {item.client_name}
                        </div>
                      )}

                      {/* Tags */}
                      {item.tags && item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {item.tags.slice(0, 3).map((tag, index) => (
                            <span key={index} className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-xs">
                              {tag}
                            </span>
                          ))}
                          {item.tags.length > 3 && (
                            <span className="text-gray-400 text-xs">+{item.tags.length - 3}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد أعمال</h3>
                <p className="text-gray-600">جرب تغيير معايير البحث أو التصفية</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Modal */}
      {showModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative">
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-4 left-4 z-10 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-2 transition-all"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>

              {/* Media Display */}
              <div className="relative">
                {selectedItem.type === 'image' && selectedItem.image_url && (
                  <img
                    src={selectedItem.image_url}
                    alt={selectedItem.title}
                    className="w-full max-h-96 object-contain bg-gray-100"
                  />
                )}

                {selectedItem.type === 'video' && selectedItem.video_url && (
                  <div className="aspect-video bg-black">
                    <iframe
                      src={getVideoEmbedUrl(selectedItem.video_url)}
                      className="w-full h-full"
                      allowFullScreen
                      title={selectedItem.title}
                    />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedItem.title}</h2>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">{selectedItem.category}</span>
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 ml-1" />
                        {new Date(selectedItem.created_at).toLocaleDateString('ar-EG')}
                      </span>
                      {selectedItem.client_name && (
                        <span className="flex items-center">
                          <Tag className="w-4 h-4 ml-1" />
                          {selectedItem.client_name}
                        </span>
                      )}
                    </div>
                  </div>

                  {selectedItem.is_featured && (
                    <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                      <Star className="w-4 h-4 ml-1" />
                      مميز
                    </span>
                  )}
                </div>

                {/* Description */}
                {selectedItem.description && (
                  <div className="mb-6">
                    <h3 className="font-bold text-gray-900 mb-2">الوصف</h3>
                    <p className="text-gray-700 leading-relaxed">{selectedItem.description}</p>
                  </div>
                )}

                {/* Tags */}
                {selectedItem.tags && selectedItem.tags.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-bold text-gray-900 mb-2">الكلمات المفتاحية</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedItem.tags.map((tag, index) => (
                        <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600">{selectedItem.views_count}</div>
                    <div className="text-sm text-gray-600">مشاهدة</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-red-600">{selectedItem.likes_count}</div>
                    <div className="text-sm text-gray-600">إعجاب</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600">{selectedItem.type === 'image' ? 'صورة' : 'فيديو'}</div>
                    <div className="text-sm text-gray-600">النوع</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-purple-600">{selectedItem.project_date ? new Date(selectedItem.project_date).getFullYear() : 'غير محدد'}</div>
                    <div className="text-sm text-gray-600">السنة</div>
                  </div>
                </div>

                {/* CTA */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-600">
                    أعجبك هذا العمل؟
                  </div>
                  <Link
                    href="/services"
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                  >
                    اطلب خدمة مشابهة
                    <ExternalLink className="w-4 h-4 mr-2" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
