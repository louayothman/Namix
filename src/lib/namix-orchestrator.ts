
'use client';

import { technicalAgent } from "./agents/technical-agent";
import { volumeAgent } from "./agents/volume-agent";
import { riskEngine } from "./engines/risk-engine";
import { memoryEngine } from "./engines/memory-engine";

/**
 * @fileOverview NAMIX AI Orchestrator v1.0
 * The central brain that runs multiple agents and computes decisions.
 */

export async function runNamix(symbol: string) {
  // 1. Run Agents in Parallel
  const [tech, volume] = await Promise.all([
    technicalAgent(symbol),
    volumeAgent(symbol)
  ]);

  // 2. Compute Weighted Decision Score
  const decisionScore = (tech.score * 0.6) + (volume.score * 0.4);

  let decision = "HOLD";
  if (decisionScore > 0.6) decision = "BUY";
  if (decisionScore < 0.4) decision = "SELL";

  // 3. Process through Risk Engine
  const risk = riskEngine(decision, tech, volume);

  // 4. Update Memory
  memoryEngine({
    symbol,
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
