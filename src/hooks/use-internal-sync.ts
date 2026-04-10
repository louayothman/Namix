
'use client';

import { useEffect, useRef } from 'react';
import { useMarketStore } from '@/store/use-market-store';
import { getLiveInternalPrice } from '@/lib/internal-market';

/**
 * @fileOverview بروتوكول المزامنة الداخلية v1.0
 * يدير توليد الأسعار التقديرية للأصول الخاصة بالمنظومة.
 */
export function useInternalSync(symbols: any[]) {
  const updatePrice = useMarketStore(state => state.updatePrice);
  const timerRef = useRef<any>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    const internalSymbols = symbols.filter(s => s.priceSource === 'internal');
    
    if (internalSymbols.length === 0) return;

    const sync = () => {
      if (!isMounted.current) return;
      internalSymbols.forEach(s => {
        const price = getLiveInternalPrice(s.id, s);
        updatePrice(s.id, price, 0.42, { 
          high: price * 1.02, 
          low: price * 0.98, 
          volume: 1500000 
        });
      });
    };

    timerRef.current = setInterval(sync, 1000);

    return () => {
      isMounted.current = false;
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [symbols, updatePrice]);
}
