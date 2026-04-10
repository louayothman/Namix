
'use client';

import { useBinanceSync } from './use-binance-sync';
import { useInternalSync } from './use-internal-sync';

/**
 * @fileOverview مجمع المزامنة السوقية v5.0 - Binance & Internal Only
 * تم حصر المزامنة في Binance و الأصول الداخلية فقط.
 */
export function useMarketSync(symbols: any[]) {
  useBinanceSync(symbols || []);
  useInternalSync(symbols || []);
}
