
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFirestore } from "@/firebase";
import { collection, addDoc, getDocs, doc, getDoc } from "firebase/firestore";
import { 
  Send, 
  Mail, 
  Loader2, 
  Sparkles,
  Info,
  ChevronLeft
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { sendBroadcastEmail } from "@/app/actions/auth-actions";
import { EmailTemplateForge, EmailBlock } from "./EmailTemplateForge";
import { TargetAudienceSelector } from "./TargetAudienceSelector";

interface EmailBroadcastFormProps {
  onSuccess: () => void;
}

export function EmailBroadcastForm({ onSuccess }: EmailBroadcastFormProps) {
  const db = useFirestore();
  const [loading, setLoading] = useState(false);
  const [targetAudience, setTargetAudience] = useState('all');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [headerTitle, setHeaderTitle] = useState("Namix");
  const [blocks, setBlocks] = useState<EmailBlock[]>([
    {
      id: 'initial',
      type: 'text',
      content: 'ابدأ بكتابة محتوى الرسالة هنا...',
      style: { fontSize: '3', color: '#445566', textAlign: 'right' }
    }
  ]);
  const [footer, setFooter] = useState("هذا البريد مرسل إليك بصفتك مستثمراً مسجلاً في منصة ناميكس لإدارة الأصول الرقمية.");

  const handleSend = async () => {
    if (!title || blocks.length === 0) {
      toast({ variant: "destructive", title: "بيانات ناقصة", description: "يرجى كتابة عنوان وإضافة محتوى للرسالة." });
      return;
    }
    setLoading(true);
    try {
      const renderHtml = () => {
        return `
          <div dir="rtl" style="font-family: sans-serif; background-color: #ffffff; padding: 50px; border-radius: 56px; border: 1px solid #f0f0f0; max-width: 600px; margin: 0 auto;">
            <div style="text-align: center; margin-bottom: 60px;">
              <h1 style="color: #002d4d; margin: 0; font-size: 32px; font-weight: 900; font-style: italic;">${headerTitle}</h1>
            </div>
            ${blocks.map(b => {
              if (b.type === 'text') {
                return `<div style="font-size: ${b.style.fontSize}; color: ${b.style.color}; text-align: ${b.style.textAlign}; line-height: 2; margin-bottom: 30px; font-weight: bold;">${b.content}</div>`;
              }
              if (b.type === 'button') {
                return `
                  <div style="text-align: ${b.style.textAlign}; margin: 40px 0;">
                    <a href="${b.style.link || '#'}" style="background-color: ${b.style.backgroundColor}; color: ${b.style.color}; padding: 16px 48px; border-radius: 28px; text-decoration: none; font-weight: 900; font-size: 14px; display: inline-block; box-shadow: 0 15px 35px rgba(0,45,77,0.15);">
                      ${b.content}
                    </a>
                  </div>
                `;
              }
              return '';
            }).join('')}
            <div style="margin-top: 60px; padding-top: 40px; border-top: 1px solid #f8f9fa; text-align: center; color: #94a3b8; font-size: 11px; font-weight: bold;">
              <p>${footer}</p>
              <p style="margin-top: 20px; opacity: 0.4; letter-spacing: 2px;">© 2024 NAMIX UNIVERSAL NETWORK</p>
            </div>
          </div>
        `;
      };

      const usersCol = collection(db, "users");
      let targetUsers: {email?: string}[] = [];
      
      if (targetAudience === 'single_user' && selectedUserId) {
        const uSnap = await getDoc(doc(db, "users", selectedUserId));
        if (uSnap.exists()) targetUsers = [{ email: uSnap.data().email }];
      } else {
        const snap = await getDocs(usersCol);
        targetUsers = snap.docs.map(d => ({ email: d.data().email })).filter(u => !!u.email);
      }

      const htmlContent = renderHtml();
      const ops = targetUsers.map(u => sendBroadcastEmail(u.email!, title, "", { htmlOverride: htmlContent }));
      await Promise.all(ops);
      
      await addDoc(collection(db, "broadcast_logs"), {
        title,
        channel: 'email',
        target: targetAudience,
        recipientCount: targetUsers.length,
        createdAt: new Date().toISOString()
      });

      toast({ title: "اكتمل البث البريدي المخصص بنجاح" });
      onSuccess();
    } catch (e) {
      toast({ variant: "destructive", title: "فشل الإرسال" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      
      <Card className="max-w-5xl mx-auto border-none shadow-2xl rounded-[56px] overflow-hidden bg-white">
        <CardHeader className="bg-orange-500 p-10 text-white relative">
          <div className="absolute top-0 right-0 p-10 opacity-10"><Mail size={140} /></div>
          <CardTitle className="text-2xl font-black flex items-center gap-6 relative z-10">
            <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-xl border border-white/20 shadow-inner">
              <Mail size={28} />
            </div>
            تكوين الحملة البريدية المخصصة
          </CardTitle>
        </CardHeader>
        <CardContent className="p-10 space-y-10 text-right" dir="rtl">
           <div className="grid gap-10 md:grid-cols-2">
              <TargetAudienceSelector 
                value={targetAudience} 
                onChange={setTargetAudience} 
                onUserSelect={(id) => setSelectedUserId(id)}
              />
              <div className="space-y-3">
                 <Label className="text-[10px] font-black text-gray-400 uppercase pr-4 tracking-widest">عنوان الحملة (Subject)</Label>
                 <Input value={title} onChange={e => setTitle(e.target.value)} className="h-14 rounded-2xl bg-gray-50 border-none font-black px-8 shadow-inner" placeholder="أدخل موضوع البريد الإلكتروني..." />
              </div>
           </div>
        </CardContent>
      </Card>

      <div className="max-w-[1200px] mx-auto">
        <EmailTemplateForge 
          headerTitle={headerTitle}
          onHeaderTitleChange={setHeaderTitle}
          blocks={blocks} 
          onChange={setBlocks} 
          footer={footer} 
          onFooterChange={setFooter} 
        />
      </div>

      <div className="flex justify-center pb-20">
        <Button 
          onClick={handleSend} 
          disabled={loading || !title || blocks.length === 0 || (targetAudience === 'single_user' && !selectedUserId)} 
          className="w-full max-w-xl h-20 rounded-full bg-orange-600 hover:bg-orange-700 text-white font-black text-xl shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-4 group"
        >
          {loading ? <Loader2 className="animate-spin h-8 w-8" /> : (
            <>
               <span>بث المحتوى المخصص الآن</span>
               <Send size={24} className="rotate-180 transition-transform group-hover:-translate-x-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
