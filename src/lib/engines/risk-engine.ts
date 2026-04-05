/**
 * @fileOverview Risk Engine v2.0
 * صمام الأمان الذي يقيم سلامة الصفقة قبل السماح بالتنفيذ.
 */

export function riskEngine(decision: string, tech: any, volume: any) {
  let risk = "LOW";

  // إذا كان أحد الوكلاء يعطي إشارة ضعف شديدة (أقل من 40%) ترتفع المخاطرة فوراً
  if (tech.score < 0.4 || volume.score < 0.4) {
    risk = "HIGH";
  }

  // بروتوكول منع الشراء عند المخاطرة العالية (DANGEROUS)
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
