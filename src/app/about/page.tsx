"use client";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <h1 className="text-4xl font-bold text-blue-700 mb-6">Oh! 마진 소개</h1>
      <p className="text-lg text-gray-700 max-w-xl text-center mb-8">
        Oh! 마진은 온라인 셀러를 위한 쉽고 빠른 마진/월수입 계산 서비스입니다.<br />
        누구나 직관적으로 사용할 수 있도록 설계되었으며, 정확한 계산과 데이터 관리를 지원합니다.<br />
        여러분의 성공적인 사업을 응원합니다!
      </p>
      <div className="text-sm text-gray-500">© {new Date().getFullYear()} Oh! 마진</div>
    </div>
  );
} 