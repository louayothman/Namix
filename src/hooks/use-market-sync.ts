
'use client';

import { useEffect, useRef } from 'react';
import { useMarketStore } from '@/store/use-market-store';
import { getLiveInternalPrice } from '@/lib/internal-market';
import { getAlphaVantagePrice } from '@/app/actions/alphavantage-actions';

/**
 * @fileOverview بروتوكول المزامنة السوقية الموحد v8.0 - Hybrid Global Sync
 * تم إضافة دعم التحديث الدوري لـ Alpha Vantage لحل مشكلة السعر الصفري.
 */

export function useMarketSync(symbols: any[]) {
  const updatePrice = useMarketStore(state => state.updatePrice);
  const wsRef = useRef<WebSocket | null>(null);
  const externalTimerRef = useRef<any>(null);
  const internalTimerRef = useRef<any>(null);
  const isMounted = useRef(true);

  const symbolsKey = JSON.stringify(symbols?.map(s => s.id + s.updatedAt));

  useEffect(() => {
    isMounted.current = true;
    if (!symbols || symbols.length === 0) return;

    // 1. بروتوكول Binance (WebSocket)
    const binanceMap = new Map<string, string>();
    const activeStreams: string[] = [];

    symbols.forEach(s => {
      if (s.priceSource === 'binance' && s.binanceSymbol) {
        const cleanSymbol = s.binanceSymbol.replace('/', '').toUpperCase();
        binanceMap.set(cleanSymbol, s.id);
        activeStreams.push(`${cleanSymbol.toLowerCase()}@ticker`);
      }
    });

    if (activeStreams.length > 0) {
      const connectBinance = () => {
        if (!isMounted.current) return;
        if (wsRef.current) wsRef.current.close();
        
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
          if (isMounted.current) setTimeout(connectBinance, 3000);
        };
        wsRef.current = ws;
      };
      connectBinance();
    }

    // 2. بروتوكول الأصول الخارجية الهجين (Alpha Vantage / TwelveData)
    // نستخدم التحديث الدوري (Polling) نظراً لمحدودية الـ WebSocket المجاني لهذه المزودات
    const externalSymbols = symbols.filter(s => s.priceSource === 'alphavantage' || s.priceSource === 'twelvedata');
    if (externalSymbols.length > 0) {
      if (externalTimerRef.current) clearInterval(externalTimerRef.current);
      
      const syncExternal = async () => {
        for (const s of externalSymbols) {
          if (!isMounted.current) break;
          
          if (s.priceSource === 'alphavantage') {
            const res = await getAlphaVantagePrice(s.externalTicker || s.code);
            if (res.success) {
              updatePrice(s.id, res.price!, res.changePercent, {
                high: res.high!,
                low: res.low!,
                volume: res.volume!
              });
            }
          }
          // يمكن إضافة TwelveData هنا لاحقاً بنفس المنطق
        }
      };

      syncExternal();
      // تحديث كل 30 ثانية للأصول العالمية لضمان البقاء ضمن حدود الـ API
      externalTimerRef.current = setInterval(syncExternal, 30000);
    }

    // 3. محرك الأصول الداخلية
    const internalSymbols = symbols.filter(s => s.priceSource === 'internal');
    if (internalSymbols.length > 0) {
      if (internalTimerRef.current) clearInterval(internalTimerRef.current);
      internalTimerRef.current = setInterval(() => {
        if (!isMounted.current) return;
        internalSymbols.forEach(s => {
          const price = getLiveInternalPrice(s.id, s);
          updatePrice(s.id, price, 0.42, { high: price * 1.02, low: price * 0.98, volume: 1500000 });
        });
      }, 500);
    }

    return () => {
      isMounted.current = false;
      if (wsRef.current) wsRef.current.close();
      if (externalTimerRef.current) clearInterval(externalTimerRef.current);
      if (internalTimerRef.current) clearInterval(internalTimerRef.current);
    };
  }, [symbolsKey, updatePrice]);
}
