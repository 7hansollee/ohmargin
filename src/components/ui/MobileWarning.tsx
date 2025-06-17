'use client';

import { AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export function MobileWarning() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardContent className="flex flex-col items-center text-center p-8">
          <AlertTriangle className="h-16 w-16 text-orange-500 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            PC 사용을 권장합니다
          </h2>
          <p className="text-gray-600 text-base leading-relaxed">
            Oh! 마진은 PC에서 사용하셔야 원활한 사용이 가능합니다.
          </p>
        </CardContent>
      </Card>
    </div>
  );
} 