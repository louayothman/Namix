"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Zap, Target, ShieldCheck, Cpu } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Message {
  id: number;
  agent: string;
  message: string;
  icon: string;
  color: string;
}

/**
 * @fileOverview Neural Dialogue Feed v3.0 - WhatsApp Style Integration
 * نظام محادثة انسيابي يعتمد على التمرير الآلي والدفع للأعلى (Slide-up physics).
 */
export function AgentDialogueFeed({ messages }: { messages: Message[] }) {
  const iconMap: Record<string, any> = { Zap, Target, ShieldCheck, Cpu };
  const scrollRef = useRef<HTMLDivElement>(null);

  // محرك التمرير الآلي للأسفل (WhatsApp Logic)
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [messages]);

  return (
    <div className="space-y-5 font-body tracking-normal" dir="rtl">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-[9px] font-black text-[#002d4d] uppercase tracking-[0.2em]">Neural Consensus Feed</span>
        </div>
        <Badge variant="outline" className="bg-blue-50 text-blue-600 border-none font-black text-[7px] px-2 py-0.5 rounded-md uppercase">Live Stream</Badge>
      </div>
      
      <div 
        ref={scrollRef}
        className="h-[260px] overflow-y-auto scrollbar-none space-y-4 pr-1 pl-1"
      >
        <AnimatePresence initial={false} mode="popLayout">
          {messages.map((msg) => {
            const Icon = iconMap[msg.icon] || Cpu;
            return (
              <motion.div
                key={msg.id}
                layout
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  type: "spring",
                  stiffness: 400,
                  damping: 30
                }}
                className="flex items-start gap-3 text-right group/msg"
              >
                <div className={cn(
                  "h-8 w-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover/msg:scale-110",
                  msg.color
                )}>
                  <Icon size={16} className="text-white" />
                </div>
                <div className="flex-1 pt-0.5">
                  <div className="flex items-center gap-2 mb-1 pr-1">
                     <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{msg.agent} Intelligence</p>
                     <div className="h-1 w-1 rounded-full bg-blue-500/20" />
                  </div>
                  <div className="p-4 bg-gray-50 rounded-[24px] rounded-tr-sm border border-gray-100/50 shadow-sm relative group-hover/msg:bg-white group-hover/msg:shadow-md transition-all duration-500">
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
