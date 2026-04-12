
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
  Sparkles,
  Check,
  Loader2
} from "lucide-react";
import { CryptoIcon } from "@/lib/crypto-icons";
import { motion, AnimatePresence } from "framer-motion";
import * as htmlToImage from 'html-to-image';
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { QRCodeSVG } from "qrcode.react";

interface DepositShareDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedAsset: any;
  selectedNetwork: any;
  walletAddress: string;
}

/**
 * @fileOverview مفاعل تصدير المعاملات v19.0 - Sovereign Minimalist Edition
 * تم تصغير التوقيع في الأسفل، نقل الشعار لليسار، وفصل حروف الاسم لتباعد هندسي مثالي.
 */
export function DepositShareDrawer({
  open,
  onOpenChange,
  selectedAsset,
  selectedNetwork,
  walletAddress
}: DepositShareDrawerProps) {
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const captureRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setImgUrl(null);
      setIsProcessing(true);
      // تأخير بسيط لضمان رندر العناصر قبل الالتقاط
      const timer = setTimeout(() => {
        captureProtocol();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [open]);

  const captureProtocol = async () => {
    if (!captureRef.current) return;
    
    try {
      await document.fonts.ready;
      
      const dataUrl = await htmlToImage.toPng(captureRef.current, {
        cacheBust: true,
        backgroundColor: '#ffffff',
        pixelRatio: 3, 
      });

      setImgUrl(dataUrl);
    } catch (err) {
      console.error("Capture Failure:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!imgUrl) return;
    const link = document.createElement('a');
    link.download = `namix-deposit-${selectedAsset?.coin || 'transaction'}.png`;
    link.href = imgUrl;
    link.click();
  };

  const handleShare = async () => {
    if (!imgUrl) return;
    try {
      const response = await fetch(imgUrl);
      const blob = await response.blob();
      const file = new File([blob], 'deposit.png', { type: 'image/png' });
      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'معاملة إيداع معتمدة',
          text: `عنوان إيداع ${selectedAsset?.coin} عبر منصة ناميكس`
        });
      } else {
        handleDownload();
      }
    } catch (err) {}
  };

  return (
    <>
      {/* Hidden Master Template for Image Capture */}
      <div className="fixed left-[-9999px] top-[-9999px] pointer-events-none overflow-hidden">
        <div 
          ref={captureRef}
          className="w-[450px] bg-white p-12 flex flex-col items-center gap-10 min-h-[750px]"
          style={{ fontFamily: "'Cairo', 'Tajawal', sans-serif" }}
        >
          <div className="w-full flex items-center justify-between border-b border-gray-50 pb-8" dir="rtl">
             <div className="flex items-center gap-5">
                <CryptoIcon name={selectedAsset?.icon || selectedAsset?.coin} size={48} />
                <div className="text-right">
                   <h2 className="text-base font-normal text-[#002d4d] leading-none">{selectedAsset?.name || selectedAsset?.coin}</h2>
                   <p className="text-[9px] font-normal text-gray-400 uppercase tracking-widest mt-1.5">
                     {selectedNetwork?.name || selectedAsset?.network}
                   </p>
                </div>
             </div>
             <div className="grid grid-cols-2 gap-1 opacity-20">
                <div className="h-2 w-2 rounded-full bg-[#002d4d]" />
                <div className="h-2 w-2 rounded-full bg-[#f9a885]" />
                <div className="h-2 w-2 rounded-full bg-[#f9a885]" />
                <div className="h-2 w-2 rounded-full bg-[#002d4d]" />
             </div>
          </div>

          <div className="py-8 flex items-center justify-center">
             {walletAddress && (
               <div className="relative">
                  <QRCodeSVG 
                    value={walletAddress}
                    size={280}
                    bgColor={"#ffffff"}
                    fgColor={"#002d4d"}
                    level={"H"}
                    includeMargin={false}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                     <div className="bg-white p-1.5 rounded-sm">
                        <CryptoIcon name={selectedAsset?.icon || selectedAsset?.coin} size={32} />
                     </div>
                  </div>
               </div>
             )}
          </div>

          <div className="w-full text-center space-y-6" dir="rtl">
             <div className="space-y-3">
                <p className="text-[8px] font-normal text-gray-300 uppercase tracking-[0.4em]">عنوان الإيداع</p>
                <p className="text-[13px] font-normal text-[#002d4d] break-all leading-loose px-4" dir="ltr">
                  {walletAddress}
                </p>
             </div>
             
             <div className="inline-flex items-center gap-2 px-6 py-2 bg-gray-50 rounded-full border border-gray-100">
                <span className="text-[11px] font-normal text-[#002d4d]">
                  الشبكة : {selectedAsset?.coin || 'Asset'} - {selectedNetwork?.name || selectedAsset?.network}
                </span>
             </div>
          </div>

          {/* Sovereign Footer Signature */}
          <div className="mt-auto pt-10 w-full border-t border-gray-50 flex flex-col items-center gap-3 opacity-30" dir="ltr">
             <div className="flex items-center gap-4">
                <div className="grid grid-cols-2 gap-0.5 scale-[0.6] origin-center">
                   <div className="h-1.5 w-1.5 rounded-full bg-[#002d4d]" />
                   <div className="h-1.5 w-1.5 rounded-full bg-[#f9a885]" />
                   <div className="h-1.5 w-1.5 rounded-full bg-[#f9a885]" />
                   <div className="h-1.5 w-1.5 rounded-full bg-[#002d4d]" />
                </div>
                
                <div className="flex items-center gap-3 text-[#002d4d] font-normal text-[9px]">
                   <span>N</span>
                   <span>A</span>
                   <span>M</span>
                   <span>I</span>
                   <span>X</span>
                </div>
             </div>
             <p className="text-[5px] font-normal text-gray-400 uppercase tracking-widest">Authorized Identity Node</p>
          </div>
        </div>
      </div>

      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerPortal>
          <DrawerOverlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[1100]" />
          <DrawerContent className="fixed bottom-0 left-0 right-0 h-[60dvh] bg-white rounded-t-[48px] border-none shadow-2xl z-[1101] flex flex-col outline-none overflow-hidden font-body" dir="rtl">
            <VisuallyHidden.Root><DrawerTitle>معالجة المعاملة</DrawerTitle></VisuallyHidden.Root>

            <div className="flex-1 overflow-y-auto p-8 flex flex-col items-center justify-center gap-10 scrollbar-none">
               <AnimatePresence mode="wait">
                 {isProcessing ? (
                   <motion.div 
                     key="loading"
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     exit={{ opacity: 0 }}
                     className="flex flex-col items-center gap-6"
                   >
                      <div className="relative">
                         <motion.div 
                           animate={{ rotate: 360 }}
                           transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                           className="h-20 w-20 border-[3px] border-gray-100 border-t-blue-500 rounded-full" 
                         />
                         <div className="absolute inset-0 flex items-center justify-center">
                            <ShieldCheck className="h-8 w-8 text-[#002d4d] opacity-20" />
                         </div>
                      </div>
                   </motion.div>
                 ) : imgUrl && (
                   <motion.div 
                     key="preview"
                     initial={{ opacity: 0, scale: 0.95 }} 
                     animate={{ opacity: 1, scale: 1 }} 
                     className="relative"
                   >
                      <div className="p-2 bg-white rounded-[44px] shadow-2xl border border-gray-100 overflow-hidden">
                         <img 
                           src={imgUrl} 
                           className="w-full max-w-[200px] md:max-w-[240px] rounded-[36px]" 
                           alt="Transaction" 
                         />
                      </div>
                      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-5 py-1.5 rounded-full text-[9px] font-normal shadow-lg flex items-center gap-2 whitespace-nowrap">
                         <Check size={12} strokeWidth={3} />
                         جاهزة للمشاركة
                      </div>
                   </motion.div>
                 )}
               </AnimatePresence>

               <div className="w-full max-w-sm grid grid-cols-2 gap-4 pb-6">
                  <Button 
                    onClick={handleDownload} 
                    disabled={isProcessing || !imgUrl}
                    className="h-14 rounded-full bg-[#002d4d] hover:bg-[#001d33] text-white font-normal text-sm shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3"
                  >
                    <Download size={18} className="text-[#f9a885]" />
                    <span>حفظ</span>
                  </Button>
                  
                  <Button 
                    onClick={handleShare} 
                    disabled={isProcessing || !imgUrl}
                    className="h-14 rounded-full bg-gray-100 hover:bg-gray-200 text-[#002d4d] font-normal text-sm active:scale-95 transition-all flex items-center justify-center gap-3"
                  >
                    <Share2 size={18} className="text-blue-500" />
                    <span>مشاركة</span>
                  </Button>
               </div>
            </div>

            <div className="p-5 bg-gray-50 border-t border-gray-100 flex items-center justify-center gap-3 opacity-20 shrink-0">
               <ShieldCheck size={14} className="text-emerald-500" />
               <p className="text-[9px] font-normal uppercase tracking-widest text-[#002d4d]">Secure Asset Protocol</p>
            </div>
          </DrawerContent>
        </DrawerPortal>
      </Drawer>
    </>
  );
}
