'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Clock } from 'lucide-react'

interface AutoLogoutWarningProps {
  isOpen: boolean
  remainingTime: number
  onExtendSession: () => void
  onLogout: () => void
}

export function AutoLogoutWarning({
  isOpen,
  remainingTime,
  onExtendSession,
  onLogout
}: AutoLogoutWarningProps) {
  const [timeLeft, setTimeLeft] = useState(remainingTime)

  useEffect(() => {
    if (!isOpen) return

    setTimeLeft(remainingTime)
    
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1000) {
          setTimeout(() => {
            onLogout()
          }, 0)
          return 0
        }
        return prev - 1000
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isOpen, remainingTime, onLogout])

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return {
      minutes,
      seconds,
      display: `${minutes}:${seconds.toString().padStart(2, '0')}`
    }
  }

  const getProgressPercentage = () => {
    const totalTime = 5 * 60 * 1000 // 5분 = 300초
    const elapsed = totalTime - timeLeft
    return Math.min((elapsed / totalTime) * 100, 100)
  }

  const getTimerColor = () => {
    const minutes = Math.floor(timeLeft / 60000)
    if (minutes >= 3) return 'text-[#3182f6]'
    if (minutes >= 1) return 'text-orange-500'
    return 'text-red-500 animate-pulse'
  }

  const getProgressColor = () => {
    const minutes = Math.floor(timeLeft / 60000)
    if (minutes >= 3) return 'stroke-[#3182f6]'
    if (minutes >= 1) return 'stroke-orange-500'
    return 'stroke-red-500'
  }

  const time = formatTime(timeLeft)
  const progressPercentage = getProgressPercentage()

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-lg bg-white border border-gray-200 shadow-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl text-gray-800">
            <AlertTriangle className="h-6 w-6 text-[#3182f6]" />
            세션 만료 경고
          </DialogTitle>
          <DialogDescription className="text-base text-gray-600">
            비활성으로 인해 곧 자동 로그아웃됩니다.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center py-6 space-y-6">
          {/* 정보 박스 */}
          <div className="w-full p-4 bg-blue-50 border border-blue-200 rounded-md">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-[#3182f6] flex-shrink-0" />
              <p className="text-sm text-blue-700">
                장시간 비활성 상태로 세션이 만료됩니다. 계속 사용하시려면 아래 버튼을 클릭해주세요.
              </p>
            </div>
          </div>

          {/* 원형 타이머 */}
          <div className="relative w-32 h-32">
            <svg 
              className="w-32 h-32 transform -rotate-90" 
              viewBox="0 0 100 100"
            >
              {/* 배경 원 */}
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                className="text-gray-200"
              />
              {/* 진행 원 */}
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                className={`${getProgressColor()} transition-all duration-1000 ease-linear`}
                strokeDasharray={`${2 * Math.PI * 45}`}
                strokeDashoffset={`${2 * Math.PI * 45 * (1 - progressPercentage / 100)}`}
                strokeLinecap="round"
              />
            </svg>
            
            {/* 중앙 시간 표시 */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <Clock className={`h-6 w-6 mb-1 ${getTimerColor()}`} />
              <div className={`text-2xl font-bold ${getTimerColor()}`}>
                {time.display}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                남은 시간
              </div>
            </div>
          </div>

          {/* 큰 시간 표시 */}
          <div className="text-center">
            <div className={`text-5xl font-bold ${getTimerColor()} mb-2`}>
              {time.display}
            </div>
            <p className="text-lg text-gray-600">
              {time.minutes > 0 ? `${time.minutes}분 ${time.seconds}초` : `${time.seconds}초`} 후 자동 로그아웃
            </p>
          </div>

          <div className="text-center max-w-sm">
            <p className="text-sm text-gray-600">
              세션을 계속 유지하려면 <span className="font-semibold text-[#3182f6]">"계속 사용"</span> 버튼을 클릭하세요.
            </p>
          </div>
        </div>

        <DialogFooter className="flex gap-3 pt-4">
          <Button 
            variant="outline" 
            onClick={onLogout}
            className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-200"
          >
            지금 로그아웃
          </Button>
          <Button 
            onClick={onExtendSession}
            className="flex-1 bg-[#3182f6]/70 hover:bg-[#3182f6] active:scale-95 text-white transition-all duration-200 ease-in-out"
          >
            계속 사용
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 