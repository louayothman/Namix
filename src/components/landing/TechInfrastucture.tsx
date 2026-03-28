'use client';

import { motion } from "framer-motion";
import { ShieldCheck, Zap, Globe, Cpu } from "lucide-react";
import { Badge } from "@/components/ui/badge";

/**
 * @fileOverview البنية التحتية التقنية v41.0
 */
export function TechInfrastucture() {
  const features = [
    { title: "تشفير سيادي كامل", desc: " نظام حماية AES-256 bits لضمان أمان المحافظ والبيانات الشخصية.", icon: ShieldCheck },
    { title: "تنفيذ فائق السرعة", desc: "ربط مباشر مع مراكز السيولة لضمان عدم حدوث انزلاق سعري.", icon: Zap },
    { title: "اتصال عابر للحدود", desc: "شبكة ناميكس تعمل عالمياً لتغطية كافة الأسواق الرقمية.", icon: Globe },
    { title: "معالجة ذكية", desc: "استخدام خوارزميات الذكاء الاصطناعي لتحليل نبض السوق.", icon: Cpu },
  ];

  return (
    <section className="py-32 bg-slate-950">
      <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((f, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="p-8 bg-white/5 rounded-[40px] border border-white/5 space-y-4"
            >
              <div className="h-12 w-12 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-500">
                <f.icon size={24} />
              </div>
              <div className="space-y-2 text-right" dir="rtl">
                <h4 className="font-black text-lg text-white">{f.title}</h4>
                <p className="text-slate-500 text-xs leading-relaxed">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-right space-y-8" dir="rtl">
          <Badge className="bg-blue-600/10 text-blue-400 border-none px-4 py-1.5 rounded-full font-black text-[9px] tracking-widest uppercase">High Performance</Badge>
          <h2 className="text-4xl md:text-6xl font-black text-white leading-tight">بنية تحتية <br /> <span className="text-blue-500">تليق بالنخبة.</span></h2>
          <p className="text-slate-400 text-sm md:text-lg font-medium leading-loose">
            ناميكس ليست مجرد واجهة، بل هي محرك مالي متكامل يعتمد على أقوى التقنيات السحابية والتشفير اللامركزي لضمان تفوقك الاستثماري دوماً.
          </p>
          <div className="pt-4 p-8 bg-blue-600/5 rounded-[48px] border border-blue-500/10">
             <div className="flex items-center gap-4">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-sm font-black text-slate-300">نظام التشغيل مستقر وجاهز للعمل 24/7</p>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}
