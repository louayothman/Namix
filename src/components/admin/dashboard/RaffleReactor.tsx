
"use client";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Ticket, Trophy, Timer, ChevronRight, Sparkles, Loader2 } from "lucide-react";
import { formatDistanceToNow, isAfter, parseISO } from "date-fns";
import { ar } from "date-fns/locale/ar";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface RaffleReactorProps {
  isActive: boolean;
  prizePool: number;
  ticketsSold: number;
  drawDate?: string;
  now: Date;
}

export function RaffleReactor({ isActive, prizePool, ticketsSold, drawDate, now }: RaffleReactorProps) {
  const isExpired = drawDate ? isAfter(now, parseISO(drawDate)) : false;
  const isLive = isActive && !isExpired;

  return (
    <Card className="border-none shadow-sm rounded-[44px] bg-white overflow-hidden border-r-[8px] border-r-orange-500 group transition-all hover:shadow-xl">
      <CardContent className="p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              "h-10 w-10 rounded-2xl flex items-center justify-center shadow-inner transition-transform group-hover:rotate-12",
              isLive ? "bg-orange-50 text-orange-600" : "bg-gray-100 text-gray-300"
            )}>
              <Trophy size={20} />
            </div>
            <div>
              <CardTitle className="text-base font-black text-[#002d4d]">سحب ناميكس</CardTitle>
              <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Grand Raffle Protocol</p>
            </div>
          </div>
          <Badge className={cn(
            "text-[8px] font-black border-none px-3 py-1 rounded-full",
            isLive ? "bg-orange-500 text-white animate-pulse" : "bg-gray-100 text-gray-400"
          )}>
            {isLive ? "LIVE CYCLE" : "INACTIVE"}
          </Badge>
        </div>

        {isLive ? (
          <div className="space-y-5 animate-in fade-in zoom-in-95">
            <div className="p-5 bg-orange-50/50 rounded-[32px] border border-orange-100/50 text-center">
               <p className="text-[9px] font-black text-orange-400 uppercase mb-1">Current Jackpot</p>
               <h3 className="text-3xl font-black text-[#002d4d] tracking-tighter tabular-nums">${prizePool.toLocaleString()}</h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
               <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-right space-y-1">
                  <div className="flex items-center gap-2">
                     <Ticket size={12} className="text-blue-500" />
                     <span className="text-[8px] font-black text-gray-400 uppercase">Tickets</span>
                  </div>
                  <p className="text-base font-black text-[#002d4d] tabular-nums">{ticketsSold}</p>
               </div>
               <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-right space-y-1">
                  <div className="flex items-center gap-2">
                     <Timer size={12} className="text-[#f9a885]" />
                     <span className="text-[8px] font-black text-gray-400 uppercase">Ends In</span>
                  </div>
                  <p className="text-[10px] font-black text-[#002d4d] truncate">
                    {drawDate ? formatDistanceToNow(parseISO(drawDate), { locale: ar }) : '...'}
                  </p>
               </div>
            </div>
          </div>
        ) : (
          <div className="py-10 text-center opacity-30 flex flex-col items-center gap-3">
             <Loader2 size={24} className="text-gray-300" />
             <p className="text-[10px] font-black uppercase tracking-widest">بانتظار الدورة القادمة</p>
          </div>
        )}

        <Link href="/admin/raffle" className="block pt-2">
           <Button variant="ghost" className="w-full h-11 rounded-2xl bg-gray-50 text-[10px] font-black text-orange-600 hover:bg-[#002d4d] hover:text-[#f9a885] transition-all">
              إدارة بروتوكول السحب <ChevronRight className="mr-1 h-3 w-3" />
           </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
