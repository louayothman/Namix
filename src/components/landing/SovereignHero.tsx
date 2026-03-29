
"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Sparkles, Loader2, ShieldCheck, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface SovereignHeroProps {
  title: string;
  description: string;
  isLoading: boolean;
}

/**
 * @fileOverview هيرو سيكشن السيادة v2.0 - Light Theme Edition
 * تم تحديث الألوان لتتناسب مع الخلفية البيضاء والسديم الكحلي.
 */
export function SovereignHero({ title, description, isLoading }: SovereignHeroProps) {
  const router = useRouter();

  return (
    <section className="container mx-auto px-6 py-20 flex flex-col items-center text-center space-y-12 min-h-screen">
      {/* Background Image Container */}
      <div className="absolute inset-0 z-[-1] overflow-hidden">
        <Image 
          src="/images/landing/hero-main-bg.webp" 
          alt="Namix Sovereign Background"
          fill
          priority
          className="object-cover opacity-10 scale-110"
          onError={(e) => {
            (e.target as any).style.display = 'none';
          }}
        />
      </div>

      <div className="max-w-4xl space-y-8">
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-3 text-[#002d4d]/40 font-black text-[10px] uppercase tracking-[0.5em]">
            <Sparkles className="h-3 w-3" />
            Wealth Engineering Infrastructure
          </div>
          
          {isLoading ? (
            <div className="h-20 flex items-center justify-center">
              <Loader2 className="h-10 w-10 animate-spin text-[#002d4d]" />
            </div>
          ) : (
            <h2 className="text-5xl md:text-8xl font-black text-[#002d4d] tracking-tighter leading-[1.1]">
              {title}
            </h2>
          )}
        </div>

        <p className="text-gray-500 text-base md:text-xl font-medium max-w-2xl mx-auto leading-loose">
          {description}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
          <Button 
            onClick={() => router.push("/login")}
            className="h-16 px-12 rounded-full bg-[#002d4d] text-white hover:bg-[#001d33] font-black text-sm shadow-2xl active:scale-95 transition-all group"
          >
            بدء التداول السيادي
            <ChevronLeft className="mr-2 h-5 w-5 group-hover:-translate-x-1 transition-transform" />
          </Button>
          
          <div className="flex items-center gap-8">
             <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span className="text-[10px] font-black text-[#002d4d]/40 uppercase tracking-widest">Secure Nodes</span>
             </div>
             <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-[#f9a885]" />
                <span className="text-[10px] font-black text-[#002d4d]/40 uppercase tracking-widest">Instant Liquidity</span>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}
