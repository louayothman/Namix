
"use client";

import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { 
  Fingerprint, 
  Loader2, 
  ShieldCheck, 
  Zap, 
  Mail, 
  CheckCircle2, 
  Lock 
} from "lucide-react";
import { useFirestore } from "@/firebase";
import { doc, updateDoc, setDoc, getDoc, deleteDoc } from "firebase/firestore";
import { sendOTPEmail } from "@/app/actions/auth-actions";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

/**
 * @fileOverview مكون رمز PIN كـ View مدمج
 */

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
    if (pin !== dbUser?.securityPin) { setError("الرمز غير صحيح."); return; }
    setStep('new_pin'); setPin("");
  };

  const handleSendOTP = async () => {
    if (!dbUser?.email) return;
    setLoading(true);
    try {
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      await setDoc(doc(db, "otp_verifications", dbUser.email), { code: otpCode, expiresAt: new Date(Date.now() + 300000).toISOString() });
      await sendOTPEmail(dbUser.email, otpCode);
      setStep('verify_otp');
    } catch (e) { setError("خطأ."); } finally { setLoading(false); }
  };

  const handleSavePin = async () => {
    if (pin.length !== 6) return;
    setLoading(true);
    try {
      await updateDoc(doc(db, "users", dbUser.id), { securityPin: pin, updatedAt: new Date().toISOString() });
      setStep('success');
    } catch (e) { setError("فشل."); } finally { setLoading(false); }
  };

  return (
    <div className="space-y-6 text-right font-body" dir="rtl">
        <AnimatePresence mode="wait">
          {step === 'verify_current' && (
            <motion.div key="vc" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
              <Label className="text-[9px] font-black text-gray-400 block text-center uppercase">أدخل الرمز الحالي</Leading>
              <input type="password" maxLength={6} value={pin} onChange={e => setPin(e.target.value.replace(/\D/g, ''))} className="h-14 w-full rounded-2xl bg-gray-50 border-none font-black text-center text-3xl tracking-[0.4em] outline-none" placeholder="000000" />
              <button type="button" onClick={handleSendOTP} className="w-full text-center text-[9px] font-black text-[#f9a885] uppercase">نسيت الرمز؟ استرداد</button>
              <Button onClick={handleVerifyCurrent} disabled={pin.length < 6} className="w-full h-14 rounded-full bg-[#002d4d] text-white">متابعة</Button>
            </motion.div>
          )}

          {step === 'new_pin' && (
            <motion.div key="np" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 text-center">
              <Label className="text-[9px] font-black text-gray-400 block uppercase">الرمز الجديد (6 أرقام)</Label>
              <input type="password" maxLength={6} value={pin} onChange={e => setPin(e.target.value.replace(/\D/g, ''))} className="h-16 w-full rounded-[24px] bg-gray-50 border-none font-black text-center text-3xl tracking-[0.4em] text-emerald-600 outline-none" placeholder="000000" />
              <Button onClick={handleSavePin} disabled={loading || pin.length < 6} className="w-full h-14 rounded-full bg-emerald-600 text-white font-black shadow-xl">تفعيل</Button>
            </motion.div>
          )}

          {step === 'success' && (
            <motion.div key="ok" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-6 py-4">
               <div className="h-20 w-20 bg-emerald-50 rounded-[32px] flex items-center justify-center mx-auto"><CheckCircle2 className="h-10 w-10 text-emerald-500" /></div>
               <h3 className="text-xl font-black text-[#002d4d]">تم التأمين!</h3>
               <Button onClick={() => onOpenChange(false)} className="w-full h-12 rounded-full bg-[#002d4d] text-white">إغلاق</Button>
            </motion.div>
          )}
        </AnimatePresence>
    </div>
  );
}
