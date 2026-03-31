
"use client";

import { Shell } from "@/components/layout/Shell";
import { Logo } from "@/components/layout/Logo";
import { Button } from "@/components/ui/button";
import { ChevronRight, ShieldCheck, Target, Zap, Globe, Sparkles, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";

export default function AboutPage() {
  const router = useRouter();
  const db = useFirestore();
  const legalDocRef = useMemoFirebase(() => doc(db, "system_settings", "legal"), [db]);
  const { data: legal, isLoading } = useDoc(legalDocRef);

  return (
    <Shell isPublic>
      <div className="max-w-2xl mx-auto space-y-12 px-6 pt-10 pb-24 font-body">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[#f9a885] font-black text-[9px] uppercase tracking-[0.3em]">
              <Sparkles className="h-3 w-3" />
              Corporate Identity Protocol
            </div>
            <h1 className="text-3xl font-black text-[#002d4d]">من نحن</h1>
            <p className="text-muted-foreground font-bold text-[10px]">تعرف على رؤية ناميكس في عالم الاقتصاد الرقمي.</p>
          </div>
          <Button onClick={() => router.back()} variant="ghost" size="icon" className="rounded-full bg-white shadow-sm h-14 w-14 border border-gray-50 transition-all hover:shadow-md">
            <ChevronRight className="h-6 w-6 text-[#002d4d]" />
          </Button>
        </div>

        <div className="flex flex-col items-center text-center space-y-8 py-10 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-50/20 to-transparent blur-3xl rounded-full" />
          <div className="relative group transition-transform duration-700 hover:scale-110">
            <Logo size="lg" />
          </div>
          <div className="space-y-2 relative z-10">
            <p className="text-xl font-black text-[#002d4d]">
              {isLoading ? "..." : legal?.tagline || "حيث تحقق راحتك المالية"}
            </p>
            <div className="h-1 w-12 bg-[#f9a885] rounded-full mx-auto" />
          </div>
        </div>

        <div className="space-y-10 text-right">
          <div className="bg-white p-10 rounded-[56px] shadow-sm border border-gray-50 space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-[0.02] -rotate-12 pointer-events-none">
               <Globe className="h-40 w-40 text-[#002d4d]" />
            </div>
            
            {isLoading ? (
              <div className="py-20 flex flex-col items-center gap-4 text-center">
                <Loader2 className="h-8 w-8 animate-spin text-gray-200" />
                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">تأمين اتصال الهوية...</p>
              </div>
            ) : (
              <div className="relative z-10">
                <p className="font-bold text-gray-600 leading-[2.2] text-[14px] whitespace-pre-wrap">
                  {legal?.aboutUs || "ناميكس (Namix) هي رائدتكم في الاستثمار الرقمي. نحن نوفر بيئة آمنة للمستثمرين لتنمية رؤوس أموالهم."}
                </p>
              </div>
            )}

            <div className="pt-10 border-t border-gray-50 space-y-6 relative z-10">
              <h3 className="font-black text-xl text-[#002d4d] flex items-center gap-3">
                <div className="h-8 w-8 bg-blue-50 rounded-xl flex items-center justify-center">
                  <ShieldCheck className="h-4 w-4 text-blue-600" />
                </div>
                لماذا ناميكس؟
              </h3>
              
              <div className="grid gap-4">
                {[
                  { icon: ShieldCheck, title: "شفافية مطلقة", desc: "وضوح كامل في كافة العمليات المالية والتقارير." },
                  { icon: Zap, title: "سرعة التنفيذ", desc: "تنفيذ فوري لعمليات السحب والإيداع عبر البلوكشين." },
                  { icon: Target, title: "خطط متنوعة", desc: "حلول استثمارية تناسب كافة فئات المستثمرين." }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-5 p-5 bg-gray-50/50 rounded-[32px] transition-all hover:bg-white hover:shadow-md group">
                    <div className="h-12 w-12 rounded-[20px] bg-white flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                      <item.icon className="h-6 w-6 text-[#f9a885]" />
                    </div>
                    <div>
                      <p className="font-black text-[13px] text-[#002d4d]">{item.title}</p>
                      <p className="text-[10px] text-gray-400 font-bold">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}
