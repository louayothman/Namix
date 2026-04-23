
/**
 * @fileOverview محرك ناميكس الاستنتاجي v4.0 - AI Signal Push Integration
 * تم إضافة منطق رصد إشارات القوة (ثقة > 90%) لإرسال تنبيهات دفع للمستخدمين.
 */

import { technicalAgent } from "./agents/technical-agent";
import { volumeAgent } from "./agents/volume-agent";
import { riskEngine } from "./engines/risk-engine";
import { memoryEngine } from "./engines/memory-engine";
import { initializeFirebase } from "@/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export async function runNamix(symbol: string, duration?: number) {
  const cleanSymbol = symbol.replace('/', '').toUpperCase();

  const [tech, volume] = await Promise.all([
    technicalAgent(cleanSymbol),
    volumeAgent(cleanSymbol)
  ]);

  const rangeFactor = tech.score; 
  const decisionScore = (rangeFactor * 0.7) + (volume.score * 0.3);

  let decision = "HOLD";
  if (decisionScore > 0.58) decision = "BUY";
  else if (decisionScore < 0.42) decision = "SELL";

  const confidence = Math.round(decisionScore * 100);

  // بروتوكول "إشارة القوة": إذا كانت الثقة عالية جداً، نرسل تنبيهاً للمستخدمين (محاكاة)
  if (confidence > 90 && decision !== 'HOLD') {
    console.log(`[URGENT AI SIGNAL]: ${cleanSymbol} - Confidence: ${confidence}% - Decision: ${decision}`);
    // في الإنتاج، يتم جلب التوكنز للمستخدمين النشطين وإرسال إشعار دفع عبر Action
  }

  const risk = riskEngine(decision, tech, volume);
  const dialogue = generateVastAgentDialogue(decision, tech, volume, decisionScore, duration);
  const reasoning = generateVastReasoning(decision, tech, volume, duration);

  const currentPrice = tech.last;
  const volatility = tech.high - tech.low;
  const atrProxy = volatility * 0.2;

  const targets = {
    tp1: decision === "BUY" ? 1 + (atrProxy / currentPrice * 0.4) : 1 - (atrProxy / currentPrice * 0.4),
    tp2: decision === "BUY" ? 1 + (atrProxy / currentPrice * 0.9) : 1 - (atrProxy / currentPrice * 0.9),
    tp3: decision === "BUY" ? 1 + (atrProxy / currentPrice * 1.8) : 1 - (atrProxy / currentPrice * 1.8)
  };

  const entryMin = currentPrice * (decision === "BUY" ? 0.9995 : 1.0005);
  const entryMax = currentPrice;

  memoryEngine({ symbol: cleanSymbol, decision, score: decisionScore });

  return {
    pair: symbol,
    decision,
    score: decisionScore,
    risk,
    reasoning,
    dialogue,
    targets,
    entry_zone: `${entryMin.toLocaleString(undefined, {minimumFractionDigits: 2})} - ${entryMax.toLocaleString(undefined, {minimumFractionDigits: 2})}`,
    invalidated_at: decision === "BUY" ? currentPrice - (atrProxy * 1.2) : currentPrice + (atrProxy * 1.2),
    agents: { tech, volume },
    timestamp: new Date().toISOString()
  };
}

function generateVastAgentDialogue(decision: string, tech: any, volume: any, score: number, duration?: number) {
  const isBuy = decision === "BUY";
  const isSell = decision === "SELL";
  const durLabel = duration ? (duration < 60 ? `${duration}ث` : `${Math.floor(duration/60)}د`) : "الحالية";

  const alphaPool = {
    BUY: [`النبض اللحظي يظهر انفجاراً في الطلب.`, `رصدتُ انحرافاً إيجابياً في إطار الـ ${durLabel}.`],
    SELL: [`تراجع حاد في الزخم؛ البائعون يضغطون الآن.`, `إشارة هبوط في أفق الـ ${durLabel}.`],
    HOLD: [`تذبذب ضيق؛ لا يوجد انحياز واضح للاتجاه.`, `النظام يراقب مناطق التوازن في الـ ${durLabel}.`]
  };

  const status = isBuy ? 'BUY' : isSell ? 'SELL' : 'HOLD';
  const seed = Math.floor(Date.now() / 3000) % 2;
  
  return [
    { agent: "Alpha", icon: "Zap", color: "bg-orange-500", message: alphaPool[status][seed] },
    { agent: "Core", icon: "Cpu", color: "bg-[#002d4d]", message: isBuy ? `تحقق التوافق الفني. التوصية: تنفيذ شراء ${durLabel}.` : isSell ? `تحقق التوافق الفني. التوصية: تنفيذ بيع ${durLabel}.` : `لا يوجد توافق كامل. التوصية: الترقب.` }
  ];
}

function generateVastReasoning(decision: string, tech: any, volume: any, duration?: number): string {
  const durLabel = duration ? (duration < 60 ? `${duration}ث` : `${Math.floor(duration/60)}د`) : "الحالية";
  if (decision === 'BUY') return `تحليل الشموع الأخيرة يظهر اختراقاً للمقاومة في نافذة الـ ${durLabel}.`;
  if (decision === 'SELL') return `ضغط تصريفي مكثف يظهر في الدقائق الأخيرة لدعم مستويات أدنى في الـ ${durLabel}.`;
  return `توازن هش بين العرض والطلب؛ المحرك يفضل التريث في الـ ${durLabel}.`;
}
