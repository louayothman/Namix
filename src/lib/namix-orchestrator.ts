/**
 * @fileOverview NAMIX AI Orchestrator v3.0 - Final Structure
 * العقل المركزي الذي يدير الوكلاء المتعددين ويصدر القرار النهائي.
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

  const decisionScore = (tech.score * 0.5) + (volume.score * 0.3);

  let decision = "HOLD";
  if (decisionScore > 0.6) decision = "BUY";
  if (decisionScore < 0.4) decision = "SELL";

  const risk = riskEngine(decision, tech, volume);

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
