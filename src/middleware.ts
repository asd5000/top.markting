import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // التحقق من الجلسة
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // إذا كان المستخدم يحاول الوصول لـ visitor-dashboard بدون جلسة
  if (req.nextUrl.pathname.startsWith('/visitor-dashboard') && !session) {
    return NextResponse.redirect(new URL('/customer-login', req.url))
  }

  // إذا كان المستخدم مسجل دخوله ويحاول الوصول لصفحة تسجيل الدخول
  if (req.nextUrl.pathname === '/customer-login' && session) {
    return NextResponse.redirect(new URL('/visitor-dashboard', req.url))
  }

  return res
}

export const config = {
  matcher: ['/visitor-dashboard/:path*', '/customer-login']
}
