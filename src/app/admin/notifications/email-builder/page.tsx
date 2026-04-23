"use client";

import { useState, useMemo } from "react";
import { Shell } from "@/components/layout/Shell";
import { Button } from "@/components/ui/button";
import { ChevronRight, Mail, Send, Loader2, Sparkles, Monitor, Smartphone, Layout } from "lucide-react";
import { useRouter } from "next/navigation";
import { EmailBlockBuilder } from "@/components/admin/notifications/email-builder/EmailBlockBuilder";
import { TargetAudienceSelector } from "@/components/admin/notifications/TargetAudienceSelector";
import { useFirestore } from "@/firebase";
import { collection, addDoc, getDocs, doc, getDoc, query, where } from "firebase/firestore";
import { sendBroadcastEmail } from "@/app/actions/auth-actions";
import { toast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/**
 * @fileOverview صفحة بناء حملات البريد الإلكتروني الاحترافية v1.1
 * تم إصلاح خطأ استيراد دالة cn وضمان استقرار محاكي العرض المتجاوب.
 */

export default function EmailBuilderPage() {
  const router = useRouter();
  const db = useFirestore();
  
  const [loading, setLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [targetAudience, setTargetAudience] = useState('all');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [subject, setSubject] = useState("");
  const [blocks, setBlocks] = useState<any[]>([
    { id: 'h1', type: 'header', content: { title: 'Namix', fontSize: '24px', color: '#002d4d' } }
  ]);

  const handleSend = async () => {
    if (!subject || blocks.length === 0) {
      toast({ variant: "destructive", title: "بيانات ناقصة", description: "يرجى كتابة عنوان وإضافة محتوى للرسالة." });
      return;
    }

    setLoading(true);
    try {
      // جلب المستهدفين
      const usersCol = collection(db, "users");
      let targetUsers: any[] = [];
      
      if (targetAudience === 'single_user' && selectedUserId) {
        const uSnap = await getDoc(doc(db, "users", selectedUserId));
        if (uSnap.exists()) targetUsers = [{ id: uSnap.id, ...uSnap.data() }];
      } else {
        let q = query(usersCol);
        if (targetAudience === 'active_investors') q = query(usersCol, where("activeInvestmentsTotal", ">", 0));
        if (targetAudience === 'whales') q = query(usersCol, where("totalBalance", ">", 5000));
        if (targetAudience === 'admins') q = query(usersCol, where("role", "==", "admin"));
        
        const snap = await getDocs(q);
        targetUsers = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      }

      // إرسال البريد لكل مستخدم مع حقن المتغيرات
      const ops = targetUsers.map(u => {
        if (!u.email) return Promise.resolve();
        return sendBroadcastEmail(u.email, subject, "", { 
          blocks,
          variables: {
            NAME: u.displayName || "مستثمرنا العزيز",
            BALANCE: u.totalBalance?.toLocaleString() || "0",
            ID: u.namixId || u.id,
            EMAIL: u.email
          }
        });
      });

      await Promise.all(ops);

      await addDoc(collection(db, "broadcast_logs"), {
        title: subject,
        channel: 'email',
        target: targetAudience,
        recipientCount: targetUsers.length,
        createdAt: new Date().toISOString()
      });

      toast({ title: "تم بث الحملة البريدية بنجاح" });
      router.push("/admin/notifications");
    } catch (e) {
      toast({ variant: "destructive", title: "فشل الإرسال" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Shell isAdmin>
      <div className="max-w-[1600px] mx-auto space-y-10 px-6 pt-10 pb-32 font-body text-right" dir="rtl">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-gray-100 pb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-orange-500 font-black text-[10px] uppercase tracking-[0.4em] justify-start">
              <div className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
              Professional Campaign Builder
            </div>
            <h1 className="text-4xl font-black text-[#002d4d] tracking-tight">بناء حملة بريدية احترافية</h1>
            <p className="text-muted-foreground font-bold text-xs">صمم رسالتك البريدية باستخدام نظام الكتل المتجاوب وحقن المتغيرات الذكية.</p>
          </div>
          
          <Button 
            variant="ghost" 
            onClick={() => router.push("/admin/notifications")}
            className="rounded-full h-14 px-8 bg-white border border-gray-100 shadow-sm hover:shadow-md font-black text-[11px] text-[#002d4d] gap-3"
          >
            <ChevronRight className="h-5 w-5" /> العودة للمركز
          </Button>
        </div>

        <div className="grid gap-10 lg:grid-cols-12">
          
          {/* Settings Sidebar */}
          <div className="lg:col-span-4 space-y-8">
             <div className="p-8 bg-white rounded-[48px] border border-gray-100 shadow-sm space-y-10">
                <TargetAudienceSelector 
                  value={targetAudience} 
                  onChange={setTargetAudience} 
                  onUserSelect={setSelectedUserId}
                />

                <div className="space-y-3">
                   <Label className="text-[10px] font-black text-gray-400 uppercase pr-4 tracking-widest">عنوان البريد (Subject)</Label>
                   <Input 
                     value={subject} 
                     onChange={e => setSubject(e.target.value)}
                     className="h-14 rounded-2xl bg-gray-50 border-none font-black px-8 shadow-inner text-right" 
                     placeholder="أدخل عنوان الحملة..."
                   />
                </div>

                <div className="space-y-4 pt-4">
                   <Label className="text-[10px] font-black text-gray-400 uppercase pr-4 tracking-widest">محاكي العرض</Label>
                   <div className="flex items-center gap-2 p-1 bg-gray-50 rounded-2xl border border-gray-100 shadow-inner">
                      <button 
                        onClick={() => setPreviewMode('desktop')}
                        className={cn("flex-1 h-11 rounded-xl flex items-center justify-center gap-2 font-black text-[10px] transition-all", previewMode === 'desktop' ? "bg-white text-blue-600 shadow-sm" : "text-gray-400")}
                      >
                         <Monitor size={14} /> حاسوب
                      </button>
                      <button 
                        onClick={() => setPreviewMode('mobile')}
                        className={cn("flex-1 h-11 rounded-xl flex items-center justify-center gap-2 font-black text-[10px] transition-all", previewMode === 'mobile' ? "bg-white text-blue-600 shadow-sm" : "text-gray-400")}
                      >
                         <Smartphone size={14} /> جوال
                      </button>
                   </div>
                </div>

                <div className="pt-6">
                   <Button 
                     onClick={handleSend}
                     disabled={loading || !subject || (targetAudience === 'single_user' && !selectedUserId)}
                     className="w-full h-20 rounded-full bg-orange-600 hover:bg-orange-700 text-white font-black text-lg shadow-xl transition-all flex items-center justify-center gap-4 group"
                   >
                     {loading ? <Loader2 className="animate-spin" /> : (
                       <>
                          <span>إطلاق الحملة البريدية</span>
                          <Send size={24} className="rotate-180 transition-transform group-hover:-translate-x-2" />
                       </>
                     )}
                   </Button>
                </div>
             </div>

             <div className="p-8 bg-blue-50/50 rounded-[48px] border border-blue-100 flex items-start gap-4">
                <Sparkles size={20} className="text-blue-500 shrink-0 mt-1" />
                <div className="space-y-1">
                   <p className="text-[11px] font-black text-[#002d4d]">محرك الحقن الذكي</p>
                   <p className="text-[10px] font-bold text-blue-800/60 leading-loose">
                      استخدم المتغيرات من القائمة في كتل النصوص؛ سيقوم النظام بتخصيصها آلياً لكل مستلم لزيادة معدل الاستجابة.
                   </p>
                </div>
             </div>
          </div>

          {/* Builder Canvas */}
          <div className="lg:col-span-8">
             <EmailBlockBuilder 
               blocks={blocks} 
               onChange={setBlocks} 
               previewMode={previewMode}
             />
          </div>

        </div>
      </div>
    </Shell>
  );
}
