
"use client";

import { motion } from "framer-motion";
import { Users, Activity, Wallet, Globe, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const stats = [
  { label: "مستثمر نشط", val: "50K+", icon: Users, color: "text-blue-500", bg: "bg-blue-50" },
  { label: "عمليات مؤكدة", val: "$4.8M", icon: Activity, color: "text-emerald-500", bg: "bg-emerald-50" },
  { label: "أصول مدارة", val: "$200M+", icon: Wallet, color: "text-[#f9a885]", bg: "bg-orange-50" },
  { label: "دولة مدعومة", val: "15+", icon: Globe, color: "text-purple-500", bg: "bg-purple-50" }
];

export function StatsSection() {
  return (
    <section className="py-40 px-6 relative bg-gray-50/20">
       <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
             {stats.map((stat, i) => (
               <motion.div 
                 key={i} 
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: i * 0.1, duration: 0.8 }}
                 className="flex flex-col items-center gap-6 text-center group"
               >
                  <div className={cn(
                    "h-20 w-20 rounded-[32px] flex items-center justify-center shadow-inner transition-all duration-700 group-hover:scale-110",
                    stat.bg
                  )}>
                     <stat.icon size={32} className={stat.color} />
                  </div>
                  <div className="space-y-2">
                     <p className="text-4xl md:text-5xl font-black text-[#002d4d] tabular-nums tracking-tighter">{stat.val}</p>
                     <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em]">{stat.label}</p>
                  </div>
               </motion.div>
             ))}
          </div>
       </div>
    </section>
  );
}
