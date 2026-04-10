
'use client';

import { useEffect, useRef } from 'react';
import { useMarketStore } from '@/store/use-market-store';

/**
 * @fileOverview بروتوكول مزامنة Binance v1.4 - Resilient Connection
 * Updated to keep logic simple while relying on actions for signed data.
 * Public ticker data doesn't require keys, so this hook remains public-ready.
 */
export function useBinanceSync(symbols: any[]) {
  const updatePrice = useMarketStore(state => state.updatePrice);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    
    const binanceSymbols = symbols?.filter(s => s.priceSource === 'binance' && (s.binanceSymbol || s.code)) || [];
    
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
      const rawCode = s.binanceSymbol || s.code;
      const cleanSymbol = rawCode.replace('/', '').toUpperCase();
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
          } catch (e) {}
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
