'use client';

/**
 * @fileOverview محرك الاستجابة اللمسية v1.0 - Namix Haptic Engine
 * يدير الاهتزازات التكتيكية للهواتف لتعزيز الشعور بالتطبيق الأصلي.
 */

export const hapticFeedback = {
  /** اهتزاز خفيف جداً للنقرات العادية */
  light: () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(10);
    }
  },
  
  /** اهتزاز متوسط للعمليات الهامة */
  medium: () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(25);
    }
  },
  
  /** اهتزاز نبضي مزدوج للنجاح */
  success: () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([30, 50, 30]);
    }
  },
  
  /** اهتزاز متقطع للتحذير أو الخطأ */
  error: () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([50, 100, 50, 100]);
    }
  }
};
