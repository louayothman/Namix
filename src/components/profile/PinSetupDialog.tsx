
"use client";

import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { 
  Fingerprint, 
  Loader2, 
  Mail, 
  ShieldCheck,
  Zap
} from "lucide-react";
import { useFirestore } from "@/firebase";
import { doc, updateDoc, setDoc, getDoc, deleteDoc, addDoc, collection } from "firebase/firestore";
import { sendOTPEmail } from "@/app/actions/auth-actions";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface PinSetupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dbUser: any;
}

type Step = 'verify_current' | 'verify_otp' | 'new_pin' | 'success';

export function PinSetupDialog({ dbUser, onOpenChange }: PinSetupDialogProps) {
  const db = useFirestore();
  const [step, setStep] = useState<Step>('verify_current');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pin, setPin] = useState("");
  const [otp, setOtp] = useState("");
  
  const hasPin = !!dbUser?.securityPin;

  useEffect(() => {
    setStep(hasPin ? 'verify_current' : 'new_pin');
    setPin(""); setOtp(""); setError(null);
  }, [hasPin, open]);

  const handleVerifyCurrent = () => {
    if (pin !== dbUser?.securityPin) { 
      setError("الرمز غير صحيح."); 
      return; 
    }
    setStep('new_pin'); 
    setPin("");
    setError(null);
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
      setError(null);
    } catch (e) { 
      setError("فشل الإرسال."); 
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

      // إطلاق تنبيه في قاعدة البيانات (سيقوم NotificationManager بالتقاطه وعرضه كـ Push)
      await addDoc(collection(db, "notifications"), {
        userId: dbUser.id,
        title: "تحديث رمز الأمان 🔐",
        message: "لقد تم تحديث رمز PIN الخاص بخزنتك بنجاح. يرجى حفظ الرمز الجديد بعناية.",
        type: "success",
        url: "/settings",
        isRead: false,
        createdAt: new Date().toISOString()
      });

      setStep('success');
    } catch (e) { 
      setError("فشل التحديث."); 
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div className="space-y-10 text-right font-body animate-in fade-in duration-700" dir="rtl">
        <AnimatePresence mode="wait">
          {step === 'verify_current' && (
            <motion.div key="vc" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
              <div className="text-center space-y-4">
                 <div className="h-16 w-16 rounded-[24px] bg-gray-50 flex items-center justify-center mx-auto shadow-inner border border-gray-100 text-[#002d4d]">
                    <Fingerprint size={32} />
                 </div>
                 <Label className="text-[10px] font-black text-gray-400 block uppercase">أدخل رمز PIN الحالي</Label>
              </div>
              <input 
                type="password" 
                maxLength={6} 
                value={pin} 
                onChange={e => {setPin(e.target.value.replace(/\D/g, '')); setError(null);}} 
                className="h-20 w-full rounded-[32px] bg-gray-50 border-none font-black text-center text-5xl tabular-nums tracking-widest outline-none shadow-inner text-[#002d4d]" 
                placeholder="000000" 
              />
              <div className="space-y-4">
                 <button type="button" onClick={handleSendOTP} className="w-full text-center text-[10px] font-black text-orange-500">
                    نسيت الرمز؟ استرداد عبر الإيميل
                 </button>
                 {error && <p className="text-red-500 text-[10px] font-bold text-center">{error}</p>}
                 <Button onClick={handleVerifyCurrent} disabled={pin.length < 6} className="w-full h-16 rounded-full bg-[#002d4d] text-white font-black text-base shadow-xl">المتابعة</Button>
              </div>
            </motion.div>
          )}

          {step === 'new_pin' && (
            <motion.div key="np" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-10 text-center">
              <div className="p-8 bg-blue-50/50 rounded-[40px] border border-blue-100/50 space-y-4 text-right">
                 <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center mx-auto shadow-sm text-blue-600"><Zap size={24} /></div>
                 <div className="space-y-1">
                    <Label className="text-[11px] font-black text-[#002d4d] block uppercase text-center">تعيين الرمز الجديد (6 أرقام)</Label>
                    <p className="text-[9px] font-bold text-gray-400 text-center">سيتم طلب هذا الرمز لتأمين صفقاتك وسحوباتك.</p>
                 </div>
              </div>
              <input 
                type="password" 
                maxLength={6} 
                value={pin} 
                onChange={e => {setPin(e.target.value.replace(/\D/g, '')); setError(null);}} 
                className="h-20 w-full rounded-[32px] bg-gray-50 border-none font-black text-center text-5xl tabular-nums tracking-widest text-emerald-600 outline-none shadow-inner" 
                placeholder="000000" 
              />
              <div className="space-y-4">
                {error && <p className="text-red-500 text-[10px] font-bold text-center">{error}</p>}
                <Button onClick={handleSavePin} disabled={loading || pin.length < 6} className="w-full h-18 rounded-full bg-emerald-600 text-white font-black text-lg shadow-xl flex items-center justify-center gap-3">
                   {loading ? <Loader2 className="animate-spin" /> : <>تفعيل بصمة PIN <ShieldCheck size={20} /></>}
                </Button>
              </div>
            </motion.div>
          )}

          {step === 'verify_otp' && (
            <motion.div key="vo" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-10 text-center">
              <div className="p-6 bg-[#002d4d] rounded-[32px] text-white relative text-right">
                <div className="flex items-center gap-4">
                   <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20"><Mail className="h-5 w-5 text-[#f9a885]" /></div>
                   <p className="text-[11px] font-bold text-blue-100 leading-relaxed">أدخل الرمز المرسل لبريدك لتجاوز الرمز القديم.</p>
                </div>
              </div>
              <input 
                maxLength={6} 
                value={otp} 
                onChange={e => setOtp(e.target.value.replace(/\D/g, ''))} 
                className="h-20 w-full rounded-[32px] bg-gray-50 border-none text-center text-5xl font-black tracking-widest outline-none shadow-inner" 
                placeholder="000000"
              />
              {error && <p className="text-red-500 text-[10px] font-bold text-center">{error}</p>}
              <Button onClick={() => setStep('new_pin')} disabled={otp.length < 6} className="w-full h-16 rounded-full bg-[#002d4d] text-white font-black text-base shadow-xl">تحقق</Button>
            </motion.div>
          )}

          {step === 'success' && (
            <motion.div key="ok" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-10 py-10">
               <div className="h-24 w-24 bg-emerald-50 rounded-[48px] flex items-center justify-center mx-auto border border-emerald-100 relative">
                  <ShieldCheck className="h-12 w-12 text-emerald-500" />
                  <motion.div animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }} transition={{ duration: 2, repeat: Infinity }} className="absolute inset-0 bg-emerald-400/20 rounded-[48px] blur-2xl -z-10" />
               </div>
               <div className="space-y-3">
                  <h3 className="text-2xl font-black text-[#002d4d]">تم تأمين الخزنة</h3>
                  <p className="text-gray-400 font-bold text-xs px-6">بصمتك الرقمية (PIN) نشطة الآن وموثقة.</p>
               </div>
               <Button onClick={() => onOpenChange(false)} className="w-full h-16 rounded-full bg-[#002d4d] text-white font-black shadow-xl">العودة</Button>
            </motion.div>
          )}
        </AnimatePresence>
    </div>
  );
}
