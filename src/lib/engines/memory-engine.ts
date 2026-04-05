
'use client';

/**
 * @fileOverview Memory Engine v1.0
 * Local client-side session memory for learning patterns.
 */

let memory: any[] = [];

export function memoryEngine(entry: any) {
  memory.push({
    ...entry,
    time: Date.now(),
  });

  if (memory.length > 1000) {
    memory.shift();
  }
}

export function getMemoryStats() {
  const buys = memory.filter(m => m.decision === "BUY").length;
  const sells = memory.filter(m => m.decision === "SELL").length;
  const total = memory.length || 1;

  return { 
    buys, 
    sells, 
    sentiment: Math.round((buys / total) * 100) 
  };
}
