"use client";

import { motion } from "framer-motion";
import { Activity, Users, Wallet, Globe } from "lucide-react";

export function StatsPulse() {
  const stats = [
    { label: "مستثمر موثق", val: "50K+", icon: Users },
    { label: "أصول مدارة", val: "$200M", icon: Wallet },
    { label: "عمليات يومية", val: "12K", icon: Activity },
    { label: "دولة مدعومة", val: "15+", icon: Globe }
  ];

  return (
    <section className="py-40 px-6 relative bg-white/5 backdrop-blur-sm border-y border-white/5 overflow-hidden">
       <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="h-full w-full bg-[radial-gradient(circle,#ffffff_1px,transparent_1px)] bg-[size:60px_60px]" />
       </div>

       <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-24">
             {stats.map((stat, i) => (
               <motion.div
                 key={i}
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: i * 0.1 }}
                 className="flex flex-col items-center gap-6 text-center group"
               >
                  <div className="h-20 w-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center relative overflow-hidden group-hover:bg-[#f9a885]/10 transition-all duration-700">
                     <stat.icon size={28} className="text-[#f9a885] group-hover:scale-110 transition-transform" />
                     <motion.div 
                       animate={{ scale: [1, 1.5, 1], opacity: [0.1, 0.3, 0.1] }}
                       transition={{ duration: 3, repeat: Infinity }}
                       className="absolute inset-0 bg-[#f9a885] rounded-full blur-xl"
                     />
                  </div>
                  <div className="space-y-2">
                     <p className="text-4xl md:text-6xl font-black text-white tabular-nums tracking-tighter">{stat.val}</p>
                     <p className="font-black text-white/20 uppercase tracking-[0.4em] text-[10px]">{stat.label}</p>
                  </div>
               </motion.div>
             ))}
          </div>
       </div>
    </section>
  );
}