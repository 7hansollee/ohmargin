'use client';

import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-white text-neutral-900 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* 회사 정보 */}
          <div>
            <h3 className="text-xl font-bold mb-4">오마진</h3>
            <p className="text-neutral-600">
              온라인 셀러를 위한<br />
              쉽고, 빠른 월수입 계산
            </p>
          </div>

          {/* 빠른 링크 */}
          <div>
            <h4 className="text-lg font-semibold mb-4">바로가기</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-neutral-600 hover:text-neutral-900 transition-colors">
                  홈
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-neutral-600 hover:text-neutral-900 transition-colors">
                  소개
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-neutral-600 hover:text-neutral-900 transition-colors">
                  문의하기
                </Link>
              </li>
            </ul>
          </div>

          {/* 법적 정보 */}
          <div>
            <h4 className="text-lg font-semibold mb-4">법적 정보</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="text-neutral-600 hover:text-neutral-900 transition-colors">
                  이용약관
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-neutral-600 hover:text-neutral-900 transition-colors">
                  개인정보처리방침
                </Link>
              </li>
            </ul>
          </div>

          {/* 연락처 */}
          <div>
            <h4 className="text-lg font-semibold mb-4">연락처</h4>
            <ul className="space-y-2 text-neutral-600">
              <li>이메일: 7hansollee@naver.com</li>
              <li>주소: 경기도 구리시</li>
            </ul>
          </div>
        </div>
        {/* 저작권 */}
        <div className="border-t border-neutral-200 mt-8 pt-8 text-center text-neutral-600">
          <p>&copy; {new Date().getFullYear()} 오마진. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
} 