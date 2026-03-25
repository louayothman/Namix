
"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { 
  Fingerprint, 
  Loader2, 
  ShieldCheck, 
  Zap, 
  Mail, 
  Sparkles, 
  ChevronLeft, 
  Lock, 
  CheckCircle2, 
  ShieldAlert 
} from "lucide-react";
import { useFirestore } from "@/firebase";
import { doc, updateDoc, setDoc, getDoc, deleteDoc } from "firebase/firestore";
import { sendOTPEmail } from "@/app/actions/auth-actions";
import { cn } from "@/lib/utils";

/**
 * @fileOverview بروتوكول رمز PIN الخزنة v4980.0 - المدمج
 * هندسة رشيقة تلغي التمرير وتسهل التفاعل المباشر على الهاتف.
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
      setPin("");
      setOtp("");
      setError(null);
    }
  }, [open, hasPin]);

  const handleVerifyCurrent = () => {
    if (pin !== dbUser?.securityPin) {
      setError("الرمز غير صحيح.");
      return;
    }
    setError(null);
    setPin("");
    setStep('new_pin');
  };

  const handleSendOTP = async () => {
    if (!dbUser?.email) {
      setError("بريد مفقود.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 5);

      await setDoc(doc(db, "otp_verifications", dbUser.email), {
        code: otpCode,
        expiresAt: expiresAt.toISOString(),
      });

      const res = await sendOTPEmail(dbUser.email, otpCode);
      if (res.success) {
        setStep('verify_otp');
      } else {
        setError("فشل الإرسال.");
      }
    } catch (e) {
      setError("خطأ في البروتوكول.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    setLoading(true);
    setError(null);
    try {
      const otpRef = doc(db, "otp_verifications", dbUser.email);
      const snap = await getDoc(otpRef);
      if (!snap.exists() || snap.data().code !== otp) {
        setError("الرمز غير صحيح.");
        return;
      }
      await deleteDoc(otpRef);
      setStep('new_pin');
      setPin("");
    } catch (e) {
      setError("فشل التحقق.");
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
      setError("فشل التحديث.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-[40px] md:rounded-[56px] border-none shadow-2xl p-0 w-[94vw] max-w-[360px] overflow-hidden text-right flex flex-col outline-none z-[1100]" dir="rtl">
        
        <div className="bg-[#002d4d] p-6 text-white relative shrink-0 text-center border-b border-white/5">
           <div className="absolute top-0 right-0 p-4 opacity-[0.04] -rotate-12 pointer-events-none"><Fingerprint className="h-32 w-32" /></div>
           <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-2xl border border-white/20 shadow-inner mx-auto mb-3">
              <Lock className="h-6 w-6 text-[#f9a885]" />
           </div>
           <DialogTitle className="text-lg font-black tracking-normal">رمز PIN الخزنة</DialogTitle>
           <p className="text-[7px] font-black text-blue-200/30 uppercase tracking-[0.3em] mt-1">Vault Security Node</p>
        </div>

        <div className="p-6 space-y-6 bg-white flex-1 overflow-y-auto scrollbar-none min-h-[280px]">
          
          {step === 'verify_current' && (
            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="space-y-4">
                <Label className="text-[9px] font-black text-gray-400 pr-3 uppercase tracking-widest text-center block">أدخل الرمز الحالي</Label>
                <div className="relative">
                  <input 
                    type="password" 
                    inputMode="numeric"
                    maxLength={6} 
                    value={pin}
                    onChange={e => { setPin(e.target.value.replace(/\D/g, '')); setError(null); }}
                    className="h-14 w-full rounded-2xl bg-gray-50 border-none font-black text-center text-3xl tracking-[0.4em] shadow-inner outline-none text-[#002d4d]"
                    placeholder="000000"
                  />
                </div>
                <div className="flex justify-center">
                   <button type="button" onClick={handleSendOTP} className="text-[9px] font-black text-[#f9a885] hover:text-[#002d4d] transition-all uppercase tracking-widest flex items-center gap-2">
                      <Sparkles className="h-2.5 w-2.5" />
                      <span>هل نسيت الرمز؟ استعادة</span>
                   </button>
                </div>
              </div>
              {error && <p className="text-red-500 text-[9px] font-bold text-center">{error}</p>}
              <Button onClick={handleVerifyCurrent} disabled={pin.length < 6} className="w-full h-14 rounded-full bg-[#002d4d] text-white font-black text-sm shadow-xl active:scale-95">
                المتابعة
              </Button>
            </div>
          )}

          {step === 'verify_otp' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-700 text-center">
              <div className="p-4 bg-blue-50 rounded-[24px] border border-blue-100 flex items-start gap-3 text-right">
                 <Mail className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                 <p className="text-[10px] font-bold text-blue-800/60 leading-relaxed">تم إرسال رمز الأمان لتأمين إعادة التعيين.</p>
              </div>
              <div className="space-y-2">
                <Label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">رمز التحقق (OTP)</Label>
                <div className="relative">
                  <input 
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={otp}
                    onChange={e => { setOtp(e.target.value.replace(/\D/g, '')); setError(null); }}
                    className="h-14 w-full rounded-xl bg-gray-50 border-none font-black text-center text-3xl tracking-[0.4em] shadow-inner outline-none text-[#002d4d]"
                    placeholder="000000"
                  />
                </div>
              </div>
              {error && <p className="text-red-500 text-[9px] font-bold text-center">{error}</p>}
              <Button onClick={handleVerifyOTP} disabled={loading || otp.length < 6} className="w-full h-14 rounded-full bg-[#002d4d] text-white font-black shadow-xl">
                {loading ? <Loader2 className="animate-spin h-4 w-4" /> : "تحقق من الهوية"}
              </Button>
            </div>
          )}

          {step === 'new_pin' && (
            <div className="space-y-6 animate-in zoom-in-95 duration-500 text-center">
              <div className="space-y-4">
                <Label className="text-[9px] font-black text-gray-400 pr-3 uppercase tracking-widest block text-center">أدخل الرمز الجديد (6 أرقام)</Label>
                <div className="relative">
                  <input 
                    type="password" 
                    inputMode="numeric"
                    maxLength={6} 
                    value={pin}
                    onChange={e => { setPin(e.target.value.replace(/\D/g, '')); setError(null); }}
                    className="h-16 w-full rounded-[24px] bg-gray-50 border-none font-black text-center text-3xl tracking-[0.4em] shadow-inner outline-none text-emerald-600"
                    placeholder="000000"
                  />
                </div>
                <p className="text-[9px] text-gray-400 font-bold px-4 leading-relaxed">اختر رمزاً يصعب تخمينه لحماية عملياتك المالية.</p>
              </div>
              {error && <p className="text-red-500 text-[9px] font-bold text-center">{error}</p>}
              <Button onClick={handleSavePin} disabled={loading || pin.length < 6} className="w-full h-14 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-xl active:scale-95 flex items-center justify-center gap-2">
                {loading ? <Loader2 className="animate-spin h-4 w-4" /> : (
                  <>
                    تفعيل رمز الحماية
                    <ShieldCheck className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          )}

          {step === 'success' && (
            <div className="space-y-6 animate-in zoom-in-95 duration-700 text-center py-4">
               <div className="h-20 w-20 bg-emerald-50 rounded-[32px] flex items-center justify-center mx-auto shadow-inner border border-emerald-100">
                  <CheckCircle2 className="h-10 w-10 text-emerald-500" />
               </div>
               <div className="space-y-1">
                  <h3 className="text-xl font-black text-[#002d4d]">اكتمل التأمين!</h3>
                  <p className="text-gray-500 font-bold text-[11px] px-4 leading-relaxed">
                    لقد تم تحديث رمز PIN الخزنة بنجاح. أنت الآن تتمتع بسيادة مالية كاملة.
                  </p>
               </div>
               <Button onClick={() => onOpenChange(false)} className="w-full h-12 rounded-full bg-[#002d4d] text-white font-black text-xs shadow-xl active:scale-95">
                  إغلاق
               </Button>
            </div>
          )}
        </div>

        <div className="p-4 bg-gray-50 border-t border-gray-100 text-center shrink-0">
           <p className="text-[7px] font-black uppercase tracking-widest text-gray-300">End-to-End Secure Update</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
