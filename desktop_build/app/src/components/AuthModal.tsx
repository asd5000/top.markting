'use client'

import { useState } from 'react'
import Link from 'next/link'
import { X, User, Lock, AlertCircle } from 'lucide-react'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  message?: string
}

export default function AuthModal({ isOpen, onClose, message }: AuthModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" dir="rtl">
      <div className="bg-white rounded-lg w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 flex items-center">
            <AlertCircle className="w-6 h-6 text-orange-500 ml-2" />
            تسجيل الدخول مطلوب
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-blue-600" />
            </div>
            <p className="text-gray-700 text-lg">
              {message || 'يجب تسجيل الدخول أولاً لإتمام الطلب.'}
            </p>
          </div>

          <div className="space-y-3">
            <Link
              href="/visitor-login"
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center"
              onClick={onClose}
            >
              <Lock className="w-5 h-5 ml-2" />
              تسجيل الدخول
            </Link>

            <Link
              href="/register"
              className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center justify-center"
              onClick={onClose}
            >
              <User className="w-5 h-5 ml-2" />
              إنشاء حساب جديد
            </Link>

            <button
              onClick={onClose}
              className="w-full text-gray-500 py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors"
            >
              إلغاء
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
