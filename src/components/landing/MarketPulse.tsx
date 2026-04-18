"use client";

import React from "react";
import { MarketPulseBackground } from "./MarketPulseBackground";
import { MarketPulseNarrative } from "./MarketPulseNarrative";
import { MarketPulseIconReactor } from "./MarketPulseIconReactor";

/**
 * @fileOverview مُفاعل النبض السينمائي الموحد v10.0
 */
export function MarketPulse() {
  return (
    <section className="w-full py-24 md:py-40 relative overflow-hidden select-none font-body bg-white" dir="rtl">
      {/* 1. الخلفية النانوية المترابطة */}
      <MarketPulseBackground />
      
      <div className="container mx-auto px-8 md:px-20 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-32">
          
          {/* الجانب الأيمن: السرد العدادي */}
          <div className="flex-1 w-full order-2 lg:order-1">
             <MarketPulseNarrative />
          </div>

          {/* الجانب الأيسر: أوركسترا الأيقونات الرباعية */}
          <div className="flex-1 w-full flex items-center justify-center order-1 lg:order-2">
             <MarketPulseIconReactor />
          </div>

        </div>
      </div>
    </section>
  );
}
