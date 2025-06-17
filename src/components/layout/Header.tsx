'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Menu } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader } from '@/components/ui/sheet';

export function Header() {
  const router = useRouter();
  const { user, signOut, loading } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [showMembershipDialog, setShowMembershipDialog] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const checkMobile = () => {
    // 브라우저 환경 체크 강화
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
      return false;
    }
    
    try {
      // User Agent 기반 모바일 감지
      const userAgent = navigator.userAgent.toLowerCase();
      // 나머지 코드...
    } catch (error) {
      console.warn('모바일 감지 중 오류:', error);
      return false;
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b">
      <div className="max-w-7xl mx-auto px-4 h-14 md:h-16 flex items-center">
        {/* 좌측: 로고 */}
        <Link href="/" className="flex items-center h-14 md:h-16">
          <span className="text-2xl font-bold text-[#3182f6] leading-none flex items-center">Oh! 마진</span>
        </Link>
        {/* 네비게이션 메뉴 */}
        <nav className="flex items-center h-14 md:h-16 gap-8 ml-8">
          <button
            type="button"
            onClick={() => router.push('/calculator/margin')}
            className="h-full flex items-center text-neutral-600 hover:text-neutral-900 transition-colors text-lg font-medium leading-none py-0 px-0 border-0 bg-transparent appearance-none focus:outline-none"
            style={{ minHeight: '56px' }}
          >
            상품 마진 계산기
          </button>
          <button
            type="button"
            onClick={() => router.push('/calculator/income')}
            className="h-full flex items-center text-neutral-600 hover:text-neutral-900 transition-colors text-lg font-medium leading-none py-0 px-0 border-0 bg-transparent appearance-none focus:outline-none"
            style={{ minHeight: '56px' }}
          >
            월수입 계산기
          </button>
        </nav>
        {/* 우측: 유저 메뉴 등 (기존대로) */}
        <div className="hidden md:flex items-center gap-4 min-w-[320px] justify-end ml-auto">
          <nav className="flex items-center gap-6">
            {user ? (
              <div className="flex items-center gap-4">
                <DropdownMenu onOpenChange={setIsOpen}>
                  <DropdownMenuTrigger className="flex items-center gap-2 focus:outline-none h-14 md:h-16">
                    <span className="text-base font-medium text-[#3182f6]">
                      {user.user_metadata?.full_name ? `${user.user_metadata.full_name}님 환영합니다` : '환영합니다'}
                    </span>
                    <ChevronDown 
                      className={`h-4 w-4 text-[#3182f6] transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`} 
                    />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-white border shadow-md">
                    <div className="px-2 py-1.5 text-sm text-neutral-700 font-medium">
                      {user.email}
                    </div>
                    <DropdownMenuItem onClick={() => router.push('/profile')} className="cursor-pointer">
                      프로필
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                      로그아웃
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Avatar>
                  <AvatarImage src={user.user_metadata?.avatar_url || ''} />
                </Avatar>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <button
                  onClick={() => router.push('/auth/signin')}
                  className="h-14 md:h-16 flex items-center bg-[#3182f6] hover:bg-[#2563eb] text-white px-4 py-2 rounded-lg transition-colors"
                >
                  로그인
                </button>
              </div>
            )}
          </nav>
        </div>
        {/* 모바일 햄버거 메뉴 */}
        <div className="md:hidden flex items-center ml-auto">
          <button onClick={() => setMobileNavOpen(true)} className="p-2 rounded-md text-[#3182f6] focus:outline-none focus:ring-2 focus:ring-blue-200">
            <Menu className="w-7 h-7" />
            <span className="sr-only">메뉴 열기</span>
          </button>
        </div>
        {/* 모바일 드로어 네비게이션 */}
        <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
          <SheetContent side="right" className="p-0 w-64">
            <SheetHeader className="p-4 border-b">
              <span className="text-xl font-bold text-[#3182f6]">Oh! 마진</span>
            </SheetHeader>
            <nav className="flex flex-col gap-2 p-4">
              <Link href="/calculator/margin" className="py-3 px-2 text-base text-neutral-700 hover:bg-blue-50 rounded-lg" onClick={() => setMobileNavOpen(false)}>상품 마진 계산기</Link>
              <Link href="/calculator/income" className="py-3 px-2 text-base text-neutral-700 hover:bg-blue-50 rounded-lg" onClick={() => setMobileNavOpen(false)}>월수입 계산기</Link>
              <button onClick={() => { setShowMembershipDialog(true); setMobileNavOpen(false); }} className="py-3 px-2 text-base text-neutral-700 hover:bg-blue-50 rounded-lg text-left">멤버십</button>
              {/* 로그인/유저 메뉴 */}
              {user ? (
                <>
                  <Link href="/profile" className="py-3 px-2 text-base text-neutral-700 hover:bg-blue-50 rounded-lg" onClick={() => setMobileNavOpen(false)}>프로필</Link>
                  <button onClick={() => { handleSignOut(); setMobileNavOpen(false); }} className="py-3 px-2 text-base text-neutral-700 hover:bg-blue-50 rounded-lg text-left">로그아웃</button>
                </>
              ) : (
                <button onClick={() => { router.push('/auth/signin'); setMobileNavOpen(false); }} className="py-3 px-2 text-base text-[#3182f6] font-semibold hover:bg-blue-50 rounded-lg text-left">로그인</button>
              )}
            </nav>
          </SheetContent>
        </Sheet>
      </div>

      <Dialog open={showMembershipDialog} onOpenChange={setShowMembershipDialog}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle className="text-[#3182f6]">서비스 준비중</DialogTitle>
          </DialogHeader>
          <p className="text-center py-4 text-neutral-600">멤버십 서비스는 현재 준비중입니다. 조금만 기다려주세요!</p>
        </DialogContent>
      </Dialog>
    </header>
  );
} 