'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';

export function HeroSection() {
  const router = useRouter();

  return (
    <section className="relative flex flex-col items-center justify-center pt-14 md:pt-32 min-h-[600px] md:min-h-[900px] w-full overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 md:items-start md:justify-start">
      {/* 배경 계산기 이미지들 - 포개진 레이어 */}
      <div className="absolute inset-0 flex justify-center items-center pr-0 md:justify-end md:pr-16 translate-y-4">
        {/* 첫 번째 이미지 - 뒷배경 (hero3.png - 월수입 계산기) */}
        <div className="relative transform rotate-3 scale-100">
          <div className="relative">
            <Image
              src="/images/hero3.png"
              alt="월수입 계산기 UI"
              width={700}
              height={500}
              className="opacity-60 blur-[0.5px] drop-shadow-2xl rounded-2xl"
              priority
            />
            {/* 첫 번째 이미지 오버레이 */}
            <div className="absolute inset-0 bg-gradient-to-t from-white/60 via-white/20 to-white/5 rounded-2xl" />
          </div>
        </div>

        {/* 두 번째 이미지 - 앞배경 (hero4.png - 상품 마진 계산기) */}
        <div className="absolute transform -rotate-2 scale-125 -translate-x-0 translate-y-12 md:-translate-x-40">
          <div className="relative">
            <Image
              src="/images/hero4.png"
              alt="상품 마진 계산기 UI"
              width={650}
              height={480}
              className="opacity-100 drop-shadow-3xl rounded-2xl border-2 border-white/30"
              priority
            />
            {/* 두 번째 이미지 오버레이 */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-indigo-500/10 rounded-2xl" />
            <div className="absolute inset-0 bg-gradient-to-t from-white/40 via-white/10 to-transparent rounded-2xl" />
          </div>
        </div>

        {/* 전체 오버레이 */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-100/15 to-white/50" />
      </div>

      {/* 장식적 배경 요소들 */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-blue-400/30 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-32 right-12 w-24 h-24 bg-indigo-400/30 rounded-full blur-xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-slate-400/20 rounded-full blur-lg"></div>
      <div className="absolute top-1/3 right-1/3 w-18 h-18 bg-purple-300/25 rounded-full blur-lg"></div>

      {/* 메인 텍스트 콘텐츠 */}
      <div className="relative z-20 text-center space-y-4 md:space-y-6 px-4 max-w-3xl mt-4 md:mt-8 md:text-left md:px-6 md:pl-32 md:ml-6 md:mt-16">
        <div className="space-y-4 md:space-y-6">
          <div className="inline-block">
            <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-[#3182f6] drop-shadow-lg leading-normal">
              더 이상 번거롭게<br />쇼핑몰 월수입 계산 🙅🏻
            </h1>
          </div>
        </div>
        
        <div className="space-y-2 md:space-y-3">
          <p className="text-lg md:text-xl lg:text-2xl xl:text-3xl text-gray-800 font-semibold leading-normal drop-shadow-sm">
            Oh! 마진으로 쉽고 빠르게
          </p>
          <p className="text-base md:text-lg lg:text-xl text-gray-700 font-medium leading-snug drop-shadow-sm">
            마진/월수입 확인하세요
          </p>
        </div>

        {/* CTA 버튼들 */}
        <div className="flex flex-col items-center sm:flex-row gap-4 mt-6 md:mt-8 md:items-start">
          <button 
            onClick={() => router.push('/calculator/margin')}
            className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
          >
            <span className="flex items-center justify-center gap-2">
              계산 시작하기
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </button>
          <button 
            onClick={() => router.push('/guide')}
            className="px-8 py-4 border-2 border-gray-300 hover:border-blue-400 text-gray-700 hover:text-blue-600 font-semibold rounded-xl backdrop-blur-sm bg-white/80 hover:bg-white/95 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            사용법 보기
          </button>
        </div>
      </div>
    </section>
  );
} 