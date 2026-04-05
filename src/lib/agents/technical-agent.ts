import axios from "axios";

/**
 * @fileOverview Technical Agent v2.0
 * يحلل التغير السعري خلال 24 ساعة لتحديد قوة الزخم.
 */

export async function technicalAgent(symbol: string) {
  try {
    const res = await axios.get(
      `https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`
    );

    const change = parseFloat(res.data.priceChangePercent);
    let score = 0.5;

    if (change > 2) score = 0.8;
    else if (change > 0) score = 0.6;
    else if (change < -2) score = 0.2;
    else if (change < 0) score = 0.4;

    return {
      name: "Technical",
      score,
      change,
    };
  } catch (error) {
    // في حال فشل الاتصال، يعيد نتيجة محايدة لضمان استقرار المنظومة
    return { name: "Technical", score: 0.5, change: 0 };
  }
}
