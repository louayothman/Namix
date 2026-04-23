
"use client";

import React from "react";
import { motion } from "framer-motion";
import { Smartphone, ChevronLeft, Sparkles, Zap, Activity, ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface PWAInstallCardProps {
  onInstall: () => void;
}

export function PWAInstallCard({ onInstall }: PWAInstallCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, height: 0 }} 
      animate={{ opacity: 1, height: 'auto' }} 
      exit={{ opacity: 0, height: 0 }}
      className="overflow-hidden mb-8"
      dir="rtl"
    >
      <Card className="border-none shadow-xl rounded-[40px] bg-[#002d4d] text-white p-6 relative group overflow-hidden">
        {/* Background Atmosphere */}
        <div className="absolute top-0 right-0 p-6 opacity-[0.05] -rotate-12 group-hover:rotate-0 transition-transform duration-1000 pointer-events-none">
          <Smartphone size={160} />
        </div>

        <div className="flex flex-col gap-6 relative z-10">
          <div className="flex items-center gap-5 text-right w-full">
            <div className="h-14 w-14 rounded-2xl overflow-hidden flex items-center justify-center group-hover:scale-110 transition-transform shrink-0 shadow-lg border border-white/10">
              <Image 
                src="/icon-192.png" 
                alt="Namix App" 
                width={56} 
                height={56} 
                className="object-cover"
                data-ai-hint="app icon"
              />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h4 className="text-base font-black">تفعيل ميزات الوصول السريع</h4>
                <Sparkles size={12} className="text-[#f9a885] animate-pulse" />
              </div>
              <p className="text-[11px] text-blue-100/60 font-bold leading-relaxed max-w-md">
                حول تجربتك إلى تطبيق متكامل للحصول على وصول أسرع وأكثر أماناً لأصولك المالية.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 px-2">
             {[
               { icon: Zap, label: "سرعة تنفيذ", color: "text-orange-400" },
               { icon: Activity, label: "إشارات ذكية", color: "text-blue-400" },
               { icon: ShieldCheck, label: "أمان معزز", color: "text-emerald-400" }
             ].map((feat, i) => (
               <div key={i} className="flex flex-col items-center gap-1.5 py-3 rounded-2xl bg-white/5 border border-white/5">
                  <feat.icon size={14} className={feat.color} />
                  <span className="text-[8px] font-black uppercase tracking-tighter opacity-60">{feat.label}</span>
               </div>
             ))}
          </div>

          <Button 
            onClick={onInstall}
            className="h-12 w-full px-8 rounded-full bg-[#f9a885] hover:bg-white text-[#002d4d] font-black text-sm shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 group/btn"
          >
            <span>ابدأ التثبيت الآن</span>
            <ChevronLeft size={18} className="transition-transform group-hover/btn:-translate-x-1" />
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}
