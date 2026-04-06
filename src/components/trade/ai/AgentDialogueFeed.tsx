"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Zap, Target, ShieldCheck, Cpu } from "lucide-react";

interface Message {
  agent: string;
  message: string;
  icon: string;
  color: string;
}

/**
 * @fileOverview شريط الحوار النبضي v2.0 - Fluid Slide-up Edition
 * تم تطوير الحركة لتكون انزلاقية للأعلى مع تدفق متدرج للرسائل لتعزيز الواقعية.
 */
export function AgentDialogueFeed({ messages }: { messages: Message[] }) {
  const iconMap: Record<string, any> = { Zap, Target, ShieldCheck, Cpu };

  return (
    <div className="space-y-5 font-body tracking-normal" dir="rtl">
      {/* Header Badge */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-[9px] font-black text-[#002d4d] uppercase tracking-[0.2em]">Neural Consensus Feed</span>
        </div>
        <div className="flex gap-1">
           {[...Array(3)].map((_, i) => (
             <div key={i} className="h-1 w-1 rounded-full bg-gray-100 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
           ))}
        </div>
      </div>
      
      <div className="space-y-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={JSON.stringify(messages)} // يحفز إعادة الحركة عند تغيير الرسائل
            className="space-y-4"
          >
            {messages.map((msg, i) => {
              const Icon = iconMap[msg.icon] || Cpu;
              return (
                <motion.div
                  key={`${msg.agent}-${i}`}
                  initial={{ opacity: 0, y: 25, filter: "blur(10px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ 
                    delay: i * 0.15, 
                    duration: 0.6,
                    ease: [0.16, 1, 0.3, 1] 
                  }}
                  className="flex items-start gap-4 text-right group/msg"
                >
                  <div className={cn(
                    "h-8 w-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover/msg:scale-110",
                    msg.color
                  )}>
                    <Icon size={16} className="text-white" />
                  </div>
                  <div className="flex-1 pt-0.5 border-r border-gray-100 pr-4">
                    <div className="flex items-center gap-2 mb-1">
                       <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{msg.agent} Agent</p>
                       <div className="h-1 w-1 rounded-full bg-emerald-500/40" />
                    </div>
                    <p className="text-[11px] font-bold text-[#002d4d] leading-relaxed opacity-80 group-hover/msg:opacity-100 transition-opacity">
                      {msg.message}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
