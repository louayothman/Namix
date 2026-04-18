
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
  UserPlus
} from "lucide-react";
import { useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

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
    <footer className="bg-transparent border-t border-gray-100 pt-16 md:pt-24 pb-12 font-body relative overflow-hidden" dir="rtl">
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none">
        <motion.div 
          animate={{ rotate: [0, 5, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-32 -left-32 opacity-[0.03] scale-[4] md:scale-[6] text-[#002d4d]"
        >
          <Logo size="lg" />
        </motion.div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-12 mb-16">
          
          <div className="space-y-6">
            <h4 className="font-black text-[#002d4d] text-[11px] md:text-sm uppercase tracking-normal flex items-center gap-2">
               <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
               الخدمات الاستثمارية
            </h4>
            <ul className="space-y-3">
              <li>
                <button onClick={onContractLabClick} className="text-[10px] md:text-sm text-gray-400 hover:text-[#002d4d] font-bold transition-colors tracking-normal text-right outline-none">مختبر العقود</button>
              </li>
              <li>
                <button onClick={onSpotTradingClick} className="text-[10px] md:text-sm text-gray-400 hover:text-[#002d4d] font-bold transition-colors tracking-normal text-right outline-none">التداول الفوري</button>
              </li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="font-black text-[#002d4d] text-[11px] md:text-sm uppercase tracking-normal flex items-center gap-2">
               <div className="h-1.5 w-1.5 rounded-full bg-[#f9a885]" />
               المنصة
            </h4>
            <ul className="space-y-3">
              <li>
                <button onClick={onAboutClick} className="text-[10px] md:text-sm text-gray-400 hover:text-[#002d4d] font-bold transition-colors tracking-normal text-right outline-none">عن ناميكس</button>
              </li>
              <li>
                <button onClick={onFAQClick} className="text-[10px] md:text-sm text-gray-400 hover:text-[#002d4d] font-bold transition-colors tracking-normal text-right outline-none">المساعدة</button>
              </li>
              <li>
                <button onClick={onPrivacyClick} className="text-[10px] md:text-sm text-gray-400 hover:text-[#002d4d] font-bold transition-colors tracking-normal text-right outline-none">سياسة الخصوصية</button>
              </li>
              <li>
                <button onClick={onTermsClick} className="text-[10px] md:text-sm text-gray-400 hover:text-[#002d4d] font-bold transition-colors tracking-normal text-right outline-none">الشروط والأحكام</button>
              </li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="font-black text-[#002d4d] text-[11px] md:text-sm uppercase tracking-normal flex items-center gap-2">
               <div className="h-1.5 w-1.5 rounded-full bg-blue-600" />
               المجتمع
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
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="font-black text-[#002d4d] text-[11px] md:text-sm uppercase tracking-normal flex items-center gap-2">
               <Zap className="h-3 w-3 text-[#f9a885] fill-current" />
               الوصول السريع
            </h4>
            <ul className="space-y-3">
              <li>
                <button onClick={() => handleProtectedNavigation("/home")} className="flex items-center gap-2 text-[10px] md:text-sm text-gray-400 hover:text-[#002d4d] font-bold transition-colors tracking-normal group outline-none">
                   <UserPlus size={12} className="opacity-40 group-hover:opacity-100 transition-opacity" />
                   انضم للنخبة
                </button>
              </li>
              <li>
                <button onClick={() => handleProtectedNavigation("/home")} className="flex items-center gap-2 text-[10px] md:text-sm text-gray-400 hover:text-[#002d4d] font-bold transition-colors tracking-normal group outline-none">
                   <Wallet size={12} className="opacity-40 group-hover:opacity-100 transition-opacity" />
                   تعزيز الرصيد
                </button>
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-10 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-8">
          <Logo size="sm" />
          <div className="flex flex-col items-center md:items-end gap-2 opacity-30">
            <p className="text-[8px] md:text-[9px] font-black text-[#002d4d] uppercase tracking-normal">
              © 2024 Namix Universal Network. All rights reserved.
            </p>
            <p className="text-[7px] md:text-[8px] font-bold text-gray-400 tracking-normal uppercase">المنصة الموحدة للأصول الرقمية</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
