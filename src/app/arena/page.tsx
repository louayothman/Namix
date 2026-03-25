
"use client";

import { Shell } from "@/components/layout/Shell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Rocket, Zap, Sparkles, ChevronRight, ShieldCheck, PlayCircle } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const arenaGames = [
  {
    id: "crash",
    name: "Namix Crash",
    desc: "بروتوكول الصعود الوميضي؛ ضاعف أرباحك قبل الانفجار السعري.",
    risk: "High",
    href: "/arena/crash",
    icon: Zap,
    color: "text-orange-500",
    bg: "bg-orange-50"
  },
  {
    id: "mines",
    name: "Sovereign Mines",
    desc: "استكشف حقول السيولة المربحة وتجنب العثرات التقنية المفاجئة.",
    risk: "Medium",
    href: "#",
    icon: Sparkles,
    color: "text-blue-500",
    bg: "bg-blue-50",
    disabled: true
  },
  {
    id: "dice",
    name: "Nexus Dice",
    desc: "توقع المسار الرقمي القادم في شبكة الاحتمالات اللامتناهية.",
    risk: "Low",
    href: "#",
    icon: Rocket,
    color: "text-emerald-500",
    bg: "bg-emerald-50",
    disabled: true
  }
];

export default function ArenaPage() {
  return (
    <Shell>
      <div className="max-w-4xl mx-auto space-y-10 px-6 pt-10 pb-32 font-body text-right tracking-normal" dir="rtl">
        
        {/* Header - Sovereign Style */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-gray-100 pb-8">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[#f9a885] font-black text-[9px] uppercase tracking-[0.4em] justify-start">
              <div className="h-2.5 w-2.5 rounded-full bg-[#f9a885] animate-pulse shadow-[0_0_8px_#f9a885]" />
              Interactive Adventure Arena
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-[#002d4d] tracking-tight">ساحة المغامرة</h1>
            <p className="text-muted-foreground font-bold text-xs">فرص تفاعلية لتعظيم العوائد بذكاء وجرأة استراتيجية سيادية.</p>
          </div>
          
          <Link href="/">
            <Button variant="ghost" className="rounded-full bg-white shadow-sm h-14 px-8 border border-gray-50 active:scale-95 transition-all hover:shadow-md font-black text-[10px] text-[#002d4d] tracking-normal">
              <ChevronRight className="ml-2 h-5 w-5" /> العودة للرئيسية
            </Button>
          </Link>
        </div>

        {/* Info Banner */}
        <div className="p-6 bg-blue-50/50 rounded-[40px] border border-blue-100 flex items-start gap-5 shadow-inner">
           <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center text-blue-600 shadow-sm shrink-0">
              <ShieldCheck className="h-6 w-6" />
           </div>
           <div className="space-y-1 pt-1">
              <p className="text-sm font-black text-blue-900 tracking-normal">ميثاق الترفيه المسؤول</p>
              <p className="text-[11px] font-bold text-blue-800/60 leading-relaxed tracking-normal">تخضع ساحة المغامرة لبروتوكولات الشفافية المطلقة؛ كافة النتائج مولدة برمجياً عبر عقود ذكية لضمان العدالة التامة لجميع المستثمرين.</p>
           </div>
        </div>

        {/* Games Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {arenaGames.map((game, i) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className={cn(
                "border-none shadow-sm rounded-[48px] bg-white overflow-hidden group transition-all duration-700 relative flex flex-col h-full",
                game.disabled ? "opacity-60 grayscale" : "hover:shadow-2xl hover:-translate-y-2 border border-gray-50"
              )}>
                <CardContent className="p-10 flex flex-col gap-8 flex-1">
                  <div className="flex justify-between items-start">
                    <div className={cn("h-16 w-16 rounded-[28px] flex items-center justify-center shadow-inner transition-transform group-hover:scale-110", game.bg, game.color)}>
                      <game.icon size={32} />
                    </div>
                    <Badge className={cn(
                      "font-black text-[8px] px-3 py-1 rounded-full border-none shadow-sm tracking-widest",
                      game.risk === 'High' ? "bg-red-50 text-red-500" : 
                      game.risk === 'Medium' ? "bg-orange-50 text-orange-500" : "bg-emerald-50 text-emerald-500"
                    )}>
                      RISK: {game.risk.toUpperCase()}
                    </Badge>
                  </div>

                  <div className="space-y-2 text-right">
                    <h3 className="text-2xl font-black text-[#002d4d] tracking-normal">{game.name}</h3>
                    <p className="text-[11px] font-bold text-gray-400 leading-relaxed line-clamp-2 tracking-normal">{game.desc}</p>
                  </div>

                  <div className="pt-4 mt-auto">
                    {game.disabled ? (
                      <div className="w-full h-14 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-[10px] font-black text-gray-300 uppercase tracking-widest">
                        قريباً في التحديث القادم
                      </div>
                    ) : (
                      <Link href={game.href} className="block">
                        <Button className="w-full h-14 rounded-full bg-[#002d4d] text-white font-black text-sm shadow-xl hover:bg-[#001d33] active:scale-95 transition-all group/btn tracking-normal">
                          ابدأ الآن
                          <PlayCircle className="mr-2 h-5 w-5 group-hover/btn:rotate-12 transition-transform" />
                        </Button>
                      </Link>
                    )}
                  </div>
                </CardContent>
                
                {/* Decorative Pattern */}
                <div className="absolute -bottom-6 -left-6 opacity-[0.02] pointer-events-none group-hover:opacity-[0.05] transition-opacity duration-1000 text-[#002d4d]">
                   <game.icon size={140} />
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Global Branding Footer */}
        <div className="flex flex-col items-center gap-4 py-16 opacity-20 select-none">
           <p className="text-[10px] font-black text-[#002d4d] uppercase tracking-[0.8em]">Namix Arena Protocol v1.0</p>
           <div className="flex gap-2">
              {[...Array(3)].map((_, i) => (<div key={i} className="h-1.5 w-1.5 rounded-full bg-gray-300" />))}
           </div>
        </div>
      </div>
    </Shell>
  );
}
