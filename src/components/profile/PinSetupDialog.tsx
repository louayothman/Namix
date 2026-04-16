"use client";

import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { 
  Fingerprint, 
  Loader2, 
  Mail, 
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Zap,
  ChevronLeft
} from "lucide-react";
import { useFirestore } from "@/firebase";
import { doc, updateDoc, setDoc, getDoc, deleteDoc } from "firebase/firestore";
import { sendOTPEmail } from "@/app/actions/auth-actions";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface PinSetupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dbUser: any;
}

type Step = 'verify_current' | 'verify_otp' | 'new_pin' | 'success';

export function PinSetupDialog({ open, onOpenChange, dbUser }: PinSetupDialogProps) {
  const db = useFirestore();
  const [step, setStep] = useState<Step>('verify_current');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pin, setPin] = useState("");
  const [otp, setOtp] = useState("");
  
  const hasPin = !!dbUser?.securityPin;

  useEffect(() => {
    if (open) {
      setStep(hasPin ? 'verify_current' : 'new_pin');
      setPin(""); setOtp(""); setError(null);
    }
  }, [open, hasPin]);

  const handleVerifyCurrent = () => {
    if (pin !== dbUser?.securityPin) { 
      setError("رمز PIN الحالي غير صحيح."); 
      return; 
    }
    setStep('new_pin'); 
    setPin("");
  };

  const handleSendOTP = async () => {
    if (!dbUser?.email) return;
    setLoading(true);
    try {
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      await setDoc(doc(db, "otp_verifications", dbUser.email), { 
        code: otpCode, 
        expiresAt: new Date(Date.now() + 300000).toISOString() 
      });
      await sendOTPEmail(dbUser.email, otpCode);
      setStep('verify_otp');
    } catch (e) { 
      setError("فشل إرسال رمز التحقق."); 
    } finally { 
      setLoading(false); 
    }
  };

  const handleSavePin = async () => {
    if (pin.length !== 6) return;
    setLoading(true);
    try {
      await updateDoc(doc(db, "users", dbUser.id), { 
        securityPin: pin, 
        updatedAt: new Date().toISOString() 
      });
      setStep('success');
    } catch (e) { 
      setError("فشل تحديث البيانات."); 
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div className="space-y-10 text-right font-body animate-in fade-in duration-700" dir="rtl">
        <AnimatePresence mode="wait">
          {step === 'verify_current' && (
            <motion.div key="vc" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
              <div className="text-center space-y-4">
                 <div className="h-16 w-16 rounded-[24px] bg-gray-50 flex items-center justify-center mx-auto shadow-inner border border-gray-100 text-[#002d4d]">
                    <Fingerprint size={32} />
                 </div>
                 <Label className="text-[10px] font-black text-gray-400 block uppercase tracking-normal">أدخل رمز PIN الحالي للخزنة</Label>
              </div>
              <input 
                type="password" 
                maxLength={6} 
                value={pin} 
                onChange={e => {setPin(e.target.value.replace(/\D/g, '')); setError(null);}} 
                className="h-20 w-full rounded-[32px] bg-gray-50 border-none font-black text-center text-5xl tabular-nums tracking-[0.4em] outline-none shadow-inner text-[#002d4d]" 
                placeholder="000000" 
              />
              <div className="space-y-4">
                 <button type="button" onClick={handleSendOTP} className="w-full text-center text-[10px] font-black text-orange-500 uppercase tracking-normal">
                    نسيت الرمز؟ التحقق عبر الإيميل
                 </button>
                 {error && <p className="text-red-500 text-[10px] font-bold text-center animate-shake">{error}</p>}
                 <Button onClick={handleVerifyCurrent} disabled={pin.length < 6} className="w-full h-16 rounded-full bg-[#002d4d] text-white font-black text-base shadow-xl active:scale-95 transition-all">المتابعة</Button>
              </div>
            </motion.div>
          )}

          {step === 'new_pin' && (
            <motion.div key="np" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-10 text-center">
              <div className="p-8 bg-blue-50/50 rounded-[40px] border border-blue-100/50 space-y-4">
                 <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center mx-auto shadow-sm text-blue-600"><Zap size={24} /></div>
                 <div className="space-y-1">
                    <Label className="text-[11px] font-black text-[#002d4d] block uppercase tracking-normal">تعيين الرمز الجديد (6 أرقام)</Label>
                    <p className="text-[9px] font-bold text-gray-400 tracking-normal">سيتم طلب هذا الرمز لتأمين صفقات التداول والسحوبات.</p>
                 </div>
              </div>
              <input 
                type="password" 
                maxLength={6} 
                value={pin} 
                onChange={e => {setPin(e.target.value.replace(/\D/g, '')); setError(null);}} 
                className="h-20 w-full rounded-[32px] bg-gray-50 border-none font-black text-center text-5xl tabular-nums tracking-[0.4em] text-emerald-600 outline-none shadow-inner" 
                placeholder="000000" 
              />
              <div className="space-y-4">
                {error && <p className="text-red-500 text-[10px] font-bold text-center">{error}</p>}
                <Button onClick={handleSavePin} disabled={loading || pin.length < 6} className="w-full h-18 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-lg shadow-xl shadow-emerald-900/10 active:scale-95 transition-all flex items-center justify-center gap-3">
                   {loading ? <Loader2 className="animate-spin" /> : <>تفعيل بصمة PIN <ShieldCheck size={20} /></>}
                </Button>
              </div>
            </motion.div>
          )}

          {step === 'verify_otp' && (
            <motion.div key="vo" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-10 text-center">
              <div className="p-6 bg-[#002d4d] rounded-[32px] text-white relative overflow-hidden text-right">
                <div className="absolute top-0 right-0 p-4 opacity-5 -rotate-12"><Mail size={80} /></div>
                <div className="flex items-center gap-4 relative z-10">
                   <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20 shadow-inner"><Mail className="h-5 w-5 text-[#f9a885]" /></div>
                   <p className="text-[11px] font-bold text-blue-100 leading-relaxed tracking-normal">أدخل الرمز المكون من 6 أرقام المرسل لبريدك الإلكتروني لتجاوز الرمز القديم.</p>
                </div>
              </div>
              <input 
                maxLength={6} 
                value={otp} 
                onChange={e => setOtp(e.target.value.replace(/\D/g, ''))} 
                className="h-20 w-full rounded-[32px] bg-gray-50 border-none text-center text-5xl font-black tabular-nums tracking-[0.4em] outline-none shadow-inner" 
                placeholder="000000"
              />
              {error && <p className="text-red-500 text-[10px] font-bold text-center">{error}</p>}
              <Button onClick={() => setStep('new_pin')} disabled={otp.length < 6} className="w-full h-16 rounded-full bg-[#002d4d] text-white font-black text-base shadow-xl active:scale-95 transition-all">تحقق ومتابعة</Button>
            </motion.div>
          )}

          {step === 'success' && (
            <motion.div key="ok" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-10 py-10">
               <div className="relative inline-flex mb-4">
                  <div className="h-32 w-32 md:h-40 md:w-40 bg-emerald-50 rounded-[48px] flex items-center justify-center shadow-inner border border-emerald-100 relative">
                     <ShieldCheck className="h-16 w-16 md:h-20 md:w-20 text-emerald-500 drop-shadow-[0_0_15px_rgba(16,185,129,0.4)]" />
                     <motion.div animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }} transition={{ duration: 2, repeat: Infinity }} className="absolute inset-0 bg-emerald-400/20 rounded-[48px] blur-3xl -z-10" />
                  </div>
               </div>
               <div className="space-y-3 px-4">
                  <h3 className="text-3xl font-black text-[#002d4d] tracking-normal">تم تأمين الخزنة!</h3>
                  <p className="text-gray-400 font-bold text-xs max-w-xs mx-auto leading-loose tracking-normal">بصمتك الرقمية (PIN) نشطة الآن. تذكر الاحتفاظ بالرمز بسرية تامة لضمان أمان صفقاتك وسحوباتك.</p>
               </div>
               <Button onClick={() => onOpenChange(false)} className="w-full h-16 rounded-full bg-[#002d4d] text-white font-black shadow-xl active:scale-95 transition-all">العودة للإعدادات</Button>
            </motion.div>
          )}
        </AnimatePresence>
    </div>
  );
}
