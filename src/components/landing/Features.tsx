
"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Zap, Activity, Cpu, Globe, Target } from "lucide-react";
import { cn } from "@/lib/utils";

const featureList = [
  {
    title: "أمان تقني متطور",
    desc: "نستخدم بروتوكولات تشفير فائقة الدقة لحماية أصولك وبياناتك المالية على مدار الساعة.",
    icon: ShieldCheck,
    color: "text-blue-600",
    bg: "bg-blue-50"
  },
  {
    title: "تنفيذ فوري للسيولة",
    desc: "تمتع بسرعة فائقة في عمليات السحب والإيداع عبر شبكات البلوكشين الموثقة.",
    icon: Zap,
    color: "text-orange-500",
    bg: "bg-orange-50"
  },
  {
    title: "ذكاء اصطناعي متقدم",
    desc: "محرك NAMIX AI يحلل ملايين البيانات السوقية لاقتناص أفضل فرص الربح.",
    icon: Cpu,
    color: "text-purple-600",
    bg: "bg-purple-50"
  },
  {
    title: "تنوع استثماري",
    desc: "عقود استثمارية مرنة تناسب كافة المحافظ، من البدايات الذكية إلى استثمارات كبار المستثمرين.",
    icon: Target,
    color: "text-emerald-600",
    bg: "bg-emerald-50"
  },
  {
    title: "وصول عالمي",
    desc: "تداول في الأسواق العالمية من أي مكان وفي أي وقت عبر واجهة تقنية موحدة.",
    icon: Globe,
    color: "text-blue-500",
    bg: "bg-blue-50"
  },
  {
    title: "تحليلات لحظية",
    desc: "رسوم بيانية احترافية وأدوات تحليل فني متطورة تضعك في قلب الحدث دائماً.",
    icon: Activity,
    color: "text-red-500",
    bg: "bg-red-50"
  }
];

export function Features() {
  return (
    <section className="py-32 bg-white relative">
      <div className="container mx-auto px-6">
        <div className="text-center space-y-4 mb-24">
          <h2 className="text-3xl md:text-5xl font-black text-[#002d4d]">لماذا يختار النخبة ناميكس؟</h2>
          <p className="text-gray-400 font-bold text-sm uppercase tracking-widest">Professional Performance Protocol</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featureList.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-10 rounded-[48px] bg-gray-50/50 border border-gray-100 hover:bg-white hover:shadow-2xl transition-all duration-500 group"
            >
              <div className={cn("h-16 w-16 rounded-[24px] flex items-center justify-center shadow-inner mb-8 transition-transform group-hover:scale-110 group-hover:rotate-6", f.bg, f.color)}>
                <f.icon size={32} />
              </div>
              <h3 className="text-xl font-black text-[#002d4d] mb-4">{f.title}</h3>
              <p className="text-gray-500 font-bold leading-loose text-sm">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
