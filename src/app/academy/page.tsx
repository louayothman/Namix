
"use client";

import React, { useState } from "react";
import { Shell } from "@/components/layout/Shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  ChevronRight, 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  TrendingUp, 
  BrainCircuit, 
  Globe, 
  Lock,
  PlayCircle,
  Lightbulb,
  ArrowRightLeft,
  Loader2,
  ChevronLeft,
  ShieldAlert,
  Repeat,
  Coins,
  DollarSign,
  Fingerprint,
  Trophy,
  EyeOff,
  Cpu,
  Radar,
  Share2,
  Layers,
  Brain,
  Code,
  Target,
  Gem,
  Award
} from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

const ICON_MAP: Record<string, any> = {
  BrainCircuit, ShieldCheck, Zap, TrendingUp, Globe, Lock, PlayCircle, Lightbulb, 
  ArrowRightLeft, ShieldAlert, Repeat, Coins, DollarSign, Fingerprint, Trophy, 
  EyeOff, Cpu, Radar, Share2, Layers, Brain, BookOpen, Code, Target, Gem, Award
};

export default function AcademyPage() {
  const router = useRouter();
  const db = useFirestore();
  const academyRef = useMemoFirebase(() => doc(db, "system_settings", "academy"), [db]);
  const { data: academy, isLoading } = useDoc(academyRef);
  const [selectedLesson, setSelectedLesson] = useState<any>(null);
  const lessons = academy?.lessons || [];

  return (
    <Shell>
      <div className="max-w-2xl mx-auto space-y-8 px-6 pt-8 pb-32 font-body text-right" dir="rtl">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 text-blue-500 font-black text-[8px] uppercase tracking-[0.3em]">
              <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
              Namix Insight Academy
            </div>
            <h1 className="text-2xl font-black text-[#002d4d]">أكاديمية الذكاء المالي</h1>
            <p className="text-muted-foreground font-bold text-[9px]">اتقن مهارات الاستثمار الرقمي وفهم بروتوكولات السيادة المالية.</p>
          </div>
          <Button onClick={() => router.back()} variant="ghost" size="icon" className="rounded-full bg-white shadow-sm h-12 w-12 border border-gray-50 active:scale-95 transition-all hover:shadow-md">
            <ChevronRight className="h-5 w-5 text-[#002d4d]" />
          </Button>
        </div>

        <Card className="border-none shadow-xl rounded-[40px] bg-[#002d4d] text-white overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-8 opacity-[0.03] -rotate-12 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
             <BookOpen className="h-48 w-48" />
          </div>
          <CardContent className="p-8 space-y-6 relative z-10">
            <div className="flex justify-between items-start">
               <div className="h-12 w-12 rounded-[18px] bg-white/10 flex items-center justify-center border border-white/20 backdrop-blur-xl shadow-inner">
                  <BrainCircuit className="h-6 w-6 text-[#f9a885]" />
               </div>
               <Badge className="bg-blue-500/20 text-blue-300 border-none font-black text-[7px] px-3 py-1 rounded-full tracking-widest uppercase">
                  Education Protocol v2.0
               </Badge>
            </div>
            <div className="space-y-2">
               <h2 className="text-xl font-black leading-tight">المعرفة هي القوة السيادية</h2>
               <p className="text-[11px] text-blue-100/60 leading-relaxed font-bold max-w-[90%]">المستثمر الناجح هو المستثمر الواعي. اكتشف كيف تولد أموالك أرباحاً استثنائية داخل نظام ناميكس المتطور.</p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
           <div className="grid gap-4">
              {isLoading ? (
                <div className="py-20 text-center flex flex-col items-center gap-3">
                   <Loader2 className="h-10 w-10 animate-spin text-gray-200" />
                   <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest animate-pulse">جاري جرد بروتوكولات المعرفة...</p>
                </div>
              ) : lessons.length > 0 ? (
                lessons.map((lesson: any, i: number) => {
                  const Icon = ICON_MAP[lesson.icon] || BookOpen;
                  return (
                    <Card key={i} className="border-none shadow-sm rounded-[32px] overflow-hidden bg-white transition-all duration-500 hover:shadow-lg group border border-gray-50/50">
                      <CardContent className="p-5 flex items-start gap-5">
                        <div className={cn("h-14 w-14 rounded-[20px] flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform duration-700", lesson.bg || 'bg-blue-50', lesson.color || 'text-blue-500')}>
                          <Icon className="h-7 w-7" />
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex justify-between items-start">
                             <h3 className="font-black text-base text-[#002d4d] group-hover:text-blue-600 transition-colors">{lesson.title}</h3>
                             <Badge className="bg-gray-50 text-gray-400 border-none text-[6px] font-black px-1.5 py-0.5 rounded-md uppercase">MODULE {i + 1}</Badge>
                          </div>
                          <p className="text-[11px] text-gray-400 leading-[1.6] font-bold line-clamp-2">{lesson.desc}</p>
                          <div className="pt-2 flex justify-start">
                             <Button onClick={() => setSelectedLesson(lesson)} variant="ghost" className="h-9 rounded-xl bg-gray-50 text-[10px] font-black text-blue-600 group-hover:bg-[#002d4d] group-hover:text-white transition-all px-6 shadow-sm active:scale-95">
                                <PlayCircle className="ml-1.5 h-3.5 w-3.5" /> ابدأ الدرس
                             </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              ) : (
                <div className="py-20 text-center bg-white rounded-[40px] border-2 border-dashed border-gray-100 flex flex-col items-center gap-4 opacity-40">
                   <BookOpen className="h-8 w-8 text-gray-200" />
                   <p className="text-[9px] font-bold text-gray-400">لم يتم إدراج دروس تعليمية في هذه الدورة.</p>
                </div>
              )}
           </div>
        </div>
      </div>

      <Dialog open={!!selectedLesson} onOpenChange={(open) => !open && setSelectedLesson(null)}>
        <DialogContent className="rounded-[40px] border-none shadow-2xl p-0 max-w-[480px] overflow-hidden font-body text-right flex flex-col max-h-[85vh] outline-none" dir="rtl">
          <div className={cn("p-8 text-white relative shrink-0 overflow-hidden", selectedLesson?.bg?.replace('bg-', 'bg-opacity-100 bg-') || 'bg-[#002d4d]')}>
             <div className="flex items-center gap-6 relative z-10">
                <div className="h-14 w-14 rounded-[20px] bg-white/10 flex items-center justify-center backdrop-blur-2xl border border-white/20 shadow-inner">
                   {selectedLesson && ICON_MAP[selectedLesson.icon] && React.createElement(ICON_MAP[selectedLesson.icon], { className: "h-7 w-7 text-white" })}
                </div>
                <div className="space-y-0.5">
                   <p className="text-[8px] font-black text-white/40 uppercase tracking-[0.4em]">Educational Protocol</p>
                   <DialogTitle className="text-xl font-black text-white tracking-tight">{selectedLesson?.title}</DialogTitle>
                </div>
             </div>
          </div>
          <div className="flex-1 overflow-y-auto p-8 bg-white scrollbar-none">
             <div className="p-8 bg-gray-50/50 rounded-[32px] border border-gray-100 shadow-inner relative overflow-hidden">
                <p className="text-gray-600 font-bold leading-[2.2] text-[13px] whitespace-pre-wrap">{selectedLesson?.content}</p>
             </div>
          </div>
          <div className="p-8 bg-gray-50/80 backdrop-blur-md border-t border-gray-100 flex justify-center shrink-0">
             <Button onClick={() => setSelectedLesson(null)} className="px-12 h-14 rounded-full bg-[#002d4d] text-white font-black text-sm shadow-xl active:scale-95 group">
                إتمام الوحدة والعودة
                <ChevronLeft className="mr-2 h-5 w-5 group-hover:-translate-x-1 transition-transform" />
             </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Shell>
  );
}
