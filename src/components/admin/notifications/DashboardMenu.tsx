
"use client";

import { Card } from "@/components/ui/card";
import { Bell, History, ArrowRight, Zap, Mail, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface DashboardMenuProps {
  onSelect: (view: 'channels' | 'history') => void;
}

export function DashboardMenu({ onSelect }: DashboardMenuProps) {
  const items = [
    { 
      id: 'channels', 
      title: "بث الإشعارات والتنبيهات", 
      desc: "إرسال رسائل موجهة للمستثمرين عبر التطبيق والبريد الإلكتروني.", 
      icon: Bell, 
      color: "text-blue-600", 
      bg: "bg-blue-50" 
    },
    { 
      id: 'history', 
      title: "سجل التاريخ التشغيلي", 
      desc: "مراجعة أرشيف كافة حملات البث والرسائل الصادرة سابقاً.", 
      icon: History, 
      color: "text-[#f9a885]", 
      bg: "bg-orange-50" 
    },
  ];

  return (
    <div className="grid gap-10 md:grid-cols-2 max-w-5xl mx-auto">
      {items.map((item) => (
        <motion.button
          key={item.id}
          whileHover={{ y: -10, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect(item.id as any)}
          className="text-right outline-none block h-full group"
        >
          <Card className="h-full border-none shadow-sm rounded-[64px] bg-white border border-gray-50 group-hover:shadow-2xl transition-all duration-700 overflow-hidden relative flex flex-col p-12 gap-12">
            <div className={cn(
              "absolute -top-10 -left-10 p-10 opacity-[0.02] group-hover:rotate-12 transition-transform duration-1000",
              item.color
            )}>
               <item.icon size={300} />
            </div>

            <div className="flex items-center justify-between relative z-10">
               <div className={cn(
                 "h-24 w-24 rounded-[32px] flex items-center justify-center shadow-inner transition-transform group-hover:scale-110 duration-500",
                 item.bg, item.color
               )}>
                  <item.icon size={44} />
               </div>
               <div className="h-14 w-14 rounded-full bg-gray-50 flex items-center justify-center text-gray-200 group-hover:bg-[#002d4d] group-hover:text-[#f9a885] transition-all">
                  <ArrowRight size={24} className="rotate-180" />
               </div>
            </div>

            <div className="space-y-4 relative z-10 flex-1">
               <h3 className="text-3xl font-black text-[#002d4d] leading-tight">{item.title}</h3>
               <p className="text-sm font-bold text-gray-400 leading-loose max-w-[90%]">{item.desc}</p>
            </div>

            <div className="pt-8 border-t border-gray-50 flex items-center justify-between relative z-10">
               <div className="flex items-center gap-3">
                  <ShieldCheck size={16} className="text-emerald-500" />
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Authorized Operation</span>
               </div>
               <Zap size={14} className="text-[#f9a885] animate-pulse" />
            </div>
          </Card>
        </motion.button>
      ))}
    </div>
  );
}
