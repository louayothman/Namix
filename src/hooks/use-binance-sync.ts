
'use client';

import { useEffect, useRef } from 'react';
import { useMarketStore } from '@/store/use-market-store';

/**
 * @fileOverview بروتوكول مزامنة Binance v1.0
 * يدير الاتصال المباشر عبر WebSockets لجلب أسعار الكريبتو اللحظية.
 */
export function useBinanceSync(symbols: any[]) {
  const updatePrice = useMarketStore(state => state.updatePrice);
  const wsRef = useRef<WebSocket | null>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    const binanceSymbols = symbols.filter(s => s.priceSource === 'binance' && s.binanceSymbol);
    
    if (binanceSymbols.length === 0) return;

    const binanceMap = new Map<string, string>();
    const streams: string[] = [];

    binanceSymbols.forEach(s => {
      const cleanSymbol = s.binanceSymbol.replace('/', '').toUpperCase();
      binanceMap.set(cleanSymbol, s.id);
      streams.push(`${cleanSymbol.toLowerCase()}@ticker`);
    });

    const connect = () => {
      if (!isMounted.current) return;
      if (wsRef.current) wsRef.current.close();

      const ws = new WebSocket(`wss://stream.binance.com:9443/stream?streams=${streams.join('/')}`);
      
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
        } catch (e) {}
      };

      ws.onclose = () => {
        if (isMounted.current) setTimeout(connect, 3000);
      };

      wsRef.current = ws;
    };

    connect();

    return () => {
      isMounted.current = false;
      if (wsRef.current) wsRef.current.close();
    };
  }, [symbols, updatePrice]);
}
