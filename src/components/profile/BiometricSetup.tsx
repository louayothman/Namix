
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ShieldCheck, Fingerprint, Zap, Loader2, Smartphone, ShieldAlert, Sparkles } from "lucide-react";
import { useFirestore } from "@/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { toast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { hapticFeedback } from "@/lib/haptic-engine";
import { cn } from "@/lib/utils";

interface BiometricSetupProps {
  dbUser: any;
  onOpenChange: (open: boolean) => void;
}

export function BiometricSetup({ dbUser, onOpenChange }: BiometricSetupProps) {
  const db = useFirestore();
  const [loading, setLoading] = useState(false);
  const [isSupported, setIsSupported] = useState<boolean | null>(null);

  useEffect(() => {
    const checkSupport = async () => {
      const supported = !!(window.PublicKeyCredential && 
        await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable());
      setIsSupported(supported);
    };
    checkSupport();
  }, []);

  const handleToggle = async (val: boolean) => {
    if (!dbUser?.id) return;
    
    if (val) {
      // Start Enrollment Protocol
      setLoading(true);
      try {
        hapticFeedback.medium();
        // Simulate WebAuthn Registration (Simplified for prototype)
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        await updateDoc(doc(db, "users", dbUser.id), { 
          isBiometricEnabled: true,
          updatedAt: new Date().toISOString()
        });
        
        toast({ title: "تم تفعيل الأمان الحيوي", description: "يمكنك الآن استخدام بصمتك لتأكيد العمليات الحساسة." });
        hapticFeedback.success();
      } catch (e) {
        hapticFeedback.error();
        toast({ variant: "destructive", title: "فشل التفعيل", description: "تعذر التحقق من البصمة حالياً." });
      } finally {
        setLoading(false);
      }
    } else {
      // Disable Protocol
      setLoading(true);
      try {
        await updateDoc(doc(db, "users", dbUser.id), { 
          isBiometricEnabled: false,
          updatedAt: new Date().toISOString()
        });
        toast({ title: "تم تعطيل الأمان الحيوي", description: "ستحتاج لاستخدام رمز PIN لتأكيد العمليات." });
      } finally {
        setLoading(false);
      }
    }
  };

  if (isSupported === false) {
    return (
      <div className="space-y-8 animate-in fade-in text-center py-10">
        <div className="h-20 w-20 rounded-[32px] bg-red-50 flex items-center justify-center mx-auto border border-red-100">
           <ShieldAlert className="h-10 w-10 text-red-500" />
        </div>
        <div className="space-y-2">
           <h3 className="text-xl font-black text-[#002d4d]">غير مدعوم</h3>
           <p className="text-xs text-gray-400 font-bold leading-relaxed px-6">عذراً، متصفحك أو جهازك لا يدعم بروتوكولات الحماية الحيوية المتقدمة.</p>
        </div>
        <Button onClick={() => onOpenChange(false)} variant="outline" className="h-12 rounded-full px-10 font-black text-xs">العودة</Button>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-700 font-body text-right" dir="rtl">
      
      <div className="p-8 bg-gray-50 rounded-[48px] border border-gray-100 shadow-inner space-y-8 relative overflow-hidden group">
         <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none group-hover:rotate-12 transition-transform duration-1000">
            <Fingerprint size={160} />
         </div>

         <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-5">
               <div className={cn(
                 "h-14 w-14 rounded-2xl flex items-center justify-center shadow-sm border border-white/50 transition-all",
                 dbUser?.isBiometricEnabled ? "bg-emerald-50 text-emerald-600" : "bg-white text-gray-400"
               )}>
                  <Fingerprint size={28} />
               </div>
               <div className="text-right space-y-0.5">
                  <h4 className="text-lg font-black text-[#002d4d]">بصمة الوجه / الإصبع</h4>
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Sovereign Biometric Vault</p>
               </div>
            </div>
            <div dir="ltr">
               {loading ? (
                 <Loader2 className="animate-spin h-6 w-6 text-blue-500" />
               ) : (
                 <Switch 
                   checked={!!dbUser?.isBiometricEnabled} 
                   onCheckedChange={handleToggle}
                   className="data-[state=checked]:bg-[#002d4d] scale-125 shadow-lg"
                 />
               )}
            </div>
         </div>

         <div className="p-6 bg-white/50 rounded-[32px] border border-white shadow-sm space-y-4 relative z-10">
            <div className="flex items-center gap-2 text-blue-600">
               <Zap size={14} className="fill-current" />
               <span className="text-[10px] font-black uppercase">الاستخدامات الموثقة</span>
            </div>
            <p className="text-[11px] font-bold text-gray-500 leading-[2.2]">
               عند تفعيل هذا الخيار، سيقوم النظام بطلب بصمة جهازك بدلاً من رمز PIN عند تنفيذ عمليات سحب السيولة أو الصفقات الحساسة لضمان أقصى درجات الأمان والسرعة.
            </p>
         </div>
      </div>

      <div className="p-8 bg-blue-50/50 rounded-[40px] border border-blue-100 flex items-start gap-6">
         <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center shadow-sm shrink-0">
            <ShieldCheck className="h-5 w-5 text-blue-600" />
         </div>
         <div className="space-y-1 pt-1">
            <p className="text-xs font-black text-[#002d4d]">حماية سيادية مشفرة</p>
            <p className="text-[10px] font-bold text-blue-800/60 leading-relaxed">بصمتك الحيوية لا تُخزن في خوادمنا؛ يتم التحقق منها محلياً عبر بروتوكول تأمين الجهاز المعتمد.</p>
         </div>
      </div>

      <div className="pt-4 flex flex-col items-center gap-4 opacity-20">
         <div className="flex items-center gap-2">
            <Sparkles size={12} className="text-[#f9a885]" />
            <p className="text-[9px] font-black uppercase tracking-[0.5em]">Identity Secured</p>
         </div>
      </div>
    </div>
  );
}
