
"use client";

import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Lock, 
  Loader2, 
  ShieldCheck, 
  KeyRound, 
  Eye, 
  EyeOff, 
  Sparkles, 
  Mail, 
  Fingerprint, 
  CheckCircle2
} from "lucide-react";
import { useFirestore } from "@/firebase";
import { doc, updateDoc, setDoc, getDoc, deleteDoc } from "firebase/firestore";
import { sendOTPEmail } from "@/app/actions/auth-actions";
import { cn } from "@/lib/utils";

/**
 * @fileOverview مكون تغيير كلمة المرور كـ View مدمج
 */

interface ChangePasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  dbUser?: any;
}

type Step = 'verify_current' | 'verify_otp' | 'new_password' | 'success';

export function ChangePasswordDialog({ open, onOpenChange, userId, dbUser }: ChangePasswordDialogProps) {
  const db = useFirestore();
  const [step, setStep] = useState<Step>('verify_current');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [passData, setPassData] = useState({ current: "", otp: "", next: "", confirm: "" });
  const [showPass, setShowPass] = useState({ current: false, next: false, confirm: false });

  useEffect(() => {
    if (open) {
      setStep('verify_current');
      setPassData({ current: "", otp: "", next: "", confirm: "" });
      setError(null);
    }
  }, [open]);

  const calculateStrength = (pass: string) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length >= 6) score += 20;
    if (pass.length >= 10) score += 20;
    if (/[A-Z]/.test(pass)) score += 20;
    if (/[0-9]/.test(pass)) score += 20;
    if (/[^A-Za-z0-9]/.test(pass)) score += 20;
    return score;
  };

  const strength = calculateStrength(passData.next);
  const strengthMeta = strength <= 40 ? { color: "bg-red-500", label: "ضعيفة", text: "text-red-500" } :
                       strength <= 80 ? { color: "bg-orange-500", label: "متوسطة", text: "text-orange-500" } :
                       { color: "bg-emerald-500", label: "قوية جداً", text: "text-emerald-500" };

  const handleVerifyCurrent = () => {
    if (passData.current !== dbUser?.password) { setError("كلمة المرور الحالية غير صحيحة."); return; }
    setStep('new_password');
  };

  const handleSendOTP = async () => {
    if (!dbUser?.email) return;
    setLoading(true);
    try {
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      await setDoc(doc(db, "otp_verifications", dbUser.email), { code: otpCode, expiresAt: new Date(Date.now() + 300000).toISOString() });
      await sendOTPEmail(dbUser.email, otpCode);
      setStep('verify_otp');
    } catch (e) { setError("خطأ في البروتوكول."); } finally { setLoading(false); }
  };

  const handleVerifyOTP = async () => {
    setLoading(true);
    try {
      const otpRef = doc(db, "otp_verifications", dbUser.email);
      const snap = await getDoc(otpRef);
      if (!snap.exists() || snap.data().code !== passData.otp) { setError("رمز غير صحيح."); return; }
      await deleteDoc(otpRef);
      setStep('new_password');
    } catch (e) { setError("فشل التحقق."); } finally { setLoading(false); }
  };

  const handleFinalize = async () => {
    if (passData.next.length < 6 || passData.next !== passData.confirm) { setError("تحقق من البيانات."); return; }
    setLoading(true);
    try {
      await updateDoc(doc(db, "users", userId), { password: passData.next, updatedAt: new Date().toISOString() });
      setStep('success');
    } catch (e) { setError("فشل التحديث."); } finally { setLoading(false); }
  };

  return (
    <div className="space-y-6 text-right font-body" dir="rtl">
        <AnimatePresence mode="wait">
          {step === 'verify_current' && (
            <motion.div key="vc" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-5">
              <div className="space-y-2">
                <Label className="text-[9px] font-black text-gray-400 pr-3 uppercase">كلمة المرور الحالية</Label>
                <div className="relative">
                  <Input type={showPass.current ? "text" : "password"} value={passData.current} onChange={e => {setPassData({...passData, current: e.target.value}); setError(null);}} className="h-12 rounded-xl bg-gray-50 border-none font-black px-10 text-center text-base shadow-inner" />
                  <button type="button" onClick={() => setShowPass({...showPass, current: !showPass.current})} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300">
                    {showPass.current ? <EyeOff size={14}/> : <Eye size={14}/>}
                  </button>
                  <Lock className="absolute right-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-300" />
                </div>
                <button type="button" onClick={handleSendOTP} className="text-[9px] font-black text-[#f9a885] mt-2 block w-full text-center uppercase tracking-widest">هل نسيت الكلمة؟ استرداد</button>
              </div>
              {error && <p className="text-red-500 text-[9px] font-bold text-center">{error}</p>}
              <Button onClick={handleVerifyCurrent} className="w-full h-14 rounded-full bg-[#002d4d] text-white font-black text-sm shadow-xl">متابعة</Button>
            </motion.div>
          )}

          {step === 'verify_otp' && (
            <motion.div key="vo" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 text-center">
              <div className="p-4 bg-blue-50 rounded-[24px] border border-blue-100 flex items-start gap-3"><Mail className="h-4 w-4 text-blue-600" /><p className="text-[10px] font-bold text-blue-800">أدخل الرمز المرسل لبريدك.</p></div>
              <Input maxLength={6} value={passData.otp} onChange={e => setPassData({...passData, otp: e.target.value})} className="h-14 rounded-xl bg-gray-50 border-none font-black text-center text-3xl tracking-[0.4em]" />
              <Button onClick={handleVerifyOTP} className="w-full h-14 rounded-full bg-[#002d4d] text-white font-black">تحقق</Button>
            </motion.div>
          )}

          {step === 'new_password' && (
            <motion.div key="np" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="space-y-1.5"><Label className="text-[9px] font-black text-gray-400">الجديدة</Label><Input type="password" value={passData.next} onChange={e => setPassData({...passData, next: e.target.value})} className="h-12 rounded-xl bg-gray-50 border-none" /></div>
              <div className="space-y-1.5"><Label className="text-[9px] font-black text-gray-400">تأكيد</Label><Input type="password" value={passData.confirm} onChange={e => setPassData({...passData, confirm: e.target.value})} className="h-12 rounded-xl bg-gray-50 border-none" /></div>
              <Button onClick={handleFinalize} className="w-full h-14 rounded-full bg-emerald-600 text-white font-black shadow-xl">تحديث</Button>
            </motion.div>
          )}

          {step === 'success' && (
            <motion.div key="ok" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-6 py-4">
               <div className="h-20 w-20 bg-emerald-50 rounded-[32px] flex items-center justify-center mx-auto"><CheckCircle2 className="h-10 w-10 text-emerald-500" /></div>
               <h3 className="text-xl font-black text-[#002d4d]">تم التحديث!</h3>
               <Button onClick={() => onOpenChange(false)} className="w-full h-12 rounded-full bg-[#002d4d] text-white">إغلاق</Button>
            </motion.div>
          )}
        </AnimatePresence>
    </div>
  );
}
