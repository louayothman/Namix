
'use client';

import { useBinanceSync } from './use-binance-sync';
import { useFinnhubSync } from './use-finnhub-sync';
import { useInternalSync } from './use-internal-sync';

/**
 * @fileOverview مجمع المزامنة السوقية v3.0 - Global Orchestrator
 * يقوم بتجميع بروتوكولات Binance و Finnhub والمحرك الداخلي.
 */
export function useMarketSync(symbols: any[]) {
  // تفعيل كافة خطوط المزامنة بشكل مستقل
  useBinanceSync(symbols || []);
  useFinnhubSync(symbols || []);
  useInternalSync(symbols || []);
}
