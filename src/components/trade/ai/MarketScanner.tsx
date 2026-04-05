
"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Cpu } from "lucide-react";
import { useEffect, useState } from "react";

/**
 * @fileOverview بروتوكول معايرة التشغيل v2.0 - Institutional Minimalism Edition
 * حلقة نانوية مع عرض حالة اتصال الوكلاء بأسلوب تكتيكي.
 */
export function MarketScanner() {
  const [agents, setAgents] = useState<string[]>([]);
  const agentNames = ["Agent_Alpha", "Agent_Beta", "Agent_Gamma", "Agent_Delta"];

  useEffect(() => {
    agentNames.forEach((name, i) => {
      setTimeout(() => {
        setAgents(prev => [...prev, name]);
      }, 600 * i);
    });
  }, []);

  return (
    <div className="relative h-56 w-full flex flex-col items-center justify-center overflow-hidden bg-white rounded-[48px] border border-gray-100 shadow-inner font-body">
      
      {/* 1. المركز: الحلقة النانوية */}
      <div className="relative h-24 w-24 flex items-center justify-center">
         {/* حلقة نانوية رفيعة جداً */}
         <motion.div 
           animate={{ rotate: 360 }}
           transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
           className="absolute inset-0 border-[0.5px] border-[#002d4d]/10 rounded-full"
         />
         <motion.div 
           animate={{ rotate: -360 }}
           transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
           className="absolute inset-2 border-[0.5px] border-blue-500/20 rounded-full border-dashed"
         />
         
         <div className="h-14 w-14 rounded-2xl bg-[#002d4d] flex items-center justify-center shadow-2xl relative z-10">
            <Cpu className="h-6 w-6 text-[#f9a885] animate-pulse" />
         </div>
      </div>

      {/* 2. تدفق حالة الوكلاء - تكتيكي مصغر */}
      <div className="mt-8 space-y-1.5 w-full max-w-[180px]">
         {agentNames.map((name, i) => (
           <div key={i} className="flex items-center justify-between px-2 h-4 overflow-hidden">
              <span className="text-[7px] font-black text-gray-300 uppercase tracking-widest">{name}</span>
              <div className="h-[0.5px] flex-1 mx-3 bg-gray-100" />
              {agents.includes(name) ? (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[7px] font-black text-emerald-500 uppercase">ONLINE</motion.span>
              ) : (
                <span className="text-[7px] font-black text-gray-200 uppercase animate-pulse">SYNC...</span>
              )}
           </div>
         ))}
      </div>

      {/* 3. تذييل المعايرة */}
      <div className="absolute bottom-6 flex items-center gap-2 opacity-30">
         <ShieldCheck size={10} className="text-[#002d4d]" />
         <p className="text-[7px] font-black text-[#002d4d] uppercase tracking-[0.4em]">Sovereign Node Initialization</p>
      </div>
    </div>
  );
}
