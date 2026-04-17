
"use client";

import React from "react";
import { motion } from "framer-motion";
import { Gift, ChevronLeft } from "lucide-react";
import Link from "next/link";

interface ActivationActionHubProps {
  isLoggedIn: boolean;
}

export function ActivationActionHub({ isLoggedIn }: ActivationActionHubProps) {
  return (
    <div className="space-y-10 w-full flex flex-col items-center">
      {/* Reward Node - Pure & Clean */}
      <div className="flex items-center gap-3">
        <Gift className="h-6 w-6 md:h-8 md:w-8 text-[#f9a885]" />
        <p className="text-base md:text-xl lg:text-2xl font-black text-[#002d4d] tracking-normal">
          مكافأة تصل الى <span className="text-[#f9a885] font-black">100$</span> عند التسجيل
        </p>
      </div>

      <Link href={isLoggedIn ? "/home" : "/login"} className="w-full max-w-[320px] md:max-w-[400px]">
        <motion.button 
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          className="h-16 md:h-20 w-full rounded-[32px] md:rounded-[48px] bg-[#f9a885] text-[#002d4d] font-black text-lg md:text-xl shadow-2xl transition-all flex items-center justify-center relative overflow-hidden group outline-none"
        >
          {/* PHANTOM ARROW - Anchored to the FAR LEFT */}
          <motion.div 
            animate={{ x: [-10, 10, -10] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-6 inset-y-0 flex items-center justify-start opacity-[0.1] pointer-events-none"
          >
            <ChevronLeft size={60} strokeWidth={4} className="md:size-[70px]" />
          </motion.div>
          
          <span className="relative z-10">
            {isLoggedIn ? "متابعة الاستخدام" : "سجل الآن مجاناً"}
          </span>
        </motion.button>
      </Link>
    </div>
  );
}
