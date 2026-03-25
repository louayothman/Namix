
'use client';

import { create } from 'zustand';

/**
 * @fileOverview مستودع البيانات السوقية السيادي v2.0
 * يدير تدفق الأسعار الحية والإحصائيات الشاملة بشكل مركزي.
 */

interface SymbolStats {
  high: number;
  low: number;
  volume: number;
}

interface MarketState {
  prices: Record<string, number>;
  dailyChanges: Record<string, number>;
  marketStats: Record<string, SymbolStats>;
  updatePrice: (symbol: string, price: number, change?: number, stats?: SymbolStats) => void;
  bulkUpdate: (data: Record<string, number>) => void;
}

export const useMarketStore = create<MarketState>((set) => ({
  prices: {},
  dailyChanges: {},
  marketStats: {},
  updatePrice: (symbol, price, change, stats) => set((state) => ({
    prices: { ...state.prices, [symbol]: price },
    dailyChanges: change !== undefined ? { ...state.dailyChanges, [symbol]: change } : state.dailyChanges,
    marketStats: stats ? { ...state.marketStats, [symbol]: stats } : state.marketStats
  })),
  bulkUpdate: (data) => set((state) => ({
    prices: { ...state.prices, ...data }
  })),
}));
