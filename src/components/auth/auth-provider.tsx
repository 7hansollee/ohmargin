'use client';

import { createBrowserClient } from '@supabase/ssr';
import { useEffect, useState } from 'react';
import { useAutoLogout } from '@/hooks/use-auto-logout';
import { AutoLogoutWarning } from './auto-logout-warning';
import { useAuthStore } from '@/store/auth-store';
import { AUTH_CONFIG } from '@/constants/auth';
import { useAuthErrorHandler } from '@/hooks/use-auth-error-handler';
import { useSessionRefresh } from '@/hooks/use-session-refresh';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { signOut, initialize, initialized } = useAuthStore();
  const [showWarning, setShowWarning] = useState(false);
  const [warningTime, setWarningTime] = useState(0);

  // 기존 기능들 통합
  useAuthErrorHandler(); // 에러 핸들링
  useSessionRefresh(); // 세션 자동 갱신

  // 자동 로그아웃 훅 사용 (AUTH_CONFIG 사용)
  const { resetTimer } = useAutoLogout({
    timeout: AUTH_CONFIG.AUTO_LOGOUT_TIMEOUT,
    warningTime: AUTH_CONFIG.WARNING_TIME,
    onWarning: (remainingTime) => {
      setWarningTime(remainingTime);
      setShowWarning(true);
    }
  });

  // 인증 상태 초기화
  useEffect(() => {
    initialize();
    
    // 페이지 언로드 시 cleanup
    return () => {
      if ((window as any).__supabase_subscription__) {
        (window as any).__supabase_subscription__.unsubscribe();
      }
    };
  }, [initialize]);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        console.log('User signed in:', session?.user);
        setShowWarning(false); // 경고 닫기
      } else if (event === 'SIGNED_OUT') {
        console.log('User signed out');
        setShowWarning(false); // 경고 닫기
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleExtendSession = () => {
    setShowWarning(false);
    resetTimer(); // 타이머 재시작
  };

  const handleLogout = () => {
    setShowWarning(false);
    signOut();
  };

  return (
    <>
      {children}
      <AutoLogoutWarning
        isOpen={showWarning}
        remainingTime={warningTime}
        onExtendSession={handleExtendSession}
        onLogout={handleLogout}
      />
    </>
  );
} 