
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Cpu, Wallet, History, ArrowRight, Sparkles, Zap, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface DepositsMenuProps {
  onSelect: (view: 'api' | 'portals' | 'ledger') => void;
}

export function DepositsMenu({ onSelect }: DepositsMenuProps) {
  const items = [
    { 
      id: 'api', 
      title: "ضبط بروتوكولات API", 
      desc: "إدارة مفاتيح NOWPayments و Binance للأتمتة", 
      icon: Cpu, 
      color: "text-blue-600", 
      bg: "bg-blue-50" 
    },
    { 
      id: 'portals', 
      title: "ضبط بوابات الدفع", 
      desc: "تخصيص المحافظ وشبكات الاستلام والتعليمات", 
      icon: Wallet, 
      color: "text-emerald-600", 
      bg: "bg-emerald-50" 
    },
    { 
      id: 'ledger', 
      title: "سجل العمليات والتدقيق", 
      desc: "مراجعة الطلبات المعلقة واعتماد الإيداعات", 
      icon: History, 
      color: "text-[#f9a885]", 
      bg: "bg-orange-50" 
    },
  ];

  return (
    <div className="grid gap-8 md:grid-cols-3">
      {items.map((item, i) => (
        <motion.button
          key={item.id}
          whileHover={{ y: -8, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect(item.id as any)}
          className="text-right outline-none block h-full group"
        >
          <Card className="h-full border-none shadow-sm rounded-[56px] bg-white border border-gray-50 group-hover:shadow-2xl transition-all duration-700 overflow-hidden relative flex flex-col p-10 gap-10">
            {/* Background Ghost Icon */}
            <div className={cn(
              "absolute -top-10 -left-10 p-10 opacity-[0.02] group-hover:rotate-12 transition-transform duration-1000",
              item.color
            )}>
               <item.icon size={200} />
            </div>

            <div className="flex items-center justify-between relative z-10">
               <div className={cn(
                 "h-20 w-20 rounded-[28px] flex items-center justify-center shadow-inner transition-transform group-hover:scale-110 duration-500",
                 item.bg, item.color
               )}>
                  <item.icon size={32} />
               </div>
               <div className="h-12 w-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-200 group-hover:bg-[#002d4d] group-hover:text-[#f9a885] transition-all">
                  <ArrowRight size={20} className="rotate-180" />
               </div>
            </div>

            <div className="space-y-3 relative z-10 flex-1">
               <h3 className="text-2xl font-black text-[#002d4d] leading-tight">{item.title}</h3>
               <p className="text-[13px] font-bold text-gray-400 leading-relaxed">{item.desc}</p>
            </div>

            <div className="pt-6 border-t border-gray-50 flex items-center justify-between relative z-10">
               <div className="flex items-center gap-2">
                  <ShieldCheck size={12} className="text-emerald-500" />
                  <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest">Protocol Verified</span>
               </div>
               <Zap size={12} className="text-[#f9a885] animate-pulse" />
            </div>
          </Card>
        </motion.button>
      ))}
    </div>
  );
}
