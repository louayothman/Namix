
"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Zap, 
  Activity, 
  Target, 
  ChevronLeft, 
  TrendingUp,
  LineChart,
  Gamepad2
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * @fileOverview النظام البيئي للخدمات v41.1 - المفاعلات التشغيلية
 */

const zones = [
  {
    id: "invest",
    title: "مختبر العقود الاستثمارية",
    en: "Sovereign Yield Lab",
    desc: "حلول استثمارية مهندسة لتحقيق نمو مستدام عبر عقود تشغيلية ذكية بمخاطر محكومة وبروتوكول حماية رأس المال.",
    icon: Zap,
    color: "from-blue-600 to-blue-400",
    glow: "bg-blue-500/20",
    href: "/invest"
  },
  {
    id: "trade",
    title: "محرك التداول الوميضي",
    en: "Nexus Trading Engine",
    desc: "منصة تداول فورية مرتبطة بأضخم بورصات السيولة العالمية لضمان أفضل أسعار التنفيذ ودقة نانوية في الأوامر.",
    icon: LineChart,
    color: "from-emerald-600 to-emerald-400",
    glow: "bg-emerald-500/20",
    href: "/trade"
  },
  {
    id: "arena",
    title: "ساحة التفاعل والمغامرة",
    en: "The Adventure Arena",
    desc: "بيئة ترفيهية تفاعلية تتيح لك اختبار ذكاء التوقع ومضاعفة الأرباح بنظام عادل برمجياً وموثق بالكامل.",
    icon: Gamepad2,
    color: "from-blue-800 to-indigo-600",
    glow: "bg-indigo-500/20",
    href: "/arena"
  }
];

export function ServiceEcosystem() {
  return (
    <section className="py-40 px-6 bg-[#020617]">
      <div className="container mx-auto space-y-24">
        <div className="text-center space-y-6">
          <Badge className="bg-blue-600/10 text-blue-400 border-none px-5 py-2 rounded-full font-black text-[10px] tracking-[0.4em] uppercase">Namix Ecosystem</Badge>
          <h2 className="text-5xl md:text-7xl font-black text-white tracking-tight leading-none">نطاقات السيادة المالية</h2>
          <p className="text-slate-500 text-sm md:text-xl font-medium max-w-2xl mx-auto leading-loose">
            ثلاث ركائز استراتيجية مصممة لتغطية كافة احتياجات المستثمر العصري في فضاء الاقتصاد الرقمي العالمي.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          {zones.map((zone, i) => (
            <motion.div
              key={zone.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2, duration: 0.8 }}
            >
              <Link href={zone.href} className="block group h-full">
                <Card className="border-none shadow-none rounded-[56px] bg-slate-900/40 border border-white/5 hover:border-blue-500/30 transition-all duration-700 overflow-hidden relative h-full backdrop-blur-xl">
                  {/* Internal Kinetic Glow */}
                  <div className={cn("absolute -bottom-32 -left-32 w-80 h-80 blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000", zone.glow)} />
                  
                  <CardContent className="p-12 space-y-10 relative z-10 flex flex-col h-full">
                    <div className={cn("h-20 w-20 rounded-[28px] bg-gradient-to-br flex items-center justify-center text-white shadow-2xl shadow-black/50 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500", zone.color)}>
                      <zone.icon size={40} strokeWidth={1.5} />
                    </div>

                    <div className="space-y-4 text-right" dir="rtl">
                      <div className="space-y-1">
                        <h3 className="text-3xl font-black text-white tracking-tight">{zone.title}</h3>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">{zone.en}</p>
                      </div>
                      <p className="text-slate-400 text-sm font-medium leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
                        {zone.desc}
                      </p>
                    </div>

                    <div className="mt-auto pt-10 flex items-center justify-between border-t border-white/5">
                      <div className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center text-slate-500 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner">
                        <ChevronLeft size={24} />
                      </div>
                      <Badge className="bg-slate-800 text-slate-500 border-none font-black text-[8px] px-4 py-1.5 rounded-lg tracking-widest">AUTHORIZED NODE</Badge>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
