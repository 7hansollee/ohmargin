-- quantity 컬럼 추가
ALTER TABLE public.margin_products
ADD COLUMN quantity integer DEFAULT 0;

-- 월수입 계산을 위한 인덱스 추가
CREATE INDEX IF NOT EXISTS idx_margin_products_user_quantity 
ON public.margin_products(user_id, quantity);

-- 월수입 계산을 위한 뷰 생성 (보안이 적용된 쿼리)
CREATE OR REPLACE VIEW public.monthly_income AS
SELECT 
    user_id,
    SUM(margin * quantity) as total_income
FROM public.margin_products
WHERE auth.uid() = user_id
GROUP BY user_id; 