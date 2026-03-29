
"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Zap, Activity, Cpu, Globe, Target } from "lucide-react";
import { cn } from "@/lib/utils";

const featureList = [
  {
    title: "أمان تقني متطور",
    desc: "نستخدم بروتوكولات تشفير متقدمة لحماية أصولك وبياناتك المالية على مدار الساعة.",
    icon: ShieldCheck,
    color: "text-blue-600",
  },
  {
    title: "تنفيذ فوري للسيولة",
    desc: "تمتع بسرعة فائقة في عمليات السحب والإيداع عبر شبكات البلوكشين الموثقة.",
    icon: Zap,
    color: "text-orange-500",
  },
  {
    title: "ذكاء اصطناعي متقدم",
    desc: "محرك NAMIX AI يحلل ملايين البيانات السوقية لاقتناص أفضل فرص النمو.",
    icon: Cpu,
    color: "text-purple-600",
  },
  {
    title: "تنوع استثماري",
    desc: "عقود استثمارية مرنة تناسب كافة المحافظ، من البدايات الذكية إلى كبار المستثمرين.",
    icon: Target,
    color: "text-emerald-600",
  },
  {
    title: "وصول عالمي",
    desc: "تداول في الأسواق العالمية من أي مكان وفي أي وقت عبر واجهة تقنية موحدة.",
    icon: Globe,
    color: "text-blue-500",
  },
  {
    title: "تحليلات لحظية",
    desc: "رسوم بيانية احترافية وأدوات تحليل فني متطورة تضعك في قلب الحدث دائماً.",
    icon: Activity,
    color: "text-red-500",
  }
];

export function Features() {
  return (
    <section className="py-20 md:py-32 bg-white relative overflow-hidden">
      {/* Background Atmosphere */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none opacity-[0.03] z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,#002d4d_0%,transparent_70%)] blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center space-y-4 mb-16 md:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h2 className="text-3xl md:text-5xl font-black text-[#002d4d]">لماذا يختار النخبة ناميكس؟</h2>
            <p className="text-gray-400 font-bold text-xs md:text-sm uppercase tracking-[0.3em]">Professional Performance Protocol</p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {featureList.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.8 }}
              whileHover={{ y: -5 }}
              className="relative p-8 md:p-10 rounded-[40px] md:rounded-[56px] bg-gray-50/30 border border-gray-100 hover:bg-white hover:shadow-[0_30px_60px_-15px_rgba(0,45,77,0.1)] transition-all duration-700 group overflow-hidden"
            >
              {/* Interactive Background Icon */}
              <motion.div
                animate={{ 
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.05, 0.95, 1]
                }}
                transition={{ 
                  duration: 10, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
                className={cn(
                  "absolute -bottom-4 -left-4 md:-bottom-6 md:-left-6 opacity-[0.03] group-hover:opacity-[0.08] transition-all duration-1000 pointer-events-none",
                  f.color
                )}
              >
                <f.icon size={120} className="md:size-[180px]" strokeWidth={1.5} />
              </motion.div>

              <div className="relative z-10 space-y-4 md:space-y-6 text-right">
                <h3 className="text-xl md:text-2xl font-black text-[#002d4d] tracking-tight group-hover:text-blue-600 transition-colors duration-500 leading-tight">
                  {f.title}
                </h3>
                <p className="text-gray-500 font-medium leading-relaxed md:leading-[2.2] text-sm md:text-base opacity-80 group-hover:opacity-100 transition-opacity">
                  {f.desc}
                </p>
                
                <div className="pt-2 opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-4 group-hover:translate-y-0">
                   <div className={cn("h-[1px] w-12 rounded-full bg-gradient-to-l from-transparent", f.color.replace('text-', 'to-'))} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
