
"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, Sparkles, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

interface FeaturedProtocolsProps {
  plans: any[];
  onSelect: (plan: any) => void;
}

/**
 * @fileOverview عقود التميز الحصرية v6.8 - Direct Activation Edition
 * تم تحويل البطاقات لتعمل كأزرار تفتح نافذة التفعيل مباشرة لتعزيز سرعة العمليات.
 */
export function FeaturedProtocols({ plans, onSelect }: FeaturedProtocolsProps) {
  if (!plans || plans.length === 0) return null;

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-1000 font-body">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <Sparkles className="h-4 w-4 text-[#f9a885]" />
          <h3 className="text-sm font-black text-[#002d4d] tracking-normal">عقود التميز الحصرية</h3>
        </div>
        <Badge className="bg-orange-50 text-orange-600 border-none font-black text-[7px] px-3 py-1 rounded-full tracking-widest uppercase shadow-sm">ELITE SELECTION</Badge>
      </div>

      <div className="grid gap-3">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <button 
              onClick={() => onSelect(plan)}
              className="w-full text-right block outline-none"
            >
              <Card className="border-none shadow-sm rounded-[32px] bg-white border border-gray-50 hover:border-orange-100 hover:shadow-xl transition-all duration-700 group overflow-hidden relative active:scale-[0.99]">
                
                {/* الأيقونة الخلفية الضخمة والحيوية */}
                <motion.div 
                  animate={{ rotate: [0, 5, 0], scale: [1, 1.05, 1] }}
                  transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-700 pointer-events-none text-[#002d4d]"
                >
                   <Zap size={140} strokeWidth={1.5} />
                </motion.div>

                {/* Golden Gradient Accent */}
                <div className="absolute top-0 right-0 w-1.5 h-full bg-gradient-to-b from-[#f9a885]/40 via-[#f9a885] to-[#f9a885]/40 opacity-20 group-hover:opacity-100 transition-opacity" />
                
                <CardContent className="p-5 flex items-center justify-between relative z-10">
                  <div className="space-y-1 text-right">
                    <h4 className="font-black text-base text-[#002d4d] tracking-tight group-hover:text-orange-600 transition-colors duration-500">
                      {plan.title}
                    </h4>
                    <div className="flex items-center gap-2.5">
                       <div className="flex items-center gap-1.5 px-2.5 py-0.5 bg-emerald-50 rounded-lg border border-emerald-100">
                          <Zap size={10} className="text-emerald-600 fill-emerald-600" />
                          <span className="text-[10px] font-black text-emerald-600 tabular-nums">عائد %{plan.profitPercent}</span>
                       </div>
                       <div className="h-1 w-1 rounded-full bg-gray-200" />
                       <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Premium Node</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-5">
                     <div className="text-left hidden sm:flex flex-col items-end">
                        <p className="text-[7px] font-black text-gray-300 uppercase tracking-widest leading-none">Entry Threshold</p>
                        <p className="text-sm font-black text-[#002d4d] mt-1.5 tabular-nums">${plan.min.toLocaleString()}</p>
                     </div>
                     <div className="h-11 w-11 rounded-[18px] bg-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-[#002d4d] group-hover:text-[#f9a885] transition-all duration-500 shadow-inner">
                        <ArrowUpRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                     </div>
                  </div>
                </CardContent>
              </Card>
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
