
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Users, Zap, Wallet, Shield, Globe, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface UserStatsCardsProps {
  stats: {
    total: number;
    active: number;
    admins: number;
    online: number;
  };
  totalBalances: number;
}

export function UserStatsCards({ stats, totalBalances }: UserStatsCardsProps) {
  const items = [
    { label: "إجمالي القاعدة", val: stats.total, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "المتصلون الآن", val: stats.online, icon: Globe, color: "text-emerald-600", bg: "bg-emerald-50", animate: true },
    { label: "المستثمرون النشطون", val: stats.active, icon: Zap, color: "text-[#f9a885]", bg: "bg-orange-50" },
    { label: "إجمالي الخزينة", val: `$${totalBalances.toLocaleString()}`, icon: Wallet, color: "text-[#002d4d]", bg: "bg-gray-100" },
    { label: "الطاقم الإداري", val: stats.admins, icon: Shield, color: "text-purple-600", bg: "bg-purple-50" }
  ];

  return (
    <Card className="border-none shadow-xl rounded-[40px] md:rounded-[56px] bg-white overflow-hidden relative group">
      {/* Background Sovereign Branding */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02] flex items-center justify-center overflow-hidden">
         <div className="text-[120px] md:text-[200px] font-black italic tracking-tighter select-none">NAMIX</div>
      </div>

      <CardContent className="p-0 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 divide-x divide-x-reverse divide-gray-50 border-collapse">
          {items.map((item, i) => (
            <div key={i} className={cn(
              "p-6 md:p-10 flex flex-col items-center justify-center text-center gap-3 md:gap-4 hover:bg-gray-50/50 transition-all duration-500 border-b border-gray-50 lg:border-b-0",
              i === items.length - 1 && "col-span-2 md:col-span-1 border-b-0"
            )}>
              <div className={cn(
                "h-12 w-12 md:h-14 md:w-14 rounded-[18px] md:rounded-[22px] flex items-center justify-center shadow-inner transition-transform duration-700 hover:scale-110", 
                item.bg, 
                item.color
              )}>
                <item.icon className={cn("h-6 w-6 md:h-7 md:w-7", item.animate && "animate-pulse")} />
              </div>
              <div className="space-y-1">
                <p className="text-[8px] md:text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none">{item.label}</p>
                <p className={cn("text-lg md:text-2xl font-black tabular-nums tracking-tighter", item.animate ? "text-emerald-600" : "text-[#002d4d]")}>
                  {item.val}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
