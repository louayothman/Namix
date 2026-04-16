"use client";

import React from "react";
import { QRCodeSVG } from "qrcode.react";
import { Logo } from "@/components/layout/Logo";

interface NamixIdQRProps {
  namixId: string;
  size?: number;
}

/**
 * @fileOverview محرك توليد الباركود السيادي v2.0 - Minimalist Sharp Edition
 * تم تطهير المكون من الحاويات، الظلال، الحواف الدائرية، والرسوم المتحركة ليكون على الصفحة مباشرة.
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
      
      {/* النواة المركزية - شعار ناميكس ثابت وصامت بطلب من المستخدم */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
         <Logo size="sm" hideText animate={false} />
      </div>
    </div>
  );
}
