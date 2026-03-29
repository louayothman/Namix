
"use client";

import React from "react";
import { Logo } from "@/components/layout/Logo";
import { Globe, ShieldCheck, Mail, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface FooterProps {
  onAboutClick: () => void;
}

/**
 * @fileOverview تذييل الصفحة السيادي v5.1 - Minimalist Branding Edition
 * تم إزالة الوصف النصي مع الحفاظ على الهوية وشارات الاعتماد وتنسيق العامودين للموبايل.
 */
export function Footer({ onAboutClick }: FooterProps) {
  return (
    <footer className="bg-gray-50 border-t border-gray-100 pt-16 md:pt-24 pb-12 font-body" dir="rtl">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-12 mb-16 md:mb-20">
          
          {/* Branding & Status - Full width on mobile, 2 cols on desktop */}
          <div className="col-span-2 md:col-span-2 space-y-6 md:space-y-8">
            <Logo size="md" />
            <div className="flex items-center gap-4 md:gap-6">
               <div className="flex items-center gap-2">
                  <ShieldCheck className="h-3.5 w-3.5 md:h-4 md:w-4 text-emerald-500" />
                  <span className="text-[8px] md:text-[10px] font-black text-[#002d4d] uppercase tracking-normal">مرخص ومعتمد</span>
               </div>
               <div className="flex items-center gap-2">
                  <Globe className="h-3.5 w-3.5 md:h-4 md:w-4 text-blue-500" />
                  <span className="text-[8px] md:text-[10px] font-black text-[#002d4d] uppercase tracking-normal">وصول عالمي</span>
               </div>
            </div>
          </div>

          {/* Quick Links - 1 column on mobile */}
          <div className="col-span-1 space-y-5 md:space-y-6">
            <h4 className="font-black text-[#002d4d] text-[11px] md:text-sm uppercase tracking-normal">الروابط السريعة</h4>
            <ul className="space-y-3 md:space-y-4">
              <li>
                <button 
                  onClick={onAboutClick} 
                  className="text-[10px] md:text-sm text-gray-400 hover:text-[#002d4d] font-bold transition-colors text-right tracking-normal"
                >
                  عن المنصة
                </button>
              </li>
              <li>
                <a href="/invest" className="text-[10px] md:text-sm text-gray-400 hover:text-[#002d4d] font-bold transition-colors tracking-normal">الخدمات الاستثمارية</a>
              </li>
              <li>
                <a href="/faq" className="text-[10px] md:text-sm text-gray-400 hover:text-[#002d4d] font-bold transition-colors tracking-normal">مركز المساعدة</a>
              </li>
            </ul>
          </div>

          {/* Contact Support - 1 column on mobile */}
          <div className="col-span-1 space-y-5 md:space-y-6">
            <h4 className="font-black text-[#002d4d] text-[11px] md:text-sm uppercase tracking-normal">تواصل معنا</h4>
            <div className="p-4 md:p-6 bg-white rounded-[24px] md:rounded-[32px] border border-gray-100 shadow-sm flex items-center gap-3 md:gap-4 group">
               <div className="h-8 w-8 md:h-10 md:w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center transition-transform group-hover:scale-110">
                  <Mail className="h-4 w-4 md:h-5 md:w-5" />
               </div>
               <div className="text-right overflow-hidden">
                  <p className="text-[7px] md:text-[8px] font-black text-gray-400 uppercase tracking-normal">الدعم الفني</p>
                  <p className="text-[9px] md:text-xs font-black text-[#002d4d] truncate">info@namix.pro</p>
               </div>
            </div>
          </div>
        </div>

        {/* Legal & Social Bottom Rail */}
        <div className="pt-10 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-6 opacity-40">
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-center md:text-right">
            <p className="text-[8px] md:text-[10px] font-black text-[#002d4d] uppercase tracking-normal">
              © 2024 Namix Universal Network. All rights reserved.
            </p>
            <div className="hidden md:block h-3 w-px bg-gray-300" />
            <p className="text-[8px] md:text-[10px] font-bold text-gray-400 tracking-normal">بروتوكول الأصول الرقمية الموحد</p>
          </div>
          
          <div className="flex gap-2.5">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-1.5 w-1.5 rounded-full bg-gray-300" />
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
