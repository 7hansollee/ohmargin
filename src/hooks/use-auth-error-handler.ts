'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/store/auth-store'
import { useToast } from '@/components/ui/use-toast'
import { useRouter } from 'next/navigation'

export function useAuthErrorHandler() {
  const { error, clearError, refreshSession } = useAuthStore()
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    if (!error) return

    // 토큰 갱신 관련 에러 처리
    if (error.includes('refresh') || error.includes('token')) {
      toast({
        title: "세션 만료",
        description: "세션을 갱신하려고 시도합니다.",
        variant: "default",
      })
      
      // 자동 세션 갱신 시도
      refreshSession()
      clearError()
      return
    }

    // 네트워크 에러 처리
    if (error.includes('fetch') || error.includes('network')) {
      toast({
        title: "연결 오류",
        description: "네트워크 연결을 확인해주세요. 잠시 후 다시 시도됩니다.",
        variant: "destructive",
      })
      
      // 3초 후 자동 재시도
      setTimeout(() => {
        refreshSession()
        clearError()
      }, 3000)
      return
    }

    // 권한 관련 에러 처리
    if (error.includes('unauthorized') || error.includes('permission')) {
      toast({
        title: "인증 필요",
        description: "로그인이 필요합니다.",
        variant: "destructive",
      })
      
      setTimeout(() => {
        router.push('/auth/signin')
        clearError()
      }, 2000)
      return
    }

    // 일반적인 에러 처리
    toast({
      title: "오류 발생",
      description: error,
      variant: "destructive",
    })

    // 5초 후 에러 메시지 자동 제거
    setTimeout(() => {
      clearError()
    }, 5000)

  }, [error, clearError, refreshSession, toast, router])
} 