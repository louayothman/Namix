
"use client";

import React from "react";
import { Logo } from "@/components/layout/Logo";
import { Globe, Mail, Instagram, Twitter } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="pt-32 pb-12 px-6 bg-white border-t border-gray-100 relative z-10">
       <div className="container mx-auto space-y-24">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-16 text-right" dir="rtl">
             
             <div className="col-span-2 space-y-8">
                <Logo size="md" className="opacity-80" />
                <p className="text-gray-400 font-bold leading-loose max-w-xs">
                  المنصة العالمية الرائدة في إدارة وتنمية الأصول الرقمية بذكاء وأمان مطلق. نحن نبني مستقبل المال معك.
                </p>
                <div className="flex gap-4 justify-end">
                   {[Twitter, Instagram, Mail].map((Icon, i) => (
                     <div key={i} className="h-12 w-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center hover:bg-[#002d4d] hover:text-white cursor-pointer transition-all text-gray-400 shadow-sm">
                        <Icon size={18} />
                     </div>
                   ))}
                </div>
             </div>

             <div className="space-y-6">
                <h4 className="font-black text-[#002d4d] uppercase">المنصة</h4>
                <ul className="space-y-4 font-bold text-gray-400">
                   <li className="hover:text-blue-600 cursor-pointer transition-all">الأسواق الحية</li>
                   <li className="hover:text-blue-600 cursor-pointer transition-all">مختبر العقود</li>
                   <li className="hover:text-blue-600 cursor-pointer transition-all">ساحة التداول</li>
                </ul>
             </div>

             <div className="space-y-6">
                <h4 className="font-black text-[#002d4d] uppercase">المساعدة</h4>
                <ul className="space-y-4 font-bold text-gray-400">
                   <li className="hover:text-blue-600 cursor-pointer transition-all">الأكاديمية</li>
                   <li className="hover:text-blue-600 cursor-pointer transition-all">مركز الدعم</li>
                   <li className="hover:text-blue-600 cursor-pointer transition-all">الأسئلة الشائعة</li>
                </ul>
             </div>

             <div className="space-y-6">
                <h4 className="font-black text-[#002d4d] uppercase">قانوني</h4>
                <ul className="space-y-4 font-bold text-gray-400">
                   <li className="hover:text-blue-600 cursor-pointer transition-all">شروط الخدمة</li>
                   <li className="hover:text-blue-600 cursor-pointer transition-all">الخصوصية</li>
                   <li className="hover:text-blue-600 cursor-pointer transition-all">الأمان</li>
                </ul>
             </div>

             <div className="space-y-6">
                <h4 className="font-black text-[#002d4d] uppercase">الشركة</h4>
                <ul className="space-y-4 font-bold text-gray-400">
                   <li className="hover:text-blue-600 cursor-pointer transition-all">عن ناميكس</li>
                   <li className="hover:text-blue-600 cursor-pointer transition-all">تواصل معنا</li>
                   <li className="hover:text-blue-600 cursor-pointer transition-all">الشركاء</li>
                </ul>
             </div>

          </div>

          <div className="pt-12 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-8 opacity-40">
             <p className="font-black uppercase text-[#002d4d]">NAMIX UNIVERSAL NETWORK</p>
             <div className="flex items-center gap-2">
                <Globe size={12} />
                <p className="font-bold text-gray-400">© 2024 كافة الحقوق محفوظة لمنصة ناميكس الموثقة.</p>
             </div>
          </div>
       </div>
    </footer>
  );
}
