
'use client';

import { useEffect, useRef } from 'react';
import { useMarketStore } from '@/store/use-market-store';
import { getAlphaVantagePrice } from '@/app/actions/alphavantage-actions';

/**
 * @fileOverview بروتوكول مزامنة Alpha Vantage v1.0
 * يدير التحديث الدوري للأسهم والسلع العالمية لضمان تدفق الأسعار.
 */
export function useAlphaSync(symbols: any[]) {
  const updatePrice = useMarketStore(state => state.updatePrice);
  const timerRef = useRef<any>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    const alphaSymbols = symbols.filter(s => s.priceSource === 'alphavantage');
    
    if (alphaSymbols.length === 0) return;

    const sync = async () => {
      for (const s of alphaSymbols) {
        if (!isMounted.current) break;
        try {
          const res = await getAlphaVantagePrice(s.externalTicker || s.code);
          if (res.success) {
            updatePrice(s.id, res.price!, res.changePercent, {
              high: res.high!,
              low: res.low!,
              volume: res.volume!
            });
          }
        } catch (e) {}
      }
    };

    sync();
    // تحديث كل 30 ثانية للأصول العالمية لضمان البقاء ضمن حدود الـ API
    timerRef.current = setInterval(sync, 30000);

    return () => {
      isMounted.current = false;
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [symbols, updatePrice]);
}
