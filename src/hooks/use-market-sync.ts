
'use client';

import { useBinanceSync } from './use-binance-sync';
import { useFinnhubSync } from './use-finnhub-sync';
import { useInternalSync } from './use-internal-sync';

/**
 * @fileOverview مجمع المزامنة السوقية v4.0 - Clean Orchestrator
 * يقوم بتجميع بروتوكولات المزامنة المعتمدة (Binance, Finnhub, Internal).
 * تم استئصال Alpha Vantage نهائياً لضمان استقرار التدفق.
 */
export function useMarketSync(symbols: any[]) {
  // تفعيل خطوط المزامنة المعتمدة حصراً
  useBinanceSync(symbols || []);
  useFinnhubSync(symbols || []);
  useInternalSync(symbols || []);
}
