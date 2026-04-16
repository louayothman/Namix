
"use client";

import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Lock, 
  Loader2, 
  CheckCircle2,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck
} from "lucide-react";
import { useFirestore } from "@/firebase";
import { doc, updateDoc, setDoc, getDoc, deleteDoc } from "firebase/firestore";
import { sendOTPEmail } from "@/app/actions/auth-actions";
import { motion, AnimatePresence } from "framer-motion";

interface ChangePasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  dbUser?: any;
}

type Step = 'verify_current' | 'verify_otp' | 'new_password' | 'success';

export function ChangePasswordDialog({ userId, dbUser, onOpenChange }: ChangePasswordDialogProps) {
  const db = useFirestore();
  const [step, setStep] = useState<Step>('verify_current');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [passData, setPassData] = useState({ current: "", otp: "", next: "", confirm: "" });
  const [showPass, setShowPass] = useState({ current: false, next: false, confirm: false });

  const handleVerifyCurrent = () => {
    if (passData.current !== dbUser?.password) { 
      setError("كلمة المرور غير صحيحة."); 
      return; 
    }
    setStep('new_password');
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
      setError("خطأ في الاتصال."); 
    } finally { 
      setLoading(false); 
    }
  };

  const handleVerifyOTP = async () => {
    setLoading(true);
    try {
      const otpRef = doc(db, "otp_verifications", dbUser.email);
      const snap = await getDoc(otpRef);
      if (!snap.exists() || snap.data().code !== passData.otp) { 
        setError("الرمز غير صحيح."); 
        setLoading(false);
        return; 
      }
      await deleteDoc(otpRef);
      setStep('new_password');
      setError(null);
    } catch (e) { 
      setError("فشل التحقق."); 
    } finally { 
      setLoading(false); 
    }
  };

  const handleFinalize = async () => {
    if (passData.next.length < 6) {
      setError("يجب أن تكون 6 خانات على الأقل.");
      return;
    }
    if (passData.next !== passData.confirm) { 
      setError("الكلمات غير متطابقة."); 
      return; 
    }
    setLoading(true);
    try {
      await updateDoc(doc(db, "users", userId), { 
        password: passData.next, 
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
    <div className="space-y-8 text-right animate-in fade-in duration-700" dir="rtl">
        <AnimatePresence mode="wait">
          {step === 'verify_current' && (
            <motion.div key="vc" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black text-gray-400 pr-4 uppercase">كلمة المرور الحالية</Label>
                <div className="relative">
                  <Input 
                    type={showPass.current ? "text" : "password"} 
                    value={passData.current} 
                    onChange={e => {setPassData({...passData, current: e.target.value}); setError(null);}} 
                    className="h-14 rounded-2xl bg-gray-50 border-none px-12 text-center font-black shadow-inner" 
                    placeholder="••••••••"
                  />
                  <button type="button" onClick={() => setShowPass({...showPass, current: !showPass.current})} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300">
                    {showPass.current ? <EyeOff size={16}/> : <Eye size={16}/>}
                  </button>
                  <Lock className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300" />
                </div>
                <button type="button" onClick={handleSendOTP} className="text-[10px] font-black text-orange-500 mt-3 block w-full text-center">
                   نسيت كلمة المرور؟ استرداد عبر الإيميل
                </button>
              </div>
              {error && <p className="text-red-500 text-[10px] font-bold text-center">{error}</p>}
              <Button onClick={handleVerifyCurrent} className="w-full h-16 rounded-full bg-[#002d4d] text-white font-black text-base shadow-xl">متابعة</Button>
            </motion.div>
          )}

          {step === 'verify_otp' && (
            <motion.div key="vo" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8 text-center">
              <div className="p-6 bg-blue-50 rounded-[32px] border border-blue-100 flex items-start gap-4 text-right">
                <Mail className="h-6 w-6 text-blue-600 shrink-0" />
                <p className="text-[11px] font-bold text-blue-800 leading-relaxed">أدخل رمز التحقق المرسل لبريدك الإلكتروني لتأمين الطلب.</p>
              </div>
              <input 
                maxLength={6} 
                value={passData.otp} 
                onChange={e => setPassData({...passData, otp: e.target.value.replace(/\D/g, '')})} 
                className="h-20 w-full rounded-[32px] bg-gray-50 border-none text-center text-5xl font-black tabular-nums tracking-widest outline-none shadow-inner" 
                placeholder="000000"
              />
              {error && <p className="text-red-500 text-[10px] font-bold text-center">{error}</p>}
              <Button onClick={handleVerifyOTP} disabled={passData.otp.length < 6} className="w-full h-16 rounded-full bg-[#002d4d] text-white font-black text-base shadow-xl">تحقق</Button>
            </motion.div>
          )}

          {step === 'new_password' && (
            <motion.div key="np" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black text-gray-400 pr-4 uppercase">الكلمة الجديدة</Label>
                <div className="relative">
                  <Input 
                    type={showPass.next ? "text" : "password"} 
                    value={passData.next} 
                    onChange={e => {setPassData({...passData, next: e.target.value}); setError(null);}} 
                    className="h-14 rounded-2xl bg-gray-50 border-none px-12 font-black shadow-inner text-center" 
                    placeholder="••••••••"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black text-gray-400 pr-4 uppercase">تأكيد الكلمة</Label>
                <div className="relative">
                  <Input 
                    type={showPass.confirm ? "text" : "password"} 
                    value={passData.confirm} 
                    onChange={e => {setPassData({...passData, confirm: e.target.value}); setError(null);}} 
                    className="h-14 rounded-2xl bg-gray-50 border-none px-12 font-black shadow-inner text-center" 
                    placeholder="••••••••"
                  />
                </div>
              </div>
              {error && <p className="text-red-500 text-[10px] font-bold text-center">{error}</p>}
              <Button onClick={handleFinalize} className="w-full h-16 rounded-full bg-emerald-600 text-white font-black text-base shadow-xl">تحديث</Button>
            </motion.div>
          )}

          {step === 'success' && (
            <motion.div key="ok" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-8 py-8">
               <div className="h-24 w-24 bg-emerald-50 rounded-[40px] flex items-center justify-center mx-auto border border-emerald-100 relative">
                  <ShieldCheck className="h-12 w-12 text-emerald-500" />
                  <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0, 0.3] }} transition={{ duration: 2, repeat: Infinity }} className="absolute inset-0 bg-emerald-400/20 rounded-[40px] blur-2xl -z-10" />
               </div>
               <div className="space-y-2">
                  <h3 className="text-2xl font-black text-[#002d4d]">تم التحديث</h3>
                  <p className="text-gray-400 font-bold text-xs">كلمة المرور الجديدة فعالة الآن.</p>
               </div>
               <Button onClick={() => onOpenChange(false)} className="w-full h-16 rounded-full bg-[#002d4d] text-white font-black shadow-xl">إغلاق</Button>
            </motion.div>
          )}
        </AnimatePresence>
    </div>
  );
}
