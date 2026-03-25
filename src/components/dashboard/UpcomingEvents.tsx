
"use client";

import { useMemo, useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Timer, Sparkles, ChevronLeft, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface UpcomingEventsProps {
  scheduledPlans: any[];
}

function CountdownTimer({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState<{ days: number, hours: number, minutes: number, seconds: number } | null>(null);

  useEffect(() => {
    const calculate = () => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft(null);
        return;
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000)
      });
    };

    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  if (!timeLeft) return <Badge className="bg-emerald-500 text-white border-none font-black text-[10px]">بدأ الاكتتاب الآن!</Badge>;

  return (
    <div className="flex items-center gap-2" dir="ltr">
      {[
        { val: timeLeft.days, label: "D" },
        { val: timeLeft.hours, label: "H" },
        { val: timeLeft.minutes, label: "M" },
        { val: timeLeft.seconds, label: "S" }
      ].map((unit, i) => (
        <div key={i} className="flex flex-col items-center bg-[#002d4d] text-white px-2 py-1 rounded-lg min-w-[32px] shadow-sm">
          <span className="text-[11px] font-black tabular-nums leading-none">{unit.val}</span>
          <span className="text-[6px] font-bold text-[#f9a885] uppercase tracking-tighter">{unit.label}</span>
        </div>
      ))}
    </div>
  );
}

export function UpcomingEvents({ scheduledPlans }: UpcomingEventsProps) {
  const router = useRouter();

  if (!scheduledPlans || scheduledPlans.length === 0) return null;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-6 duration-1000">
      <div className="flex items-center justify-between border-b border-gray-100 pb-4 px-2">
        <div className="space-y-1">
          <h3 className="text-xl font-black text-[#002d4d] flex items-center gap-3">
            <div className="h-2.5 w-2.5 rounded-full bg-blue-500 animate-pulse" />
            اكتتابات استثمارية قادمة
          </h3>
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] tracking-none">Sovereign Future Launches</p>
        </div>
        <div className="flex items-center gap-2 bg-blue-50 px-4 py-1.5 rounded-full border border-blue-100">
           <Timer className="h-3.5 w-3.5 text-blue-600" />
           <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest">Live Schedule</span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {scheduledPlans.map((plan) => (
          <Card key={plan.id} className="border-none shadow-[0_32px_64px_-16px_rgba(0,45,77,0.1)] rounded-[48px] bg-white overflow-hidden group transition-all hover:shadow-2xl relative">
            <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none group-hover:scale-110 group-hover:rotate-12 transition-transform duration-1000">
               <Calendar className="h-40 w-40 text-[#002d4d]" />
            </div>
            
            <CardContent className="p-8 space-y-8 relative z-10">
              <div className="flex items-center justify-between">
                <div className="h-14 w-14 rounded-[22px] bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                  <Sparkles className="h-7 w-7" />
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge className="bg-[#002d4d] text-white font-black text-[9px] px-4 py-1.5 rounded-full shadow-lg border-none tracking-widest uppercase">
                    LAUNCHING SOON
                  </Badge>
                  <CountdownTimer targetDate={plan.launchTime} />
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-2xl font-black text-[#002d4d] tracking-tight">{plan.title}</h4>
                <p className="text-xs text-gray-400 font-bold leading-relaxed">كن مستعداً لإطلاق هذا البروتوكول الاستثمارية بعائد استثنائي يصل إلى <span className="text-emerald-600 font-black">%{plan.profitPercent}</span>.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="p-5 bg-gray-50 rounded-[28px] border border-gray-100 shadow-inner flex flex-col items-center text-center gap-1.5">
                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Opening Node</p>
                    <p className="text-[11px] font-black text-[#002d4d]">
                      {new Date(plan.launchTime).toLocaleDateString('ar-EG', { day: 'numeric', month: 'long' })}
                    </p>
                    <div className="flex items-center gap-1.5 text-blue-600">
                       <Clock className="h-3 w-3" />
                       <p className="text-[10px] font-bold tabular-nums">
                        {new Date(plan.launchTime).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                       </p>
                    </div>
                 </div>
                 <div className="p-5 bg-gray-50 rounded-[28px] border border-gray-100 shadow-inner flex flex-col items-center text-center gap-1.5">
                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Entry Limit</p>
                    <p className="text-sm font-black text-[#002d4d] tabular-nums">${plan.min.toLocaleString()}</p>
                    <div className="h-1 w-8 bg-[#f9a885] rounded-full" />
                 </div>
              </div>

              <Button 
                onClick={() => router.push(`/invest?planId=${plan.id}`)}
                className="w-full h-14 rounded-full bg-white border-2 border-gray-100 hover:border-blue-500 hover:bg-blue-50 text-gray-400 hover:text-blue-600 font-black text-xs transition-all active:scale-95 group/btn"
              >
                معاينة مواصفات البروتوكول
                <ChevronLeft className="mr-2 h-4 w-4 group-hover/btn:-translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
