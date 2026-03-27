
"use client";

import React from "react";
import { Logo } from "@/components/layout/Logo";
import Link from "next/link";
import { Globe, Mail, ShieldCheck } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="bg-[#0a0e17] pt-32 pb-12 px-6 md:px-12 border-t border-white/5 relative z-10 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[300px] bg-blue-600/5 blur-[120px] pointer-events-none" />

      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
          
          <div className="md:col-span-2 space-y-8">
            <Logo size="md" className="brightness-200" />
            <p className="text-gray-400 text-base font-medium leading-loose max-w-md text-right md:text-right" dir="rtl">
              ناميكس هي بوابتك المتطورة لإدارة الأصول الرقمية. نحن نجمع بين التكنولوجيا الفائقة والأمان المطلق لتوفير تجربة استثمارية تليق بالنخبة.
            </p>
            <div className="flex items-center gap-6 opacity-30">
               <div className="flex items-center gap-2">
                  <ShieldCheck size={16} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Secured Node</span>
               </div>
               <div className="flex items-center gap-2">
                  <Globe size={16} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Global Network</span>
               </div>
            </div>
          </div>

          <div className="space-y-6 text-right" dir="rtl">
            <h4 className="font-black text-sm text-white uppercase tracking-widest">روابط سريعة</h4>
            <ul className="space-y-4">
              {["مختبر العقود", "التداول الفوري", "ساحة المغامرة", "من نحن"].map((link) => (
                <li key={link}>
                  <Link href="#" className="text-gray-500 hover:text-[#00d1ff] transition-colors font-bold text-sm">{link}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6 text-right" dir="rtl">
            <h4 className="font-black text-sm text-white uppercase tracking-widest">الدعم والخصوصية</h4>
            <ul className="space-y-4">
              {["الشروط والأحكام", "سياسة الخصوصية", "مركز المساعدة", "تواصل معنا"].map((link) => (
                <li key={link}>
                  <Link href="#" className="text-gray-500 hover:text-[#00d1ff] transition-colors font-bold text-sm">{link}</Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 opacity-40">
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white">NAMIX UNIVERSAL NETWORK</p>
          <div className="flex items-center gap-8 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
             <div className="flex items-center gap-2">
                <Mail size={12} />
                <span>support@namix.com</span>
             </div>
             <span>© 2024</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
