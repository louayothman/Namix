
"use client";

import React, { useEffect, useState } from "react";
import { Logo } from "@/components/layout/Logo";
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Send, 
  Linkedin, 
  Youtube, 
  Github, 
  Mail, 
  Phone, 
  MessageSquare,
  Globe,
  Zap,
  LayoutDashboard,
  Wallet,
  UserPlus,
  ShieldCheck,
  Headset
} from "lucide-react";
import { useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import { useRouter } from "next/navigation";

const ICON_MAP: Record<string, any> = {
  Facebook, Send, Twitter, Instagram, Linkedin, Youtube, Github, Mail, Phone, MessageSquare, Globe
};

interface FooterProps {
  onAboutClick: () => void;
  onContractLabClick: () => void;
  onSpotTradingClick: () => void;
  onArenaClick: () => void;
  onFAQClick: () => void;
  onPrivacyClick: () => void;
  onTermsClick: () => void;
  onSupportClick: () => void;
}

export function Footer({ 
  onAboutClick, 
  onContractLabClick, 
  onSpotTradingClick, 
  onArenaClick,
  onFAQClick,
  onPrivacyClick,
  onTermsClick,
  onSupportClick
}: FooterProps) {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const db = useFirestore();
  const landingRef = useMemoFirebase(() => doc(db, "system_settings", "landing_page"), [db]);
  const { data: landingData } = useDoc(landingRef);

  useEffect(() => {
    const user = localStorage.getItem("namix_user");
    setIsLoggedIn(!!user);
  }, []);

  const handleProtectedNavigation = (path: string) => {
    if (isLoggedIn) {
      router.push(path);
    } else {
      router.push("/login");
    }
  };

  return (
    <footer className="bg-gray-50 border-t border-gray-100 pt-16 md:pt-24 pb-12 font-body" dir="rtl">
      <div className="container mx-auto px-6">
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-12 mb-16">
          
          {/* Section 1: الخدمات */}
          <div className="space-y-6">
            <h4 className="font-black text-[#002d4d] text-[11px] md:text-sm uppercase tracking-normal flex items-center gap-2">
               <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
               الخدمات
            </h4>
            <ul className="space-y-3">
              <li>
                <button onClick={onContractLabClick} className="text-[10px] md:text-sm text-gray-400 hover:text-[#002d4d] font-bold transition-colors tracking-normal text-right outline-none">مختبر العقود</button>
              </li>
              <li>
                <button onClick={onSpotTradingClick} className="text-[10px] md:text-sm text-gray-400 hover:text-[#002d4d] font-bold transition-colors tracking-normal text-right outline-none">التداول الفوري</button>
              </li>
              <li>
                <button onClick={onArenaClick} className="text-[10px] md:text-sm text-gray-400 hover:text-[#002d4d] font-bold transition-colors tracking-normal text-right outline-none">الترفيه</button>
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
                <button onClick={onAboutClick} className="text-[10px] md:text-sm text-gray-400 hover:text-[#002d4d] font-bold transition-colors tracking-normal text-right outline-none">عن Namix</button>
              </li>
              <li>
                <button onClick={onFAQClick} className="text-[10px] md:text-sm text-gray-400 hover:text-[#002d4d] font-bold transition-colors tracking-normal text-right outline-none">الأسئلة الشائعة (FAQ)</button>
              </li>
              <li>
                <button onClick={onPrivacyClick} className="text-[10px] md:text-sm text-gray-400 hover:text-[#002d4d] font-bold transition-colors tracking-normal text-right outline-none">سياسة الخصوصية</button>
              </li>
              <li>
                <button onClick={onTermsClick} className="text-[10px] md:text-sm text-gray-400 hover:text-[#002d4d] font-bold transition-colors tracking-normal text-right outline-none">الشروط والأحكام</button>
              </li>
            </ul>
          </div>

          {/* Section 3: تابعنا على (Dynamic) */}
          <div className="space-y-6">
            <h4 className="font-black text-[#002d4d] text-[11px] md:text-sm uppercase tracking-normal flex items-center gap-2">
               <div className="h-1.5 w-1.5 rounded-full bg-blue-600" />
               تابعنا على
            </h4>
            <div className="flex flex-wrap items-center gap-3">
               {(landingData?.socialLinks || []).map((social: any) => {
                 const Icon = ICON_MAP[social.icon] || Globe;
                 return (
                   <a key={social.id} href={social.url} target="_blank" rel="noopener noreferrer" className="h-9 w-9 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-[#002d4d] hover:text-[#f9a885] transition-all shadow-sm active:scale-90" title={social.label}>
                      <Icon size={16} />
                   </a>
                 );
               })}
               {(!landingData?.socialLinks || landingData.socialLinks.length === 0) && <p className="text-[8px] text-gray-300 font-bold">جاري تحديث القنوات...</p>}
            </div>
            
            {/* Contact Section Sub */}
            <div className="pt-4 space-y-4">
               <h4 className="font-black text-[#002d4d] text-[11px] md:text-sm uppercase tracking-normal flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  تواصل معنا
               </h4>
               <div className="flex flex-wrap items-center gap-3">
                  <button onClick={onSupportClick} className="h-9 w-9 rounded-xl bg-[#002d4d] text-[#f9a885] flex items-center justify-center shadow-lg active:scale-90 transition-all" title="الدعم المباشر">
                     <Headset size={16} />
                  </button>
                  {(landingData?.contactLinks || []).map((contact: any) => {
                    const Icon = ICON_MAP[contact.icon] || Mail;
                    return (
                      <a key={contact.id} href={contact.url} target="_blank" rel="noopener noreferrer" className="h-9 w-9 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-emerald-500 hover:text-white transition-all shadow-sm active:scale-90" title={contact.label}>
                         <Icon size={16} />
                      </a>
                    );
                  })}
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
                <button 
                  onClick={() => handleProtectedNavigation("/home")} 
                  className="flex items-center gap-2 text-[10px] md:text-sm text-gray-400 hover:text-[#002d4d] font-bold transition-colors tracking-normal group outline-none"
                >
                   <UserPlus size={12} className="opacity-40 group-hover:opacity-100 transition-opacity" />
                   انضم الآن
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleProtectedNavigation("/home")} 
                  className="flex items-center gap-2 text-[10px] md:text-sm text-gray-400 hover:text-[#002d4d] font-bold transition-colors tracking-normal group outline-none"
                >
                   <Wallet size={12} className="opacity-40 group-hover:opacity-100 transition-opacity" />
                   شحن الرصيد
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleProtectedNavigation("/home")} 
                  className="flex items-center gap-2 text-[10px] md:text-sm text-gray-400 hover:text-[#002d4d] font-bold transition-colors tracking-normal group outline-none"
                >
                   <LayoutDashboard size={12} className="opacity-40 group-hover:opacity-100 transition-opacity" />
                   لوحة القيادة
                </button>
              </li>
            </ul>
          </div>

        </div>

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
