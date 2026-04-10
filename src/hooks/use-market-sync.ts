
'use client';

import { useBinanceSync } from './use-binance-sync';
import { useAlphaSync } from './use-alpha-sync';
import { useInternalSync } from './use-internal-sync';

/**
 * @fileOverview مجمع المزامنة السوقية v2.0 - Orchestrator
 * يقوم بتجميع كافة بروتوكولات المزامنة المنفصلة لضمان شمولية التغطية السعرية.
 */
export function useMarketSync(symbols: any[]) {
  // تفعيل كافة خطوط المزامنة بشكل مستقل
  useBinanceSync(symbols || []);
  useAlphaSync(symbols || []);
  useInternalSync(symbols || []);
}
