
"use client";

import { motion } from "framer-motion";
import { Cpu, Zap, ShieldCheck, Globe, Activity } from "lucide-react";

/**
 * @fileOverview شريط إحصائيات البروتوكول v41.1 - مؤشرات الكرونومتر المظلمة
 */
export function ProtocolStats() {
  const stats = [
    { label: "سرعة تنفيذ الأوامر", val: "0.02ms", icon: Zap, color: "text-blue-400" },
    { label: "معدل الملاءة المالية", val: "100%", icon: ShieldCheck, color: "text-emerald-400" },
    { label: "السيولة النشطة", val: "$450M+", icon: Globe, color: "text-blue-500" },
    { label: "وحدات المعالجة", val: "Quantum", icon: Cpu, color: "text-purple-400" },
  ];

  return (
    <section className="py-24 border-y border-white/5 bg-[#020617] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-transparent to-blue-600/5" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-20">
          {stats.map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8 }}
              className="flex flex-col items-center gap-6 text-center group"
            >
              <div className="relative">
                <div className="h-16 w-16 rounded-[24px] bg-slate-900 flex items-center justify-center border border-white/5 group-hover:border-blue-500/40 transition-all duration-500 shadow-2xl">
                  <item.icon className={item.color} size={32} strokeWidth={1.5} />
                </div>
                <motion.div 
                  animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.5, 0.2] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute -inset-2 rounded-[28px] border border-blue-500/10 pointer-events-none"
                />
              </div>
              <div className="space-y-2">
                <p className="text-4xl md:text-5xl font-black text-white tabular-nums tracking-tighter drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">{item.val}</p>
                <div className="flex items-center gap-2 justify-center">
                   <div className="h-1 w-1 rounded-full bg-blue-500 animate-pulse" />
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">{item.label}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
