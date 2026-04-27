
"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  Drawer, 
  DrawerContent, 
  DrawerPortal, 
  DrawerOverlay,
  DrawerTitle
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { 
  Download, 
  Share2, 
  ShieldCheck, 
  Check,
  X,
  Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import * as htmlToImage from 'html-to-image';
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { IdentityCardPreview } from "./IdentityCardPreview";
import { Logo } from "@/components/layout/Logo";

interface IdentityCardDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: any;
  calculatedTier: any;
}

export function IdentityCardDrawer({
  open,
  onOpenChange,
  user,
  calculatedTier
}: IdentityCardDrawerProps) {
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [isAssetsLoaded, setIsAssetsLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const captureRef = useRef<HTMLDivElement>(null);
  const hasCaptured = useRef(false);

  const invitationLink = typeof window !== "undefined" ? `${window.location.origin}/login?ref=${user?.referralCode}` : "";

  useEffect(() => {
    if (open) {
      setImgUrl(null);
      hasCaptured.current = false;
      setLoading(true);
      setIsAssetsLoaded(false);

      // تأمين الإظهار التلقائي في حال تأخرت الإشارة بعد ثانية واحدة
      const safetyTimer = setTimeout(() => {
        setIsAssetsLoaded(true);
      }, 1000);

      return () => clearTimeout(safetyTimer);
    }
  }, [open]);

  useEffect(() => {
    if (open && isAssetsLoaded && !hasCaptured.current) {
      const timer = setTimeout(() => {
        captureCard();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [open, isAssetsLoaded]);

  const captureCard = async () => {
    if (!captureRef.current) return;
    try {
      await document.fonts.ready;
      const dataUrl = await htmlToImage.toPng(captureRef.current, {
        cacheBust: true,
        backgroundColor: 'transparent',
        pixelRatio: 4, 
      });
      setImgUrl(dataUrl);
      hasCaptured.current = true;
    } catch (err) {
      console.error("Card Capture Failure:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!imgUrl) return;
    const link = document.createElement('a');
    link.download = `namix-card-${user?.namixId}.png`;
    link.href = imgUrl;
    link.click();
  };

  const handleShare = async () => {
    if (!imgUrl) return;
    try {
      const response = await fetch(imgUrl);
      const blob = await response.blob();
      const file = new File([blob], 'namix_card.png', { type: 'image/png' });
      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'بطاقة هويتي في ناميكس',
          text: `انضم إلي في شبكة ناميكس الاستثمارية المتميزة.`
        });
      } else {
        handleDownload();
      }
    } catch (err) {}
  };

  return (
    <>
      <div className="fixed left-[-9999px] top-[-9999px] pointer-events-none overflow-hidden">
        <div ref={captureRef}>
           <IdentityCardPreview 
             user={user} 
             calculatedTier={calculatedTier} 
             invitationLink={invitationLink} 
             onAssetsLoad={() => setIsAssetsLoaded(true)}
           />
        </div>
      </div>

      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerPortal>
          <DrawerOverlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1100]" />
          <DrawerContent className="fixed bottom-0 left-0 right-0 h-[75vh] bg-white rounded-t-[48px] border-none shadow-2xl z-[1101] flex flex-col outline-none overflow-hidden font-body" dir="rtl">
            <VisuallyHidden.Root><DrawerTitle>بطاقة الهوية الشخصية</DrawerTitle></VisuallyHidden.Root>

            <div className="px-8 pt-8 shrink-0 flex items-center justify-between">
               <div className="flex items-center gap-4 text-right">
                  <div className="h-10 w-10 rounded-xl bg-gray-50 flex items-center justify-center shadow-inner">
                     <ShieldCheck size={20} className="text-[#002d4d]" />
                  </div>
                  <div className="text-right">
                     <h3 className="text-lg font-black text-[#002d4d] leading-none">بطاقة الهوية</h3>
                     <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mt-1">Identity Display Node</p>
                  </div>
               </div>
               {/* تم حذف زر الإغلاق X للاعتماد على المقبض */}
            </div>

            <div className="flex-1 overflow-y-auto p-8 flex flex-col items-center justify-center gap-12 scrollbar-none">
               <AnimatePresence mode="wait">
                 {(!imgUrl || loading) ? (
                   <motion.div 
                     key="ghost-loader"
                     animate={{ 
                       opacity: [0.3, 0.8, 0.3],
                       color: ['#002d4d', '#8899AA', '#002d4d']
                     }}
                     transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                     className="flex items-center gap-5"
                   >
                      {/* الأيقونة على اليسار كما هو مطلوب */}
                      <div className="grid grid-cols-2 gap-1.5 scale-110">
                        <div className="h-1.5 w-1.5 rounded-full bg-current" />
                        <div className="h-1.5 w-1.5 rounded-full bg-current opacity-40" />
                        <div className="h-1.5 w-1.5 rounded-full bg-current opacity-40" />
                        <div className="h-1.5 w-1.5 rounded-full bg-current" />
                      </div>
                      {/* النص مستقيم وبخط عريض */}
                      <h4 className="text-3xl font-black tracking-tighter uppercase leading-none italic-none">
                        Namix Card
                      </h4>
                   </motion.div>
                 ) : (
                   <motion.div 
                     key="preview" 
                     initial={{ opacity: 0, scale: 0.9, y: 20 }} 
                     animate={{ opacity: 1, scale: 1, y: 0 }} 
                     className="relative w-full max-w-[450px]"
                   >
                      <div className="p-2 bg-white rounded-[32px] shadow-[0_40px_80px_-20px_rgba(0,45,77,0.15)] border border-gray-100 overflow-hidden">
                         <img src={imgUrl} className="w-full rounded-[24px]" alt="Identity Card" />
                      </div>
                      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-6 py-2 rounded-full text-[10px] font-black shadow-xl flex items-center gap-2 whitespace-nowrap">
                         <Check size={14} strokeWidth={3} /> جاهزة للمشاركة
                      </div>
                   </motion.div>
                 )}
               </AnimatePresence>

               <div className="w-full max-w-sm grid grid-cols-2 gap-4 pb-10">
                  <Button 
                    onClick={handleDownload} 
                    disabled={!imgUrl || loading} 
                    className="h-16 rounded-full bg-gray-50 text-[#002d4d] border border-gray-100 font-black text-sm active:scale-95 transition-all flex items-center justify-center gap-3 shadow-sm disabled:opacity-20"
                  >
                     <Download size={18} /> حفظ
                  </Button>
                  <Button 
                    onClick={handleShare} 
                    disabled={!imgUrl || loading} 
                    className="h-16 rounded-full bg-[#002d4d] hover:bg-[#001d33] text-white font-black text-sm shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-20"
                  >
                     <Share2 size={18} className="text-[#f9a885]" /> مشاركة
                  </Button>
               </div>
            </div>

            <div className="p-6 bg-gray-50 border-t border-gray-100 flex flex-col items-center gap-3 opacity-20 shrink-0">
               <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[#002d4d]">NAMIX SYSTEM</p>
            </div>
          </DrawerContent>
        </DrawerPortal>
      </Drawer>
    </>
  );
}
