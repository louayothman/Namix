
"use client";

import React from "react";

/**
 * @fileOverview مُفاعل الهوية المصفى v5.0 - الإصدار النقي
 * تصميم ساكن وفخم يعتمد على تداخل العناصر السديمية في الخلفية مع الاسم الكحلي الصريح.
 */

export function LandingBarIntro() {
  return (
    <div className="relative h-full flex items-center px-6 md:px-12 select-none pointer-events-none overflow-hidden">
      
      {/* 1. السديم الشبكي المقتطع (Background Nebula) - ضخم وشبه شفاف */}
      <div className="absolute top-0 right-0 -translate-y-4 translate-x-4 opacity-[0.08] blur-xl pointer-events-none">
        <div className="grid grid-cols-2 gap-3 scale-[2.5] md:scale-[3.5]">
          <div className="h-16 w-16 rounded-full bg-white" />
          <div className="h-16 w-16 rounded-full bg-[#f9a885]" />
          <div className="h-16 w-16 rounded-full bg-[#f9a885]" />
          <div className="h-16 w-16 rounded-full bg-white" />
        </div>
      </div>

      {/* 2. اسم المنصة (Pure Navy Text) */}
      <div className="relative z-10 flex items-center gap-4">
        {/* أيقونة مصغرة جداً بجانب النص لتعزيز الترابط البصري */}
        <div className="grid grid-cols-2 gap-1 opacity-20">
          <div className="h-1.5 w-1.5 rounded-full bg-[#002d4d]" />
          <div className="h-1.5 w-1.5 rounded-full bg-[#f9a885]" />
          <div className="h-1.5 w-1.5 rounded-full bg-[#f9a885]" />
          <div className="h-1.5 w-1.5 rounded-full bg-[#002d4d]" />
        </div>
        
        <h1 
          className="text-[#002d4d] font-black text-2xl md:text-4xl tracking-tighter leading-none"
          style={{ fontFamily: 'Tajawal, sans-serif' }}
        >
          NAMIX
        </h1>
      </div>

    </div>
  );
}
