
'use client';

/**
 * @fileOverview Risk Engine v1.0
 * Evaluates the safety of a trade based on agent scores and decision bias.
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
      reason: "عجز في السيولة أو ضعف في الزخم الفني يمنع الدخول الآمن."
    };
  }

  if (decision === "SELL" && risk === "HIGH") {
    return {
      level: "CRITICAL",
      action: "HOLD POSITION",
      reason: "تذبذب عالي قد يؤدي لانزلاقات سعرية؛ ينصح بالترقب."
    };
  }

  return {
    level: risk,
    action: decision,
    reason: risk === "LOW" ? "توافق استراتيجي بين السيولة والزخم الفني." : "مخاطرة مقبولة ضمن حدود بروتوكول ناميكس."
  };
}
