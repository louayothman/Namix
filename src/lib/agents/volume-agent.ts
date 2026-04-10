import axios from "axios";

/**
 * @fileOverview Volume Agent v5.0 - Nano-Liquidity Pulse
 * يحلل تدفق السيولة في آخر 10 دقائق فقط لتحديد قوة الدفع الحالية.
 */

export async function volumeAgent(symbol: string) {
  try {
    const res = await axios.get(
      `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=1m&limit=10`
    );

    const klines = res.data;
    const volumes = klines.map((k: any) => parseFloat(k[5]));
    const avgVolume = volumes.reduce((a: number, b: number) => a + b, 0) / volumes.length;
    const lastVolume = volumes[volumes.length - 1];

    // سكور السيولة: يقارن حجم آخر دقيقة بمتوسط الـ 10 دقائق
    // إذا كان حجم التداول الحالي أعلى من المتوسط -> سكور مرتفع (دفع قوي)
    const score = Math.max(0.1, Math.min(1, lastVolume / (avgVolume || 1) * 0.5));

    return {
      name: "Volume",
      score,
      volume: lastVolume,
      avgVolume
    };
  } catch (error) {
    return { name: "Volume", score: 0.5, volume: 0, avgVolume: 0 };
  }
}
