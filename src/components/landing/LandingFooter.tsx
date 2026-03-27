
"use client";

import React from "react";
import { Logo } from "@/components/layout/Logo";
import Link from "next/link";
import { Globe, Mail, ShieldCheck } from "lucide-react";

/**
 * @fileOverview الفوتر المؤسسي v2.0
 */
export function LandingFooter() {
  return (
    <footer className="bg-white pt-32 pb-12 px-6 md:px-12 border-t border-gray-100 relative z-10">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
          
          <div className="md:col-span-2 space-y-8">
            <Logo size="md" />
            <p className="text-gray-400 text-base font-medium leading-loose max-w-md text-right md:text-right" dir="rtl">
              ناميكس هي بوابتك المتطورة لإدارة الأصول الرقمية. نحن نجمع بين التكنولوجيا الفائقة والأمان المطلق لتوفير تجربة استثمارية تليق بالنخبة.
            </p>
            <div className="flex items-center gap-6 opacity-30">
               <div className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-[#002d4d]" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#002d4d]">Secured Infrastructure</span>
               </div>
               <div className="flex items-center gap-2">
                  <Globe size={16} className="text-[#002d4d]" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#002d4d]">Global Network</span>
               </div>
            </div>
          </div>

          <div className="space-y-6 text-right" dir="rtl">
            <h4 className="font-black text-sm text-[#002d4d] uppercase tracking-widest">روابط سريعة</h4>
            <ul className="space-y-4">
              {["مختبر العقود", "التداول الفوري", "ساحة المغامرة", "من نحن"].map((link) => (
                <li key={link}>
                  <Link href="#" className="text-gray-400 hover:text-[#002d4d] transition-colors font-bold text-sm">{link}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6 text-right" dir="rtl">
            <h4 className="font-black text-sm text-[#002d4d] uppercase tracking-widest">الدعم والخصوصية</h4>
            <ul className="space-y-4">
              {["الشروط والأحكام", "سياسة الخصوصية", "مركز المساعدة", "تواصل معنا"].map((link) => (
                <li key={link}>
                  <Link href="#" className="text-gray-400 hover:text-[#002d4d] transition-colors font-bold text-sm">{link}</Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        <div className="pt-12 border-t border-gray-50 flex flex-col md:flex-row items-center justify-between gap-6 opacity-40">
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[#002d4d]">NAMIX UNIVERSAL NETWORK</p>
          <div className="flex items-center gap-8 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
             <div className="flex items-center gap-2">
                <Mail size={12} />
                <span>support@namix.pro</span>
             </div>
             <span>© 2024</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
