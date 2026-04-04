
'use client';

/**
 * @fileOverview NAMIX AI CENTRAL ENGINE v2.0 - Isolated Core
 * المحرك الاستخباراتي المركزي المعزول؛ يدير العمليات التحليلية لكافة أصول المنصة.
 * تم تصميم المحرك كـ Singleton لضمان توحيد الرؤية التقنية عبر كافة المكونات.
 */

import { analyzeMarket, AIAnalysisResult, AICalibration } from "./namix-ai-engine";

export class NamixAI {
  private static instance: NamixAI;
  private currentCalibration: AICalibration = {
    rsiOversold: 35,
    rsiOverbought: 65,
    confidenceThreshold: 85,
    volatilityWeight: 8
  };

  private constructor() {}

  public static getInstance(): NamixAI {
    if (!NamixAI.instance) {
      NamixAI.instance = new NamixAI();
    }
    return NamixAI.instance;
  }

  /**
   * يضبط معايرة المحرك بناءً على إعدادات المشرف
   */
  public calibrate(settings: Partial<AICalibration>) {
    this.currentCalibration = { ...this.currentCalibration, ...settings };
  }

  /**
   * يقوم بإجراء تحليل استخباراتي عميق لأصل مالي محدد
   */
  public analyze(asset: any, livePrice: number | null, durations: any[] = []): AIAnalysisResult | null {
    if (!asset || livePrice === null) return null;
    
    return analyzeMarket(
      asset, 
      livePrice, 
      this.currentCalibration, 
      durations
    );
  }

  /**
   * يتحقق من جدوى التنفيذ الفوري بناءً على عتبة الثقة
   */
  public isExecutionViable(analysis: AIAnalysisResult): boolean {
    return analysis.confidence >= this.currentCalibration.confidenceThreshold;
  }
}

// تصدير نسخة موحدة للمنصة
export const namixAI = NamixAI.getInstance();
