'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { HelpCircle, Trash2, Calculator, AlertCircle, ExternalLink } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import OhMarginLoading from '@/components/ui/OhMarginLoading';
import { useAuthStore } from '@/store/auth-store';
import { createClient } from '@/lib/supabase/client';
import { useMobile } from '@/hooks/useMobile';
import { MobileWarning } from '@/components/ui/MobileWarning';

export default function MarginCalculator() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [productName, setProductName] = useState<string>('');
  const [sellingPrice, setSellingPrice] = useState<string>('');
  const [shippingFee, setShippingFee] = useState<string>('');
  const [purchasePrice, setPurchasePrice] = useState<string>('');
  const [purchaseShippingFee, setPurchaseShippingFee] = useState<string>('');
  const [extraCost, setExtraCost] = useState<string>('');
  const [deliveryFee, setDeliveryFee] = useState<string>('');
  const [commission, setCommission] = useState<string>('');
  const [vat, setVat] = useState<string>('');
  const [margin, setMargin] = useState<number | undefined>(undefined);
  const [marginRate, setMarginRate] = useState<number | undefined>(undefined);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [calculationMode, setCalculationMode] = useState<'quick' | 'accurate'>('quick');
  const [category, setCategory] = useState<string | undefined>(undefined);
  const [memo, setMemo] = useState<string>('');
  const [calculatorValue, setCalculatorValue] = useState<string>('');
  const [savedProducts, setSavedProducts] = useState<Array<{name: string, margin: number, seller: string}>>([]);
  const [calculatorFocused, setCalculatorFocused] = useState<boolean>(false);
  const [userMemo, setUserMemo] = useState<string>('');
  const [memoLoading, setMemoLoading] = useState<boolean>(false);
  const [memoSaving, setMemoSaving] = useState<boolean>(false);

  // 모바일 감지 추가
  const isMobile = useMobile();

  useEffect(() => {
    if (!authLoading) {
      setLoading(false);
    }
  }, [authLoading]);

  // 로딩 중이거나 모바일 환경이면 적절한 컴포넌트 표시
  if (loading) {
    return <OhMarginLoading />;
  }

  // 모바일 환경이면 안내문구 표시
  if (isMobile) {
    return <MobileWarning />;
  }

  useEffect(() => {
    if (!user) {
      setSavedProducts([]);
      return;
    }

    const fetchProducts = async () => {
      try {
        const supabase = createClient();
        console.log('Supabase client:', supabase); // 클라이언트 확인

        // 현재 세션 확인
        const { data: session } = await supabase.auth.getSession();
        console.log('Current session:', session);

        const { data, error } = await supabase
          .from('margin_products')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        if (data) {
          // 판매처 매핑 함수
          const getSellerFromCommission = (commissionRate: number) => {
            // 부동소수점 비교를 위해 더 견고한 방식 사용
            const rate = Number(commissionRate);
            
            if (Math.abs(rate - 5.6) < 0.01) {
              return '스마트스토어';
            } else if (Math.abs(rate - 11.8) < 0.01 || Math.abs(rate - 11.88) < 0.01) {
              return '쿠팡';
            } else {
              return '미지정';
            }
          };

          const mappedProducts = data.map((product: any) => ({
            ...product,
            quantity: 0,
            seller: product.seller || getSellerFromCommission(product.commission_rate) || '미지정'
          }));
          setSavedProducts(mappedProducts);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        toast({
          title: "데이터 로딩 실패",
          description: "상품 데이터를 불러오는데 실패했습니다.",
          variant: "destructive",
        });
      }
    };

    fetchProducts();
  }, [user, toast]);

  // 사용자 메모를 불러오는 useEffect 추가
  useEffect(() => {
    if (!user) {
      setUserMemo('');
      return;
    }

    const fetchUserMemo = async () => {
      try {
        setMemoLoading(true);
        const supabase = createClient();
        const { data, error } = await supabase
          .from('user_memos')
          .select('memo_content')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') { // PGRST116은 데이터가 없을 때 발생
          throw error;
        }
        
        if (data) {
          setUserMemo(data.memo_content);
        }
      } catch (error) {
        console.error('Error fetching user memo:', error);
        toast({
          title: "메모 로딩 실패",
          description: "메모를 불러오는데 실패했습니다.",
          variant: "destructive",
        });
      } finally {
        setMemoLoading(false);
      }
    };

    fetchUserMemo();
  }, [user, toast]);

  const handleProductNameChange = (value: string) => {
    setProductName(value);
    
    // 저장된 제품 중에서 일치하는 제품 찾기
    const matchedProduct = savedProducts.find(product => product.name === value);
    if (matchedProduct) {
      setMargin(matchedProduct.margin);
      // 마진율 계산 (판매가격이 있는 경우에만)
      if (sellingPrice) {
        const totalRevenue = Number(sellingPrice) + Number(shippingFee || 0);
        const calculatedMarginRate = totalRevenue > 0 ? (matchedProduct.margin / totalRevenue) * 100 : 0;
        setMarginRate(Number(calculatedMarginRate.toFixed(2)));
      }
    }
  };

  const getCategoryCommission = (category: string | undefined) => {
    if (!category) return 0;
    
    const commissionRates: { [key: string]: number } = {
      'digital': 8.58,
      'furniture': 11.88,
      'book_music': 11.88,  // 도서/음반 통합
      'stationery': 11.88,
      'baby': 11,
      'sports': 11.88,
      'beauty': 10.56,
      'living': 8.58,
      'food': 11.66,
      'toy': 11.88,
      'car': 11,
      'kitchen': 11.88,
      'fashion': 11.55,
      'pet': 11.88
    };

    return commissionRates[category] || 0;
  };

  const calculateMargin = () => {
    const selling = Number(sellingPrice) || 0;
    const shipping = Number(shippingFee) || 0;
    const purchase = Number(purchasePrice) || 0;
    const purchaseShipping = Number(purchaseShippingFee) || 0;
    const extra = Number(extraCost) || 0;
    const delivery = Number(deliveryFee) || 0;
    const comm = calculationMode === 'accurate' && commission === '11.8' ? getCategoryCommission(category) : Number(commission) || 0;
    const vatAmount = Number(vat) || 0;

    const totalRevenue = selling + shipping;
    const totalCost = purchase + purchaseShipping + extra + delivery + (totalRevenue * (comm / 100));
    const calculatedMargin = totalRevenue - totalCost;
    const vatCost = calculatedMargin * (vatAmount / 100);
    const finalMargin = calculatedMargin - vatCost;
    const calculatedMarginRate = totalRevenue > 0 ? (finalMargin / totalRevenue) * 100 : 0;

    setMargin(Math.round(finalMargin));
    setMarginRate(Number(calculatedMarginRate.toFixed(2)));
  };

  useEffect(() => {
    calculateMargin();
  }, [sellingPrice, shippingFee, purchasePrice, purchaseShippingFee, extraCost, deliveryFee, commission, vat, category, calculationMode]);

  const handleInputChange = (value: string, setter: (value: string | undefined) => void) => {
    setter(value);
  };

  const formatInputValue = (value: string | undefined, fieldId: string) => {
    if (!value) return '';
    return focusedField === fieldId ? value : `${value}원`;
  };

  const formatNumber = (value: number) => {
    return value.toLocaleString('ko-KR');
  };

  const handleQuickCalculation = () => {
    setCalculationMode('quick');
    setCommission('5.6');
    setCategory(undefined);
    calculateMargin();
  };

  const handleAccurateCalculation = () => {
    setCalculationMode('accurate');
    setCategory(undefined);
    calculateMargin();
  };

  const handleSaveProduct = async () => {
    console.log('User object:', user); // 사용자 객체 확인
    console.log('User ID:', user?.id); // 사용자 ID 확인
    
    if (!user) {
      toast({
        title: "로그인이 필요합니다",
        description: "상품을 저장하려면 로그인이 필요합니다.",
        variant: "destructive",
      });
      return;
    }

    if (!productName.trim()) {
      toast({
        title: "상품명이 필요합니다",
        description: "저장할 상품명을 입력해주세요.",
        variant: "destructive",
      });
      return;
    }

    if (margin === undefined) {
      toast({
        title: "마진 계산이 필요합니다",
        description: "마진을 먼저 계산해주세요.",
        variant: "destructive",
      });
      return;
    }

    try {
      const supabase = createClient();
      
      // 판매처 매핑 - commission 값에 따라 판매처 이름 결정
      const getSellerName = (commissionValue: string | undefined) => {
        if (!commissionValue) return '미지정';
        
        switch(commissionValue) {
          case '5.6':
            return '스마트스토어';
          case '11.8':
          case '11.88':
            return '쿠팡';
          default:
            return '미지정';
        }
      };
      
      // 삽입할 데이터 로그 출력
      const insertData = {
        user_id: user.id,
        name: productName.trim(),
        selling_price: Number(sellingPrice) || 0,
        shipping_fee: Number(shippingFee) || 0,
        purchase_price: Number(purchasePrice) || 0,
        purchase_shipping_fee: Number(purchaseShippingFee) || 0,
        extra_cost: Number(extraCost) || 0,
        delivery_fee: Number(deliveryFee) || 0,
        commission_rate: Number(commission) || 0,
        vat_rate: Number(vat) || 0,
        margin: margin,
        margin_rate: marginRate || 0,
        category: category,
        memo: memo.trim(),
        seller: getSellerName(commission)
      };
      
      console.log('Insert data:', insertData); // 삽입할 데이터 확인
      
      const { error } = await supabase
        .from('margin_products')
        .insert([insertData]);

      if (error) throw error;

      toast({
        title: "저장 완료",
        description: "상품이 성공적으로 저장되었습니다.",
        variant: "default",
      });

      // 저장 후 상품 목록 새로고침
      const { data: newData, error: fetchError } = await supabase
        .from('margin_products')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      if (newData) {
        // 판매처 매핑 함수
        const getSellerFromCommission = (commissionRate: number) => {
          // 부동소수점 비교를 위해 더 견고한 방식 사용
          const rate = Number(commissionRate);
          
          if (Math.abs(rate - 5.6) < 0.01) {
            return '스마트스토어';
          } else if (Math.abs(rate - 11.8) < 0.01 || Math.abs(rate - 11.88) < 0.01) {
            return '쿠팡';
          } else {
            return '미지정';
          }
        };

        const mappedProducts = newData.map((product: any) => ({
          ...product,
          quantity: 0,
          seller: product.seller || getSellerFromCommission(product.commission_rate) || '미지정'
        }));
        setSavedProducts(mappedProducts);
      }

    } catch (error: any) {
      console.error('Error saving product:', error);
      console.error('Error details:', {
        message: error?.message,
        code: error?.code,
        details: error?.details,
        hint: error?.hint,
        statusCode: error?.status,
        statusText: error?.statusText
      });
      
      if (error?.code === '23505') {
        toast({
          title: "중복 오류",
          description: "이미 존재하는 상품명입니다.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "저장 실패",
          description: error?.message || "상품 저장에 실패했습니다.",
          variant: "destructive",
        });
      }
    }
  };

  const handleCalculatorInput = (value: string) => {
    // 계산기 입력 시 포커스 상태 활성화
    setCalculatorFocused(true);
    
    if (value === '=') {
      try {
        // 연산자 변환
        const expression = calculatorValue
          .replace(/×/g, '*')
          .replace(/÷/g, '/');
        const result = eval(expression);
        // 결과가 유효한 숫자인 경우에만 표시
        if (!isNaN(result) && isFinite(result)) {
          setCalculatorValue(result.toString());
        } else {
          setCalculatorValue('0');
        }
      } catch (error) {
        setCalculatorValue('0');
      }
    } else if (value === 'AC') {
      // 한 글자씩 삭제
      setCalculatorValue(prev => prev.slice(0, -1));
    } else if (value === '±') {
      setCalculatorValue(prev => {
        if (prev.startsWith('-')) {
          return prev.substring(1);
        } else {
          return '-' + prev;
        }
      });
    } else if (value === '%') {
      try {
        const result = parseFloat(calculatorValue) / 100;
        if (!isNaN(result) && isFinite(result)) {
          setCalculatorValue(result.toString());
        } else {
          setCalculatorValue('0');
        }
      } catch (error) {
        setCalculatorValue('0');
      }
    } else {
      // 숫자와 연산자만 입력 가능하도록 검증
      const validInput = /^[0-9+\-*/.×÷]$/.test(value);
      if (validInput) {
        setCalculatorValue(prev => prev + value);
      }
    }
  };

  // 계산기 입력 필드 포커스 처리
  const handleCalculatorFocus = () => {
    setCalculatorFocused(true);
  };

  const handleCalculatorBlur = () => {
    // 약간의 지연을 주어 버튼 클릭 이벤트가 처리될 수 있도록 함
    setTimeout(() => {
      setCalculatorFocused(false);
    }, 200);
  };

  // 키보드 입력 처리
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // 계산기 입력 필드가 포커스되어 있거나 계산기 버튼이 클릭된 상태일 때만 키보드 입력 처리
      if (!calculatorFocused && !(event.target as HTMLElement)?.closest('.calculator-container')) return;

      // 이미 Input 요소에 포커스가 있는 경우 이벤트 처리하지 않음
      if (document.activeElement?.tagName === 'INPUT') return;

      // 숫자, 연산자, 엔터, 백스페이스, ESC 키 처리
      if (/^[0-9.]$/.test(event.key)) {
        // 숫자와 소수점
        handleCalculatorInput(event.key);
        event.preventDefault(); // 기본 동작 방지
      } else if (event.key === 'Enter') {
        // 엔터키로 계산 실행
        handleCalculatorInput('=');
        event.preventDefault();
      } else if (event.key === 'Escape') {
        // ESC키로 초기화
        handleCalculatorInput('AC');
        event.preventDefault();
      } else if (event.key === 'Backspace') {
        // 백스페이스로 마지막 문자 삭제
        setCalculatorValue(prev => prev.slice(0, -1));
        event.preventDefault();
      } else if (['+', '-', '*', '/'].includes(event.key)) {
        // 연산자 변환
        const operatorMap: { [key: string]: string } = {
          '*': '×',
          '/': '÷'
        };
        handleCalculatorInput(operatorMap[event.key] || event.key);
        event.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [calculatorFocused, calculatorValue]);

  // 메모 저장 함수
  const handleSaveMemo = async () => {
    if (!user) {
      toast({
        title: "로그인이 필요합니다",
        description: "메모를 저장하려면 로그인이 필요합니다.",
        variant: "destructive",
      });
      return;
    }

    try {
      setMemoSaving(true);
      const supabase = createClient();
      
      // 메모가 비어있거나 공백만 있는 경우 레코드 삭제
      if (!userMemo.trim()) {
        const { error } = await supabase
          .from('user_memos')
          .delete()
          .eq('user_id', user.id);

        if (error) throw error;

        toast({
          title: "메모 삭제 완료",
          description: "메모가 삭제되었습니다.",
          variant: "default",
        });
      } else {
        // 메모가 있는 경우 UPSERT로 저장
        const { error } = await supabase
          .from('user_memos')
          .upsert(
            {
              user_id: user.id,
              memo_content: userMemo.trim()
            },
            {
              onConflict: 'user_id'
            }
          );

        if (error) throw error;

        toast({
          title: "메모 저장 완료",
          description: "메모가 성공적으로 저장되었습니다.",
          variant: "default",
        });
      }

    } catch (error: any) {
      console.error('Error saving memo:', error);
      toast({
        title: "메모 저장 실패",
        description: error?.message || "메모 저장에 실패했습니다.",
        variant: "destructive",
      });
    } finally {
      setMemoSaving(false);
    }
  };

  return (
    <div className="min-h-[120vh] flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-8 text-center mt-12">상품 마진 계산기</h1>
        
        <div className="flex flex-col items-center gap-8 lg:flex-row lg:justify-center">
          {/* 좌측: 마진 계산기 */}
          <Card className="w-full max-w-lg lg:w-[450px]">
            <CardHeader>
              <CardTitle>마진 계산</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="productName">제품명</Label>
                  <Input
                    id="productName"
                    value={productName}
                    onChange={(e) => handleProductNameChange(e.target.value)}
                    placeholder="제품명을 입력하세요"
                    className="w-full"
                    autoComplete="off"
                  />
                </div>
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">매출</h2>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="sellingPrice">판매가격</Label>
                      <TooltipProvider>
                        <Tooltip delayDuration={0}>
                          <TooltipTrigger>
                            <HelpCircle className="w-4 h-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent side="right" className="bg-white/95">
                            <p>상품의 실제 판매 가격을 입력</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="relative">
                      <div className="relative flex items-center">
                        <Input
                          id="sellingPrice"
                          type="text"
                          value={formatInputValue(sellingPrice, 'sellingPrice')}
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9]/g, '');
                            handleInputChange(value, setSellingPrice);
                          }}
                          onFocus={() => setFocusedField('sellingPrice')}
                          onBlur={() => setFocusedField(null)}
                          placeholder="판매가격을 입력하세요"
                          className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          autoComplete="off"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="shippingFee">배송비</Label>
                      <TooltipProvider>
                        <Tooltip delayDuration={0}>
                          <TooltipTrigger>
                            <HelpCircle className="w-4 h-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent side="right" className="bg-white/95">
                            <p>고객에게 받는 배송비를 입력<br />무료배송이면 0원 입력
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="relative">
                      <div className="relative flex items-center">
                        <Input
                          id="shippingFee"
                          type="text"
                          value={formatInputValue(shippingFee, 'shippingFee')}
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9]/g, '');
                            handleInputChange(value, setShippingFee);
                          }}
                          onFocus={() => setFocusedField('shippingFee')}
                          onBlur={() => setFocusedField(null)}
                          placeholder="배송비를 입력하세요"
                          className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          autoComplete="off"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">매입</h2>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="purchasePrice">매입가격</Label>
                      <TooltipProvider>
                        <Tooltip delayDuration={0}>
                          <TooltipTrigger>
                            <HelpCircle className="w-4 h-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent side="right" className="bg-white/95">
                            <p>상품 1개를 매입한 가격을 입력<br />Ex) 100개 10000원 매입, 100원 입력</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="relative">
                      <div className="relative flex items-center">
                        <Input
                          id="purchasePrice"
                          type="text"
                          value={formatInputValue(purchasePrice, 'purchasePrice')}
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9]/g, '');
                            handleInputChange(value, setPurchasePrice);
                          }}
                          onFocus={() => setFocusedField('purchasePrice')}
                          onBlur={() => setFocusedField(null)}
                          placeholder="구매가격을 입력하세요"
                          className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          autoComplete="off"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="purchaseShippingFee">매입운송비</Label>
                      <TooltipProvider>
                        <Tooltip delayDuration={0}>
                          <TooltipTrigger>
                            <HelpCircle className="w-4 h-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent side="right" className="bg-white/95">
                            <p>상품 1개 매입 시 발생한 운송비를 입력<br />Ex) 100개 매입 시 운송비 3500원, 35원 입력</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="relative">
                      <div className="relative flex items-center">
                        <Input
                          id="purchaseShippingFee"
                          type="text"
                          value={formatInputValue(purchaseShippingFee, 'purchaseShippingFee')}
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9]/g, '');
                            handleInputChange(value, setPurchaseShippingFee);
                          }}
                          onFocus={() => setFocusedField('purchaseShippingFee')}
                          onBlur={() => setFocusedField(null)}
                          placeholder="구매 배송비를 입력하세요"
                          className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          autoComplete="off"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="extraCost">포장 비용</Label>
                      <TooltipProvider>
                        <Tooltip delayDuration={0}>
                          <TooltipTrigger>
                            <HelpCircle className="w-4 h-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent side="right" className="bg-white/95">
                            <p>1개를 포장하는데 들어간 모든 추가 비용을 입력<br />Ex 1) 택배비 포함 박스 100개 = 13000원, 130원 추가<br />Ex 2) 택배비 포함 뽁뽁이 100개 = 16000원, 160원 추가</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="relative">
                      <div className="relative flex items-center">
                        <Input
                          id="extraCost"
                          type="text"
                          value={formatInputValue(extraCost, 'extraCost')}
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9]/g, '');
                            handleInputChange(value, setExtraCost);
                          }}
                          onFocus={() => setFocusedField('extraCost')}
                          onBlur={() => setFocusedField(null)}
                          placeholder="추가 비용을 입력하세요"
                          className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          autoComplete="off"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="deliveryFee">택배비</Label>
                      <TooltipProvider>
                        <Tooltip delayDuration={0}>
                          <TooltipTrigger>
                            <HelpCircle className="w-4 h-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent side="right" className="bg-white/95">
                            <p>택배 1개당 택배사에 지불하는 비용을 입력</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="relative">
                      <div className="relative flex items-center">
                        <Input
                          id="deliveryFee"
                          type="text"
                          value={formatInputValue(deliveryFee, 'deliveryFee')}
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9]/g, '');
                            handleInputChange(value, setDeliveryFee);
                          }}
                          onFocus={() => setFocusedField('deliveryFee')}
                          onBlur={() => setFocusedField(null)}
                          placeholder="배송비를 입력하세요"
                          className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          autoComplete="off"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">수수료</h2>
                    {calculationMode === 'accurate' && (
                      <a
                        href="https://cloud.mkt.coupang.com/Fee-Table"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm bg-blue-50 hover:bg-blue-100 text-blue-700 hover:text-blue-800 rounded-lg border border-blue-200 hover:border-blue-300 transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-md group"
                      >
                        <span>[쿠팡] 상품 카테고리를 잘 모르겠다면?</span>
                        <ExternalLink className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </a>
                    )}
                  </div>
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <Button
                        variant={calculationMode === 'quick' ? 'default' : 'outline'}
                        onClick={handleQuickCalculation}
                        className={`flex-1 transition-all duration-200 ease-in-out ${
                          calculationMode === 'quick'
                            ? 'bg-[#3182f6]/70 hover:bg-[#3182f6] active:scale-95 text-white'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        빠른 계산
                      </Button>
                      <Button
                        variant={calculationMode === 'accurate' ? 'default' : 'outline'}
                        onClick={handleAccurateCalculation}
                        className={`flex-1 transition-all duration-200 ease-in-out ${
                          calculationMode === 'accurate'
                            ? 'bg-[#3182f6]/70 hover:bg-[#3182f6] active:scale-95 text-white'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        정확한 계산
                      </Button>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <Label>판매처</Label>
                        <Select
                          value={commission}
                          onValueChange={(value) => {
                            if (calculationMode === 'quick' && value === '11.8') {
                              setCommission('11.88');
                            } else {
                              setCommission(value);
                            }
                          }}
                        >
                          <SelectTrigger className="bg-white">
                            <SelectValue placeholder="판매처 선택">
                              {calculationMode === 'quick' && commission === '5.6' && '스마트스토어'}
                              {calculationMode === 'quick' && commission === '11.88' && '쿠팡'}
                              {calculationMode === 'accurate' && commission === '5.6' && '스마트스토어'}
                              {calculationMode === 'accurate' && (commission === '11.8' || commission === '11.88') && '쿠팡'}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            {calculationMode === 'quick' ? (
                              <>
                                <SelectItem value="5.6">스마트스토어</SelectItem>
                                <SelectItem value="11.8">쿠팡</SelectItem>
                                <SelectItem value="0" disabled>로켓그로스(준비중)</SelectItem>
                              </>
                            ) : (
                              <>
                                <SelectItem value="5.6">스마트스토어</SelectItem>
                                <SelectItem value="11.8">쿠팡</SelectItem>
                                <SelectItem value="0" disabled>로켓그로스(준비중)</SelectItem>
                              </>
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex-1 space-y-2">
                        <Label>수수료율</Label>
                        <div className="h-10 px-3 py-2 bg-gray-100 rounded-md flex items-center justify-end">
                          <span className="text-lg font-medium">
                            {calculationMode === 'accurate' && commission === '11.8' && category
                              ? `${getCategoryCommission(category)}%`
                              : commission
                              ? `${commission}%`
                              : '-'}
                          </span>
                        </div>
                      </div>
                    </div>
                    {calculationMode === 'accurate' && commission !== '5.6' && (
                      <div className="space-y-2">
                        <Label htmlFor="category">카테고리</Label>
                        <Select
                          value={category}
                          onValueChange={setCategory}
                        >
                          <SelectTrigger className="bg-white">
                            <SelectValue placeholder="카테고리를 선택하세요" />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            <SelectItem value="digital">디지털/가전</SelectItem>
                            <SelectItem value="furniture">가구/인테리어</SelectItem>
                            <SelectItem value="book_music">도서/음반</SelectItem>
                            <SelectItem value="stationery">문구/사무용품</SelectItem>
                            <SelectItem value="baby">출산/유아용품</SelectItem>
                            <SelectItem value="sports">스포츠/레저</SelectItem>
                            <SelectItem value="beauty">뷰티</SelectItem>
                            <SelectItem value="living">생활용품</SelectItem>
                            <SelectItem value="food">식품</SelectItem>
                            <SelectItem value="toy">완구/취미</SelectItem>
                            <SelectItem value="car">자동차용품</SelectItem>
                            <SelectItem value="kitchen">주방용품</SelectItem>
                            <SelectItem value="fashion">패션</SelectItem>
                            <SelectItem value="pet">반려/애완용품</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">부가세</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <Label>과세 유형</Label>
                        <Select
                          value={vat}
                          onValueChange={(value) => {
                            setVat(value);
                          }}
                        >
                          <SelectTrigger className="bg-white">
                            <SelectValue placeholder="과세 유형 선택" />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            <SelectItem value="10">일반 과세자</SelectItem>
                            <SelectItem value="1">면세 과세자</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex-1 space-y-2">
                        <Label>부가세율</Label>
                        <div className="h-10 px-3 py-2 bg-gray-100 rounded-md flex items-center justify-end">
                          <span className="text-lg font-medium">{vat ? `${vat}%` : '-'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 우측: 계산기와 메모장 */}
          <div className="w-full max-w-lg lg:w-[450px]">
            <div className="sticky top-8 space-y-8">
              {/* 결과 카드 */}
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span>계산 결과</span>
                    <TooltipProvider>
                      <Tooltip delayDuration={0}>
                        <TooltipTrigger>
                          <HelpCircle className="w-4 h-4 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent side="right" className="bg-white/95">
                          <p>계산된 마진이 표시됩니다<br />상품 저장하기 버튼을 누르시고<br />상단에 월수입 계산기 페이지로 이동하세요.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg">제품명</span>
                      <span className="text-xl font-bold">{productName || '-'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-lg">마진</span>
                      <span className="text-2xl font-bold">{margin !== undefined ? `${formatNumber(margin)}원` : '-'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-lg">마진율</span>
                      <span className="text-2xl font-bold">{marginRate !== undefined ? `${marginRate}%` : '-'}</span>
                    </div>
                    {!user && (
                      <div className="flex items-center gap-2 p-3 mt-2 bg-blue-50 border border-blue-200 rounded-md">
                        <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0" />
                        <p className="text-sm text-blue-700">
                          상품 저장 기능은 로그인한 회원만 이용할 수 있습니다.
                        </p>
                      </div>
                    )}
                    <Button
                      onClick={handleSaveProduct}
                      className="w-full mt-4 bg-[#3182f6]/70 hover:bg-[#3182f6] active:scale-95 text-white transition-all duration-200 ease-in-out"
                      disabled={!productName || margin === undefined || !user}
                    >
                      상품 저장하기
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* 계산기 */}
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span>계산기</span>
                    <TooltipProvider>
                      <Tooltip delayDuration={0}>
                        <TooltipTrigger>
                          <HelpCircle className="w-4 h-4 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent side="right" className="bg-white/95">
                          <p>키보드 입력이 지원되는 계산기 입니다.<br />계산이 필요할 경우 사용하세요</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="relative">
                      <Input
                        type="text"
                        value={calculatorValue}
                        onChange={(e) => setCalculatorValue(e.target.value)}
                        onFocus={handleCalculatorFocus}
                        onBlur={handleCalculatorBlur}
                        placeholder="계산식을 입력하세요"
                        className="text-right text-lg font-medium"
                      />
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { label: 'AC', value: 'AC' },
                        { label: '±', value: '±' },
                        { label: '%', value: '%' },
                        { label: '÷', value: '÷' },
                        { label: '7', value: '7' },
                        { label: '8', value: '8' },
                        { label: '9', value: '9' },
                        { label: '×', value: '×' },
                        { label: '4', value: '4' },
                        { label: '5', value: '5' },
                        { label: '6', value: '6' },
                        { label: '-', value: '-' },
                        { label: '1', value: '1' },
                        { label: '2', value: '2' },
                        { label: '3', value: '3' },
                        { label: '+', value: '+' },
                        { label: <Calculator className="w-5 h-5 mx-auto" />, value: 'calc' },
                        { label: '0', value: '0' },
                        { label: '.', value: '.' },
                        { label: '=', value: '=' },
                      ].map((btn, idx) => (
                        <Button
                          key={idx}
                          variant="outline"
                          className={`h-12 text-lg flex items-center justify-center${btn.value === '=' ? ' bg-[#3182f6]/70 hover:bg-[#3182f6] active:scale-95 text-white transition-all duration-200 ease-in-out' : ''}`}
                          onClick={() => btn.value !== 'calc' && handleCalculatorInput(btn.value)}
                          tabIndex={btn.value === 'calc' ? -1 : 0}
                        >
                          {btn.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 메모장 */}
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span>포장 비용 메모장</span>
                      <TooltipProvider>
                        <Tooltip delayDuration={0}>
                          <TooltipTrigger>
                            <HelpCircle className="w-4 h-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent side="right" className="bg-white/95">
                            <p>포장 관련 비용이나 메모를<br />자유롭게 기록할 수 있습니다</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    {!user && (
                      <span className="text-sm text-gray-500 font-normal">로그인 필요</span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {!user ? (
                      <div className="flex items-center gap-2 p-4 bg-blue-50 border border-blue-200 rounded-md">
                        <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0" />
                        <p className="text-sm text-blue-700">
                          메모장 기능은 로그인한 회원만 이용할 수 있습니다.
                        </p>
                      </div>
                    ) : (
                      <>
                        <Textarea
                          placeholder="여기에 메모를 입력하세요..."
                          value={userMemo}
                          onChange={(e) => setUserMemo(e.target.value)}
                          className="min-h-[200px] resize-none"
                          disabled={memoLoading}
                        />
                        <Button
                          onClick={handleSaveMemo}
                          className="w-full bg-[#3182f6]/70 hover:bg-[#3182f6] active:scale-95 text-white transition-all duration-200 ease-in-out"
                          disabled={memoSaving || memoLoading}
                        >
                          {memoSaving ? '저장 중...' : '메모 저장하기'}
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 