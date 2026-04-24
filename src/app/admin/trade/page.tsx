
"use client";

import { Shell } from "@/components/layout/Shell";
import { Card, CardContent } from "@/components/ui/card";
import { 
  BrainCircuit, 
  Globe, 
  Zap, 
  Cpu, 
  ChevronLeft, 
  Sparkles, 
  Activity,
  ArrowRight,
  Send
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * @fileOverview NAMIX TRADING COMMAND HUB v13.0 - Telegram Matrix Added
 * قُمرة القيادة الرئيسية التي تفتح بوابات التحكم في المفاعلات المستقلة.
 */

const NAV_CARDS = [
  { 
    id: 'ai', 
    title: "ضبط NAMIX AI", 
    desc: "معايرة المحركات العصبية وعتبات الثقة الاستخباراتية للمتداولين.", 
    icon: BrainCircuit, 
    color: "text-blue-600", 
    bg: "bg-blue-50", 
    href: "/admin/trade/ai" 
  },
  { 
    id: 'markets', 
    title: "ضبط الأسواق العالمية", 
    desc: "إدارة قائمة الأصول، المزامنة، والمدد الزمنية المخصصة لكل سوق.", 
    icon: Globe, 
    color: "text-[#f9a885]", 
    bg: "bg-orange-50", 
    href: "/admin/trade/markets" 
  },
  { 
    id: 'telegram', 
    title: "مصفوفة تلغرام", 
    desc: "إدارة بوتات البث المتعددة، التوكنات، وسجل الإشارات اللحظية.", 
    icon: Send, 
    color: "text-blue-500", 
    bg: "bg-blue-50", 
    href: "/admin/telegram" 
  },
  { 
    id: 'api', 
    title: "ضبط بروتوكولات API", 
    desc: "إدارة مفاتيح الربط الدولية وتسمية المصادر المعتمدة للمزامنة.", 
    icon: Cpu, 
    color: "text-purple-600", 
    bg: "bg-purple-50", 
    href: "/admin/trade/api" 
  },
  { 
    id: 'config', 
    title: "ضبط تداول ناميكس", 
    desc: "التحكم في حالة البوابة، حدود مبالغ الدخول، والسياسات العالمية.", 
    icon: Zap, 
    color: "text-emerald-600", 
    bg: "bg-emerald-50", 
    href: "/admin/trade/config" 
  },
];

export default function NamixTradingAdminHub() {
  return (
    <Shell isAdmin>
      <div className="max-w-6xl mx-auto space-y-12 px-6 pt-10 pb-32 font-body text-right" dir="rtl">
        
        {/* Hub Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-gray-100 pb-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-blue-500 font-black text-[9px] uppercase tracking-[0.4em] justify-start">
              <div className="h-2.5 w-2.5 rounded-full bg-blue-500 animate-pulse" />
              Sovereign Trading Command <span className="opacity-30 mx-2">•</span> قمرة قيادة التداول
            </div>
            <h1 className="text-3xl font-black text-[#002d4d] tracking-tight">مركز عمليات ناميكس</h1>
            <p className="text-muted-foreground font-bold text-[10px] flex items-center gap-2">
               <Sparkles className="h-3.5 w-3.5 text-[#f9a885]" /> اختر المفاعل المراد التحكم فيه لضبط بنية التداول اللحظي.
            </p>
          </div>
        </div>

        {/* Dynamic Navigation Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 animate-in fade-in zoom-in-95 duration-700">
          {NAV_CARDS.map((card, i) => (
            <Link key={card.id} href={card.href} className="block group outline-none">
              <motion.div
                whileHover={{ y: -5, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="p-8 bg-white rounded-[56px] border border-gray-50 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col gap-8 relative overflow-hidden h-full"
              >
                {/* Background Ghost Icon */}
                <div className={cn(
                  "absolute -top-10 -left-10 p-10 opacity-[0.02] group-hover:rotate-12 transition-transform duration-1000",
                  card.color
                )}>
                   <card.icon className="h-40 w-40" />
                </div>

                <div className="flex items-center justify-between relative z-10">
                   <div className={cn(
                     "h-16 w-16 rounded-[24px] flex items-center justify-center shadow-inner transition-transform group-hover:scale-110",
                     card.bg, card.color
                   )}>
                      <card.icon className="h-8 w-8" />
                   </div>
                   <div className="h-10 w-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-200 group-hover:bg-[#002d4d] group-hover:text-[#f9a885] transition-all shadow-sm">
                      <ArrowRight className="h-5 w-5 rotate-180" />
                   </div>
                </div>

                <div className="space-y-2 relative z-10">
                   <h3 className="text-2xl font-black text-[#002d4d]">{card.title}</h3>
                   <p className="text-[13px] text-gray-400 font-bold leading-relaxed">{card.desc}</p>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>

        {/* Sovereign Footer */}
        <div className="flex flex-col items-center gap-4 pt-24 opacity-20 select-none">
           <p className="text-[10px] font-black text-[#002d4d] uppercase tracking-[0.8em]">Operational Infrastructure Hub v13.0</p>
           <div className="flex gap-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-1.5 w-1.5 rounded-full bg-gray-300" />
              ))}
           </div>
        </div>
      </div>
    </Shell>
  );
}
