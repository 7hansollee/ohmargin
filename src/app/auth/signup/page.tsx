'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

export default function SignUp() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const [passwordMatch, setPasswordMatch] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [isPasswordFocused, setIsPasswordFocused] = useState(false)

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value
    setPassword(newPassword)

    if (confirmPassword) {
      if (newPassword !== confirmPassword) {
        setPasswordError('비밀번호가 일치하지 않습니다.')
        setPasswordMatch(false)
      } else {
        setPasswordError('')
        setPasswordMatch(true)
      }
    }
  }

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newConfirmPassword = e.target.value
    setConfirmPassword(newConfirmPassword)
    if (password) {
      if (newConfirmPassword !== password) {
        setPasswordError('비밀번호가 일치하지 않습니다.')
        setPasswordMatch(false)
      } else {
        setPasswordError('')
        setPasswordMatch(true)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    if (password !== confirmPassword) {
      setPasswordError('비밀번호가 일치하지 않습니다.')
      setLoading(false)
      return
    }

    try {
      const supabase = createClient()

      // 1. 회원가입
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          }
        },
      })

      if (signUpError) {
        if (signUpError.message === 'User already registered') {
          setError('이미 등록된 이메일입니다.')
          setLoading(false)
          return
        }
        setError(signUpError.message)
        setLoading(false)
        return
      }

      if (!signUpData.user) {
        throw new Error('회원가입에 실패했습니다.')
      }

      // 2. 자동 로그인
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) throw signInError

      if (!signInData.session) {
        throw new Error('로그인에 실패했습니다.')
      }

      // 3. 성공 처리
      setShowSuccessDialog(true)
      
    } catch (error) {
      console.error('회원가입 중 오류 발생:', error)
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError('알 수 없는 오류가 발생했습니다.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleHomeRedirect = () => {
    router.push('/')
    router.refresh()
  }

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

          {/* 회원가입 폼 */}
          <div className="flex items-center justify-center p-8">
            <Card className="w-full max-w-sm">
              <CardHeader>
                <CardTitle className="text-4xl font-semibold text-center">
                  회원가입
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">이름</Label>
                    <Input
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>
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
                      onChange={handlePasswordChange}
                      onFocus={() => setIsPasswordFocused(true)}
                      onBlur={() => setIsPasswordFocused(false)}
                      required
                    />
                    {isPasswordFocused && (
                      <p className="text-sm text-gray-500">6자 이상 입력하세요</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">비밀번호 확인</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={handleConfirmPasswordChange}
                      required
                    />
                    {passwordError && (
                      <p className="text-sm text-red-500">{passwordError}</p>
                    )}
                    {passwordMatch && (
                      <p className="text-sm text-green-500">비밀번호가 일치합니다</p>
                    )}
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
                      {loading ? '처리 중...' : '회원가입'}
                    </Button>
                  </motion.div>
                  <div className="text-sm text-center">
                    <p>
                      이미 계정이 있으신가요?{' '}
                      <Link href="/auth/signin" className="text-[#3182f6] hover:text-[#2563eb] hover:underline">
                        로그인
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
              회원가입 완료!
            </DialogTitle>
            <DialogDescription className="text-center mt-4">
              환영합니다! 회원가입이 성공적으로 완료되었습니다.
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
  )
} 