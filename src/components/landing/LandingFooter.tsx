
"use client";

import React from "react";
import { Logo } from "@/components/layout/Logo";
import Link from "next/link";
import { Globe, Mail, ShieldCheck, Twitter, Instagram, Send } from "lucide-react";

/**
 * @fileOverview الفوتر النخبوي v41.0
 */
export function LandingFooter() {
  return (
    <footer className="bg-[#020617] pt-32 pb-12 px-6 md:px-12 border-t border-white/5 relative z-10">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
          
          <div className="md:col-span-2 space-y-10">
            <Logo size="md" className="brightness-200" />
            <p className="text-slate-500 text-sm md:text-base font-medium leading-loose max-w-md text-right md:text-right" dir="rtl">
              بوابة ناميكس السيادية لإدارة الأصول الرقمية. القوة التقنية في خدمة النمو المالي المستدام لنخبة المستثمرين حول العالم.
            </p>
            <div className="flex items-center gap-6">
               {[Twitter, Instagram, Send].map((Icon, i) => (
                 <button key={i} className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all">
                    <Icon size={18} />
                 </button>
               ))}
            </div>
          </div>

          <div className="space-y-8 text-right" dir="rtl">
            <h4 className="font-black text-xs text-white uppercase tracking-widest">أقسام المنصة</h4>
            <ul className="space-y-4">
              {[
                { n: "مختبر العقود", h: "/invest" },
                { n: "محرك التداول", h: "/trade" },
                { n: "ساحة المغامرة", h: "/arena" },
                { n: "من نحن", h: "/about" }
              ].map((link) => (
                <li key={link.n}>
                  <Link href={link.h} className="text-slate-500 hover:text-blue-400 transition-colors font-bold text-sm">{link.n}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-8 text-right" dir="rtl">
            <h4 className="font-black text-xs text-white uppercase tracking-widest">الميثاق والخصوصية</h4>
            <ul className="space-y-4">
              {[
                { n: "الشروط والأحكام", h: "/legal" },
                { n: "سياسة الخصوصية", h: "/legal" },
                { n: "مركز المساعدة", h: "/faq" },
                { n: "تواصل معنا", h: "/support" }
              ].map((link) => (
                <li key={link.n}>
                  <Link href={link.h} className="text-slate-500 hover:text-blue-400 transition-colors font-bold text-sm">{link.n}</Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 opacity-40">
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-500">NAMIX SOVEREIGN NETWORK</p>
          <div className="flex items-center gap-8 text-[9px] font-bold text-slate-500 uppercase tracking-widest">
             <div className="flex items-center gap-2">
                <ShieldCheck size={12} className="text-blue-500" />
                <span>Verified System 2024</span>
             </div>
             <span>Build v4.1.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
