
"use client";

import { motion } from "framer-motion";
import { Sparkles, ChevronLeft, ShieldCheck } from "lucide-react";

interface GuidanceTerminalProps {
  guidance: string[];
}

export function GuidanceTerminal({ guidance }: GuidanceTerminalProps) {
  return (
    <div className="space-y-5 text-right tracking-normal font-body" dir="rtl">
      <div className="flex items-center gap-3 px-2">
         <div className="h-8 w-8 rounded-xl bg-orange-50 text-[#f9a885] flex items-center justify-center shadow-sm">
            <Sparkles size={16} />
         </div>
         <h4 className="text-[10px] font-black text-[#002d4d] uppercase tracking-widest tracking-normal">توجيهات المحرك الاستراتيجية</h4>
      </div>

      <div className="space-y-3">
        {guidance.map((text, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + i * 0.2 }}
            className="p-5 bg-white border border-gray-100 rounded-[28px] shadow-sm flex items-start gap-4 group hover:shadow-md transition-all"
          >
             <div className="h-6 w-6 rounded-lg bg-gray-50 flex items-center justify-center shrink-0 group-hover:bg-[#002d4d] group-hover:text-white transition-colors">
                <ChevronLeft size={12} />
             </div>
             <p className="text-[12px] font-bold text-gray-500 leading-[1.8] group-hover:text-[#002d4d] transition-colors tracking-normal">{text}</p>
          </motion.div>
        ))}
      </div>

      <div className="p-5 bg-emerald-50/50 rounded-[32px] border border-emerald-100/50 flex items-center gap-4">
         <div className="h-10 w-10 rounded-2xl bg-white flex items-center justify-center text-emerald-500 shadow-sm shrink-0">
            <ShieldCheck size={20} />
         </div>
         <p className="text-[10px] font-black text-emerald-700 leading-relaxed tracking-normal">تمت مراجعة هذه التوصية برمجياً وهي تخضع لبروتوكول حماية رأس المال المعتمد.</p>
      </div>
    </div>
  );
}
