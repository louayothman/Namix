
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, addDoc } from "firebase/firestore";
import { 
  Send, 
  Mail, 
  Loader2, 
  Settings2, 
  Palette, 
  Users,
  Layout
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { sendBroadcastEmail } from "@/app/actions/auth-actions";
import { EmailTemplateForge } from "./EmailTemplateForge";

interface EmailBroadcastFormProps {
  onSuccess: () => void;
}

export function EmailBroadcastForm({ onSuccess }: EmailBroadcastFormProps) {
  const db = useFirestore();
  const [loading, setLoading] = useState(false);
  const [targetType, setTargetType] = useState('all');
  const [formData, setFormData] = useState({ title: "", message: "" });
  
  const [templateOptions, setTemplateOptions] = useState({
    primaryColor: "#002d4d",
    textColor: "#445566",
    buttonText: "",
    buttonLink: "",
    footerText: "هذا البريد مرسل إليك بصفتك مستثمراً مسجلاً في منصة ناميكس."
  });

  const usersQuery = useMemoFirebase(() => collection(db, "users"), [db]);
  const { data: users } = useCollection(usersQuery);

  const handleSend = async () => {
    if (!formData.title || !formData.message) return;
    setLoading(true);
    try {
      const targetList = (users || []).filter(u => !!u.email);
      
      const ops = targetList.map(u => sendBroadcastEmail(u.email, formData.title, formData.message, templateOptions));
      await Promise.all(ops);
      
      await addDoc(collection(db, "broadcast_logs"), {
        title: formData.title,
        message: formData.message,
        channel: 'email',
        recipientCount: targetList.length,
        templateOptions,
        createdAt: new Date().toISOString()
      });

      toast({ title: "تم بث الرسائل البريدية بنجاح" });
      onSuccess();
    } catch (e) {
      toast({ variant: "destructive", title: "فشل الإرسال" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-10 lg:grid-cols-12 text-right" dir="rtl">
      <div className="lg:col-span-7 space-y-8">
        <Card className="border-none shadow-xl rounded-[56px] overflow-hidden bg-white">
          <CardHeader className="bg-orange-500 p-10 text-white relative">
            <div className="absolute top-0 right-0 p-8 opacity-10"><Mail size={120} /></div>
            <CardTitle className="text-2xl font-black flex items-center gap-4 relative z-10">
              <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md shadow-inner">
                <Mail size={28} />
              </div>
              صياغة الحملة البريدية المؤسساتية
            </CardTitle>
          </CardHeader>
          <CardContent className="p-10 space-y-8">
            <div className="space-y-3">
              <Label className="text-[10px] font-black text-gray-400 uppercase pr-4">الفئة المستهدفة</Label>
              <Select value={targetType} onValueChange={setTargetType}>
                <SelectTrigger className="h-14 rounded-2xl bg-gray-50 border-none font-black text-xs px-8 shadow-inner"><SelectValue /></SelectTrigger>
                <SelectContent className="rounded-2xl border-none shadow-2xl" dir="rtl">
                  <SelectItem value="all" className="font-bold text-right py-3">جميع المسجلين (Email Verified)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
               <Label className="text-[10px] font-black text-gray-400 uppercase pr-4">عنوان الرسالة الرئيسي</Label>
               <Input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="h-14 rounded-2xl bg-gray-50 border-none font-black px-8 shadow-inner" placeholder="مثال: إشعار تحديث بيانات المحفظة" />
            </div>

            <div className="space-y-3">
               <Label className="text-[10px] font-black text-gray-400 uppercase pr-4">محتوى البريد الإلكتروني</Label>
               <Textarea value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} className="min-h-[220px] rounded-[32px] bg-gray-50 border-none font-bold text-sm p-8 leading-loose shadow-inner" placeholder="اكتب تفاصيل الرسالة بأسلوب رسمي..." />
            </div>

            <Button onClick={handleSend} disabled={loading || !formData.title} className="w-full h-20 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-black text-lg shadow-xl transition-all">
              {loading ? <Loader2 className="animate-spin" /> : <div className="flex items-center gap-3"><span>إطلاق الحملة البريدية</span> <Send size={24} className="rotate-180" /></div>}
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-5">
        <EmailTemplateForge 
          options={templateOptions}
          onChange={setTemplateOptions}
        />
      </div>
    </div>
  );
}
