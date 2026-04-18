
"use client";

import React from "react";
import { MarketPulseBackground } from "./MarketPulseBackground";
import { MarketPulseNarrative } from "./MarketPulseNarrative";
import { MarketPulseIconReactor } from "./MarketPulseIconReactor";

/**
 * @fileOverview بوابة النبض السينمائي v5.0 - Sovereign Orchestrator
 * يجمع المكونات الثلاثة (الخلفية، النص، الأيقونات) في مشهد سينمائي واحد فائق الجودة.
 */

const STRATEGIC_TEXTS = [
  "محفظة رقمية آمنة تجمع أصولك في مكان واحد موثوق.",
  "تداول فوري مبني على السرعة والدقة في التنفيذ.",
  "عقود استثمارية مرنة تدعم قراراتك المالية الذكية.",
  "إيداع مباشر بتجربة سلسة وموثوقة على مدار الساعة.",
  "سحب فوري يعكس مفهوم السيولة دون تأخير.",
  "ميزات متقدمة صُممت لمستوى أعلى من الاحتراف المالي.",
  "هوية استثنائية تعكس شخصية كل مستخدم داخل المنصة."
];

const ASSET_GROUPS = [
  ["BTC", "ETH", "SOL", "BNB"],
  ["XRP", "ADA", "AVAX", "DOT"],
  ["LINK", "MATIC", "TRX", "LTC"],
  ["DOGE", "SHIB", "UNI", "BCH"],
  ["NEAR", "KAS", "ATOM", "ETC"]
];

export function MarketPulse() {
  return (
    <section className="w-full py-32 md:py-52 relative overflow-hidden select-none font-body bg-white" dir="rtl">
      {/* 1. مُكون الخلفية النانوية */}
      <MarketPulseBackground />
      
      <div className="container mx-auto px-8 md:px-16 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-24 lg:gap-40">
          
          {/* 2. مُكون السرد النصي (الجانب الأيمن) */}
          <div className="flex-1 order-2 lg:order-1">
             <MarketPulseNarrative texts={STRATEGIC_TEXTS} />
          </div>

          {/* 3. مُكون مفاعل الأيقونات (الجانب الأيسر) */}
          <div className="flex-1 flex items-center justify-center order-1 lg:order-2">
             <MarketPulseIconReactor iconGroups={ASSET_GROUPS} />
          </div>

        </div>
      </div>
    </section>
  );
}
