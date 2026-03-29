
"use client";

import React from "react";
import { Logo } from "@/components/layout/Logo";
import { Globe, ShieldCheck, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-100 pt-24 pb-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          <div className="md:col-span-2 space-y-8">
            <Logo size="md" />
            <p className="text-gray-400 font-bold leading-loose max-w-sm">
              ناميكس هي الرائدة العالمية في إدارة الأصول الرقمية. نحن نجمع بين التقنيات المتطورة والنزاهة المالية لتمكين المستثمرين من تحقيق سيادتهم المالية.
            </p>
            <div className="flex items-center gap-6">
               <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  <span className="text-[10px] font-black text-[#002d4d] uppercase tracking-widest">Licensed Protocol</span>
               </div>
               <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-blue-500" />
                  <span className="text-[10px] font-black text-[#002d4d] uppercase tracking-widest">Global Reach</span>
               </div>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="font-black text-[#002d4d] text-sm uppercase tracking-widest">الروابط السريعة</h4>
            <ul className="space-y-4">
              <li><a href="/about" className="text-gray-400 hover:text-[#002d4d] font-bold transition-colors">عن المنصة</a></li>
              <li><a href="/academy" className="text-gray-400 hover:text-[#002d4d] font-bold transition-colors">أكاديمية ناميكس</a></li>
              <li><a href="/faq" className="text-gray-400 hover:text-[#002d4d] font-bold transition-colors">الأسئلة الشائعة</a></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="font-black text-[#002d4d] text-sm uppercase tracking-widest">تواصل معنا</h4>
            <div className="p-6 bg-white rounded-[32px] border border-gray-100 shadow-sm flex items-center gap-4">
               <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Mail className="h-5 w-5" />
               </div>
               <div className="text-right">
                  <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Email Support</p>
                  <p className="text-xs font-black text-[#002d4d]">info@namix.pro</p>
               </div>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-6 opacity-40">
          <p className="text-[10px] font-black text-[#002d4d] uppercase tracking-[0.2em]">© 2024 Namix Universal Network. All rights reserved.</p>
          <div className="flex gap-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-1.5 w-1.5 rounded-full bg-gray-300" />
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
