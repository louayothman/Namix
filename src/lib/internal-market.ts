
'use client';

/**
 * @fileOverview NAMIX DETERMINISTIC INTERNAL MARKET ENGINE v1.0
 * Generates consistent OHLC candles and live prices based on Admin settings history.
 * Ensures all users see identical price movements for internal assets.
 */

import { OHLC } from './indicators';

interface MarketSettings {
  minPrice: number;
  maxPrice: number;
  volatility: number;
  trendBias: 'up' | 'down' | 'neutral';
  timestamp: number;
}

/**
 * Seeded random number generator to ensure consistency across clients.
 */
function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

/**
 * Generates a single candle for a specific minute.
 */
export function generateInternalCandle(
  symbolId: string,
  time: number,
  settings: MarketSettings
): OHLC {
  const seed = parseInt(symbolId.substring(0, 5), 36) + time;
  const range = settings.maxPrice - settings.minPrice;
  const mid = settings.minPrice + range / 2;
  
  // Base price logic using a slow sine wave combined with admin trend
  const drift = settings.trendBias === 'up' ? 0.2 : settings.trendBias === 'down' ? -0.2 : 0;
  const wave = Math.sin(time / 3600) * (range * 0.3); // Hourly cycle
  
  const basePrice = mid + wave + (drift * range * 0.5);
  
  // Noise and Volatility
  const noise = (seededRandom(seed) - 0.5) * settings.volatility * (range * 0.05);
  
  const close = Math.max(settings.minPrice, Math.min(settings.maxPrice, basePrice + noise));
  const open = Math.max(settings.minPrice, Math.min(settings.maxPrice, close - (seededRandom(seed + 1) - 0.5) * (settings.volatility * 2)));
  
  const high = Math.max(open, close) + seededRandom(seed + 2) * (settings.volatility);
  const low = Math.min(open, close) - seededRandom(seed + 3) * (settings.volatility);

  return {
    time,
    open,
    high,
    low,
    close
  };
}

/**
 * Generates a full history of candles for an internal asset.
 */
export function generateInternalHistory(
  symbolId: string,
  currentSettings: any,
  limit: number = 1000
): OHLC[] {
  const history: OHLC[] = [];
  const now = Math.floor(Date.now() / 1000 / 60) * 60;
  
  // Settings for generation (In a real scenario, we'd fetch logs from Firestore)
  // For MVP, we use the current settings as the source of truth for the generation.
  const settings: MarketSettings = {
    minPrice: currentSettings.minPrice || 100,
    maxPrice: currentSettings.maxPrice || 200,
    volatility: currentSettings.volatility || 5,
    trendBias: currentSettings.trendBias || 'neutral',
    timestamp: now
  };

  for (let i = limit; i >= 0; i--) {
    const time = now - i * 60;
    history.push(generateInternalCandle(symbolId, time, settings));
  }

  return history;
}

/**
 * Generates a live tick price based on current minute's candle progress.
 */
export function getLiveInternalPrice(symbolId: string, currentSettings: any): number {
  const now = Math.floor(Date.now() / 1000);
  const minute = Math.floor(now / 60) * 60;
  const candle = generateInternalCandle(symbolId, minute, currentSettings);
  
  // Interpolate between open and close based on second within the minute
  const progress = (now % 60) / 60;
  const jitter = (seededRandom(now) - 0.5) * (currentSettings.volatility * 0.2);
  
  return candle.open + (candle.close - candle.open) * progress + jitter;
}
