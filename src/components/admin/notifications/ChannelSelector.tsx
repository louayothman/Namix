
"use client";

import { Card } from "@/components/ui/card";
import { Bell, Mail, Globe, ArrowRight, Zap, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ChannelSelectorProps {
  onSelect: (view: 'form_app' | 'form_email' | 'form_global') => void;
}

export function ChannelSelector({ onSelect }: ChannelSelectorProps) {
  const channels = [
    { 
      id: 'form_app', 
      title: "البث عبر التطبيق", 
      desc: "تنبيهات فورية تظهر في واجهة المستثمر.", 
      icon: Bell, 
      color: "text-blue-500", 
      bg: "bg-blue-50" 
    },
    { 
      id: 'form_email', 
      title: "البث عبر البريد", 
      desc: "رسائل مؤسساتية بتصميم مخصص للأعمال.", 
      icon: Mail, 
      color: "text-orange-500", 
      bg: "bg-orange-50" 
    },
    { 
      id: 'form_global', 
      title: "البث الشامل الموحد", 
      desc: "إرسال متزامن عبر كافة القنوات الرسمية.", 
      icon: Globe, 
      color: "text-purple-500", 
      bg: "bg-purple-50" 
    },
  ];

  return (
    <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
      {channels.map((ch) => (
        <motion.button
          key={ch.id}
          whileHover={{ y: -8, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect(ch.id as any)}
          className="text-right outline-none block h-full group"
        >
          <Card className="h-full border-none shadow-sm rounded-[56px] bg-white border border-gray-50 group-hover:shadow-2xl transition-all duration-700 overflow-hidden relative flex flex-col p-10 gap-8">
            <div className={cn("absolute -top-6 -left-6 opacity-[0.02] transition-transform duration-1000 group-hover:scale-125", ch.color)}>
               <ch.icon size={200} />
            </div>

            <div className="flex items-center justify-between relative z-10">
               <div className={cn("h-16 w-16 rounded-[24px] flex items-center justify-center shadow-inner", ch.bg, ch.color)}>
                  <ch.icon size={28} />
               </div>
               <div className="h-10 w-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-200 group-hover:bg-[#002d4d] group-hover:text-[#f9a885] transition-all">
                  <ArrowRight size={18} className="rotate-180" />
               </div>
            </div>

            <div className="space-y-2 relative z-10 flex-1">
               <h3 className="text-xl font-black text-[#002d4d]">{ch.title}</h3>
               <p className="text-[12px] font-bold text-gray-400 leading-relaxed">{ch.desc}</p>
            </div>

            <div className="pt-4 flex items-center justify-end relative z-10">
               <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Active Channel</span>
            </div>
          </Card>
        </motion.button>
      ))}
    </div>
  );
}
