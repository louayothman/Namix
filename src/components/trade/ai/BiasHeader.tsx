
"use client";

import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

interface BiasHeaderProps {
  bias: 'Long' | 'Short' | 'Neutral';
}

/**
 * TacticalScanner - مصفوفة الجزيئات الاستخباراتية النقية
 * عرض مينيماليست يعتمد فقط على الجزيئات المنبعثة وشعاع المسح الشفاف.
 */
function TacticalScanner({ bias }: { bias: string }) {
  const isLong = bias === 'Long';
  const isShort = bias === 'Short';
  
  const accentColor = isLong ? "#10b981" : isShort ? "#ef4444" : "#3b82f6";

  // توليد جزيئات ثابتة لضمان استقرار الهيدريشن وتجنب التشتت
  const particles = useMemo(() => [
    { delay: 0, x: 12, y: -10 },
    { delay: 0.5, x: -15, y: 12 },
    { delay: 1, x: 10, y: 15 },
    { delay: 1.5, x: -12, y: -12 },
    { delay: 2, x: 18, y: 0 },
  ], []);

  return (
    <div className="relative h-12 w-12 flex items-center justify-center shrink-0">
      {/* 1. شعاع المسح الراداري النقي - بدون خلفيات أو ظلال */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: isLong ? 3 : isShort ? 5 : 7, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,transparent_0deg,rgba(255,255,255,0)_180deg,currentColor_360deg)] opacity-20"
        style={{ color: accentColor }}
      />

      {/* 2. الجزيئات المنبعثة عشوائياً - تمثل نبض البيانات */}
      <div className="absolute inset-0 flex items-center justify-center">
         {particles.map((p, i) => (
           <motion.div
             key={i}
             animate={{ 
               opacity: [0, 0.6, 0],
               scale: [0, 1, 0],
               x: [0, p.x],
               y: [0, p.y]
             }}
             transition={{ 
               duration: 2.5, 
               repeat: Infinity, 
               delay: p.delay,
               ease: "easeOut"
             }}
             className="absolute h-0.5 w-0.5 rounded-full"
             style={{ backgroundColor: accentColor }}
           />
         ))}
      </div>

      {/* 3. نقطة المركز الميكروية */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="h-1 w-1 rounded-full"
        style={{ backgroundColor: accentColor }}
      />
    </div>
  );
}

export function BiasHeader({ bias }: BiasHeaderProps) {
  // استخدام المستوى المؤسساتي للمصطلحات بناءً على طلب المستخدم
  const labelMap = {
    Long: 'مسار نمو',
    Short: 'تصحيح سعري',
    Neutral: 'منطقة ترقب'
  };

  const textMap = {
    Long: 'text-emerald-500',
    Short: 'text-red-500',
    Neutral: 'text-blue-500'
  };

  const badgeMap = {
    Long: 'bg-emerald-500 text-white',
    Short: 'bg-red-500 text-white',
    Neutral: 'bg-blue-500 text-white'
  };

  return (
    <section className="flex items-center justify-between px-4 font-body select-none" dir="rtl">
      {/* القسم الأيمن: النص الاستراتيجي المؤسساتي - مطهر من أيقونات الرعد */}
      <div className="space-y-0.5 text-right">
        <div className="flex items-center gap-3 justify-end">
          <h4 className={cn("text-xl font-black tracking-normal transition-colors duration-1000", textMap[bias])}>
            {labelMap[bias]}
          </h4>
          <Badge className={cn("font-black text-[8px] px-2 py-0.5 border-none shadow-sm transition-all duration-1000 tracking-normal", badgeMap[bias])}>
            {bias.toUpperCase()}
          </Badge>
        </div>
        <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest leading-none tracking-normal">Institutional Bias Protocol</p>
      </div>

      {/* القسم الأيسر: مصفوفة الجزيئات المقابلة للنص */}
      <TacticalScanner bias={bias} />
    </section>
  );
}
