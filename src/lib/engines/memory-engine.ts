/**
 * @fileOverview Memory Engine v2.0
 * محرك الذاكرة النانوية لتعلم أنماط السوق خلال الجلسة الحالية.
 */

let memory: any[] = [];

export function memoryEngine(entry: any) {
  memory.push({
    ...entry,
    time: Date.now(),
  });

  // الحفاظ على آخر 1000 سجل فقط لضمان سرعة الأداء
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
