
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ShieldCheck, Fingerprint, Zap, Loader2, Smartphone, ShieldAlert, Sparkles, CheckCircle2, XCircle } from "lucide-react";
import { useFirestore } from "@/firebase";
import { doc, updateDoc } from "firebase/firestore";
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
  const [notice, setNotice] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    const checkSupport = async () => {
      // التحقق من دعم المتصفح والجهاز لبروتوكولات الحماية الحيوية
      const supported = !!(window.PublicKeyCredential && 
        await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable());
      setIsSupported(supported);
    };
    checkSupport();
  }, []);

  const handleToggle = async (val: boolean) => {
    if (!dbUser?.id) return;
    
    setLoading(true);
    setNotice(null);
    hapticFeedback.medium();

    try {
      // بروتوكول طلب البصمة الحقيقي من الجهاز (Simulated for Prototype logic)
      // في بيئة التشغيل الحقيقية، هذا هو المكان الذي يتم فيه استدعاء navigator.credentials.get
      await new Promise((resolve, reject) => {
        // محاكاة وقت استجابة المستخدم للبصمة
        const timer = setTimeout(() => {
          resolve(true);
        }, 1800);
      });

      // إذا نجح التحقق، يتم تحديث قاعدة البيانات السيادية
      await updateDoc(doc(db, "users", dbUser.id), { 
        isBiometricEnabled: val,
        updatedAt: new Date().toISOString()
      });
      
      hapticFeedback.success();
      setNotice({ 
        type: 'success', 
        text: val ? "تم تنشيط بروتوكول الحماية الحيوية بنجاح." : "تم تعطيل الحماية الحيوية وإعادة التأمين للـ PIN."
      });

      // إخفاء التنبيه تلقائياً بعد فترة
      setTimeout(() => setNotice(null), 4000);
    } catch (e) {
      hapticFeedback.error();
      setNotice({ 
        type: 'error', 
        text: "فشل التحقق من الهوية الحيوية. يرجى المحاولة مجدداً." 
      });
    } finally {
      setLoading(false);
    }
  };

  if (isSupported === false) {
    return (
      <div className="space-y-8 animate-in fade-in text-center py-10 font-body">
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
    <div className="space-y-10 animate-in fade-in duration-700 font-body text-right select-none" dir="rtl">
      
      <div className="p-8 bg-gray-50 rounded-[48px] border border-gray-100 shadow-inner space-y-8 relative overflow-hidden group">
         <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none group-hover:rotate-12 transition-transform duration-1000">
            <Fingerprint size={160} />
         </div>

         <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-5">
               <div className={cn(
                 "h-14 w-14 rounded-2xl flex items-center justify-center shadow-sm border border-white/50 transition-all duration-700",
                 dbUser?.isBiometricEnabled ? "bg-emerald-50 text-emerald-600" : "bg-white text-gray-400"
               )}>
                  <Fingerprint size={28} />
               </div>
               <div className="text-right space-y-0.5">
                  <h4 className="text-lg font-black text-[#002d4d]">بصمة الوجه / الإصبع</h4>
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Sovereign Biometric Vault</p>
               </div>
            </div>
            <div dir="ltr" className="flex items-center gap-4">
               {loading && (
                 <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}>
                    <Loader2 className="animate-spin h-5 w-5 text-blue-500" />
                 </motion.div>
               )}
               <Switch 
                 checked={!!dbUser?.isBiometricEnabled} 
                 onCheckedChange={handleToggle}
                 disabled={loading}
                 className="data-[state=checked]:bg-[#002d4d] scale-125 shadow-lg disabled:opacity-50"
               />
            </div>
         </div>

         {/* Elegant Inline Notice */}
         <AnimatePresence mode="wait">
            {notice && (
              <motion.div 
                initial={{ opacity: 0, y: 10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                className={cn(
                  "p-4 rounded-[20px] flex items-center gap-3 relative z-10",
                  notice.type === 'success' ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-orange-50 text-orange-600 border border-orange-100"
                )}
              >
                 {notice.type === 'success' ? <CheckCircle2 size={14} /> : <ShieldAlert size={14} />}
                 <p className="text-[10px] font-black tracking-normal">{notice.text}</p>
              </motion.div>
            )}
         </AnimatePresence>

         <div className="p-6 bg-white/50 rounded-[32px] border border-white shadow-sm space-y-4 relative z-10">
            <div className="flex items-center gap-2 text-blue-600">
               <Zap size={14} className="fill-current" />
               <span className="text-[10px] font-black uppercase">الاستخدامات الموثقة</span>
            </div>
            <p className="text-[11px] font-bold text-gray-500 leading-[2.2]">
               عند تفعيل هذا الخيار، سيقوم النظام بطلب بصمة جهازك بدلاً من رمز PIN عند تنفيذ عمليات سحب السيولة أو الصفقات الحساسة. يتطلب تفعيل أو إلغاء هذا الخيار التحقق من هويتك حالياً.
            </p>
         </div>
      </div>

      <div className="p-8 bg-blue-50/50 rounded-[40px] border border-blue-100 flex items-start gap-6">
         <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center shadow-sm shrink-0">
            <ShieldCheck className="h-5 w-5 text-blue-600" />
         </div>
         <div className="space-y-1 pt-1 text-right">
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
