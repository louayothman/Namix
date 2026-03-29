
"use client";

import React from "react";
import { Logo } from "@/components/layout/Logo";
import { 
  Globe, 
  ShieldCheck, 
  Mail, 
  ChevronLeft, 
  Facebook, 
  Instagram, 
  Twitter, 
  Send, 
  Zap,
  LayoutDashboard,
  Wallet,
  UserPlus
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface FooterProps {
  onAboutClick: () => void;
  onContractLabClick: () => void;
  onSpotTradingClick: () => void;
  onArenaClick: () => void;
}

/**
 * @fileOverview تذييل الصفحة السيادي النهائي v6.0 - Structural Redesign
 * يطبق الهيكل المكون من 4 أقسام مع دعم التنسيق ثنائي الأعمدة على الموبايل وتطهير النصوص.
 */
export function Footer({ onAboutClick, onContractLabClick, onSpotTradingClick, onArenaClick }: FooterProps) {
  return (
    <footer className="bg-gray-50 border-t border-gray-100 pt-16 md:pt-24 pb-12 font-body" dir="rtl">
      <div className="container mx-auto px-6">
        
        {/* Main 4-Column Grid (2 cols on mobile) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-12 mb-16">
          
          {/* Section 1: الخدمات */}
          <div className="space-y-6">
            <h4 className="font-black text-[#002d4d] text-[11px] md:text-sm uppercase tracking-normal flex items-center gap-2">
               <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
               الخدمات
            </h4>
            <ul className="space-y-3">
              <li>
                <button onClick={onContractLabClick} className="text-[10px] md:text-sm text-gray-400 hover:text-[#002d4d] font-bold transition-colors tracking-normal text-right">مختبر العقود</button>
              </li>
              <li>
                <button onClick={onSpotTradingClick} className="text-[10px] md:text-sm text-gray-400 hover:text-[#002d4d] font-bold transition-colors tracking-normal text-right">التداول الفوري</button>
              </li>
              <li>
                <button onClick={onArenaClick} className="text-[10px] md:text-sm text-gray-400 hover:text-[#002d4d] font-bold transition-colors tracking-normal text-right">الترفيه</button>
              </li>
            </ul>
          </div>

          {/* Section 2: المنصة */}
          <div className="space-y-6">
            <h4 className="font-black text-[#002d4d] text-[11px] md:text-sm uppercase tracking-normal flex items-center gap-2">
               <div className="h-1.5 w-1.5 rounded-full bg-[#f9a885]" />
               المنصة
            </h4>
            <ul className="space-y-3">
              <li>
                <button onClick={onAboutClick} className="text-[10px] md:text-sm text-gray-400 hover:text-[#002d4d] font-bold transition-colors tracking-normal text-right">عن Namix</button>
              </li>
              <li>
                <Link href="/faq" className="text-[10px] md:text-sm text-gray-400 hover:text-[#002d4d] font-bold transition-colors tracking-normal">مركز المساعدة</Link>
              </li>
              <li>
                <Link href="/faq" className="text-[10px] md:text-sm text-gray-400 hover:text-[#002d4d] font-bold transition-colors tracking-normal">الأسئلة الشائعة (FAQ)</Link>
              </li>
              <li>
                <Link href="/faq" className="text-[10px] md:text-sm text-gray-400 hover:text-[#002d4d] font-bold transition-colors tracking-normal">سياسة الخصوصية</Link>
              </li>
              <li>
                <Link href="/faq" className="text-[10px] md:text-sm text-gray-400 hover:text-[#002d4d] font-bold transition-colors tracking-normal">الشروط والأحكام</Link>
              </li>
            </ul>
          </div>

          {/* Section 3: تواصل معنا */}
          <div className="space-y-6">
            <h4 className="font-black text-[#002d4d] text-[11px] md:text-sm uppercase tracking-normal flex items-center gap-2">
               <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
               تواصل معنا
            </h4>
            <div className="flex items-center gap-3">
               {[
                 { icon: Facebook, href: "#" },
                 { icon: Send, href: "#" }, // Telegram
                 { icon: Twitter, href: "#" },
                 { icon: Instagram, href: "#" }
               ].map((social, i) => (
                 <a key={i} href={social.href} className="h-8 w-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-[#002d4d] hover:text-[#f9a885] transition-all shadow-sm active:scale-90">
                    <social.icon size={14} />
                 </a>
               ))}
            </div>
            <div className="pt-2">
               <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3 group cursor-pointer hover:shadow-md transition-all">
                  <div className="h-8 w-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center transition-transform group-hover:scale-110">
                     <Mail size={14} />
                  </div>
                  <div className="text-right overflow-hidden">
                     <p className="text-[7px] font-black text-gray-400 uppercase tracking-normal">الدعم الفني</p>
                     <p className="text-[9px] font-black text-[#002d4d] truncate">info@namix.pro</p>
                  </div>
               </div>
            </div>
          </div>

          {/* Section 4: الوصول السريع */}
          <div className="space-y-6">
            <h4 className="font-black text-[#002d4d] text-[11px] md:text-sm uppercase tracking-normal flex items-center gap-2">
               <Zap className="h-3 w-3 text-[#f9a885] fill-current" />
               الوصول السريع
            </h4>
            <ul className="space-y-3">
              <li>
                <Link href="/login" className="flex items-center gap-2 text-[10px] md:text-sm text-gray-400 hover:text-[#002d4d] font-bold transition-colors tracking-normal group">
                   <UserPlus size={12} className="opacity-40 group-hover:opacity-100 transition-opacity" />
                   انضم الآن
                </Link>
              </li>
              <li>
                <Link href="/home" className="flex items-center gap-2 text-[10px] md:text-sm text-gray-400 hover:text-[#002d4d] font-bold transition-colors tracking-normal group">
                   <Wallet size={12} className="opacity-40 group-hover:opacity-100 transition-opacity" />
                   شحن الرصيد
                </Link>
              </li>
              <li>
                <Link href="/home" className="flex items-center gap-2 text-[10px] md:text-sm text-gray-400 hover:text-[#002d4d] font-bold transition-colors tracking-normal group">
                   <LayoutDashboard size={12} className="opacity-40 group-hover:opacity-100 transition-opacity" />
                   لوحة القيادة
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Brand & Rights Rail */}
        <div className="pt-10 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <Logo size="sm" />
            <div className="flex items-center gap-6 opacity-40">
               <div className="flex items-center gap-2">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                  <span className="text-[8px] md:text-[9px] font-black text-[#002d4d] uppercase tracking-normal">مرخص ومعتمد</span>
               </div>
               <div className="flex items-center gap-2">
                  <Globe className="h-3.5 w-3.5 text-blue-500" />
                  <span className="text-[8px] md:text-[9px] font-black text-[#002d4d] uppercase tracking-normal">وصول عالمي</span>
               </div>
            </div>
          </div>
          
          <div className="flex flex-col items-center md:items-end gap-2 opacity-30">
            <p className="text-[8px] md:text-[9px] font-black text-[#002d4d] uppercase tracking-normal">
              © 2024 Namix Universal Network. All rights reserved.
            </p>
            <p className="text-[7px] md:text-[8px] font-bold text-gray-400 tracking-normal uppercase">بروتوكول الأصول الرقمية الموحد</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
