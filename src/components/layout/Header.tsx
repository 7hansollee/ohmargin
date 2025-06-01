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
import { ChevronDown } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useState } from 'react';

export function Header() {
  const router = useRouter();
  const { user, signOut, loading } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [showMembershipDialog, setShowMembershipDialog] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center">
        {/* 로고와 계산기 메뉴 */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-[#3182f6]">Oh! 마진</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/calculator/margin"
              className="text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              상품 마진 계산기
            </Link>
            <Link
              href="/calculator/income"
              className="text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              월수입 계산기
            </Link>
          </div>
        </div>

        {/* 네비게이션 메뉴 */}
        <nav className="flex items-center gap-6 ml-auto">
          <button
            onClick={() => setShowMembershipDialog(true)}
            className="text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            멤버십
          </button>
          {user ? (
            <div className="flex items-center gap-4">
              <DropdownMenu onOpenChange={setIsOpen}>
                <DropdownMenuTrigger className="flex items-center gap-2 focus:outline-none">
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
                className="bg-[#3182f6] hover:bg-[#2563eb] text-white px-4 py-2 rounded-lg transition-colors"
              >
                로그인
              </button>
            </div>
          )}
        </nav>
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