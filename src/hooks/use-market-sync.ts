
'use client';

import { useBinanceSync } from './use-binance-sync';
import { useAlphaSync } from './use-alpha-sync';
import { useTwelveDataSync } from './use-twelve-data-sync';
import { useInternalSync } from './use-internal-sync';

/**
 * @fileOverview مجمع المزامنة السوقية v2.1 - Global Orchestrator
 * يقوم بتجميع كافة بروتوكولات المزامنة المنفصلة لضمان شمولية التغطية السعرية.
 */
export function useMarketSync(symbols: any[]) {
  // تفعيل كافة خطوط المزامنة بشكل مستقل لضمان استقرار النبض السعري
  useBinanceSync(symbols || []);
  useAlphaSync(symbols || []);
  useTwelveDataSync(symbols || []);
  useInternalSync(symbols || []);
}
