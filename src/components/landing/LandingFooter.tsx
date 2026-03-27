
"use client";

import React from "react";
import { Globe } from "lucide-react";

/**
 * @fileOverview تذييل الصفحة v5.5
 */

export function LandingFooter() {
  return (
    <footer className="pt-24 pb-12 border-t border-white/5 px-6 relative z-10">
       <div className="container mx-auto space-y-20">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12 text-right" dir="rtl">
             
             <div className="col-span-2 space-y-8">
                <div className="flex items-center gap-3" dir="ltr">
                   <div className="grid grid-cols-2 gap-1">
                      <div className="h-2 w-2 rounded-full bg-white" />
                      <div className="h-2 w-2 rounded-full bg-[#f9a885]" />
                      <div className="h-2 w-2 rounded-full bg-[#f9a885]" />
                      <div className="h-2 w-2 rounded-full bg-white" />
                   </div>
                   <h1 className="text-2xl font-black tracking-tighter text-white italic">NAMIX</h1>
                </div>
                <p className="text-sm text-white/40 font-medium leading-loose max-w-xs">
                  منصة عالمية متطورة لإدارة وتنمية الأصول الرقمية بذكاء وأمان. انضم لمستقبل المال اليوم بكل ثقة.
                </p>
                <div className="flex gap-4 justify-end">
                   {[1, 2, 3, 4].map(i => (
                     <div key={i} className="h-10 w-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white hover:text-[#002d4d] cursor-pointer transition-all opacity-40 hover:opacity-100">
                        <Globe size={16} />
                     </div>
                   ))}
                </div>
             </div>

             <div className="space-y-6">
                <h4 className="text-[11px] font-black text-white uppercase tracking-widest">المنصة <span className="opacity-20 ml-1">Platform</span></h4>
                <ul className="space-y-4 text-[13px] font-bold text-white/40">
                   <li className="hover:text-[#f9a885] cursor-pointer transition-all">الاستثمارات</li>
                   <li className="hover:text-[#f9a885] cursor-pointer transition-all">الشركاء</li>
                   <li className="hover:text-[#f9a885] cursor-pointer transition-all">الأسواق الحية</li>
                </ul>
             </div>

             <div className="space-y-6">
                <h4 className="text-[11px] font-black text-white uppercase tracking-widest">المساعدة <span className="opacity-20 ml-1">Support</span></h4>
                <ul className="space-y-4 text-[13px] font-bold text-white/40">
                   <li className="hover:text-[#f9a885] cursor-pointer transition-all">التعليمات</li>
                   <li className="hover:text-[#f9a885] cursor-pointer transition-all">مركز الدعم</li>
                   <li className="hover:text-[#f9a885] cursor-pointer transition-all">الأسئلة الشائعة</li>
                </ul>
             </div>

             <div className="space-y-6">
                <h4 className="text-[11px] font-black text-white uppercase tracking-widest">قانوني <span className="opacity-20 ml-1">Legal</span></h4>
                <ul className="space-y-4 text-[13px] font-bold text-white/40">
                   <li className="hover:text-[#f9a885] cursor-pointer transition-all">شروط الخدمة</li>
                   <li className="hover:text-[#f9a885] cursor-pointer transition-all">سياسة الخصوصية</li>
                   <li className="hover:text-[#f9a885] cursor-pointer transition-all">ميثاق الأمان</li>
                </ul>
             </div>

             <div className="space-y-6">
                <h4 className="text-[11px] font-black text-white uppercase tracking-widest">الشركة <span className="opacity-20 ml-1">About</span></h4>
                <ul className="space-y-4 text-[13px] font-bold text-white/40">
                   <li className="hover:text-[#f9a885] cursor-pointer transition-all">عن نامكس</li>
                   <li className="hover:text-[#f9a885] cursor-pointer transition-all">تواصل معنا</li>
                   <li className="hover:text-[#f9a885] cursor-pointer transition-all">الشركاء</li>
                </ul>
             </div>

          </div>

          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
             <p className="text-[10px] font-black tracking-[0.5em] uppercase text-white/10">NAMIX UNIVERSAL NETWORK</p>
             <p className="text-[10px] font-bold text-white/20">© 2024 كافة الحقوق محفوظة لمنصة ناميكس الذكية.</p>
          </div>
       </div>
    </footer>
  );
}
