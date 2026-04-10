
'use server';

/**
 * @fileOverview FINNHUB INTERFACE - Retired
 * This protocol has been decommissioned.
 */

export async function getFinnhubTokens() {
  return { success: false, error: "Protocol Deactivated" };
}

export async function searchFinnhubSymbols(query: string) {
  return { success: false, error: "Protocol Deactivated" };
}

export async function getFinnhubPrice(symbol: string) {
  return { success: false, error: "Protocol Deactivated" };
}

export async function getFinnhubCandles(symbol: string, resolution: string, from: number, to: number) {
  return { success: false, error: "Protocol Deactivated" };
}
