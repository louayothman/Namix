"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Lock, Zap, Cpu, Globe, Activity, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * @fileOverview مصفوفة المميزات (Bento Grid) v1.0
 * تصميم فريد يعتمد على بطاقات زجاجية مظلمة بتوزيع غير متناظر للفخامة.
 */
export function FeatureBento() {
  const items = [
    { title: "أمان سيادي", desc: "تشفير بيانات عسكري يضمن لك خصوصية مطلقة.", icon: Lock, color: "text-blue-400", bg: "bg-blue-500/5", grid: "md:col-span-2 md:row-span-2" },
    { title: "تنفيذ وميضي", desc: "سرعة في تنفيذ العمليات بلمح البصر.", icon: Zap, color: "text-[#f9a885]", bg: "bg-orange-500/5", grid: "md:col-span-2" },
    { title: "ذكاء عالمي", desc: "محرك تحليل يقرأ نبض الأسواق.", icon: Cpu, color: "text-purple-400", bg: "bg-purple-500/5", grid: "md:col-span-1" },
    { title: "تغطية شاملة", desc: "سيولة مدعومة لحظياً.", icon: Globe, color: "text-emerald-400", bg: "bg-emerald-500/5", grid: "md:col-span-1" }
  ];

  return (
    <section className="py-40 px-6 relative">
      <div className="container mx-auto space-y-20">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center md:text-right space-y-4"
          dir="rtl"
        >
          <h2 className="text-white">قوة الابتكار في <br /> <span className="text-white/20">كل بكسل.</span></h2>
          <p className="text-white/40 font-medium max-w-xl md:mr-0 md:ml-auto">نظام ناميكس مصمم للنخبة؛ حيث تلتقي القوة التقنية بالجمال المعماري الرقمي.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-6 h-full md:h-[600px]">
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={cn("relative group", item.grid)}
            >
              <Card className="h-full border-none bg-white/5 backdrop-blur-3xl rounded-[48px] overflow-hidden transition-all duration-700 hover:bg-white/10 hover:shadow-2xl hover:shadow-black/40 border border-white/5">
                <CardContent className="p-10 h-full flex flex-col justify-between relative z-10" dir="rtl">
                  <div className={cn("h-16 w-16 rounded-[24px] flex items-center justify-center shadow-inner transition-transform group-hover:scale-110", item.bg)}>
                    <item.icon size={32} className={item.color} />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-black text-white">{item.title}</h3>
                    <p className="text-white/40 font-bold leading-relaxed">{item.desc}</p>
                  </div>
                </CardContent>
                <div className="absolute -bottom-10 -left-10 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity duration-1000">
                   <item.icon size={250} />
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}