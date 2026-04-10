
'use client';

import { useEffect, useRef } from 'react';
import { useMarketStore } from '@/store/use-market-store';

/**
 * @fileOverview بروتوكول مزامنة Binance v1.3 - Resilient Connection
 * تم تحسين استقرار الاتصال ومعالجة الأخطاء بصمت لضمان استمرارية النبض السعري.
 */
export function useBinanceSync(symbols: any[]) {
  const updatePrice = useMarketStore(state => state.updatePrice);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    
    // تصفية الرموز التابعة لبينانس فقط والموجود لها رمز تداول
    const binanceSymbols = symbols?.filter(s => s.priceSource === 'binance' && s.binanceSymbol) || [];
    
    if (binanceSymbols.length === 0) {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      return;
    }

    const binanceMap = new Map<string, string>();
    const streams: string[] = [];

    binanceSymbols.forEach(s => {
      const cleanSymbol = s.binanceSymbol.replace('/', '').toUpperCase();
      binanceMap.set(cleanSymbol, s.id);
      streams.push(`${cleanSymbol.toLowerCase()}@ticker`);
    });

    const connect = () => {
      if (!isMounted.current || streams.length === 0) return;
      
      if (wsRef.current) {
        wsRef.current.close();
      }

      try {
        const wsUrl = `wss://stream.binance.com:9443/stream?streams=${streams.join('/')}`;
        const ws = new WebSocket(wsUrl);
        
        ws.onopen = () => {
          if (!isMounted.current) return;
        };

        ws.onmessage = (event) => {
          if (!isMounted.current) return;
          try {
            const payload = JSON.parse(event.data);
            const ticker = payload.data;
            if (ticker && ticker.s) {
              const symbolId = binanceMap.get(ticker.s.toUpperCase());
              if (symbolId) {
                updatePrice(symbolId, parseFloat(ticker.c), parseFloat(ticker.P), {
                  high: parseFloat(ticker.h),
                  low: parseFloat(ticker.l),
                  volume: parseFloat(ticker.v)
                });
              }
            }
          } catch (e) {
            // صامت في حال فشل تحليل رسالة فردية
          }
        };

        ws.onclose = () => {
          if (isMounted.current) {
            if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
            reconnectTimeoutRef.current = setTimeout(connect, 5000);
          }
        };

        ws.onerror = () => {
          if (wsRef.current) wsRef.current.close();
        };

        wsRef.current = ws;
      } catch (err) {
        if (isMounted.current) {
          if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
          reconnectTimeoutRef.current = setTimeout(connect, 5000);
        }
      }
    };

    connect();

    return () => {
      isMounted.current = false;
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [symbols, updatePrice]);
}
