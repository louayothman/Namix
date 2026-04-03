
"use client";

import { Shell } from "@/components/layout/Shell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Gem, Zap, Sparkles, ChevronRight, ShieldCheck, PlayCircle, Dices, RefreshCcw } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * @fileOverview ساحة المغامرة v6.0 - Gaming Hub
 * تم تحديث قائمة الألعاب لتشمل "عجلة السيولة" مع تطهير كامل للهوية النصية.
 */

const arenaGames = [
  {
    id: "wheel",
    name: "Liquid Wheel",
    desc: "مفاعل تدوير السيولة؛ ضاعف أصولك عبر اقتناص عُقد النمو المتقدمة.",
    risk: "Medium",
    href: "/arena/wheel",
    icon: RefreshCcw,
    color: "text-emerald-500",
    bg: "bg-emerald-50"
  },
  {
    id: "mines",
    name: "Elite Mines",
    desc: "استكشف حقول النمو المربحة وتجنب العثرات التقنية في الشبكة الاحترافية.",
    risk: "Dynamic",
    href: "/arena/mines",
    icon: Gem,
    color: "text-blue-500",
    bg: "bg-blue-50"
  },
  {
    id: "dice",
    name: "Nexus Dice",
    desc: "توقع المسار الرقمي القادم عبر مصفوفة الاحتمالات المتقدمة.",
    risk: "Custom",
    href: "/arena/dice",
    icon: Dices,
    color: "text-orange-500",
    bg: "bg-orange-50"
  },
  {
    id: "crash",
    name: "Namix Crash",
    desc: "نظام الصعود الوميضي؛ ضاعف أرباحك قبل الانفجار السعري المباغت.",
    risk: "High",
    href: "#",
    icon: Zap,
    color: "text-[#f9a885]",
    bg: "bg-[#f9a885]/10",
    disabled: true,
    badge: "تحت الصيانة"
  }
];

export default function ArenaPage() {
  return (
    <Shell>
      <div className="max-w-4xl mx-auto space-y-8 px-6 pt-10 pb-32 font-body text-right tracking-normal" dir="rtl">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-100 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[#f9a885] font-black text-[9px] uppercase tracking-[0.4em] justify-start">
              <div className="h-2 w-2 rounded-full bg-[#f9a885] animate-pulse" />
              Professional Adventure Arena
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-[#002d4d] tracking-tight">ساحة المغامرة</h1>
            <p className="text-muted-foreground font-bold text-[10px]">فرص تفاعلية لتعظيم العوائد بذكاء وجرأة استراتيجية متقدمة.</p>
          </div>
          
          <Link href="/home">
            <Button variant="ghost" className="rounded-2xl bg-white shadow-sm h-12 px-6 border border-gray-100 active:scale-95 transition-all hover:shadow-md font-black text-[10px] text-[#002d4d]">
              <ChevronRight className="ml-2 h-4 w-4" /> العودة للرئيسية
            </Button>
          </Link>
        </div>

        <div className="p-5 bg-blue-50/50 rounded-2xl border border-blue-100 flex items-start gap-4">
           <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center text-blue-600 shadow-sm shrink-0">
              <ShieldCheck className="h-5 w-5" />
           </div>
           <div className="space-y-1 pt-0.5">
              <p className="text-xs font-black text-blue-900">ميثاق الترفيه المسؤول</p>
              <p className="text-[10px] font-bold text-blue-800/60 leading-relaxed">تخضع ساحة المغامرة لمعايير الشفافية المطلقة؛ كافة النتائج مولدة برمجياً لضمان العدالة التامة لجميع المستثمرين.</p>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {arenaGames.map((game, i) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className={cn(
                "border-none shadow-sm rounded-3xl bg-white overflow-hidden group transition-all duration-500 relative flex flex-col h-full",
                game.disabled ? "opacity-60 grayscale" : "hover:shadow-xl border border-gray-100"
              )}>
                <CardContent className="p-8 flex flex-col gap-6 flex-1">
                  <div className="flex justify-between items-start">
                    <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center shadow-inner transition-transform group-hover:scale-110", game.bg, game.color)}>
                      <game.icon size={28} />
                    </div>
                    <Badge className={cn(
                      "font-black text-[8px] px-3 py-1 rounded-full border-none shadow-sm tracking-widest",
                      game.risk === 'High' ? "bg-red-50 text-red-500" : 
                      game.risk === 'Medium' ? "bg-emerald-50 text-emerald-500" : "bg-blue-50 text-blue-500"
                    )}>
                      RISK: {game.risk.toUpperCase()}
                    </Badge>
                  </div>

                  <div className="space-y-2 text-right">
                    <div className="flex items-center gap-3 justify-end">
                       <h3 className="text-xl font-black text-[#002d4d]">{game.name}</h3>
                       {game.badge && <Badge className="bg-[#002d4d] text-[#f9a885] border-none text-[7px] font-black">{game.badge}</Badge>}
                    </div>
                    <p className="text-[11px] font-bold text-gray-400 leading-relaxed line-clamp-2">{game.desc}</p>
                  </div>

                  <div className="pt-2 mt-auto">
                    {game.disabled ? (
                      <div className="w-full h-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-[9px] font-black text-gray-300 uppercase tracking-widest">
                        {game.badge}
                      </div>
                    ) : (
                      <Link href={game.href} className="block">
                        <Button className="w-full h-12 rounded-2xl bg-[#002d4d] text-white font-black text-xs shadow-lg hover:bg-[#001d33] active:scale-95 transition-all group/btn">
                          بدء المحاولة
                          <PlayCircle className="mr-2 h-4 w-4 group-hover/btn:rotate-12 transition-transform" />
                        </Button>
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-col items-center gap-4 py-12 opacity-20 select-none">
           <p className="text-[9px] font-black text-[#002d4d] uppercase tracking-[0.8em]">Namix Arena Hub v6.0</p>
           <div className="flex gap-2">
              {[...Array(3)].map((_, i) => (<div key={i} className="h-1 w-1 rounded-full bg-gray-300" />))}
           </div>
        </div>
      </div>
    </Shell>
  );
}
