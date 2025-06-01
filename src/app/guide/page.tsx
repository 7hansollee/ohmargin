'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, Hand } from 'lucide-react';

export default function GuidePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* 헤더 */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              뒤로가기
            </button>
            <h1 className="text-2xl font-bold text-gray-800">사용법 가이드</h1>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* 인트로 섹션 */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            💡 Oh! 마진 사용법
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Oh! 마진의 두 가지 계산기를 활용하여 비즈니스 수익을 효율적으로 관리해보세요
          </p>
        </div>

        {/* 종합 활용법 */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white mb-16">
          <h3 className="text-2xl font-bold mb-4">🚀 Oh! 마진을 제대로 활용하는 방법</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-semibold mb-3">1단계: 상품 마진 저장하기</h4>
              <p className="text-blue-100">
                상품 마진 계산기로 판매처별 상품의 마진을 계산하고 저장하세요.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-3">2단계: 월수입 계산</h4>
              <p className="text-blue-100">
                1단계에서 계산한 상품별 마진에 판매수량을 입력, 이번 달 월수입을 계산하세요.
              </p>
            </div>
          </div>
        </div>

        {/* 계산기별 가이드 */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* 상품 마진 계산기 가이드 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-200/50">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-100 rounded-lg flex items-center justify-center w-12 h-12">
                <span className="text-4xl font-bold text-blue-600">☝🏻</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800">상품 마진 계산기</h3>
            </div>
            
            <div className="mb-6">
              <Image
                src="/images/hero3.png"
                alt="상품 마진 계산기 예시"
                width={400}
                height={300}
                className="rounded-lg border border-gray-200 shadow-sm"
              />
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-700 mb-3">📋 사용 방법</h4>
              <div className="space-y-3 text-gray-600">
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white text-sm rounded-full flex items-center justify-center">1</span>
                  <p>제품명부터 차례대로 입력한다.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white text-sm rounded-full flex items-center justify-center">2</span>
                  <p>이해가 안되는 항목은 항목명 옆에 ?에 마우스를 올려 놓는다.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white text-sm rounded-full flex items-center justify-center">3</span>
                  <p>계산이 필요할 경우 계산기를 사용한다.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white text-sm rounded-full flex items-center justify-center">4</span>
                  <p>모든 값을 입력하고 상품 저장하기 버튼을 누른다.</p>
                </div>
              </div>
            </div>

            <button 
              onClick={() => router.push('/calculator/margin')}
              className="w-full mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              상품 마진 계산하기
            </button>
          </div>

          {/* 월수입 계산기 가이드 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-200/50">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-green-100 rounded-lg flex items-center justify-center w-12 h-12">
                <span className="text-4xl font-bold text-green-600">✌🏻</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800">월수입 계산기</h3>
            </div>

            <div className="mb-6">
              <Image
                src="/images/hero4.png"
                alt="월수입 계산기 예시"
                width={400}
                height={300}
                className="rounded-lg border border-gray-200 shadow-sm"
              />
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-700 mb-3">📋 사용 방법</h4>
              <div className="space-y-3 text-gray-600">
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-green-500 text-white text-sm rounded-full flex items-center justify-center">1</span>
                  <p>각 판매처별 상품 판매 수량을 확인한다.</p>
                </div>
                
                {/* 판매처별 확인 경로 */}
                <div className="ml-9 space-y-2 text-sm">
                  <div className="p-3 bg-gray-50 rounded-lg border-l-4 border-blue-500">
                    <p className="font-medium text-gray-700 mb-1">📱 스마트스토어</p>
                    <p className="text-gray-600">통계 → 판매분석 → 상품/마케팅채널 → 상품카테고리차원(상품)</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg border-l-4 border-orange-500">
                    <p className="font-medium text-gray-700 mb-1">📦 쿠팡</p>
                    <p className="text-gray-600">쿠팡윙 → 비즈니스 인사이트 → 판매분석</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-green-500 text-white text-sm rounded-full flex items-center justify-center">2</span>
                  <p>확인한 판매 수량을 월수입 계산기 월 판매 수량에 입력한다.</p>
                </div>
              </div>
            </div>

            <button 
              onClick={() => router.push('/calculator/income')}
              className="w-full mt-6 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
            >
              월수입 계산하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 