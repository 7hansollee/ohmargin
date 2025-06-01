/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          500: '#8B5CF6', // 주요 액션 버튼, 강조 텍스트
          600: '#7C3AED', // 버튼 호버·포커스
        },
        secondary: {
          500: '#374151', // 헤더·본문 기본 텍스트
          600: '#1F2937', // 차트 라벨, 강조 아이콘
        },
        accent: {
          500: '#EC4899', // 보조 CTA, 링크 호버
          600: '#DB2777', // 보조 CTA 호버
        },
        neutral: {
          50: '#F9FAFB',  // 배경
          100: '#F3F4F6', // 카드·섹션 배경
          200: '#E5E7EB', // 구분선·보더
          700: '#374151', // 본문 텍스트
          900: '#111827', // 헤더 텍스트
        },
      },
    },
  },
  plugins: [],
} 