
'use client';

import { useEffect, useRef } from 'react';
import { useMarketStore } from '@/store/use-market-store';
import { getFinnhubPrice } from '@/app/actions/finnhub-actions';

/**
 * @fileOverview بروتوكول مزامنة Finnhub v1.1 - Multi-Node Aware
 * يدير التحديث الدوري للأسهم والسلع مع جلب البيانات من العقدة النشطة.
 */
export function useFinnhubSync(symbols: any[]) {
  const updatePrice = useMarketStore(state => state.updatePrice);
  const timerRef = useRef<any>(null);
  const isMounted = useRef(true);

  const isMarketOpen = () => {
    const now = new Date();
    const day = now.getUTCDay(); // 6 = Saturday, 0 = Sunday
    if (day === 6 || day === 0) return false;
    return true;
  };

  useEffect(() => {
    isMounted.current = true;
    const finnhubSymbols = symbols?.filter(s => s.priceSource === 'finnhub') || [];
    
    if (finnhubSymbols.length === 0) return;

    const sync = async () => {
      if (!isMounted.current) return;
      
      // We still sync even if market is closed to get the last "closed" price
      // but we could slow down the frequency here if desired.
      
      for (const s of finnhubSymbols) {
        if (!isMounted.current) break;
        try {
          const res = await getFinnhubPrice(s.externalTicker || s.code);
          if (res.success && res.price !== undefined) {
            updatePrice(s.id, res.price, res.changePercent || 0, {
              high: res.high || res.price,
              low: res.low || res.price,
              volume: res.volume || 0
            });
          }
        } catch (e) {
          console.error(`Finnhub Sync Error for ${s.code}:`, e);
        }
      }
    };

    sync();
    // Refresh every 20 seconds for global assets
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
