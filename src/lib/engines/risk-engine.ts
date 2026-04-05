/**
 * @fileOverview Risk Engine v3.0 - Final Structure
 * صمام الأمان الذي يقيم سلامة الصفقة قبل السماح بالتنفيذ.
 */

export function riskEngine(decision: string, tech: any, volume: any) {
  let risk = "LOW";

  if (tech.score < 0.4 || volume.score < 0.4) {
    risk = "HIGH";
  }

  if (decision === "BUY" && risk === "HIGH") {
    return {
      level: "DANGEROUS",
      action: "AVOID TRADE",
      reason: "عجز في الزخم أو السيولة يمنع الدخول الآمن حالياً."
    };
  }

  return {
    level: risk,
    action: decision,
    reason: risk === "LOW" ? "توافق استراتيجي بين الوكلاء." : "مخاطرة مقبولة ضمن حدود المنظومة."
  };
}
