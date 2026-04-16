
"use client";

import React from "react";
import { QRCodeSVG } from "qrcode.react";
import { motion } from "framer-motion";
import { Logo } from "@/components/layout/Logo";

interface NamixIdQRProps {
  namixId: string;
  size?: number;
}

/**
 * @fileOverview محرك توليد الباركود السيادي v1.0
 * يقوم بتوليد QR Code يحتوي على المعرف الرقمي مع دمج شعار ناميكس في المنتصف.
 */
export function NamixIdQR({ namixId, size = 256 }: NamixIdQRProps) {
  if (!namixId) return <div className="bg-gray-50 rounded-[44px] animate-pulse" style={{ width: size, height: size }} />;

  return (
    <div className="relative flex items-center justify-center group">
      {/* الحلقة الحركية المحيطة */}
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute inset-[-20px] border-[0.5px] border-dashed border-[#002d4d]/10 rounded-full"
      />
      
      <div className="p-3 bg-white rounded-[44px] shadow-2xl border border-gray-100 relative z-10 overflow-hidden">
        <QRCodeSVG 
          value={namixId} 
          size={size} 
          bgColor={"#ffffff"} 
          fgColor={"#002d4d"} 
          level={"H"} 
          includeMargin={false} 
        />
        
        {/* النواة المركزية - شعار ناميكس الصامت */}
        <div className="absolute inset-0 flex items-center justify-center">
           <div className="bg-white p-2 rounded-xl shadow-lg border border-gray-50">
              <Logo size="sm" hideText />
           </div>
        </div>
      </div>

      {/* نبضات البيانات الزاوية */}
      <motion.div 
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute -top-4 -right-4 h-3 w-3 bg-[#f9a885] rounded-full blur-[2px]"
      />
    </div>
  );
}
