"use client";

import { Card, CardContent } from "@/components/ui/card";
import { History, Briefcase, Activity, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface GlobalStatsProps {
  marketingConfig: any;
  dynamicStats: {
    withdrawals: number;
    activeUsers: number;
    investments: number;
  };
}

export function GlobalStats({ marketingConfig, dynamicStats }: GlobalStatsProps) {
  const stats = [
    { icon: History, en: "Verified Outflows", ar: "الحوالات المؤكدة", val: `$${dynamicStats.withdrawals.toLocaleString()}+`, color: "text-blue-500", bg: "bg-blue-50" },
    { icon: Briefcase, en: "Secured Assets", ar: "الأصول المؤمنة", val: `$${dynamicStats.investments.toLocaleString()}+`, color: "text-[#f9a885]", bg: "bg-orange-50" },
    { icon: Activity, en: "Active Investors", ar: "المستثمرون النشطون", val: `${dynamicStats.activeUsers.toLocaleString()}`, color: "text-emerald-500", bg: "bg-emerald-50" },
    { icon: ShieldCheck, en: "Asset Coverage", ar: "تغطية الأصول", val: marketingConfig?.assetCoverage || "100% Secure", color: "text-indigo-500", bg: "bg-indigo-50" }
  ];

  return (
    <Card className="border-none shadow-sm rounded-[48px] bg-gray-50/50 border border-gray-100 overflow-hidden">
       <CardContent className="p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
             {stats.map((item, i) => (
               <div key={i} className="flex flex-col items-center gap-3 group">
                  <div className={cn("h-12 w-12 rounded-[18px] flex items-center justify-center shadow-inner transition-transform duration-500 group-hover:scale-110", item.bg)}>
                     <item.icon className={cn("h-6 w-6", item.color)} />
                  </div>
                  <div className="text-center">
                     <div className="flex flex-col mb-1">
                        <p className="text-[7px] font-black text-gray-400 uppercase tracking-widest leading-none">{item.en}</p>
                        <p className="text-[9px] font-black text-[#002d4d] leading-none mt-1">{item.ar}</p>
                     </div>
                     <p className="text-base font-black text-[#002d4d] tracking-tighter tabular-nums transition-all duration-1000 animate-in fade-in">{item.val}</p>
                  </div>
               </div>
             ))}
          </div>
       </CardContent>
    </Card>
  );
}