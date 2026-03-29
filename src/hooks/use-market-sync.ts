
'use client';

import { useEffect, useRef } from 'react';
import { useMarketStore } from '@/store/use-market-store';
import { getLiveInternalPrice } from '@/lib/internal-market';

/**
 * @fileOverview بروتوكول المزامنة السوقية الموحد v7.5 - Targeted Stream Edition
 * تم تحديث المحرك ليعتمد على القنوات المخصصة (Individual Streams) لضمان أعلى دقة وسرعة.
 */

export function useMarketSync(symbols: any[]) {
  const updatePrice = useMarketStore(state => state.updatePrice);
  const wsRef = useRef<WebSocket | null>(null);
  const internalTimerRef = useRef<any>(null);
  const isMounted = useRef(true);

  // استقرار قائمة الرموز لمنع تكرار فتح الاتصال
  const symbolsKey = JSON.stringify(symbols?.map(s => s.id + s.updatedAt));

  useEffect(() => {
    isMounted.current = true;
    if (!symbols || symbols.length === 0) return;

    // 1. بناء فهرس المعايرة (Normalized Mapping)
    const binanceMap = new Map<string, string>();
    const activeStreams: string[] = [];

    symbols.forEach(s => {
      if (s.priceSource === 'binance' && s.binanceSymbol) {
        // تنظيف الرمز من أي فواصل وتوحيد الحالة للحروف الكبيرة
        const cleanSymbol = s.binanceSymbol.replace('/', '').toUpperCase();
        binanceMap.set(cleanSymbol, s.id);
        activeStreams.push(`${cleanSymbol.toLowerCase()}@ticker`);
      }
    });

    if (activeStreams.length > 0) {
      const connectBinance = () => {
        if (!isMounted.current) return;

        if (wsRef.current) {
          wsRef.current.close();
        }
        
        // فتح قناة سيولة مخصصة للأصول المحددة فقط لضمان السرعة والامتثال
        const streamsParam = activeStreams.join('/');
        const ws = new WebSocket(`wss://stream.binance.com:9443/stream?streams=${streamsParam}`);
        
        ws.onmessage = (event) => {
          if (!isMounted.current) return;
          try {
            const payload = JSON.parse(event.data);
            const ticker = payload.data;
            
            if (ticker && ticker.s) {
              const symbolId = binanceMap.get(ticker.s.toUpperCase());
              if (symbolId) {
                updatePrice(
                  symbolId, 
                  parseFloat(ticker.c), // السعر اللحظي الحالي
                  parseFloat(ticker.P), // نسبة التغيير خلال 24 ساعة
                  {
                    high: parseFloat(ticker.h),
                    low: parseFloat(ticker.l),
                    volume: parseFloat(ticker.v)
                  }
                );
              }
            }
          } catch (e) {
            // معالجة صامتة لضمان استقرار الواجهة
          }
        };

        ws.onclose = () => {
          if (isMounted.current) {
            // إعادة الربط التلقائي بعد 3 ثوانٍ في حال الانقطاع
            setTimeout(() => {
              if (isMounted.current) connectBinance();
            }, 3000);
          }
        };
        
        wsRef.current = ws;
      };

      connectBinance();
    }

    // 2. محرك النبض للأصول الداخلية (Internal Asset Core)
    const internalSymbols = symbols.filter(s => s.priceSource !== 'binance');
    if (internalSymbols.length > 0) {
      if (internalTimerRef.current) clearInterval(internalTimerRef.current);
      
      internalTimerRef.current = setInterval(() => {
        if (!isMounted.current) return;
        internalSymbols.forEach(s => {
          const price = getLiveInternalPrice(s.id, s);
          // الأصول الداخلية تتبع نبض نمو مستقر بنسبة 0.42% افتراضياً
          updatePrice(s.id, price, 0.42, {
            high: price * 1.02,
            low: price * 0.98,
            volume: 1500000
          });
        });
      }, 500); // تحديث هادئ كل نصف ثانية
    }

    return () => {
      isMounted.current = false;
      if (wsRef.current) wsRef.current.close();
      if (internalTimerRef.current) clearInterval(internalTimerRef.current);
    };
  }, [symbolsKey, updatePrice]);
}
