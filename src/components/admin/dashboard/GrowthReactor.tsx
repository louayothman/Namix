"use client";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Zap, History, Activity, Globe, MousePointerClick, Award, Target, Sparkles, ArrowUpRight, ArrowDownLeft, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface GrowthReactorProps {
  reinvestmentRate: number;
  pendingDepositsCount: number;
  pendingWithdrawalsCount: number;
}

export function GrowthReactor({
  reinvestmentRate,
  pendingDepositsCount,
  pendingWithdrawalsCount
}: GrowthReactorProps) {
  const stats = [
    { label: "معدل الاستحواذ", val: "4.2/Day", icon: Zap, color: "text-emerald-500" },
    { label: "إعادة الاستثمار", val: `${reinvestmentRate.toFixed(1)}%`, icon: History, color: "text-blue-500" },
    { label: "النشاط اليومي", val: "84%", icon: Activity, color: "text-purple-500" },
    { label: "الوصول العالمي", val: "12 Countries", icon: Globe, color: "text-blue-600" },
    { label: "معدل التحويل", val: "12.5%", icon: MousePointerClick, color: "text-indigo-500" },
    { label: "الخطة الذهبية", val: "42%", icon: Award, color: "text-amber-500" },
    { label: "الموثوقية", val: "High", icon: ShieldCheck, color: "text-emerald-600" },
    { label: "نمو الإيداعات", val: "+22%", icon: TrendingUp, color: "text-emerald-500" },
    { label: "الاستمرارية", val: "94.2%", icon: Target, color: "text-blue-600" },
    { label: "الانتشار", val: "Viral", icon: Sparkles, color: "text-[#f9a885]" }
  ];

  return (
    <Card className="border-none shadow-sm rounded-[48px] bg-white overflow-hidden border-r-[8px] border-r-emerald-500 transition-all hover:shadow-xl group">
      <CardContent className="p-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-emerald-50 rounded-2xl flex items-center justify-center border border-emerald-100 shadow-inner group-hover:scale-110 transition-transform">
                <TrendingUp className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <CardTitle className="text-lg font-black text-[#002d4d]">زخم النمو الاستراتيجي</CardTitle>
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Market Velocity Reactor</p>
              </div>
            </div>
            
            <div className="p-7 bg-emerald-50/30 rounded-[36px] border border-emerald-100 relative overflow-hidden">
              <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Weekly Momentum Index</p>
              <h3 className="text-4xl font-black text-emerald-600 leading-none">
                +{reinvestmentRate.toFixed(1)}%
              </h3>
              <div className="mt-4 flex items-center gap-2">
                <Badge className="bg-emerald-50 text-white font-black text-[8px] px-3 py-1 rounded-full border-none shadow-lg">نمو متسارع</Badge>
                <span className="text-[9px] font-bold text-gray-400">إعادة الاستثمار: {reinvestmentRate.toFixed(0)}%</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Link href="/admin/deposits" className="p-4 rounded-[28px] bg-[#f9a885]/10 border border-[#f9a885]/20 flex items-center justify-between hover:bg-[#f9a885]/20 transition-all shadow-sm">
                <div className="flex items-center gap-2">
                  <ArrowUpRight className="h-3 w-3 text-[#f9a885]" />
                  <span className="text-[9px] font-black text-gray-400 uppercase">إيداعات معلقة</span>
                </div>
                <span className="text-sm font-black text-[#002d4d]">{pendingDepositsCount}</span>
              </Link>
              <Link href="/admin/withdrawals" className="p-4 rounded-[28px] bg-blue-50 border border-blue-100 flex items-center justify-between hover:bg-blue-100 transition-all shadow-sm">
                <div className="flex items-center gap-2">
                  <ArrowDownLeft className="h-3 w-3 text-blue-500" />
                  <span className="text-[9px] font-black text-gray-400 uppercase">سحوبات معلقة</span>
                </div>
                <span className="text-sm font-black text-[#002d4d]">{pendingWithdrawalsCount}</span>
              </Link>
            </div>
          </div>

          <div className="w-full lg:w-[260px] grid grid-cols-2 lg:grid-cols-1 gap-2.5">
            {stats.map((item, i) => (
              <div key={i} className="p-3 bg-gray-50/30 rounded-2xl border border-gray-100 flex items-center justify-between group/item hover:bg-white hover:shadow-sm transition-all duration-300">
                <div className="flex items-center gap-2">
                  <item.icon className={cn("h-3 w-3 transition-transform group-hover/item:scale-125", item.color)} />
                  <span className="text-[8px] font-black text-gray-400 uppercase tracking-tighter">{item.label}</span>
                </div>
                <span className="text-[10px] font-black text-[#002d4d]">{item.val}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
