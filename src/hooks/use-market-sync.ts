
'use client';

import { useEffect, useRef } from 'react';
import { useMarketStore } from '@/store/use-market-store';
import { getLiveInternalPrice } from '@/lib/internal-market';

/**
 * @fileOverview بروتوكول المزامنة السوقية الموحد v6.0 - Ticker Full Feed
 * يدير اتصال WebSocket واحد عبر بروتوكول !ticker@arr لضمان جلب نسبة التغيير (P) وكافة الإحصائيات.
 */

export function useMarketSync(symbols: any[]) {
  const updatePrice = useMarketStore(state => state.updatePrice);
  const wsRef = useRef<WebSocket | null>(null);
  const internalTimerRef = useRef<any>(null);

  useEffect(() => {
    if (!symbols || symbols.length === 0) return;

    const binanceSymbols = symbols
      .filter(s => s.priceSource === 'binance')
      .map(s => s.binanceSymbol);

    if (binanceSymbols.length > 0) {
      const connectBinance = () => {
        if (wsRef.current) {
          wsRef.current.close();
        }
        
        // استخدام تدفق !ticker@arr بدلاً من miniTicker لجلب نسبة التغيير (P)
        const ws = new WebSocket('wss://stream.binance.com:9443/ws/!ticker@arr');
        
        ws.onmessage = (event) => {
          const data = JSON.parse(event.data);
          // تدفق !ticker@arr يعيد مصفوفة من كافة الأصول
          if (Array.isArray(data)) {
            data.forEach((ticker: any) => {
              const match = symbols.find(s => s.binanceSymbol === ticker.s);
              if (match) {
                updatePrice(
                  match.id, 
                  parseFloat(ticker.c), // السعر الحالي
                  parseFloat(ticker.P), // نسبة التغيير خلال 24 ساعة (P)
                  {
                    high: parseFloat(ticker.h),
                    low: parseFloat(ticker.l),
                    volume: parseFloat(ticker.v)
                  }
                );
              }
            });
          }
        };

        ws.onclose = () => {
          setTimeout(connectBinance, 3000);
        };
        
        wsRef.current = ws;
      };

      connectBinance();
    }

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
