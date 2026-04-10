
'use client';

import { useEffect, useRef } from 'react';
import { useMarketStore } from '@/store/use-market-store';
import { getTwelveDataPrice } from '@/app/actions/twelvedata-actions';

/**
 * @fileOverview بروتوكول مزامنة Twelve Data v1.0 - Market Hours Aware
 * يدير تحديث أسعار الأسهم والفوركس والسلع مع مراعاة عطلات نهاية الأسبوع.
 */
export function useTwelveDataSync(symbols: any[]) {
  const updatePrice = useMarketStore(state => state.updatePrice);
  const timerRef = useRef<any>(null);
  const isMounted = useRef(true);

  const isMarketOpen = () => {
    const now = new Date();
    const day = now.getUTCDay(); // 6 = السبت, 0 = الأحد
    if (day === 6 || day === 0) return false;
    return true;
  };

  useEffect(() => {
    isMounted.current = true;
    const tdSymbols = symbols?.filter(s => s.priceSource === 'twelvedata') || [];
    
    if (tdSymbols.length === 0) return;

    const sync = async () => {
      if (!isMounted.current) return;
      
      // التوقف عن المزامنة إذا كان السوق العالمي مغلقاً
      if (!isMarketOpen()) return;
      
      for (const s of tdSymbols) {
        if (!isMounted.current) break;
        try {
          const res = await getTwelveDataPrice(s.externalTicker || s.code);
          if (res.success && res.price !== undefined) {
            updatePrice(s.id, res.price, res.changePercent || 0, {
              high: res.high || res.price,
              low: res.low || res.price,
              volume: res.volume || 0
            });
          }
        } catch (e) {
          console.error(`TwelveData Sync Error for ${s.code}:`, e);
        }
      }
    };

    sync();
    timerRef.current = setInterval(sync, 30000); 

    return () => {
      isMounted.current = false;
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [symbols, updatePrice]);
}
