
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Users, Zap, Wallet, Shield, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

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
  const cards = [
    { label: "إجمالي المستثمرين", val: stats.total, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "متصل الآن", val: stats.online, icon: Globe, color: "text-emerald-600", bg: "bg-emerald-50", highlight: true },
    { label: "مستثمرون نشطون", val: stats.active, icon: Zap, color: "text-[#f9a885]", bg: "bg-orange-50" },
    { label: "إجمالي الأرصدة", val: `$${totalBalances.toLocaleString()}`, icon: Wallet, color: "text-[#002d4d]", bg: "bg-gray-100" },
    { label: "الطاقم الإداري", val: stats.admins, icon: Shield, color: "text-purple-600", bg: "bg-purple-50" }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-6">
      {cards.map((stat, i) => (
        <Card key={i} className={cn(
          "border-none shadow-sm rounded-[32px] overflow-hidden transition-all group hover:shadow-md",
          stat.highlight ? "bg-white ring-2 ring-emerald-100" : "bg-white"
        )}>
          <CardContent className="p-6 flex items-center gap-5">
            <div className={cn(
              "h-14 w-14 rounded-2xl flex items-center justify-center shadow-inner transition-transform group-hover:scale-110", 
              stat.bg, 
              stat.color
            )}>
              <stat.icon className={cn("h-7 w-7", stat.highlight && "animate-pulse")} />
            </div>
            <div className="space-y-0.5">
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
              <p className={cn("text-xl font-black tabular-nums", stat.highlight ? "text-emerald-600" : "text-[#002d4d]")}>
                {stat.val}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
