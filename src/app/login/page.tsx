
"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Logo } from "@/components/layout/Logo";
import { useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  setDoc, 
  getDoc, 
  deleteDoc,
  updateDoc
} from "firebase/firestore";
import { EmailStep } from "@/components/auth/EmailStep";
import { OTPStep } from "@/components/auth/OTPStep";
import { PasswordStep } from "@/components/auth/PasswordStep";
import { SignupStep } from "@/components/auth/SignupStep";
import { LegalLinks } from "@/components/auth/LegalLinks";
import { 
  Loader2, 
} from "lucide-react";
import { sendOTPEmail } from "@/app/actions/auth-actions";
import { motion, AnimatePresence } from "framer-motion";

const SovereignBackground = () => (
  <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none bg-white">
    <motion.div 
      animate={{ scale: [1, 1.1, 1], opacity: [0.04, 0.08, 0.04] }}
      transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      className="absolute top-[-10%] right-[-5%] w-[70%] h-[70%] bg-blue-500/10 rounded-full blur-[120px]" 
    />
    <motion.div 
      animate={{ scale: [1.05, 1, 1.05], opacity: [0.02, 0.05, 0.02] }}
      transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      className="absolute bottom-[-10%] left-[-5%] w-[70%] h-[70%] bg-[#f9a885]/10 rounded-full blur-[120px]" 
    />
  </div>
);

type LoginStep = "email" | "otp" | "password" | "signup";

function LoginContent() {
  const [step, setStep] = useState<LoginStep>("email");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({ email: "", otp: "", password: "", confirmPassword: "", fullName: "", gender: "male", invitationCode: "" });
  const [existingUser, setExistingUser] = useState<any>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const db = useFirestore();

  const legalDocRef = useMemoFirebase(() => doc(db, "system_settings", "legal"), [db]);
  const { data: legal } = useDoc(legalDocRef);

  useEffect(() => {
    const refFromUrl = searchParams.get("ref");
    if (refFromUrl) setFormData(prev => ({ ...prev, invitationCode: refFromUrl }));
  }, [searchParams]);

  useEffect(() => {
    const userSession = localStorage.getItem("namix_user");
    if (userSession) {
      const parsed = JSON.parse(userSession);
      if (parsed.role === 'admin') router.replace("/admin");
      else router.replace("/home");
    }
  }, [router]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!formData.email || !formData.email.includes("@")) { setError("يرجى إدخال بريد إلكتروني صحيح."); return; }
    setLoading(true);
    try {
      const querySnapshot = await getDocs(query(collection(db, "users"), where("email", "==", formData.email)));
      if (!querySnapshot.empty) {
        setExistingUser({ ...querySnapshot.docs[0].data(), id: querySnapshot.docs[0].id });
        setStep("password");
        setLoading(false);
        return;
      }
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(); expiresAt.setMinutes(expiresAt.getMinutes() + 5);
      await setDoc(doc(db, "otp_verifications", formData.email), { code: otpCode, expiresAt: expiresAt.toISOString() });
      const res = await sendOTPEmail(formData.email, otpCode);
      if (res.success) setStep("otp"); else setError("فشل في إرسال البريد الإلكتروني.");
    } catch (e) { setError("خطأ في الاتصال."); } finally { setLoading(false); }
  };

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); setLoading(true);
    try {
      const snap = await getDoc(doc(db, "otp_verifications", formData.email));
      if (!snap.exists() || snap.data().code !== formData.otp) { setError("رمز التحقق غير صحيح."); setLoading(false); return; }
      await deleteDoc(doc(db, "otp_verifications", formData.email));
      setStep("signup");
    } catch (e) { setError("فشل التحقق."); } finally { setLoading(false); }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (formData.password !== formData.confirmPassword) { setError("كلمات المرور غير متطابقة."); return; }
    if (formData.password.length < 6) { setError("كلمة المرور قصيرة جداً."); return; }
    setLoading(true);
    try {
      const onboardSnap = await getDoc(doc(db, "system_settings", "onboarding"));
      const trialAmount = onboardSnap.exists() ? (onboardSnap.data().trialCreditAmount || 0) : 0;
      
      const userId = Math.floor(1000000 + Math.random() * 9000000).toString();
      const namixId = Math.floor(1000000000 + Math.random() * 9000000000).toString();

      const newUser = { 
        id: userId, 
        namixId: namixId,
        email: formData.email, 
        displayName: formData.fullName, 
        role: "user", 
        password: formData.password, 
        totalBalance: trialAmount, 
        welcomeBonus: trialAmount, // بصمة المكافأة الترحيبية للقفل البرمجي
        createdAt: new Date().toISOString() 
      };
      
      await setDoc(doc(db, "users", userId), newUser);
      
      localStorage.setItem("namix_user", JSON.stringify(newUser));
      window.location.href = "/home";
    } catch (e) { setError("فشل إنشاء الحساب."); } finally { setLoading(false); }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== existingUser.password) { setError("كلمة المرور خاطئة."); return; }
    
    setLoading(true);
    try {
      await updateDoc(doc(db, "users", existingUser.id), { lastActive: new Date().toISOString() });
      
      localStorage.setItem("namix_user", JSON.stringify(existingUser));
      window.location.href = existingUser.role === 'admin' ? "/admin" : "/home";
    } catch (e) {
      setError("حدث خطأ أثناء الدخول.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex bg-white overflow-hidden font-body" dir="rtl">
      <SovereignBackground />
      <div className="relative flex-1 flex flex-col items-center justify-start py-20 px-8 z-10 overflow-y-auto scrollbar-none">
        <div className="w-full max-w-[340px] flex flex-col gap-y-24 animate-in fade-in slide-in-from-bottom-10 duration-1000">
          <div className="flex flex-col items-center gap-10 text-center relative">
            <Logo size="md" className="scale-[1.25]" />
            <div className="space-y-2.5">
               <h2 className="text-2xl font-black text-[#002d4d]">مرحباً مجدداً</h2>
               <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] opacity-60">Welcome Back</p>
            </div>
          </div>
          <div className="w-full space-y-12">
            <AnimatePresence mode="wait">
              {step === "email" && <EmailStep key="e" email={formData.email} onChange={v => setFormData({ ...formData, email: v })} onSubmit={handleEmailSubmit} loading={loading} error={error} />}
              {step === "otp" && <OTPStep key="o" otp={formData.otp} onChange={v => setFormData({ ...formData, otp: v })} onBack={() => setStep("email")} onSubmit={handleOTPSubmit} loading={loading} error={error} />}
              {step === "signup" && <SignupStep key="s" formData={formData} setFormData={setFormData} onBack={() => setStep("email")} onSubmit={handleSignupSubmit} loading={loading} error={error} />}
              {step === "password" && <PasswordStep key="p" password={formData.password} onChange={v => setFormData({ ...formData, password: v })} onBack={() => setStep("email")} onForgotPassword={() => {}} onSubmit={handleLoginSubmit} loading={loading} error={error} />}
            </AnimatePresence>
            <div className="pt-8">
              <LegalLinks terms={legal?.termsAndConditions || ""} privacy={legal?.privacyPolicy || ""} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-white"><Loader2 className="animate-spin text-[#002d4d]" /></div>}>
      <LoginContent />
    </Suspense>
  );
}
