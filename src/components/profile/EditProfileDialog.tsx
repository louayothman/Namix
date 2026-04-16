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
  ChevronLeft, 
  CheckCircle2,
  Zap
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

export function EditProfileDialog({ open, onOpenChange, user, dbUser, onSuccess }: EditProfileDialogProps) {
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
    if (dbUser && open) {
      setEditData({
        displayName: dbUser.displayName || "",
        birthDate: dbUser.birthDate || "",
        gender: dbUser.gender || "male",
        phoneNumber: dbUser.phoneNumber || ""
      });
      setStep('identity');
    }
  }, [dbUser, open]);

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
    <div className="text-right space-y-6 animate-in fade-in duration-700" dir="rtl">
        <style jsx global>{`
          .PhoneInput {
            display: flex;
            align-items: center;
            gap: 12px;
            background: #f9fafb;
            padding: 4px 16px;
            border-radius: 20px;
          }
          .PhoneInputInput {
            flex: 1;
            background: transparent;
            border: none;
            height: 48px;
            font-size: 14px;
            color: #002d4d;
            outline: none;
            text-align: left;
            direction: ltr;
          }
        `}</style>

        <AnimatePresence mode="wait">
          {step === 'identity' && (
            <motion.div key="id" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black text-gray-400 pr-4 uppercase tracking-normal">الاسم القانوني المعتمد</Label>
                <div className="relative">
                  <Input value={editData.displayName} onChange={e => setEditData({...editData, displayName: e.target.value})} className="h-14 rounded-2xl bg-gray-50 border-none px-12 text-sm font-black shadow-inner" placeholder="كما في الهوية..." />
                  <UserCircle className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-gray-400 pr-4 uppercase tracking-normal">الجنس</Label>
                  <Select value={editData.gender} onValueChange={val => setEditData({...editData, gender: val})}>
                    <SelectTrigger className="h-14 rounded-2xl bg-gray-50 border-none px-6 font-black shadow-inner"><SelectValue /></SelectTrigger>
                    <SelectContent className="rounded-2xl border-none shadow-2xl">
                      <SelectItem value="male" className="font-bold">ذكر</SelectItem>
                      <SelectItem value="female" className="font-bold">أنثى</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-gray-400 pr-4 uppercase tracking-normal">تاريخ الميلاد</Label>
                  <div className="relative">
                    <Input type="date" value={editData.birthDate} onChange={e => setEditData({...editData, birthDate: e.target.value})} className="h-14 rounded-2xl bg-gray-50 border-none px-12 text-sm font-black shadow-inner" />
                    <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black text-gray-400 pr-4 uppercase tracking-normal">رقم الهاتف الدولي</Label>
                <PhoneInput international defaultCountry="SA" value={editData.phoneNumber} onChange={(val) => setEditData({ ...editData, phoneNumber: val || "" })} dir="ltr" />
              </div>

              <Button onClick={() => setStep('covenant')} disabled={!isIdentityComplete} className="w-full h-16 rounded-full bg-[#002d4d] text-white font-black shadow-2xl active:scale-95 group transition-all">
                المتابعة لميثاق التوثيق
                <ChevronLeft className="mr-2 h-5 w-5 group-hover:-translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          )}

          {step === 'covenant' && (
            <motion.div key="cov" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="space-y-8 text-center py-10">
              <div className="h-24 w-24 rounded-[32px] bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-inner border border-blue-100 animate-pulse"><Zap className="h-12 w-12" /></div>
              <div className="space-y-3 px-4">
                 <h4 className="font-black text-2xl text-[#002d4d] tracking-normal">إقرار الملاءة المالية</h4>
                 <p className="text-xs text-gray-500 font-bold leading-relaxed px-2 tracking-normal">أنت تقر بمسؤوليتك الكاملة عن دقة البيانات المقدمة، وتتعهد بالالتزام بميثاق الاستثمار لضمان نمو الأصول وحمايتها.</p>
              </div>
              <Button onClick={handleSave} disabled={saving} className="w-full h-18 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-lg shadow-xl flex items-center justify-center gap-3 transition-all active:scale-95">
                {saving ? <Loader2 className="animate-spin h-6 w-6" /> : <>توثيق وختم الحساب <ShieldCheck className="h-6 w-6" /></>}
              </Button>
            </motion.div>
          )}

          {step === 'success' && (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8 text-center py-12">
              <div className="h-28 w-28 bg-emerald-50 rounded-[40px] flex items-center justify-center mx-auto shadow-inner border border-emerald-100 relative">
                 <CheckCircle2 className="h-14 w-14 text-emerald-500" />
                 <motion.div animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }} transition={{ duration: 2, repeat: Infinity }} className="absolute inset-0 bg-emerald-400/20 rounded-[40px] blur-2xl -z-10" />
              </div>
              <div className="space-y-2">
                 <h3 className="text-3xl font-black text-[#002d4d] tracking-normal">اكتمل التوثيق السيادي</h3>
                 <p className="text-gray-400 font-bold text-xs px-6 tracking-normal">تم ختم حسابك بشارة التوثيق المعتمدة في قاعدة البيانات.</p>
              </div>
              <Button onClick={onSuccess} className="w-full h-16 rounded-full bg-[#002d4d] text-white font-black shadow-xl active:scale-95">العودة للإعدادات</Button>
            </motion.div>
          )}
        </AnimatePresence>
    </div>
  );
}
