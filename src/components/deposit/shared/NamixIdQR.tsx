
"use client";

import React from "react";
import { QRCodeSVG } from "qrcode.react";
import { Logo } from "@/components/layout/Logo";

interface NamixIdQRProps {
  namixId: string;
  size?: number;
}

/**
 * @fileOverview محرك توليد الباركود السيادي v2.1 - Logo Container Edition
 * تم إضافة حاوية بيضاء مستديرة الزوايا للشعار في مركز الـ QR.
 */
export function NamixIdQR({ namixId, size = 256 }: NamixIdQRProps) {
  if (!namixId) return <div className="bg-gray-50/50 animate-pulse" style={{ width: size, height: size }} />;

  return (
    <div className="relative flex items-center justify-center">
      <QRCodeSVG 
        value={namixId} 
        size={size} 
        bgColor={"transparent"} 
        fgColor={"#002d4d"} 
        level={"H"} 
        includeMargin={false} 
      />
      
      {/* النواة المركزية - شعار ناميكس ثابت مع حاوية بيضاء مستديرة الزوايا */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
         <div className="bg-white p-1.5 rounded-xl shadow-sm border border-gray-50">
            <Logo size="sm" hideText animate={false} />
         </div>
      </div>
    </div>
  );
}
