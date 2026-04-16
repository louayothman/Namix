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
    <div className="text-right space-y-6" dir="rtl">
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
            <motion.div key="id" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-5">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-gray-400 pr-3">الاسم القانوني</Label>
                <div className="relative">
                  <Input value={editData.displayName} onChange={e => setEditData({...editData, displayName: e.target.value})} className="h-12 rounded-xl bg-gray-50 border-none px-10 text-xs shadow-inner" placeholder="كما في الهوية..." />
                  <UserCircle className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-gray-400 pr-3">الجنس</Label>
                  <Select value={editData.gender} onValueChange={val => setEditData({...editData, gender: val})}>
                    <SelectTrigger className="h-12 rounded-xl bg-gray-50 border-none px-4 shadow-inner"><SelectValue /></SelectTrigger>
                    <SelectContent className="rounded-2xl">
                      <SelectItem value="male">ذكر</SelectItem>
                      <SelectItem value="female">أنثى</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-gray-400 pr-3">تاريخ الميلاد</Label>
                  <div className="relative">
                    <Input type="date" value={editData.birthDate} onChange={e => setEditData({...editData, birthDate: e.target.value})} className="h-12 rounded-xl bg-gray-50 border-none px-10 text-xs shadow-inner" />
                    <Calendar className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-gray-400 pr-3">رقم الهاتف الدولي</Label>
                <PhoneInput international defaultCountry="SA" value={editData.phoneNumber} onChange={(val) => setEditData({ ...editData, phoneNumber: val || "" })} dir="ltr" />
              </div>

              <Button onClick={() => setStep('covenant')} disabled={!isIdentityComplete} className="w-full h-14 rounded-full bg-[#002d4d] text-white font-bold shadow-xl active:scale-95 group">
                المتابعة للميثاق
                <ChevronLeft className="mr-2 h-5 w-5 group-hover:-translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          )}

          {step === 'covenant' && (
            <motion.div key="cov" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6 text-center">
              <div className="h-20 w-20 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-inner border border-blue-100"><Zap className="h-10 w-10" /></div>
              <div className="space-y-2">
                 <h4 className="font-bold text-xl text-[#002d4d]">إقرار الملاءة</h4>
                 <p className="text-xs text-gray-500 leading-relaxed px-2">بصفتك مستثمرًا، أنت تقر بمسؤوليتك عن دقة البيانات، وتتعهد بالالتزام بميثاق الاستثمار لضمان نمو الأصول وحمايتها.</p>
              </div>
              <Button onClick={handleSave} disabled={saving} className="w-full h-14 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xl flex items-center justify-center gap-2">
                {saving ? <Loader2 className="animate-spin h-5 w-5" /> : <>توثيق وختم الحساب <ShieldCheck className="h-5 w-5" /></>}
              </Button>
            </motion.div>
          )}

          {step === 'success' && (
            <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 text-center">
              <div className="h-20 w-20 bg-emerald-50 rounded-3xl flex items-center justify-center mx-auto shadow-inner border border-emerald-100"><CheckCircle2 className="h-10 w-10 text-emerald-500" /></div>
              <div className="space-y-1">
                 <h3 className="text-2xl font-bold text-[#002d4d]">اكتمل التوثيق!</h3>
                 <p className="text-gray-400 text-xs px-4">تم ختم حسابك بشارة التوثيق المعتمدة.</p>
              </div>
              <Button onClick={onSuccess} className="w-full h-14 rounded-full bg-[#002d4d] text-white font-bold shadow-xl">العودة</Button>
            </motion.div>
          )}
        </AnimatePresence>
    </div>
  );
}