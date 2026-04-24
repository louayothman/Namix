
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useFirestore } from "@/firebase";
import { collection, addDoc, query, getDocs, where, doc, getDoc } from "firebase/firestore";
import { Send, Smartphone, Loader2, Target, Sparkles, ShieldCheck } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { TargetAudienceSelector } from "./TargetAudienceSelector";

interface PushBroadcastFormProps {
  onSuccess: () => void;
}

export function PushBroadcastForm({ onSuccess }: PushBroadcastFormProps) {
  const db = useFirestore();
  const [loading, setLoading] = useState(false);
  const [targetAudience, setTargetAudience] = useState('all');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ title: "", message: "" });

  const handleSend = async () => {
    if (!formData.title || !formData.message) return;
    setLoading(true);
    try {
      let targetUsers: {id: string}[] = [];
      const usersCol = collection(db, "users");
      
      if (targetAudience === 'single_user' && selectedUserId) {
        targetUsers = [{ id: selectedUserId }];
      } else {
        const snap = await getDocs(usersCol);
        targetUsers = snap.docs.map(d => ({ id: d.id }));
      }
      
      const ops = targetUsers.map(u => addDoc(collection(db, "notifications"), {
        userId: u.id,
        title: formData.title,
        message: formData.message,
        type: "info",
        isRead: false,
        createdAt: new Date().toISOString()
      }));

      await Promise.all(ops);
      
      await addDoc(collection(db, "broadcast_logs"), {
        title: formData.title,
        message: formData.message,
        channel: 'push',
        target: targetAudience,
        recipientCount: targetUsers.length,
        createdAt: new Date().toISOString()
      });

      toast({ title: "تم إطلاق بث التنبيهات الخارجية بنجاح" });
      onSuccess();
    } catch (e) {
      toast({ variant: "destructive", title: "فشل البث" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-4xl mx-auto border-none shadow-2xl rounded-[64px] overflow-hidden bg-white">
      <CardHeader className="bg-emerald-600 p-12 text-white relative">
        <div className="absolute top-0 right-0 p-10 opacity-10"><Smartphone size={140} /></div>
        <CardTitle className="text-3xl font-black flex items-center gap-6 relative z-10">
          <div className="h-16 w-16 rounded-[22px] bg-white/10 flex items-center justify-center backdrop-blur-xl border border-white/20 shadow-inner">
            <Smartphone size={32} />
          </div>
          محطة بث التنبيهات الخارجية (Push)
        </CardTitle>
      </CardHeader>
      <CardContent className="p-12 space-y-10 text-right" dir="rtl">
        
        <TargetAudienceSelector 
          value={targetAudience}
          onChange={setTargetAudience}
          onUserSelect={(id) => setSelectedUserId(id)}
        />

        <div className="space-y-4">
           <Label className="text-[10px] font-black text-gray-400 uppercase pr-6 tracking-widest">عنوان الرسالة القفزية</Label>
           <Input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="h-16 rounded-[28px] bg-gray-50 border-none font-black px-10 text-lg shadow-inner" placeholder="أدخل العنوان المقتضب..." />
        </div>

        <div className="space-y-4">
           <Label className="text-[10px] font-black text-gray-400 uppercase pr-6 tracking-widest">نص التنبيه</Label>
           <Textarea value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} className="min-h-[160px] rounded-[44px] bg-gray-50 border-none font-bold text-base p-10 leading-loose shadow-inner" placeholder="اكتب محتوى التنبيه المختصر هنا..." />
        </div>

        <div className="p-8 bg-blue-50/50 rounded-[40px] border border-blue-100 flex items-start gap-6">
           <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center shadow-sm shrink-0">
              <ShieldCheck size={24} className="text-blue-600" />
           </div>
           <p className="text-[11px] font-bold text-blue-800/60 leading-[2.2]">
             ستظهر هذه الرسالة مباشرة على شاشات هواتف وأجهزة المستثمرين المشتركين في الخدمة. يرجى التأكد من صياغة الرسالة بأسلوب واضح ومهني لزيادة معدل الاستجابة.
           </p>
        </div>

        <Button onClick={handleSend} disabled={loading || !formData.title || (targetAudience === 'single_user' && !selectedUserId)} className="w-full h-20 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xl shadow-xl transition-all">
          {loading ? <Loader2 className="animate-spin" /> : <div className="flex items-center gap-4"><span>إطلاق التنبيهات المباشرة</span> <Send size={24} className="rotate-180" /></div>}
        </Button>
      </CardContent>
    </Card>
  );
}
