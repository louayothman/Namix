
"use client";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Activity, Zap, Cpu, TrendingUp, ChevronRight, Globe, BarChart3, Sparkles } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface MarketPulseReactorProps {
  symbolsCount: number;
  globalProfitRate: number;
  aiEnabled: boolean;
}

export function MarketPulseReactor({ symbolsCount, globalProfitRate, aiEnabled }: MarketPulseReactorProps) {
  return (
    <Card className="border-none shadow-sm rounded-[44px] bg-white overflow-hidden border-r-[8px] border-r-blue-600 group transition-all hover:shadow-xl">
      <CardContent className="p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
              <Activity size={20} />
            </div>
            <div>
              <CardTitle className="text-base font-black text-[#002d4d]">نبض الأسواق</CardTitle>
              <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Sovereign Trading Pulse</p>
            </div>
          </div>
          <Badge className="bg-emerald-50 text-emerald-600 border-none font-black text-[8px] px-3 py-1 rounded-full shadow-inner animate-pulse">DIRECT SYNC</Badge>
        </div>

        <div className="grid grid-cols-2 gap-4">
           <div className="p-5 bg-blue-50/30 rounded-[32px] border border-blue-100/50 space-y-1.5 text-right">
              <div className="flex items-center gap-2">
                 <Globe size={12} className="text-blue-500" />
                 <span className="text-[8px] font-black text-gray-400 uppercase">Active Assets</span>
              </div>
              <p className="text-2xl font-black text-[#002d4d] tabular-nums tracking-tighter">{symbolsCount}</p>
           </div>
           <div className="p-5 bg-emerald-50/30 rounded-[32px] border border-emerald-100/50 space-y-1.5 text-right">
              <div className="flex items-center gap-2">
                 <TrendingUp size={12} className="text-emerald-500" />
                 <span className="text-[8px] font-black text-gray-400 uppercase">Yield Rate</span>
              </div>
              <p className="text-2xl font-black text-emerald-600 tabular-nums tracking-tighter">%{globalProfitRate}</p>
           </div>
        </div>

        <div className="p-5 bg-gray-50 rounded-[32px] border border-gray-100 flex items-center justify-between group/ai">
           <div className="flex items-center gap-3">
              <div className={cn(
                "h-9 w-9 rounded-xl flex items-center justify-center shadow-inner transition-all",
                aiEnabled ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-400"
              )}>
                 <Cpu size={16} className={cn(aiEnabled && "animate-pulse")} />
              </div>
              <div className="text-right">
                 <p className="text-[10px] font-black text-[#002d4d]">NAMIX AI Engine</p>
                 <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">{aiEnabled ? 'Operational' : 'Hibernating'}</p>
              </div>
           </div>
           {aiEnabled && <Sparkles size={14} className="text-[#f9a885] animate-bounce" />}
        </div>

        <Link href="/admin/trade" className="block pt-2">
           <Button variant="ghost" className="w-full h-11 rounded-2xl bg-gray-50 text-[10px] font-black text-blue-600 hover:bg-[#002d4d] hover:text-[#f9a885] transition-all">
              غرفة عمليات التداول <ChevronRight className="mr-1 h-3 w-3" />
           </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
