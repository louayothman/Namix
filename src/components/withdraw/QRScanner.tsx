
"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShieldCheck, Sparkles, Loader2, Zap } from "lucide-react";
import jsQR from "jsqr";
import { Button } from "@/components/ui/button";

interface QRScannerProps {
  onScan: (data: string) => void;
  onClose: () => void;
}

/**
 * @fileOverview مُفاعل مسح الباركود التكتيكي v1.0 - Full Screen Capture
 * يقوم بفتح الكاميرا وتحليل الإطارات لاستخراج المعرفات الرقمية.
 */
export function QRScanner({ onScan, onClose }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    let stream: MediaStream | null = null;
    let animationFrame: number;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" }
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setHasPermission(true);
          setIsProcessing(false);
          requestAnimationFrame(tick);
        }
      } catch (err) {
        console.error("Camera Access Denied:", err);
        setHasPermission(false);
        setIsProcessing(false);
      }
    };

    const tick = () => {
      if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
        const canvas = canvasRef.current;
        const video = videoRef.current;
        if (canvas) {
          const ctx = canvas.getContext("2d");
          if (ctx) {
            canvas.height = video.videoHeight;
            canvas.width = video.videoWidth;
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height, {
              inversionAttempts: "dontInvert",
            });

            if (code) {
              // منطق استخراج المعرف من الرابط أو النص الخام
              let finalId = code.data;
              try {
                const url = new URL(code.data);
                finalId = url.searchParams.get("id") || code.data;
              } catch (e) {}
              
              onScan(finalId);
              return; // توقف عن المسح بمجرد الالتقاط
            }
          }
        }
      }
      animationFrame = requestAnimationFrame(tick);
    };

    startCamera();

    return () => {
      if (stream) stream.getTracks().forEach(track => track.stop());
      cancelAnimationFrame(animationFrame);
    };
  }, [onScan]);

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[2000] bg-black flex flex-col font-body"
    >
      {/* Video Layer */}
      <video 
        ref={videoRef} 
        className="absolute inset-0 h-full w-full object-cover grayscale-[0.3]" 
        autoPlay 
        muted 
        playsInline 
      />
      
      {/* Canvas for processing (hidden) */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Interface Overlay */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-between p-10 pointer-events-none">
        
        {/* Top Header */}
        <div className="w-full flex items-center justify-between pointer-events-auto">
           <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                 <ShieldCheck className="h-5 w-5 text-[#f9a885]" />
              </div>
              <div className="text-right">
                 <p className="text-white font-black text-sm leading-none">مُفاعل المسح</p>
                 <p className="text-white/40 font-bold text-[7px] uppercase tracking-widest mt-1">Sovereign Scanning Node</p>
              </div>
           </div>
           <button onClick={onClose} className="h-10 w-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white active:scale-90 transition-all border border-white/20">
              <X size={20} />
           </button>
        </div>

        {/* Center Scanner Window */}
        <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
           {/* The Target Box */}
           <div className="absolute inset-0 border-2 border-white/20 rounded-[48px]" />
           
           {/* Animated Corners */}
           <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-[#f9a885] rounded-tr-[48px]" />
           <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-[#f9a885] rounded-tl-[48px]" />
           <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-[#f9a885] rounded-br-[48px]" />
           <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-[#f9a885] rounded-bl-[48px]" />

           {/* Laser Line */}
           <motion.div 
             animate={{ top: ["5%", "95%", "5%"] }}
             transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
             className="absolute left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-[#f9a885] to-transparent shadow-[0_0_15px_#f9a885] z-20"
           />
           
           {isProcessing && (
             <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-white opacity-20" />
                <span className="text-white/20 text-[8px] font-black uppercase tracking-widest">Calibrating...</span>
             </div>
           )}
        </div>

        {/* Footer Instructions */}
        <div className="w-full text-center space-y-6">
           <p className="text-white/60 font-bold text-xs px-6">ضع رمز QR داخل الإطار للالتقاط التلقائي.</p>
           
           <div className="flex items-center justify-center gap-4 py-4 opacity-40">
              <div className="h-[0.5px] w-8 bg-white" />
              <div className="flex items-center gap-2">
                 <Sparkles className="h-3 w-3 text-[#f9a885]" />
                 <span className="text-[8px] font-black text-white uppercase tracking-[0.4em]">Namix AI Vision</span>
              </div>
              <div className="h-[0.5px] w-8 bg-white" />
           </div>
        </div>

      </div>

      {/* Permission Denied UI */}
      {hasPermission === false && (
        <div className="absolute inset-0 z-[100] bg-[#002d4d] flex flex-col items-center justify-center p-12 text-center gap-8">
           <div className="h-24 w-24 rounded-[32px] bg-white/5 flex items-center justify-center border border-white/10">
              <Zap className="h-10 w-10 text-[#f9a885]" />
           </div>
           <div className="space-y-3">
              <h4 className="text-white text-xl font-black">تعذر الوصول للكاميرا</h4>
              <p className="text-blue-200/60 font-bold text-sm leading-loose">يرجى منح تطبيق ناميكس صلاحية الوصول للكاميرا من إعدادات المتصفح لمتابعة عملية المسح.</p>
           </div>
           <Button onClick={onClose} className="w-full h-14 rounded-full bg-white text-[#002d4d] font-black">إلغاء والمتابعة يدوياً</Button>
        </div>
      )}
    </motion.div>
  );
}
