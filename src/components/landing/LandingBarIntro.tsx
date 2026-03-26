
"use client";

import React from "react";
import { Logo } from "@/components/layout/Logo";
import Link from "next/link";

/**
 * @fileOverview مكون مدخل شريط الملاحة - LandingBarIntro v1.0
 * مخصص لاحتواء الشعار وتنسيقه ككتلة مستقلة داخل الشريط العلوي.
 */
export function LandingBarIntro() {
  return (
    <div className="flex items-center group transition-all duration-500">
      <Link href="/">
        <Logo size="sm" className="scale-90 md:scale-110" />
      </Link>
    </div>
  );
}
