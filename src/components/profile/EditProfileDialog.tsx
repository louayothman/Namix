
"use client";

import { useState, useEffect, useMemo } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  UserCircle, 
  Calendar, 
  Loader2, 
  ShieldCheck, 
  CheckCircle2,
  Zap,
  Smartphone,
  ChevronLeft
} from "lucide-react";
import { useFirestore } from "@/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: any;
  dbUser: any;
  onSuccess: () => void;
}

type VerificationStep = 'identity' | 'covenant' | 'success';

export function EditProfileDialog({ user, dbUser, onSuccess }: EditProfileDialogProps) {
  const db = useFirestore();
  const [step, setStep] = useState<VerificationStep>('identity');
  const [saving, setSaving] = useState(false);
  
  const [editData, setEditData] = useState({ 
    displayName: "", 
    birthDate: "",
    gender: "male",
    phoneNumber: ""
  });

  useEffect(() => {
    if (dbUser) {
      setEditData({
        displayName: dbUser.displayName || "",
        birthDate: dbUser.birthDate || "",
        gender: dbUser.gender || "male",
        phoneNumber: dbUser.phoneNumber || ""
      });
      setStep('identity');
    }
  }, [dbUser]);

  const handleSave = async () => {
    if (!user?.id) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, "users", user.id), { 
        displayName: editData.displayName,
        birthDate: editData.birthDate,
        gender: editData.gender,
        phoneNumber: editData.phoneNumber,
        isVerified: true,
        updatedAt: new Date().toISOString() 
      });
      
      const updatedLocal = { ...user, displayName: editData.displayName };
      localStorage.setItem("namix_user", JSON.stringify(updatedLocal));
      
      setStep('success');
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const isIdentityComplete = useMemo(() => {
    return !!(
      editData.displayName.length >= 3 && 
      editData.birthDate && 
      editData.phoneNumber && 
      isValidPhoneNumber(editData.phoneNumber)
    );
  }, [editData]);

  return (
    <div className="text-right space-y-8 animate-in fade-in duration-500 font-body" dir="rtl">
        <style jsx global>{`
          .PhoneInput {
            background-color: rgba(249, 250, 251, 0.4);
            border-radius: 24px;
            padding: 4px 18px;
            height: 60px;
            display: flex;
            align-items: center;
            box-shadow: inset 0 2px 4px 0 rgba(0, 45, 77, 0.02);
            border: 1.5px solid transparent;
            transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            gap: 16px;
          }
          .PhoneInput:focus-within {
            border-color: rgba(0, 45, 77, 0.08);
            background-color: white;
            box-shadow: 0 25px 50px -12px rgba(0, 45, 77, 0.08), inset 0 1px 1px 0 rgba(0, 0, 0, 0.01);
            outline: none;
          }
          .PhoneInputInput {
            flex: 1;
            background: transparent !important;
            border: none !important;
            height: 100%;
            font-size: 16px !important;
            color: #002d4d !important;
            outline: none !important;
            text-align: left !important;
            direction: ltr !important;
            font-weight: 800 !important;
            padding-left: 8px !important;
          }
          .PhoneInputCountry {
            margin-left: 14px;
            padding-left: 14px;
            border-left: 1px solid #f1f5f9;
            gap: 12px;
            display: flex;
            align-items: center;
          }
          .PhoneInputCountryIcon {
            box-shadow: 0 4px 10px rgba(0,0,0,0.05);
            border-radius: 4px;
            width: 24px !important;
            height: auto !important;
          }
          .PhoneInputCountrySelectArrow {
            opacity: 0.25;
            margin-left: 6px;
            width: 10px;
            height: 10px;
          }
        `}</style>

        <AnimatePresence mode="wait">
          {step === 'identity' && (
            <motion.div key="id" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black text-gray-400 pr-4 uppercase tracking-widest">الاسم القانوني الكامل</Label>
                <div className="relative">
                  <Input 
                    value={editData.displayName} 
                    onChange={e => setEditData({...editData, displayName: e.target.value})} 
                    className="h-14 rounded-[24px] bg-gray-50/50 border-none px-12 text-sm font-black shadow-inner focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-blue-500/5 transition-all" 
                    placeholder="أدخل اسمك بالكامل..." 
                  />
                  <UserCircle className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-gray-400 pr-4 uppercase tracking-widest">الجنس</Label>
                  <Select value={editData.gender} onValueChange={val => setEditData({...editData, gender: val})}>
                    <SelectTrigger className="h-14 rounded-[24px] bg-gray-50/50 border-none px-6 font-black shadow-inner focus:bg-white transition-all">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-none shadow-2xl">
                      <SelectItem value="male" className="font-bold">ذكر</SelectItem>
                      <SelectItem value="female" className="font-bold">أنثى</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-gray-400 pr-4 uppercase tracking-widest">تاريخ الميلاد</Label>
                  <div className="relative">
                    <Input 
                      type="date" 
                      value={editData.birthDate} 
                      onChange={e => setEditData({...editData, birthDate: e.target.value})} 
                      className="h-14 rounded-[24px] bg-gray-50/50 border-none px-12 text-sm font-black shadow-inner focus-visible:bg-white transition-all" 
                    />
                    <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black text-gray-400 pr-4 uppercase tracking-widest">رقم الهاتف للهوية</Label>
                <div className="relative">
                  <PhoneInput 
                    international 
                    defaultCountry="SA" 
                    value={editData.phoneNumber} 
                    onChange={(val) => setEditData({ ...editData, phoneNumber: val || "" })} 
                  />
                </div>
              </div>

              <div className="pt-4">
                <Button 
                  onClick={() => setStep('covenant')} 
                  disabled={!isIdentityComplete} 
                  className="w-full h-16 rounded-full bg-[#002d4d] hover:bg-[#001d33] text-white font-black text-base shadow-xl active:scale-95 transition-all"
                >
                  متابعة التوثيق
                </Button>
              </div>
            </motion.div>
          )}

          {step === 'covenant' && (
            <motion.div key="cov" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="space-y-10 text-center py-10">
              <div className="h-24 w-24 rounded-[40px] bg-blue-50 text-blue-600 flex items-center justify-center mx-auto border border-blue-100 shadow-inner">
                <Zap className="h-12 w-12 animate-pulse" />
              </div>
              <div className="space-y-4 px-6 text-right">
                 <h4 className="font-black text-2xl text-[#002d4d]">ميثاق النزاهة</h4>
                 <p className="text-sm text-gray-500 font-bold leading-[2.2]">
                   أنت تقر بمسؤوليتك الكاملة عن دقة البيانات المدخلة، وتتعهد بالالتزام ببروتوكولات ناميكس لضمان استمرارية نمو أصولك وسيادتك المالية.
                 </p>
              </div>
              <div className="space-y-4 px-2">
                <Button 
                  onClick={handleSave} 
                  disabled={saving} 
                  className="w-full h-20 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-lg shadow-2xl flex items-center justify-center gap-4 active:scale-95 transition-all"
                >
                  {saving ? <Loader2 className="animate-spin h-6 w-6" /> : (
                    <>
                      <span>توثيق الهوية المعتمد</span>
                      <ShieldCheck className="h-7 w-7" />
                    </>
                  )}
                </Button>
                <button onClick={() => setStep('identity')} className="text-[10px] font-black text-gray-400 uppercase tracking-widest py-4">رجوع لتعديل البيانات</button>
              </div>
            </motion.div>
          )}

          {step === 'success' && (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-10 text-center py-12">
              <div className="relative inline-flex mb-4">
                <div className="h-32 w-32 bg-emerald-50 rounded-[48px] flex items-center justify-center mx-auto shadow-inner border border-emerald-100">
                   <CheckCircle2 size={60} className="text-emerald-500" />
                </div>
                <motion.div 
                  animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }} 
                  transition={{ duration: 2, repeat: Infinity }} 
                  className="absolute inset-0 bg-emerald-400/20 rounded-full blur-3xl -z-10" 
                />
              </div>
              <div className="space-y-3">
                 <h3 className="text-3xl font-black text-[#002d4d]">اكتمل التوثيق</h3>
                 <p className="text-gray-500 font-bold text-sm px-10 leading-loose">تم تحديث وتأمين هويتك الرقمية بنجاح في قاعدة البيانات السيادية لناميكس.</p>
              </div>
              <div className="px-6">
                <Button onClick={onSuccess} className="w-full h-16 rounded-full bg-[#002d4d] text-white font-black text-base shadow-xl active:scale-95 transition-all">العودة للإعدادات</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
    </div>
  );
}
