"use client";

import React from "react";
import { MarketPulseNarrative } from "./MarketPulseNarrative";
import { MarketPulseIconReactor } from "./MarketPulseIconReactor";

/**
 * @fileOverview مُفاعل النبض السينمائي الموحد v11.0
 * تم تجريد المكون من الخلفية لأنها أصبحت تغطي كامل الصفحة من الملف الرئيسي.
 */
export function MarketPulse() {
  return (
    <section className="w-full py-24 md:py-40 relative overflow-hidden select-none font-body" dir="rtl">
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