"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Zap, Target, ShieldCheck, Cpu } from "lucide-react";

interface Message {
  id: number;
  agent: string;
  message: string;
  icon: string;
  color: string;
}

/**
 * @fileOverview شريط الحوار النبضي v3.0 - WhatsApp Flow Edition
 * يحاكي تدفق رسائل واتساب؛ حيث تصعد الرسائل الجديدة من الأسفل مع تمرير آلي.
 */
export function AgentDialogueFeed({ messages }: { messages: Message[] }) {
  const iconMap: Record<string, any> = { Zap, Target, ShieldCheck, Cpu };
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // تمرير آلي للأسفل عند وصول رسالة جديدة
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [messages]);

  return (
    <div className="space-y-5 font-body tracking-normal" dir="rtl">
      {/* Header Badge */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-[9px] font-black text-[#002d4d] uppercase tracking-[0.2em]">Neural Consensus Feed</span>
        </div>
        <Badge variant="outline" className="bg-blue-50 text-blue-600 border-none font-black text-[7px] px-2 py-0.5 rounded-md">LIVE CHAT</Badge>
      </div>
      
      <div 
        ref={scrollRef}
        className="h-[220px] overflow-y-auto scrollbar-none space-y-4 pr-1"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg) => {
            const Icon = iconMap[msg.icon] || Cpu;
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  duration: 0.5,
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
                  <div className="p-3 bg-gray-50 rounded-2xl rounded-tr-sm border border-gray-100/50">
                    <p className="text-[11px] font-bold text-[#002d4d] leading-relaxed">
                      {msg.message}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
