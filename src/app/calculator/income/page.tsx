'use client';

import { useState, useEffect } from 'react';
import { useDebounce } from 'react-use';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from "@/components/ui/button";
import { Trash2 } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from 'next/navigation';
import { AlertCircle } from 'lucide-react';
import OhMarginLoading from '@/components/ui/OhMarginLoading';
import { useAuthStore } from '@/store/auth-store';
import { createClient } from '@/lib/supabase/client';
import { useMobile } from '@/hooks/useMobile';
import { MobileWarning } from '@/components/ui/MobileWarning';

interface Product {
  id: string;
  name: string;
  margin: number;
  quantity: number;
  seller: string;
}

export default function IncomeCalculator() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [totalIncome, setTotalIncome] = useState<number>(0);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [localQuantities, setLocalQuantities] = useState<{[key: string]: number}>({});
  const [quantitiesToUpdate, setQuantitiesToUpdate] = useState<{[key: string]: number}>({});
  
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
      setProducts([]);
      return;
    }

    const fetchProducts = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('margin_products')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (data) {
          console.log('Raw data from database:', data);
          
          // 판매처 매핑 함수
          const getSellerFromCommission = (commissionRate: number) => {
            const rate = Number(commissionRate);
            
            if (Math.abs(rate - 5.6) < 0.01) {
              return '스마트스토어';
            } else if (Math.abs(rate - 11.8) < 0.01 || Math.abs(rate - 11.88) < 0.01) {
              return '쿠팡';
            } else {
              return '미지정';
            }
          };

          // 🔥 기존 데이터베이스의 seller 필드를 업데이트
          const updateSellerInDatabase = async () => {
            const itemsToUpdate = data.filter(product => 
              product.seller === '미지정' || product.seller === null || product.seller === undefined
            );

            console.log(`Found ${itemsToUpdate.length} items to update in database`);
            
            for (const product of itemsToUpdate) {
              const newSeller = getSellerFromCommission(product.commission_rate);
              if (newSeller !== '미지정') {
                console.log(`Updating database: ${product.name} -> ${newSeller}`);
                
                const { error: updateError } = await supabase
                  .from('margin_products')
                  .update({ seller: newSeller })
                  .eq('id', product.id)
                  .eq('user_id', user.id);

                if (updateError) {
                  console.error(`Failed to update ${product.name}:`, updateError);
                } else {
                  console.log(`Successfully updated ${product.name} to ${newSeller}`);
                  // 로컬 데이터도 업데이트
                  product.seller = newSeller;
                }
              }
            }

            if (itemsToUpdate.length > 0) {
              toast({
                title: "판매처 정보 업데이트",
                description: `${itemsToUpdate.length}개 상품의 판매처 정보가 업데이트되었습니다.`,
              });
            }
          };

          // 데이터베이스 업데이트 실행
          await updateSellerInDatabase();

          // 매핑된 상품들 생성
          const mappedProducts = data.map((product: any) => ({
            ...product,
            quantity: 0,
            seller: product.seller || getSellerFromCommission(product.commission_rate)
          }));

          setProducts(mappedProducts);
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

  useEffect(() => {
    const total = products.reduce((sum, product) => {
      const quantity = localQuantities[product.id] || 0;
      return sum + (product.margin * quantity);
    }, 0);
    setTotalIncome(total);
  }, [products, localQuantities]);

  const handleQuantityChange = (index: number, value: string) => {
    if (!user) {
      toast({
        title: "로그인이 필요합니다",
        description: "수량을 변경하려면 로그인이 필요합니다.",
        variant: "destructive",
      });
      return;
    }

    const product = products[index];
    const numericValue = parseInt(value.replace(/[^0-9]/g, '')) || 0;
    
    // 로컬 상태 즉시 업데이트 (UI 반응성)
    setLocalQuantities(prev => ({
      ...prev,
      [product.id]: numericValue
    }));

    // 데이터베이스 업데이트 대기열에 추가 (debounced)
    setQuantitiesToUpdate(prev => ({
      ...prev,
      [product.id]: numericValue
    }));
  };

  const handleDeleteProduct = async (index: number) => {
    if (!user) {
      toast({
        title: "로그인이 필요합니다",
        description: "상품을 삭제하려면 로그인이 필요합니다.",
        variant: "destructive",
      });
      return;
    }

    try {
      const productToDelete = products[index];
      const supabase = createClient();
      const { error } = await supabase
        .from('margin_products')
        .delete()
        .eq('id', productToDelete.id)
        .eq('user_id', user.id);

      if (error) {
        throw new Error(error.message);
      }

      const newProducts = products.filter((_, i) => i !== index);
      setProducts(newProducts);
      
      toast({
        title: "상품이 삭제되었습니다",
        description: "상품이 성공적으로 삭제되었습니다.",
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "삭제 실패",
        description: error instanceof Error 
          ? error.message 
          : "상품 삭제에 실패했습니다.",
        variant: "destructive",
      });
    }
  };

  const formatNumber = (value: number) => {
    return value.toLocaleString('ko-KR');
  };

  const formatInputValue = (productId: string, fieldId: string) => {
    const value = localQuantities[productId] || 0;
    if (!value) return '';
    return focusedField === fieldId ? value.toString() : `${value}개`;
  };

  // 수량 업데이트를 500ms 지연시킴
  useDebounce(
    () => {
      if (Object.keys(quantitiesToUpdate).length > 0) {
        updateQuantitiesInDatabase();
      }
    },
    500,
    [quantitiesToUpdate]
  );

  const updateQuantitiesInDatabase = async () => {
    if (!user) return;

    const updatePromises = Object.entries(quantitiesToUpdate).map(async ([productId, quantity]) => {
      try {
        const supabase = createClient();
        const { error } = await supabase
          .from('margin_products')
          .update({ quantity })
          .match({ 
            id: productId,
            user_id: user.id 
          });

        if (error) {
          console.error('Supabase error details:', error);
          throw new Error(`데이터베이스 업데이트 실패: ${error.message}`);
        }

        // 실제 products 상태도 업데이트
        setProducts(prev => 
          prev.map(product => 
            product.id === productId 
              ? { ...product, quantity } 
              : product
          )
        );

      } catch (error) {
        console.error('Error updating quantity:', error);
        toast({
          title: "업데이트 실패",
          description: error instanceof Error ? error.message : "수량 업데이트에 실패했습니다.",
          variant: "destructive",
        });
      }
    });

    try {
      await Promise.all(updatePromises);
      setQuantitiesToUpdate({});
      
      toast({
        title: "업데이트 성공",
        description: "수량이 성공적으로 업데이트되었습니다.",
      });
    } catch (error) {
      console.error('Error in batch update:', error);
    }
  };

  return (
    <div className="min-h-[120vh] flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center mt-6 sm:mt-12">월수입 계산기</h1>
        
        <div className="flex flex-col lg:flex-row justify-center gap-4 lg:gap-4">
          <div className="order-2 lg:order-1 h-fit">
            <Card className="w-full max-w-md mx-auto lg:w-[300px] lg:mx-0">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg sm:text-xl">최종 월수입</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-end items-center">
                    <span className="text-xl sm:text-2xl font-bold text-[#3182f6] break-all">
                      {user && products.some(p => (localQuantities[p.id] || 0) > 0)
                        ? `${formatNumber(products.reduce((sum, product) => sum + ((localQuantities[product.id] || 0) > 0 ? product.margin * (localQuantities[product.id] || 0) : 0), 0))}원`
                        : ''}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {user ? (
            <Card className="order-1 lg:order-2 w-full max-w-4xl mx-auto lg:w-[800px] lg:mx-0">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg sm:text-xl">상품 목록</CardTitle>
              </CardHeader>
              <CardContent>
                {products.length === 0 ? (
                  <div className="text-center text-gray-500 py-6 sm:py-8 text-sm sm:text-base">
                    상품 마진 계산기에서 계산한 상품이 없습니다.
                    <br />
                    상품 마진 계산기에서 상품을 계산해주세요.
                  </div>
                ) : (
                  <div className="overflow-x-auto -mx-4 sm:mx-0">
                    <div className="min-w-[600px] px-4 sm:px-0">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="p-2 sm:p-3 text-left border-b text-xs sm:text-sm font-medium">제품명</th>
                            <th className="p-2 sm:p-3 text-left border-b text-xs sm:text-sm font-medium">판매처</th>
                            <th className="p-2 sm:p-3 text-right border-b text-xs sm:text-sm font-medium">개당 마진</th>
                            <th className="p-2 sm:p-3 text-right border-b text-xs sm:text-sm font-medium">월 판매 수량</th>
                            <th className="p-2 sm:p-3 text-right border-b text-xs sm:text-sm font-medium">제품별 수익</th>
                            <th className="p-2 sm:p-3 text-center border-b text-xs sm:text-sm font-medium">관리</th>
                          </tr>
                        </thead>
                        <tbody>
                          {products.map((product, index) => (
                            <tr key={product.id} className="hover:bg-gray-50">
                              <td className="p-2 sm:p-3 border-b">
                                <span className="text-xs sm:text-sm break-words">{product.name}</span>
                              </td>
                              <td className="p-2 sm:p-3 border-b">
                                <span className="text-xs sm:text-sm">{product.seller}</span>
                              </td>
                              <td className="p-2 sm:p-3 text-right border-b text-xs sm:text-sm">{formatNumber(product.margin)}원</td>
                              <td className="p-2 sm:p-3 text-right border-b">
                                <div className="flex justify-end">
                                  <Input
                                    type="text"
                                    value={formatInputValue(product.id, `quantity-${index}`)}
                                    onChange={(e) => {
                                      const value = e.target.value.replace(/[^0-9]/g, '');
                                      handleQuantityChange(index, value);
                                    }}
                                    onFocus={() => setFocusedField(`quantity-${index}`)}
                                    onBlur={() => setFocusedField(null)}
                                    placeholder="판매 수량을 입력하세요"
                                    className="w-20 sm:w-32 text-right text-xs sm:text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                  />
                                </div>
                              </td>
                              <td className="p-2 sm:p-3 text-right border-b font-medium text-xs sm:text-sm">
                                {(localQuantities[product.id] || 0) > 0 ? `${formatNumber(product.margin * (localQuantities[product.id] || 0))}원` : ''}
                              </td>
                              <td className="p-2 sm:p-3 text-center border-b">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDeleteProduct(index)}
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 sm:h-10 sm:w-10"
                                >
                                  <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="order-1 lg:order-2 flex justify-center">
              <Card className="w-full max-w-4xl mx-auto lg:w-[800px] lg:mx-0">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg sm:text-xl">상품 목록</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center gap-2 p-2.5 mt-2 bg-blue-50 border border-blue-200 rounded-md">
                    <AlertCircle className="w-4 h-4 text-blue-500 flex-shrink-0" />
                    <p className="text-xs sm:text-sm text-blue-700 text-center">
                      월수입 계산기는 로그인한 회원만 이용할 수 있습니다.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
} 