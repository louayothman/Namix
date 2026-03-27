"use client";

import React from "react";
import { Logo } from "@/components/layout/Logo";
import { Globe, Mail, Instagram, Twitter, Activity } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="py-24 px-6 bg-black/20 border-t border-white/5 relative z-10 overflow-hidden">
       <div className="container mx-auto space-y-20">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-16 text-right" dir="rtl">
             
             <div className="col-span-2 space-y-8">
                <Logo size="md" className="brightness-200" />
                <p className="text-white/30 font-bold leading-loose max-w-xs text-[13px]">
                  المنصة العالمية الرائدة في إدارة وتنمية الأصول الرقمية بذكاء وأمان مطلق. نحن نبني مستقبل المال معك في بيئة تقنية فاخرة.
                </p>
                <div className="flex gap-4 justify-end">
                   {[Twitter, Instagram, Mail].map((Icon, i) => (
                     <div key={i} className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#f9a885] hover:text-[#002d4d] cursor-pointer transition-all text-white/40 shadow-sm">
                        <Icon size={18} />
                     </div>
                   ))}
                </div>
             </div>

             <div className="space-y-6">
                <h4 className="font-black text-white uppercase text-[13px]">المنصة</h4>
                <ul className="space-y-4 font-bold text-white/30 text-[13px]">
                   <li className="hover:text-[#f9a885] cursor-pointer transition-all">الأسواق الحية</li>
                   <li className="hover:text-[#f9a885] cursor-pointer transition-all">مختبر العقود</li>
                   <li className="hover:text-[#f9a885] cursor-pointer transition-all">ساحة التداول</li>
                </ul>
             </div>

             <div className="space-y-6">
                <h4 className="font-black text-white uppercase text-[13px]">المساعدة</h4>
                <ul className="space-y-4 font-bold text-white/30 text-[13px]">
                   <li className="hover:text-[#f9a885] cursor-pointer transition-all">الأكاديمية</li>
                   <li className="hover:text-[#f9a885] cursor-pointer transition-all">مركز الدعم</li>
                   <li className="hover:text-[#f9a885] cursor-pointer transition-all">الأسئلة الشائعة</li>
                </ul>
             </div>

             <div className="space-y-6">
                <h4 className="font-black text-white uppercase text-[13px]">قانوني</h4>
                <ul className="space-y-4 font-bold text-white/30 text-[13px]">
                   <li className="hover:text-[#f9a885] cursor-pointer transition-all">شروط الخدمة</li>
                   <li className="hover:text-[#f9a885] cursor-pointer transition-all">الخصوصية</li>
                   <li className="hover:text-[#f9a885] cursor-pointer transition-all">الأمان</li>
                </ul>
             </div>

             <div className="space-y-6">
                <h4 className="font-black text-white uppercase text-[13px]">الشركة</h4>
                <ul className="space-y-4 font-bold text-white/30 text-[13px]">
                   <li className="hover:text-[#f9a885] cursor-pointer transition-all">عن ناميكس</li>
                   <li className="hover:text-[#f9a885] cursor-pointer transition-all">تواصل معنا</li>
                   <li className="hover:text-[#f9a885] cursor-pointer transition-all">الشركاء</li>
                </ul>
             </div>

          </div>

          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 opacity-20">
             <div className="flex items-center gap-3">
                <Activity size={14} className="text-[#f9a885] animate-pulse" />
                <p className="font-black uppercase text-[10px] tracking-[0.5em]">NAMIX UNIVERSAL NETWORK</p>
             </div>
             <div className="flex items-center gap-2">
                <Globe size={12} />
                <p className="font-bold text-white/60 text-[10px]">© 2024 كافة الحقوق محفوظة لمنصة ناميكس الموثقة.</p>
             </div>
          </div>
       </div>
    </footer>
  );
}