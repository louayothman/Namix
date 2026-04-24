
"use client";

import { Card } from "@/components/ui/card";
import { Bell, Mail, Globe, ArrowRight, Zap, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ChannelSelectorProps {
  onSelect: (view: 'form_app' | 'form_email' | 'form_push' | 'form_global') => void;
}

export function ChannelSelector({ onSelect }: ChannelSelectorProps) {
  const channels = [
    { 
      id: 'form_app', 
      title: "بث داخلي (تطبيق)", 
      desc: "تنبيهات تظهر داخل مركز الرسائل في حساب المستخدم.", 
      icon: Bell, 
      color: "text-blue-500", 
      bg: "bg-blue-50" 
    },
    { 
      id: 'form_push', 
      title: "بث خارجي (Push)", 
      desc: "رسائل تظهر مباشرة على شاشة قفل الهاتف والجهاز.", 
      icon: Smartphone, 
      color: "text-emerald-500", 
      bg: "bg-emerald-50" 
    },
    { 
      id: 'form_email', 
      title: "بث بريد إلكتروني", 
      desc: "رسائل رسمية بتصميم مخصص تصل لصندوق الوارد.", 
      icon: Mail, 
      color: "text-orange-500", 
      bg: "bg-orange-50" 
    },
    { 
      id: 'form_global', 
      title: "البث الشامل الموحد", 
      desc: "إرسال متزامن عبر كافة القنوات المتاحة للمستثمر.", 
      icon: Globe, 
      color: "text-purple-500", 
      bg: "bg-purple-50" 
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto">
      {channels.map((ch) => (
        <motion.button
          key={ch.id}
          whileHover={{ y: -8, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect(ch.id as any)}
          className="text-right outline-none block h-full group"
        >
          <Card className="h-full border-none shadow-sm rounded-[48px] bg-white border border-gray-50 group-hover:shadow-2xl transition-all duration-700 overflow-hidden relative flex flex-col p-8 gap-6">
            <div className={cn("absolute -top-6 -left-6 opacity-[0.02] transition-transform duration-1000 group-hover:scale-125", ch.color)}>
               <ch.icon size={160} />
            </div>

            <div className="flex items-center justify-between relative z-10">
               <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center shadow-inner", ch.bg, ch.color)}>
                  <ch.icon size={24} />
               </div>
               <div className="h-9 w-9 rounded-full bg-gray-50 flex items-center justify-center text-gray-200 group-hover:bg-[#002d4d] group-hover:text-[#f9a885] transition-all">
                  <ArrowRight size={16} className="rotate-180" />
               </div>
            </div>

            <div className="space-y-1.5 relative z-10 flex-1">
               <h3 className="text-lg font-black text-[#002d4d]">{ch.title}</h3>
               <p className="text-[11px] font-bold text-gray-400 leading-relaxed">{ch.desc}</p>
            </div>

            <div className="pt-2 flex items-center justify-end relative z-10">
               <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest">Active Node</span>
            </div>
          </Card>
        </motion.button>
      ))}
    </div>
  );
}
