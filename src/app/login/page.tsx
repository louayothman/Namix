
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
  addDoc,
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

/**
 * SovereignBackground - بروتوكول الغمر المعتدل v115.0
 * تم ضبط وضعية شبكة النقاط في الخلفية لتكون مرتفعة قليلاً وبحجم متناسق.
 */
const SovereignBackground = () => (
  <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none bg-white">
    {/* بصمة الهوية الخلفية - شبكة النقاط الضخمة والشفافة */}
    <div className="absolute left-[10%] top-[35%] -translate-y-1/2 opacity-[0.03] rotate-[-12deg] select-none">
       <div className="grid grid-cols-2 gap-6 md:gap-10">
          <div className="h-16 w-16 md:h-24 md:w-24 rounded-full bg-[#002d4d]" />
          <div className="h-16 w-16 md:h-24 md:w-24 rounded-full bg-[#f9a885]" />
          <div className="h-16 w-16 md:h-24 md:w-24 rounded-full bg-[#f9a885]" />
          <div className="h-16 w-16 md:h-24 md:w-24 rounded-full bg-[#002d4d]" />
       </div>
    </div>

    {/* السديم اللوني المتحرك - نبض النظام البطيء */}
    <motion.div 
      animate={{ 
        scale: [1, 1.1, 1],
        opacity: [0.04, 0.08, 0.04],
      }}
      transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      className="absolute top-[-10%] right-[-5%] w-[70%] h-[70%] bg-blue-500/10 rounded-full blur-[120px]" 
    />
    <motion.div 
      animate={{ 
        scale: [1.05, 1, 1.05],
        opacity: [0.02, 0.05, 0.02],
      }}
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
  
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    gender: "male",
    invitationCode: "",
  });
  const [existingUser, setExistingUser] = useState<any>(null);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const db = useFirestore();

  const legalDocRef = useMemoFirebase(() => doc(db, "system_settings", "legal"), [db]);
  const { data: legal } = useDoc(legalDocRef);

  useEffect(() => {
    const refFromUrl = searchParams.get("ref");
    if (refFromUrl) {
      setFormData(prev => ({ ...prev, invitationCode: refFromUrl }));
    }
    
    const stepParam = searchParams.get("step");
    if (stepParam === "signup") setStep("email"); // Logic handled in handleEmailSubmit
  }, [searchParams]);

  useEffect(() => {
    const userSession = localStorage.getItem("namix_user");
    if (userSession) {
      const parsed = JSON.parse(userSession);
      if (parsed.role === 'admin') router.replace("/admin");
      else router.replace("/dashboard");
    }
  }, [router]);

  const generateReferralCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = 'NX-';
    for (let i = 0; i < 5; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
    return code;
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!formData.email || !formData.email.includes("@")) {
      setError("يرجى إدخال بريد إلكتروني صحيح.");
      return;
    }

    setLoading(true);
    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", formData.email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        setExistingUser({ ...userData, id: querySnapshot.docs[0].id });
        setStep("password");
        setLoading(false);
        return;
      }

      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 5);

      await setDoc(doc(db, "otp_verifications", formData.email), {
        code: otpCode,
        expiresAt: expiresAt.toISOString(),
      });

      const res = await sendOTPEmail(formData.email, otpCode);
      if (res.success) setStep("otp");
      else setError("فشل في إرسال البريد الإلكتروني.");
    } catch (e: any) {
      setError("حدث خطأ في الاتصال بقاعدة البيانات.");
    } finally {
      setLoading(false);
    }
  };

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const otpRef = doc(db, "otp_verifications", formData.email);
      const snap = await getDoc(otpRef);
      if (!snap.exists() || snap.data().code !== formData.otp) {
        setError("رمز التحقق غير صحيح.");
        setLoading(false);
        return;
      }
      await deleteDoc(otpRef);
      setStep("signup");
    } catch (e: any) {
      setError("فشل التحقق من الرمز.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (formData.password !== formData.confirmPassword) {
      setError("كلمات المرور غير متطابقة.");
      return;
    }
    if (formData.password.length < 6) {
      setError("كلمة المرور يجب أن تكون 6 أحرف على الأقل.");
      return;
    }

    setLoading(true);
    try {
      const onboardSnap = await getDoc(doc(db, "system_settings", "onboarding"));
      const trialAmount = onboardSnap.exists() ? (onboardSnap.data().trialCreditAmount || 0) : 0;

      let referrerId = null;
      if (formData.invitationCode) {
        const rq = query(collection(db, "users"), where("referralCode", "==", formData.invitationCode));
        const rSnap = await getDocs(rq);
        if (!rSnap.empty) referrerId = rSnap.docs[0].id;
      }

      const userId = Math.floor(1000000 + Math.random() * 9000000).toString();
      const newUser = {
        id: userId,
        email: formData.email,
        displayName: formData.fullName,
        gender: formData.gender,
        role: "user",
        password: formData.password,
        referralCode: generateReferralCode(),
        referredBy: referrerId,
        totalBalance: trialAmount,
        activeInvestmentsTotal: 0,
        totalProfits: 0,
        referralEarnings: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastActive: new Date().toISOString()
      };

      await setDoc(doc(db, "users", userId), newUser);
      
      await addDoc(collection(db, "notifications"), {
        userId: userId,
        title: "أهلاً بك في ناميكس! 🚀",
        message: `تم إنشاء حسابك بنجاح. لقد حصلت على $${trialAmount} كهدية ترحيبية لبدء رحلتك.`,
        type: "success",
        isRead: false,
        createdAt: new Date().toISOString()
      });

      localStorage.setItem("namix_user", JSON.stringify(newUser));
      window.location.href = "/dashboard";
    } catch (e: any) {
      setError("فشل بروتوكول إنشاء الحساب.");
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (formData.password !== existingUser.password) {
      setError("كلمة المرور غير صالحة.");
      return;
    }
    await updateDoc(doc(db, "users", existingUser.id), {
      lastActive: new Date().toISOString()
    });
    localStorage.setItem("namix_user", JSON.stringify(existingUser));
    window.location.href = existingUser.role === 'admin' ? "/admin" : "/dashboard";
  };

  return (
    <div className="min-h-screen relative flex bg-white overflow-hidden font-body" dir="rtl">
      
      <SovereignBackground />

      <div className="relative flex-1 flex flex-col items-center justify-start py-20 px-8 z-10 overflow-y-auto scrollbar-none bg-transparent">
        <div className="w-full max-w-[340px] flex flex-col gap-y-24 animate-in fade-in slide-in-from-bottom-10 duration-1000">
          
          {/* الكتلة التعريفية العليا */}
          <div className="flex flex-col items-center gap-10 text-center relative">
            <Logo size="md" className="scale-[1.25] transition-transform duration-1000 relative z-10" />
            <div className="space-y-2.5 relative z-10">
               <h2 className="text-2xl font-black text-[#002d4d] tracking-none">مرحباً مجدداً</h2>
               <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] opacity-60">Welcome Back</p>
            </div>
          </div>

          {/* محرك نموذج الدخول */}
          <div className="w-full space-y-12 relative z-10">
            <AnimatePresence mode="wait">
              {step === "email" && (
                <EmailStep 
                  key="email-flow"
                  email={formData.email} 
                  onChange={(val) => { setFormData({ ...formData, email: val }); setError(null); }}
                  onSubmit={handleEmailSubmit}
                  loading={loading}
                  error={error}
                />
              )}

              {step === "otp" && (
                <OTPStep 
                  key="otp-flow"
                  otp={formData.otp}
                  onChange={(val) => { setFormData({ ...formData, otp: val }); setError(null); }}
                  onBack={() => setStep("email")}
                  onSubmit={handleOTPSubmit}
                  loading={loading}
                  error={error}
                />
              )}

              {step === "signup" && (
                <SignupStep 
                  key="signup-flow"
                  formData={formData}
                  setFormData={setFormData}
                  onBack={() => setStep("email")}
                  onSubmit={handleSignupSubmit}
                  loading={loading}
                  error={error}
                />
              )}

              {step === "password" && (
                <PasswordStep 
                  key="password-flow"
                  password={formData.password}
                  onChange={(val) => { setFormData({ ...formData, password: val }); setError(null); }}
                  onBack={() => setStep("email")}
                  onForgotPassword={() => {}}
                  onSubmit={handleLoginSubmit}
                  loading={loading}
                  error={error}
                />
              )}
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
