'use client';

import { useState, useEffect } from 'react';

export function useMobile() {
  const [isMobile, setIsMobile] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    // 컴포넌트가 마운트되었음을 표시
    setHasMounted(true);

    const checkMobile = () => {
      // 브라우저 환경에서만 실행
      if (typeof window === 'undefined') return false;
      
      // User Agent 기반 모바일 감지
      const userAgent = navigator.userAgent.toLowerCase();
      const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
      
      // 화면 크기 기반 모바일 감지 (768px 이하)
      const isSmallScreen = window.innerWidth <= 768;
      
      // 터치 지원 여부
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      // 모바일로 판단하는 조건
      const mobile = mobileRegex.test(userAgent) || (isSmallScreen && isTouchDevice);
      
      setIsMobile(mobile);
    };

    // 초기 체크
    checkMobile();

    // 화면 크기 변경 감지
    const handleResize = () => {
      checkMobile();
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // 마운트되기 전에는 항상 false 반환 (SSR 호환성)
  if (!hasMounted) {
    return false;
  }

  return isMobile;
} 