'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import {
  ShoppingCart,
  Plus,
  Minus,
  Star,
  Package,
  DollarSign,
  ArrowLeft,
  Filter,
  Search
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
}

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image_url?: string
  type: string
}

export default function StorePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [categories, setCategories] = useState<string[]>([])
  const [cartMessage, setCartMessage] = useState<string | null>(null)

  useEffect(() => {
    loadProducts()
    loadCart()
  }, [])

  useEffect(() => {
    filterProducts()
  }, [products, searchTerm, selectedCategory])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .gt('stock_quantity', 0)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error loading products:', error)
        return
      }

      const productList = data || []
      setProducts(productList)
      
      // استخراج الفئات الفريدة
      const uniqueCategories = [...new Set(productList.map(p => p.category).filter(Boolean))]
      setCategories(uniqueCategories)
    } catch (error) {
      console.error('Error loading products:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadCart = () => {
    try {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]')
      setCartItems(cart)
    } catch (error) {
      console.error('Error loading cart:', error)
      setCartItems([])
    }
  }

  const filterProducts = () => {
    let filtered = products

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedCategory) {
      filtered = filtered.filter(product => product.category === selectedCategory)
    }

    setFilteredProducts(filtered)
  }

  const addToCart = (product: Product) => {
    try {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]')
      const existingItem = cart.find((item: CartItem) => item.id === product.id)

      if (existingItem) {
        existingItem.quantity += 1
      } else {
        cart.push({
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          image_url: product.image_url,
          type: 'product'
        })
      }

      localStorage.setItem('cart', JSON.stringify(cart))
      setCartItems(cart)
      
      setCartMessage(`تم إضافة ${product.name} للسلة!`)
      setTimeout(() => setCartMessage(null), 3000)
    } catch (error) {
      console.error('Error adding to cart:', error)
    }
  }

  const getCartItemCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }

  const isInCart = (productId: string) => {
    return cartItems.some(item => item.id === productId)
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
              المتجر
            </h1>

            <Link
              href="/cart"
              className="relative bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <ShoppingCart className="w-5 h-5 ml-2" />
              السلة
              {getCartItemCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {getCartItemCount()}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Cart Message */}
      {cartMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          {cartMessage}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters */}
        <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="البحث في المنتجات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Filter className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">جميع الفئات</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">لا توجد منتجات</h3>
            <p className="text-gray-600">
              {searchTerm || selectedCategory 
                ? 'لم يتم العثور على منتجات تطابق البحث'
                : 'لا توجد منتجات متاحة حالياً'
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                {product.image_url && (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                )}
                
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                  
                  {product.category && (
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mb-3">
                      {product.category}
                    </span>
                  )}
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-green-600">
                      <DollarSign className="w-4 h-4 ml-1" />
                      <span className="font-bold text-lg">{product.price} ج.م</span>
                    </div>
                    <span className="text-sm text-gray-500">
                      متوفر: {product.stock_quantity}
                    </span>
                  </div>
                  
                  <button
                    onClick={() => addToCart(product)}
                    disabled={product.stock_quantity === 0}
                    className={`w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center transition-colors ${
                      isInCart(product.id)
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    } disabled:bg-gray-400 disabled:cursor-not-allowed`}
                  >
                    <ShoppingCart className="w-5 h-5 ml-2" />
                    {product.stock_quantity === 0 
                      ? 'غير متوفر'
                      : isInCart(product.id) 
                        ? 'في السلة' 
                        : 'أضف للسلة'
                    }
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
