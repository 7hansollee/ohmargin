'use client'

import { create } from 'zustand'
import { User, Session } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'

interface AuthState {
  user: User | null
  session: Session | null
  loading: boolean
  error: string | null
  initialized: boolean
}

interface AuthActions {
  setUser: (user: User | null) => void
  setSession: (session: Session | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  initialize: () => Promise<void>
  signOut: () => Promise<void>
  refreshSession: () => Promise<void>
  clearError: () => void
}

export const useAuthStore = create<AuthState & AuthActions>((set, get) => ({
  user: null,
  session: null,
  loading: true,
  error: null,
  initialized: false,

  setUser: (user) => set({ user }),
  setSession: (session) => set({ session, user: session?.user || null }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  initialize: async () => {
    if (get().initialized) return

    const supabase = createClient()
    set({ loading: true, error: null })

    try {
      // 현재 세션 가져오기
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError) {
        console.warn('세션 가져오기 실패:', sessionError.message)
        set({ session: null, user: null, error: sessionError.message })
      } else {
        set({ session, user: session?.user || null })
      }

      // 인증 상태 변경 리스너 등록
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          console.log('Auth state changed:', event, session?.user?.email)
          
          set({ session, user: session?.user || null, error: null })

          // 세션 만료나 토큰 갱신 실패 시 처리
          if (event === 'TOKEN_REFRESHED') {
            console.log('토큰이 갱신되었습니다')
          } else if (event === 'SIGNED_OUT') {
            console.log('사용자가 로그아웃되었습니다')
            set({ session: null, user: null, error: null })
          }
        }
      )

      // cleanup function 저장
      ;(window as any).__supabase_subscription__ = subscription

    } catch (error) {
      console.error('인증 초기화 실패:', error)
      set({ 
        error: error instanceof Error ? error.message : '인증 초기화에 실패했습니다',
        session: null,
        user: null 
      })
    } finally {
      set({ loading: false, initialized: true })
    }
  },

  signOut: async () => {
    const supabase = createClient()
    set({ loading: true, error: null })

    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      set({ user: null, session: null, error: null })
    } catch (error) {
      console.error('로그아웃 실패:', error)
      set({ 
        error: error instanceof Error ? error.message : '로그아웃에 실패했습니다' 
      })
    } finally {
      set({ loading: false })
    }
  },

  refreshSession: async () => {
    const supabase = createClient()
    const { session } = get()

    if (!session?.refresh_token) {
      set({ error: '갱신할 세션이 없습니다' })
      return
    }

    try {
      const { data, error } = await supabase.auth.refreshSession({
        refresh_token: session.refresh_token
      })

      if (error) throw error
      
      if (data.session) {
        set({ 
          session: data.session, 
          user: data.session.user, 
          error: null 
        })
        console.log('세션이 성공적으로 갱신되었습니다')
      }
    } catch (error) {
      console.error('세션 갱신 실패:', error)
      set({ 
        error: error instanceof Error ? error.message : '세션 갱신에 실패했습니다',
        session: null,
        user: null
      })
    }
  },
})) 