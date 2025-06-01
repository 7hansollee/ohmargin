'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { createClient } from '@/lib/supabase/client';

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const supabase = createClient();
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message === 'Invalid login credentials'
          ? '이메일 또는 비밀번호가 올바르지 않습니다.'
          : signInError.message
        );
        return;
      }

      if (data.user || data.session) {
        toast({
          title: "로그인 성공",
          description: "성공적으로 로그인되었습니다.",
          variant: "default",
        });
        
        setTimeout(() => {
          router.push('/');
          router.refresh();
        }, 1000);
      } else {
        setError('로그인에 실패했습니다.');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleHomeRedirect = () => {
    setShowSuccessDialog(false);
    router.push('/');
    router.refresh();
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 로고 영역 */}
          <Link href="/" className="hidden md:flex items-center justify-center bg-primary-100 rounded-lg p-8 hover:bg-primary-200 transition-colors">
            <div className="text-center">
              <span className="text-6xl font-bold text-[#3182f6]">Oh! 마진</span>
              <p className="mt-4 text-xl text-gray-600">
                여러분의 성공적인 사업은<br />
                정확한 마진 계산에서 시작됩니다.
              </p>
            </div>
          </Link>

          {/* 로그인 폼 */}
          <div className="flex items-center justify-center p-8">
            <Card className="w-full max-w-sm">
              <CardHeader>
                <CardTitle className="text-4xl font-semibold text-center">
                  환영합니다!
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">이메일</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">비밀번호</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  {error && (
                    <p className="text-sm text-red-500 text-center">{error}</p>
                  )}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button 
                      type="submit" 
                      disabled={loading}
                      className="w-full bg-[#93c5fd] hover:bg-[#3182f6] transition-colors"
                    >
                      {loading ? '로그인 중...' : '로그인'}
                    </Button>
                  </motion.div>
                  <div className="text-sm text-center space-y-2">
                    <p>
                      계정이 없으신가요?{' '}
                      <Link href="/auth/signup" className="text-[#3182f6] hover:text-[#2563eb] hover:underline">
                        회원가입
                      </Link>
                    </p>
                    <p>
                      <Link href="/auth/forgot-password" className="text-[#3182f6] hover:text-[#2563eb] hover:underline">
                        비밀번호를 잊으셨나요?
                      </Link>
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="bg-white border border-gray-200 shadow-lg rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center text-gray-800">
              로그인 완료!
            </DialogTitle>
            <DialogDescription className="text-center mt-4">
              환영합니다! 성공적으로 로그인되었습니다.
            </DialogDescription>
          </DialogHeader>
          <div className="text-center mt-4">
            <Button
              onClick={handleHomeRedirect}
              className="w-full bg-[#93c5fd] hover:bg-[#3182f6] text-white transition-colors"
            >
              홈으로 이동
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
} 