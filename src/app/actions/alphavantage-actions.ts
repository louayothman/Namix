
'use server';

/**
 * @fileOverview ALPHA VANTAGE INTERFACE - Retired
 * This protocol has been decommissioned in favor of Finnhub.io.
 */

export async function searchAlphaVantageSymbols(keywords: string) {
  return { success: false, error: "تم تعطيل بروتوكول Alpha Vantage نهائياً." };
}

export async function getAlphaVantagePrice(symbol: string) {
  return { success: false, error: "بروتوكول Alpha Vantage خارج الخدمة." };
}
