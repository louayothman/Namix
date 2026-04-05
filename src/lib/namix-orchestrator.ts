/**
 * @fileOverview NAMIX AI Orchestrator v2.0 - Final Core Structure
 * العقل المركزي الذي يدير الوكلاء المتعددين ويصدر القرار النهائي.
 */

import { technicalAgent } from "./agents/technical-agent";
import { volumeAgent } from "./agents/volume-agent";
import { riskEngine } from "./engines/risk-engine";
import { memoryEngine } from "./engines/memory-engine";

export async function runNamix(symbol: string) {
  // تنظيف الرمز ليتوافق مع متطلبات Binance API (مثلاً BTCUSDT)
  const cleanSymbol = symbol.replace('/', '').toUpperCase();

  // 1. تشغيل الوكلاء بالتوازي لجلب البيانات الحية
  const [tech, volume] = await Promise.all([
    technicalAgent(cleanSymbol),
    volumeAgent(cleanSymbol)
  ]);

  // 2. حساب نتيجة القرار الموزونة بناءً على هيكل المنتج النهائي
  // تم تخصيص وزن 60% للتحليل الفني و 40% للسيولة
  const decisionScore = (tech.score * 0.6) + (volume.score * 0.4);

  let decision: 'BUY' | 'SELL' | 'HOLD' = "HOLD";
  if (decisionScore > 0.6) decision = "BUY";
  if (decisionScore < 0.4) decision = "SELL";

  // 3. معالجة النتيجة عبر محرك المخاطر (Risk Engine)
  const risk = riskEngine(decision, tech, volume);

  // 4. تسجيل العملية في محرك الذاكرة (Memory Engine) للتعلم من الجلسة
  memoryEngine({
    symbol: cleanSymbol,
    decision,
    score: decisionScore,
  });

  return {
    pair: symbol,
    decision,
    score: decisionScore,
    risk,
    agents: { tech, volume },
    timestamp: new Date().toISOString()
  };
}
