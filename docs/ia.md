1. 사이트맵

/
├── 로그인 (/login)*
├── 회원가입 (/signup)*
├── 대시보드 (/dashboard)
│   ├── 요약 지표
│   ├── 최근 계산 내역
│   └── 빠른 이동 버튼
├── 마진 계산기 (/calculator/margin)
│   ├── 입력 폼
│   └── 결과 뷰
├── 월수입 계산기 (/calculator/income)
│   ├── 입력 폼
│   └── 결과 뷰
├── 이력 비교 (/history)
│   ├── 필터(기간 선택)
│   └── 비교 차트
├── 프로필 설정 (/profile)
│   ├── 개인정보 수정
│   └── 비밀번호 변경
└── 공통  
    ├── 도움말 (/help)  
    ├── 이용약관 (/terms)  
    └── 개인정보처리방침 (/privacy)  

* 인증 전용 페이지(로그인·회원가입). 모든 주요 기능은 로그인 후 접근 가능

⸻

2. 유저 플로우
	1.	접근 & 인증
	•	방문 → 로그인 페이지(/login) → 이메일·비밀번호 입력 → 대시보드로 리디렉션
	•	(신규) 회원가입 → 가입 완료 → 자동 로그인 → 대시보드로 리디렉션
	2.	월수입 파악
	•	대시보드 → 상단 네비게이션 “월수입 계산기” 클릭 → 입력 폼에 플랫폼·상품·수량 입력 → ‘계산’ → 결과 확인
	3.	상품별 마진 확인
	•	네비게이션 “마진 계산기” 클릭 → 매입가·판매가·배송비·수수료 입력 → ‘계산’ → 정산금·마진율 확인 → 저장
	4.	이력 비교
	•	네비게이션 “이력 비교” 클릭 → 기간 필터 설정 → 지난달 대비 차트 확인
	5.	개인정보 관리
	•	네비게이션 우측 프로필 메뉴 → “프로필 설정” 클릭 → 정보 수정 → 저장

⸻

3. 네비게이션 구조
	•	Topbar 고정
	•	로고 (왼쪽) → 클릭 시 대시보드
	•	주요 메뉴 (가운데):
	•	대시보드
	•	마진 계산기
	•	월수입 계산기
	•	이력 비교
	•	유저 액션 (오른쪽):
	•	프로필 아이콘 → 드롭다운 (프로필 설정, 로그아웃)
	•	반응형
	•	모바일(<768px): 햄버거 메뉴로 주요 메뉴 숨김 → 클릭 시 슬라이드아웃

⸻

4. 페이지 계층
	1.	Root
	•	(/login, /signup)
	2.	인증 후 메인 영역
	•	/dashboard
	•	SummaryCard, Chart, QuickLink
	•	/calculator
	•	/calculator/margin
	•	/calculator/income
	•	/history
	•	/profile
	3.	공통 정보 페이지
	•	/help, /terms, /privacy

⸻

5. 콘텐츠 구성

페이지	주요 콘텐츠
대시보드	- 전체 월수입 요약- 최근 마진·수입 계산 내역- 빠른 이동 버튼
마진 계산기	- 입력 폼(매입가·판매가·배송비·수수료)- 실시간 계산 결과 카드
월수입 계산기	- 입력 폼(플랫폼, 상품, 판매수량)- 결과 요약 및 차트
이력 비교	- 기간 선택 필터- 과거 대비 수익 증감 차트
프로필 설정	- 프로필 정보 폼- 비밀번호 변경 폼
도움말·이용약관·개인정보	- 텍스트 콘텐츠, 목차 내비게이션



⸻

6. 인터랙션 패턴
	•	실시간 검증
	•	입력값 범위(숫자, 음수 비허용) 즉시 피드백
	•	즉각 계산 & 시각화
	•	‘계산’ 클릭 없이 입력 시 자동 업데이트(딜레이 500ms)
	•	상태 표시
	•	로딩 스피너, 성공·오류 토스트 알림
	•	모달 & 드롭다운
	•	프로필 메뉴, 도움말 목차 등
	•	반응형 레이아웃
	•	모바일: 단일 컬럼, 접이식 폼
	•	태블릿 이상: 2~3 컬럼 그리드

⸻

7. URL 구조

페이지	URL	SEO 포인트
로그인	/login	title: “로그인 – 월수입 마스터”
회원가입	/signup	title: “회원가입 – 월수입 마스터”
대시보드	/dashboard	meta description: “월수입 요약 대시보드”
마진 계산기	/calculator/margin	h1: “상품별 마진 계산기”
월수입 계산기	/calculator/income	h1: “플랫폼별 월수입 계산기”
이력 비교	/history	h1: “수익 이력 비교”
프로필 설정	/profile	h1: “프로필 설정”
도움말	/help	structured data: FAQPage



⸻

8. 컴포넌트 계층

App
├─ Topbar
│   ├─ Logo
│   ├─ NavMenu
│   │   ├─ NavItem (대시보드)
│   │   ├─ NavItem (마진 계산기)
│   │   └─ …
│   └─ UserMenu
│       ├─ ProfileLink
│       └─ LogoutButton
├─ RouterOutlet
│   ├─ DashboardPage
│   │   ├─ SummaryCardList
│   │   └─ RecentHistoryList
│   ├─ MarginCalculatorPage
│   │   ├─ MarginForm
│   │   └─ ResultCard
│   ├─ IncomeCalculatorPage
│   │   ├─ IncomeForm
│   │   └─ IncomeChart
│   ├─ HistoryPage
│   │   ├─ DateFilter
│   │   └─ ComparisonChart
│   └─ ProfilePage
│       ├─ ProfileForm
│       └─ PasswordForm
└─ Footer (도움말·약관 링크)

접근성 & SEO 고려
	•	모든 폼 필드에 <label> 연결, ARIA 속성 적용
	•	의미론적 HTML(h1~h3, nav, main, footer) 사용
	•	모바일·태블릿·데스크탑 반응형 대응(Breakpoints: 320, 768, 1024, 1440px)