"use client";

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <h1 className="text-4xl font-bold text-blue-700 mb-6">이용약관</h1>
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl w-full">
        <p className="text-gray-700 mb-4">
          본 서비스는 온라인 셀러를 위한 마진 및 월수입 계산을 지원합니다.<br />
          회원 가입 시 개인정보 보호 및 서비스 이용에 동의하게 됩니다.<br />
          자세한 약관 내용은 아래를 참고해 주세요.
        </p>
        <ul className="list-disc list-inside text-gray-600 space-y-2">
          <li>서비스 목적: 마진/월수입 계산 및 데이터 관리</li>
          <li>개인정보 보호: 회원 정보는 안전하게 관리됩니다.</li>
          <li>책임의 한계: 계산 결과는 참고용이며, 실제 사업 결과와 다를 수 있습니다.</li>
        </ul>
        <div className="text-xs text-gray-400 mt-8">최종 업데이트: {new Date().getFullYear()}년</div>
      </div>
    </div>
  );
} 