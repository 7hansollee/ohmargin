'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface MarginResultProps {
  result: {
    margin: number
    marginRate: number
    totalCost: number
  }
}

export function MarginResult({ result }: MarginResultProps) {
  const { margin, marginRate, totalCost } = result

  const getMarginRateColor = (rate: number) => {
    if (rate < 0) return 'text-red-500'
    if (rate < 10) return 'text-yellow-500'
    return 'text-primary-500'
  }

  const getMarginColor = (margin: number) => {
    if (margin < 0) return 'text-red-500'
    if (margin < 1000) return 'text-yellow-500'
    return 'text-primary-500'
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>계산 결과</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-neutral-700">총 비용</span>
            <span className="font-medium">{totalCost.toLocaleString()}원</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-neutral-700">마진</span>
            <span className={`font-medium ${getMarginColor(margin)}`}>
              {margin.toLocaleString()}원
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-neutral-700">마진율</span>
            <span className={`font-medium ${getMarginRateColor(marginRate)}`}>
              {marginRate.toFixed(2)}%
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 