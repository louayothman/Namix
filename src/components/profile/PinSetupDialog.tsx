"use client";

import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { 
  Fingerprint, 
  Loader2, 
  Mail, 
  CheckCircle2
} from "lucide-react";
import { useFirestore } from "@/firebase";
import { doc, updateDoc, setDoc, getDoc, deleteDoc } from "firebase/firestore";
import { sendOTPEmail } from "@/app/actions/auth-actions";
import { motion, AnimatePresence } from "framer-motion";

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
      setError("الرمز غير صحيح."); 
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
      setError("حدث خطأ."); 
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
      setError("فشل الحفظ."); 
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div className="space-y-6 text-right font-body" dir="rtl">
        <AnimatePresence mode="wait">
          {step === 'verify_current' && (
            <motion.div key="vc" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
              <Label className="text-xs font-bold text-gray-400 block text-center uppercase">أدخل رمز الحماية الحالي</Label>
              <input 
                type="password" 
                maxLength={6} 
                value={pin} 
                onChange={e => setPin(e.target.value.replace(/\D/g, ''))} 
                className="h-14 w-full rounded-2xl bg-gray-50 border-none font-bold text-center text-3xl outline-none" 
                placeholder="000000" 
              />
              <button type="button" onClick={handleSendOTP} className="w-full text-center text-xs font-bold text-orange-500 uppercase">نسيت الرمز؟ استرداد عبر الإيميل</button>
              {error && <p className="text-red-500 text-xs text-center">{error}</p>}
              <Button onClick={handleVerifyCurrent} disabled={pin.length < 6} className="w-full h-14 rounded-full bg-[#002d4d] text-white font-bold">متابعة</Button>
            </motion.div>
          )}

          {step === 'new_pin' && (
            <motion.div key="np" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 text-center">
              <Label className="text-xs font-bold text-gray-400 block uppercase">الرمز الجديد (6 أرقام)</Label>
              <input 
                type="password" 
                maxLength={6} 
                value={pin} 
                onChange={e => setPin(e.target.value.replace(/\D/g, ''))} 
                className="h-16 w-full rounded-[24px] bg-gray-50 border-none font-bold text-center text-3xl text-emerald-600 outline-none" 
                placeholder="000000" 
              />
              <Button onClick={handleSavePin} disabled={loading || pin.length < 6} className="w-full h-14 rounded-full bg-emerald-600 text-white font-bold shadow-xl">تفعيل الرمز</Button>
            </motion.div>
          )}

          {step === 'verify_otp' && (
            <motion.div key="vo" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 text-center">
              <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-center gap-3">
                <Mail className="h-5 w-5 text-blue-600" />
                <p className="text-xs font-bold text-blue-800">أدخل رمز التحقق المرسل لبريدك.</p>
              </div>
              <Input maxLength={6} value={otp} onChange={e => setOtp(e.target.value)} className="h-14 rounded-xl bg-gray-50 border-none text-center text-3xl font-bold" />
              {error && <p className="text-red-500 text-xs text-center">{error}</p>}
              <Button onClick={() => setStep('new_pin')} className="w-full h-14 rounded-full bg-[#002d4d] text-white font-bold">تحقق</Button>
            </motion.div>
          )}

          {step === 'success' && (
            <motion.div key="ok" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-6 py-4">
               <div className="h-20 w-20 bg-emerald-50 rounded-3xl flex items-center justify-center mx-auto shadow-inner"><CheckCircle2 className="h-10 w-10 text-emerald-500" /></div>
               <h3 className="text-2xl font-bold text-[#002d4d]">تم تأمين الخزنة!</h3>
               <Button onClick={() => onOpenChange(false)} className="w-full h-12 rounded-full bg-[#002d4d] text-white font-bold">إغلاق</Button>
            </motion.div>
          )}
        </AnimatePresence>
    </div>
  );
}