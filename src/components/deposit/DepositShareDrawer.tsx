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
  Sparkles,
  X
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

/**
 * @fileOverview مفاعل تصدير المعاملات v15.0 - Final Precision Edition
 * نظام ذكي يضمن تحميل الباركود قبل الالتقاط مع إعادة هندسة الختم السفلي وبيانات الشبكة.
 */
export function DepositShareDrawer({
  open,
  onOpenChange,
  selectedAsset,
  selectedNetwork,
  walletAddress
}: DepositShareDrawerProps) {
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [qrLoaded, setQrLoaded] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [sharing, setSharing] = useState(false);
  const shareCardRef = useRef<HTMLDivElement>(null);

  const qrCodeUrl = walletAddress 
    ? `https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=${encodeURIComponent(walletAddress)}&bgcolor=ffffff&color=002d4d`
    : null;

  // إعادة ضبط الحالة عند فتح/إغلاق النافذة لضمان دورة حياة نظيفة
  useEffect(() => {
    if (!open) {
      setImgUrl(null);
      setQrLoaded(false);
      setGenerating(false);
    }
  }, [open]);

  const generateImage = async () => {
    if (!shareCardRef.current || generating || imgUrl) return;
    
    setGenerating(true);
    try {
      // انتظار تأكيدي إضافي لضمان ثبات الخطوط والباركود في DOM
      await new Promise(r => setTimeout(r, 800));
      await document.fonts.ready;
      
      const dataUrl = await htmlToImage.toPng(shareCardRef.current, {
        cacheBust: true,
        backgroundColor: '#ffffff',
        pixelRatio: 3,
        quality: 1
      });
      setImgUrl(dataUrl);
    } catch (err) {
      console.error("Capture Protocol Failure:", err);
    } finally {
      setGenerating(false);
    }
  };

  // محرك التوليد الآلي: يبدأ فقط بعد رصد تحميل الباركود بنجاح
  useEffect(() => {
    if (open && qrLoaded && !imgUrl && !generating) {
      generateImage();
    }
  }, [open, qrLoaded, imgUrl, generating]);

  const handleDownload = () => {
    if (!imgUrl) return;
    setSaving(true);
    const link = document.createElement('a');
    link.download = `namix-deposit-${selectedAsset?.coin || 'asset'}.png`;
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
          title: 'عنوان الإيداع المعتمد',
          text: `عنوان إيداع ${selectedAsset?.coin} عبر منصة ناميكس`
        });
      } else {
        handleDownload();
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') console.error("Share Execution Error:", err);
    } finally {
      setSharing(false);
    }
  };

  return (
    <>
      {/* القالب المخفي للتوليد - يتم استخدامه كمصدر للبيانات فقط */}
      <div className="fixed left-[-9999px] top-[-9999px] pointer-events-none opacity-0">
        <div 
          ref={shareCardRef}
          className="w-[450px] bg-white p-12 flex flex-col items-center gap-10 min-h-[680px]"
          style={{ fontFamily: "'Tajawal', 'Cairo', sans-serif" }}
        >
          {/* فرض الخطوط الموحدة داخل بيئة التقاط الصورة */}
          <style dangerouslySetInnerHTML={{ __html: `
            @font-face { font-family: 'Tajawal'; src: url('/fonts/Tajawal.ttf') format('truetype'); font-weight: 400; }
            @font-face { font-family: 'Cairo'; src: url('/fonts/cairo.ttf') format('truetype'); font-weight: 400; }
            * { font-weight: 400 !important; letter-spacing: normal !important; }
          `}} />

          {/* الهوية العليا - أقصى اليمين */}
          <div className="w-full flex flex-row-reverse items-center justify-start gap-4" dir="rtl">
             <div className="shrink-0">
                <CryptoIcon name={selectedAsset?.icon || selectedAsset?.coin} size={44} />
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
               <div className="relative h-64 w-64 bg-white p-1">
                  <img 
                    src={qrCodeUrl} 
                    alt="QR" 
                    className="w-full h-full" 
                    crossOrigin="anonymous" 
                    onLoad={() => setQrLoaded(true)}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                     <div className="bg-white p-1">
                        <CryptoIcon name={selectedAsset?.icon || selectedAsset?.coin} size={32} />
                     </div>
                  </div>
               </div>
             )}
          </div>

          {/* بيانات العنوان والشبكة - سطر واحد ممتد */}
          <div className="w-full text-center px-4 space-y-3">
             <p className="text-[7px] font-normal text-gray-300 uppercase tracking-[0.4em]" style={{ fontFamily: 'Cairo' }}>DEPOSIT ADDRESS</p>
             <p className="text-[11px] font-normal text-[#002d4d] tracking-tight" dir="ltr" style={{ fontFamily: 'Cairo' }}>
               {walletAddress}
             </p>
             <div className="pt-1">
                <p className="text-[9px] font-normal text-gray-400" style={{ fontFamily: 'Tajawal' }}>
                  الشبكة : {selectedAsset?.coin} - {selectedNetwork?.name || selectedAsset?.network}
                </p>
             </div>
          </div>

          {/* الختم السفلي المصغر - شعار على اليسار */}
          <div className="w-full space-y-6 pt-12 mt-auto">
             <div className="h-[0.5px] w-full bg-gray-50" />
             <div className="flex items-center justify-center gap-4" dir="ltr">
                {/* حروف الاسم بتباعد منتظم */}
                <div className="flex items-center gap-2.5 opacity-25">
                   {['N', 'A', 'M', 'I', 'X'].map((letter, idx) => (
                     <span key={idx} className="text-[8px] font-normal text-[#002d4d]" style={{ fontFamily: 'Cairo' }}>
                       {letter}
                     </span>
                   ))}
                </div>
                
                {/* شعار النقاط على اليسار */}
                <div className="grid grid-cols-2 gap-0.5 scale-[0.5] opacity-30">
                   <div className="h-1.5 w-1.5 rounded-full bg-[#002d4d]" />
                   <div className="h-1.5 w-1.5 rounded-full bg-[#f9a885]" />
                   <div className="h-1.5 w-1.5 rounded-full bg-[#f9a885]" />
                   <div className="h-1.5 w-1.5 rounded-full bg-[#002d4d]" />
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
              <DrawerTitle>معاينة معاملة الإيداع</DrawerTitle>
            </VisuallyHidden.Root>

            <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center gap-8 scrollbar-none">
               <AnimatePresence mode="wait">
                 {!imgUrl || generating ? (
                   <motion.div 
                     key="loading"
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     exit={{ opacity: 0 }}
                     className="flex flex-col items-center gap-6"
                   >
                      <div className="relative">
                         {/* حلقة التحميل الدورانية (الطاقية) */}
                         <motion.div 
                           animate={{ rotate: 360 }}
                           transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                           className="h-20 w-20 border-[2.5px] border-gray-100 border-t-blue-500 rounded-full" 
                         />
                         <div className="absolute inset-0 flex items-center justify-center">
                            <ShieldCheck className="h-7 w-7 text-[#002d4d] opacity-20" />
                         </div>
                      </div>
                      <div className="text-center space-y-1">
                         <p className="text-[10px] font-normal text-gray-400 uppercase tracking-[0.3em]">Processing Secure Image</p>
                      </div>
                   </motion.div>
                 ) : (
                   <motion.div 
                     key="preview"
                     initial={{ opacity: 0, scale: 0.95 }} 
                     animate={{ opacity: 1, scale: 1 }} 
                     className="relative"
                   >
                      <div className="p-2 bg-white rounded-[36px] shadow-2xl border border-gray-100 overflow-hidden">
                         <img 
                           src={imgUrl} 
                           className="w-full max-w-[180px] md:max-w-[210px] rounded-[28px]" 
                           alt="Receipt Preview" 
                         />
                      </div>
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-4 py-1 rounded-full text-[8px] font-normal shadow-lg flex items-center gap-2 whitespace-nowrap"
                      >
                         <Sparkles size={10} />
                         جاهزة للمشاركة
                      </motion.div>
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
               <p className="text-[8px] font-normal uppercase tracking-widest text-[#002d4d]">Secure Asset Transmission</p>
            </div>
          </DrawerContent>
        </DrawerPortal>
      </Drawer>
    </>
  );
}