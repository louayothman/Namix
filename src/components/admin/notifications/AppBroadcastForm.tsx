
"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, addDoc } from "firebase/firestore";
import { 
  Send, 
  Bell, 
  Loader2, 
  Info, 
  Users, 
  User, 
  Target, 
  Sparkles,
  MessageSquare
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface AppBroadcastFormProps {
  onSuccess: () => void;
}

export function AppBroadcastForm({ onSuccess }: AppBroadcastFormProps) {
  const db = useFirestore();
  const [loading, setLoading] = useState(false);
  const [targetType, setTargetType] = useState('all');
  const [formData, setFormData] = useState({ title: "", message: "", type: "info" });

  const usersQuery = useMemoFirebase(() => collection(db, "users"), [db]);
  const { data: users } = useCollection(usersQuery);

  const handleSend = async () => {
    if (!formData.title || !formData.message) return;
    setLoading(true);
    try {
      const targetList = targetType === 'all' ? (users || []) : [];
      
      const ops = targetList.map(u => addDoc(collection(db, "notifications"), {
        userId: u.id,
        title: formData.title,
        message: formData.message,
        type: formData.type,
        isRead: false,
        createdAt: new Date().toISOString()
      }));

      await Promise.all(ops);
      
      await addDoc(collection(db, "broadcast_logs"), {
        title: formData.title,
        message: formData.message,
        channel: 'app',
        recipientCount: targetList.length,
        createdAt: new Date().toISOString()
      });

      toast({ title: "تم الإرسال بنجاح" });
      onSuccess();
    } catch (e) {
      toast({ variant: "destructive", title: "فشل الإرسال" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-3xl mx-auto border-none shadow-xl rounded-[56px] overflow-hidden bg-white">
      <CardHeader className="bg-blue-600 p-10 text-white relative">
        <div className="absolute top-0 right-0 p-8 opacity-10"><Bell size={120} /></div>
        <CardTitle className="text-2xl font-black flex items-center gap-4 relative z-10">
          <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md shadow-inner">
            <Bell size={28} />
          </div>
          إعداد تنبيهات التطبيق اللحظية
        </CardTitle>
      </CardHeader>
      <CardContent className="p-10 space-y-8 text-right" dir="rtl">
        <div className="grid gap-8 md:grid-cols-2">
           <div className="space-y-3">
             <Label className="text-[10px] font-black text-gray-400 uppercase pr-4">فئة المستلمين</Label>
             <Select value={targetType} onValueChange={setTargetType}>
                <SelectTrigger className="h-14 rounded-2xl bg-gray-50 border-none font-black text-xs px-6 shadow-inner"><SelectValue /></SelectTrigger>
                <SelectContent className="rounded-2xl border-none shadow-2xl" dir="rtl">
                   <SelectItem value="all" className="font-bold text-right py-3"><div className="flex items-center gap-3"><Users size={14} /> جميع المستثمرين</div></SelectItem>
                </SelectContent>
             </Select>
           </div>
           <div className="space-y-3">
             <Label className="text-[10px] font-black text-gray-400 uppercase pr-4">نوع التنبيه</Label>
             <Select value={formData.type} onValueChange={v => setFormData({...formData, type: v})}>
                <SelectTrigger className="h-14 rounded-2xl bg-gray-50 border-none font-black text-xs px-6 shadow-inner"><SelectValue /></SelectTrigger>
                <SelectContent className="rounded-2xl border-none shadow-2xl" dir="rtl">
                   <SelectItem value="info" className="font-bold text-right py-3">إرشادي عام</SelectItem>
                   <SelectItem value="success" className="font-bold text-right py-3">إيجابي / نجاح</SelectItem>
                   <SelectItem value="warning" className="font-bold text-right py-3">تنبيه / تحذير</SelectItem>
                </SelectContent>
             </Select>
           </div>
        </div>

        <div className="space-y-3">
           <Label className="text-[10px] font-black text-gray-400 uppercase pr-4">عنوان التنبيه</Label>
           <Input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="h-14 rounded-2xl bg-gray-50 border-none font-black px-8 shadow-inner" placeholder="مثال: تحديث أنظمة السحب" />
        </div>

        <div className="space-y-3">
           <Label className="text-[10px] font-black text-gray-400 uppercase pr-4">نص الرسالة</Label>
           <Textarea value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} className="min-h-[160px] rounded-[32px] bg-gray-50 border-none font-bold text-sm p-8 leading-loose shadow-inner" placeholder="اكتب محتوى التنبيه هنا..." />
        </div>

        <Button onClick={handleSend} disabled={loading || !formData.title} className="w-full h-18 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-black text-lg shadow-xl transition-all">
          {loading ? <Loader2 className="animate-spin" /> : <div className="flex items-center gap-3"><span>إرسال التنبيهات الآن</span> <Send size={20} className="rotate-180" /></div>}
        </Button>
      </CardContent>
    </Card>
  );
}
