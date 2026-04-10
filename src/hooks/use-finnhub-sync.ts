
'use client';

import { useEffect, useRef } from 'react';
import { useMarketStore } from '@/store/use-market-store';
import { getFinnhubTokens, getFinnhubPrice } from '@/app/actions/finnhub-actions';

/**
 * @fileOverview بروتوكول مزامنة Finnhub اللحظي v2.0 - WebSocket Integration
 * يستبدل نظام Polling بنظام WebSocket لتقليل استهلاك البيانات وضمان سرعة وميضية.
 */
export function useFinnhubSync(symbols: any[]) {
  const updatePrice = useMarketStore(state => state.updatePrice);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const tokensRef = useRef<string[]>([]);
  const currentTokenIdx = useRef(0);
  const isMounted = useRef(true);

  // رموز Finnhub المستهدفة للمزامنة
  const finnhubSymbols = useMemo(() => 
    symbols?.filter(s => s.priceSource === 'finnhub' && (s.externalTicker || s.code)) || []
  , [symbols]);

  useEffect(() => {
    isMounted.current = true;

    const startSync = async () => {
      if (finnhubSymbols.length === 0) {
        if (wsRef.current) wsRef.current.close();
        return;
      }

      // 1. جلب الإحصائيات الأساسية (تغيير يومي، أعلى، أدنى) عبر REST مرة واحدة
      // لضمان وجود بيانات غنية في الواجهة قبل تدفق السعر
      for (const s of finnhubSymbols) {
        getFinnhubPrice(s.externalTicker || s.code).then(res => {
          if (res.success && res.price) {
            updatePrice(s.id, res.price, res.changePercent, {
              high: res.high,
              low: res.low,
              volume: res.volume
            });
          }
        });
      }

      // 2. تهيئة الاتصال اللحظي (WebSocket)
      const res = await getFinnhubTokens();
      if (res.success && res.tokens.length > 0) {
        tokensRef.current = res.tokens;
        connect();
      }
    };

    const connect = () => {
      if (!isMounted.current || tokensRef.current.length === 0) return;

      const token = tokensRef.current[currentTokenIdx.current];
      const wsUrl = `wss://ws.finnhub.io?token=${token}`;
      
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        if (!isMounted.current) return;
        // الاشتراك في كافة الرموز النشطة
        finnhubSymbols.forEach(s => {
          ws.send(JSON.stringify({ type: 'subscribe', symbol: s.externalTicker || s.code }));
        });
      };

      ws.onmessage = (event) => {
        if (!isMounted.current) return;
        try {
          const payload = JSON.parse(event.data);
          if (payload.type === 'trade' && payload.data) {
            payload.data.forEach((trade: any) => {
              const symbolId = finnhubSymbols.find(s => (s.externalTicker || s.code) === trade.s)?.id;
              if (symbolId) {
                // تحديث السعر فقط (WebSocket Finnhub يعطي صفقات لحظية)
                updatePrice(symbolId, trade.p);
              }
            });
          }
        } catch (e) {}
      };

      ws.onclose = () => {
        if (isMounted.current) {
          // بروتوكول التدوير: جرب المفتاح التالي في حال الفشل
          currentTokenIdx.current = (currentTokenIdx.current + 1) % tokensRef.current.length;
          if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
          reconnectTimeoutRef.current = setTimeout(connect, 5000);
        }
      };

      ws.onerror = () => {
        if (wsRef.current) wsRef.current.close();
      };

      wsRef.current = ws;
    };

    startSync();

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
  }, [finnhubSymbols, updatePrice]);
}

import { useMemo } from 'react';
