UI/UX 디자인 가이드

1. 디자인 시스템 개요
	•	타이포그래피
	•	폰트 패밀리: Inter, sans-serif
	•	헤더
	•	H1: text-4xl (36px, leading-tight)
	•	H2: text-3xl (30px, leading-snug)
	•	H3: text-2xl (24px, leading-snug)
	•	본문
	•	본문(B1): text-base (16px, leading-relaxed)
	•	작은 텍스트(B2): text-sm (14px, leading-relaxed)
	•	간격(Spacing)
	•	Tailwind 표준 4단위(4px) 사용:
	•	마진·패딩 m-4(16px), p-6(24px), 주요 섹션 py-12 등
	•	그리드 시스템
	•	12컬럼 그리드 (Desktop)
	•	모바일: 1컬럼, 태블릿: 2컬럼, 데스크탑: 4컬럼
	•	아이콘
	•	heroicons 또는 lucide-react 사용 (24×24, 32×32 크기)
	•	일관성
	•	버튼·인풋·카드 컴포넌트는 모두 동일한 라운드(rounded-lg)와 그림자(shadow-sm) 사용

⸻

2. Color Palette for TailwindCSS

아이템스카우트의 보라색 액센트를 기반으로, 신뢰감 있는 톤을 유지합니다  ￼

구분	Tailwind 키	색상 코드	설명
Primary	primary-500	#8B5CF6	주요 액션 버튼, 강조 텍스트
	primary-600	#7C3AED	버튼 호버·포커스
Secondary	secondary-500	#374151	헤더·본문 기본 텍스트
	secondary-600	#1F2937	차트 라벨, 강조 아이콘
Accent	accent-500	#EC4899	보조 CTA, 링크 호버
	accent-600	#DB2777	보조 CTA 호버
Neutral	neutral-50	#F9FAFB	배경
	neutral-100	#F3F4F6	카드·섹션 배경
	neutral-200	#E5E7EB	구분선·보더
	neutral-700	#374151	본문 텍스트
	neutral-900	#111827	헤더 텍스트

// tailwind.config.js (예시)
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {500: '#8B5CF6', 600: '#7C3AED'},
        secondary: {500: '#374151', 600: '#1F2937'},
        accent: {500: '#EC4899', 600: '#DB2777'},
        neutral: {
          50: '#F9FAFB', 100: '#F3F4F6', 200: '#E5E7EB',
          700: '#374151', 900: '#111827'
        },
      }
    }
  }
}



⸻

3. 페이지 구현 가이드

3.1 루트(/) – 로그인 페이지
	•	핵심 목적: 인증 유도 및 사용자 환영
	•	주요 컴포넌트:
	•	일러스트 영역 (좌측)
	•	로그인 폼 (우측)
	•	회원가입 링크
	•	비밀번호 찾기 링크
	•	레이아웃 구조:
	•	2컬럼 그리드 (데스크탑: grid-cols-2, 모바일: grid-cols-1)
	•	좌측: min-h-screen bg-primary-100 flex items-center justify-center
	•	<img src="https://picsum.photos/id/1005/600/800" alt="로그인 일러스트" class="w-full object-cover">
	•	우측: p-8 flex flex-col justify-center
	•	<h1 class="text-4xl font-semibold mb-6">환영합니다!</h1>
	•	<form>
	•	<label>이메일</label><input type="email" ...>
	•	<label>비밀번호</label><input type="password" ...>
	•	<button class="bg-primary-500 hover:bg-primary-600 text-white rounded-lg px-6 py-3">로그인</button>
	•	<div class="mt-4 text-sm text-neutral-700">계정이 없으신가요? <a href="/signup" class="text-accent-500">회원가입</a></div>

⸻

