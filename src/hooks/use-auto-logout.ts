'use client'

import { useEffect, useRef, useCallback } from 'react'
import { useAuthStore } from '@/store/auth-store'
import { AUTH_CONFIG } from '@/constants/auth'

interface UseAutoLogoutOptions {
  timeout: number // 자동 로그아웃까지의 시간 (밀리초)
  warningTime: number // 경고 표시 시간 (밀리초)
  onWarning: (remainingTime: number) => void // 경고 콜백
}

export function useAutoLogout({
  timeout,
  warningTime,
  onWarning
}: UseAutoLogoutOptions) {
  const { user, signOut } = useAuthStore()
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const warningTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastActivityRef = useRef<number>(Date.now())

  // 타이머 정리 함수
  const clearTimers = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current)
      warningTimeoutRef.current = null
    }
  }, [])

  // 활동 시간 업데이트
  const updateActivity = useCallback(() => {
    lastActivityRef.current = Date.now()
    if (typeof window !== 'undefined') {
      localStorage.setItem(AUTH_CONFIG.LAST_ACTIVITY_KEY, lastActivityRef.current.toString())
    }
  }, [])

  // 타이머 시작
  const startTimers = useCallback(() => {
    clearTimers()

    console.log('자동 로그아웃 타이머 시작:', {
      timeout: timeout / 1000 / 60, // 분 단위로 표시
      warningTime: warningTime / 1000 / 60, // 분 단위로 표시
      warningDelay: (timeout - warningTime) / 1000 / 60 // 분 단위로 표시
    });

    // 경고 타이머 설정 (로그아웃 전 경고 시간)
    const warningDelay = timeout - warningTime
    warningTimeoutRef.current = setTimeout(() => {
      console.log('자동 로그아웃 경고 표시');
      const remainingTime = warningTime
      onWarning(remainingTime)
    }, warningDelay)

    // 자동 로그아웃 타이머 설정
    timeoutRef.current = setTimeout(() => {
      console.log('자동 로그아웃 실행')
      signOut()
    }, timeout)
  }, [timeout, warningTime, onWarning, signOut, clearTimers])

  // 타이머 재시작
  const resetTimer = useCallback(() => {
    console.log('사용자 활동 감지 - 타이머 재시작');
    updateActivity()
    if (user) {
      startTimers()
    }
  }, [updateActivity, user, startTimers])

  // 사용자 활동 감지 이벤트 핸들러
  const handleActivity = useCallback(() => {
    console.log('활동 감지:', new Date().toLocaleTimeString());
    resetTimer()
  }, [resetTimer])

  // 컴포넌트 마운트 시 이벤트 리스너 등록
  useEffect(() => {
    console.log('useAutoLogout 훅 실행:', { user: !!user, userEmail: user?.email });
    
    if (!user) {
      console.log('사용자 로그인되지 않음 - 타이머 정리');
      clearTimers()
      return
    }

    console.log('로그인 상태 확인 - 자동 로그아웃 기능 활성화');
    
    // 초기 활동 시간 설정
    updateActivity()
    startTimers()

    // 활동 감지 이벤트 리스너 등록
    console.log('이벤트 리스너 등록:', AUTH_CONFIG.ACTIVITY_EVENTS);
    AUTH_CONFIG.ACTIVITY_EVENTS.forEach(event => {
      document.addEventListener(event, handleActivity, true)
    })

    // 페이지 포커스/블러 이벤트
    const handleFocus = () => {
      // 페이지가 포커스를 받으면 마지막 활동 시간 확인
      const lastActivity = localStorage.getItem(AUTH_CONFIG.LAST_ACTIVITY_KEY)
      if (lastActivity) {
        const timeSinceActivity = Date.now() - parseInt(lastActivity)
        if (timeSinceActivity >= timeout) {
          // 타임아웃을 초과했다면 로그아웃
          signOut()
          return
        }
      }
      resetTimer()
    }

    const handleBlur = () => {
      // 페이지가 블러되면 현재 시간을 저장
      updateActivity()
    }

    window.addEventListener('focus', handleFocus)
    window.addEventListener('blur', handleBlur)

    // cleanup
    return () => {
      clearTimers()
      
      AUTH_CONFIG.ACTIVITY_EVENTS.forEach(event => {
        document.removeEventListener(event, handleActivity, true)
      })
      
      window.removeEventListener('focus', handleFocus)
      window.removeEventListener('blur', handleBlur)
    }
  }, [user, handleActivity, resetTimer, updateActivity, startTimers, clearTimers, timeout, signOut])

  // 사용자 로그아웃 시 타이머 정리
  useEffect(() => {
    if (!user) {
      clearTimers()
    }
  }, [user, clearTimers])

  return {
    resetTimer
  }
} 