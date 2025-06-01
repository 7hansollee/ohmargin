'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/store/auth-store'
import { useAuthErrorHandler } from '@/hooks/use-auth-error-handler'
import { useSessionRefresh } from '@/hooks/use-session-refresh'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { initialize, initialized } = useAuthStore()
  
  // 에러 핸들링 훅 사용
  useAuthErrorHandler()
  
  // 세션 자동 갱신 훅 사용
  useSessionRefresh()

  useEffect(() => {
    // 인증 상태 초기화
    initialize()
    
    // 페이지 언로드 시 cleanup
    return () => {
      if ((window as any).__supabase_subscription__) {
        (window as any).__supabase_subscription__.unsubscribe()
      }
    }
  }, [initialize])

  return <>{children}</>
} 