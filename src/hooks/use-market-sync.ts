
'use client';

import { useEffect, useRef } from 'react';
import { useMarketStore } from '@/store/use-market-store';
import { getLiveInternalPrice } from '@/lib/internal-market';

/**
 * @fileOverview بروتوكول المزامنة السوقية الموحد v7.0 - Turbo Mapping Edition
 * محرك الربط العالمي - تم تحسين الأداء باستخدام الـ Map لضمان عدم تجميد الواجهة.
 */

export function useMarketSync(symbols: any[]) {
  const updatePrice = useMarketStore(state => state.updatePrice);
  const wsRef = useRef<WebSocket | null>(null);
  const internalTimerRef = useRef<any>(null);

  useEffect(() => {
    if (!symbols || symbols.length === 0) return;

    // 1. بناء فهرس سريع للرموز (BinanceSymbol -> AppSymbolId)
    // هذا يمنع المحرك من "التجمد" عند معالجة آلاف الرسائل القادمة من بينانس
    const binanceMap = new Map<string, string>();
    symbols.forEach(s => {
      if (s.priceSource === 'binance' && s.binanceSymbol) {
        binanceMap.set(s.binanceSymbol, s.id);
      }
    });

    if (binanceMap.size > 0) {
      const connectBinance = () => {
        if (wsRef.current) {
          wsRef.current.close();
        }
        
        // استخدام تدفق !ticker@arr لجلب الأسعار ونسب التغيير وكافة الإحصائيات
        const ws = new WebSocket('wss://stream.binance.com:9443/ws/!ticker@arr');
        
        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (Array.isArray(data)) {
              data.forEach((ticker: any) => {
                const symbolId = binanceMap.get(ticker.s);
                if (symbolId) {
                  // تحديث متجر البيانات المركزي بالنبضات الجديدة
                  updatePrice(
                    symbolId, 
                    parseFloat(ticker.c), // السعر الحالي
                    parseFloat(ticker.P), // نسبة التغيير (P)
                    {
                      high: parseFloat(ticker.h),
                      low: parseFloat(ticker.l),
                      volume: parseFloat(ticker.v)
                    }
                  );
                }
              });
            }
          } catch (e) {
            console.error("Market Stream Processing Error:", e);
          }
        };

        ws.onerror = (err) => {
          console.error("Market Stream Connectivity Error:", err);
        };

        ws.onclose = () => {
          // إعادة الاتصال التلقائي في حال انقطاع النبض
          setTimeout(connectBinance, 3000);
        };
        
        wsRef.current = ws;
      };

      connectBinance();
    }

    // 2. محرك الأسعار الداخلية (Internal Asset Pulse)
    const internalSymbols = symbols.filter(s => s.priceSource !== 'binance');
    if (internalSymbols.length > 0) {
      if (internalTimerRef.current) clearInterval(internalTimerRef.current);
      
      internalTimerRef.current = setInterval(() => {
        internalSymbols.forEach(s => {
          const price = getLiveInternalPrice(s.id, s);
          updatePrice(s.id, price, 0.42, {
            high: price * 1.05,
            low: price * 0.95,
            volume: 1250000
          });
        });
      }, 100); 
    }

    return () => {
      if (wsRef.current) wsRef.current.close();
      if (internalTimerRef.current) clearInterval(internalTimerRef.current);
    };
  }, [symbols, updatePrice]);
}
