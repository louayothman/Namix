"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Zap, Target, ShieldCheck, Cpu } from "lucide-react";

interface Message {
  agent: string;
  message: string;
  icon: string;
  color: string;
}

/**
 * @fileOverview شريط الحوار النبضي v1.0 - Neural Dialogue Feed
 * يعرض التوافق والمحادثة اللحظية بين وكلاء ناميكس AI.
 */
export function AgentDialogueFeed({ messages }: { messages: Message[] }) {
  const iconMap: Record<string, any> = { Zap, Target, ShieldCheck, Cpu };

  return (
    <div className="space-y-4 px-2 pt-2 font-body tracking-normal" dir="rtl">
      <div className="flex items-center gap-2 opacity-20">
        <Cpu size={10} className="text-[#002d4d]" />
        <span className="text-[7px] font-black uppercase tracking-[0.3em]">Neural Consensus Feed</span>
      </div>
      
      <div className="space-y-3">
        {messages.map((msg, i) => {
          const Icon = iconMap[msg.icon] || Cpu;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.6, duration: 0.5 }}
              className="flex items-start gap-4 text-right group/msg"
            >
              <div className={cn(
                "h-7 w-7 rounded-[10px] flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover/msg:scale-110",
                msg.color
              )}>
                <Icon size={14} className="text-white" />
              </div>
              <div className="flex-1 pt-0.5 border-r border-gray-100 pr-4">
                <div className="flex items-center gap-2 mb-1">
                   <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{msg.agent} Agent</p>
                   <div className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <p className="text-[11px] font-bold text-[#002d4d] leading-relaxed opacity-80 group-hover/msg:opacity-100 transition-opacity">
                  {msg.message}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
