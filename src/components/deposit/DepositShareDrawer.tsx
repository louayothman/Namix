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
  Loader2, 
  ShieldCheck, 
  Sparkles
} from "lucide-react";
import { CryptoIcon } from "@/lib/crypto-icons";
import { motion, AnimatePresence } from "framer-motion";
import * as htmlToImage from 'html-to-image';
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

interface DepositShareDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedAsset: any;
  selectedNetwork: any;
  walletAddress: string;
}

export function DepositShareDrawer({
  open,
  onOpenChange,
  selectedAsset,
  selectedNetwork,
  walletAddress
}: DepositShareDrawerProps) {
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [qrLoaded, setQrLoaded] = useState(false);
  const shareCardRef = useRef<HTMLDivElement>(null);

  const qrCodeUrl = walletAddress 
    ? `https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=${encodeURIComponent(walletAddress)}&bgcolor=ffffff&color=002d4d`
    : null;

  const generateImage = async () => {
    if (!shareCardRef.current || generating) return;
    setGenerating(true);
    try {
      // التأكد من تحميل كافة الخطوط قبل البدء في الالتقاط
      await document.fonts.ready;
      
      const dataUrl = await htmlToImage.toPng(shareCardRef.current, {
        cacheBust: true,
        backgroundColor: '#ffffff',
        pixelRatio: 3,
        fontEmbedCSS: '', 
        skipAutoScale: true
      });
      setImgUrl(dataUrl);
    } catch (err) {
      console.error("Capture Protocol Error:", err);
    } finally {
      setGenerating(false);
    }
  };

  // محرك الانتظار التكتيكي: يبدأ التوليد فقط بعد رصد تحميل الباركود
  useEffect(() => {
    if (open && qrLoaded && walletAddress) {
      const timer = setTimeout(generateImage, 1200);
      return () => clearTimeout(timer);
    }
  }, [open, qrLoaded, walletAddress]);

  // تصفير الحالة عند الإغلاق لضمان تحميل جديد ونظيف في المرة القادمة
  useEffect(() => {
    if (!open) {
      setQrLoaded(false);
      setImgUrl(null);
    }
  }, [open]);

  const handleDownload = () => {
    if (!imgUrl) return;
    setSaving(true);
    const link = document.createElement('a');
    link.download = `namix-${selectedAsset?.coin || 'deposit'}.png`;
    link.href = imgUrl;
    link.click();
    setTimeout(() => setSaving(false), 1000);
  };

  const handleNativeShare = async () => {
    if (!imgUrl || sharing) return;
    setSharing(true);
    try {
      const response = await fetch(imgUrl);
      const blob = await response.blob();
      const file = new File([blob], `deposit.png`, { type: 'image/png' });

      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'عنوان الإيداع',
          text: `عنوان إيداع ${selectedAsset?.coin}`
        });
      } else {
        handleDownload();
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') console.error("Share fail:", err);
    } finally {
      setSharing(false);
    }
  };

  return (
    <>
      {/* المعاملة الرقمية الاحترافية - مخفية تماماً عن المستخدم وتستخدم للتصدير فقط */}
      <div className="fixed left-[-9999px] top-[-9999px] pointer-events-none opacity-0">
        <div 
          ref={shareCardRef}
          className="w-[450px] bg-white p-12 flex flex-col items-center gap-10 min-h-[650px]"
          style={{ fontFamily: "'Tajawal', 'Cairo', sans-serif" }}
        >
          <style dangerouslySetInnerHTML={{ __html: `
            @font-face {
              font-family: 'Tajawal';
              src: url('/fonts/Tajawal.ttf') format('truetype');
              font-weight: 400;
            }
            @font-face {
              font-family: 'Cairo';
              src: url('/fonts/cairo.ttf') format('truetype');
              font-weight: 400;
            }
            * { font-weight: 400 !important; letter-spacing: normal !important; }
          `}} />

          {/* الهوية العليا المعتمدة */}
          <div className="w-full flex flex-row-reverse items-center justify-start gap-4" dir="rtl">
             <div className="shrink-0">
                <CryptoIcon name={selectedAsset?.icon || selectedAsset?.coin} size={42} />
             </div>
             <div className="text-right space-y-0.5">
                <h2 className="text-sm font-normal text-[#002d4d] leading-none" style={{ fontFamily: 'Tajawal' }}>
                  {selectedAsset?.name || selectedAsset?.coin}
                </h2>
                <p className="text-[8px] font-normal text-gray-400 uppercase tracking-widest leading-none" style={{ fontFamily: 'Cairo' }}>
                  {selectedNetwork?.name || selectedAsset?.network}
                </p>
             </div>
          </div>

          {/* الباركود المركزي الحاد */}
          <div className="flex items-center justify-center w-full py-2">
             {qrCodeUrl && (
               <div className="relative h-64 w-64">
                  <img 
                    src={qrCodeUrl} 
                    alt="QR" 
                    className="w-full h-full" 
                    style={{ imageRendering: 'pixelated' }} 
                    crossOrigin="anonymous" 
                    onLoad={() => setQrLoaded(true)}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                     <div className="bg-white p-0.5 shadow-sm">
                        <CryptoIcon name={selectedAsset?.icon || selectedAsset?.coin} size={28} />
                     </div>
                  </div>
               </div>
             )}
          </div>

          {/* بيانات الاستلام والشبكة */}
          <div className="w-full text-center px-4 space-y-2">
             <p className="text-[7px] font-normal text-gray-300 uppercase tracking-[0.4em] mb-1" style={{ fontFamily: 'Cairo' }}>DEPOSIT ADDRESS</p>
             <p className="text-[10px] font-normal text-[#002d4d] whitespace-nowrap overflow-hidden" dir="ltr" style={{ fontFamily: 'Cairo' }}>
               {walletAddress}
             </p>
             <p className="text-[9px] font-normal text-gray-400 pt-1" style={{ fontFamily: 'Tajawal' }}>
               الشبكة : {selectedAsset?.coin} - {selectedNetwork?.name || selectedAsset?.network}
             </p>
          </div>

          {/* الختم السفلي المطور (مصغر، أسفل، شعار يسار الاسم) */}
          <div className="w-full space-y-6 pt-10 mt-auto">
             <div className="h-[0.5px] w-full bg-gray-50" />
             <div className="flex items-center justify-center gap-5" dir="ltr">
                {/* شعار النقاط على اليسار */}
                <div className="grid grid-cols-2 gap-0.5 scale-[0.6] order-first opacity-40">
                   <div className="h-1.5 w-1.5 rounded-full bg-[#002d4d]" />
                   <div className="h-1.5 w-1.5 rounded-full bg-[#f9a885]" />
                   <div className="h-1.5 w-1.5 rounded-full bg-[#f9a885]" />
                   <div className="h-1.5 w-1.5 rounded-full bg-[#002d4d]" />
                </div>
                
                {/* حروف الاسم بتباعد منتظم وحجم مصغر */}
                <div className="flex items-center gap-2.5 opacity-30">
                   {['N', 'A', 'M', 'I', 'X'].map((letter, idx) => (
                     <span key={idx} className="text-[9px] font-normal text-[#002d4d]" style={{ fontFamily: 'Cairo' }}>
                       {letter}
                     </span>
                   ))}
                </div>
             </div>
          </div>
        </div>
      </div>

      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerPortal>
          <DrawerOverlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[1100]" />
          <DrawerContent className="fixed bottom-0 left-0 right-0 h-[65dvh] bg-white rounded-t-[48px] border-none shadow-2xl z-[1101] flex flex-col outline-none overflow-hidden" dir="rtl">
            <VisuallyHidden.Root>
              <DrawerTitle>مشاركة معاملة الإيداع</DrawerTitle>
            </VisuallyHidden.Root>

            <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center gap-8 scrollbar-none">
               <AnimatePresence mode="wait">
                 {generating || !imgUrl ? (
                   <motion.div 
                     key="loading"
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     exit={{ opacity: 0 }}
                     className="flex flex-col items-center gap-4"
                   >
                      <div className="relative">
                         <div className="h-16 w-16 border-[3px] border-gray-100 border-t-blue-500 rounded-full animate-spin" />
                         <div className="absolute inset-0 flex items-center justify-center">
                            <ShieldCheck className="h-6 w-6 text-blue-500" />
                         </div>
                      </div>
                   </motion.div>
                 ) : (
                   <motion.div 
                     key="preview"
                     initial={{ opacity: 0, scale: 0.95 }} 
                     animate={{ opacity: 1, scale: 1 }} 
                     className="relative"
                   >
                      <div className="p-2 bg-white rounded-[32px] shadow-2xl border border-gray-100 overflow-hidden">
                         <img 
                           src={imgUrl} 
                           className="w-full max-w-[180px] md:max-w-[200px] rounded-[24px]" 
                           alt="Receipt" 
                         />
                      </div>
                   </motion.div>
                 )}
               </AnimatePresence>

               <div className="w-full max-w-[320px] grid grid-cols-2 gap-3 pb-4">
                  <Button 
                    onClick={handleDownload} 
                    disabled={!imgUrl || generating || saving}
                    className="h-14 rounded-full bg-[#002d4d] hover:bg-[#001d33] text-white font-normal text-xs shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    {saving ? <Loader2 className="animate-spin h-4 w-4" /> : <Download size={16} className="text-[#f9a885]" />}
                    <span>حفظ</span>
                  </Button>
                  
                  <Button 
                    onClick={handleNativeShare} 
                    disabled={!imgUrl || generating || sharing}
                    className="h-14 rounded-full bg-gray-100 hover:bg-gray-200 text-[#002d4d] font-normal text-xs active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    {sharing ? <Loader2 className="animate-spin h-4 w-4" /> : <Share2 size={16} className="text-blue-500" />}
                    <span>مشاركة</span>
                  </Button>
               </div>
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-center gap-3 opacity-20 shrink-0">
               <ShieldCheck size={12} className="text-emerald-500" />
               <p className="text-[8px] font-normal uppercase tracking-widest text-[#002d4d]">Secure Asset Node</p>
            </div>
          </DrawerContent>
        </DrawerPortal>
      </Drawer>
    </>
  );
}
