import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  // تعطيل الـ middleware مؤقتاً لحل مشكلة التوجيه
  return NextResponse.next()
}

export const config = {
  matcher: ['/visitor-dashboard/:path*', '/customer-login']
}
