
'use client';

import { useEffect, useRef } from 'react';
import { useMarketStore } from '@/store/use-market-store';
import { getAlphaVantagePrice } from '@/app/actions/alphavantage-actions';

/**
 * @fileOverview بروتوكول مزامنة Alpha Vantage v1.2
 * يدير التحديث الدوري للأسعار العالمية (أسهم، سلع) مع الحفاظ على استقرار المستودع المركزي.
 */
export function useAlphaSync(symbols: any[]) {
  const updatePrice = useMarketStore(state => state.updatePrice);
  const timerRef = useRef<any>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    const alphaSymbols = symbols?.filter(s => s.priceSource === 'alphavantage') || [];
    
    if (alphaSymbols.length === 0) return;

    const sync = async () => {
      if (!isMounted.current) return;
      
      for (const s of alphaSymbols) {
        if (!isMounted.current) break;
        try {
          // جلب السعر المباشر من الأكشن (Server Action)
          const res = await getAlphaVantagePrice(s.externalTicker || s.code);
          if (res.success && res.price !== undefined) {
            updatePrice(s.id, res.price, res.changePercent || 0, {
              high: res.high || res.price,
              low: res.low || res.price,
              volume: res.volume || 0
            });
          }
        } catch (e) {
          console.error(`Alpha Sync Error for ${s.code}:`, e);
        }
      }
    };

    sync();
    // تحديث كل 20 ثانية للأصول العالمية لضمان البقاء ضمن حدود الـ API المجاني
    timerRef.current = setInterval(sync, 20000);

    return () => {
      isMounted.current = false;
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [symbols, updatePrice]);
}
