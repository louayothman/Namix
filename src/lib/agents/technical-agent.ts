import axios from "axios";

/**
 * @fileOverview Technical Agent v4.0 - Granular Probability Engine
 * يحلل التغير السعري اللحظي ويحوله إلى نتيجة احتمالية دقيقة (ليست ثابتة).
 */

export async function technicalAgent(symbol: string) {
  try {
    const res = await axios.get(
      `https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`
    );

    const change = parseFloat(res.data.priceChangePercent);
    
    // معادلة احتمالية: 0.5 هو التعادل. كل 1% تغير يضيف أو يطرح 0.1 من السكور.
    // يتم حصر النتيجة (Clamp) بين 0 و 1.
    const score = Math.max(0, Math.min(1, 0.5 + (change / 10)));

    return {
      name: "Technical",
      score,
      change,
    };
  } catch (error) {
    return { name: "Technical", score: 0.5, change: 0 };
  }
}
