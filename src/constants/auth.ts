export const AUTH_CONFIG = {
  // 자동 로그아웃 시간 (밀리초)
  AUTO_LOGOUT_TIMEOUT: 15 * 60 * 1000, // 15분
  
  // 경고 표시 시간 (로그아웃 몇 분 전에 경고할지)
  WARNING_TIME: 5 * 60 * 1000, // 5분
  
  // 감지할 사용자 활동 이벤트
  ACTIVITY_EVENTS: [
    'mousedown',
    'keypress',
    'scroll',
    'touchstart',
    'click'
  ],
  
  // 로컬 스토리지 키
  LAST_ACTIVITY_KEY: 'lastActivity'
} as const 