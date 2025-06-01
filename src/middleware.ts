import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // margin-calculator로 시작하는 경로를 calculator/margin으로 리다이렉트
  if (request.nextUrl.pathname.startsWith('/margin-calculator')) {
    return NextResponse.redirect(new URL('/calculator/margin', request.url))
  }
}

export const config = {
  matcher: '/margin-calculator/:path*',
} 