3.2 대시보드(/dashboard)
	•	핵심 목적: 종합 수익 현황 및 빠른 이동
	•	주요 컴포넌트:
	•	Topbar (로고, 네비게이션, 프로필 메뉴)
	•	Summary Card (월수입, 평균 마진, 전체 판매량)
	•	차트 섹션 (월별 수익 추이)
	•	Quick Link 버튼
	•	레이아웃 구조:
	•	px-6 py-8 컨테이너
	•	Summary: grid grid-cols-1 md:grid-cols-3 gap-6 mb-8
	•	차트: bg-white p-6 rounded-lg shadow-sm mb-8
	•	<img src="https://picsum.photos/800/300" alt="수익 차트">
	•	Quick Links: flex flex-wrap gap-4

⸻

3.3 상품별 마진 계산기(/calculator/margin)
	•	핵심 목적: 상품 단위 마진 및 이익 계산
	•	주요 컴포넌트:
	•	입력 폼(매입가, 판매가, 배송비, 수수료(%))
	•	결과 카드(정산금, 마진율)
	•	저장 버튼
	•	레이아웃 구조:
	•	grid grid-cols-1 lg:grid-cols-2 gap-8
	•	좌측 폼: space-y-4 bg-white p-6 rounded-lg shadow-sm
	•	우측 결과: bg-primary-50 p-6 rounded-lg

⸻

3.4 월수입 계산기(/calculator/income)
	•	핵심 목적: 플랫폼별 월수입 종합 계산
	•	주요 컴포넌트:
	•	동적 입력 행(플랫폼 드롭다운, 상품명, 판매수량)
	•	결과 요약 카드(플랫폼별, 전체 합계)
	•	저장 버튼
	•	레이아웃 구조:
	•	space-y-6
	•	입력 영역: bg-white p-6 rounded-lg shadow-sm space-y-4
	•	결과 영역: bg-white p-6 rounded-lg shadow-sm

⸻

3.5 이력 비교(/history)
	•	핵심 목적: 기간별 수익 변화 비교
	•	주요 컴포넌트:
	•	기간 선택(Date Picker)
	•	비교 차트
	•	레코드 테이블
	•	레이아웃 구조:
	•	필터 바: flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0
	•	차트: bg-white p-6 rounded-lg shadow-sm mb-8
	•	테이블: overflow-x-auto bg-white rounded-lg shadow-sm

⸻

3.6 프로필 설정(/profile)
	•	핵심 목적: 계정 정보 관리
	•	주요 컴포넌트:
	•	프로필 폼(이름, 이메일)
	•	비밀번호 변경 폼
	•	저장 버튼
	•	레이아웃 구조:
	•	max-w-xl mx-auto space-y-6 p-6 bg-white rounded-lg shadow-sm

⸻

4. 레이아웃 컴포넌트

컴포넌트	적용 경로	핵심 구성요소	반응형 동작
Topbar	/dashboard, /calculator/*, /history, /profile	로고, 네비게이션 링크, 프로필 드롭다운	모바일: 햄버거 메뉴로 축소
Footer	/login, /signup	저작권, 약관 링크	항상 하단 고정(모바일 2행)
Sidebar (선택)	(모바일 네비게이션)	네비게이션 링크	슬라이드인/아웃 애니메이션



⸻

5. Interaction Patterns
	•	버튼
	•	기본: bg-primary-500 hover:bg-primary-600 focus:ring-2 focus:ring-primary-300
	•	보조: border border-accent-500 hover:bg-accent-50
	•	인풋
	•	border border-neutral-200 focus:border-primary-500 focus:ring-1 focus:ring-primary-300 rounded-lg
	•	토스트 알림
	•	성공: bg-green-500 text-white
	•	오류: bg-red-500 text-white
	•	차트 툴팁
	•	마우스 오버 시 세부 데이터 표시

⸻

6. Breakpoints

$breakpoints: (
  'mobile': 320px,
  'tablet': 768px,
  'desktop': 1024px,
  'wide': 1440px
);

	•	모바일: 단일 컬럼, 대화형 요소 풀스크린
	•	태블릿: 2컬럼 레이아웃
	•	데스크탑: 3~4컬럼 활용
	•	와이드: 콘텐츠 최대 폭 제한(예: max-w-7xl mx-auto)

⸻