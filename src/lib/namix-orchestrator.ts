/**
 * @fileOverview NAMIX AI Orchestrator v6.0 - Intelligence & Generative Nexus
 * العقل المركزي الذي يجمع نتائج الوكلاء ويستدعي Gemini لصياغة التبرير المنطقي.
 */

import { technicalAgent } from "./agents/technical-agent";
import { volumeAgent } from "./agents/volume-agent";
import { riskEngine } from "./engines/risk-engine";
import { memoryEngine } from "./engines/memory-engine";
import { ai } from "@/ai/genkit";
import { googleAI } from "@genkit-ai/google-genai";

export async function runNamix(symbol: string) {
  const cleanSymbol = symbol.replace('/', '').toUpperCase();

  // 1. جلب البيانات من الوكلاء التقنيين
  const [tech, volume] = await Promise.all([
    technicalAgent(cleanSymbol),
    volumeAgent(cleanSymbol)
  ]);

  // 2. حساب النتيجة الموزونة
  const decisionScore = (tech.score * 0.6) + (volume.score * 0.4);

  let decision = "HOLD";
  if (decisionScore > 0.58) decision = "BUY";
  if (decisionScore < 0.42) decision = "SELL";

  const risk = riskEngine(decision, tech, volume);

  // 3. الوكيل الاستنتاجي: توليد تبرير منطقي فريد عبر Gemini
  let reasoning = "جاري تحليل المعطيات...";
  try {
    const response = await ai.generate({
      model: googleAI.model('gemini-2.5-flash'),
      prompt: `أنت المحلل الاستراتيجي لمنصة NAMIX. حلل البيانات التالية للرمز ${cleanSymbol}:
      - تغير السعر: ${tech.change}%
      - سكور الوكيل الفني: ${tech.score}
      - حجم التداول: ${volume.volume}
      - القرار المقترح: ${decision}
      - مستوى المخاطرة: ${risk.level}
      
      اكتب تبريراً منطقياً قصيراً جداً (جملة واحدة) بأسلوب مؤسساتي فخم يوضح للمستثمر سبب هذا القرار بناءً على السيولة والزخم.`,
    });
    reasoning = response.text;
  } catch (e) {
    reasoning = "توافق استراتيجي بين وكلاء الزخم والسيولة عند المستويات الحالية.";
  }

  // 4. بناء مصفوفة التدقيق
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
    reasoning,
    agents: { tech, volume },
    heatmap,
    timestamp: new Date().toISOString()
  };
}
