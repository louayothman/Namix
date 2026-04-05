/**
 * @fileOverview Memory Engine v3.0 - Final Structure
 * محرك الذاكرة النانوية لتعلم أنماط السوق خلال الجلسة الحالية.
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

  return { buys, sells };
}
