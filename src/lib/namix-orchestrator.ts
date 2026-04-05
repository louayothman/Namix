/**
 * @fileOverview NAMIX AI Orchestrator v4.0 - Intelligence & Heatmap Nexus
 * العقل المركزي الذي يجمع نتائج الوكلاء ويصيغ خريطة الحرارة الفنية.
 */

import { technicalAgent } from "./agents/technical-agent";
import { volumeAgent } from "./agents/volume-agent";
import { riskEngine } from "./engines/risk-engine";
import { memoryEngine } from "./engines/memory-engine";

export async function runNamix(symbol: string) {
  const cleanSymbol = symbol.replace('/', '').toUpperCase();

  const [tech, volume] = await Promise.all([
    technicalAgent(cleanSymbol),
    volumeAgent(cleanSymbol)
  ]);

  // حساب النتيجة النهائية بناءً على أوزان استراتيجية
  const decisionScore = (tech.score * 0.6) + (volume.score * 0.4);

  let decision = "HOLD";
  if (decisionScore > 0.58) decision = "BUY";
  if (decisionScore < 0.42) decision = "SELL";

  const risk = riskEngine(decision, tech, volume);

  // توليد مصفوفة التدقيق الفني (Heatmap Data) لإثبات "التفكير"
  const heatmap = [
    { 
      label: "قوة الزخم (RSI Context)", 
      status: tech.change > 0.5 ? "bullish" : tech.change < -0.5 ? "bearish" : "neutral", 
      val: tech.change.toFixed(2) + "%" 
    },
    { 
      label: "كثافة السيولة (Inflow)", 
      status: volume.score > 0.6 ? "bullish" : volume.score < 0.3 ? "bearish" : "neutral", 
      val: volume.volume.toFixed(0) 
    },
    { 
      label: "تقاطع المتوسطات (EMA)", 
      status: tech.score > 0.5 ? "bullish" : "bearish", 
      val: "Active Sync" 
    },
    { 
      label: "ثبات القناة (Stability)", 
      status: Math.abs(tech.change) < 1 ? "bullish" : "neutral", 
      val: "Stabilized" 
    }
  ];

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
    heatmap,
    timestamp: new Date().toISOString()
  };
}
