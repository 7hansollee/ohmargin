import { supabase } from '@/lib/supabase';

export interface CalculatorData {
  id?: string;
  user_id: string;
  product_name: string;
  selling_price: number;
  shipping_fee: number;
  purchase_price: number;
  purchase_shipping_fee: number;
  extra_cost: number;
  delivery_fee: number;
  commission: number;
  vat: number;
  margin: number;
  margin_rate: number;
  created_at?: string;
}

export const saveCalculatorData = async (data: Omit<CalculatorData, 'id' | 'created_at'>) => {
  const { data: result, error } = await supabase
    .from('calculator_data')
    .insert([data])
    .select()
    .single();

  if (error) throw error;
  return result;
};

export const getCalculatorData = async (userId: string) => {
  const { data, error } = await supabase
    .from('calculator_data')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}; 