'use client'

import Image from 'next/image'

export default function HeroSection() {
  return (
    <section className="relative flex flex-col items-center justify-center min-h-[700px] w-full overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* 배경 계산기 이미지 */}
      <div className="absolute inset-0 flex justify-center items-center">
        <div className="relative transform rotate-1 scale-110">
          <Image
            src="/images/hero1.png"
            alt="상품 마진 계산기 UI"
            width={800}
            height={600}
            className="opacity-50 blur-[1px] drop-shadow-2xl rounded-2xl"
            priority
          />
          {/* 다중 그라데이션 오버레이 */}
          <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/40 to-white/10 rounded-2xl" />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/15 via-transparent to-indigo-500/15 rounded-2xl" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-100/30 to-white/70 rounded-2xl" />
        </div>
      </div>

      {/* 장식적 배경 요소들 */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-blue-400/30 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-32 right-12 w-24 h-24 bg-indigo-400/30 rounded-full blur-xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-slate-400/20 rounded-full blur-lg"></div>
      <div className="absolute top-1/3 right-1/3 w-18 h-18 bg-purple-300/25 rounded-full blur-lg"></div>

      {/* 메인 텍스트 콘텐츠 */}
      <div className="relative z-20 text-center space-y-8 px-6 max-w-4xl mx-auto">
        <div className="space-y-6">
          <div className="inline-block">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent drop-shadow-lg leading-tight">
              상품 마진 계산기
            </h1>
            {/* 언더라인 장식 */}
            <div className="flex justify-center mt-4">
              <div className="w-32 h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 rounded-full shadow-lg"></div>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <p className="text-xl md:text-2xl lg:text-3xl text-gray-800 font-semibold leading-relaxed drop-shadow-sm">
            쉽고 빠르게 <span className="text-blue-600 font-bold bg-blue-50/90 px-3 py-1 rounded-lg shadow-sm">마진율을 계산</span>하고
          </p>
          <p className="text-lg md:text-xl text-gray-700 font-medium drop-shadow-sm">
            수익성을 한눈에 확인하세요
          </p>
        </div>

        {/* CTA 버튼들 */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
          <button className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1">
            <span className="flex items-center justify-center gap-2">
              계산 시작하기
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </button>
          <button className="px-8 py-4 border-2 border-gray-300 hover:border-blue-400 text-gray-700 hover:text-blue-600 font-semibold rounded-xl backdrop-blur-sm bg-white/80 hover:bg-white/95 transition-all duration-300 shadow-md hover:shadow-lg">
            사용법 보기
          </button>
        </div>

        {/* 특징 포인트 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 text-sm">
          <div className="flex items-center justify-center gap-2 text-gray-700 bg-white/80 backdrop-blur-sm rounded-lg p-3 shadow-sm border border-white/50">
            <div className="w-2 h-2 bg-green-500 rounded-full shadow-sm"></div>
            <span className="font-medium">실시간 계산</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-gray-700 bg-white/80 backdrop-blur-sm rounded-lg p-3 shadow-sm border border-white/50">
            <div className="w-2 h-2 bg-blue-500 rounded-full shadow-sm"></div>
            <span className="font-medium">직관적 인터페이스</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-gray-700 bg-white/80 backdrop-blur-sm rounded-lg p-3 shadow-sm border border-white/50">
            <div className="w-2 h-2 bg-purple-500 rounded-full shadow-sm"></div>
            <span className="font-medium">정확한 분석</span>
          </div>
        </div>
      </div>
    </section>
  )
} 