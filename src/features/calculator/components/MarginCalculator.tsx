'use client'

import { useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { MarginResult } from './MarginResult'
import { useToast } from '@/hooks/use-toast'

interface MarginData {
  purchasePrice: number
  sellingPrice: number
  shippingFee: number
  commissionRate: number
}

interface ValidationErrors {
  purchasePrice?: string
  sellingPrice?: string
  shippingFee?: string
  commissionRate?: string
}

export function MarginCalculator() {
  const { toast } = useToast()
  const [marginData, setMarginData] = useState<MarginData>({
    purchasePrice: 0,
    sellingPrice: 0,
    shippingFee: 0,
    commissionRate: 0,
  })

  const [errors, setErrors] = useState<ValidationErrors>({})
  const [isCalculated, setIsCalculated] = useState(false)

  const validateInput = useCallback((name: string, value: number): string | undefined => {
    if (value < 0) return '음수는 입력할 수 없습니다.'
    if (name === 'commissionRate' && value > 100) return '수수료율은 100%를 초과할 수 없습니다.'
    if (name === 'sellingPrice' && value <= marginData.purchasePrice) {
      return '판매가는 매입가보다 커야 합니다.'
    }
    return undefined
  }, [marginData.purchasePrice])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const numValue = Number(value) || 0
    
    const error = validateInput(name, numValue)
    setErrors(prev => ({
      ...prev,
      [name]: error
    }))

    setMarginData(prev => ({
      ...prev,
      [name]: numValue
    }))
  }

  const calculateMargin = useCallback(() => {
    const { purchasePrice, sellingPrice, shippingFee, commissionRate } = marginData
    const commission = sellingPrice * (commissionRate / 100)
    const totalCost = purchasePrice + shippingFee + commission
    const margin = sellingPrice - totalCost
    const marginRate = (margin / sellingPrice) * 100

    return {
      margin,
      marginRate,
      totalCost
    }
  }, [marginData])

  const handleCalculate = () => {
    const hasErrors = Object.values(errors).some(error => error !== undefined)
    if (hasErrors) return

    setIsCalculated(true)
  }

  const handleSave = () => {
    const hasErrors = Object.values(errors).some(error => error !== undefined)
    if (hasErrors) return

    // TODO: 실제 저장 로직 구현
    toast({
      title: "✅ 상품 저장 완료",
      description: "해당 상품의 마진이 성공적으로 저장되었습니다.",
      duration: 5000,
      variant: "default",
      className: "bg-green-50 border-green-200",
    })
  }

  const result = calculateMargin()

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card>
        <CardHeader>
          <CardTitle>마진 계산기</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">매입가</label>
            <Input
              type="number"
              name="purchasePrice"
              value={marginData.purchasePrice || ''}
              onChange={handleInputChange}
              placeholder="매입가를 입력하세요"
              min="0"
            />
            {errors.purchasePrice && (
              <p className="text-sm text-red-500">{errors.purchasePrice}</p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">판매가</label>
            <Input
              type="number"
              name="sellingPrice"
              value={marginData.sellingPrice || ''}
              onChange={handleInputChange}
              placeholder="판매가를 입력하세요"
              min="0"
            />
            {errors.sellingPrice && (
              <p className="text-sm text-red-500">{errors.sellingPrice}</p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">배송비</label>
            <Input
              type="number"
              name="shippingFee"
              value={marginData.shippingFee || ''}
              onChange={handleInputChange}
              placeholder="배송비를 입력하세요"
              min="0"
            />
            {errors.shippingFee && (
              <p className="text-sm text-red-500">{errors.shippingFee}</p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">수수료 (%)</label>
            <Input
              type="number"
              name="commissionRate"
              value={marginData.commissionRate || ''}
              onChange={handleInputChange}
              placeholder="수수료율을 입력하세요"
              min="0"
              max="100"
            />
            {errors.commissionRate && (
              <p className="text-sm text-red-500">{errors.commissionRate}</p>
            )}
          </div>
          <div className="flex gap-2">
            <Button 
              className="flex-1"
              onClick={handleCalculate}
              disabled={Object.values(errors).some(error => error !== undefined)}
            >
              계산하기
            </Button>
            <Button 
              className="flex-1"
              onClick={handleSave}
              disabled={Object.values(errors).some(error => error !== undefined) || !isCalculated}
            >
              상품 저장하기
            </Button>
          </div>
        </CardContent>
      </Card>
      {isCalculated && <MarginResult result={result} />}
    </div>
  )
} 