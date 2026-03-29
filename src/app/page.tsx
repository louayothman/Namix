
"use client";

import React, { useEffect, useState } from "react";
import { useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import { SovereignHero } from "@/components/landing/SovereignHero";
import { Logo } from "@/components/layout/Logo";

/**
 * @fileOverview صفحة الهبوط - النسخة المبسطة v55.0
 * تم إزالة نظام الانترو والتحولات المعقدة بطلب من المستخدم بانتظار فكرة الانترو الجديد.
 */
export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  const db = useFirestore();
  
  const landingRef = useMemoFirebase(() => doc(db, "system_settings", "landing_page"), [db]);
  const { data: landingData, isLoading } = useDoc(landingRef);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="min-h-screen bg-black" />;

  return (
    <div className="relative min-h-screen bg-black overflow-x-hidden font-body selection:bg-[#f9a885]/30">
      {/* 1. Global Nebula Layer */}
      <div className="fixed inset-0 nebula-bg z-0 pointer-events-none" />

      {/* 2. Standard Header */}
      <header className="relative z-[100] px-6 py-6 md:px-10 md:py-8 flex items-center justify-between bg-gradient-to-b from-black to-transparent">
        <Logo size="sm" className="brightness-200" />
      </header>

      {/* 3. Main Hero Section */}
      <main className="relative z-10 pt-10">
        <SovereignHero 
          title={landingData?.welcomeTitle || "ناميكس: السيادة الرقمية للثروة"}
          description={landingData?.welcomeDescription || "نظام استثماري متطور يجمع بين الذكاء الاصطناعي وحماية الأصول المطلقة."}
          isLoading={isLoading}
        />
      </main>

      {/* Brand Footer Signature */}
      <div className="fixed bottom-6 right-8 opacity-5 z-[100] pointer-events-none hidden md:block">
         <p className="text-[8px] font-black uppercase tracking-[1em] text-white">Namix Universal Network</p>
      </div>
    </div>
  );
}
