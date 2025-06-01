'use client'

import { useEffect, useRef, useCallback } from 'react'
import { useAuthStore } from '@/store/auth-store'

export function useSessionRefresh() {
  const { session, refreshSession, user } = useAuthStore()
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastActivityRef = useRef<number>(Date.now())

  // 사용자 활동 추적
  const updateActivity = useCallback(() => {
    lastActivityRef.current = Date.now()
  }, [])

  // 세션 만료 시간 계산 및 자동 갱신 스케줄링
  const scheduleRefresh = useCallback(() => {
    if (!session?.expires_at) return

    const expiresAt = new Date(session.expires_at * 1000)
    const now = new Date()
    const timeUntilExpiry = expiresAt.getTime() - now.getTime()
    
    // 만료 5분 전에 갱신
    const refreshTime = Math.max(timeUntilExpiry - 5 * 60 * 1000, 60 * 1000)

    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current)
    }

    refreshTimeoutRef.current = setTimeout(() => {
      // 최근 10분 이내에 활동이 있었다면 세션 갱신
      const timeSinceActivity = Date.now() - lastActivityRef.current
      if (timeSinceActivity < 10 * 60 * 1000) {
        console.log('자동 세션 갱신 시도')
        refreshSession()
      }
    }, refreshTime)

  }, [session, refreshSession])

  // 페이지 포커스 시 세션 확인
  useEffect(() => {
    const handleFocus = () => {
      updateActivity()
      if (user && session) {
        const now = Date.now()
        const expiresAt = session.expires_at ? new Date(session.expires_at * 1000).getTime() : 0
        
        // 세션이 만료되었거나 5분 이내에 만료될 예정이라면 갱신
        if (expiresAt - now < 5 * 60 * 1000) {
          refreshSession()
        }
      }
    }

    const handleActivity = () => {
      updateActivity()
    }

    window.addEventListener('focus', handleFocus)
    window.addEventListener('click', handleActivity)
    window.addEventListener('keydown', handleActivity)
    window.addEventListener('scroll', handleActivity)

    return () => {
      window.removeEventListener('focus', handleFocus)
      window.removeEventListener('click', handleActivity)
      window.removeEventListener('keydown', handleActivity)
      window.removeEventListener('scroll', handleActivity)
    }
  }, [user, session, refreshSession, updateActivity])

  // 세션 변경 시 갱신 스케줄 업데이트
  useEffect(() => {
    scheduleRefresh()
    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current)
      }
    }
  }, [scheduleRefresh])

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current)
      }
    }
  }, [])
} 