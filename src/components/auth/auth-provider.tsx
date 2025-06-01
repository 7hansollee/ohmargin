'use client';

import { createBrowserClient } from '@supabase/ssr';
import { useEffect } from 'react';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        // 세션 상태 업데이트
        console.log('User signed in:', session?.user);
      } else if (event === 'SIGNED_OUT') {
        // 세션 상태 업데이트
        console.log('User signed out');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return <>{children}</>;
} 